function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGameAgainstAI(level) {
    resetAll();
    if (level === "beginner") {
        g_against = AI_BEGINNER;
        g_aiPlayer = new AIPlayer(level);
        aiSayComment("You are now playing against the beginner AI.");
    }
}

function AIPlayer(level) {
    this.level = level;
}

AIPlayer.prototype.nextMove = function(board) {
    if (this.level === "beginner") {
        console.log(getAllLegalMoves("e2", board, BLACK));
        var allMoves = [];
        var currentSquare = null;
        var columns = "abcdefgh";
        var rows = "12345678";
        var moves = [];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                currentSquare = columns[i] + rows[j];
                moves = getAllLegalMoves(currentSquare, board, BLACK);
                for (var k = 0; k < moves.length; k++) {
                    allMoves.push({from: currentSquare, to: moves[k]});
                }
            }
        }
        var selectedMove = allMoves[randInt(0, allMoves.length - 1)];
        return selectedMove;
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
