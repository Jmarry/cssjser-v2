/**
 * Created by 月飞 on 2014/4/20.
 */
var RSS=require('rss'),
    config=require('../../config/config')(),
    url=require('url');
exports.feed=function(req,res,next){
    var setting=req.Data.Settings,
        data=req.Data.list,
        feed=new RSS({
            title: setting.title,
            description: setting.description,
            feed_url: config.domain+'rss/',
            site_url: config.domain,
            author: 'YueFei Wang',
            managingEditor: 'YueFei Wang',
            webMaster: 'YueFei Wang',
            copyright: '2014 CssJser',
            language: 'zh',
            ttl: '60'
        });
    data.forEach(function(post){
        var item={
            title:  post.title,
            guid:post._id,
            url: config.domain+'post/'+post.slug,
            author: post.author.name,
            date: post.updateTime
            },
            content=post.html;
        //set img src to absolute url
        content = content.replace(/src=["|'|\s]?([\w\/\?\$\.\+\-;%:@&=,_]+)["|'|\s]?/gi, function (match, p1) {
            /*jslint unparam:true*/
            p1 = url.resolve(config.domain, p1);
            return "src='" + p1 + "' ";
        });
        //set a href to absolute url
        content = content.replace(/href=["|'|\s]?([\w\/\?\$\.\+\-;%:@&=,_]+)["|'|\s]?/gi, function (match, p1) {
            /*jslint unparam:true*/
            p1 = url.resolve(config.domain, p1);
            return "href='" + p1 + "' ";
        });
        item.description = content;
        feed.item(item);
    });
    res.set('Content-Type', 'text/xml');
    res.send(feed.xml());
};