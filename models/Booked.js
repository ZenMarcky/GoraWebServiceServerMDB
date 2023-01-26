const mongoose = require('mongoose');



const BookedSchema = new mongoose.Schema({

firstname: {
    type: String,
    required: true,
},
middlename:{
    type:String,
    required: true,
},
lastname:{
    type: String,
    required: true,
},
address:{
    type:String,
    required: true,
},
phonenumber:{
    type: String,
    required: true,
},
email:{
    type: String,
    required: true,
},
servicetype:{
    type: String,
    required: true,
},
packageplan:{
    type: String,
    required: true,
},
message:{
    type: String,
    required: true,
},
UserId:{
    type: String,
    required: true,
}
},{timestamps:true})

const Booked = mongoose.model('Booked',BookedSchema);

module.exports = Booked;