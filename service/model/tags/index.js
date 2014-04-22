/**
 * Created by 月飞 on 14-3-14.
 */
var mongoose=require('../'),
    DB=mongoose.DB,
    Schema=mongoose.Schema,
    matches=require('../../../config/regMatchs'),
    tagsModule=new Schema({
        createTime:{type:Date,default:Date.now()},
        name:{type:String,trim:true,required:true,default:'default'},
        updateTime:{type:Date,default:Date.now()}
    });
module.exports=DB.model('Tags',tagsModule);