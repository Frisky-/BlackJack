/**
 * Creates instance of Dealer.
 */

var Dealer = (function() {
    'use strict';
    /**
     * Dealing a card to her position after some interval.
     * @param {number} cardPostion The position of the card.
     * @param {number} card Index of the card.
     * @param {number} afterSeconds Executes the function moveCard after 1 second.
     */
    function dealCard(cardPosition, card, afterSeconds) {
        if (card) {
            setTimeout(function() {
                Board.moveCard(cardPosition, card.getIndex());
            }, (afterSeconds * 1000));
        }
    }

    return {
        dealStartingHands: function() {
            for (var i = 0; i < 5; i++) {
                dealCard(i, Deck.getCard(), (i + 1));
            }
        },

        replacePlayerCards: function() {
            dealCard(3, Deck.getCard(), 1);
            dealCard(4, Deck.getCard(), 2);
        }
    };
})();
