var pomelo = require("pomelo");
var crypto = require("crypto");
var userDao = module.exports;
var log = require('pomelo-logger').getLogger('dao-log', __filename);
var self = this;

userDao.getDb = function(){
    if(!userDao.db){
        if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV === 'development'){
            userDao.db = pomelo.app.get('dbclient');
            console.log(userDao,pomelo.app.get('dbclient'));
        }
        else{
            var mysql = require("./mysql.js");
            mysql.create();
            userDao.db = mysql;
           
        }
    }
    return userDao.db;
}


console.log(process.env.NODE_ENV,'00000------',userDao.db);

userDao.login = async function(username,password){
    var sql = "select * from t_user where user_name = ?  limit 0,1";
    try{
        var ret =  await this.getDb().asyncQuery(sql,username);
        if(ret.length==0){
            return false;
        }else{
           let user = ret[0];
           let  sha1 = crypto.createHash('sha1');
           sha1.update(password);
           let pwd = sha1.digest('hex');
           if(pwd == user.password){
               return user;
           }else{
               return false;
           }
        }
    }catch(e){
        log.error(e);
        throw e;
    }
}

userDao.createUser = async function(user){
    var sql = "INSERT INTO t_user (user_name,nick_name,password,phone,gold,roomcard,sex) VALUES (?,?,?,?,?,?,?)";
    let  sha1 = crypto.createHash('sha1');
    sha1.update(user.password);
    let pwd = sha1.digest('hex');

    args = [user.user_name,user.nick_name,pwd,user.phone,user.gold,0,0];
    try{
        var ret =  await this.getDb().asyncQuery(sql,args);
        return ret.insertId;
    }catch(e){
        log.error(e);
        throw e;
    }
}