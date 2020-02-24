const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const hash = require('hash.js');
const request = require('request');
const http = require('http');
const axios = require('axios');
const cors = require('cors');
let MongoClient = require('mongodb').MongoClient;

const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

const app = express();

const credentials = Buffer.from(process.env.USRNAME + ':' + process.env.PSWD).toString('base64');

const url = "mongodb://ebms-mongo:27017/ebms";

let config = {
    headers: {
        'Authorization': 'Basic ' + credentials,
        "Content-Type": "application/x-www-form-urlencoded",
    },
    "port" : process.env.PORT || 3000,
    "host" : process.env.IP || "0.0.0.0",
    "name" : "ebms-api", 
};

const logger = log({ console: true, file: false, label: config.name });

function postGateway(postData, page, callback){
    let clientServerOptions = {
        uri: 'http://'+process.env.GATEWAYIP+':'+process.env.GATEWAYPORT+'/'+page,
        form: {
            'json': postData
          },
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + credentials,
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    request(clientServerOptions, function (err, res, body) {
        if (err) {
            console.error(err);
            return callback(null, err);
        }
        logger.info(res.statusCode);
        return callback(body, false);
    });
}

loadDevices();
loadGroups();
loadAlerts();

function loadDevices() {
    postGateway('{"control":{"cmd":"getdevice"}}', 'sdk.cgi', function(data, err){
        if(!err){
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                if (err) throw err;
                let ebmsDB = db.db("ebms");
                let devices = JSON.parse(data);
                devices.device.forEach(element => {
                    
                    let channels = '[';
                    element.channel.forEach(channel => {
                        channels += '{"name":"' + channel.name + '"},'
                    });
                    channels += ']'
                    channels = channels.replace(",]", "]");

                    let currentDevice = {'uid':element.uid, 'battery':element.battery, 'channels':JSON.parse(channels)};
                    logger.info(JSON.stringify(currentDevice));

                    ebmsDB.collection("devices").insertOne(currentDevice);
                });

                db.close();
            
                logger.info("Added Devices to DB");

            });
        }
        else{
            logger.info("Unable to get devices from Gateway");
            logger.info(err);
        }

    });
}

function loadGroups() {

}

function loadAlerts() {

}

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    let ebmsDB = db.db("ebms");
    
    ebmsDB.collection("apiKeys").insertOne({"token":"3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7"});
    
    db.close();
            
    logger.info("Added localhost token to DB");

});

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
        let token = hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
        
        res.json({"token":token});
        console.log(token);

        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("ebms");
            
            dbo.collection("apiKeys").insertOne({"token":token});
            logger.info("Added "+token + " to DB");
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
    
    logger.info(`API Called`);
    logger.info(req);
    logger.info(res);
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ebms");
        var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex')
    
        if(dbo.collection("apiKeys").find({"token":reqIPhash }))
        {

            // axios.post(process.env.IP+'/sdk.cgi', 'json='+encodeURI(req.body.command) , config)
            // .then(function (response) {
            //     res.log(response);
            // })
            // .catch(function (error) {
            //     res.log(error);
            // });
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
        throw new Error('Internal Server Error');``
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);

    logger.info(`Gateway running on ${process.env.GATEWAYIP}:${process.env.GATEWAYPORT}`);
});