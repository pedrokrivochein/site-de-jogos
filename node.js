const express = require('express');
const app = express();
var fs = require("fs");
const io = require("socket.io")(3000);
var rooms = require("./rooms");
var domino = require("./domino");
var xadrez = require("./xadrez");

var color = "gray";
var saveCanvas = [];
var gameData = {};

io.on("connection", socket => {

    fs.readFile('save.json', "utf-8", function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        saveCanvas = data["list"];
    });

    socket.on("change-color-server-canvas", function (element, color) {
        socket.to("canvas").emit('change-color', element, color);
        saveCanvas[element] = color;
        var _json = '{"list":[]}'
        _json = JSON.parse(_json);
        _json["list"] = saveCanvas;
        _json = JSON.stringify(_json);
        fs.writeFile('save.json', _json, function (err) {
            if (err) throw err;
        });
    });

    socket.on("disconnect", () => {
        for (var x in gameData) {
            for (var j in gameData[x]) {
                if (gameData[x][j] == socket.id) {
                    gameData[x][j] = null;
                    socket.to(x).emit("player-disconnected");
                    break;
                }
            }
        }
    });

    socket.on("join-canvas", () => {
        socket.emit("update-canvas", saveCanvas);
        socket.join("canvas");
    });

    socket.on("join-menu", game => {
        socket.emit("update-menu-" + game, rooms.roomsList[game]);
        socket.join("menu-" + game);
    });

    socket.on("join-room", (game, id) => {
        if (!rooms.exists(game, id)) {
            rooms.create(game, id);
            gameData[game + "/" + id] = {}
            socket.to("menu-" + game).emit("update-menu-" + game, rooms.roomsList[game]);
        }
        color = "gray";
        if (!gameData[game + "/" + id]["red"]) {
            gameData[game + "/" + id]["red"] = socket.id;
            color = "red";
        } else if (!gameData[game + "/" + id]["blue"]) {
            gameData[game + "/" + id]["blue"] = socket.id;
            color = "blue";
        }
        rooms.updateData(game, id, gameData[game + "/" + id]);
        socket.emit("update-" + game, gameData[game + "/" + id], color);
        socket.join(game + "/" + id);
        if (color != "gray") socket.to(game + "/" + id).emit("player-connected", color);
    });

    socket.on("change-color-server-jogo-da-velha", (id, data, color) => {
        socket.to("jogo-da-velha/" + id).emit("change-color", data, color);
    });

    socket.on("win-jogo-da-velha", (id, color) => {
        socket.to("jogo-da-velha/" + id).emit("game-won", color);
    });

    socket.on("change-color-server-connect-four", (id, data, color) => {
        socket.to("connect-four/" + id).emit("change-color", data, color);
    });

    socket.on("win-connect-four", (id, color) => {
        socket.to("connect-four/" + id).emit("game-won", color);
    });

    socket.on("domino-request-pieces", id => {
        if (!gameData["domino/" + id]["pieces"]) {
            gameData["domino/" + id]["pieces"] = domino.mixPieces();
            rooms.updateData("domino", id, {...gameData["domino/" + id]});
        }
        let gameDataSend = Object.assign({}, gameData["domino/" + id]["pieces"]);
        for (var x in gameData["domino/" + id]) {
            if (gameData["domino/" + id][x] == socket.id) {
                gameDataSend["left"] = gameDataSend["left"].length;
                (x == "red") ? gameDataSend["blue"] = [] : gameDataSend["red"] = [];
            }
        }
        socket.emit("receive-pieces", gameDataSend);
    });

    socket.on("domino-play-piece", (_piece, id, color) => {
        var piecesList = gameData["domino/" + id]["pieces"][color];
        domino.playPiece(piecesList, _piece);
        socket.to("domino/" + id).emit("play-piece-update", _piece);
    });

    socket.on("domino-buy-piece", (id, color) => {
        var _piece = gameData["domino/" + id]["pieces"]["left"][0];
        domino.buyPiece(gameData["domino/" + id]["pieces"], color);
        socket.emit("buy-piece", _piece);
    });

    socket.on("domino-buy-piece-update", id => {
        socket.to("domino/" + id).emit("buy-piece-update");
    });

    socket.on("domino-skip-turn", id => {
        socket.to("domino/" + id).emit("skip-turn");
    });

    socket.on("win-domino", (id, color) => {
        gameData["domino/" + id]["pieces"] = {};
        gameData["domino/" + id]["pieces"] = domino.mixPieces();
        rooms.updateData("domino", id, gameData["domino/" + id]);
        socket.to("domino/" + id).emit("game-won", color);
    });

    socket.on("win-domino-check-winner", id => {
        var _color = domino.checkWinner(gameData["domino/" + id]["pieces"])
        gameData["domino/" + id]["pieces"] = {};
        gameData["domino/" + id]["pieces"] = domino.mixPieces();
        rooms.updateData("domino", id, gameData["domino/" + id]);
        io.in("domino/" + id).emit("game-won", _color);
    });

    socket.on("xadrez-play-piece", (pieceData, id) => {
        var n1 = pieceData[3] - pieceData[5];
        n1 *= -1;
        var n2 = pieceData[4] - pieceData[6];
        var _piece = parseInt(pieceData[2].split("p")[0]);
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
        _piece = compare[_piece];

        socket.to("xadrez/" + id).emit("play-piece-update", _piece + "p", [n1, n2]);
    });

    socket.on("xadrez-change-piece", (_pieceType, pieceData, id) => {
        var _piece = pieceData[0].split("p")[0];
        _piece = xadrez.compare[_piece];

        pieceData[2][1] *= -1;
        socket.to("xadrez/" + id).emit("change-piece-update", _pieceType, _piece + "p", pieceData[2]);
    });
});

