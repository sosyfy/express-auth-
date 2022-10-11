const jwt = require('jsonwebtoken')

const  auth = (req, res ,next )=>{
    const token = req.header("auth").replace("Bearer ", "") ||
    req.cookies.token ||
    req.body.token;

    if(!token){
        return res.status(403).send("token is missing")
    }
   
    try {
     const dcode =  jwt.verify( token, process.env.APP_KEY);
    } catch (error) {
        // console.log(error); 
        res.status(400).send("Invalid Token sent ")
    }

    return next()
}

module.exports = auth;