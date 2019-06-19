var redis = require('redis');
var redisConfig = require("../../config/redis.json");
const asyncRedis = require("async-redis");

var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);

var redisUtil = module.exports;




redisUtil.client = null;
redisUtil.asyncClient = null;
redisUtil.userKeyPre = 'users_';
/**
 * 创建redis客户端
 *
 */
redisUtil.create = function(config) {

	if(redisUtil.client){
		return ;
	}
    redisUtil.client = redis.createClient(config.port, config.host, {});

    redisUtil.client.on("connect", function () {
        logger.info("redis connected");
    });

    redisUtil.client.on("error", function (err) {
        logger.error("Redis:Error:" + err);
	});
	redisUtil.asyncClient = asyncRedis.decorate(redisUtil.client)
};


redisUtil.setUser = function(userData,cb){
	redisUtil.client.hmset(redisUtil.userKeyPre + userData.userid,userData,function(err,res){
		if(err){
			cb(err);
		}else{
			cb(null,res);
		}
	});
}


redisUtil.getUser = function(uid,cb){
	redisUtil.client.hgetall(redisUtil.userKeyPre + uid,cb);
}

redisUtil.setUserField = function(field,data,cb){

}



redisUtil.setUserAsync = async function(userData){
	return await redisUtil.asyncClient.hmset(redisUtil.userKeyPre + userData.userid,userData);
}

redisUtil.getUserAsync = async function (uid){
	return await redisUtil.asyncClient.hgetall(redisUtil.userKeyPre + uid);
}

redisUtil.create(redisConfig.development);

/* async function test(){
	let setRet = await redisUtil.setUserAsync({name:'bbb',age:22});
	console.log(setRet);
 	let user = await  redisUtil.getUserAsync('0000');
	console.log(user);
}

test(); */


/*  redisUtil.setUserData({
	userid:'user_1231424',
	user_name:'aaa',
	nick_name:'哦哦哦',
	gold:3000,
	gameid:1000,
	roomid:1001
},function(err,res){
	if(err){
		console.log(err);
	}else{
	console.log(res);
	//expect(res).a('object');
	}
	
});

redisUtil.setUserData({
	userid:'user_1231424',
	user_name:'aaa',
	nick_name:'哦哦哦',
	gold:3000,
	gameid:1000,
	roomid:1001
},function(err,res){
	if(err){
		console.log(err);
	}else{
	console.log(res);
	//expect(res).a('object');
	}
	
}); */

/* redisUtil.getUserData('user_12314246',function(err,res){
	if(err){
		logger.err(err);
	}else{
		console.log(res);
	}
}); */

