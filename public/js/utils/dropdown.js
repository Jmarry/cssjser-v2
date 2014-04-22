/**
 * Created by 月飞 on 14-3-21.
 */
define(['jquery'],function(require,exports,module){
    var $=require('jquery');
    $(document).on('click',function(ev){
        if($(ev.target).hasClass('drop-down')||$(ev.target).closest('.drop-down').length){
            return false;
        }
        var dropdowns=$('.drop-down'),
            actives=dropdowns.filter(function(key){
                return $(dropdowns[key]).hasClass('active');
            });
        if(actives.length){
            actives.each(function(key,currentTarget){
                var currentTarget=$(currentTarget),
                    toggle=currentTarget.attr('data-toggle'),
                    toggleDom=currentTarget.find(toggle);
                if(!toggleDom.length){
                    toggleDom=currentTarget.next(toggle);
                }
                if(!toggleDom.length){
                    toggleDom=currentTarget.prev(toggle);
                }
                if(toggleDom.length){
                    currentTarget.removeClass('active');
                    toggleDom.hide();
                }
            })
        }
    });
    $(document).on('click','.drop-down',function(ev){
        var currentTarget= $(ev.currentTarget),
            toggle=currentTarget.attr('data-toggle'),
            toggleDom=currentTarget.find(toggle);
        if(!toggleDom.length){
            toggleDom=currentTarget.next(toggle);
        }
        if(!toggleDom.length){
            toggleDom=currentTarget.prev(toggle);
        }
        if(toggleDom.length){
            if(currentTarget.hasClass('active')){
                currentTarget.removeClass('active');
                toggleDom.hide();
            }else{
                currentTarget.addClass('active');
                toggleDom.show();
            }
        }
        return false;
    })
});