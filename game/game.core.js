(function() {
  var GameCore;

  GameCore = (function() {

    function GameCore() {
      this.canvasWidth = 780;
      this.canvasHeight = 440;
      this.xOffset = 20;
      this.racketHeight = 55;
      this.racketWidth = 10;
      this.ballSize = 8;
      this.dirUp = -1;
      this.dirIdle = 0;
      this.dirDown = 1;
      this.gs = [
        {
          pos: 10,
          dir: this.dirIdle,
          updates: []
        }, {
          pos: 10,
          dir: this.dirIdle,
          updates: []
        }
      ];
      this.ballPosition = [this.canvasWidth / 2 - this.ballSize / 2, this.canvasHeight / 2 - this.ballSize / 2];
      this.ballResetOffset = 50;
      this.angle = (20 + Math.random() * 50) * Math.PI / 180;
      this.ballV = 200;
      this.maxBallV = 400;
      this.initBallV = 200;
      this.minBallV = 100;
      this.racketV = 0.15;
      this.speedUp = 0.9;
      this.updateTime = null;
      this.dt = 20;
      this.dtInSec = this.dt / 1000;
      this.lastProcessedSeq = -1;
    }

    GameCore.prototype.time = function() {
      return new Date().getTime();
    };

    GameCore.prototype.moveRacket = function(dir, dirUpdates, pos, currentTime, lastTime) {
      var upd, _i, _len;
      for (_i = 0, _len = dirUpdates.length; _i < _len; _i++) {
        upd = dirUpdates[_i];
        if (upd.t <= lastTime || upd.t > currentTime) continue;
        pos = this.moveRacketBit(pos, dir, upd.t - lastTime, currentTime, lastTime);
        lastTime = upd.t;
        dir = upd.dir;
        this.lastProcessedSeq = upd.seq;
      }
      return this.moveRacketBit(pos, dir, currentTime - lastTime, currentTime, lastTime);
    };

    GameCore.prototype.moveRacketBit = function(pos, dir, dt, currentTime, lastTime) {
      var newPos;
      newPos = dir === this.dirUp ? pos - this.racketV * dt : dir === this.dirDown ? pos + this.racketV * dt : pos;
      if (newPos < 0) newPos = 0;
      if (newPos > this.canvasHeight - this.racketHeight) {
        newPos = this.canvasHeight - this.racketHeight;
      }
      return newPos;
    };

    GameCore.prototype.moveBall = function() {
      var ds;
      ds = this.ballV * this.dtInSec;
      console.log("1: " + this.ballPosition[0] + ", " + this.ballPosition[1]);
      this.ballPosition[0] += Math.round(ds * Math.cos(this.angle));
      this.ballPosition[1] += Math.round(ds * Math.sin(this.angle));
      return this.checkBallCollision();
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
        if (this.ballPosition[1] >= this.gs[0].pos && this.ballPosition[1] <= this.gs[0].pos + this.racketHeight - this.ballSize) {
          this.ballPosition[0] = this.xOffset;
          this.angle = Math.PI - this.angle;
          this.ballV = this.ballV * (this.speedUp + Math.abs(this.ballPosition[1] - this.gs[0].pos + this.racketHeight / 2) / (this.gs[0].pos + this.racketHeight / 2));
          if (this.ballV >= this.maxBallV) {
            this.ballV = this.maxBallV;
          } else if (this.ballV <= this.minBallV) {
            this.ballV = this.minBallV;
          } else {
            this.ballV = this.ballV * (this.speedUp + Math.abs(this.ballPosition[1] - this.gs[0].pos + this.racketHeight / 2) / (this.gs[0].pos + this.racketHeight / 2));
          }
          return;
        }
      }
      if (this.ballPosition[0] >= this.canvasWidth - this.xOffset - this.ballSize) {
        if (this.ballPosition[1] >= this.gs[1].pos && this.ballPosition[1] <= this.gs[1].pos + this.racketHeight - this.ballSize) {
          this.ballPosition[0] = this.canvasWidth - this.xOffset - this.ballSize;
          this.angle = Math.PI - this.angle;
          if (this.ballV >= this.maxBallV) {
            this.ballV = this.maxBallV;
          } else if (this.ballV <= this.minBallV) {
            this.ballV = this.minBallV;
          } else {
            this.ballV = this.ballV * (this.speedUp + Math.abs(this.ballPosition[1] - this.gs[0].pos + this.racketHeight / 2) / (this.gs[0].pos + this.racketHeight / 2));
          }
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
