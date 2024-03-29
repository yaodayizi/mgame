const pomelo = require("pomelo");
const _ = require("lodash");
const SimpleFsm = require("./SimpleFsm.js");
const consts = require("../../consts/consts.js");
const Baijiale = require("./bjl.js");
const sqlDao = require("../../dao/mysql/userDao");
const redisUtil = require("../../dao/redisUtil.js");
const logger = require('pomelo-logger').getLogger('room', pomelo.app.serverId).info;
const playerLogger = require('pomelo-logger').getLogger('player', pomelo.app.serverId).info;

let timeFsm = new SimpleFsm();
let {
    GameState,
    POS,
    ODDS,
    GameRet,
    roomConfig
} = consts.bjl;
let log = console.log;
log = function () {};

var Room = function (roomid, roomName, roomConfig, gameid = 1000) {
    this.roomConfig = roomConfig;
    this.roomid = roomid;
    this.roomName = roomName;
    this.gameid = gameid;
    this.channelService = pomelo.app.get('channelService');
    let channelName = 'room_' + gameid + '_' + roomid;
    this.channel = this.channelService.getChannel(channelName, true);
    this.roundID = 0;

    //用户列表
    this.playerList = {};
    //已下注 游戏未结束 已离开或已掉线用户
    this.playerOffList = {};
    //下注列表
    this.betList = {};
    //赔付
    this.paid = {};
    //用户下注总额
    this.userBets = {};
    this.history = {
        //0庄赢 1闲赢 2和
        //0没有对子 1庄对 2闲对 3都是对子
        roadData: [],
        //多少局
        count: {
            num: 0,
            tie: 0,
            banker: 0,
            player: 0,
            bankerPair: 0,
            playerPair: 0
        }
    }

    this.gameEndData = null;
    console.log(this.roomid, this.roomName, this.roomConfig, 'room create');
}
/**
 * 加入游戏
 * @param  {int} uid
 * @param  {string} serverid
 * @param  {function} cb=null
 * @returns {
 * {   
 *  roomid: any;
 *  roomName: any;
 *  roomConfig: any;
 *  user: any;
 *  roadData: {
 *       roadData: Array<String>;
 *       count: {
 *           num: number;
 *           tie: number;
 *           banker: number;
 *           player: number;
 *           bankerPair: number;
 *           playerPair: number;
 *       };
 *   };
 *    gameState: {
 *     state: string;
 *     time: number;
 *     }
 * }
 * }
 * 
 * 
 */
Room.prototype.addPlayer = async function (uid, serverid, cb = null) {
    //todo:检测player是否在这个房间
    if (!this.channel.getMember(uid)) {
        this.channel.add(uid, serverid);
    }

    //如果在已离线列表 移除
    if (this.playerOffList.hasOwnProperty(uid)) {
        delete this.playerOffList[uid];
    }

    let user = await redisUtil.getUserAsync(uid);
    user.roomid = this.roomid;
    user.serverid = serverid;
    user.gameid = this.gameid;
    this.playerList[uid] = user;

    this.channel.pushMessage('playerEnter', {
        user: user
    });
    playerLogger('   join game', uid, user.roomid);
 
    let ret = {
        roomid: this.roomid,
        roomName: this.roomName,
        roomConfig: this.roomConfig,
        user: user,
        roadData: this.getRoadData(),
        gameState: this.getGameState()
    };
    if (ret.gameState.state == GameState.GAME_END) {
        ret.gameState.gameEndData = this.gameEndData;
    }
    if (ret.gameState.state == GameState.GAME_BET) {
        ret.gameState.state += 'Enter';
    }
    return ret;
}

Room.prototype.kickPlayer = function (uid, serverid) {
    this.channel.leave(uid, serverid);
    //已下注 游戏未结束 暂时不从此房间删除用户 结算完毕再删除用户
    if (!this.userBets[uid] || this.getGameState().state == GameState.GAME_END) {
        delete this.playerList[uid];
    } else {
        this.playerOffList[uid] = uid;
    }

    this.channel.pushMessage('playerLeave', {
        uid: uid
    }, null);
    playerLogger('  playerLeave', 'kick', uid, serverid);
    return uid;
}


Room.prototype.bet = async function (uid, pos, coin, chipType, num, cb) {

    if (!this.isCanBet()) {
        return '下注时间已过';
    }

    if (!this.playerList[uid]) {
        return '用户不在此房间';
    }

    if (this.playerList[uid].gold < coin) {
        return '用户金钱不够';
    }



    if (!this.betList.hasOwnProperty(pos)) {
        this.betList[pos] = {};
    }
    if (!this.betList[pos].hasOwnProperty(uid)) {
        this.betList[pos][uid] = 0;
    }
    if (!this.userBets.hasOwnProperty(uid)) {
        this.userBets[uid] = 0;
    }

    if (this.roomConfig.max_bet < this.userBets[uid] + coin) {
        return '超过下注限额';
    }

    this.betList[pos][uid] += coin;
    this.userBets[uid] += coin;
    let ret =  redisUtil.setGoldIncr(uid,-coin);
    this.playerList[uid].gold = ret;

    let userBet = {
        uid: uid,
        pos: pos,
        coin: coin,
        chipType: chipType,
        num: num
    }

    playerLogger('  bet', ret,this.roomid, uid, pos, coin, chipType, num);
    this.channel.pushMessage(GameState.GAME_BET, userBet, null);
    return 'OK';

}

