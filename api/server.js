const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const hash = require('hash.js')
var MongoClient = require('mongodb').MongoClient;
const axios = require('axios');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000
const url = "mongodb://ebms-mongo:27017/ebms";
let config = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    }
  }

var auth = express()
var api = express()
var net = express()

app.use('/auth', auth)
app.use('/api', api)
app.use('/network', net)

/// AUTHENTICATION

auth.get('/', (req, res) => {
    res.send("POST credentials to create access token");
})

auth.post('/', (req, res) => {
    const data = req.body
    
    if(data.username === process.env.USRNAME && data.password === process.env.PSWD)
    {
        let token = hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex')
        
        res.json({"token":token})

        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("ebms");
            
            dbo.collection("apiKeys").insertOne({"token":token});
            console.log("Inserted");
            db.close();
        })
    }
    else
    {
        res.sendStatus(401)
    }
})

/// API 

api.get('*', (req,res) => {
    axios.post('192.168.0.129/sdk.cgi', 'json='+encodeURI(req.body.command) , config)
    .then(function (response) {
        res.log(response);
    })
    .catch(function (error) {
        res.log(error);
    });
})

net.get('*', (req,res) => {
    axios.post('192.168.0.129/sdk.cgi', 'json='+encodeURI() , config)
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
})


app.listen(port, ()=>{ console.log(`App listening on ${port}!`)})