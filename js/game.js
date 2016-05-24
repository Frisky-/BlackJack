'use strict';

$(function() {
  Deck.init();
  Board.init();
  
  $("#hit-me").click(Dealer.replacePlayerCards);
});

$(window).load(function() {
  Dealer.dealStartingHands();
});
