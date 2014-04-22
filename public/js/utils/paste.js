/**
 * Created by 月飞 on 2014/4/12.
 */
define(function(require,exports,module){
    var $, getImageData, readImagesFromEditable;

    $ = require('jquery');

    readImagesFromEditable = function(element, cb) {
        return setTimeout((function() {
            return $(element).find('img').each(function(i, img) {
                return getImageData(img.src, cb);
            });
        }), 1);
    };

    getImageData = function(src, cb) {
        var loader;
        loader = new Image();
        loader.onload = function() {
            var canvas, ctx, dataURL;
            canvas = document.createElement('canvas');
            canvas.width = loader.width;
            canvas.height = loader.height;
            ctx = canvas.getContext('2d');
            ctx.drawImage(loader, 0, 0, canvas.width, canvas.height);
            dataURL = null;
            try {
                dataURL = canvas.toDataURL('image/png');
            } catch (_error) {

            }
            if (dataURL) {
                return cb({
                    dataURL: dataURL,
                    width: loader.width,
                    height: loader.height
                });
            }
        };
        return loader.src = src;
    };

    $.paste = function() {
        var div;
        div = document.createElement('div');
        div.contentEditable = true;
        $(div).css({
            width: 1,
            height: 1,
            position: 'fixed',
            left: -100,
            overflow: 'hidden'
        }).on('paste', function(ev) {
            var clipboardData, item, reader, text, _i, _len, _ref, _ref1, _ref2, _ref3,
                _this = this;
            if (((_ref = ev.originalEvent) != null ? _ref.clipboardData : void 0) != null) {
                clipboardData = ev.originalEvent.clipboardData;
                if (clipboardData.items) {
                    _ref1 = clipboardData.items;
                    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        item = _ref1[_i];
                        if (item.type.match(/^image\//)) {
                            reader = new FileReader();
                            reader.onload = function(event) {
                                return getImageData(event.target.result, function(data) {
                                    return $(div).trigger('pasteImage', data);
                                });
                            };
                            reader.readAsDataURL(item.getAsFile());
                        }
                        if (item.type === 'text/plain') {
                            item.getAsString(function(string) {
                                return $(div).trigger('pasteText', {
                                    text: string
                                });
                            });
                        }
                    }
                } else {
                    if (clipboardData.types.length) {
                        if ((_ref2 = (text = clipboardData.getData('Text'))) != null ? _ref2.length : void 0) {
                            $(div).trigger('pasteText', {
                                text: text
                            });
                        }
                    } else {
                        readImagesFromEditable(div, function(data) {
                            return $(div).trigger('pasteImage', data);
                        });
                    }
                }
            }
            if (clipboardData = window.clipboardData) {
                if ((_ref3 = (text = clipboardData.getData('Text'))) != null ? _ref3.length : void 0) {
                    $(div).trigger('pasteText', {
                        text: text
                    });
                } else {
                    readImagesFromEditable(div, function(data) {
                        return $(div).trigger('pasteImage', data);
                    });
                }
            }
            return setTimeout((function() {
                return $(div).html('');
            }), 2);
        });
        return $(div);
    };
});