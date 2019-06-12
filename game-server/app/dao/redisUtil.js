var redis = require('redis');
var redisConfig = require("../../config/redis.json");
const asyncRedis = require("async-redis");

var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);

var redisUtil = module.exports;
const { promisify } = require('util');





/**
 * 创建redis客户端
 *
 */
redisUtil.create = function() {

	var config = redisConfig.development;
	if(redisUtil.client){
		return redisUtil.client;
	}
    client = redis.createClient(config.port, config.host, {});

    client.on("connect", function () {
        logger.info("redis connected");
    });

    client.on("error", function (err) {
        logger.error("Redis:Error:" + err);
    });

    return client;
};


redisUtil.setUserData = function(userData,cb){
	redisUtil.client.hmset(userData.userid,userData,cb);
}


redisUtil.getUserData = function(uid,cb){
	redisUtil.client.hgetall(uid,cb);
}

redisUtil.client = redisUtil.create();
const asyncRedisClient = asyncRedis.decorate(client);



async function setUser(data){
	return await asyncRedisClient.hmset('0000',data);
}

async function getUser(uid){
	return await asyncRedisClient.hgetall('0000');
}

/* redisUtil.client.set('products','aaa',async function(err,res){
	let aa = await getValue();
	console.log(aa);
	
}); */

let setRet =  setUser({name:'bbb',age:22});
console.log(setRet);
let user =  getUser('0000');
console.log(user);

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

redisUtil.getUserData('user_12314246',function(err,res){
	if(err){
		logger.err(err);
	}else{
		console.log(res);
	}
});

