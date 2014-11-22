var ILLEGAL_LOCATION = "illegal_location";

var ERROR_REFERENCE = "!";

var WHITE = 0;
var BLACK = 1;
var NEITHER = 2;

var KING = 0;
var QUEEN = 1;
var ROOK = 2;
var BISHOP = 3;
var KNIGHT = 4;
var PAWN = 5;
var EMPTY = 6;

var NONE = 0;
var MOVE_TO = 1;

function Piece(color, type) {
    this.type = type;
    this.color = color;
}

Piece.prototype.isEmpty = function isEmpty() {
    return this.type === EMPTY && this.color === NEITHER;
}

Piece.prototype.equals = function equals(otherPiece) {
    return this.type === otherPiece.type && this.color === otherPiece.color;
}

/* TODO: Implement this */
Piece.prototype.toString = function toString() {
    return "";
}

function getKingMoves(i, j) {
    return [[i - 1, j - 1], [i - 1, j + 1], [i + 1, j - 1], [i + 1, j + 1],
            [i, j + 1], [i + 1, j], [i, j - 1], [i - 1, j]];
}

function getKnightMoves(i, j) {
    return [[i - 2, j - 1], [i - 1, j - 2], [i + 1, j - 2], [i + 2, j - 1],
            [i + 2, j + 1], [i + 1, j + 2], [i - 1, j + 2], [i - 2, j + 1]];
}

function getBishopMoves(i, j) {
    var collectedCoords = [];
    var iPrime;
    var jPrime;
    /* Move northwest until we hit an obstacle. */
    for (iPrime = i, jPrime = j;
         iPrime >= 0 && jPrime >= 0 && (g_board.getAt(iPrime, jPrime).isEmpty() || iPrime === i);
         --iPrime, --jPrime) {
        collectedCoords.push([iPrime, jPrime]);
    }
    if (iPrime >= 0 && jPrime >= 0 && g_board.getAt(iPrime, jPrime).color !== this.color) {
        collectedCoords.push([iPrime, jPrime]);
    }
    /* Move northeast until we hit an obstacle. */
    for (iPrime = i, jPrime = j;
         iPrime < 8 && jPrime >= 0 && (g_board.getAt(iPrime, jPrime).isEmpty() || iPrime === i);
         ++iPrime, --jPrime) {
        collectedCoords.push([iPrime, jPrime]);
    }
    if (iPrime < 8 && jPrime >= 0 && g_board.getAt(iPrime, jPrime).color !== this.color) {
        collectedCoords.push([iPrime, jPrime]);
    }
    /* Move southwest until we hit an obstacle. */
    for (iPrime = i, jPrime = j;
         iPrime >= 0 && jPrime < 8 && (g_board.getAt(iPrime, jPrime).isEmpty() || iPrime === i);
         --iPrime, ++jPrime) {
        collectedCoords.push([iPrime, jPrime]);
    }
    if (iPrime >= 0 && jPrime < 8 && g_board.getAt(iPrime, jPrime).color !== this.color) {
        collectedCoords.push([iPrime, jPrime]);
    }
    /* Move southeast until we hit an obstacle. */
    for (iPrime = i, jPrime = j;
         iPrime < 8 && jPrime < 8 && (g_board.getAt(iPrime, jPrime).isEmpty() || iPrime === i);
         ++iPrime, ++jPrime) {
        collectedCoords.push([iPrime, jPrime]);
    }
    if (iPrime < 8 && jPrime < 8 && g_board.getAt(iPrime, jPrime).color !== this.color) {
        collectedCoords.push([iPrime, jPrime]);
    }
    return collectedCoords;
}

function getRookMoves(i, j) {
    var collectedCoords = [];
    var iPrime;
    var jPrime;
    /* Move left until we hit an obstacle. */
    for (iPrime = i; iPrime >= 0 && (g_board.getAt(iPrime, j).isEmpty() || iPrime === i); --iPrime) {
        collectedCoords.push([iPrime, j]);
    }
    if (iPrime >= 0 && g_board.getAt(iPrime, j).color !== this.color) {
        collectedCoords.push([iPrime, j]);
    }
    /* Move right until we hit an obstacle. */
    for (iPrime = i; iPrime < 8 && (g_board.getAt(iPrime, j).isEmpty() || iPrime === i); ++iPrime) {
        collectedCoords.push([iPrime, j]);
    }
    if (iPrime < 8 && g_board.getAt(iPrime, j).color !== this.color) {
        collectedCoords.push([iPrime, j]);
    }
    /* Move up until we hit an obstacle. */
    for (jPrime = j; jPrime >= 0 && (g_board.getAt(i, jPrime).isEmpty() || jPrime === j); --jPrime) {
        collectedCoords.push([i, jPrime]);
    }
    if (jPrime >= 0 && g_board.getAt(i, jPrime).color !== this.color) {
        collectedCoords.push([i, jPrime]);
    }
    /* Move down until we hit an obstacle. */
    for (jPrime = j; jPrime < 8 && (g_board.getAt(i, jPrime).isEmpty() || jPrime === j); ++jPrime) {
        collectedCoords.push([i, jPrime]);
    }
    if (jPrime < 8 && g_board.getAt(i, jPrime).color !== this.color) {
        collectedCoords.push([i, jPrime]);
    }
    return collectedCoords;
}

