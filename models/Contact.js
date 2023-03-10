const mongoose = require('mongoose');

const ContactsSchema = new mongoose.Schema({
    
name: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
},
message: {
    type: String,
    required: true,
},
},{timestamps:true});

const Contacts = mongoose.model('Contacts',ContactsSchema);

module.exports = Contacts;