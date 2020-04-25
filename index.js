const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const {mongoUrl} = require('./keys');



require('./models/User');
const requireToken = require('./middleware/requireToken');
const authRoutes = require('./routes/authRoutes');

app.use(bodyParser.json());
app.use(authRoutes);

mongoose.connect(mongoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.on('connected',()=>{
    console.log('connected to mongo');
});

mongoose.connection.on('error',(err)=>{
    console.log('This is error',err);
});



app.get('/',requireToken,(req,res)=>{
    console.log(req.body)
    res.send({'email':req.user.email,'name':req.user.name,'mobile':req.user.mobile})
})

app.listen(PORT,()=>{
    console.log('Server Running  '+PORT);
})