Room.prototype.initGame = function () {

    var baijiale = new Baijiale();


    var playerCards = baijiale.playerCards;
    var bankerCards = baijiale.bankerCards;
    var self = this;
    timeFsm.changeState(GameState.GAME_START, 0);
    timeFsm.on(GameState.GAME_START + "Enter", function () {
        //log('gameStart',this.curState);
        log(self.roomid, '游戏开始');
        self.roundID = Date.now() + Math.round(Math.random() * 9999);
        self.betList = {};
        self.paid = {};
        self.userBets = {};
        self.channel.pushMessage(GameState.GAME_START, {
            gameState: GameState.GAME_START
        }, null);
        if (baijiale.cardPool.length <= 7) {
            baijiale.cardPool = baijiale.getCardPool();
        }

        playerCards = [];
        bankerCards = [];

        log(self.roomid, '发牌');
        playerCards.push(baijiale.getCard());
        bankerCards.push(baijiale.getCard());
        playerCards.push(baijiale.getCard());
        bankerCards.push(baijiale.getCard());

        log(self.roomid, '发牌结束');
        this.changeState(GameState.GAME_BET, 0);
    }.bind(timeFsm));

    timeFsm.on(GameState.GAME_BET + "Enter", function () {
        log(self.roomid, '下注时间');
        self.channel.pushMessage(GameState.GAME_BET + "Enter", {
            time: consts.bjl.bet_time
        }, null);
        this.changeState(GameState.GAME_CHECK, consts.bjl.bet_time);
    });

    timeFsm.on(GameState.GAME_BET + "leave", function () {
        log(self.roomid, "下注结束");
        self.channel.pushMessage(GameState.GAME_BET + "leave", {
            msg: 'bet_end'
        }, null);
    });

    timeFsm.on(GameState.GAME_CHECK + "Enter", function () {
        log(self.roomid, "检查牌");
        //cardsToString(player);
        //cardsToString(banker);
        let isplayerDrawCard = baijiale.isPlayerDrawCard(playerCards);
        if (isplayerDrawCard) {
            playerCards.push(baijiale.getCard());
            //cardsToString(playerCards);
        }

        let isBankerDrawCard = baijiale.isBankerDrawCard(playerCards, bankerCards);
        if (isBankerDrawCard) {
            bankerCards.push(baijiale.getCard());
            //cardsToString(bankerCards);
        }
        this.changeState(GameState.GAME_CALC, 0);

    });

    timeFsm.on(GameState.GAME_CALC + "Enter", function () {
        this.changeState(GameState.GAME_END, 2);
    });


    timeFsm.on(GameState.GAME_END + "Enter", async function () {

        playerValue = baijiale.calculateHandValue(playerCards);
        bankerValue = baijiale.calculateHandValue(bankerCards);
        log(`plalyer:${playerValue}  banker:${bankerValue}`);
        let ret = baijiale.calculateAll(playerCards, bankerCards);
        log(self.roomid, 'gameend', ret);

        //计算赔付
        let pos = 0;
        let odds = 0;
        let historyWin = 0;
        let historyPair = 0;
        switch (ret.win) {
            case GameRet.TIE:
                pos = POS.TIE;
                historyWin = 2;
                self.history.count.tie++;
                break;
            case GameRet.PLAYER:
                pos = POS.PLAYER;
                historyWin = 1;
                self.history.count.player++;
                break;
            case GameRet.BANKER:
                pos = POS.BANKER;
                historyWin = 0;
                self.history.count.banker++;
        }

        odds = ODDS[pos];
        self.computerPaid(pos, odds);

        if (ret.win == GameRet.TIE) {
            //和局 押庄闲的退筹码
            self.computerPaid(1, 0);
            self.computerPaid(0, 0);

        }

        if (ret.pair == GameRet.BOTH) {
            odds = ODDS[POS.PLAYER];
            pos = POS.PLAYER;
            self.computerPaid(pos, odds);
            pos = POS.BANKER;
            odds = ODDS[POS.PLAYER];
            self.computerPaid(pos, odds);
            historyPair = 3;
            self.history.count.bankerPair++;
            self.history.count.playerPair++;
        } else if (ret.pair == GameRet.PLAYER) {
            odds = ODDS[POS.PLAYER];
            pos = POS.PLAYER;
            self.computerPaid(pos, odds);
            historyPair = 2;
            self.history.count.bankerPair++;
        } else if (ret.pair == GameRet.BANKER) {
            odds = ODDS[POS.BANKER];
            pos = POS.BANKER;
            self.computerPaid(pos, odds);
            historyPair = 1;
            self.history.count.bankerPair++;
        }


        let betPaid = {};
        let sqls = [];
        let goldSqls = [];
        let betSqls = [];
        //insert into t_user (userid,gold) values (1,10000),(4,9998)  on duplicate key update gold = VALUES(gold);
        _.forEach(self.userBets, function (val, uid) {
            betPaid[uid] = {
                bet: 0,
                paid: 0,
                gold: self.playerList[uid].gold
            };
            betPaid[uid].bet = self.userBets[uid];
/*             redisUtil.setUserAsync({
                userid: uid,
                gold: self.playerList[uid].gold
            }).then(
                //ret=>console.log('redisRet',ret)
            ).catch(
                e => console.log('err', e)
            ); */


        }.bind(self));

        _.forEach(self.paid, function (val, pos) {
            let paidPos = self.paid[pos];
            _.forEach(paidPos, function (val, uid) {
                if (betPaid[uid]) {
                    betPaid[uid].paid += val.coin;
                }
            });
        });

        _.forEach(betPaid, function (val, uid) {
            //uid,gameid,roomid,roundid,bet,paid
            let sql = `('${uid}','${parseInt(val.paid - val.bet)}')`;
            goldSqls.push(sql);


            let str = [uid, self.gameid, self.roomid, self.roundID, val.bet, val.paid].join("','");
            str = `('${str}')`;
            betSqls.push(str);
        }.bind(self));

        //路书数据
        //0庄赢 1闲赢 2和
        //0没有对子 1庄对 2闲对 3都是对子

        let gameInfo = historyWin + '|' + historyPair + '|' + bankerValue + '|' + playerValue;
        self.history.roadData.push(gameInfo);
        self.history.count.num++;


        //删除已离开用户
        _.forEach(self.playerOffList, function (uid, key) {
            delete self.playerList[uid];
        }.bind(this));
        self.playerOffList = {};

        if (goldSqls.length > 0) {
            //insert into t_user (userid,gold) values (1,-20) on duplicate key update gold =gold + VALUES(gold)
            let goldSql = `insert into t_user (userid,gold) values  ${goldSqls.join(',')} on duplicate key update gold =gold + VALUES(gold)`;
            sqls.push(goldSql);
        }

        if (betSqls.length > 0) {
            let betSql = `insert into t_bet (uid,gameid,roomid,roundid,bet,paid) values ${betSqls.join(',')}`
            sqls.push(betSql);
        }

        if (betSqls.length > 0) {
            let gameSql = `insert into t_game (gameid,roomid,room_name,roundid,game_info) VALUES('${self.gameid}','${self.roomid}','${self.roomName}','${self.roundID}','${gameInfo}')`;
            sqls.push(gameSql);
        }

        if (sqls.length > 0) {
            //let sqlsStr = sqls.join(';');
            //console.log('=========================',sqlsStr);
            for (let i = 0; i < sqls.length; i++) {
                console.log('=========================', sqls[i]);
                sqlDao.exec(sqls[i]).then(
                    ret => console.log(ret.affectedRows)
                ).catch(e => console.log(e));
            }
        }


        let res = {
            result: ret,
            paid: self.paid,
            betPaid: betPaid,
            cards: {
                player: playerCards,
                banker: bankerCards
            },
            value: {
                player: playerValue,
                banker: bankerValue
            },
            //gold:self.playerList[uid].gold,
            time: consts.bjl.show_result_time
        }
        self.gameEndData = res;
        self.channel.pushMessage(GameState.GAME_END, res, null);

        this.changeState(GameState.GAME_START, consts.bjl.show_result_time);
        log('\n');
        log(self.roomid, 'next:下一局 ', consts.bjl.show_result_time, '秒之后开始----------------------------');

    });
}

