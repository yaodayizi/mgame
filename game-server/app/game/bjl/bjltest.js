const EventEmitter = require("events").EventEmitter;
const _ = require("lodash");
const SimpleFsm = require("./SimpleFsm.js");
const Baijiale = require("./bjl.js");
const GameState = {
    GAME_START:"gamestart",
    GAME_BET:"gameBet",
    GAME_CHECK:"gameCheck",
    GAME_CALC:"gameCalc",
    GAME_END:"gameEnd"
}

var log = console.log;


function cardsToString(cards){
   let ss =  cards.reduce((strs,card)=>{
       return strs += ' '+card.toString();
    });
    log(ss);
}

var timeFsm = new SimpleFsm();
var baijiale = new Baijiale();

var playerCards = baijiale.playerCards;
var bankerCards = baijiale.bankerCards;
var count =0;

playerCards =[];
bankerCards = [];
timeFsm.changeState(GameState.GAME_START,0);
timeFsm.on(GameState.GAME_START+"Enter",function(){
    //log('gameStart',this.curState);
    log('游戏开始');
    
    if(baijiale.cardPool.length <=7){
        baijiale.cardPool = baijiale.baijiale.getCardPool();
    }
    playerCards =[];
    bankerCards = [];
    

    log('发牌');
    playerCards.push(baijiale.getCard());
    bankerCards.push(baijiale.getCard());
    playerCards.push(baijiale.getCard());
    bankerCards.push(baijiale.getCard());
    
    log('发牌结束');
    this.changeState(GameState.GAME_BET,0);
}.bind(timeFsm));

timeFsm.on(GameState.GAME_BET+"Enter",function(){
    log('下注时间');
    this.changeState(GameState.GAME_CHECK,5*1000);
});

timeFsm.on(GameState.GAME_BET+"Leava",function(){
    log("下注结束");
});

timeFsm.on(GameState.GAME_CHECK+"Enter",function(){
    log("检查牌");
    cardsToString(playerCards);
    cardsToString(bankerCards);
    let isplayerDrawCard = baijiale.isPlayerDrawCard(playerCards);
    if(isplayerDrawCard){
        playerCards.push(baijiale.getCard());
        cardsToString(playerCards);
    }

    let isBankerDrawCard = baijiale.isBankerDrawCard(playerCards,bankerCards);
    if(isBankerDrawCard){
        bankerCards.push(baijiale.getCard());
        cardsToString(bankerCards);
    }
    this.changeState(GameState.GAME_CALC,0);

});

timeFsm.on(GameState.GAME_CALC+"Enter",function(){
    playerValue =  baijiale.calculateHandValue(playerCards);
    bankerValue =  baijiale.calculateHandValue(bankerCards);
    log(`plalyer:${playerValue}  banker:${bankerValue}`);
    let ret = baijiale.calculateAll(playerCards,bankerCards);
    log(ret);
    timeFsm.changeState(GameState.GAME_END,0);
}.bind(this));


timeFsm.on(GameState.GAME_END+"Enter",function(){
    count++;
    if(count>20){
        return false;
    }

   // this.changeState(GameState.GAME_START,10*1000);
    log('\n');
    log('next:下一局 5秒之后开始----------------------------');

});
