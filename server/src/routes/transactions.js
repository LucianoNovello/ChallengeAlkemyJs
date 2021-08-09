const express = require('express')
const pool = require('../database')
const router = express.Router()
const uniqid = require('uniqid')
const {keys} = require('../keys')
const jwt = require('jsonwebtoken') 


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
router.delete('/',verifyToken, (req, res) => {

    const { id_transaction} = req.body
   
    pool.query('DELETE FROM transactions WHERE id_transaction = ?', [id_transaction], (err, results) => {
        if (err) {
            res.status(400).send(err)
            return
        }
        res.status(200).json({
            status: 200,
            sucess: true
        })

    })

})
router.get('/list/:id_user',verifyToken, (req, res) => {
    const  id_user  = req.params.id_user
   
    pool.query('SELECT * FROM transactions WHERE id_user = ? ORDER BY trans_date DESC LIMIT 10 ', [id_user], (err, results) => {
        if (err) {
            res.status(400).send(err)
            return
        }
        if (results.length) res.json(results)
        else res.send('Empty list')

    })
})
router.get('/list2/:id_transaction',verifyToken, (req, res) => {
    const  id_transaction  = req.params.id_transaction
    pool.query('SELECT * FROM transactions WHERE id_transaction = ? ', [id_transaction], (err, results) => {
        if (err) {
            res.status(400).send(err)
            return
        }
        if (results.length) res.json(results)
        else res.json({})
    })
})
router.patch('/', verifyToken, (req, res) => {
    const { id_transaction,
        amount,
        concept,
        category,
        trans_date} = req.body
    
    pool.query(`UPDATE transactions SET amount = '${amount}', concept ='${concept}', category='${category}', trans_date='${trans_date}' WHERE id_transaction = '${id_transaction}' `, (err, results) => {
        if (err) {
            res.status(400).send(err)
            return
        }
        if (results.length) res.json(results)
        else res.json({})
    })
  
})

router.post('/',verifyToken, (req, res) => {
    const id_transaction = uniqid()
    
    const {
        amount,
        concept,
        type_movement,
        category,
        id_user,
        trans_date } = req.body
    const newTrans = {
        id_transaction,
        amount,
        concept,
        type_movement,
        category,
        id_user,
        trans_date
    }
    pool.query('INSERT INTO transactions SET ? ', [newTrans])
    res.send('received')
     
})
router.get('/filterCategory/:category/:id_user', verifyToken, (req, res) => {

    const category = req.params.category
    const id_user = req.params.id_user
    pool.query( `SELECT * FROM transactions WHERE id_user = '${id_user}' and category = '${category}' ORDER BY trans_date DESC LIMIT 10  `, (err, results) => {
        if (err) {
            res.status(400).send(err)
            return

        }
        if (results.length) res.json(results)
        else res.send('Empty list')
        
    })
})
module.exports = router



