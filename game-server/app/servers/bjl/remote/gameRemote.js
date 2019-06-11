var roomManager = require('../../../services/bjl/roomManager');

module.exports = function (app) {
    return new GameRemote(app);
};

var GameRemote = function (app) {
    this.app = app;
    // this.initRobot();
};

/*
 * 用户进入游戏
 * in: msg: {serverId, uid, token, gameId, playerName, isRobot, ip}
 */
GameRemote.prototype.enterGame = function (msg, cb) {
    console.log('gameRemote.enterGame caught ------------------');

    roomManager.enterGame(msg, cb);
};

GameRemote.prototype.kick = function (data, cb) {
    console.log('GameRemote.kick caught >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    roomManager.kick(data);
    cb();
};