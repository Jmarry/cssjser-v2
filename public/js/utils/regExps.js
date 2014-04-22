/**
 * Created by 月飞 on 14-3-21.
 */
define(function(require,exports,module){
    module.exports={
        email:/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
        url:/^[http||https]+/,
        imageUrl:/.+\.(jpg|gif|png)/
    }
});