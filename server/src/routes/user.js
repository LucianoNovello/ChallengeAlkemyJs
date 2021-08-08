const express = require('express')
const router = express.Router()
const pool = require('../database')
const CryptoJS = require('crypto-js')
const uniqid = require('uniqid')
const {keys}= require('../keys')
const jwt = require('jsonwebtoken') 


router.post('/login', (req, res) => {
    const  email = req.body.email
    const password = req.body.pass
    
    try {
        pool.query('SELECT*FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                res.status(400).send(err)
                return
            }
            if (results.length){
                const bytes  = CryptoJS.AES.decrypt(results[0].pass, keys);
                const originalPass = bytes.toString(CryptoJS.enc.Utf8);
                if(originalPass !== password){
                    res.send('User or Password are wrong')   
                }
                const accessToken = jwt.sign({id: results[0].id_user, email: results[0].email}, keys, {expiresIn: "30s" })
          
                const {pass, ...info} = results[0]   
               
                res.json({...info, accessToken})
            }
            else res.send('User or Password are wrong')
        })
        
    } catch (error) {
        res.send('Error with Database')
    }
})

const verifyToken =(req,res, next)=>{
    const authHeader = req.headers.authorization
    if(authHeader){
        const token= authHeader.split(' ')[1];
        jwt.verify(token, keys,(err, user)=>{
            if(err){
                return res.status(403).json('token is not valid!')
            }
            req.user = user
            next()
        })
    }

}

router.post('/register',  (req, res) => {
    const id_user = uniqid()
    const email = req.body.email
    const pass = req.body.pass
 
        const passEncrypted = CryptoJS.AES.encrypt(pass, keys).toString()
    
   
    pool.query(`INSERT INTO users SET id_user='${id_user}',email = '${email}', pass ='${passEncrypted}'`,(err)=>{
        if(err){
        res.send('User not available')
    }
    else{
        res.send('Successful registration')
    }
    
})
})
module.exports = router