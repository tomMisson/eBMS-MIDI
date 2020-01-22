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
    console.log(data);  
    
    if(data.username === process.env.USRNAME && data.password === process.env.PSWD)
    {
        let token = hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex')
        
        res.json({"token":token})
        console.log(token);

        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("ebms");
            
            dbo.collection("apiKeys").insertOne({"token":token});
            console.log("Inserted");
            db.close();
        })
        res.send(200);
    }
    else
    {
        res.sendStatus(401)
    }
})

/// API 

api.get('*', (req,res) => {

    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ebms");
        var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex')
    
        if(dbo.collection("apiKeys").find({"token":reqIPhash }))
        {
            axios.post(process.env.IP+'/sdk.cgi', 'json='+encodeURI(req.body.command) , config)
            .then(function (response) {
                res.log(response);
            })
            .catch(function (error) {
                res.log(error);
            });
        }
        else
        {
            res.send(401);
        }
    
        db.close();
    });
})

net.get('*', (req,res) => {

    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ebms");
        var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex')
    
        if(dbo.collection("apiKeys").find({"token":reqIPhash }))
        {
            axios.post(process.env.IP+'/network.cgi', 'json='+encodeURI(req.body.command) , config)
            .then(function (response) {
                res.log(response);
            })
            .catch(function (error) {
                res.log(error);
            });
        }
        else
        {
            res.send(401);
        }
    
        db.close();
    });
})


app.listen(port, ()=>{ console.log(`App listening on ${port}!`)})