/**
 * Created by 月飞 on 14-3-22.
 */
var model=require('../model/user'),
    utils=require('../lib/utils');
exports.getUser=function(req,res,next){
    var id=req.session.user._id;
    model.findOne({_id:id},function(err,doc){
        if(err){
            return next(err);
        }
        req.Data.user=doc;
        next();
    })
};
exports.update=function(req,res,next){
    var id=req.session.user._id,
        user=req.body.user;
    model.findOne({_id:id},function(err,doc){
        if(err){
            return next(err);
        }
        utils.extend(doc,user);
        doc.save(function(err,rtn){
            if(err){
                return next(err);
            }
            req.Data.success=true;
            next();
        });
    })
};
exports.changePassword=function(req,res,next){
    var id=req.session.user._id,
        pwd=req.body.pwd;
    model.findOne({_id:id},function(err,doc){
        if(err){
            return next(err);
        }
        if(doc.checkPass(pwd.old)){
            doc.password=pwd.new;
            doc.save(function(err,rtn){
                if(err){
                    return next(err);
                }
                req.Data.success=true;
                next();
            })
        }else{
            next(new Error('密码错误'));
        }
    })
};