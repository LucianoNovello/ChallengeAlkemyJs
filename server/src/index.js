const express = require ('express')
const morgan = require ('morgan')
const cors = require('cors')


//inits
const app = express()


app.set('port',process.env.PORT || 4000)

//middlewares


app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//Routes
app.use(require('./routes/index'))
app.use('/user',require('./routes/user'))
app.use('/transactions',require('./routes/transactions'))
//Starting Server
app.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'))
})

