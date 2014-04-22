/**
 * Created by 月飞 on 14-3-21.
 */
var crypto=require('crypto'),
    querystring = require('querystring');
exports.gravatar=function(email,opts){
    var host = 'http://www.gravatar.com/avatar/'
        , queryData = querystring.stringify(opts)
        , query = (queryData && '?' + queryData) || ''
        , email = email.toLowerCase().trim();
    return host + crypto.createHash('md5')
        .update(email).digest('hex') + query;
};
exports.extend=function(target){
    var deep, args = Array.prototype.slice.call(arguments, 1);
    if (typeof target == "boolean") {
        deep = target;
        target = args.shift();
    }
    args.forEach(function(arg) {
        extend(target, arg, deep);
    });
    return target;
};
function extend(target, source, deep) {
    for (key in source) if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
        if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
        extend(target[key], source[key], deep);
    } else if (source[key] !== undefined) target[key] = source[key];
}
function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype;
}
function isArray(value) {
    return value instanceof Array;
}
function isObject(obj) {
    return type(obj) == "object";
}
function isWindow(obj) {
    return obj != null && obj == obj.window;
}