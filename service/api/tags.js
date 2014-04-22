/**
 * Created by 月飞 on 14-3-25.
 */
var model=require('../model/tags'),
    tag={
        getList:function(req,res,next){
            var tagStr=req.body.tags,
                tagArr=tagStr.split(','),
                tags=[];
            tagArr.forEach(function(item,index){
                item=item.trim();
                if(!item){
                    if(index==tagArr.length-1){
                        req.Data.tags=tags;
                        next();
                    }
                    return;
                }
                tag.get(item,function(err,doc){
                    if(err){
                        return next(err);
                    }
                    if(doc){
                        tags.push(doc);
                        if(index==tagArr.length-1){
                            req.Data.tags=tags;
                            next();
                        }
                    }else{
                        tag.create(item,function(err,doc){
                            if(err){
                                return next(err);
                            }
                            tags.push(doc);
                            if(index==tagArr.length-1){
                                req.Data.tags=tags;
                                next();
                            }
                        })
                    }
                });
            });
        },
        getAll:function(req,res,next){
            model.find({},function(err,docs){
                if(err){
                    return next(err);
                }
                req.Data.tags=docs;
                next();
            })
        },
        get:function(tag,callback){
            return model.findOne({name:tag},callback);
        },
        create:function(tag,callback){
            return model.create({name:tag},callback);
        },
        update:function(req,res,next){

        },
        destroy:function(req,res,next){

        }
    };
module.exports=tag;