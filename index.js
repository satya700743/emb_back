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
    // console.log(req.body)
    res.send({
        'email':req.user.email,
        'name':req.user.name,
        'mobile':req.user.mobile,
        'age':req.user.age,
        'gender':req.user.gender,
        'spousebloodgroup':req.user.spousebloodgroup,
        'bloodgroup':req.user.bloodgroup,
        'spouseage':req.user.spouseage,
        'spousename':req.user.spousename,
        'lastperioddate':req.user.lastperioddate,
        'concievedate':req.user.concievedate,
        'u_id':req.user._id
    })
    // res.send(req.body)
}) 



app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

// app.listen(PORT,()=>{
//     console.log('Server Running  '+PORT);
// })



