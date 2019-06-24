module.exports = {
        jwtkey: "SDF678SDFasdf2345",
        gameList: {
            1000:"bjl"
        },
        bjl: {
            GameState:{
                GAME_START:"gameStart",
                GAME_BET:"gameBet",
                GAME_CHECK:"gameCheck",
                GAME_CALC:"gameCalc",
                GAME_END:"gameEnd",
                GAME_STOP:"gameStop"           
            },
            //下注时间
            bet_time:15,
            //显示结果时间
            show_result_time:15,
            roomConfig: [{
                //最少携带金币
                min_coin: 1000,
                max_coin: 0,
                //最少下注
                min_bet: 100,
                max_bet: 800
            }, {
                min_coin: 1000,
                max_coin: 0,
                min_bet: 100,
                max_bet: 2000
            }, {
                min_coin: 10000,
                max_coin: 0,
                min_bet: 500,
                max_bet: 5000
            }],
            GameRet:{
               TIE:"tie",
               BANKER:"banker",
               PLAYER:"player",
               BOTH:"both",
               NO:"none"
            },
            //位置
            POS:{
                BANKER:0,
                PLAYER:1,
                TIE:2,
                BANKER_PAIR:3,
                PLAYER_PAIR:4,
                BOTH_PAIR:5,
                BIG:6,
                SMALL:7}
            ,
            //赔率
            ODDS:{
                0:0.95,
                1:1,
                2:8,
                3:11,
                4:11,
                5:11
            },
            roomList:{
                0:{"name":"百家乐A",start:2,end:5},
                1:{"name":"百家乐B",start:1,end:5}
            }
            
            
        }


}