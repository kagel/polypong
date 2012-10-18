// Generated by CoffeeScript 1.3.3
(function() {
  var GameCore;

  GameCore = (function() {

    function GameCore() {
      this.canvasWidth = 780;
      this.canvasHeight = 440;
      this.racketHeight = 55;
      this.racketWidth = 10;
      this.racketStep = 10;
      this.ballSize = 8;
      this.ballPosition = [this.canvasWidth / 2 - this.ballSize / 2, this.canvasHeight / 2 - this.ballSize / 2];
      this.angle = (20 + Math.random() * 50) * Math.PI / 180;
    }

    return GameCore;

  })();

  if (typeof module === 'undefined') {
    window.GameCore = GameCore;
  } else {
    module.exports = GameCore;
  }

}).call(this);
