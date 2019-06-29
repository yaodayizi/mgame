var roomManager = require('../../../game/bjl/roomManager.js');

module.exports = function (app) {
    return new GameRemote(app);
};

var GameRemote = function (app) {
    this.app = app;
};

/**
 * 进入游戏
 * @param  {} msg
 * @param  {function} cb
 */
GameRemote.prototype.enterGame = function (msg, cb) {
    console.log('gameRemote.enterGame caught ------------------');

    let ret =  roomManager.enterGame();
    cb(null,{code:200,data:ret});
};


/**
 * 从房间踢出用户
 * @param  {uid,serverid,roomid} data
 * @param  {function} cb
 * @returns uid
 */
GameRemote.prototype.kick = function (data,cb) {
    console.log('GameRemote.kick caught >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    let ret = roomManager.kick(data);
    cb(ret);
};


