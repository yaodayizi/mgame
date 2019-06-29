// var crc = require('crc');

module.exports.dispatch = function (uid, servers) {
    //return servers[0];
    var index = Number(uid) % servers.length;
    // console.log('dispatch >>>>>>>>>>>>>>>>>>');
    // console.log(uid);
    // console.log(servers[index]);
    return servers[index];
};