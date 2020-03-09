const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const hash = require('hash.js');
const request = require('request');
const http = require('http');
const cors = require('cors');
let MongoClient = require('mongodb').MongoClient;

const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const credentials = Buffer.from(process.env.USRNAME + ':' + process.env.PSWD).toString('base64');

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

const app = express();
const url = "mongodb://ebms-mongo:27017/ebms";
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

var auth = express();
var api = express();
var rooms = express();
var devices = express();
var schedule = express();
var alerts = express();
var net = express();

app.use('/auth', auth);
app.use('/api', api);
api.use('/schedule', schedule);
api.use('/devices', devices);
api.use('/alerts', alerts);
api.use('/rooms', rooms);
app.use('/network', net);

///
/// APP
///

/// Landing for GET / 
app.get('/', (req,res) => {
    res.send("<h2 style='text-align:center'>To authenticate use /auth with default credentials <br> To use the API, use /api followed by the endpoint function you wish to access<h2>");
});

/// SERVER listening point 
app.listen(config.port, config.host, (e)=> {

    ///
    /// AUTHORISE localhost by default for API
    ///

    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);

    logger.info(`Gateway running on ${gatewayConfig.host}:${gatewayConfig.port}`);
});



///
/// AUTHENTICATION
///
auth.get('/', (req, res) => {
    res.send("POST credentials to create access token");//Direction instructions
})

auth.post('/', (req, res) => {
    const data = req.body
    console.log(data);
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    //If they exist in the DB then just 200
    if(verifyIdentity(reqIPhash)){
        res.send(200);
    }
    else
    {
        //Otherwise check credentials and save IP to DB
        if(data.username === process.env.USRNAME && data.password === process.env.PSWD)
        {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                if (err) throw err;
                var dbo = db.db("ebms");
        
                dbo.collection("apiKeys").insertOne({"token":reqIPhash});
                logger.info("Added "+reqIPhash + " to DB");
                res.send(200);
                    
                db.close();
            });
        }
        else
        {
            res.sendStatus(401)
        }
    }
})




///
/// API 
///
api.post('/', (req,res) => {
    
    logger.info(`API Called`);

    logger.info(req.body);
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    postGateway(req.body.command, reqIPhash,'sdk.cgi', function(data, err){
        if(!err){
            res.send(data);
        }
        else {
            logger.info("Unable to run " + req.query.command + " on Gateway");
            logger.info(err);
        }
    });
});

///DEVICES
devices.post('/', (req,res) => {
   //Update devices in DB with SDK
});
devices.get('/', (req,res) => {
    //get all device info from SDK
});
devices.get('/:deviceID', (req,res) => {
    //Get specific status of device by ID
});

///SCHEDULE
schedule.post('/', (req,res) => {
    //Add new scheduled event
});
schedule.get('/', (req,res) => {
    //Get the entire schedule
});

///ALERTS
alerts.post('/', (req,res) => {
    //Push new Alert
});
alerts.get('/', (req,res) => {
    // Get Alert log
});

///ROOMS
rooms.post('/', (req,res) => {
    //Update all the rooms with their respected devices 
});
rooms.get('/', (req,res) => {
    //Get all devices in all rooms
});
rooms.get('/:roomName', (req, res)=> {
    //Get room by room name
});



///
/// Network API
///
net.post('/', (req,res) => {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    postGateway(req.body.command, reqIPhash, 'network.cgi', function(data, err){
        if(!err){
            res.send(data);
        }
        else {
            logger.info("Unable to run " + req.query.command + " on Gateway");
            logger.info(err);
        }       
    });
});


///
/// FUNCTIONS
///


///
///DEFINES method for how data is sent to the SDK
///
function postGateway(postData, hashedIP, page, callback){
    let requestOptions = JSON.parse(JSON.stringify(gatewayConfig));
    requestOptions.uri += page;
    requestOptions.form = {
        'json': postData
    };

    verifyIdentity(hashedIP, function(authorised, error) {
        if (error) throw error;
        else if (authorised) {
            request(requestOptions, function (err, res, body) {
                if (err) {
                    return callback(null, err);
                }
                return callback(body, false);
            });
            logger.info("Authorised");
        }
        else logger.info("Invalid credentials");
    });
}
///
///Pre-populates the database with the devices
///
function initializeDatabase(callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) return callback(null, err);
        let ebmsDB = db.db("ebms");
        
        // ebmsDB.collection("devices").insertOne();
        // ebmsDB.collection("rooms").insertOne();
        // ebmsDB.collection("schedule").insertOne();
        // ebmsDB.collection("alerts").insertOne();
        ebmsDB.collection("apiKeys").insertOne({"token":"3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7"}); //sha256 for 127.0.0.1
        
        db.close();
        
        logger.info("Added localhost token to DB");

        return callback(true, false);
    
    });
}

function loadDevices() {
    logger.info("Loading Devices");
    postGateway('{"control":{"cmd":"getdevice"}}', "3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7" , 'sdk.cgi', function(data, err){
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

///
/// VALIDATE token 
///
function verifyIdentity(reqIPhash, callback){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ebms");
        dbo.collection("apiKeys").findOne({"token":reqIPhash}, function(err, item) {
            if (err) return callback(false, err);
            return callback(item.token === reqIPhash, null);
        });    
        db.close();
    });
}

initializeDatabase(function(success, error) {
    // if (success) loadDevices();
    // else throw error;
});
 //Call to load the devices