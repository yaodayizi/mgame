module.exports = {
        jwtkey: "SDF678SDFasdf2345",
        gameList: {
            1000:"bjl"
        },
        bjl: {
            gameState:{
                GAME_START:"gameStart",
                GAME_BET:"gameBet",
                GAME_CHECK:"gameCheck",
                GAME_CALC:"gameCalc",
                GAME_END:"gameEnd"           
            },
            //下注时间
            bet_time:15,
            //显示结果时间
            show_result_time:20,
            roomConfig: [{
                min_coin: 100,
                max_coin: 0,
                min_bet: 10,
                max_bet: 80
            }, {
                min_coin: 1000,
                max_coin: 0,
                min_bet: 100,
                max_bet: 800
            }, {
                min_coin: 10000,
                max_coin: 0,
                min_bet: 1000,
                max_bet: 8000
            }],
            pos:{
                BANKER:0,
                PLAYER:1,
                TIE:2,
                BANKER_PAIR:3,
                PLAYER_PAIR:4,
                BOTH_PAIR:5,
                BIG:6,
                SMALL:7}
            
            
        }


}