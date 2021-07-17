const express = require ('express')
const pool = require('../database')
const router = express.Router()
router.delete('/delete',(req,res)=>{
    
    const {id_transaction}= req.body
    console.log({id_transaction})
    pool.query('DELETE FROM transactions WHERE id_transaction = ?',[id_transaction], (err,results)=>{
        if(err){
            res.status(400).send(err)
            return
        }
        res.status(200).json({
            status:200,
            sucess:true
        })
    })
   
    
})
router.post('/getTransactionsById', (req,res)=>{
   const {id_user} = req.body

   pool.query ('SELECT * FROM transactions WHERE id_user = ? ', [id_user] ,(err, results)=>{
   if (err) {
    res.status(400).send(err)
    return
}
if(results.length) res.json(results)
else res.send('You dont have transactions availables') 

})
})    

router.post('/add',  (req, res) => {
    const { id_transaction,
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
    console.log(newTrans)
     pool.query('INSERT INTO transactions SET ? ', [newTrans])
    res.send('received')
})
module.exports = router