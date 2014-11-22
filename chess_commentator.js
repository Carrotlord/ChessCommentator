var WHITE = 0;
var BLACK = 1;

var g_currentlySelectedSquareString = null;

function getCoords(squareString) {
    var aCharCode = "a".charCodeAt(0);
    var oneCharCode = "1".charCodeAt(0);
    if (squareString.length !== 2) {
        alert("Bad square string: " + squareString);
        return;
    }
    return [squareString.charCodeAt(0) - aCharCode,
            squareString.charCodeAt(1) - oneCharCode];
}

function getBaseColor(squareString) {
    var isEven = function isEven(x) {
        return (x & 1) === 0;
    }
    var coords = getCoords(squareString);
    var i = coords[0];
    var j = coords[1];
    if (isEven(i)) {
        /* We have white as the first square. */
        if (isEven(j)) {
            return WHITE;
        } else {
            return BLACK;
        }
    } else {
        /* We have black as the first square. */
        if (isEven(j)) {
            return BLACK;
        } else {
            return WHITE;
        }
    }
}

function getTileColor(color) {
    if (color === WHITE) {
        return "white_tile";
    } else {
        return "blue_tile";
    }
}

function toggleSquare(squareString) {
    var square = document.getElementById(squareString);
    if (square.className === "selected_tile") {
        /* Turn off the square that's selected: */
        square.className = getTileColor(getBaseColor(squareString));
        g_currentlySelectedSquareString = null;
    } else {
        /* Turn off any selected squares, and then select our new square.
         * In this case, the new square cannot be the one already selected. */
        if (g_currentlySelectedSquareString !== null) {
            toggleSquare(g_currentlySelectedSquareString);
        }
        square.className = "selected_tile";
        g_currentlySelectedSquareString = squareString;
    }
}