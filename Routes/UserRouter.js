const express = require('express');
const router = express.Router();
const  User  = require('../models/User');
const bycptjs = require('bcryptjs');;
const {sign} = require('jsonwebtoken');
const { validateToken } = require('../middleware/AuthMiddleware');


router.get('/', validateToken ,async (request,response)=>{
   if(request.user.isAdmin){
    let getAllUser = await User.find();
    response.json(getAllUser);
   }
   else{
    response.json({error:"Error Request"});
   }
})



// registerUser

router.post('/register', async (request,response)=>{
    const {username,email,password} = request.body;

const regUserName = await User.findOne({username: username});
const regUserEmail = await User.findOne( {email: email});

if(regUserEmail || regUserName){
  if(regUserEmail){
    response.json({error:"Email already exists"})
  }
  else if(regUserName){
    response.json({error:"Username already exists"})
  }
}
else{
bycptjs.hash(password,10).then((hash)=>{
    User.create({
        username:username,
        email: email,
        password: hash,
    });
    response.json("Successful");
})
}
});

// loginUser

router.post('/login',async (request,response)=>{
    const {email,password} = request.body;

    const loginUserEmail = await User.findOne({email:email});

    if(!loginUserEmail){
        response.json({error:"User not exists"});
    }
    else{
        bycptjs.compare(password, loginUserEmail.password).then((match)=>{
            if(!match){
                response.json({error:"Wrong Username And Password Combination"});
            }
            else{
const accessToken = sign({username: loginUserEmail.username,email: loginUserEmail.email,id: loginUserEmail.id,isAdmin:loginUserEmail.isAdmin},process.env.JWT_SECRECT_KEY)
response.cookie("userToken",accessToken,{
        maxAge: 1000*60*60,
        expires: new Date('01 12 2021'),
        secure: process.env.NODE_ENV === "production" ? true : false,
        httpOnly: true,
        sameSite: 'lax'
    });

response.json("SuccessFul")
            }
        })
    }

})



// get user info

router.get('/basicinfo/:userId',async (request,response)=>{
    let userId = request.params.userId;

    let getOneUser = await User.findById(userId)
    response.json(getOneUser);
});


// auth user from localstorage 

router.get('/auth',validateToken,(request,response)=>{
    response.json(request.user);
})



router.put('/changepassword',validateToken,async (request,response)=>{
let {Oldpassword,Newpassword} = request.body;
let user = await User.findById(request.user.id);

bycptjs.compare(Oldpassword,user.password).then((match)=>{
if(!match){
    response.json({error:"Wrong Password Entered"});
}
else{
    bycptjs.hash(Newpassword,10).then(async (hash)=>{
 await User.findByIdAndUpdate(request.user.id,{password:hash});
response.json(request.user);
    })
}
})

});

module.exports = router;