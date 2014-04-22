/**
 * Created by 月飞 on 2014/4/2.
 */
var moment=require('moment');
exports.index=function(req,res,next){
    req.Data.list.forEach(function(post){
        post.summary=removeHTMLTag(post.html);
        post.time=moment(post.updateTime).format('YYYY-MM-DD hh:mm:ss');
    });
    res.locals.posts=req.Data.list;
    res.locals.pages=req.Data.pages;
    res.locals.page=req.Data.page;
    res.render('theme/index',{title:'',assetsCss:'fe/index'});
};
function removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
    str=str.length>200?str.substr(0,200)+'...':str;
    return str;
}
exports.detail=function(req,res,next){
    var post=req.Data.post;
    post.time=moment(post.updateTime).format('YYYY-MM-DD hh:mm:ss');
    res.locals.post=post;
    res.render('theme/detail',{title:post.title,assetsCss:['fe/index','showdown/github','prettify/prettify']});
};