io.of("/").adapter.on("delete-room", (room) => {
    if (room.includes("jogo-da-velha/")) {
        rooms.remove("jogo-da-velha", room.split("jogo-da-velha/")[1]);
        io.in("menu-jogo-da-velha").emit("update-menu-jogo-da-velha", rooms.roomsList["jogo-da-velha"]);
    } else if (room.includes("connect-four/")) {
        rooms.remove("connect-four", room.split("connect-four/")[1]);
        io.in("menu-connect-four").emit("update-menu-connect-four", rooms.roomsList["connect-four"]);
    } else if (room.includes("domino/")) {
        rooms.remove("domino", room.split("domino/")[1]);
        io.in("menu-domino").emit("update-menu-domino", rooms.roomsList["domino"]);
    } else if (room.includes("xadrez/")) {
        rooms.remove("xadrez", room.split("xadrez/")[1]);
        io.in("menu-xadrez").emit("update-menu-xadrez", rooms.roomsList["xadrez"]);
    }
});

app.get("/", (req, res) => {
    fs.readFile("index.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.get("/canvas/", (req, res) => {
    fs.readFile("index-jogo-canvas.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.get("/jogo-da-velha/", (req, res) => {
    fs.readFile("index-menu-jogo-da-velha.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.get("/jogo-da-velha/:roomId", (req, res) => {
    fs.readFile("index-jogo-da-velha.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.get("/connect-four/", (req, res) => {
    fs.readFile("index-menu-connect-four.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.get("/connect-four/:roomId", (req, res) => {
    fs.readFile("index-connect-four.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.get("/domino/", (req, res) => {
    fs.readFile("index-menu-domino.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.get("/domino/:roomId", (req, res) => {
    fs.readFile("index-domino.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.get("/xadrez/", (req, res) => {
    fs.readFile("index-menu-xadrez.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.get("/xadrez/:roomId", (req, res) => {
    fs.readFile("index-xadrez.html", "utf-8", function (err, data) {
        res.send(data);
    });
});

app.listen(5000);