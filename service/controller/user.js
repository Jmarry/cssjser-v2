/**
 * Created by 月飞 on 14-3-15.
 */
var model=require('../model/user'),
    config=require('../../config/config')(),
    utils=require('../lib/utils');
exports.login=function(req,res){
    res.render('admin/login',{title:'登录',assetsCss:'login'});
};
exports.logout=function(req,res){
    req.session.user=null;
    res.redirect('/login');
};
exports.register=function(req,res){
    res.render('admin/register',{title:'注册',assetsCss:'login'});
};
exports.hasAdmin=function(req,res,next){
    model.count({},function(err,num){
        if(err){
            next(err);
        }
        if(num<1){
            return res.redirect('/register')
        }
        next();
    })
};
exports.isRegister=function(req,res,next){
    model.count({},function(err,num){
        if(err){
            return next(err);
        }
        if(num>0){
            return res.redirect('/login');
        }
        next();
    })
};
exports.signUp=function(req,res,next){
    var email=req.body.email,
        name=req.body.name,
        password=req.body.password;
    model.create({
        email:email,
        name:name,
        password:password
    },function(err,doc){
        if(err){
            return next(err);
        }
        var redirect=config.domain+'/login';
        res.json(200,{redirect:redirect});
    })
};
exports.auth=function(req,res,next){
    model.findOne({email:req.body.email},function(err,user){
        if(err){
            return next(err);
        }
        if(user){
            if(user.checkPass(req.body.password)){
                req.session.regenerate(function (err) {
                    err&&next(err);
                    var redirect=config.domain+'/admin';
                    req.session.user = {name:user.name,_id:user._id,avatar:user.avatar};
                    if (req.body.redirect) {
                        redirect += decodeURIComponent(req.body.redirect);
                    }
                    res.json(200, {redirect: redirect});
                });
            }else{
                res.json(401, {error: '密码错误'});
            }
        }else{
            res.json(401, {error: '该邮箱不存在'});
        }
    })
};
exports.checkLogin=function(req,res,next){
    if(!req.session.user){
        if(req.accepts('html')){
            return res.redirect('/login')
        }
        if(req.accepts('json')){
            return res.json({error:'No Login'})
        }
        if(req.accepts('text')){
            return res.send('No Loing');
        }
    }
    next()
};
exports.checkLogout=function(req,res,next){
    if(req.session.user){
        return res.redirect('/admin');
    }
    next()
};