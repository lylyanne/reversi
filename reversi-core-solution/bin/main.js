var readline = require('readline');
var Game = require("../src");

var reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var game = new Reversi.Game(reader);
game.run(reader, function () {
  reader.close();
});
