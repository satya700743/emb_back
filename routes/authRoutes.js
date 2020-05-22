const express = require('express');
const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken');
const {jwtkey} = require('../keys');
const multer = require('multer');
const router = express.Router();
const GridFsStorage = require('multer-gridfs-storage');
const url = 'mongodb://localhost:27017/embteen';
const storage = new GridFsStorage({ url });
const uploadController = require("../controllers/upload");
const User = mongoose.model('User');
// const uploads = require("../middleware/upload");


const upload = multer({ 
  dest: "upload/",
});

router.post('/signup',async(req,res)=>{
    console.log(req.body);
    const {mobile,name,email,password} =  req.body;
    try{
    const  user = new User({mobile,name,email,password});
    await user.save();
    const token = jwt.sign({userId:user._id},jwtkey);
    res.send({token:token});
    // res.send({'email':req.user.email,'name':req.user.name,'mobile':req.user.mobile,'token':token});
    
   }catch(err)
   {
    return res.status(422).send({error:err.message});
   }
   
});

router.post('/signin',async(req,res)=>{
  const {email,password} = req.body
  if(!email || !password){
    return res.status(422).send({error:"Email or Password is incorret!"});
  }

  const user = await User.findOne({email})
  if(!user){
    return res.status(422).send({error:"Email or Password is incorret!!"});
  }

  try{
    await user.comparePassword(password);
    const token = jwt.sign({userId:user._id},jwtkey)
    res.send({token:token})
    // res.send({'email':req.user.email,'name':req.user.name,'mobile':req.user.mobile,'token':token});
  }catch{
    return res.status(422).send({error:"Email or Password is incorret!!!"})
  }
   
});

// update users 04-05-2020

router.post('/updateuser',async(req,res)=>{
  console.log("I am in")
  const {email,name,age,spouseage,spousename,spousebloodgroup,lastperioddate,
  concievedate,bloodgroup,gender} = req.body


  console.log(req.body)
 
  if(!email){
    return res.status(422).send({error:"Email or Age is incorret!"});
  }

  const user = await User.findOne({email})
  if(!user){
    return res.status(422).send({error:"Email or Age is incorret!!"});
  }

  var myquery = { email: email };
  var newvalues = { $set: 
      {
        name: name, 
        age: age,
        bloodgroup:req.body.bloodgroup,
        spouseage:spouseage,
        spousename:spousename,
        spousebloodgroup:spousebloodgroup,
        lastperioddate:lastperioddate,
        concievedate:concievedate,
        gender:gender,
      } 
    };
     const update = await User.updateOne(myquery, newvalues);
    if (update)
    {
    return res.send({'msg':'Profile have been updated','result':true})
    }else
    {
      return res.status(400).send({
      msg: 'This is an error!',
      'result':false
      });
    }


   // throw err;
   console.log({"err":err})
   console.log({"res":res})
  });

  // router.post('/updateImageprofile',async(req,res)=>{
  // console.log("body =>", req.body);
  // console.log('files => ', req.files);
  // console.log("file =>", req.file);
  // });

  // router.post("/updateImageprofile", uploadController.uploadFile);

  router.post("/updateImageprofile",upload.single('file'), async (req, res,next) => {
    console.log('file',req.file)
    console.log("I am in");
     var myquery = { _id: req.file.originalname };
      var newvalues = { $set: 
          {
            photoId : req.file.filename
          } 
        };
     const update = await User.updateOne(myquery, newvalues);
     if (update)
    {
    return res.send({'msg':'Profile have been updated','result':true})
    }else
    {
      return res.status(400).send({
      msg: 'This is an error!',
      'result':false
      });
    }
  });

  router.post("/updateImageprofile2", upload.single('photo'), (req, res,next) => {

    console.log("I am in");
    console.log('files', req.files)
     console.log('file', req.file)
    console.log('body', req.body)
    res.status(200).json({
      message: 'success!',
    })
  });
  

// // update users 04-05-2020 end

module.exports = router