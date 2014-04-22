/**
 * Created by 月飞 on 14-3-14.
 */
var mongoose=require('../'),
    DB=mongoose.DB,
    Schema=mongoose.Schema,
    matches=require('../../../config/regMatchs'),
    Showdown=require('showdown'),
    gitHub=require('../../../public/js/showdown/extensions/github'),
    prettify=require('../../../public/js/showdown/extensions/prettify'),
    table=require('../../../public/js/showdown/extensions/table'),
    converter=new Showdown.converter({extensions:[gitHub,prettify,table]}),
    blogModule=new Schema({
        title:{type:String,trim:true,required:true},
        markdown:{type:String,required:true},
        createTime:{type:Date,default:Date.now},
        updateTime:{type:Date,default:Date.now},
        publishTime:{type:Date,default:Date.now},
        author:{type:Schema.Types.ObjectId,ref:'User',required:true},
        tags:[{type:Schema.Types.ObjectId,ref:'Tags'}],
        views:{type:Number,default:0},
        image:{type:String},
        slug:{type:String,required:true},
        status:{type:String,default:'save'}
    },{
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });
blogModule.virtual('html').get(function(){
    return converter.makeHtml(this.markdown);
});
blogModule.statics={
    get:function(query,callback){
        this.findOne(query)
            .populate('author')
            .populate('tags')
            .exec(callback);
    },
    all:function(opts,callback){
            var criteria=opts.criteria||{},
                pages=opts.prePage||10,
                page=opts.page||0;
            this.find(criteria)
                .populate('author')
                .populate('tags')
                .sort({'updateTime':-1})
                .limit(pages)
                .skip(pages*page)
                .exec(callback);
    }
};
blogModule.pre('save',function(next){
    var list=DB.model('Blog');
    if(this.isNew||this.isModified('slug')){
        list.count({slug:this.slug},function(err,count){
            if(count<1){
                next();
            }else{
                next(new Error('the slug already exists'));
            }
        });
    }else{
        next();
    }
});
module.exports=DB.model('Blog',blogModule);