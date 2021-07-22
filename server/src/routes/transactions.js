const express = require('express')
const pool = require('../database')
const router = express.Router()
router.delete('/delete', (req, res) => {

    const { id_transaction } = req.body
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
router.post('/getTransactionsByIdUser', (req, res) => {
    const { id_user } = req.body

    pool.query('SELECT * FROM transactions WHERE id_user = ? ORDER BY trans_date DESC LIMIT 10 ', [id_user], (err, results) => {
        if (err) {
            res.status(400).send(err)
            return
        }
        if (results.length) res.json(results)
        else res.send('You dont have transactions availables')

    })
})
router.post('/getByIdTransaction', (req, res) => {
    const { id_transaction } = req.body
    pool.query('SELECT * FROM transactions WHERE id_transaction = ? ', [id_transaction], (err, results) => {
        if (err) {
            res.status(400).send(err)
            return
        }
        if (results.length) res.json(results)
        else res.json({})
    })
})
router.patch('/editTransaction', (req, res) => {
    const { id_transaction,
        amount,
        concept,
        category,
        trans_date } = req.body
    pool.query(`UPDATE transactions SET amount = '${amount}', concept ='${concept}', category='${category}', trans_date='${trans_date}' WHERE id_transaction = '${id_transaction}' `, (err, results) => {
        if (err) {
            res.status(400).send(err)
            return
        }
        if (results.length) res.json(results)
        else res.json({})
    })
})

router.post('/add', (req, res) => {
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
    pool.query('INSERT INTO transactions SET ? ', [newTrans])
    res.send('received')
})
router.post('/foundTransactionsByCategory', (req, res) => {

    const { id_user, category } = req.body;
 

    const sqlFoundTransByCat = ` SELECT * FROM transactions WHERE id_user = '${id_user}' and category = '${category} ORDER BY id_transaction DESC LIMIT 10 ' `;

    sql.query(sqlFoundTransByCat, (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (results.length) res.json(results);
        else res.json({});
    });
});
module.exports = router


//SELECT SUM(amount) FROM transactions WHERE id_user = ${id_user} and type_movement = 'deposit';
