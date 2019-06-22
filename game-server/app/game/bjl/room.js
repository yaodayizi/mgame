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
let {GameState,POS,ODDS,GameRet,roomConfig} = consts.bjl;
var log =console.log;
var Room = function(roomid, gameid) {
    this.roomConfig = roomConfig[0];
    this.roomid = roomid;
    this.channelService = pomelo.app.get('channelService');
    let channelName = 'room_' + gameid + '_' + roomid;
    this.channel = this.channelService.getChannel(channelName, true);
    this.roundID = 0;
    //用户列表
    this.playerList = {};
    //下注列表
    this.betList = {};
    //赔付
    this.paid = {};
    //用户下注总额
    this.userBets = {};
    this.history = {
        //0庄赢 1闲赢 2和
        //0没有对子 1庄对 2闲对 3都是对子
        gameRet:[],
        //多少局
        count:{
            num:0,
            bankerPair:0,
            playerPair:0
        }
    }
    
}

Room.prototype.addPlayer = async function (uid,serverid,cb = null) {
    //todo:检测player是否在某个房间
    if(!this.channel.getMember(uid)){
        this.channel.add(uid, serverid);
    }
    
    let user = await redisUtil.getUserAsync(uid);
    user.roomid = this.roomid;
    user.serverid = serverid;
    ret = {user:user};
    
    this.playerList[uid] = user;
    
    this.channel.pushMessage('playerEnter', ret);
    return {roomConfig:this.roomConfig,user:user}
}

Room.prototype.kickPlayer = async function (uid, serverid, cb = null) {
    this.channe.leave(uid, serverid);
    let ret = await redisUtil.setUserAsync({userid:uid,roomid:0,serverid:0});
    delete this.playerList[uid];
    this.channel.pushMessage('playerLeave', {
        uid: uid
    }, null);

}

Room.prototype.bet = async function (uid, pos, coin,chipType,num,cb) {
    //todo:检测游戏状态是否下注时间
     //todo:检查是否限额,是否够赔钱
    if(!this.isCanBet()){
        return '下注时间已过';
    }


    if(this.playerList[uid].gold<coin){
        return '用户金钱不够';
    }

    

    if (!this.betList.hasOwnProperty(pos)) {
        this.betList[pos] = {};
    }
    if (!this.betList[pos].hasOwnProperty(uid)) {
        this.betList[pos][uid] = 0;
    }
    if(!this.userBets.hasOwnProperty(uid)){
        this.userBets[uid] = 0;
    }

    if(this.roomConfig.max_bet < this.userBets[uid] + coin){
        return '超过下注限额';
    }

    this.betList[pos][uid] +=coin;
    this.userBets[uid] +=coin;
    this.playerList[uid].gold -=coin;

    let userBet = {
        uid:uid,
        pos: pos,
        coin: coin,
        chipType:chipType,
        num:num
    }

    console.log('--set gold--',uid,this.playerList[uid].gold);

    let ret = await redisUtil.setUserAsync({"userid":uid,"gold":this.playerList[uid].gold});
   
    this.channel.pushMessage(GameState.GAME_BET,userBet,null);
    return ret;
    
}

