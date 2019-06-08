var chai = require("chai"),
    expect = chai.expect,
    should = chai.should;
var crypto = require("crypto");
var mysql = require("../app/dao/mysql/mysql.js");
var userDao = require("../app/dao/mysql/userDao.js");
describe('test of userDao', function(){
    before(() => {
        userDao.db = mysql;
        userDao.db.create();
    });
    describe('test of userlogin', async function(){
        it('return is false no user ', async function(){
            var ret = await userDao.login('aaa','bbb');
            expect(ret).to.be.false;
        });
        it('return user as object name is test1', async function(){
            var ret = await userDao.login('test1','123456');
            expect(ret).a('object');
            expect(ret.user_name).equals('test1');
        });
        
    });

    describe('test of userCreate', () => {
        it('return is oo',async function(){
            var user = {user_name:'test_test',nick_name:'test_test',password:"123456",phone:"213234234",gold:2000,}
            var userid = await userDao.createUser(user);
            expect(userid).a("number");
        });
    });

});