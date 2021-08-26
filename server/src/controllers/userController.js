const pool = require('../database')
const CryptoJS = require('crypto-js')
const uniqid = require('uniqid')
const {keys}= require('../keys')
const jwt = require('jsonwebtoken') 

const generateAcessToken = (user) => {
    return jwt.sign({ id: user.id_user, email: user.email },
        keys,
        { expiresIn: '1h' })
}

const userController = {
login :  function (req, res) {
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
              
                    } else {
                        const token = generateAcessToken(results[0]);
                        const userEmail = results[0].email;
                        const id = results[0].id_user;
                        res.json({id , userEmail, token});
                    }
            }
            else res.send('User or Password are wrong')
        })
        
    } catch (error) {
        res.send('Error with Database')
    }
},
register : function (req, res){

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
}
}
module.exports = userController