const redisUtils = require("../app/dao/redisUtil.js");
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
            /*redisUtils.setUser({
                userid:'user_11111',
                user_name:'aaa',
                nick_name:'哦哦哦',
                phone:'12312344321',
                gold:3000
            },redisUtils.redis.print*//* function(err,res){
                console.log(res);
                expect(res).equals('OK');
                
            } */
            var o ={'mm':2,'kk':'aa'};
            redisUtils.client.hmset('test',o);
        });
        });
        
    });
