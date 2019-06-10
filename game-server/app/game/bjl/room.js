const pomelo = require("pomelo");
const simpleFsm = require("./SimpleFsm.js");
const config = require("../../../app/consts/consts.js");
const Baijiale = require("../bjl/bjl.js");
const playerList = [];
const betList = {};
const GameState = config.GameState;
function Room(roomid,gameid){

    this.channelService = pomelo.app.get('channelService');
    let channelName = 'room_' + this.gameId + '_' + this.roomId;
    this.channel = this.channelService.getChannel(channelName, true);

}

Room.prototype.addPlayer = function(uid,serverid,cb=null){
    //todo:检测player是否在某个房间
    this.channel.add(uid,serverid);
    ret = {};
    this.channel.pushMessage('onPlayerEnter', ret, cb);
    //this.playerList.push()
}

Room.prototype.kclick = function(uid,serverid,cb=null1){
    this.channe.leave(uid,serverid);
    this.channel.pushMessage('onPlayerLeave', { playerId: data.playerId }, null);

}

Room.prototype.bet = function(uid,pos,coin,cb = null){
    if(!betList.hasOwnProperty(uid)){
        betList[uid] = [];
    }
    //todo:检查是否限额,是否够陪
    betList[uid].push({pos:pos,coin:coin});
    return true;
}

Room.prototype.initGame = function(){
    var timeFsm = new SimpleFsm();
    var baijiale = new Baijiale();
    timeFsm.changeState(GameState.GAME_START,0);
    timeFsm.on(GameState.GAME_START+"Enter",function(){
        //log('gameStart',this.curState);
        log('游戏开始');
        
        if(baijiale.cardPoolObj.length <=7){
            baijiale.cardPoolObj = baijiale.getCardPool();
        }
    
    
        log('发牌');
        baijiale.playerCards =[];
        baijiale.banker.cards = [];
        baijiale.player.cards.push(getCard(0));
        baijiale.banker.cards.push(getCard(0));
        baijiale.player.cards.push(getCard(0));
        baijiale.banker.cards.push(getCard(0));
        
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
    
        this.changeState(GameState.GAME_START,10*1000);
        log('\n');
        log('next:下一局 5秒之后开始----------------------------');
    
    });
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



