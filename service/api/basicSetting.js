/**
 * Created by 月飞 on 14-3-22.
 */
var model=require('../model/basicSettings'),
    utils=require('../lib/utils'),
    fs=require('fs'),
    path=require('path'),
    rootPath=process.cwd();
exports.getSettings=function(req,res,next){
    model.findOne({},function(err,doc){
        if(err){
            return next(err);
        }
        req.Data.Settings=doc;
        next();
    })
};
exports.setSettings=function(req,res,next){
    model.findOne({},function(err,doc){
        if(err){
            return next(err);
        }
        utils.extend(doc,req.body);
        doc.save(function(err,rtn){
            if(err){
                return next(err);
            }
            req.Data.success=true;
            req.Data.settings=rtn;
            next();
        });
    })
};
exports.update=function(req,res,next){
    var config=req.body,
        configPath=rootPath+path.normalize('/config/config.json'),
        backup=JSON.parse(fs.readFileSync(configPath,'utf8'));
    config=utils.extend(backup,config);
    fs.writeFileSync(configPath,JSON.stringify(config));
    req.Data.success=true;
    next();
};