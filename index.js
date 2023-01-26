const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();
const { validateToken } = require('./middleware/AuthMiddleware');
const app = express();

//mongodb connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};



// MiddleWare
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended:true}));
app.use(helmet());
app.use(cookieParser());

//Routes
const userRoutes = require('./Routes/UserRouter');
app.use('/user',userRoutes)

const bookedRouter = require('./Routes/BookRouter');
app.use('/booked',bookedRouter);

const contactRouter = require('./Routes/ContactedRouter');
app.use('/contact',contactRouter);

app.get('/deletecookie',validateToken, (request, response) => {
  //show the saved cookies
  response.clearCookie("userToken")
  response.json("success");
});



const Port = process.env.Port || 3001;

app.listen(Port,()=>{
    console.log(`App is listening to http://localhost:${Port}/`)
})