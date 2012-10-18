class GameCore

  constructor: ->
    @canvasWidth = 780
    @canvasHeight = 440

    @racketHeight = 55
    @racketWidth = 10
    @racketStep = 10

    @ballSize = 8
    @ballPosition = [@canvasWidth / 2 - @ballSize / 2, @canvasHeight / 2 - @ballSize / 2]

    @angle = (20 + Math.random()*50)*Math.PI/180


if typeof(module) == 'undefined'
  window.GameCore = GameCore
else
  module.exports = GameCore
