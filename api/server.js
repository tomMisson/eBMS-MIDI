const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const hash = require('hash.js')
var MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

const url = "mongodb://ebms-mongo:27017/ebms";

let config = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    "port" : process.env.PORT || 3000,
    "host" : "127.0.0.7",
    "name" : "ebms-api", 
    };

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ebms");
    
    dbo.collection("apiKeys").insertOne({"token":"3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7"});

    db.close();

    console.log("Populated DB");
});


const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

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

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});