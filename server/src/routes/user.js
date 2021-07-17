const express = require('express')
const router = express.Router()
const pool = require('../database')
router.post('/signin',  (req, res) => {
    const {email, pass} = req.body
      pool.query('SELECT*FROM users WHERE email = ? and pass = ?',[email, pass] ,(err, results) => {
        if (err) {
            res.status(400).send(err)
            return
        }
        if(results.length) res.json(results)
        else res.send('user or password are wrong') 
    })
})

router.post('/signup',  (req, res) => {
    const { id_user,
        email,
        pass } = req.body
    const newUser = {
        id_user,
        email,
        pass
    }
    pool.query('INSERT INTO users SET ? ', [newUser])
    res.send('received')
})
module.exports = router