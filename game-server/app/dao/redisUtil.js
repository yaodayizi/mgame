var bluebird = require("bluebird");
var redis = bluebird.promisifyAll(require('redis'));

var redisConfig = require("../../config/redis.json");

//const asyncRedis = require("async-redis");

var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);

var redisUtil = module.exports;

redisUtil.redis = redis;


redisUtil.client = null;
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
		console.log("Redis:Error:" + err);
	});

	redisUtil.client.on("warning",function(e){
		console.log('warning',e);
	})
	//redisUtil.asyncClient = asyncRedis.decorate(redisUtil.client)
	//bluebrid.promisifyAll(redisUtil.client);
};


redisUtil.setUser = function(userData,cb=null){
	redisUtil.client.hmset(redisUtil.userKeyPre + userData.userid,userData,cb);
}


redisUtil.getUser = function(uid,cb){
	redisUtil.client.hgetall(redisUtil.userKeyPre + uid,cb);
}

redisUtil.setUserField = function(uid,field,val,cb){
	redisUtil.client.hmset(redisUtil.userKeyPre+uid,field,val,cb);
}

redisUtil.getRoomid =async function(){
/* 	let multi = redisUtil.client.multi();
	multi.incr('roomNumber').get('roomNumber');
	let res =await  multi.execAsync();
	console.log(res); */
	return await redisUtil.client.incrAsync('roomNumber');
}

redisUtil.setUserAsync = async function(userData){
	return await redisUtil.client.hmsetAsync(redisUtil.userKeyPre + userData.userid,userData);
}

redisUtil.getUserAsync = async function (uid){
	return await redisUtil.client.hgetallAsync(redisUtil.userKeyPre + uid);
}

redisUtil.setGoldIncr = async function(uid,num){
	return await redisUtil.client.hincrbyAsync(redisUtil.userKeyPre + uid,'gold',num);
}

//todo:暂时用development
redisUtil.create(redisConfig.development);

/*  async function test(){
 	let setRet = await redisUtil.setUserAsync({userid:'112233',name:'bbb',age:22});
	console.log(setRet);
 	let user = await  redisUtil.getUserAsync('112233');
	console.log(user); 
	let roomid  = await redisUtil.getRoomid();
	console.log(roomid);
	let ret22 = await redisUtil.setGoldIncr(1,20);
	console.log(ret22);
}

test(); */


/*   redisUtil.setUser({
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
/*
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

