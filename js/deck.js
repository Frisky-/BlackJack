/**
 * Creates instance of Deck.
 */

var Deck = (function() {
    'use strict';

    var cards = [];

    /**
     * Creating a deck with 52 cards.
     */

    function create() {
        for (var i = 0; i < 52; i++) {
            cards.push(new Card(i));
        }
    }

    /**
     * Shuffling the cards in the deck on random principle.
     */

    function shuffle() {
        var currentIndex = cards.length,
            temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = cards[currentIndex];
            cards[currentIndex] = cards[randomIndex];
            cards[randomIndex] = temporaryValue;
        }
    }

    return {
        init: function() {
            create();
            shuffle();
        },
        //getting the image for each card in the deck
        getCardImages: function() {
            return cards.map(function(card) {
                return card.getImage();
            });
        },

        getCard: function() {
            return cards.pop();
        }
    };
})();
