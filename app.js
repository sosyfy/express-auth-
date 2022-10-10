const express = require('express')
const app = express()
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth")

require("dotenv").config()

require('./config/database').connect()

const User = require('./model/user')
app.use(express.json());

app.post('/register', async (req ,res)=>{
  try {
    const { firstName, lastName , email , password } = req.body; 
    if ( !( firstName && lastName && email && password) ) {
        res.status(400).json({
         status: 400 ,
         msg: "all feilds are required"
        })   
    }
 
    const existingUser = await User.findOne({email});
 
    if (existingUser) {
     res.status(401).send("user already exists")
    }
 
 const myEncryptPassword = await  bcrypt.hash( password, 8);
 
   const user = await  User.create({
     firstName,
     lastName,
     email,
     password: myEncryptPassword
    })
 
    const token = jwt.sign(
     {user_id: user._id, email},
     process.env.APP_KEY,
     {expiresIn: "2h"}
    )
 
    user.token = token 
    user.password = undefined 
 
    res.status(201).json(user)
 
  } catch (error) {
    console.log(error);
  }

})

app.post('/login', async (req, res )=>{
    try {
      const { email , password } = req.body 
      if(!(email && password )) {
        res.status(404).send("feild is missing ")
      } 

      const user = await User.findOne({email})

      if ( user && ( await bcrypt.compare(password , user.password ))) {
        // res.status(400).send(" you are not registered ")
        const token = jwt.sign(
            {user_id: user._id , email},
            process.env.APP_KEY,
            {
                expiresIn: "2h"
            }
        )

        user.token = token 
        user.password = undefined 
        // res.status(200).json(user)


        const options = {
            expires : new Date(Date.now() + 3 * 24 *60 * 1000 ),
            httpOnly: true 
        }


        res.status(200).cookie('token', token , options).json(user)
        
      }

    
    } catch (error) {
       console.log(error);  
    }
})

app.get("/dashboard", auth , ( req , res )=>{
   res.send("dfg")
})


module.exports = app;