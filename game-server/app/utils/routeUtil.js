var exp = module.exports;
var dispatcher = require('./dispatcher');

exp.bjl = function(session, msg, app, cb) {
    var bjlServers = app.getServersByType('bjl');

    if(!bjlServers || bjlServers.length === 0) {
        cb(new Error('can not find chat servers.'));
        return;
    }

    var res = dispatcher.dispatch(session.get('uid'), chatServers);

    cb(null, res.id);
};
