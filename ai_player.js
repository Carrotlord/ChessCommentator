function startGameAgainstAI(level) {
    resetAll();
    if (level === "beginner") {
        g_against = AI_BEGINNER;
        aiSayComment("You are now playing against the beginner AI.");
    } else if (level === "intermediate") {
        g_against = AI_INTERMEDIATE;
        aiSayComment("You are now playing against the intermediate AI.");
    } else if (level === "advanced") {
        g_against = AI_ADVANCED;
        aiSayComment("You are now playing against the advanced AI.");
    }
    g_aiPlayer = new AIPlayer(level);
}

function AIPlayer(level) {
    this.level = level;
}

/** Prevents moves that result in check after the move is performed. */
function isMoveAcceptable(move, board, color) {
    var virtualBoard = copyBoard(board);
    makeVirtualMove(move.from, move.to, virtualBoard);
    return !virtualBoard.isKingInCheck(color);
}

function getAILegalMoves(board, color) {
    var allMoves = [];
    var currentSquare = null;
    var columns = "abcdefgh";
    var rows = "12345678";
    var moves = [];
    var currentMove = null;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            currentSquare = columns[i] + rows[j];
            moves = getAllLegalMoves(currentSquare, board, color);
            for (var k = 0; k < moves.length; k++) {
                currentMove = {from: currentSquare, to: moves[k]};
                if (isMoveAcceptable(currentMove, board, color)) {
                    allMoves.push(currentMove);
                }
            }
        }
    }
    return allMoves;
}

AIPlayer.prototype.nextMove = function(board) {
    var allMoves = getAILegalMoves(board, BLACK);
    var selectedMove = {from: "a1", to: "a1"};
    if (allMoves.length === 0) {
        aiSayComment("Player black gives up! No legal moves!");
        return selectedMove;
    }
    var result = null;
    if (this.level === "beginner") {
        var virtualBoard = null;
        var bestMove = null;
        var bestPoints = null;
        var currentMove = null;
        var currentPoints = null;
        var equalMoves = null;
        for (var i = 0; i < allMoves.length; i++) {
            currentMove = allMoves[i];
            virtualBoard = copyBoard(board);
            makeVirtualMove(currentMove.from, currentMove.to, virtualBoard);
            currentPoints = this.evaluateBoard(virtualBoard);
            /* Find the most desirable move */
            if (bestMove === null || currentPoints < bestPoints) {
                bestMove = currentMove;
                bestPoints = currentPoints;
                /* Erase weaker moves */
                equalMoves = [bestMove];
            } else if (currentPoints === bestPoints) {
                equalMoves.push(currentMove);
            }
        }
        selectedMove = equalMoves[randInt(0, equalMoves.length - 1)];
    } else if (this.level === "intermediate") {
        result = this.negamax(board, 2, BLACK, null);
        selectedMove = result.move;
    } else if (this.level === "advanced") {
        var randFunction = function() {
            return randInt(0, 4) === 4;
        };
        if (countPieces(board) <= 16) {
            result = this.alphaBetaNegamax(board, 4, BLACK, -99999999, 99999999,
                                           null, randFunction);
        } else {
            result = this.alphaBetaNegamax(board, 3, BLACK, -99999999, 99999999,
                                           null, randFunction);
        }
        selectedMove = result.move;
    }
    commentate(selectedMove.from, selectedMove.to, BLACK,
               board.get(selectedMove.from), board.get(selectedMove.to));
    return selectedMove;
}

/** Evaluates how good a board position is.
 *  Positive favors white, while negative favors black.
 */
AIPlayer.prototype.evaluateBoard = function(board) {
    var points = 0;
    var piece = null;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            piece = board.getAt(i, j);
            if (piece.color === WHITE) {
                points += getPieceValue(piece);
            } else if (piece.color === BLACK) {
                points -= getPieceValue(piece);
            }
        }
    }
    return points;
}

