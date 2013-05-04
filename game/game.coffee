# Here is all our socket machimery.
# We have server events:
# - join - user joins the game
# - state - user updates his position
# - disconnect - user disconnects
# And we have client events, generated by server:
# - joined - tell him about success join and which side he will be playing (left or right for now)
# - busy - room is full of players
# - state - update my and others positions
# - quit - some user quitted

GameCore = require './game.core'
cookie = require 'cookie'
timers = require 'timers'

module.exports = class Game extends GameCore

  constructor: ->
    super()

    @gamers = {}
    initPos = @canvasHeight / 2 - 40
    @gs = [{pos: initPos - @racketHeight, dir: @dirIdle, updates: [], lastSeq: -1},
           {pos: initPos + @racketHeight, dir: @dirIdle, updates: [], lastSeq: -1}]
    @ballResetOffset = 50
    @scores = [0, 0]
    @count = 0
    @inDaLoop = false

  addGamer: (sid, socket, side) ->
    @gamers[sid] = {socket: socket, updates: [], side: side, pos: @gs[side].pos}
    @sendJoined sid

  sendJoined: (sid) ->
    @gamers[sid].socket.emit 'joined', {side: @gamers[sid].side, t: @time()}

  sendMove: (sid) ->
    g = @gamers[sid]
    @gs[g.side].updates = g.updates
    g.socket.emit 'move', {gamers: @gs, ball: @ball}

  sendMoveAll: ->
    for sid of @gamers
      @sendMove sid

  sendScore: (sid) ->
    @gamers[sid].socket.emit 'score', {scores: @scores}

  sendScoreAll: ->
    for sid of @gamers
      @sendScore sid

  updateState: (sid, dir, seq) ->
    @gamers[sid].updates.push {dir: dir, seq: seq, t: @time()} # FIXME not serverTime this should be

  placeBall: (side) ->
    @ball.y = @gs[side].pos + @racketHeight / 2 - @ballSize / 2
    if side == 0
      @ball.x = @ballResetOffset
      @ball.angle = Math.asin((@gs[1].pos - @gs[0].pos) / (@canvasWidth - 2 * @xOffset))
    else
      @ball.x = @canvasWidth - @ballResetOffset - @ballSize
      @ball.angle = Math.PI + Math.asin((@gs[1].pos - @gs[0].pos) / (@canvasWidth - 2 * @xOffset))
    @ball.v = @initBallV

  moveRackets: (currentTime) ->
    for sid, gamer of @gamers
      gamer.pos = @moveRacket gamer.dir, gamer.updates, gamer.pos, currentTime, @updateTime
      @gs[gamer.side].pos = gamer.pos
      if gamer.updates.length
        lastUpdate = gamer.updates[gamer.updates.length-1]
        gamer.dir = lastUpdate.dir
        @gs[gamer.side].lastSeq = lastUpdate.seq
      gamer.updates = []
      @gs[gamer.side].updates = [] # FIXME seems wrong, clear after updates sent only

  checkScoreUpdate: ->
    if @ball.x < 0 or @ball.x > @canvasWidth - @ballSize
      side = -1
      if @ball.x < 0
        @scores[1] += 1
        side = 0
      if @ball.x > @canvasWidth - @ballSize
        @scores[0] += 1
        side = 1
      @placeBall side 
      @sendScoreAll()

  startLoop: ->
    return if @inDaLoop
    @gameLoop = timers.setInterval =>
      @gameStep()
    , @dt
    @inDaLoop = true

  endLoop: ->
    return unless @inDaLoop
    timers.clearInterval @gameLoop
    @inDaLoop = false
    @scores = [0, 0]

  gameStep: ->
    time = @time()
    @moveRackets time
    @ball.t = @updateTime
    @ball = @moveBall [@ball], time, (time - @updateTime)
    @ball.t = time
    @checkScoreUpdate()
    @sendMoveAll()
    @updateTime = time

  oneQuitted: (sidQuit) ->
    delete @gamers[sidQuit]
    for sid, gamer of @gamers
      gamer.socket.emit('quit', sid) if (sidQuit != sid)

  connect: (socket) ->
    sid = cookie.parse(socket.handshake.headers.cookie)['connect.sid']
    console.log "Have a connection: #{sid} (socket id: #{socket.id})"

    socket.on 'join', (data) =>
      if sid of @gamers
        @sendJoined sid
        @sendMove sid
        return
      if @count == 2
        socket.emit 'busy'
        return
      console.log "I can has join: #{sid}"
      @addGamer sid, socket, @count
      @count++
      @startLoop() if @count > 0
      @sendMove sid
      @sendScore sid

    socket.on 'state', (data) =>
      @updateState sid, data.dir, data.seq

    socket.on 'disconnect', =>
      return unless sid of @gamers && @gamers[sid].socket.id == socket.id
      console.log "Disconnecting: #{sid}"
      @oneQuitted sid
      @count--
      @endLoop() if @count == 0
