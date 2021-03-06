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
      this.racketV = 0.15;
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
      this.maxBallV = 0.4;
      this.initBallV = 0.2;
      this.minBallV = 0.1;
      this.speedUp = 0.9;
      this.ball = {
        x: this.canvasWidth / 2 - this.ballSize / 2,
        y: this.canvasHeight / 2 - this.ballSize / 2,
        angle: (20 + Math.random() * 50) * Math.PI / 180,
        v: 0.2,
        t: 0
      };
      this.updateTime = null;
      this.dt = 20;
      this.lastProcessedSeq = -1;
    }

    GameCore.prototype.time = function() {
      return new Date().getTime();
    };

    GameCore.prototype.moveRacket = function(dir, dirUpdates, pos, currentTime, beforeTime) {
      var upd, _i, _len;
      for (_i = 0, _len = dirUpdates.length; _i < _len; _i++) {
        upd = dirUpdates[_i];
        if (upd.t <= beforeTime || upd.t > currentTime) {
          continue;
        }
        pos = this.moveRacketBit(pos, dir, upd.t - beforeTime);
        beforeTime = upd.t;
        dir = upd.dir;
        this.lastProcessedSeq = upd.seq;
      }
      return this.moveRacketBit(pos, dir, currentTime - beforeTime);
    };

    GameCore.prototype.moveRacketBit = function(pos, dir, dt) {
      var newPos;
      newPos = dir === this.dirUp ? pos - this.racketV * dt : dir === this.dirDown ? pos + this.racketV * dt : pos;
      if (newPos < 0) {
        newPos = 0;
      }
      if (newPos > this.canvasHeight - this.racketHeight) {
        newPos = this.canvasHeight - this.racketHeight;
      }
      return newPos;
    };

    GameCore.prototype.moveBall = function(ballUpdates, currentTime, dt) {
      var b, ball, beforeTime, found, _i;
      beforeTime = currentTime - dt;
      for (_i = ballUpdates.length - 1; _i >= 0; _i += -1) {
        b = ballUpdates[_i];
        ball = b;
        if (beforeTime <= b.t && b.t <= currentTime) {
          found = true;
          break;
        }
      }
      if (!found) {
        ball = ballUpdates[ballUpdates.length - 1];
      }
      return this.moveBallBit(ball, currentTime - ball.t);
    };

    GameCore.prototype.moveBallBit = function(ball, dt) {
      var ds;
      ds = ball.v * dt;
      ball.x += ds * Math.cos(ball.angle);
      ball.y += ds * Math.sin(ball.angle);
      ball.t += dt;
      return this.checkBallCollision(ball);
    };

    GameCore.prototype.checkBallCollision = function(ball) {
      if (ball.y < 0) {
        ball.y = 0;
        ball.angle = -ball.angle;
      } else if (ball.y > this.canvasHeight - this.ballSize) {
        ball.y = this.canvasHeight - this.ballSize;
        ball.angle = -ball.angle;
      } else if (ball.x <= this.xOffset) {
        if (ball.y >= this.gs[0].pos && ball.y <= this.gs[0].pos + this.racketHeight - this.ballSize) {
          ball.x = this.xOffset;
          ball.angle = Math.PI - ball.angle;
          ball.v = ball.v * (this.speedUp + Math.abs(ball.y - this.gs[0].pos + this.racketHeight / 2) / (this.gs[0].pos + this.racketHeight / 2));
          if (ball.v >= this.maxBallV) {
            ball.v = this.maxBallV;
          } else if (ball.v <= this.minBallV) {
            ball.v = this.minBallV;
          } else {
            ball.v = ball.v * (this.speedUp + Math.abs(ball.y - this.gs[0].pos + this.racketHeight / 2) / (this.gs[0].pos + this.racketHeight / 2));
          }
        }
      } else if (ball.x >= this.canvasWidth - this.xOffset - this.ballSize) {
        if (ball.y >= this.gs[1].pos && ball.y <= this.gs[1].pos + this.racketHeight - this.ballSize) {
          ball.x = this.canvasWidth - this.xOffset - this.ballSize;
          ball.angle = Math.PI - ball.angle;
          ball.v = ball.v * (this.speedUp + Math.abs(ball.y - this.gs[0].pos + this.racketHeight / 2) / (this.gs[0].pos + this.racketHeight / 2));
          if (ball.v >= this.maxBallV) {
            ball.v = this.maxBallV;
          } else if (ball.v <= this.minBallV) {
            ball.v = this.minBallV;
          }
        }
      }
      return ball;
    };

    return GameCore;

  })();

  if (typeof module === 'undefined') {
    window.GameCore = GameCore;
  } else {
    module.exports = GameCore;
  }

}).call(this);
