const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    mobile:{
        type:String,
        // unique:true,
        required:[true,'Mobile is required'],
        match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Invalid mobile format'],
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
    },
     gender:{
        type:String
    },
    age:{
        type:String
    },
    bloodgroup:{
        type:String
    },
    spouseage:{
        type:String
    },
    spousename:{
        type:String
    },
    spousebloodgroup:{
        type:String
    },
    lastperioddate:{
        type:String
    },
    concievedate:{
        type:String
    },
    photoId:{
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

// 04-05-2020
userSchema.pre('updateuser',function(next){
    const user = this;
})
// 

mongoose.model('User',userSchema);