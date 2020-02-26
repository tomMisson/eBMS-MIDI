const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const hash = require('hash.js');
const request = require('request');
const http = require('http');
const cors = require('cors');
let MongoClient = require('mongodb').MongoClient;

const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

const app = express();

const credentials = Buffer.from(process.env.USRNAME + ':' + process.env.PSWD).toString('base64');

const url = "mongodb://ebms-mongo:27017/ebms";

let config = {
    "port" : process.env.PORT || 3000,
    "host" : process.env.IP || "0.0.0.0",
    "name" : "ebms-api", 
};

let gatewayConfig = {
    headers: {
        'Authorization': 'Basic ' + credentials,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    uri: 'http://'+process.env.GATEWAYIP+':'+process.env.GATEWAYPORT+'/',
    method: 'POST',
    "host" : process.env.GATEWAYIP,
    'port' : process.env.GATEWAYPORT
}

const logger = log({ console: true, file: false, label: config.name });

function postGateway(postData, page, callback){
    let requestOptions = JSON.parse(JSON.stringify(gatewayConfig));
    requestOptions.uri += page;
    requestOptions.form = {
        'json': postData
    };
    request(requestOptions, function (err, res, body) {
        if (err) {
            return callback(null, err);
        }
        return callback(body, false);
    });
}

loadDevices();

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

                    let currentDevice = {'_id':element.uid, 'battery':element.battery, 'channels':JSON.parse(channels)};
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
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ebms");
        var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
        dbo.collection("apiKeys").findOne({"token":reqIPhash}, function(err, item) {
            if (err) {
              logger.info(err);
              db.close();
            } else {
                if(item.token == reqIPhash) {
                    logger.info("Authorised");
                    logger.info(req.query.command);
                    postGateway('{"control":{"cmd":'+ req.body.command +'}}', 'sdk.cgi', function(data, err){
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
                
                                    let currentDevice = {'_id':element.uid, 'battery':element.battery, 'channels':JSON.parse(channels)};
                                    logger.info(JSON.stringify(currentDevice));
                                    
                                    ebmsDB.collection("devices").insertOne(currentDevice);
                
                                    res.send(devices);
                                });
                
                                db.close();
                            
                                logger.info("Added Devices to DB");
                
                            });
                        }
                        else {
                            logger.info("Unable to run " + req.query.command + " on Gateway");
                            logger.info(err);
                        }
                
                    });

                }
                else {
                    res.send(401);
                }

                db.close();
            }          
        });
        
    });
})

net.get('*', (req,res) => {

    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ebms");
        var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex')
    
        if(dbo.collection("apiKeys").find({"token":reqIPhash }))
        {
           
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

    logger.info(`Gateway running on ${gatewayConfig.host}:${gatewayConfig.port}`);
});