const express = require('express');
const router = express.Router();
const  Booked  = require('../models/Booked');
const { validateToken } = require('../middleware/AuthMiddleware');

//get books
router.get('/' ,validateToken ,async (request,response)=>{
  if(request.user.isAdmin){
    const listOfBooked = await Booked.find();
  response.json(listOfBooked);
  }
else{
  response.json({error:"Error Request"});
}
});


//get user Booked
router.get('/books/:userId',async (request,response)=>{
  const userId = request.params.userId;
  const listOfUserBooked = await Booked.find({UserId: userId});
response.json(listOfUserBooked);
});


//post books
router.post('/',validateToken ,async (request,response)=>{
const bookedRequest = request.body;
bookedRequest.UserId = request.user.id
await Booked.create(bookedRequest);
response.json(bookedRequest);
})


//delete contact
router.delete('/:contactId',validateToken,async (request,response)=>{
  const bookId = request.params.contactId;
  
  if(request.user.isAdmin){
      await Booked.findByIdAndDelete(bookId);
  response.json("Success");
  }
  else{
      response.json({error:"Error Request"});
  }
  
  });



module.exports = router;