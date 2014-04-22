/**
 * Created by 月飞 on 14-3-24.
 */
define(['utils/dropdown','utils/notification',"codemirror/lib/codemirror", "codemirror/mode/markdown/markdown",'showdown/showdown','showdown/extensions/github','showdown/extensions/table','showdown/extensions/prettify','prettify/prettify','tags/tagfield'],function(require,exports,module){
    var dropdown=require('utils/dropdown'),
        $=require('jquery'),
        notification=require('utils/notification'),
        codeMirror=require('codemirror/lib/codemirror'),
        tempMarkdown=require("codemirror/mode/markdown/markdown"),
        markdown=require('showdown/showdown'),
        themeGitHub=require('showdown/extensions/github'),
        themeTable=require('showdown/extensions/table'),
        themePrettify=require('showdown/extensions/prettify'),
        prettify=require('prettify/prettify'),
        tagField=require('tags/tagfield'),
        postUrl=$('#postUrl'),
        slugBox=postUrl.next().find('.slug'),
        mdConverter=new markdown.converter({extensions:[themeGitHub,themeTable,themePrettify]}),
        editor=codeMirror.fromTextArea($('#entry-markdown')[0], {
            mode: 'markdown',
            lineWrapping:true,
            theme: "default"
        }),
        Message=new notification.Message(),
        timer;
    $('#post-title').on('input',function(ev){
        var query=$(this).val();
        clearTimeout(timer);
        if(query){
            timer=setTimeout(function(){
                $.ajax({
                    url:'http://openapi.baidu.com/public/2.0/bmt/translate',
                    data:{
                        client_id:G_CONFIG.bae.ApiKey,
                        q:query,
                        from:'zh',
                        to:'en'
                    },
                    dataType:'jsonp',
                    success:function(data){
                        if(data.error_code){
                            Message.show({type:notification.MessageTypes.error,info:data.error_msg});
                        }else{
                            var result=[];
                            $.each(data.trans_result,function(i,item){
                                var slug=item.dst.split(' ');
                                result.push(slug.join('-'));
                            });
                            result=result.join('-').toLowerCase();
                            $('#postUrl').val(result);
                            slugBox.html(result);
                        }
                    }
                })
            },300);
        }
    });
    $('.post-content').on('click','header.floatingHeader',function(ev){
        var parent=$(ev.currentTarget).parent();
        if(parent.hasClass('active')){
            return false;
        }
        parent.siblings().removeClass('active');
        parent.addClass('active');
        if(parent.hasClass('entry-preview')){
            parent.find('.render-markdown').html(mdConverter.makeHtml(editor.getValue()));
            setTimeout(function(){
                prettyPrint();
            },0);
        }
        return false;
    });
    slugBox.html(postUrl.val());
    postUrl.on('input',function(ev){
        slugBox.html($(this).val());
    });
    $.ajax({
        url:'/api/tag/getAll/',
        dataType:'json',
        headers: {
            'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
        },
        success:function(data){
            var tags=[];
            $.each(data.tags,function(i,item){
                tags.push(item.name);
            });
            $('#postTags').tagbox({
                url: tags
            });
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
    $('#post').on('submit',function(ev){
        return false;
    }).find('.button-post').on('click',function(){
        var title=$('#post-title').val(),
            content=editor.getValue(),
            tags=$('#postTags').val(),
            slug=postUrl.val(),
            postId=$('#postId').val();
        if(!title){
            Message.show({info:'标题不能为空',type:notification.MessageTypes.error});
            return false;
        }
        if(!content){
            Message.show({info:'内容不能为空',type:notification.MessageTypes.error});
            return false;
        }
        if(!slug){
            Message.show({info:'链接不能为空',type:notification.MessageTypes.error});
            return false;
        }
        $.ajax({
            url:postId?'/api/post/update/':'/api/post/create/',
            type:'post',
            dataType:'json',
            data:{title:title,markdown:content,tags:tags,slug:slug,postId:postId},
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
                Message.show({type:notification.MessageTypes.error,info:err});
            }
        });
        return false;
    })
});