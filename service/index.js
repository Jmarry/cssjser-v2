/**
 * Created by 月飞 on 14-3-13.
 */
var express = require('express'),
    ejs=require('ejs'),
    http = require('http'),
    error=require('./errorHanding'),
    config=require('../config/config')(),
    routes=require('./routes'),
    middleware=require('./middleware'),
    basicSetting=require('./controller/basicSetting');
ejs.open='{{';
ejs.close='}}';
function goStart(){
    basicSetting.init(function(blogConfig){
        var app = express();
        setExpress(app);
        app.locals({blog:blogConfig});
        routes.api(app);
        routes.admin(app);
        routes.frontend(app);
        jumpError(app);
        http.createServer(app).listen(config.port, function () {
            console.log('work start on port:' + config.port);
        });
    });
}
function setExpress(app){
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
    app.set('views',config.path+'/view');
    middleware(app);
}
function jumpError(app){
    app.use(error.jump404ErrorPage);
    app.use(error.jump500ErrorPage);
}
module.exports=goStart;