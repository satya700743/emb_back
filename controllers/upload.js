const express = require('express');
const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken');
const {jwtkey} = require('../keys');
// const User1 = require("../models/user");
const User = mongoose.model('User');
const upload = require("../middleware/upload");

const uploadFile = async (req, res) => {
  try {
    await upload(req, res);

    console.log("ffff",req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

  var myquery = { _id: req.file.originalname };
  var newvalues = { $set: 
      {
        photoId : req.file.id
      } 
    };
     const update = await User.updateOne(myquery, newvalues);

    return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

module.exports = {
  uploadFile: uploadFile
};