var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'mgame');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 10,
      useDict : true,
      useProtobuf : true
    });
});

app.configure('production|development', 'gate', function () {
  app.set('connectorConfig',
      {
          connector: pomelo.connectors.hybridconnector,
          useProtobuf: true
      });
});

app.configure('production|development', 'bjl', function () {
  app.set('connectorConfig',
      {
          connector: pomelo.connectors.hybridconnector,
          useProtobuf: true
      });
});

app.configure('production|development',function(){
	  app.loadConfig("mysql", app.getBase() + "/config/mysql.json");
    var dbclient = require("./app/dao/mysql/mysql.js");
    dbclient.create()
    app.set("dbclient", dbclient);
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
