function startGameAgainstAI(level) {
    resetAll();
    if (level === "beginner") {
        g_against = AI_BEGINNER;
        aiSayComment("You are now playing against the beginner AI.");
    } else if (level === "intermediate") {
        g_against = AI_INTERMEDIATE;
        aiSayComment("You are now playing against the intermediate AI.");
    }
    g_aiPlayer = new AIPlayer(level);
}

function AIPlayer(level) {
    this.level = level;
}

/** Prevents moves that result in check after the move is performed. */
function isMoveAcceptable(move, board) {
    var virtualBoard = copyBoard(board);
    makeVirtualMove(move.from, move.to, virtualBoard);
    return !virtualBoard.isKingInCheck(BLACK);
}

function getAILegalMoves(board) {
    var allMoves = [];
    var currentSquare = null;
    var columns = "abcdefgh";
    var rows = "12345678";
    var moves = [];
    var currentMove = null;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            currentSquare = columns[i] + rows[j];
            moves = getAllLegalMoves(currentSquare, board, BLACK);
            for (var k = 0; k < moves.length; k++) {
                currentMove = {from: currentSquare, to: moves[k]};
                if (isMoveAcceptable(currentMove, board)) {
                    allMoves.push(currentMove);
                }
            }
        }
    }
    return allMoves;
}

AIPlayer.prototype.nextMove = function(board) {
    var allMoves = getAILegalMoves(board);
    var selectedMove = {from: "a1", to: "a1"};
    if (allMoves.length === 0) {
        aiSayComment("Player black gives up! No legal moves!");
        return selectedMove;
    }
    if (this.level === "beginner") {
        selectedMove = allMoves[randInt(0, allMoves.length - 1)];
    } else if (this.level === "intermediate") {
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
