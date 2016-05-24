/**
 * Creates instance of Board.
 */

var Board = (function() {
    'use strict';

    var CardPosition = {
        DEALER1: 0,
        DEALER2: 1,
        DEALER3: 2,
        PLAYER1: 3,
        PLAYER2: 4
    };

    var canvas;
    var context;
    var animation = {};
    var cards = {};

    /**
     * Initializing the canvas.
     */

    function initCanvas() {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        context.font = "16pt Verdana";

        $("#canvas").click(onCanvasClick);

        window.requestAnimFrame = (function(callback) {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    window.setTimout(callback, 1000 / 60);
                };
        })();
    }

    /**
     * Preloading the images for better performance.
     */

    function preloadImages() {
        createImage("images/back.png");
        $.each(Deck.getCardImages(), function(i, cardImage) {
            createImage(cardImage, i);
        });
    }

    /**
     * Appending all the images to the boy.
     * @param {url} Url of the card image
     * @param {number} Index of the card in the deck
     */

    function createImage(cardImage, cardIndex) {
        $("<img>", {
            id: getCardId(cardIndex),
            class: "card",
            src: cardImage
        }).appendTo("body");
    }

    /**
     * Getting the card id
     * @param Index of the card.
     * @return {string} If theres index returns card + index else returning cardback.
     */

    function getCardId(cardIndex) {
        return cardIndex !== undefined ? "card" + cardIndex : "cardback";
    }

    /**
     * Getting the coordinates where the card to be placed.
     * @return Depending on the card position returns x and y coordinates.
     */

    function getCardPoint(cardPosition) {
        switch (cardPosition) {
            case CardPosition.DEALER1:
                return {
                    x: 10,
                    y: 40
                };
            case CardPosition.DEALER2:
                return {
                    x: 110,
                    y: 40
                };
            case CardPosition.DEALER3:
                return {
                    x: 210,
                    y: 40
                };
            case CardPosition.PLAYER1:
                return {
                    x: 60,
                    y: 250
                };
            case CardPosition.PLAYER2:
                return {
                    x: 160,
                    y: 250
                };
        }
    }

    /**
     * Drawing the initial state of the board.
     */

    function drawInitialState() {
        context.fillStyle = "red";
        context.fillText("Dealer", 15, 30);
        context.fillStyle = "blue";
        context.fillText("Player", 65, 240);
        drawDeck();
    }

    /**
     * When the canvas is clicked coordinates x and y are taken depending
     * Where the canvs in placed on the window.
     * @param event
     */

    function onCanvasClick(event) {
        var rect = canvas.getBoundingClientRect();
        var point = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        var cardPosition = getCardFromPoint(point);

        if (cardPosition) {
            animateCardAway(cardPosition);
        }
    }

    /**
     * Getting position of a card.
     * @param {number} Point with x and y coordinates.
     * @return {number} Card position.
     */

    function getCardFromPoint(point) {
        if (point.x > 60 && point.x < 160 &&
            point.y > 250 && point.y < 400) {
            return CardPosition.PLAYER1;
        }

        if (point.x > 160 && point.x < 260 &&
            point.y > 250 && point.y < 400) {
            return CardPosition.PLAYER2;
        }

        return null;
    }

    /**
     * Removing card from the board when its clicked.
     * @param {number} Position of the card.
     */

    function animateCardAway(cardPosition) {
        var cardIndex = cards[cardPosition];
        if (cardIndex) {
            var cardPoint = getCardPoint(cardPosition);
            animation.cardPosition = cardPosition;
            animation.srcX = cardPoint.x;
            requestAnimFrame(animateAway);
        }
    }

    /**
     * Animaton for when a card is being removed.
     */

    function animateAway() {
        if (animation.srcX < -100) {
            cards[animation.cardPosition] = null;
            return;
        }

        context.clearRect(animation.srcX, 250, 100, 150);
        animation.srcX -= 10;

        if (animation.cardPosition === CardPosition.PLAYER2) {
            drawCard(CardPosition.PLAYER1);
        }

        var cardIndex = cards[animation.cardPosition];
        var cardImage = document.getElementById(getCardId(cardIndex));
        context.drawImage(cardImage, animation.srcX, 250, 100, 150);
        requestAnimFrame(animateAway);
    }

    /**
     * Drawing a card into the canvas.
     * @param {number} Position of the card.
     */

    function drawCard(position) {
        var index = cards[position];
        if (index) {
            var image = document.getElementById(getCardId(index));
            var point = getCardPoint(position);
            context.drawImage(image, point.x, point.y, 100, 150);
        }
    }

    /**
     * Drawing the deck into the canvas.
     */

    function drawDeck() {
        var cardImage = document.getElementById(getCardId());
        context.drawImage(cardImage, 350, 40, 100, 150);
        context.drawImage(cardImage, 355, 45, 100, 150);
        context.drawImage(cardImage, 360, 50, 100, 150);
    }

    /**
     * Animating the cards to their respective position.
     */

    function animate() {
        if (animation.srcX <= animation.dstX) {
            context.drawImage(animation.card, animation.dstX, animation.dstY, 100, 150);
            return;
        }

        drawDeck();
        context.clearRect(animation.srcX, animation.srcY, 100, 150);

        updateAnimation();

        context.drawImage(animation.card, animation.srcX, animation.srcY, 100, 150);

        requestAnimFrame(animate);
    }

    /**
     * Updating the animation depending on the position of the card.
     */

    function updateAnimation() {
        if (animation.dstY === 250) {
            if (animation.srcY < 250) {
                animation.srcY += 10;
            } else {
                animation.srcX -= 10;
            }
        } else {
            animation.srcX -= 10;
        }
    }

    /**
     * Getting the index, starting poistion and ending position of the card.
     * @param {number} cardIndex The index of the card in the deck.
     * @param {number} startX x coordinates of the starting position.
     * @param {number} startY y coordinates of the starting position.
     * @param {number} endX x coordinates of the ending position.
     * @param {number} endY y coordinates of the ending position.
     */

    function animateCard(cardIndex, startX, startY, endX, endY) {
        animation.card = document.getElementById(getCardId(cardIndex));
        animation.srcX = startX;
        animation.srcY = startY;
        animation.dstX = endX;
        animation.dstY = endY;

        animate();
    }

    return {
        init: function() {
            initCanvas();
            preloadImages();
            $(window).load(drawInitialState);
        },
        moveCard: function(cardPosition, cardIndex) {
            var point = getCardPoint(cardPosition);
            animateCard(cardIndex, 350, 40, point.x, point.y);
            cards[cardPosition] = cardIndex;
        }
    };
})();
