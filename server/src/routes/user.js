const express = require('express')
const router = express.Router()
const pool = require('../database')
router.post('/signin', (req, res) => {
    const { email, pass } = req.body
    try {
        pool.query('SELECT*FROM users WHERE email = ? and pass = ?', [email, pass], (err, results) => {
            if (err) {
                res.status(400).send(err)
                return
            }
            if (results.length) res.json(results)
            else res.send('User or Password are wrong')
        })
    } catch (error) {
        res.send('Error with Database')
    }
})

router.post('/signup',  (req, res) => {
    const { id_user,
        email,
        pass } = req.body
    
   
    pool.query(`INSERT INTO users SET id_user='${id_user}',email = '${email}', pass ='${pass}'`,(err)=>{
        if(err){
        res.send('User not available')
    }
    else{
        res.send('Successful registration')
    }
    
})
})
module.exports = router