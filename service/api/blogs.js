/**
 * Created by 月飞 on 14-3-23.
 */
var model=require('../model/blogs'),
    tags=require('../model/tags'),
    api=require('./'),
    config=require('../../config/config')(),
    utils=require('../lib/utils');
exports.getList=function(req,res,next){
    var page=(req.query.page>0?req.query.page:1)- 1,
        searches=(req.query.q),
        query={
            prePage:15,
            page:page,
            criteria:{}
        };
    if(searches){
        query.criteria={
            title:new RegExp(searches,'ig')
        }
    }
    model.count(query.criteria,function(err,numbs){
        if(err){
            return next(err);
        }
        model.all(query,function(err,docs){
            if(err){
                return next(err);
            }
            req.Data.pages=Math.ceil(numbs/query.prePage);
            req.Data.page=page;
            req.Data.list=docs;
            next();
        })
    });
};
exports.getListByTag=function(req,res,next){
    var page=(req.query.page>0?req.query.page:1)- 1,
        tag=req.params.tag,
        query={
            prePage:15,
            page:page,
            criteria:{}
        };
    tags.findOne({name:tag},function(err,doc){
        if(err){
            return next(err);
        }
        query.criteria.tags=doc._id;
        model.count(query.criteria,function(err,numbs){
            if(err){
                return next(err);
            }
            model.all(query,function(err,docs){
                if(err){
                    return next(err);
                }
                req.Data.pages=Math.ceil(numbs/query.prePage);
                req.Data.page=page;
                req.Data.list=docs;
                next();
            })
        });
    });
};
exports.addViews=function(req,res,next){
    var slug=req.params.slug;
    model.findOne({slug:slug},function(err,doc){
        if(err){
            return next(err);
        }
        if(doc){
            doc.views=doc.views||0;
            doc.views++;
            doc.save(function(err,doc){
                if(err){
                    return next(err);
                }
                if(doc){
                    next();
                }
            })
        }
    })
};
exports.update=function(req,res,next){
    var post=req.body;
    if(post.postId){
        model.findOne({_id:post.postId},function(err,doc){
            if(err){
                return next(err);
            }
            if(doc){
                doc.title=post.title;
                doc.markdown=post.markdown;
                doc.updateTime=Date.now();
                doc.author=req.session.user._id;
                doc.tags=req.Data.tags;
                doc.slug=post.slug;
                req.Data={};
                doc.save(function(err,doc){
                    if(err){
                        return next(err);
                    }
                    req.Data.success=true;
                    req.Data.redirect=config.domain+'admin/posts/';
                    next();
                })
            }else{
                next(new Error('not found'));
            }
        })
    }else{
        next(new Error('Id can not be empty'));
    }
};
exports.getBySlug=function(req,res,next){
    var slug=req.params.slug;
    if(slug){
        model.get({slug:slug},function(err,doc){
            if(err){
                return next(err);
            }
            if(doc){
                req.Data.post=doc;
                return next();
            }
            next(new Error('not found'));
        });
    }else{
        req.Data.post={};
        next();
    }
};
exports.get=function(req,res,next){
    var Id=req.params.id;
    if(Id){
        model.get({_id:Id},function(err,doc){
            if(err){
                return next(err);
            }
            if(doc){
                req.Data.post=doc;
                return next();
            }
            next(new Error('not found'));
        })
    }else{
        req.Data.post={};
        next();
    }
};
exports.create=function(req,res,next){
    var post=req.body;
    post.author=req.session.user._id;
    post.tags=req.Data.tags;
    req.Data={};
    model.create(post,function(err,doc){
        if(err){
            return next(err);
        }
        req.Data.success=true;
        req.Data.redirect=config.domain+'admin/posts/';
        next();
    });
};
exports.destroy=function(req,res,next){
    var postId=req.body.id;
    model.remove({_id:postId},function(err,doc){
        if(err){
            return next(err);
        }
        req.Data.success=true;
        req.Data.post=doc;
        next();
    });
};