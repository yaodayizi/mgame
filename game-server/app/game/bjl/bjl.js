
function GameResult(){

}
//平局
GameResult.Tie = 'tie';
/**
 * A banker win outcome
 */
GameResult.Banker = 'banker';
/**
 * A player win outcome
 */
GameResult.Player = 'player';

/**
 * A no natural result
 */
GameResult.NoNatural = 'none';

/**
 * A player natural 8
 */
GameResult.PlayerNatural8 = 'player8';
/**
 * A player natural 9
 */
GameResult.PlayerNatural9 = 'player9';
/**
 * A banker natural 8
 */
GameResult.BankerNatural8 = 'banker8';
/**
 * A banker natural 9
 */
GameResult.BankerNatural9 = 'banker9';
/**
 * A player pair
 */
GameResult.PlayerPair = 'player';
/**
 * A banker pair
 */
GameResult.BankerPair = 'banker';
/**
 * 双方都有对子
 */
GameResult.BothPair = 'both';
/**
 * A no pair result
 */
GameResult.NoPair = 'none';

GameResult.No = "none";


function Card(suit,value){
    this.suit = suit;
    this.value = value;
}

Card.defultValues = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
Card.DefaultSuits = ['club', 'diamond', 'heart', 'spade'];
Card.mapping = {"A":"spade","B":"heart","C":"club","D":"diamond"};
Card.StandardSuitUnicodeStrings = {
	heart: '♥',
	diamond: '♦',
	club: '♣',
	spade: '♠',
};
Card.prototype.toString = function(){
        let suit = Card.StandardSuitUnicodeStrings[this.suit] || this.suit;

        return `Card ${suit} ${this.value}`;
}


function Hand(playerCards = [], bankerCards = []) {
    this.playerCards = playerCards;
    this.bankerCards = bankerCards;
}


function Baijiale(hand){
    let result = {
        outcome: GameResult.Tie,
        natural: GameResult.NoNatural,
        pair: GameResult.NoPair,
    };

    result.outcome = this.calculateOutcome(hand);
    result.natural = this.calculateNatural(result.outcome, hand);
    result.pair = this.calculatePairs(hand);

    return result;

}


/**
 * 计算赢家
 */
Baijiale.calculateOutcome = function(playerCards = [], bankerCards = []) {
    let playerValue = this.calculateHandValue(playerCards);
    let bankerValue = this.calculateHandValue(bankerCards);

    let difference = bankerValue - playerValue;

    if (difference === 0) return GameResult.Tie;
    else if (difference > 0) return GameResult.Banker;
    else return GameResult.Player;
}

/**
 * 天生赢家
 */
Baijiale.calculateNatural = function(outcome, playerCards = [], bankerCards = []) {
    let cardsToCheck;

    switch (outcome) {
        case GameResult.Player:
            cardsToCheck = playerCards;
            break;
        case GameResult.Banker:
            cardsToCheck = bankerCards;
            break;
        default:
            return GameResult.NoNatural;
    }

    if (cardsToCheck.length === 2) {
        let handValue = this.calculateHandValue(cardsToCheck);

        if (handValue === 8)
            return outcome + '8';
        else if (handValue === 9)
            return outcome + '9';
    }

    return GameResult.NoNatural;
}

/**
 * 计算庄闲对子
 */
Baijiale.calculatePairs = function({playerCards = {}, bankerCards = {}}) {
    const isPlayerPair = this.calculatePair(playerCards);
    const isBankerPair = this.calculatePair(bankerCards);

    if (isPlayerPair && isBankerPair)
        return GameResult.BothPair;
    else if (isPlayerPair)
        return GameResult.PlayerPair;
    else if (isBankerPair)
        return GameResult.BankerPair;
    else
        return GameResult.NoPair;
}

/**
 * 计算对子
 */
Baijiale.calculatePair = function(cards = []) {
    if (cards.length !== 2)
        return false;

    let [firstCard, secondCard] = cards;

    return firstCard.value === secondCard.value;
}

/**
 * 手牌点数
 */
Baijiale.calculateHandValue = function(cards = []) {
    let cardsValue = cards.reduce((handValue, card) => {
        return this.valueForCard(card) + handValue;
    }, 0);

    return cardsValue % 10;
}

Baijiale.calculateAll = function(playerCards = {}, bankerCards = {}){
    let ret = {
    }
    ret.pair = this.calculatePairs(playerCards,bankerCards);
    ret.win = this.calculateOutcome(playerCards,bankerCards);
    ret.natural = this.calculateNatural(ret.win,playerCards,bankerCards);
    return ret;
}

Baijiale.valueForCard = function ({suit, value = 0}) {
    switch (value) {
        case 'A': return 1;
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        case '5': return 5;
        case '6': return 6;
        case '7': return 7;
        case '8': return 8;
        case '9': return 9;
        case '10':
        case 'J':
        case 'Q':
        case 'K':
            return 0;
        default: return 0;
    }
}

Baijiale.isPlayerDrawCard = function(playerCards = {}){
    let playerValue = this.calculateHandValue(playerCards);
    if(playerCards.length==2){

        if(playerValue > 5){
            //都不补牌;
            return false;
        }

        if(playerValue < 6 ){
            //player补牌
            return true;
        }
    }
    return false;
}

Baijiale.isBankerDrawCard = function(playerCards = {},bankerCards = {}){
    let playerValue = this.calculateHandValue(playerCards);
    let bankerValue  = this.calculateHandValue(bankerCards);
    let card3Value = this.valueForCard(playerCards[2]);
    if(bankerValue < 2){
        return true;
    }

    if(playerCards.length==3){

        if(bankerValue > 6){
            return false;
        }

        // 庄家是3点且玩家第三张牌是8，不补牌
        if(bankerValue == 3 && card3Value == 8 ){
            return false;
        }
         // 庄家是4点且闲家第3张牌是1,8,9,10,11,12,13 (0,1,8,9)
        if(bankerValue == 4 && (card3Value <=1 || card3Value >=8)){
            return false;
        }
        // 庄家是5点且闲家第3张牌是0,1,2,3,8,9 (1,2,3 8,9,10,11,12,13)
        if(bankerValue == 5 && (card3Value<=3 || card3Value >=8)){
            return false;
        }
        // 庄家是6点且玩家第3张牌是不是6或7
        if(bankerValue == 6 && (card3Value!=6 && card3Value !=7)){
            return false;
        }
        return true;

    }else if(bankerValue > 2){
        return false;
    }
}

module.exports = {
    GameResult:GameResult,
    Baijiale:Baijiale,
    Card:Card,
    Hand:Hand
}