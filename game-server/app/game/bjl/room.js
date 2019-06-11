const pomelo = require("pomelo");
const simpleFsm = require("./SimpleFsm.js");
const config = require("../../../app/consts/consts.js");
const Baijiale = require("../bjl/bjl.js");
const playerList = [];
const betList = {};
const GameState = config.GameState;

function Room(roomid, gameid) {

    this.channelService = pomelo.app.get('channelService');
    let channelName = 'room_' + this.gameId + '_' + this.roomId;
    this.channel = this.channelService.getChannel(channelName, true);
    
}

Room.prototype.addPlayer = function (token, serverid, cb = null) {
    //todo:检测player是否在某个房间
    this.channel.add(uid, serverid);
    ret = {};
    this.channel.pushMessage('onPlayerEnter', ret, cb);
    this.playerList.push();

}

Room.prototype.kclick = function (uid, serverid, cb = null1) {
    this.channe.leave(uid, serverid);
    this.channel.pushMessage('onPlayerLeave', {
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
    var timeFsm = new SimpleFsm();
    var baijiale = new Baijiale();

    var playerCards = baijiale.playerCards;
    var bankerCards = baijiale.bankerCards;
    timeFsm.changeState(GameState.GAME_START, 0);
    timeFsm.on(GameState.GAME_START + "Enter", function () {
        //log('gameStart',this.curState);
        log('游戏开始');
        this.channe.pushMessage(GameState.GAME_START, null, null);
        if (baijiale.cardPool.length <= 7) {
            baijiale.cardPool = baijiale.baijiale.getCardPool();
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
        this.pushMessage(GameState.GAME_BET + "Enter", null, null);
        this.changeState(GameState.GAME_CHECK, consts.bjl.bet_time * 1000);
    });

    timeFsm.on(GameState.GAME_BET + "Leava", function () {
        log("下注结束");
        this.pushMessage(GameState.GAME_BET + "Leava", null, null);
    });

    timeFsm.on(GameState.GAME_CHECK + "Enter", function () {
        log("检查牌");
        //cardsToString(player);
        //cardsToString(banker);
        let isplayerDrawCard = Baijiale.isPlayerDrawCard(playerCards);
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
        this.changeState(GameState.GAME_END, 0);
        this.pushMessage(GameState.GameState.GAME_END + "Enter",res, null);


        this.changeState(GameState.GAME_START, consts.bjl.show_result_time * 1000);
        log('\n');
        log('next:下一局 5秒之后开始----------------------------');

    });
}



function cardsToString(cards) {
    _.forEach(cards, (val, index, vals) => {
        log(val.toString());
    });
}