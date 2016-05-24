var Card = function(index) {
  this.index = index;
};

Card.prototype.getImage = function() {
  return "images/" + (this.index + 1) + ".png";
};

Card.prototype.getIndex = function() {
  return this.index;
};
