/**
 * Created by 月飞 on 14-3-14.
 */
var mongoose=require('../'),
    DB=mongoose.DB,
    Schema=mongoose.Schema,
    matches=require('../../../config/regMatchs'),
    basicSettingModule=new Schema({
        title:{type:String,default:'CssJser'},
        description:{type:String,default:"a F2E developer's Blog"},
        logo:String,
        cover:String,
        email:{
            type:String,
            trim:true,
            lowercase: true,
            match:matches.email
        }
    });
module.exports=DB.model('basicSetting',basicSettingModule);