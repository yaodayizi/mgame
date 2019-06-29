var mysql=require("mysql");
var pomelo = require('pomelo');
var mqlMgr = {};

mqlMgr.create = function() {
    //if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'development'){
        console.log(process.env.NODE_ENV);
        var mysqlConfig = pomelo.app.get('mysql');
    /*} else {
        var mysqlConfig =  {
            "host" : "127.0.0.1",
              "port" : "3306",
              "database" : "mgame",
              "user" : "root",
              "password" : "root"
          } 
    }*/
    var pool = mysql.createPool(mysqlConfig);
    this.pool = pool;
};

mqlMgr.query = function (sql,args,callback) {   //可以改成sql，callback两个参数
    this.pool.getConnection(function(err,conn){
        if(err) {
            callback(err,null);
        } else {
            conn.query(sql,args,function(qerr,res){   //这里返回的参数可以改变一下 直接取到查询结果
                conn.release();
                callback(qerr,res);
            });
        }
    });
};

mqlMgr.asyncQuery = async function(sql,args,callback){
    return new Promise(( resolve, reject ) => {
        this.pool.getConnection(function(err, connection) {
        if (err) {
            reject( err )
        } else {
            connection.query(sql, args, ( err, res) => {

            if ( err ) {
                reject( err )
            } else {
                resolve( res )
            }
            // 结束会话
            connection.release()
            })
        }
        })
    })
}


module.exports = mqlMgr;