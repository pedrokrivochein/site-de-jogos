class Room {
    constructor(_id, _data) {
        this.id = _id;
        this.data = _data;
    }
}

var roomsList = {};

function create(game, id) {
    roomsList[game] = [];
    roomsList[game].push(new Room(id, {}));
}


function exists(game, id) {
    for (var x in roomsList[game]) {
        if (roomsList[game][x].id == id) {
            return true;
        }
    }
    return false;
}
function updateData(game, id, update) {
    roomsList[game][indexInList(game, id)] = new Room(id, update);
}

function getData(game, id) {
    return roomsList[game][indexInList(game, id)].data;
}

function remove(game, id) {
    roomsList[game].splice(indexInList(game, id), 1);
}

function indexInList(game, id) {
    for (var x in roomsList[game]) {
        if (roomsList[game][x].id == id) {
            return x;
        }
    }
}

module.exports = {roomsList, create, exists, updateData, getData, remove}