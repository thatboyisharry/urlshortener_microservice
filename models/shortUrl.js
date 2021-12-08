const mongoose=require('mongoose');

const Schema= mongoose.Schema;

const shortURLSchema=new Schema({
    original_url: String,
    short_url:String
});

let ShortURL=mongoose.model('ShortURL',shortURLSchema);

module.exports=ShortURL;