function modifyPawnMoves(givenMoves, i, j, pawnColor) {
    var actualMoves = [];
    /* Pawns cannot attack forward.
     * Filter out cases when a pawn is trying to attack forward. */
    var closerMove = givenMoves[0];
    var iPrime = closerMove[0];
    var jPrime = closerMove[1];
    if (g_board.getAt(iPrime, jPrime).isEmpty()) {
        /* The pawn can freely move here. */
        actualMoves.push(closerMove);
        if (givenMoves.length === 2) {
            var fartherMove = givenMoves[1];
            iPrime = fartherMove[0];
            jPrime = fartherMove[1];
            if (g_board.getAt(iPrime, jPrime).isEmpty()) {
                /* The pawn can also freely move here. */
                actualMoves.push(fartherMove);
            }
        }
    }
    /* Pawns can attack diagonally. */
    var potentialEnemy;
    if (pawnColor === BLACK) {
        potentialEnemy = g_board.getAt(i + 1, j + 1);
        if (potentialEnemy && potentialEnemy.color === WHITE) {
            actualMoves.push([i + 1, j + 1]);
        }
        potentialEnemy = g_board.getAt(i - 1, j + 1);
        if (potentialEnemy && potentialEnemy.color === WHITE) {
            actualMoves.push([i - 1, j + 1]);
        }
    } else {
        potentialEnemy = g_board.getAt(i + 1, j - 1);
        if (potentialEnemy && potentialEnemy.color === BLACK) {
            actualMoves.push([i + 1, j - 1]);
        }
        potentialEnemy = g_board.getAt(i - 1, j - 1);
        if (potentialEnemy && potentialEnemy.color === BLACK) {
            actualMoves.push([i - 1, j - 1]);
        }
    }
    return actualMoves;
}

/* TODO: Finish implementing this */
Piece.prototype.legalMoves = function legalMoves(location) {
    var isOnHomeRow = function isOnHomeRow(location, color) {
        var coords = getCoords(location);
        var j = coords[1];
        if (color === BLACK) {
            return j === 1;
        } else {
            return j === 6;
        }
    }
    /** Given an array of coordinates [[i,j], [i,j]...]
     *  returns all the locations ["a1", "b2"...], getting
     *  rid of all illegal locations.
     */
    var toLegalLocations = function toLegalLocations(coordsArray) {
        var locations = coordsArray.map(coordsToLocation)
        var legalLocations = locations.filter(isLegalLocation);
        return legalLocations;
    }
    if (this.isEmpty()) {
        return [];
    }
    var coords = getCoords(location);
    var i = coords[0];
    var j = coords[1];
    if (this.type === PAWN) {
        /* TODO : Pawns don't attack correctly yet. */
        if (this.color === BLACK) {
            /* Black moves downward. */
            if (isOnHomeRow(location, BLACK)) {
                /* Pawns can move 1 or 2 squares down when on the home row. */
                return toLegalLocations(modifyPawnMoves([[i, j + 1], [i, j + 2]], i, j, BLACK));
            } else {
                return toLegalLocations(modifyPawnMoves([[i, j + 1]], i, j, BLACK));
            }
        } else {
            /* White moves upward. */
            if (isOnHomeRow(location, WHITE)) {
                return toLegalLocations(modifyPawnMoves([[i, j - 1], [i, j - 2]], i, j, WHITE));
            } else {
                return toLegalLocations(modifyPawnMoves([[i, j - 1]], i, j, WHITE));
            }
        }
    } else if (this.type === ROOK) {
        var collectedCoords = getRookMoves(i, j);
        return toLegalLocations(collectedCoords);
    } else if (this.type === BISHOP) {
        var collectedCoords = getBishopMoves(i, j);
        return toLegalLocations(collectedCoords);
    } else if (this.type === QUEEN) {
        var rookCoords = getRookMoves(i, j);
        var bishopCoords = getBishopMoves(i, j);
        return toLegalLocations(rookCoords.concat(bishopCoords));
    } else if (this.type === KNIGHT) {
        var collectedCoords = getKnightMoves(i, j);
        return toLegalLocations(collectedCoords);
    } else if (this.type === KING) {
        var collectedCoords = getKingMoves(i, j);
        return toLegalLocations(collectedCoords);
    }
    /* TODO: else if... */
    return [];
}

