const Room = require("./Room.js");
const bjlConfig = require("../../consts/consts.js").bjl;
const _ = require("lodash");
var roomList = {};
var roomidArr = [];
let roomid = 0;
let exp = module.exports;

var createRoom = function(roomid,roomName,config){
        let room = new Room(roomid,roomName,config);
        roomList[roomid] = room;
        roomidArr.push(roomid);
        return room;
        //room.initGame();
}

var createRoomList = function(){
    _.forEach(bjlConfig.roomList,function(val,key){
        
        let config = bjlConfig.roomConfig[key];
        for(let i=val.start;i<=val.end;i++){
            roomid++;
            let room = createRoom(roomid,val.name+i,config);  
            room.initGame();  
        }

    });
}

exp.enterGame = function(msg){
    
    if(roomidArr.length==0){
        roomid++;
        //let room =  createRoom(roomid,bjlConfig.roomList[0].name+roomid,bjlConfig.roomConfig[0]);
        //room.initGame();
        //process.nextTick(createRoomList);
        createRoomList();
    }
    
    return this.getAllRoomData();
}



exp.joinRoom = function(uid,serverid,roomid){
    let room;
    if(roomid){
        room = this.getRoomById(roomid);
        if(!room){
            room = this.getRoomById(1);
        }
    }else{
        room = this.getRoomById(1);
    }
    return room.addPlayer(uid,serverid);
}



exp.getRoomById = function (roomid) {
    var roomObj = roomList[roomid];
    return roomObj || null;
};


exp.kick = function(msg){
    var room = this.getRoomById(msg.roomid);
    room.kickPlayer(msg.uid,msg.serverid);
}

exp.bet = function(uid,roomid,pos,coin,chipType,num){
    return  roomList[roomid].bet(uid,pos,coin,chipType,num);
}

/**
 * 得到ROOM数据
 */
exp.getRoomData = function(roomid,num){
    let room = this.getRoomById(roomid);
    let ret = {
        roomid:roomid,
        roomName:room.roomName,
        roomConfig:room.roomConfig,
        roadData:room.getRoadData(num)
    }
    return ret;
}

exp.getAllRoomData = function(num=null){
    let retArr = [];
    _.forEach(roomidArr,function(roomid){
        retArr.push(this.getRoomData(roomid,num));
    }.bind(this));
    return retArr;
}