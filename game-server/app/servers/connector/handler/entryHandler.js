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


Handler.prototype.enterGame = function(msg,session,next){
		token = msg.token;
		playerid = msg.playerid;
		serverid = pomelo.app.get('serverid');
		gameid = conts.ser('a=gma=ecishui ')
		jwt.verify(token,scret);
		var sessionService = this.app.get('sessionService');
        if (sessionService.getByUid(playerid)) {
            console.log('old player kick');
            sessionService.kick(playerid, 'have login in another place!', function () {
                console.log('kickCb');
            });
        }

		session.bind(playerid);
		session.set('playerId', playerId);
        session.set('serverId', msg.serverId);
		gameid = consts.gameList.bjl;

		

		next(null,{
			code:200,
			userid:user.userid,
			user_name:user.user_name,
			nick_name:nick_name,
			head:user.head,
			gold:user.gold,
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
