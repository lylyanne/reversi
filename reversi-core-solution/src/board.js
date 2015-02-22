var Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  var x = new Array(8);
  for (var i = 0; i < 8; i++) {
    x[i] = new Array(8);
  }

  x[3][4] = new Piece("black");
  x[4][3] = new Piece("black");
  x[3][3] = new Piece("white");
  x[4][4] = new Piece("white");

  return x;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!this.isValidPos(pos)) {
    throw new Error("Not valid pos!");
  } else {
    return this.grid[pos[0]][pos[1]];
  }
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves(color).length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if every position on the Board is occupied.
 */
Board.prototype.isFull = function () {
  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
      if (this.grid[i][j] === undefined) { return false; }
    }
  }

  return true;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (this.isOccupied(pos)) {
    if (this.grid[pos[0]][pos[1]].color === color) {
      return true;
    }
  }

  return false;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (this.grid[pos[0]][pos[1]] instanceof Piece) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return (this.validMoves("white").length == 0 &&
         this.validMoves("black").length == 0);
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  return pos[0] >= 0 && pos[0] < 8 && pos[1] >= 0 && pos[1] < 8;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  if (!piecesToFlip) {
    piecesToFlip = [];
  } else {
    piecesToFlip.push(pos);
  }

  var nextPos = [pos[0] + dir[0], pos[1] + dir[1]];

  if (!board.isValidPos(nextPos)) {
    return null;
  } else if (!board.isOccupied(nextPos)) {
    return null;
  } else if (board.isMine(nextPos, color)) {
    return piecesToFlip.length == 0 ? null : piecesToFlip;
  } else {
    return _positionsToFlip (board, nextPos, color, dir, piecesToFlip);
  }
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw new Error('Invalid move!');
  }

  var piecesToFlip = [];
  for (var i = 0; i < Board.DIRS.length; i++) {
    piecesToFlip = piecesToFlip.concat(
      _positionsToFlip(this, pos, color, Board.DIRS[i]) || []
    );
  }

  for (var j = 0; j < piecesToFlip.length; j++) {
    this.getPiece(piecesToFlip[j]).flip();
  }

  this.grid[pos[0]][pos[1]] = new Piece(color);
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) { return false; }

  for (var i = 0; i< Board.DIRS.length; i++ ) {
    if (_positionsToFlip(this, pos, color, Board.DIRS[i])) {
      return true;
    }
  }

  return false;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  var moves = [];

  for (var i=0; i< 8; i++) {
    for (var j=0; j< 8; j++) {
      if (this.validMove([i,j], color)) { moves.push([i,j]); }
    }
  }

  return moves;
};

/**
 * Find the winning color.
 */
Board.prototype.winner = function () {
  var white = 0, black = 0;

  for (var i=0; i< 8; i++) {
    for (var j=0; j< 8; j++) {
      if (this.isOccupied([i,j])) {
        if (this.grid[i][j].color === "white") {
          white = white + 1;
        } else {
          black = black + 1;
        }
      }
    }
  }

  if (white > black) {
    return "white";
  } else if (white < black) {
    return "black";
  } else {
    return "none";
  }
};

module.exports = Board;
