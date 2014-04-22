/**
 * Created by 月飞 on 14-3-16.
 */
var express=require('express'),
    config=require('../../config/config')(),
    pkgInfo=require('../../package.json'),
    mongoose=require('../model').DB,
    slashes= require('connect-slashes'),
    Store = require('connect-mongo')(express);
function isAdmin(req,res,next){
    var reg=/\/([admin|login|register|api]+)\//;
    res.isAdmin=reg.test(req.path);
    next();
}
function setLocals(req,res,next){
    res.locals = res.locals || {};
    req.Data=req.Data||{};
    res.locals.version = pkgInfo.version;
    res.locals.path = req.path;
    res.locals.domain=config.domain;
    res.locals.ENV=config.ENV;
    res.locals.bae=config.bae;
    if(res.isAdmin){
        res.locals.csrfToken = req.csrfToken();
        res.locals.currentUser=req.session && req.session.user;
    }else{
        res.locals.csrfToken=null;
        res.locals.currentUser=null
    }
    next();
}
module.exports=function(app){
    app.use(express.compress());

    app.use(express.bodyParser());

    app.use(express.methodOverride());

    app.use(express.static(config.path+'/public'));

    app.use(express.favicon());

    app.use(slashes());

    app.use(express.json());
    app.use(express.urlencoded());
    if (app.get('env') !== 'dev') {
        app.use(express.logger());
    } else {
        app.use(express.logger('dev'));
    }


    app.use(express.cookieParser('cssjser is build by Jmarry'));
    app.use(express.session({
        secret: 'cssjserSession',
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        store : new Store({
            db:'session',
            mongoose_connection:mongoose
        })
    }));
    app.use(isAdmin);
    app.use(express.csrf());
    app.use(setLocals);
};