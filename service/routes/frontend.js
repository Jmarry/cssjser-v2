/**
 * Created by 月飞 on 14-3-14.
 */
var post=require('../controller/frontend'),
    blog=require('../api/blogs'),
    setting=require('../api/basicSetting'),
    rss=require('../lib/rss');
module.exports=function(app){
    app.get('/',blog.getList,post.index);
    app.get('/blogs',post.index);
    app.get('/blogs/:slug',blog.getBySlug,blog.addViews,post.detail);
    app.get('/tag/:tag',blog.getListByTag,post.index);
    app.get('/rss',setting.getSettings,blog.getList,rss.feed);
};