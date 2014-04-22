/**
 * Created by 月飞 on 14-3-14.
 */
var user=require('../controller/user'),
    api=require('../api'),
    admin=require('../controller/admin');

module.exports=function(app){
    //login
    app.get('/login',user.hasAdmin,user.checkLogout,user.login);
    app.post('/login',user.checkLogout,user.auth);
    app.get('/logout',user.logout);
    app.get('/register',user.isRegister,user.checkLogout,user.register);
    app.post('/register',user.checkLogout,user.signUp);

    //admin
    app.get('/admin',user.checkLogin,admin.index);
    app.get('/admin/posts',user.checkLogin,admin.postList);
    app.get('/admin/posts/editor',user.checkLogin,api.post.get,admin.editor);
    app.get('/admin/posts/editor/:id',user.checkLogin,api.post.get,admin.editor);
    app.get('/admin/settings',user.checkLogin,api.basicSettings.getSettings,admin.settings);
    app.get('/admin/settings/user',user.checkLogin,api.user.getUser,admin.personalData);
    app.get('/admin/settings/basic',user.checkLogin,admin.siteSetting);
    app.get('/admin/assets',user.checkLogin,admin.assets);
};