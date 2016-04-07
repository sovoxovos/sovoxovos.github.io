var width = 500;
var height = 100;

function Snake(headPosition) {
  this.initialPosition = headPosition;
  this.headPosition = headPosition;
  this.length = Math.floor(Math.random() * 10 + 3);
  this.speed = Math.random() * 0.01 + 0.005;
}

Snake.prototype.isPresentAt = function (row) {
  return row <= this.headPosition && row >= this.headPosition - this.length
};

Snake.prototype.step = function (progress) {
  if (!this.birthdate) {
    this.birthdate = progress;
  }
  this.headPosition = this.initialPosition + ((progress - this.birthdate) * this.speed);
};

function getRandomHeadPosition() {
  return Math.floor(Math.random() * -height);
}

function Matrix() {
  var emptyMatrix = Array.apply(null, {length: width})
  this.snakes = emptyMatrix.map(function() {
    return new Snake(getRandomHeadPosition())
  })
}

Matrix.prototype.step = function (progress) {
  this.snakes.forEach(function (snake, position, snakes) {
    if (snake.headPosition > height) {
      snakes[position] = new Snake(getRandomHeadPosition());
    }
    snake.step(progress);
  })
};

function generateRowsFrom(snakes) {
  var rowsToDisplay = []
  for (var row = 0; row < height; row++) {
    var rowToDisplay = ''
    snakes.forEach(function (snake) {
      rowToDisplay += snake.isPresentAt(row) ? '$' : '&nbsp;'
    })
    rowsToDisplay.push(rowToDisplay);
  }
  return rowsToDisplay;
}

function display($matrix, rows) {
  $matrix.html(
    rows.map(function (row) {
      return $('<div>').html(row);
    })
  );
};

var matrix = new Matrix();

var start = null;
function step(timestamp) {
  var $matrix = $('.matrix');
  var $behind = $('.main');
  if (!start) start = timestamp;
  var progress = timestamp - start;
  matrix.step(progress);
  display($matrix, generateRowsFrom(matrix.snakes));
  if (progress < 5000) {
    if (progress > 4500) {
      $('.matrix').addClass('matrix__off');
      $('.behind').addClass('behind__on');
    }
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
