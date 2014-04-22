/**
 * Created by 月飞 on 2014/4/12.
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
    })
    $(document).on('click','.button-save',function(ev){
        var domain=form.find('#site-domain').val(),
            port=form.find('#site-port').val(),
            db={
                host:form.find('#site-db-host').val(),
                port:form.find('#site-db-port').val(),
                database:form.find('#site-db-database').val(),
                user:form.find('#site-db-user').val(),
                pass:form.find('#site-db-password').val()
            },
            qiNiu={
                ACCESS_KEY:form.find('#site-qiniu-ACCESS_KEY').val(),
                SECRET_KEY:form.find('#site-qiniu-SECRET_KEY').val(),
                bucketName:form.find('#site-qiniu-bucketName').val()
            };
        if(!regs.url.test(domain)){
            Message.show({type:notification.MessageTypes.error,info:'站点域名格式不正确'});
            return false;
        }
        $.ajax({
            url:'/api/basicSite/update',
            type:'post',
            dataType:'json',
            data:{domain:domain,port:port,db:db,qiNiu:qiNiu},
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
});