const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const hash = require('hash.js')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT


var auth = express()
var api = express()
var net = express()

app.use('/auth', auth)
app.use('/api', api)
app.use('/network', net)

auth.get('/', (req, res) => {
    res.send("POST credentials to create access token");
})

auth.post('/', (req, res) => {
    const data = req.body
    
    if(data.username === process.env.USRNAME && data.password === process.env.PSWD)
    {
        let token = hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex')
        
        res.json({"token":token})
    }
    else
    {
        res.send(401)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))