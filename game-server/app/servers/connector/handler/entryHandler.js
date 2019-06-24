var pomelo = require('pomelo');
var userDao = require("../../../dao/mysql/userDao.js");
var redisUtil = require("../../../dao/redisUtil.js");
var jwt = require("jsonwebtoken");
var consts = require("../../../consts/consts.js");


module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

/**
 * @param  {token,gameType} msg
 * @param  {} session
 * @param  {} next
 */
Handler.prototype.enterGame = function(msg,session,next){
		let token = msg.token;
		let serverid = pomelo.app.getServerId();
		let gameid = consts.gameList[msg.gameType];
		let decode;
		try{
			decode = jwt.verify(token,consts.jwtkey);
		}catch(e){
			next(null,{code:500,msg:e.msg});
		}
		let uid = decode.userid;
		msg.uid = uid;
		msg.serverid = serverid;
		msg.gameid = gameid;
		//msg.isTraveller = decode.isTraveller;
		var sessionService = this.app.get('sessionService');
        if (sessionService.getByUid(uid)) {
            console.log('old player kick');
            sessionService.kick(uid, 'have login in another place!', function () {
                console.log('kickCb');
            });
        }

		session.bind(uid);
		session.set('uid', uid);
		session.set('serverid', serverid);
		
		var self = this;
		this.app.rpc.bjl.gameRemote.enterGame(session,msg,function(err,ret){
			if(err){
				next(null,{err:err.msg});
			}else{
				
				session.set('roomid',ret.data.user.roomid);
				//session.set('gameid',data.user.gameid);
				session.on('closed', onPlayerLeave.bind(null, self.app));
				session.pushAll();
				console.log('session',session.settings);
				
				console.log('join game ',ret.data.user.user_name);
				next(null,ret);
			}
		});

}



var onPlayerLeave = function (app, session) {

    console.log('用户离开 entryHandler.js onPlayerLeave .......................');

    var sessionService = app.get('sessionService');

    // log(sessionService.service.uidMap);

    if (!session || !session.uid) {
        console.log('return;');
        return;
    }

    var gameid = session.get('gameid'),
        roomid = session.get('roomid'),
        uid = session.get('uid'),
        serverid = session.get('serverid');

		var data = {
			gameid,
			roomid,
			uid,
			serverid
		};
    app.rpc.bjl.gameRemote.kick(session, data, function() {
        console.log('caught kickPlayer callback.................');
        console.warn('玩家 ' + data.playerId + ' 的连接断开了！');
    });

};



Handler.prototype.travellerLogin = function(msg,session,next){

}


Handler.prototype.login = async function(msg,session,next){
	if(!msg.username|| !msg.password){
		next(null,{code:500,err:{msg:'请填写用户名密码'}});	
	}
	try{
		var user = await userDao.login(msg.username,msg.password);

	}catch(e){
		next(null,{code:500,err:e});
		return;
	}

	if(user === false){
		next(null,{code:500,err:{msg:'用户名密码错误'}});
	}else{
		var token = jwt.sign({userid:user.userid,isTraveller:false},consts.jwtkey,{expiresIn:'36h'});
		var ret = {
			userid:user.userid,
			user_name:user.user_name,
			nick_name:user.nick_name,
			head:user.head,
			gold:user.gold
		}
		let result = await redisUtil.setUserAsync(ret);
		ret.token = token;
		next(null,{
			code:200,
			data:{user:ret}
		});
	}
};

Handler.prototype.guestLogin = async function(msg,session,next){
	
	var time = new Date().getTime();
	var name = time + _.random(1111,9999,false);
	console.log(name);
	user.user_name = 'G'+name;
	user.nick_name = "G"+name;
	user.head = "";
	user.password = '123456';
	user.phone ='';
	user.gold = 3000;
		//var ret = await userDao.createUser(user);
		//user.userid = ret['insertId'];
	user.userid = name;
	let result = await redisUtil.setUserAsync(ret);
	var token = jwt.sign({userid:user.userid,isTraveller:true},consts.jwtkey,{expiresIn:'5h'});
	user.token = token;
	next(null,{
		code:200,
		data:{user:user}
	});
}


/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
  next(null, {code: 200, msg: 'game server is ok.'});
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};
