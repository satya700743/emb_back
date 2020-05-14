const mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  { img: 
      { data: Buffer, contentType: String }
  }
);
// var Item = mongoose.model('Clothes',ItemSchema);
mongoose.model('Item',itemSchema);