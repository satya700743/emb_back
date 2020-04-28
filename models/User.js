const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    mobile:{
        type:String,
        // unique:true,
        required:[true,'Mobile is required'],
        validate: {
        validator: function(v){
            return this.model('User').findOne({ mobile: v }).then(user => !user)
        },
        message: props => `${props.value} is already used by another user`
       },
    },
    name:{
        type:String,
        required:[true,'Name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Invalid email format'],
        validate: {
        validator: function(v){
            return this.model('User').findOne({ email: v }).then(user => !user)
        },
        message: props => `${props.value} is already used by another user`
       },
        // unique:true
    },
    password:{
        required:[true,'Password is required'],
        type:String
    }
});

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err)
        {
            return next(err);
        }
        bcrypt.hash(user.password,salt,(err,hash)=>{
            if(err){
                return next(err)
            }
            user.password = hash;
            next()
        })
    });
})

userSchema.methods.comparePassword = function (candidatePassword){
    const user = this;
    return new Promise((resolve,reject)=>{
        bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
            if(err){
                return reject(err)
            }
            if(!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })
}

mongoose.model('User',userSchema);