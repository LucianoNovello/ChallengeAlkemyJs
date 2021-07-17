const express = require ('express')
const router = express.Router()

router.get('/', (req, res)=>{
    res.send('helloWorld')

}) 
module.exports = router