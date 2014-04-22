/**
 * Created by 月飞 on 14-3-23.
 */
define(['utils/dropdown','utils/notification','utils/regExps'],function(require,exports,module){
    var dropdown=require('utils/dropdown'),
        notification=require('utils/notification'),
        regs=require('utils/regExps'),
        $=require('jquery'),
        Message=new notification.Message(),
        form=$('#setting-general');
    $(document).on('click','.button-save',function(ev){
        var title=form.find('#blog-title').val(),
            description=form.find('#blog-description').val(),
            email=form.find('#blog-email').val();
        if(!regs.email.test(email)){
            return Message.show({type:notification.MessageTypes.error,info:'邮箱格式不正确'})
        }
        $.ajax({
            url:'/api/basicSetting/update',
            type:'post',
            dataType:'json',
            data:{title:title,description:description,email:email},
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success:function(data){
                data.success&&Message.show({type:notification.MessageTypes.success,info:'保存成功'});
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