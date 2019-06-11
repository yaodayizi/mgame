var redis = require('redis');
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('./utils');
var async = require('async');

var redisUtil = module.exports;

var USER_DATA_FIELD_ALL = ["mid", "nick", "sex", "gold", "diamond", "head_url", "gameServerType", "gameServerID", "roomNum", "state", "sid"];
var USER_DATA_FIELD_COMMON = ["mid", "nick", "sex", "gold", "diamond", "head_url"];

var getKeyByMid = function (mid) {
	if (utils.midCheck(mid)) {
		return mid + "_userInfo";
	} else {
		logger.error("mid illegal" + mid);
		return null;
	}
};

var getDefaultUserData = function () {
	var data = {
		mid: 0, 									//mid
		nick: "", 									//昵称
		sex: 0, 									//性别
		gold: 0, 									//金币数量
		diamond: 0, 								//钻石数量
		head_url: "", 								//头像
		gameServerType: "",							//当前所在游戏服务器类型
		gameServerID: "", 							//当前所在游戏服务器ID ""-没有在游戏中 "mj-server-1"-服务器ID
		roomNum: "", 								//当前所在游戏房间号
		state: 0,   								//当前状态 0-大厅 1-匹配中 2-在房间
	};

	return data
};

/**
 * 创建redis客户端
 *
 */
redisUtil.create = function () {
	var client = pomelo.app.get('redisClient');
	if (!!client) {
		return client;
	}

	var redisConfig = pomelo.app.get('redisConfig');
    client = redis.createClient(redisConfig.port, redisConfig.host, {});

    client.on("connect", function () {
        logger.info("redis connected");
    });

    client.on("error", function (err) {
        logger.error("Redis:Error:" + err);
    });

    return client;
};
