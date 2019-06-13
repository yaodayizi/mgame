const room = require("./room.js");

const roomList = {};
const roomidArr = [];
let roomid = 0;
let exp = module.exports;

exp.enterGame = function(msg,cb){
    if(roomidArr.length==0){
        roomid++;
        room = new room(roomid,msg.gameid);
        roomList[roomid] = room;
        roomidArr.push(roomid);
    }else{
        
    }

    //需要返回路书数据


}