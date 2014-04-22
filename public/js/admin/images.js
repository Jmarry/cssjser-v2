/**
 * Created by 月飞 on 2014/4/12.
 */
define(['utils/dropdown','utils/moment','utils/regExps'],function (require, exports, module) {
    var dropdown = require('utils/dropdown'),
        $ = require('jquery'),
        moment = require('utils/moment'),
        regs = require('utils/regExps'),
        imgBox = $('#J_imgList'),
        dropBtn = $('#J_drop_more'),
        template = '<li class="img-content">' +
            '<a class="img-file" href="http://cssjser.qiniudn.com/@double_key" target="_blank">' +
            '<img src="http://cssjser.qiniudn.com/@key?imageView2/2/w/110/h/110"/>' +
            '<div class="img-info">' +
            '<p class="img-size">@sizeKB</p>' +
            '<p class="post-time">@time</p>' +
            '</div>' +
            '</a>' +
            '</li>',
        myDropZone=new Dropzone('#drop-area',{
            method:'post',
            maxFiles:10,
            maxFilesize:2,
            addRemoveLinks:true,
            acceptedFiles:'image/*',
            init:function(){
                this.on('sending',function(file, xhr, formData){
                    formData.append('key',new Date().getTime()+'-'+file.name);
                });
                this.on('success',function(file,data){
                    $(file._removeLink).click();
                    $(template.replace('@double_key',data.key)
                        .replace('@key',data.key)
                        .replace('@size',returnFloat(data.size / 1000))
                        .replace('@time','刚刚')).prependTo(imgBox);
                })
            }
        }),
        marker;
    dropBtn.on('click', function (ev) {
        renderData({marker: marker});
    });
    renderData();
    function renderData(opts) {
        $.ajax({
            url: '/api/image/getAll/',
            data: opts || {},
            dataType: 'json',
            success: function (data) {
                var imgList = data.list,
                    listHtml = $('<div></div>');
                marker = data.marker;
                $.each(imgList, function (i, item) {
                    var tmp = '';
                    if (regs.imageUrl.test(item.key)||item.mimeType.indexOf('image')>-1) {
                        tmp = $(template.replace('@double_key',item.key).replace('@key', item.key).replace('@size', returnFloat(item.fsize / 1000)).replace('@time', moment(parseInt(item.putTime / 10000)).format('YYYY/MM/DD hh:mm')));
                        listHtml.append(tmp);
                    }
                });
                imgBox.append(listHtml.html());
                if (imgList && imgList.length < 30) {
                    dropBtn.off('click');
                    dropBtn.hide();
                }
            }
        });
    }

    function returnFloat(value) {
        value = Math.round(parseFloat(value) * 10) / 10;
        if (value.toString().indexOf(".") < 0)
            value = value.toString() + ".0";
        return value;
    }
});