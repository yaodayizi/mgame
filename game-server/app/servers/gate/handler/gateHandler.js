var dispatcher = require('../../../utils/dispatcher.js');
var userDao = require('../../../dao/mysql/userDao.js');
var consts = require('../../../consts/consts.js');
var _ = require("lodash");
var jwt = require("jsonwebtoken");

module.exports = function (app) {
	return new Handler(app);
};

var Handler = function (app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
handler.queryEntry = function (msg, session, next) {
/* 	var userid = msg.userid;
	if (!userid) {
		next(null, {
			code: 500
		});
		return;
	}
 */	// get all connectors
	var connectors = this.app.getServersByType('connector');
	if (!connectors || connectors.length === 0) {
		next(null, {
            code: 500,
            msg:'找不到服务器'
		});
		return;
	}
   
    var res = dispatcher.dispatch(session.id, connectors);
    next(null, {
        code: 200,
        host: res.host,
        port: res.clientPort
    });
};

handler.login = function(msg,session,next){
	if(!msg.username|| !msg.pasword){
		next({code:500,msg:'请填写用户名密码'});	
	}
	try{
		var user = userDao.login(msg.username,msg.password);
		if(user === false){
			next({code:500,msg:'用户名密码错误'});
		}
	}catch(e){
		next({code:500,err:e});
	}
	var token = jwt.sign({userid:userid},consts.jwtkey,{expiresInMinutes:60*60});
	next(null,{
		code:0,
		userid:user.userid,
		user_name:user.user_name,
		nick_name:nick_name,
		head:user.head,
		gold:user.gold,
		token:token
	});
};

handler.guestLogin = function(msg,session,next){
	
	var time = new Date().getTime();
	var name = time + _.random(1111,9999,false);
	console.log(name);
	user.user_name = '游客'+name;
	user.nick_name = "游客"+name;
	user.password = '123456';
	user.phone ='';
	user.gold = 3000;
	try{
		var ret = await userDao.createUser(user);
		user.userid = ret['insertId'];
	}catch(e){
		next({code:500,err:e});
	}
	var token = jwt.sign({userid:user.userid},consts.jwtkey,{expiresInMinutes:60*6});
	next(null,{
		code:0,
		userid:user.userid,
		user_name:user.user_name,
		nick_name:nick_name,
		head:user.head,
		gold:user.gold,
		token:token
	});
}
