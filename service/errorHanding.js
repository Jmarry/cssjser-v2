/**
 * Created by 月飞 on 14-3-13.
 */
var colors = require("colors"),
    errors = {
        errorMessages:function(err){
            var msg=err.message;
            if(msg&&msg.indexOf('Validation failed')>-1){
                msg+=':';
                Object.keys(err.errors).forEach(function(key){
                    msg+=err.errors[key].message+' ';
                });
            }
            return msg;
        },
        jump500ErrorPage: function (err, req, res, next) {
            res.status(err.status || 500);
            errors.logError(err);
            if(req.accepts('html')){
                return res.render('500', {title:'500 - 服务器出错啦！',assetsCss:'fe/index',error: errors.errorMessages(err),stack: err.stack});
            }
            if(req.accepts('json')){
                return res.json({error:errors.errorMessages(err)});
            }
            res.type('txt').send(errors.errorMessages(err));
        },
        jump404ErrorPage: function (req, res, next) {
            res.status(404);
            if (req.accepts('html')) {
                res.render('404', {currentUrl: req.url, title: '404 - 找不到该网页',assetsCss:'fe/index'});
                return;
            }
            if (req.accepts('json')) {
                res.send({error: 'Not found'});
                return;
            }
            res.type('txt').send('Not found');
        },
        logWarn: function (warn, context, help) {
            console.log('[Warning]: %s'.yellow, warn);
            if (context) {
                console.log('%s'.white, context);
            }
            if (help) {
                console.log('%s'.green, help);
            }
        },
        logError: function (err, context, help) {
            var stack = err ? err.stack : null;
            err = err || 'Unknown';
            console.error('ERROR:%s'.red, err);
            if (context) {
                console.error('%s'.white,context);
            }
            if (help) {
                console.error('%'.green,help);
            }
            if (stack) {
                console.error(stack, '\n');
            }
        },
        logErrorAndExit:function(err, context, help){
            errors.logError(err,context,help);
            process.exit(0);
        }
    };
module.exports = errors;