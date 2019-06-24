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

    roomManager.enterGame(msg).then(function(ret){
        cb(null,{code:200,data:ret});
    }).catch(function(e){
        cb(e);
    });
};

GameRemote.prototype.kick = function (data, cb) {
    console.log('GameRemote.kick caught >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    roomManager.kick(data);
    cb();
};


