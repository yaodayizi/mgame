var pomelo = require('pomelo');
var userDao = require("../../../dao/mysql/userDao.js");
var jwt = require("jsonwebtoken");
var consts = require("../../../consts/consts.js");
module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};


Handler.prototype.login = function(msg,session,next){

	//jwt.verify(token,scret);
		//var sid = this.app.get("serverId");
		//var channel = this.channelSevice.getChannel('hall',true);
		//channel.add(session)
		var sessionService = this.app.get('sessionService');
		//var oldSession = sessionService.getByUid(user.userid)
		// if( !! oldSession) {
		// 	sessionService.kick(res.mid, "您的账号在其他地方登录");
		// }

		this.sessionService.bind(user.userid);
		this.sessionService.on('close',function(){
			//用户离线
		});
		//todo:刷新token
		var token = jwt.sign({userid:userid},consts.jwtkey,{expiresInMinutes:60*60});
		next(null,{
			code:200,
			userid:user.userid,
			user_name:user.user_name,
			nick_name:nick_name,
			head:user.head,
			gold:user.gold,
			token:token
		});

}

Handler.prototype.travellerLogin = function(msg,session,next){

}


Handler.prototype.enterGame = function(msg,session,next){

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
