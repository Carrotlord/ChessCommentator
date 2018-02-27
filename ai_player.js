function startGameAgainstAI(level) {
    resetAll();
    if (level === "beginner") {
        g_against = AI_BEGINNER;
        g_aiPlayer = new AIPlayer();
        aiSayComment("You are now playing against the beginner AI.");
    }
}

function AIPlayer() {
}

AIPlayer.prototype.nextMove = function(board) {
    return {
        from: "e2",
        to: "e4"
    };
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
}
