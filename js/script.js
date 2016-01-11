/*jslint browser: true, devel: true */
/*jslint plusplus: true */
alert("Welcome to this amazing game!\nThe goal is very simple - you have to collect 100 coins.\n" +
      "A new coin appear every 3 seconds.\nFor ten coins you can build a factory - it increases the amount of appearing coins by 1.\n" +
      "You can't have more than 5 factories.\nIf you have 2 or more factories you can build a plant for 20 coins - " +
      "it increases the amount of appearing coins by 2.\nYou can't have more than 5 plants.\nThe game ends when you collect 100 coins. Good luck!");

var total_coins = 0; /* Current amount of coins the player has */
var appearing_coins = 1; /* The amount of coins that are currently appearing */
var factories = 0; /* The amount of built factories */
var plants = 0; /* The amount of built plants */
var factory_price = 10; /* Price of the factory */
var plant_price = 20; /* Price of the plant */
var win_amount = 100; /* Amount of coins to win */

var canvas = document.getElementById("gameField");
var context = canvas.getContext("2d");
var elemLeft = canvas.offsetLeft;
var elemTop = canvas.offsetTop;
var elements = []; /* An array to store the coordinates of appeared coins */

/* Outputs the current amount of coins */
function printCoins() {
    "use strict";
    document.getElementById("coins_amount").innerHTML = total_coins;
}

/* Factory parameters and a function for building a factory */

var factoryX = 10;
var factoryY = 10;
var factory_image = new Image();
factory_image.src = 'img/factory.png';

function buildFactory() {
    "use strict";
    if (total_coins < factory_price) {
        alert("You don't have enough coins!");
    } else if (factories === 5) {
        alert("You can't have more than 5 factories!");
    } else {
        context.drawImage(factory_image, factoryX, factoryY);
        total_coins -= factory_price;
        printCoins();
        factories += 1;
        appearing_coins += 1;
        factoryX += 110;
    }
}

/* Plant parameters and a function for building a plant */

var plantX = 10;
var plantY = 120;
var plant_image = new Image();
plant_image.src = 'img/plant.png';

function buildPlant() {
    "use strict";
    if (total_coins < plant_price) {
        alert("You don't have enough coins!");
    } else if (factories < 2) {
        alert("You can't build a plant without having 2 or more factories!");
    } else if (plants === 5) {
        alert("You can't have more than 5 plants!");
    } else {
        context.drawImage(plant_image, plantX, plantY);
        total_coins -= plant_price;
        printCoins();
        plants += 1;
        appearing_coins += 2;
        plantX += 110;
    }
}

/* This is a coin image */
var base_image = new Image();
base_image.src = 'img/coin.png';
var coinDiameter = 75; /* Corresponds to the coin file size */

/* Generates random integer between min and max */
function randomInt(min, max) {
    "use strict";
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Listen for onclicks on appeared coins
canvas.addEventListener('click', function (event) {
    "use strict";
    /* Mouse coordinates */
    var mouseX = event.pageX - elemLeft,
        mouseY = event.pageY - elemTop;

    // Collision detection between clicked offset and element.
    elements.forEach(function (element) {
        
        var circleX = element.left + coinDiameter / 2, /* X-corrdinate of a circle center */
            circleY = element.top + coinDiameter / 2; /* Y-coordinate of a circle center */
        var x = mouseX - circleX,
            y = mouseY - circleY;
        var dist = Math.sqrt(x * x + y * y);
               
        /* If the click happened inside a coin */
        if (dist < coinDiameter / 2) {

            total_coins += 1;
            printCoins();
            var i = 0;
            
            /* Clear the arc that contains a coin */
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.arc(circleX, circleY, coinDiameter / 2 + 2, 0, Math.PI * 2, true);
            context.fill();
            context.closePath();
            context.globalCompositeOperation = 'source-over';
            
            elements.splice(elements.indexOf(element), 1); /* Remove current element coordinates */
            
            var tempX = 0;
            
            /* If there are any factories - redraw them to restore those that have been partly erased */
            if (factories > 0) {
                tempX = 10;
                for (i = 0; i < factories; i++) {
                    context.drawImage(factory_image, tempX, factoryY);
                    tempX += 110;
                }
            }
            
            /* If there are any plants - redraw them to restore those that have been partly erased */
            if (plants > 0) {
                tempX = 10;
                for (i = 0; i < plants; i++) {
                    context.drawImage(plant_image, tempX, plantY);
                    tempX += 110;
                }
            }
            
            /* Redraw all the remaining coins - to restore those that have been partly erased */
            for (i = 0; i < elements.length; i++) {
                context.drawImage(base_image, elements[i].left, elements[i].top);
            }
                        
        }
        
    });

}, false);

/* Draws the coin at random coordinates */
function drawCoin() {
    "use strict";
    var coinX = randomInt(0, canvas.width - coinDiameter); /* X-coordinate of a new coin */
    var coinY = randomInt(0, canvas.height - coinDiameter); /* Y-coordinate of a new coin */

    context.drawImage(base_image, coinX, coinY);

    // Save the coordinates of a drawn coin in the array
    elements.push({
        left: coinX,
        top: coinY
    });
}

function gameCycle() {
    "use strict";
    if (total_coins >= win_amount) {
        clearInterval(myVar);
        alert("You have won!");
        return;
    } else {
        var i = 0;
        for (i = 0; i < appearing_coins; i++) {
            drawCoin();
        }
    }
}

var myVar = setInterval(gameCycle, 3000);