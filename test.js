var crypto = require("crypto");
var hash = crypto.createHash("sha1");
hash.update('123456');
var a = hash.digest('hex');
console.log(a,a.length);
