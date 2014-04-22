/**
 * Created by 月飞 on 14-3-20.
 */
var config=require('../../config/config'),
    cdn=require('../lib/cdn'),
    adminNavBar={
        home: {
            name: '管理中心',
            navClass:'home',
            path: '/admin/'
        },
        post:{
            name:'博客管理',
            navClass:'post',
            path:'/admin/posts/'
        },
        assets:{
            name:'资源管理',
            navClass:'assets',
            path:'/admin/assets/'
        },
        settings:{
            name:'基本设置',
            navClass:'settings',
            path:'/admin/settings/'
        }
    };
function setSelected(items,name){
    Object.keys(items).forEach(function(key){
        items[key].selected=key===name;
    });
    return items;
}
exports.index=function(req,res,next){
    res.render('admin/main',
        {title:'管理中心',assetsCss:'admin/index',adminNavBar:setSelected(adminNavBar,'home')});
};
exports.settings=function(req,res,next){
    res.locals.Settings=req.Data.Settings;
    res.render('admin/main/settings',
        {title:'基本设置',assetsCss:'admin/index',adminNavBar:setSelected(adminNavBar,'settings')});
};
exports.personalData=function(req,res,next){
    res.locals.UserInfo=req.Data.user;
    res.render('admin/main/personalData',
        {title:'个人资料',assetsCss:'admin/index',adminNavBar:setSelected(adminNavBar,'settings')});
};
exports.siteSetting=function(req,res,next){
    res.locals.config=config();
    res.render('admin/main/basic',{title:'站点设置',assetsCss:['admin/index'],adminNavBar:setSelected(adminNavBar,'settings')});
};
exports.postList=function(req,res,next){
    res.render('admin/post',{title:'文章管理',assetsCss:['admin/index','showdown/github','prettify/prettify'],adminNavBar:setSelected(adminNavBar,'post')});
};
exports.editor=function(req,res,next){
    res.locals.post=req.Data.post;
    res.render('admin/post/editor',{title:'文章编辑',assetsCss:['admin/index','codemirror/codemirror','showdown/github','prettify/prettify','tags/tagfield'],adminNavBar:setSelected(adminNavBar,'post')})
};
exports.assets=function(req,res,next){
    res.locals.token=cdn.upToken();
    res.render('admin/assets/images',{title:'图片管理',assetsCss:['admin/index','dropzone/dropzone'],adminNavBar:setSelected(adminNavBar,'assets')});
};