var compare = {
    49 : 9,
    50 : 10,
    51 : 11,
    52 : 12,
    53 : 13,
    54 : 14,
    55 : 15,
    56 : 16,
    57 : 1,
    58 : 2,
    59 : 3,
    60 : 4,
    61 : 5,
    62 : 6,
    63 : 7,
    64 : 8,
}

function playPiece(piece, _id, target) {
    if (turn && color != "gray") {

        var column = _id % 8;
        if (column == 0) column = 8;
        var row = (_id - column) / 8;

        var targetColumn = target.id % 8;
        if (targetColumn == 0) targetColumn = 8;
        var targetRow = (target.id - targetColumn) / 8;

        var n1 = targetColumn - column;
        var n2 = targetRow - row;

        var hasEnemy = function (_piece) {
            if (target.children.length > 0) {
                if (target.children[0].classList.contains("enemy")) {
                    return 1;
                } else {
                    return 3;
                }
            } else {
                if (_piece == "peao") {
                    for (var i = row - 1; i >= targetRow + 1; i--) {
                        if (document.getElementById(i * 8 + column).children.length > 0) {
                            return 2;
                        }
                    }
                }

                else if (_piece == "torre") {
                    if (row != targetRow) {
                        if (row - targetRow < 0) {
                            row = targetRow - row;
                            targetRow = targetRow - row;
                            row += targetRow;
                            for (var i = row - 1; i >= targetRow + 1; i--) {
                                if (document.getElementById(i * 8 + column).children.length > 0) {
                                    return 2;
                                }
                            }
                            row = targetRow - row;
                            targetRow = targetRow - row;
                            row += targetRow;
                        } else {
                            for (var i = row - 1; i >= targetRow + 1; i--) {
                                if (document.getElementById(i * 8 + column).children.length > 0) {
                                    return 2;
                                }
                            }
                        }
                    }

                    if (column - targetColumn > 0) {
                        for (var i = column - 1; i >= targetColumn; i--) {
                            if (document.getElementById(row * 8 + i).children.length > 0) {
                                return 2;
                            }
                        }
                    } else if (column - targetColumn < 0) {
                        for (var i = column + 1; i <= targetColumn; i++) {
                            if (document.getElementById(row * 8 + i).children.length > 0) {
                                return 2;
                            }
                        }
                    }
                }

                else if (_piece == "cavalo") { }

                else if (_piece == "bispo") {
                    if (row - targetRow < 0 && column - targetColumn < 0) {
                        let i = 1;
                        for (var j = row + 1; j <= targetRow; j++) {
                            if (column + i <= 8) {
                                if (document.getElementById(j * 8 + column + i).children.length > 0) {
                                    return 2;
                                }
                                i++;
                            }
                        }
                    } else if (row - targetRow < 0 && column - targetColumn > 0) {
                        let i = 1;
                        for (var j = row + 1; j <= targetRow; j++) {
                            if (column - i >= 1) {
                                if (document.getElementById(j * 8 + column - i).children.length > 0) {
                                    return 2;
                                }
                                i++;
                            }
                        }
                    } else if (row - targetRow > 0 && column - targetColumn < 0) {
                        let i = 1;
                        for (var j = row - 1; j >= targetRow; j--) {
                            if (column + i <= 8) {
                                if (document.getElementById(j * 8 + column + i).children.length > 0) {
                                    return 2;
                                }
                                i++;
                            }
                        }
                    } else if (row - targetRow > 0 && column - targetColumn > 0) {
                        let i = 1;
                        for (var j = row - 1; j >= targetRow; j--) {
                            if (column - i >= 1) {
                                if (document.getElementById(j * 8 + column - i).children.length > 0) {
                                    return 2;
                                }
                                i++;
                            }
                        }
                    }
                }

                else if (_piece == "rainha") {
                    if(row == targetRow || column == targetColumn){
                        if (row != targetRow) {
                            if (row - targetRow < 0) {
                                row = targetRow - row;
                                targetRow = targetRow - row;
                                row += targetRow;
                                for (var i = row - 1; i >= targetRow + 1; i--) {
                                    if (document.getElementById(i * 8 + column).children.length > 0) {
                                        return 2;
                                    }
                                }
                                row = targetRow - row;
                                targetRow = targetRow - row;
                                row += targetRow;
                            } else {
                                for (var i = row - 1; i >= targetRow + 1; i--) {
                                    if (document.getElementById(i * 8 + column).children.length > 0) {
                                        return 2;
                                    }
                                }
                            }
                        }

                        if (column - targetColumn > 0) {
                            for (var i = column - 1; i >= targetColumn; i--) {
                                if (document.getElementById(row * 8 + i).children.length > 0) {
                                    return 2;
                                }
                            }
                        } else if (column - targetColumn < 0) {
                            for (var i = column + 1; i <= targetColumn; i++) {
                                if (document.getElementById(row * 8 + i).children.length > 0) {
                                    return 2;
                                }
                            }
                        }
                    }

                    if (row - targetRow < 0 && column - targetColumn < 0) {
                        let i = 1;
                        for (var j = row + 1; j <= targetRow; j++) {
                            if (column + i <= 8) {
                                if (document.getElementById(j * 8 + column + i).children.length > 0) {
                                    return 2;
                                }
                                i++;
                            }
                        }
                    } else if (row - targetRow < 0 && column - targetColumn > 0) {
                        let i = 1;
                        for (var j = row + 1; j <= targetRow; j++) {
                            if (column - i >= 1) {
                                if (document.getElementById(j * 8 + column - i).children.length > 0) {
                                    console.log("e");
                                    return 2;
                                }
                                i++;
                            }
                        }
                    } else if (row - targetRow > 0 && column - targetColumn < 0) {
                        let i = 1;
                        for (var j = row - 1; j >= targetRow; j--) {
                            if (column + i <= 8) {
                                if (document.getElementById(j * 8 + column + i).children.length > 0) {
                                    console.log("f");
                                    return 2;
                                }
                                i++;
                            }
                        }
                    } else if (row - targetRow > 0 && column - targetColumn > 0) {
                        let i = 1;
                        for (var j = row - 1; j >= targetRow; j--) {
                            if (column - i >= 1) {
                                if (document.getElementById(j * 8 + column - i).children.length > 0) {
                                    console.log("g");
                                    return 2;
                                }
                                i++;
                            }
                        }
                    }
                }

                else if (_piece == "rei") {}
            }
            return 0;
        }

        var enemy = hasEnemy(piece);

        if (piece == "peao") {
            piece = document.getElementById(_id).children[0];
            if (enemy == 0) {
                if (_id - 8 == target.id) {
                } else if (_id - 16 == target.id && row == 6) {
                } else
                    return;
            } else if (enemy == 1) {
                if (n1 < 0) n1 *= -1;
                if (n1 == 1 && n2 == -1) {
                    document.getElementById(target.id).children[0].remove();
                } else
                    return;
            } else
                return;

        } else if (piece == "torre") {
            piece = document.getElementById(_id).children[0];
            console.log(enemy);
            if (enemy == 0) {
                if ((_id - target.id) % 8 == 0 || row == targetRow) {
                } else
                    return;
            } else if (enemy == 1) {
                if (n1 == 0 || n2 == 0) {
                    document.getElementById(target.id).children[0].remove();
                } else
                    return;
            } else
                return;

        } else if (piece == "cavalo") {
            piece = document.getElementById(_id).children[0];
            if (n1 < 0) n1 *= -1;
            if (n2 < 0) n2 *= -1;
            if (enemy == 0);
            else if (enemy == 1)
                if ((n1 == 1 && n2 == 2) || (n1 == 2 && n2 == 1))
                    document.getElementById(target.id).children[0].remove();
                else
                    return;
            else
                return;
            if (n1 == 1 && n2 == 2) {
            } else if (n1 == 2 && n2 == 1) {
            } else
                return;

        } else if (piece == "bispo") {
            piece = document.getElementById(_id).children[0];
            n1 = parseInt(target.id) + 9 * (row - targetRow);
            n2 = parseInt(target.id) + 7 * (row - targetRow);
            if (enemy == 0);
            else if (enemy == 1)
                if (_id == n1 || _id == n2)
                    document.getElementById(target.id).children[0].remove();
                else
                    return;
            else
                return;
            if (_id == n1 || _id == n2) {
            } else
                return;

        } else if (piece == "rainha") {
            piece = document.getElementById(_id).children[0];
            n1 = parseInt(target.id) + 9 * (row - targetRow);
            n2 = parseInt(target.id) + 7 * (row - targetRow);
            if (enemy == 0);
            else if (enemy == 1)
            if ((_id - target.id) % 8 == 0 || row == targetRow || _id == n1 || _id == n2)
                    document.getElementById(target.id).children[0].remove();
                else
                    return;
            else
                return;
            if ((_id - target.id) % 8 == 0 || row == targetRow || _id == n1 || _id == n2) {
            } else
                return;

        } else if (piece == "rei") {
            piece = document.getElementById(_id).children[0];
            if (n1 < 0) n1 *= -1;
            if (n2 < 0) n2 *= -1;
            if (enemy == 0);
            else if (enemy == 1)
                if (n1 < 2 && n2 < 2)
                    document.getElementById(target.id).children[0].remove();
                else
                    return;
            else
                return;
            if (n1 < 2 && n2 < 2) {
            } else
                return;
        } else
            return;
        target.appendChild(piece);
        socket.emit("xadrez-play-piece", [_id, target.id, piece.id, column, row, targetColumn, targetRow], id);
        turn = false;
        document.getElementById("warningTopText").innerHTML = "Vez do adversário.";
    }
}

exports = {playPiece, compare}