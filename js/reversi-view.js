(function () {
  if (typeof Reversi === "undefined") {
    window.Reversi = {};
  }

  var View = Reversi.View = function (game, $el) {
    this.game = game;
    this.$el = $el;
    this.render();
    this.bindEvents();
  };

  View.prototype.bindEvents = function () {
    var that = this;
    this.$el.on('click', '.tile', function (event) {
      var $div = $(event.currentTarget);
      var pos = $div.data("pos");

      if (that.game.board.hasMove(that.game.turn)) {
        that.clickTile(pos, $div);
      } else {
        alert("No moves for " + that.game.turn);
        that.game._flipTurn();
        that.render();
      }
    });

    $('.play-again').on('click', this.restartGame.bind(this));
  };

  View.prototype.clickTile = function (pos, $div) {
    if (this.game.board.validMove(pos, this.game.turn)) {
      this.game.board.placePiece(pos, this.game.turn);
      var $circle = $("<div class='circle'></div>");
      $circle.addClass(this.game.turn);
      $div.append($circle);
      this.game._flipTurn();
      this.render();
    
      if (this.game.board.isOver() || this.game.board.isFull()) {
        var winning_color = this.game.board.winner();
        winning_color === "none" ?
          alert("Game Over! It's a draw") :
          alert("Game Over! " + winning_color + "'s won!");
      }
    } else {
      alert("Not a valid move for " + this.game.turn);
    }
  };

  View.prototype.render = function () {
    this.$el.empty();
    this.$el.append("<h3>" + this.game.turn +"'s turn </h3>")
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

  View.prototype.restartGame = function () {
    location.reload();
  };
})();
