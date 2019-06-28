var roomManager = require('../../../game/bjl/roomManager.js');

module.exports = function (app) {
    return new GameRemote(app);
};

var GameRemote = function (app) {
    this.app = app;
};

/*
 * 用户进入游戏
 * 
 */
GameRemote.prototype.enterGame = function (msg, cb) {
    console.log('gameRemote.enterGame caught ------------------');

    let ret =  roomManager.enterGame(msg);
    cb(null,{code:200,data:ret});
};



GameRemote.prototype.kick = function (data,cb) {
    console.log('GameRemote.kick caught >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    let ret = roomManager.kick(data);
    cb(ret);
};


