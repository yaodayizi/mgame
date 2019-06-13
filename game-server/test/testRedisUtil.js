const redisUtils = require("../app/dao/redisUtil");
var chai = require("chai"),
    expect = chai.expect,
    should = chai.should;

describe('test of redisUtils', function(){
    before(() => {
    });
    describe('test of setUserData',function(){
        it('return is user ', function(){
            //var ret = await userDao.login('aaa','bbb');
            //expect(ret).to.be.false;
            redisUtils.setUserData({
                userid:'user_11111',
                user_name:'aaa',
                nick_name:'哦哦哦',
                phone:'12312344321',
                gold:3000
            },function(err,res){
                console.log(res);
                expect(res).equals('OK');
                
            });
        });
        
    });
});