var roomManager = require('../../../game/bjl/roomManager.js');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;


/**
 * 下注
 * @param  {{pos,coin,chipType,num}} msg  pos下注位置,coin 金币,chipType 筹码,num 筹码个数
 * @param  {} session
 * @param  {} next
 * @returns {string} OK成功 其他为失败消息
 */
handler.bet = function(msg,session,next){
    let uid = session.get('uid');
    let roomid = session.get('roomid');
    roomManager.bet(uid,roomid,msg.pos,msg.coin,msg.chipType,msg.num).then(function(ret){
        next(null,ret);
    }).catch(function(e){
        next(null,e);
    })
    
}


/**
 * 加入房间
 * @param  {{roomid}} msg  
 * @param  {} session
 * @param  {} next
 */
handler.joinRoom = function(msg,session,next){
    let uid = session.get('uid');
    let serverid = session.get('serverid');
    let roomid = msg.roomid;

    roomManager.joinRoom(uid,serverid,roomid).then(function(ret){
        session.set('roomid',ret.user.roomid);
        session.pushAll();
        next(null,{code:200,data:ret});
    }.bind(this)).catch(function(e){
        next(null,e);
    });
}

/**
 * 离开房间
 * @param  {{}} msg
 * @param  {} session
 * @param  {} next
 * 
 */
handler.leaveRoom = function(msg,session,next){
    let uid = session.get('uid');
    let serverid = session.get('serverid');
    let roomid = session.get('roomid');

    msg.uid = uid;
    msg.serverid = serverid;
    msg.roomid = roomid;
    let ret = roomManager.leaveRoom(msg);
    next(null,ret);
   
}

/**
 * 得到所有房间信息
 * @param  {{num }} msg num 历史数据条数
 * @param  {} session
 * @param  {} next
 */
handler.getAllRoomData = function(msg,session,next){
    let roomid = session.get('roomid');
    let ret = roomManager.getAllRoomData(roomid,msg.num);
    next(null,ret);
}