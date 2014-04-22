/**
 * Created by 月飞 on 14-3-16.
 */
define(['utils/notification','utils/regExps'],function(require,exports,module){
    var notification=require('utils/notification'),
        $=require('jquery'),
        regs=require('utils/regExps'),
        Message=new notification.Message(),
        MessageTypes=notification.MessageTypes;
    $('#login').on('submit',function(ev){
        var email=$(this.email).val(),
            password=$(this.password).val();
        if(!email){
            Message.show({type:MessageTypes.error,info:'邮箱不能为空'});
            return false;
        }
        if(!regs.email.test(email)){
            Message.show({type:MessageTypes.error,info:'邮箱格式不正确'});
            return false;
        }
        if(!password){
            Message.show({type:MessageTypes.error,info:'密码不能为空'});
            return false;
        }
        $.ajax({
            url:'/login',
            type:'post',
            dataType:'json',
            data:{email:email,password:password},
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success:function(data){
                window.location.href=data.redirect;
            },
            error:function(error){
                var err='';
                try{
                    err= $.parseJSON(error.response).error;
                }catch(ex){
                    err=error
                }
                Message.show({type:MessageTypes.error,info:err});
            }
        });
        return false;
    })
});