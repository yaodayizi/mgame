const EventEmitter = require("events").EventEmitter;
const _ = require("lodash");
const SimpleFsm = require("./SimpleFsm.js");
const {GameResult,Baijiale,Card,Hand} = require("./bjl.js");
const GameState = {
    GAME_START:"gamestart",
    GAME_BET:"gameBet",
    GAME_CHECK:"gameCheck",
    GAME_CALC:"gameCalc",
    GAME_END:"gameEnd"
}

var log = console.log;

// 获取一副打乱排序的牌
// 这个不包括大小王
function getCards() {
    var cards = [
        'DK', 'DQ', 'DJ', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'DA',
        'CK', 'CQ', 'CJ', 'C10', 'C9', 'C8', 'C7', 'C6', 'C5', 'C4', 'C3', 'C2', 'CA',
        'BK', 'BQ', 'BJ', 'B10', 'B9', 'B8', 'B7', 'B6', 'B5', 'B4', 'B3', 'B2', 'BA',
        'AK', 'AQ', 'AJ', 'A10', 'A9', 'A8', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', 'AA'];
    return _.shuffle(_.shuffle(cards));
}

// 获取牌池
function getCardPool(rid) {
    var cardPool = [];
    for (let i = 0; i < 8; i++) {
        cardPool = cardPool.concat(getCards());
    }

   // log('牌池：', cardPool.length, cardPool.toString());

    return cardPool;
}

function getCard(rid){
    let item = cardPoolObj[rid].shift();
    let valueArr = _.toArray(item);
    let suit = Card.mapping[valueArr[0]];
    let value = item.substr(1);
    return new Card(suit,value);
}

function cardsToString(cards){
    _.forEach(cards,(val,index,vals)=>{
        log(val.toString());
    });
}


var cardPoolObj = {};
cardPoolObj[0] = getCardPool(0);
var player={
    cards:[]
};
var banker = {
    cards:[]
};

var count = 0;
log(cardPoolObj[0].join(','));



var timeFsm = new SimpleFsm();
timeFsm.changeState(GameState.GAME_START,0);
timeFsm.on(GameState.GAME_START+"Enter",function(){
    //log('gameStart',this.curState);
    log('游戏开始');
    if(cardPoolObj[0].length <=7){
        cardPoolObj[0] = getCardPool(0);
    }


    log('发牌');
    player.cards =[];
    banker.cards = [];
    player.cards.push(getCard(0));
    banker.cards.push(getCard(0));
    player.cards.push(getCard(0));
    banker.cards.push(getCard(0));
    
    log('发牌结束');
    this.changeState(GameState.GAME_BET,0);
}.bind(timeFsm));

timeFsm.on(GameState.GAME_BET+"Enter",function(){
    log('下注时间');
    this.changeState(GameState.GAME_CHECK,2*1000);
});

timeFsm.on(GameState.GAME_BET+"Leava",function(){
    log("下注结束");
});

timeFsm.on(GameState.GAME_CHECK+"Enter",function(){
    log("检查牌");
    cardsToString(player);
    cardsToString(banker);
    let isplayerDrawCard = Baijiale.isPlayerDrawCard(player.cards);
    if(isplayerDrawCard){
        player.cards.push(getCard(0));
        cardsToString(player);
    }

    let isBankerDrawCard = Baijiale.isBankerDrawCard(player.cards,banker.cards);
    if(isBankerDrawCard){
        banker.cards.push(getCard(0));
        cardsToString(banker);
    }
    this.changeState(GameState.GAME_CALC,0);

});

timeFsm.on(GameState.GAME_CALC+"Enter",function(){
    playerValue =  Baijiale.calculateHandValue(player.cards);
    bankerValue =  Baijiale.calculateHandValue(banker.cards);
    log(`plalyer:${playerValue}  banker:${bankerValue}`);
    let ret = Baijiale.calculateAll(player.cards,banker.cards);
    log(ret);
    this.changeState(GameState.GAME_END,0);
});


timeFsm.on(GameState.GAME_END+"Enter",function(){
    count++;
    if(count>20){
        return false;
    }
    log('\n');
    log('next:下一局 5秒之后开始----------------------------');

    this.changeState(GameState.GAME_START,10*1000);
});