/**
 * 赔付
 * @param  {位置} pos
 * @param  {赔率} odds
 */
Room.prototype.computerPaid = async function (pos, odds) {
    if (!this.betList[pos]) return;
    _.forEach(this.betList[pos], function (val, key) {
        let coin = val + val * odds;
        let ret  = redisUtil.setGoldIncr(key,coin);
        this.playerList[key].gold = ret;
        this.paid[pos] = {};
        this.paid[pos][key] = {
            val: val,
            coin: coin,
            gold: this.playerList[key].gold
        };

    }.bind(this));
};

Room.prototype.isCanBet = function () {
    return timeFsm.getState().state == GameState.GAME_BET;
}
/**
 * 得到游戏状态
 * @returns {{
 *  state: string;
 *  time: number;
}}
 */
Room.prototype.getGameState = function () {
    return timeFsm.getState();
}

Room.prototype.getRoadData = function (count = 50) {
    return {
        roadData: this.history.roadData.slice(-count),
        count: this.history.count
    };
}

Room.prototype.isCanExit = function (uid) {
    if (this.userBets[uid] && this.getGameState().state != GameState.GAME_END) {
        return false;
    } else {
        return true;
    }
}

module.exports = Room;


function cardsToString(cards) {
    _.forEach(cards, (val, index, vals) => {
        log(val.toString());
    });
}