AIPlayer.prototype.negamax = function(board, depth, color, originalMove, randFunction) {
    if (isUndefined(randFunction)) {
        randFunction = function() {
            return randInt(0, 1) === 0;
        };
    }
    var moves = getAILegalMoves(board, color);
    if (depth <= 0 || moves.length === 0) {
        /* Evaluation is done, so return value of leaf node */
        if (color === WHITE) {
            return {value: this.evaluateBoard(board), move: originalMove};
        } else {
            return {value: -this.evaluateBoard(board), move: originalMove};
        }
    } else {
        var bestValue = null;
        var bestMove = null;
        var currentValue = null;
        var currentMove = null;
        var nextBoard = null;
        var result = null;
        for (var i = 0; i < moves.length; i++) {
            currentMove = moves[i];
            nextBoard = copyBoard(board);
            makeVirtualMove(currentMove.from, currentMove.to, nextBoard);
            result = this.negamax(nextBoard, depth - 1, getOppositeColor(color), currentMove, randFunction);
            currentValue = -result.value;
            /* Select the best move.
             * If this move is equally as good, select it according to randFunction. */
            if (bestValue === null || currentValue > bestValue ||
                (currentValue === bestValue && randFunction())) {
                bestValue = currentValue;
                bestMove = currentMove;
            }
        }
        return {value: bestValue, move: bestMove};
    }
}

AIPlayer.prototype.alphaBetaNegamax = function(board, depth, color, alpha, beta, originalMove, randFunction) {
    var moves = getAILegalMoves(board, color);
    if (depth <= 0 || moves.length === 0) {
        if (color === WHITE) {
            return {value: this.evaluateBoard(board), move: originalMove};
        } else {
            return {value: -this.evaluateBoard(board), move: originalMove};
        }
    } else {
        var bestValue = null;
        var bestMove = null;
        var currentValue = null;
        var currentMove = null;
        var nextBoard = null;
        var result = null;
        for (var i = 0; i < moves.length; i++) {
            currentMove = moves[i];
            nextBoard = copyBoard(board);
            makeVirtualMove(currentMove.from, currentMove.to, nextBoard);
            result = this.alphaBetaNegamax(nextBoard, depth - 1, getOppositeColor(color),
                                           -beta, -alpha, currentMove, randFunction);
            currentValue = -result.value;
            if (bestValue === null || currentValue > bestValue ||
                (currentValue === bestValue && randFunction())) {
                bestValue = currentValue;
                bestMove = currentMove;
            }
            if (currentValue > alpha) {
                alpha = currentValue;
            }
            if (alpha >= beta) {
                break;
            }
        }
        return {value: bestValue, move: bestMove};
    }
}

function requestAIMove(aiPlayer, board) {
    var move = aiPlayer.nextMove(board);
    var fromSquare = document.getElementById(move.from);
    var toSquare = document.getElementById(move.to);
    var fromLocation = move.from;
    var toLocation = move.to;
    var movingPiece = board.get(fromLocation);
    board.set(fromLocation, new Piece(NEITHER, EMPTY));
    board.set(toLocation, movingPiece);
    removeAllChildren(fromSquare);
    removeAllChildren(toSquare);
    toSquare.appendChild(generateHTMLPiece(movingPiece));
    fromSquare.className = "opponent_moved_tile";
    toSquare.className = "opponent_moved_tile";
    if (g_lastAIMove !== null) {
        var previousFromSquare = document.getElementById(g_lastAIMove.from);
        var previousToSquare = document.getElementById(g_lastAIMove.to);
        previousFromSquare.className = getTileColor(getBaseColor(g_lastAIMove.from));
        previousToSquare.className = getTileColor(getBaseColor(g_lastAIMove.to));
    }
    g_lastAIMove = move;
}

function countPieces(board) {
    var columns = "abcdefgh";
    var rows = "12345678";
    var count = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            currentSquare = columns[i] + rows[j];
            if (!board.get(currentSquare).isEmpty()) {
                count++;
            }
        }
    }
    return count;
}
