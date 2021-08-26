const jwt = require('jsonwebtoken');
const { keys } = require('../keys');

const verifyToken = (req,res, next)=>{
    const authHeader = req.headers.authorization
   
    if(authHeader){
        const token = authHeader.split(' ')[1];
       
        jwt.verify(token, keys,(err, user)=>{
            if(err){
              
                return res.status(403).json('token is not valid!')
            }
            
            req.user = user
           
            next()
        })
    }
    else{
        res.json('not authoraz')
    }

}


module.exports = verifyToken;