/**
 * Created by 月飞 on 14-3-11.
 */
var crypto=require('crypto'),
    mongoose=require('../'),
    matches=require('../../../config/regMatchs'),
    utils=require('../../lib/utils'),
    DB=mongoose.DB,
    Schema=mongoose.Schema,
    userModel=new Schema({
        name:{type:String,trim:true,required:true},
        email:{
            type:String,
            trim:true,
            lowercase: true,
            required:true,
            match:matches.email
        },
        hash_password:String,
        salt:String
    },{
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });
userModel.virtual('avatar').get(function(){
    return utils.gravatar(this.email,{s: '40'});
});
userModel.virtual('password').set(function(pass){
    this.salt=this.makeSalt();
    this.hash_password=this.encryptPass(pass);
});
userModel.path('email').validate(function(email,fn){
    var userList=DB.model('User');
    if(this.isNew||this.isModified('email')){
        userList.find({email:email},function(err,doc){
            fn(err|doc.length===0);
        })
    }else{
        fn(true);
    }
},'email already exists');
userModel.methods={
    checkPass:function(pass){
        return this.encryptPass(pass)===this.hash_password;
    },
    makeSalt:function(){
        return Math.round(new Date().getTime() * Math.random()) + '';
    },
    encryptPass:function(pass){
        return pass?crypto.createHmac('sha1',this.salt).update(pass).digest('hex'):'';
    }
};
userModel.pre('save',function(next){
    var userList=DB.model('User');
    userList.count({},function(err,count){
        if(count<=1){
            next();
        }else{
            next(new Error('the admin already exists'));
        }
    });
});
module.exports=DB.model('User',userModel);