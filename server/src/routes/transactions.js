const express = require('express')
const router = express.Router()

const verifyToken = require ('../middleware/verifyToken')

const transactionController = require('../controllers/transactionController')
 
router.delete('/',verifyToken, transactionController.delete)
router.get('/list/:id_user',verifyToken, transactionController.list)
router.get('/list2/:id_transaction',verifyToken, transactionController.details)
router.patch('/', verifyToken, transactionController.edit )
router.post('/',verifyToken, transactionController.create)
router.get('/filterCategory/:category/:id_user', verifyToken,transactionController.filter )
module.exports = router
