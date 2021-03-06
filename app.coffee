#require 'newrelic'
express = require 'express'
routes = require './routes'
http = require 'http'
io = require 'socket.io'

# middleware
bodyParser = require 'body-parser'
cookieParser = require 'cookie-parser'
session = require 'express-session'
methodOverride = require 'method-override'
errorHandler = require 'errorhandler'

# classes
Game = require './game/game'

# server config
app = express()

app.set "views", __dirname + "/views"
app.set "view engine", "jade"
app.use bodyParser.json()
#app.use bodyParser.urlencoded {extended:true}
app.use cookieParser()
app.use session {
  secret: 'thisisasecretnobodyshouldseehoweverthisisdevwhowantstohackponggameanyway?',
  resave: true,
  saveUninitialized: true,
}
app.use methodOverride()
# app.use app.router
app.use '/public', express.static(__dirname + '/public')

env = process.env.NODE_ENV || 'development';

if 'development' == env
  app.use errorHandler
    dumpExceptions: true, showStack: true

if 'production' == env
  app.use errorHandler()

# setup locals for views
app.locals = { production: ('production' == env) }

# routing
app.get '/', routes.index
app.get '/about', routes.about

port = process.env['PORT'] || 3000

srv = http.createServer app

game = new Game

# Comment log:false to see sockets debug messages
io = io.listen srv, log:false
io.sockets.on 'connection', (socket) ->
  game.connect socket

srv.listen(port)

console.log "Express server listening on port %d in %s mode", port, app.settings.env
