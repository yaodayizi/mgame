const EventEmiter = require("events").EventEmitter;
const uitl = require("util");


function SimpleFsm(){
    this.curState = "";  
    this.timeoutID = 0;  
    EventEmiter.call(this);

}

uitl.inherits(SimpleFsm,EventEmiter);
SimpleFsm.prototype.__changeState = function(state){
    if(this.curState){
        this.emit(this.curState+'Leava');
        console.log(this.curState+'Leava');
    }
    
    this.curState = state;
    this.emit(state+'Enter');
    console.log(this.curState+'Enter');
    
}

SimpleFsm.prototype.changeState = function(state,time){
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(this.__changeState.bind(this),time,state);
}

SimpleFsm.prototype.getState = function(){
    return trhis.curState;
}

module.exports = SimpleFsm;

