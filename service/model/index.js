/**
 * Created by 月飞 on 14-3-11.
 */
var mongoose = require('mongoose'),
    dbCONFIG = require('../../config/config')().db,
    db = mongoose.createConnection(),
    options = {
        db: { native_parser: true },
        server: { poolSize: 5 },
        user: dbCONFIG.user,
        pass: dbCONFIG.pass
    };
db.open(dbCONFIG.host,dbCONFIG.database,dbCONFIG.port,options);
db.on('connected', function () {
    console.log('mongoose connected');
});
db.on('error', function (err) {
    //监听BAE mongodb异常后关闭闲置连接
    console.log('mongoose error:' + err);
    db.close();
});
//监听db close event并重新连接
db.on('close', function () {
    console.log("connect close retry connect ");
    db.open(dbCONFIG.host,dbCONFIG.database,dbCONFIG.port,options);
});
exports.DB = db;
exports.Schema = mongoose.Schema;