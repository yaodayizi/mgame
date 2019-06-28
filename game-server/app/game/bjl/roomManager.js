const Room = require("./Room.js");
const bjlConfig = require("../../consts/consts.js").bjl;
const _ = require("lodash");
const P = require("bluebird");
var roomList = {};
var roomidArr = [];
let roomid = 0;
let exp = module.exports;

exp.createRoom = function(roomid,roomName,config){
        let room = new Room(roomid,roomName,config);
        roomList[roomid] = room;
        roomidArr.push(roomid);
        return room;
        //room.initGame();
}

exp.createRoomList = function(){
    _.forEach(bjlConfig.roomList,function(val,key){
        
        let config = bjlConfig.roomConfig[key];
        for(let i=val.start;i<=val.end;i++){
            roomid++;
            if(!this.getRoomById(roomid)){
                let room = this.createRoom(roomid,val.name+i,config);  
                room.initGame();  
            }
        }

    }.bind(this));
}

exp.enterGame = function(msg){
    
    if(roomidArr.length==0){
        //roomid++;
        this.createRoomList();
    }
/*     if(msg.roomid && parseInt(msg.roomid)>0){
        return this.joinRoom(msg.uid,msg.serverid,msg.roomid);
    } */
    return this.getAllRoomData();
}



exp.joinRoom = function(uid,serverid,roomid){
    let room;
    if(roomid && roomid>0){
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
    return room.kickPlayer(msg.uid,msg.serverid);
}

exp.leaveRoom = function(msg){
    var room = this.getRoomById(msg.roomid);
    if(room.isCanExit(msg.uid)){
       return  room.kickPlayer(msg.uid,msg.serverid);
    }else{
       return P.resolve(false);
    }   
}

exp.bet = function(uid,roomid,pos,coin,chipType,num){
    return  roomList[roomid].bet(uid,pos,coin,chipType,num);
}

/**
 * 得到ROOM数据
 */
exp.getRoomRoadData = function(roomid,num){
    let room = this.getRoomById(roomid);
    if(room){
        let ret = {
            roomid:roomid,
            history:room.getRoadData(num)
        }
        return ret;
    }
}

exp.getRoomData = function(roomid,num){
    let room = this.getRoomById(roomid);
    if(room){
        let ret = {
            roomid:roomid,
            roomName:room.roomName,
            roomConfig:room.roomConfig,
        }
        return ret;
    }
}


exp.getAllRoomData = function(num=null){
    let retArr = [];
    _.forEach(roomidArr,function(roomid){
        retArr.push(this.getRoomData(roomid,num));
    }.bind(this));
    return retArr;
}