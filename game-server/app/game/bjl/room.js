const pomelo = require("pomelo");
const _ = require("lodash");
const SimpleFsm = require("./SimpleFsm.js");
var consts = require("../../consts/consts.js");
const Baijiale = require("./bjl.js");
const redisUtil = require("../../dao/redisUtil.js");
var logger = require('pomelo-logger').getLogger('room', pomelo.app.serverId).info;
var bankerLog = require('pomelo-logger').getLogger('banker', pomelo.app.serverId).info;
var playerLogger = require('pomelo-logger').getLogger('player', pomelo.app.serverId).info;

var timeFsm = new SimpleFsm();
var log =console.log
var Room = function(roomid, gameid) {
    this.roomid = roomid;
    this.channelService = pomelo.app.get('channelService');
    let channelName = 'room_' + gameid + '_' + roomid;
    this.channel = this.channelService.getChannel(channelName, true);
    this.playerList = {};
    this.betList = {};
    
}

Room.prototype.addPlayer = async function (uid,serverid,cb = null) {
    //todo:检测player是否在某个房间
    this.channel.add(uid, serverid);
    let user = await redisUtil.getUserAsync(uid);
    user.roomid = this.roomid;
    user.serverid = serverid;
    ret = {user:user};
    this.channel.pushMessage('playerEnter', ret);
    this.playerList[uid] = user;
    cb(user);
}

Room.prototype.kclick = async function (uid, serverid, cb = null1) {
    this.channe.leave(uid, serverid);
    let ret = await redisUtil.setUserAsync({userid:uid,roomid:0,serverid:0});
    delete this.playerList[uid];

    this.channel.pushMessage('playerLeave', {
        uid: uid
    }, null);

}

Room.prototype.bet = function (uid, pos, coin, cb = null) {
    //todo:检测游戏状态是否下注时间
    if (!betList.hasOwnProperty(uid)) {
        betList[uid] = [];
    }
    //todo:检查是否限额,是否够赔钱
    betList[uid].push({
        pos: pos,
        coin: coin
    });
    return true;
}

Room.prototype.initGame = function () {
    
    var baijiale = new Baijiale();
    var GameState = consts.bjl.gameState;

    var playerCards = baijiale.playerCards;
    var bankerCards = baijiale.bankerCards;
    var self = this;
    timeFsm.changeState(GameState.GAME_START, 0);
    timeFsm.on(GameState.GAME_START + "Enter", function () {
        //log('gameStart',this.curState);
        log('游戏开始');
        self.channel.pushMessage(GameState.GAME_START, {gameState:GameState.GAME_START}, null);
        if (baijiale.cardPool.length <= 7) {
            baijiale.cardPool = baijiale.getCardPool();
        }

        playerCards = [];
        bankerCards = [];

        log('发牌');
        playerCards.push(baijiale.getCard());
        bankerCards.push(baijiale.getCard());
        playerCards.push(baijiale.getCard());
        bankerCards.push(baijiale.getCard());

        log('发牌结束');
        this.changeState(GameState.GAME_BET, 0);
    }.bind(timeFsm));

    timeFsm.on(GameState.GAME_BET + "Enter", function () {
        log('下注时间');
        self.channel.pushMessage(GameState.GAME_BET + "Enter", {bet_time:consts.bjl.bet_time}, null);
        this.changeState(GameState.GAME_CHECK, consts.bjl.bet_time * 1000);
    });

    timeFsm.on(GameState.GAME_BET + "Leava", function () {
        log("下注结束");
        self.channel.pushMessage(GameState.GAME_BET + "Leava", {msg:'bet_end'}, null);
    });

    timeFsm.on(GameState.GAME_CHECK + "Enter", function () {
        log("检查牌");
        //cardsToString(player);
        //cardsToString(banker);
        let isplayerDrawCard = baijiale.isPlayerDrawCard(playerCards);
        if (isplayerDrawCard) {
            playerCards.push(baijiale.getCard());
            cardsToString(playerCards);
        }

        let isBankerDrawCard = baijiale.isBankerDrawCard(playerCards, bankerCards);
        if (isBankerDrawCard) {
            bankerCards.push(baijiale.getCard());
            cardsToString(bankerCards);
        }
        this.changeState(GameState.GAME_CALC, 0);

    });

    timeFsm.on(GameState.GAME_CALC + "Enter", function () {
        this.changeState(GameState.GAME_END, 0);
    });


    timeFsm.on(GameState.GAME_END + "Enter", function () {

        playerValue = baijiale.calculateHandValue(playerCards);
        bankerValue = baijiale.calculateHandValue(bankerCards);
        log(`plalyer:${playerValue}  banker:${bankerValue}`);
        let ret = baijiale.calculateAll(playerCards, bankerCards);
        log(ret);
        let res = {
            result: ret,
            cards: {
                player: playerCards,
                banker: bankerCards
            },
            value: {
                player: playerValue,
                banker: bankerValue
            }
        }
        self.channel.pushMessage(GameState.GAME_END,res, null);


        this.changeState(GameState.GAME_START, consts.bjl.show_result_time * 1000);
        log('\n');
        log('next:下一局 5秒之后开始----------------------------');

    });
}


Room.isCanBet = function(){
    return simpleFsm.getState() == GameState.GAME_BET
}

Room.getGameState = function(){
    return simpleFsm.getState();
}

module.exports = Room;


function cardsToString(cards) {
    _.forEach(cards, (val, index, vals) => {
        log(val.toString());
    });
}