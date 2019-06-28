const EventEmiter = require("events").EventEmitter;
const uitl = require("util");


function SimpleFsm() {
    this.curState = "gameStop";
    //this.timeoutID = 0;
    this.timerid = 0;
    this.timeNum =0;
    EventEmiter.call(this);

}

uitl.inherits(SimpleFsm, EventEmiter);
SimpleFsm.prototype.__changeState = function (state) {

    if (this.curState) {
        this.emit(this.curState + 'Leave');
        console.log(this.curState + 'Leave');
    }
    this.curState = state;
    this.emit(state + 'Enter');
    console.log(this.curState + 'Enter');

}

SimpleFsm.prototype.changeState = function (state, time) {
    //clearTimeout(this.timeoutID);
    //this.timeoutID = setTimeout(this.__changeState.bind(this), time, state);
    this.startTimer(time,state);
}

SimpleFsm.prototype.getState = function () {
    return {state:this.curState,time:this.timeNum};
}

SimpleFsm.prototype.startTimer = function(time,state){
    this.timeNum = time;
    this.stopTimer();
    this.timerid = setInterval(function(state){
        this.timeNum--;
        if(this.timeNum<=0){
            this.stopTimer();
            this.__changeState(state);
        }
    }.bind(this,state),1000);
}

SimpleFsm.prototype.stopTimer = function(time){
    clearInterval(this.timerid);
}


module.exports = SimpleFsm;