/**
 * Created by 月飞 on 14-4-1.
 */
define(['jquery'],function(require,exports,module){
    var $=require('jquery'),
        dialogDom=$('<div id="dialog-container">' +
            '<div class="dialog-action">' +
            '<section class="dialog-content"></section>'+
            '</div>' +
            '</div>'),
        dialog=function(cfg){
            this.init();
        };
    dialog.prototype={
        init:function(){
            $('body').append(dialogDom);
        }
    };
    module.exports=dialog;
});