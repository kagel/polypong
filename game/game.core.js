// Generated by CoffeeScript 1.3.3
(function() {
  var GameCore;

  GameCore = (function() {

    function GameCore() {
      this.canvasWidth = 780;
      this.canvasHeight = 440;
      this.xOffset = 20;
      this.racketHeight = 55;
      this.racketWidth = 10;
      this.racketStep = 10;
      this.ballSize = 8;
      this.ballPosition = [this.canvasWidth / 2 - this.ballSize / 2, this.canvasHeight / 2 - this.ballSize / 2];
      this.angle = (20 + Math.random() * 50) * Math.PI / 180;
      this.ballV = 200;
      this.dt = 20;
      this.dtInSec = this.dt / 1000;
      this.dirUp = -1;
      this.dirIdle = 0;
      this.dirDown = 1;
    }

    GameCore.prototype.moveBall = function() {
      var ds;
      ds = this.ballV * this.dtInSec;
      this.ballPosition[0] += Math.round(ds * Math.cos(this.angle));
      return this.ballPosition[1] += Math.round(ds * Math.sin(this.angle));
    };

    GameCore.prototype.checkBallCollision = function() {
      if (this.ballPosition[1] < 0) {
        this.ballPosition[1] = 0;
        this.angle = -this.angle;
        return;
      }
      if (this.ballPosition[1] > this.canvasHeight - this.ballSize) {
        this.ballPosition[1] = this.canvasHeight - this.ballSize;
        this.angle = -this.angle;
        return;
      }
      if (this.ballPosition[0] <= this.xOffset) {
        if (this.ballPosition[1] >= this.yPositions[0] && this.ballPosition[1] <= this.yPositions[0] + this.racketHeight - this.ballSize) {
          this.ballPosition[0] = this.xOffset;
          this.angle = Math.PI - this.angle;
          return;
        }
      }
      if (this.ballPosition[0] >= this.canvasWidth - this.xOffset - this.ballSize) {
        if (this.ballPosition[1] >= this.yPositions[1] && this.ballPosition[1] <= this.yPositions[1] + this.racketHeight - this.ballSize) {
          this.ballPosition[0] = this.canvasWidth - this.xOffset - this.ballSize;
          this.angle = Math.PI - this.angle;
        }
      }
    };

    return GameCore;

  })();

  if (typeof module === 'undefined') {
    window.GameCore = GameCore;
  } else {
    module.exports = GameCore;
  }

}).call(this);
