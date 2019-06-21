var roomManager = require('../../../game/bjl/roomManager.js');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;

handler.bet = function(msg,session,next){
    let uid = session.get('uid');
    let roomid = session.get('roomid');
    roomManager.bet(uid,roomid,msg.pos,msg.coin,msg.chipType,msg.num).then(function(ret){
        next(null,ret);
    }).catch(function(e){
        next(null,e);
    })
    
}
