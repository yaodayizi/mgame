const EventEmiter = require("events").EventEmitter;
const uitl = require("util");


function SimpleFsm(){
    this.curState = "gameStop";  
    this.timeoutID = 0;  
    EventEmiter.call(this);

}

uitl.inherits(SimpleFsm,EventEmiter);
SimpleFsm.prototype.__changeState = function(state){
    if(this.curState){
        this.emit(this.curState+'leave');
        console.log(this.curState+'leave');
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
    return this.curState;
}

module.exports = SimpleFsm;

