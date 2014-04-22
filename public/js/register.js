/**
 * Created by 月飞 on 14-3-21.
 */
define(['jquery','utils/notification','utils/regExps'],function(require,exports,module){
    var $=require('jquery'),
        notification=require('utils/notification'),
        regs=require('utils/regExps'),
        Message=new notification.Message();
    $('#register').on('submit',function(ev){
        var email=$(this.email).val(),
            name=$(this.name).val(),
            password=$(this.password).val();
        if(!name){
            Message.show({info:'Full Name 不能为空',type:notification.MessageTypes.error});
            return false;
        }
        if(!regs.email.test(email)){
            Message.show({info:'email 格式不正确',type:notification.MessageTypes.error});
            return false;
        }
        if(!password){
            Message.show({info:'password 不能为空',type:notification.MessageTypes.error});
            return false;
        }
        $.ajax({
            url:'/register',
            type:'post',
            dataType:'json',
            data:{
                email:email,
                name:name,
                password:password
            },
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success:function(data){
                window.location.href=data.redirect;
            },
            error:function(error){
                var err='',tmp='';
                try{
                    err= $.parseJSON(error.response).error;
                }catch(ex){
                    err=error
                }
                Message.show({type:notification.MessageTypes.error,info:err});
            }
        });
        return false;
    })
});