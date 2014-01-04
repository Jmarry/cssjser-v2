/**
 * Created by 月飞 on 14-1-4.
 */
void function(){
    var doc = document;
//当前脚本的script节点 require.js的script节点
    var jsNode = function(ns){
        return ns[ns.length - 1];
    }(doc.getElementsByTagName("script"));

    var config = {};

//获取lib路径
    config.base = jsNode.getAttribute("data-base") || jsNode.src.split(/\?/)[0].replace(/[^\/]*$/, "");
//用于配置别名
    config.alias = {};

//通过模块ID解析成 模块url
    function getUrl(src,flag){
        var u = (config.alias[src] || src).match(/^([^?#]*)(.*)$/);
        var url = (/\.js$/.test(u[1])?u[0]:(u[1] + ".js" + u[2])).replace(/^\.\//, config.base);
        if(flag){
            return url.match(/^([^#]*)(.*)$/);
        }
        return url;
    }

//已经加载完毕的js
    var jsLoaded = {};
    jsLoaded[jsNode.src] = true;
//待加载的js，使用队列来加载 先进先出
    var jsWait = [];
//待回调的函数集，使用堆栈来回调
    var callWait = [];
//js是否在执行中，序列号脚本加载表示，统一时刻，只允许一个js被加载或者执行
    var jsFlag = 0;
//模块化
    var xModules = {};

//进栈
    //将 需要加载的js地址、回调函数 压入 jsWait（队列）和callWait（堆栈）
    function stackPush(urls, callBack, charset){
        //callWait（堆栈）进栈
        if(callBack){
            callWait.push(callBack);
        }
        //压入js队列
        for(var i = 0; i < urls.length; i += 1){
            jsWait.push([urls[i], stackShift, charset]);
        }
        //如果序列号加载没进行的话，马上执行序列号加载js
        if(jsFlag == 0){
            jsFlag = 1;
            stackShift();
        }
    }

    //获取模块的 exports
    function getExports(id){
        var x = xModules[getUrl(id)] || {};
        return x.exports;
    }


    function stackShift(){
        //优先加载js  序列加载
        if(jsWait.length){
            var js = jsWait.shift();
            disorderJS.apply(null, js);
            return ;
        }
        //其次，出栈回调函数
        //如果回调函数中，再次执行 stackShift 的时候，又会优先加载js
        if(callWait.length){
            var back = callWait.pop();
            back(getExports);
            stackShift();
            return ;
        }
        //表示序列号加载js结束
        jsFlag = 0;
    }

//加载script脚本
    function loadJS(url, callBack, charset){
        //alert(url);
        var t = doc.createElement("script");
        t.setAttribute("type", "text/javascript");
        charset && t.setAttribute("charset", charset);
        t.onreadystatechange = t.onload = t.onerror = function(){
            if(!t.readyState || t.readyState == 'loaded' || t.readyState == 'complete'){
                //alert(t.readyState);
                t.onreadystatechange = t.onload = t.onerror = null;
                t = null;
                //防止回调的时候，script还没执行完毕
                callBack && setTimeout(function(){
                    callBack(url);
                },0);
            }
        };
        t.src = url;
        doc.getElementsByTagName("head")[0].appendChild(t);
    }

    //设置这个某个js加载完毕，防止重复加载
    function requireJSed(url){
        var x = jsLoaded[url];
        if(x && x!==true){
            for(var i= 0,n;i<x.length;i+=1){
                n = x[i];
                n[0](n[1]);
            }
            jsLoaded[url] = true;
        }
    }

    //
    function requireJS(src, callBack, charset){
        var url = getUrl(src,true)[1];
        if(jsLoaded[url] === true){
            setTimeout(function(){
                callBack(src);
            },0);
            return;
        }
        if(jsLoaded[url] == null){
            jsLoaded[url] = [];
        }
        jsLoaded[url].push([callBack,src]);
        loadJS(url,requireJSed,charset);
    }

//无序在序列中使用数组urls的话，那这个数组中的url会同时加载
    function disorderJS(urls, callBack, charset){
        if(typeof urls == "string"){
            requireJS(urls, callBack, charset);
            return;
        }
        var led = {};

        function loadBack(src){
            delete led[src];
            for(var n in led){
                return;
            }
            callBack();
            loadBack = function(){};
        }

        for(var i = 0;i < urls.length; i+=1){
            led[urls[i]] = true;
            requireJS( urls[i], loadBack, charset);
        }
        return;
    }

    function skyused(urls,arr){
        for(var i = 0;i < urls.length; i+=1){
            if(urls[i].push && urls[i].shift){
                skyused(urls[i],arr);
            }
            else{
                arr.push(getExports(urls[i]));
            }
        }
        return arr;
    }

//使用模块
    //使用模块化加载，也可以加载非模块化的js，而且完全能办证加载顺序
    var use = window.require = function(){
        var urls = Array.prototype.slice.call(arguments),len = urls.length,callBack,charset,back;
        if(typeof urls[len - 2] == "function"){
            charset = urls.pop();
            len -= 1;
        }
        if(typeof urls[len - 1] == "function"){
            callBack = urls.pop();
        }
        if(callBack){
            back = function(){
                callBack.apply(window,skyused(urls,[]));
            };
        }
        setTimeout(function(){
            stackPush(urls,back,charset);
        },0);
        return this;
    };

    function defineBack(factory,x){
        if(typeof factory == "function"){
            var y = factory(function(id){
                return getExports(x.deps && x.deps[id] || id);
            }, x.exports,x);
            if(y != null){
                x.exports = y;
            }
        }
        else{
            x.exports = factory;
        }
    }

//定义模块
    window.define = function(){
        var ag = Array.prototype.slice.call(arguments);
        var factory = ag.pop(),deps,id = "";
        if(ag.length){
            deps = ag.pop();
            if(typeof deps == "string"){
                id = deps;
                deps = null;
            }
            else{
                id = ag.pop();
            }
        }
        var u = getUrl("./" + id,true);
        var x = xModules[u[0]] = {url:u[1],id:u[0]};
        x.exports = {};
        if(deps){
            x.deps = deps;
            use(deps,function(){
                defineBack(factory,x);
            });
        }
        else if(u[1] == jsNode.src.split(/[\?#]/)[0]){
            defineBack(factory,x);
            jsLoaded[u[1]] = true;
        }
        else{
            setTimeout(function(){
                defineBack(factory,x);
            },0);
        }
    }}();