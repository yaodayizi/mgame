const userDao = require("../../dao/mysql/userDao.js");

function PlayerManager(roomObj) {
    this.roomObj = roomObj;
    this.playerData = {};
    this.playerNum = 0;

    this.bidData = {};  // 下注信息容器
}