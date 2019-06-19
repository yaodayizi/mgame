var roomManager = require('../../../game/bjl/roomManager.js');

module.exports = function (app) {
    return new GameRemote(app);
};

var GameRemote = function (app) {
    this.app = app;
    // this.initRobot();
};

/*
 * 用户进入游戏
 * in: msg: {serverid, uid, token, gameid, playerName, isRobot, ip}
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
