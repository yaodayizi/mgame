var dispatcher = require('../../../utils/dispatcher.js');
var userDao = require('../../../dao/mysql/userDao.js');
var consts = require('../../../consts/consts.js');
var _ = require("lodash");
var jwt = require("jsonwebtoken");

module.exports = function (app) {
	return new Handler(app);
};

var Handler = function (app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
handler.queryEntry = function (msg, session, next) {
/* 	var userid = msg.userid;
	if (!userid) {
		next(null, {
			code: 500
		});
		return;
	}
 */	// get all connectors
	var connectors = this.app.getServersByType('connector');
	if (!connectors || connectors.length === 0) {
		next(null, {
            code: 500,
            msg:'找不到服务器'
		});
		return;
	}
   
    var res = dispatcher.dispatch(session.id, connectors);
    next(null, {
        code: 200,
        host: res.host,
        port: res.clientPort
	});
	return;
};

