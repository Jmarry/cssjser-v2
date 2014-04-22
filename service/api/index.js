/**
 * Created by 月飞 on 14-3-22.
 */
var setting=require('./basicSetting'),
    user=require('./user'),
    post=require('./blogs'),
    tag=require('./tags');
function apiAuth(req,res,next){
    if(!req.session.user){
        next(new Error('no login'));
        return;
    }
    next();
}
module.exports={
    apiAuth:apiAuth,
    basicSettings:setting,
    user:user,
    post:post,
    tag:tag
};