function Board() {
    var blackKing = new Piece(BLACK, KING);
    var blackQueen = new Piece(BLACK, QUEEN);
    var blackRook = new Piece(BLACK, ROOK);
    var blackBishop = new Piece(BLACK, BISHOP);
    var blackKnight = new Piece(BLACK, KNIGHT);
    var blackPawn = new Piece(BLACK, PAWN);
    var whiteKing = new Piece(WHITE, KING);
    var whiteQueen = new Piece(WHITE, QUEEN);
    var whiteRook = new Piece(WHITE, ROOK);
    var whiteBishop = new Piece(WHITE, BISHOP);
    var whiteKnight = new Piece(WHITE, KNIGHT);
    var whitePawn = new Piece(WHITE, PAWN);
    var emptyPiece = new Piece(NEITHER, EMPTY);
    this.contents = [[blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook],
                     [blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn],
                     [emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece],
                     [emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece],
                     [emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece],
                     [emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece, emptyPiece],
                     [whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn],
                     [whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook]];
}

Board.prototype.get = function get(squareString) {
    var coords = getCoords(squareString);
    var i = coords[0];
    var j = coords[1];
    return this.contents[j][i];
}

Board.prototype.getAt = function getAt(i, j) {
    return this.contents[j][i];
}

Board.prototype.set = function set(squareString, piece) {
    var coords = getCoords(squareString);
    var i = coords[0];
    var j = coords[1];
    this.contents[j][i] = piece;
}

Board.prototype.isEmptyAt = function isEmptyAt(location) {
    return this.get(location).isEmpty();
}

/** Returns true if the square is empty or can be attacked. */
Board.prototype.isConsumable = function isConsumable(location, attackerColor) {
    var targetedPiece = this.get(location);
    return this.isEmptyAt(location) || targetedPiece.color !== attackerColor;
}

function finalizeLegalMoves(currentMoves, attackerColor) {
    var finalizedMoves = [];
    for (var i = 0; i < currentMoves.length; ++i) {
        var location = currentMoves[i];
        if (g_board.isConsumable(location, attackerColor)) {
            finalizedMoves.push(location);
        }
    }
    return finalizedMoves;
}

function makeEmptyMoveToBoard() {
    var board = [];
    for (var i = 0; i < 8; ++i) {
        var row = [];
        for (var j = 0; j < 8; ++j) {
            row.push(NONE);
        }
        board.push(row);
    }
    return board;
}

var g_currentlySelectedSquareString = null;
var g_board = new Board();
var g_moveToBoard = makeEmptyMoveToBoard();
var g_whoseMove = WHITE;

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

function isLegalLocation(location) {
    return ILLEGAL_LOCATION !== location;
}

