/**
 * Created by 月飞 on 14-3-15.
 */
seajs.config((function(){
    var config={
        // 别名配置
        alias: {
            'jquery': 'zepto/zepto'
        },
        debug:false,
        map:[
            ['.js', '.min.js']
        ],
        // Sea.js 的基础路径
        base: G_CONFIG.domain+'scripts/',
        // 文件编码
        charset: 'utf-8'
    };
    if(G_CONFIG.ENV==='dev'){
        config.debug=true;
        config.map=[];
        config.base=G_CONFIG.domain+'js/';
    }
    return config;
})());