/**
 * Created by 月飞 on 14-3-24.
 */
define(['utils/notification','utils/regExps','utils/dropdown'],function(require,exports,module){
    var dropdown=require('utils/dropdown'),
        notification=require('utils/notification'),
        $=require('jquery'),
        regs=require('utils/regExps'),
        Message=new notification.Message(),
        form=$('#setting-general');
    form.on('submit',function(){
        return false;
    });
    $(document).on('click','.button-save',function(ev){
        var name=form.find('#user-name').val(),
            email=form.find('#user-email').val();
        if(!regs.email.test(email)){
            Message.show({type:notification.MessageTypes.error,info:'邮箱格式不正确'});
            return false;
        }
        $.ajax({
            url:'/api/user/update',
            type:'post',
            dataType:'json',
            data:{user:{name:name,email:email}},
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success:function(data){
                data.success&&Message.show({type:notification.MessageTypes.success,info:'保存成功'})
            },
            error:function(error){
                var err='';
                try{
                    err= $.parseJSON(error.response).error;
                }catch(ex){
                    err=error
                }
                Message.show({type:notification.MessageTypes.error,info:err});
            }
        });
        return false;
    });
    $(document).on('click','.button-change-pwd',function(ev){
        var oldPwd= $.trim(form.find('#old-pwd').val()),
            newPwd= $.trim(form.find('#new-pwd').val()),
            verifyPwd= $.trim(form.find('#verify-pwd').val());
        if(!oldPwd){
            Message.show({type:notification.MessageTypes.error,info:'请输入密码'});
            return false;
        }
        if(!newPwd||!verifyPwd){
            Message.show({type:notification.MessageTypes.error,info:'新密码不能为空'});
            return false;
        }
        if(newPwd!==verifyPwd){
            Message.show({type:notification.MessageTypes.error,info:'新密码输入不一致'});
            return false;
        }
        $.ajax({
            url:'/api/user/changePassword',
            type:'post',
            dataType:'json',
            data:{pwd:{old:oldPwd,new:newPwd}},
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success:function(data){
                data.success&&Message.show({type:notification.MessageTypes.success,info:'保存成功'})
            },
            error:function(error){
                var err='';
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