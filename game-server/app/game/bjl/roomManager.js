const Room = require("./Room.js");

const roomList = {};
const roomidArr = [];
let room;
let roomid = 0;
let exp = module.exports;

exp.enterGame = function(msg,cb){
    if(roomidArr.length==0){
        roomid++;
        room = new Room(roomid,msg.gameid);
        roomList[roomid] = room;
        roomidArr.push(roomid);
        room.initGame();
    }else{
        
    }
    room.addPlayer(msg.uid,msg.serverid,function(ret){
        
        cb(null,{code:200,data:{user:ret}});
    
    });

    //需要返回路书数据


}