function coordsToLocation(coords) {
    var i = coords[0];
    var j = coords[1];
    if (i < 0 || i > 7 || j < 0 || j > 7) {
        return ILLEGAL_LOCATION;
    }
    return "abcdefgh"[i] + "12345678"[j];
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

function displayPossibleMoves(moves) {
    /* Update the moves-to table and the DOM. */
    for (var k = 0; k < moves.length; ++k) {
        var coords = getCoords(moves[k]);
        var i = coords[0];
        var j = coords[1];
        g_moveToBoard[j][i] = MOVE_TO;
        activateMoveTo(moves[k]);
    }
}

function activateMoveTo(squareString) {
    var square = document.getElementById(squareString);
    square.className = "move_to_tile";
}

/** Removes all move-to tiles. */
function clearAllMoveTo() {
    for (var i = 0; i < 8; ++i) {
        for (var j = 0; j < 8; ++j) {
            var location = coordsToLocation([i, j]);
            var square = document.getElementById(location);
            if (square.className === "move_to_tile") {
                square.className = getTileColor(getBaseColor(location));
            }
        }
    }
    /* Note: do not clear the moveToBoard. We need its lingering values
     * to allow the isMoveTo function to work.
     */
}

function isMoveTo(location) {
    var coords = getCoords(location);
    var i = coords[0];
    var j = coords[1];
    return g_moveToBoard[j][i] === MOVE_TO;
}

function removeAllChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function getEntityReference(piece) {
    var wrap = function wrap(refChar) {
        return "&#x265" + refChar + ";";
    }
    switch (piece.color) {
        case WHITE:
            switch (piece.type) {
                case KING:
                    return wrap("4");
                case QUEEN:
                    return wrap("5");
                case ROOK:
                    return wrap("6");
                case BISHOP:
                    return wrap("7");
                case KNIGHT:
                    return wrap("8");
                case PAWN:
                    return wrap("9");
                default:
                    return ERROR_REFERENCE;
            }
        case BLACK:
            switch (piece.type) {
                case KING:
                    return wrap("a");
                case QUEEN:
                    return wrap("b");
                case ROOK:
                    return wrap("c");
                case BISHOP:
                    return wrap("d");
                case KNIGHT:
                    return wrap("e");
                case PAWN:
                    return wrap("f");
                default:
                    return ERROR_REFERENCE;
            }
        default:
            return ERROR_REFERENCE;
    }
}

function generateHTMLPiece(piece) {
    var node = document.createElement("span");
    node.className = "piece";
    node.innerHTML = getEntityReference(piece);
    return node;
}

function aiSayComment(comment) {
    var chatroom = document.getElementById("chatroom");
    chatroom.innerHTML += "<span style=\"font-weight:bold;color:green;\">DeepGreen: </span>" + comment + "<br />";
}

function commentate(fromLocation, toLocation, currentPlayer) {
    aiSayComment("A move has been made.");
}

function toggleSquare(squareString) {
    clearAllMoveTo();
    if (isMoveTo(squareString)) {
        var player = g_whoseMove === WHITE ? "white" : "black";
        /* Move that selected piece. */
        var movingPiece = g_board.get(g_currentlySelectedSquareString);
        /* Can only move when it's your turn. */
        if (movingPiece.color !== g_whoseMove) {
            alert("It is " + player + "'s turn.");
            return;
        }
        var fromSquare = document.getElementById(g_currentlySelectedSquareString);
        var toSquare = document.getElementById(squareString);
        var fromLocation = g_currentlySelectedSquareString;
        var toLocation = squareString;
        var killedPiece = g_board.get(squareString);
        g_board.set(g_currentlySelectedSquareString, new Piece(NEITHER, EMPTY));
        g_board.set(squareString, movingPiece);
        /* Change the DOM. */
        removeAllChildren(fromSquare);
        removeAllChildren(toSquare);
        toSquare.appendChild(generateHTMLPiece(movingPiece));
        g_moveToBoard = makeEmptyMoveToBoard();
        /* Doing the next line is okay because g_moveToBoard has been destroyed. */
        toggleSquare(squareString);
        if (killedPiece.type === KING) {
            player = g_whoseMove === WHITE ? "White" : "Black";
            alert(player + " wins!");
            return;
        }
        commentate(fromLocation, toLocation, g_whoseMove);
        /* Change the player. */
        if (g_whoseMove === WHITE) {
            g_whoseMove = BLACK;
        } else {
            g_whoseMove = WHITE;
        }
        return;
    }
    var square = document.getElementById(squareString);
    if (square.className === "selected_tile") {
        /* Turn off the square that's selected: */
        square.className = getTileColor(getBaseColor(squareString));
        g_currentlySelectedSquareString = null;
        /* Destroy the move-to board. */
        g_moveToBoard = makeEmptyMoveToBoard();
    } else {
        /* Turn off any selected squares, and then select our new square.
         * In this case, the new square cannot be the one already selected. */
        if (g_currentlySelectedSquareString !== null) {
            toggleSquare(g_currentlySelectedSquareString);
        }
        square.className = "selected_tile";
        g_currentlySelectedSquareString = squareString;
        /* Now it's time to get our possible moves. */
        var attacker = g_board.get(squareString);
        var possibleMoves = attacker.legalMoves(squareString);
        var actualMoves = finalizeLegalMoves(possibleMoves, attacker.color);
        /* Then display possible moves. */
        displayPossibleMoves(actualMoves);
        /* Do not destroy the move-to board, since it will be needed for the next isMoveTo. */
    }
}