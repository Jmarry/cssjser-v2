/**
 * Created by 月飞 on 2014/4/2.
 */
var qiniu=require('qiniu'),
    config=require('../../config/config')(),
    bucketName=config.qiNiu.bucketName;
qiniu.conf.ACCESS_KEY=config.qiNiu.ACCESS_KEY;
qiniu.conf.SECRET_KEY=config.qiNiu.SECRET_KEY;
function by(name){
    return function(o, p){
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a > b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        }else {
            return 0;
        }
    }
}
exports.list=function(req,res,next){
    var pages=30,
        index=req.query.page?req.query.page: 1,
        marker=req.query.marker;
    qiniu.rsf.listPrefix(bucketName, '', marker, pages*index, function(err, ret) {
        if (!err) {
            ret.items.sort(by('putTime'));
            req.Data.list=ret.items;
            req.Data.marker=ret.marker;
            next()
        } else {
            next(err);
        }
    });
};
exports.upToken=function(){
    var putPolicy = new qiniu.rs.PutPolicy(bucketName);
    //putPolicy.callbackUrl = callbackUrl;
    putPolicy.returnBody = '{"name":"$(fname)","key":"$(key)","size":$(fsize),"hash":"$(etag)"}';
    //putPolicy.returnUrl = returnUrl;
    //putPolicy.returnBody = returnBody;
    //putpolicy.persistentOps = persistentops;
    //putPolicy.persistentNotifyUrl = persistentNotifyUrl;
    //putPolicy.expires = expires;

    return putPolicy.token();
};