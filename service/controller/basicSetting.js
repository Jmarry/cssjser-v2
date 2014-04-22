/**
 * Created by 月飞 on 14-3-14.
 */
var model=require('../model/basicSettings'),
    error=require('../errorHanding');
exports.init=function(callback){
    model.count({},function(err,num){
        err&&error.logErrorAndExit(err);
        if(num<1){
            model.create({},function(err,doc){
                err&&error.logErrorAndExit(err);
                callback&&callback(doc);
            })
        }else{
            model.find({},function(err,docs){
                err&&error.logErrorAndExit(err);
                callback&&callback(docs[0]);
            });
        }
    })
};