/**
 * Created by 月飞 on 14-3-17.
 */
define(['jquery'],function(require,exports,module){
    var $=require('jquery'),
        defaultConfig={
            wrapBox:'#notifications',
            messages:[],
            closeHook:'.close'
        },Message=function(opts){
            this.opts= $.extend({},defaultConfig,opts);
            if($(this.opts.wrapBox).length){
                this.init();
            }
        },MessageTypes={
            error:'notification-error',
            success:'notification-success'
        };
    Message.Template='<div class="notifications-wrap">'+
        '<section class="notification {{messageType}}">{{info}}<a class="close" href="#"><span class="hidden">Close</span></a></section>'+
    '</div>';
    Message.prototype={
        init:function(){
            this._render();
            this.closeEvent();
        },
        closeEvent:function(){
            $(document).on('click',this.opts.closeHook,function(ev){
                $(ev.currentTarget).closest('.notifications-wrap').remove();
                return false;
            })
        },
        _render:function(){
            var message,tmp;
            while(this.opts.messages.length){
                message=this.opts.messages.shift();
                tmp=Message.Template.replace('{{info}}',message.info).replace('{{messageType}}',message.type);
                $(this.opts.wrapBox).append(tmp);
            }
        },
        _destroy:function(){
            $(this.opts.wrapBox).html('');
        },
        show:function(messages){
            if(messages&&messages.info&&messages.type){
                this._destroy();
                this.opts.messages.push(messages);
                this._render();
            }
        }
    };
    module.exports={
        Message:Message,
        MessageTypes:MessageTypes
    };
});