Room.prototype.initGame = function () {
    
    var baijiale = new Baijiale();
    

    var playerCards = baijiale.playerCards;
    var bankerCards = baijiale.bankerCards;
    var self = this;
    timeFsm.changeState(GameState.GAME_START, 0);
    timeFsm.on(GameState.GAME_START + "Enter", function () {
        //log('gameStart',this.curState);
        log('游戏开始');
        this.roundID = Date.now();
        self.betList = {};
        self.paid = {};
        self.userBets ={};
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
        this.changeState(GameState.GAME_END, 2000);
    });


    timeFsm.on(GameState.GAME_END + "Enter", function () {

        playerValue = baijiale.calculateHandValue(playerCards);
        bankerValue = baijiale.calculateHandValue(bankerCards);
        log(`plalyer:${playerValue}  banker:${bankerValue}`);
        let ret = baijiale.calculateAll(playerCards, bankerCards);
        log(ret);

        //计算赔付
        let pos =0;
        let odds=0;
        let historyWin=0;
        let historyPair=0;
        switch(ret.win){
            case GameRet.TIE:
                pos = POS.TIE;
                historyWin = 2;
                break;
            case GameRet.PLAYER:
                pos = POS.PLAYER;
                historyWin = 1;
                break;
            case GameRet.BANKER:
                pos = POS.BANKER;
                historyWin = 0;
        }

        odds = ODDS[pos];
        self.computerPaid(pos,odds);

        if(ret.win ==GameRet.TIE){
                //和局 押庄闲的退筹码
            self.computerPaid(1,0);
            self.computerPaid(0,0);

        }

        if(ret.pair == GameRet.BOTH){
            odds = ODDS[POS.PLAYER];
            pos = POS.PLAYER;
            self.computerPaid(pos,odds);
            pos = POS.BANKER;
            odds = ODDS[POS.PLAYER];
            self.computerPaid(pos,odds);
            historyPair = 3;
            self.history.count.bankerPair++;
            self.history.count.playerPair++;
        }else if(ret.pair == GameRet.PLAYER){
            odds = ODDS[POS.PLAYER];
            pos = POS.PLAYER;
            self.computerPaid(pos,odds);
            historyPair = 2;
            self.history.count.bankerPair++;
        }else if(ret.pair == GameRet.BANKER){
            odds = ODDS[POS.BANKER];
            pos = POS.BANKER;
            self.computerPaid(pos,odds);
            historyPair = 1;
            self.history.count.bankerPair++;
        }


        let betPaid = {};
        let sqls = [];
        //insert into t_user (userid,gold) values (1,10000),(4,9998)  on duplicate key update gold = VALUES(gold);
on duplicate key update gold = VALUES(gold)
       _.forEach(self.userBets,function(val,uid){
           betPaid[uid] = {bet:0,paid:0,gold:self.playerList[uid].gold};
           betPaid[uid].bet = self.userBets[uid];
           let sql = "("+uid+","+gold+")";
           sqls.push(sql);
       }.bind(self));

       _.foreach(self.paid,function(val,pos){
           let paidPos = self.paid[pos]; 
           _.forEach(paidPos,function(val,uid){
               if(betPaid[uid]){
                   betPaid[uid].paid += val.coin;
               }
           })
       });
        
       self.history.gameRet.push({id:self.roundID,win:historyWin,pair:historyPair});
       self.count.num++;


        let res = {
            result: ret,
            paid:self.paid,
            betPaid:betPaid,
            cards: {
                player: playerCards,
                banker: bankerCards
            },
            value: {
                player: playerValue,
                banker: bankerValue
            },
            //gold:self.playerList[uid].gold,
            show_result_time:consts.bjl.show_result_time
        }

        


        self.channel.pushMessage(GameState.GAME_END,res, null);


        this.changeState(GameState.GAME_START, consts.bjl.show_result_time * 1000);
        log('\n');
        log('next:下一局 ',consts.bjl.show_result_time,'秒之后开始----------------------------');

    });
}

/**
 * 赔付
 * @param  {位置} pos
 * @param  {赔率} odds
 */
Room.prototype.computerPaid =async function(pos,odds){
    if(!this.betList[pos]) return;
    _.forEach(this.betList[pos],function(val,key){
        let coin = val+val*odds;
        this.playerList[key].gold += coin;
        this.paid[pos] = {};
        this.paid[pos][key] = {val:val,coin:coin,gold:this.playerList[key].gold};
        redisUtil.setUserAsync({userid:key,gold: this.playerList[key].gold});

    }.bind(this));
};

Room.prototype.isCanBet = function(){
    return timeFsm.getState() == GameState.GAME_BET;
}

Room.prototype.getGameState = function(){
    return timeFsm.getState();
}

module.exports = Room;


function cardsToString(cards) {
    _.forEach(cards, (val, index, vals) => {
        log(val.toString());
    });
}