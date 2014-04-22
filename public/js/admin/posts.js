/**
 * Created by 月飞 on 14-3-29.
 */
define(['utils/dropdown','utils/notification','utils/moment','prettify/prettify'], function (require, exports, module) {
    var dropdown = require('utils/dropdown'),
        $ = require('jquery'),
        moment=require('utils/moment'),
        notification = require('utils/notification'),
        prettify=require('prettify/prettify'),
        Message = new notification.Message(),
        previewBox=$('#js-preview'),
        list=$('#js-content-list'),
        listBox = list.find('ol'),
        page = 1,
        isLoading=false;
    list.on('scroll',function(ev){
        var clientHeight=$(this).height(),
            scrollTop=$(this).scrollTop(),
            maxHeight=listBox.height(),
            diff=50;
        if(clientHeight+scrollTop+diff>=maxHeight&&!isLoading){
            isLoading=true;
            getData({page:++page},function(){
                isLoading=false;
            })
        }
    });
    getData({page:page});
    function getData(opts,callback){
        $.ajax({
            url: '/api/post/getAll/',
            data: opts,
            dataType: 'json',
            success: function (data) {
                var template = '<li>' +
                    '<a class="permalink" href="#">' +
                    '<h3 class="entry-title">@title</h3>' +
                    '<section class="entry-meta" data-time="@time">' +
                    '<time class="date">@formNow</time>' +
                    '</section>' +
                    '</a>' +
                    '</li>';
                data.list && $.each(data.list, function (i,item) {
                    var dom=$(template.replace('@title',item.title).replace('@time',item.updateTime).replace('@formNow',moment(item.updateTime).fromNow()));
                    dom.data('post', JSON.stringify(item));
                    listBox.append(dom);
                    if(i===0&&listBox.find('.active').length<1){
                        dom.addClass('active');
                        renderPost(item);
                    }
                });
                if(data.list.length<15){
                    list.off('scroll');
                }
                callback&&callback(data.list);
            },
            error: function (error) {
                var err = '';
                try {
                    err = $.parseJSON(error.response).error;
                } catch (ex) {
                    err = error
                }
                Message.show({type: notification.MessageTypes.error, info: err});
            }
        });
    }
    function renderPost(post){
        previewBox.find('.content-preview-content').scrollTop(0);
        previewBox.find('.status').text(post.status);
        previewBox.find('.author').text(post.author.name);
        previewBox.find('.post-edit').attr('href','/admin/posts/editor/'+post._id+'/');
        previewBox.find('.post-delete').data('post-id',post._id);
        previewBox.find('.render-markdown').html('<h1>'+post.title+'</h1>');
        previewBox.find('.render-markdown').append(post.html);
        setTimeout(function(){
            prettyPrint();
        },0)
    }
    listBox.on('click','li',function(ev){
        var post;
        if(!$(ev.currentTarget).hasClass('active')){
            post=$(ev.currentTarget).data('post');
            listBox.find('li').removeClass('active');
            $(ev.currentTarget).addClass('active');
            renderPost(post);
        }
        return false;
    });
    previewBox.on('click','.post-delete',function(ev){
        var postId=$(ev.currentTarget).data('post-id'),
            confirm=window.confirm('确定删除这篇文章么？');
        if(postId&&confirm){
            $.ajax({
                url:'/api/post/delete/',
                type:'post',
                data:{id:postId},
                dataType:'json',
                headers: {
                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                },
                success:function(data){
                    if(data.post){
                        listBox.find('li.active').remove();
                        listBox.find('li').eq(0).click();
                    }
                },
                error:function(){
                    var err = '';
                    try {
                        err = $.parseJSON(error.response).error;
                    } catch (ex) {
                        err = error
                    }
                    Message.show({type: notification.MessageTypes.error, info: err});
                }
            })
        }
        return false;
    })
});