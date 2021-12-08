require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validUrl=require('valid-url');
const app = express();
const dns=require('dns');
const mongoose = require('mongoose');
const ShortURL = require('./models/shortUrl');

//connect to db

dbRoute=process.env.MONGO_URL;
mongoose.connect(dbRoute);
db=mongoose.connection;

db.once('open',()=>{
  console.log("Connected to the database")
});

db.on('error',console.error.bind(console,'Connection to database failed'));



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended:false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl',(req,res)=>{
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/shorturl',(req,res)=>{
  let original_url=req.body.url;
  let urlObj=new URL(original_url);
  let short_url=Math.floor(Math.random()*(5000-4000) +1000).toString();
  console.log(short_url);
  const data={
    original_url:original_url,
    short_url:short_url
  }

  
  //saving to db
  if(!validUrl.isHttpsUri(original_url)){
    
    res.json({error:"invalid url"});

  }else{
   
    dns.lookup(urlObj.hostname,(err,address,family)=>{
      if(err!==null){
        res.json({error:"invalid url"});
      }else{
        let url= new ShortURL(data);

        url.save((err,data)=>{
          if(err) return console.log(err);
          res.json({original_url:data.original_url,short_url:data.short_url});
        
        });

      }
    });

  }
  
});

app.get('/api/shorturl/:shorturl',(req,res)=>{

  let short_url=req.params.shorturl.toString();
  //find original URL matching the short url
  ShortURL.findOne({short_url:short_url},(err,url)=>{
    if(err) return console.log(err);
    res.redirect(`${url.original_url}`);
  });


});




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
