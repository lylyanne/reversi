(function () {
  if (typeof Reversi === "undefined") {
    window.Reversi = {};
  }

  var View = Reversi.View = function (game, $el) {
    this.game = game;
    this.$el = $el;
    this.render();
    //this.bindEvents();
  };

  //View.NUM_PEGS = 3;

  // View.prototype.bindEvents = function () {
  //   var that = this;
  //   this.$el.on('click', '.peg', function (event) {
  //     if (that.$twr1 === undefined) {
  //
  //       that.$twr1 = $(event.currentTarget);
  //     } else {
  //       that.clickTower(that.$twr1, $(event.currentTarget));
  //       delete that.$twr1;
  //     }
  //   });
  //
  //   $('.play-again').on('click', this.restartGame.bind(this));
  // };
  //
  // View.prototype.clickTower = function ($twr1, $twr2) {
  //   var status = this.game.move($twr1.data("idx"), $twr2.data("idx"));
  //   if (status === false) {
  //     alert("Invalid move!");
  //   } else {
  //     this.render();
  //     if (this.game.isWon()) {
  //       alert("You win!!");
  //       $('.play-again').show();
  //     }
  //   }
  // };

  View.prototype.render = function () {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var $div = $("<div class='tile'>");
        $div.data("pos", [i, j]);

        if (this.game.board.isOccupied([i,j])) {
          var $circle = $("<div class='circle'></div>");
          $circle.addClass(this.game.board.grid[i][j].color);
          $div.append($circle);
        }
        this.$el.append($div);
      }
    }
  };

  // View.prototype.restartGame = function () {
  //   location.reload();
  // };
})();
