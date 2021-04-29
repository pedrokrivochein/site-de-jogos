var pieces = [[0, 0], [0, 1], [1, 1], [0, 2], [1, 2], [2, 2], [0, 3], [1, 3], [2, 3], [3, 3],
[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6]];

function mixPieces() {
    var _pieces = {
        "red": [],
        "blue": [],
        "left": [[0, 0], [0, 1], [1, 1], [0, 2], [1, 2], [2, 2], [0, 3], [1, 3], [2, 3], [3, 3],
        [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
        [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6]]
    }
    var n = randomNumbers();
    _pieces["red"] = n.slice(0, 7);
    _pieces["blue"] = n.slice(7, 14);
    for (var x in n) {
        for (var j in _pieces["left"]) {
            if (pieces[n[x]][0] == _pieces["left"][j][0] && pieces[n[x]][1] == _pieces["left"][j][1]) {
                _pieces["left"].splice(j, 1);
            }
        }
    }
    for (var x in _pieces["left"]) {
        if (_pieces["left"][x][0] == _pieces["left"][x][1]) {
            _pieces["middle"] = _pieces["left"][x];
            _pieces["left"].splice(x, 1);
            break;
        }
        _pieces["middle"] = _pieces["left"][x];
    }
    return _pieces;
}

function randomNumbers() {
    var numbers = [];
    for (var i = 0; i < 14; i++) {
        var n = getRandomNumberBetween(0, 27);
        if (numbers.includes(n)) {
            for (var j = 0; j < 28; j++) {
                if (!numbers.includes(j)) {
                    numbers[i] = j;
                    break;
                }
            }
        } else {
            numbers[i] = n;
        }
    }
    return numbers;
}

function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function playPiece(piecesList, _piece){
    for(var x in piecesList){
        if(pieces[piecesList[x]][0] == _piece[0] && pieces[piecesList[x]][1] == _piece[1] ||
            pieces[piecesList[x]][0] == _piece[1] && pieces[piecesList[x]][1] == _piece[0]){
            piecesList.splice(x, 1);
        }
    }
    return piecesList;
}

function buyPiece(piecesList, color){
    var _piece = piecesList["left"][0];
    piecesList[color].push(findPieceIndex(_piece));
    piecesList["left"].splice(0, 1);
    return piecesList;
}

function checkWinner(piecesList){
    var count = {
        "red": 0,
        "blue": 0
    }

    for(var x in piecesList["red"]){
        count["red"] += pieces[piecesList["red"][x]][0] + pieces[piecesList["red"][x]][1];
    }

    for(var x in piecesList["blue"]){
        count["blue"] += pieces[piecesList["blue"][x]][0] + pieces[piecesList["blue"][x]][1];
    }

    if(count["red"] < count["blue"]){
        return "red";
    }else if(count["blue"] < count["red"]){
        return "blue";
    }else{
        return "gray";
    }
}

function findPieceIndex(_piece){
    for(var x in pieces){
        if(pieces[x][0] == _piece[0] && pieces[x][1] == _piece[1]){
            return parseInt(x);
        }
    }
    return 0;
}

module.exports = {mixPieces, playPiece, buyPiece, checkWinner};