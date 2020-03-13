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
    "port" : process.env.GATEWAYPORT,
    "requestInProgress": false
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
var control = express();

app.use('/auth', auth);
app.use('/api', api);
api.use('/schedule', schedule);
api.use('/devices', devices);
api.use('/alerts', alerts);
api.use('/rooms', rooms);
app.use('/network', net);
api.use('/control', control)

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
    if(verifyIdentity(reqIPhash, function(auth, err) {})){//MAY CAUSE ISSUES LATER WHEN USER CONNECTS TO WEB UI UN-AUTHED
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
    postGateway(req.body, reqIPhash,'sdk.cgi', function(data, err){
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
control.get('/:deviceID/:command/:val', (req,res) => {
    const uid = req.params.deviceID;
    const cmd = req.params.command;
    const val = req.params.val;
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    postGateway('{"control":{"cmd":"' + cmd + '","uid":' + uid + ',"val":' + val +'}}', reqIPhash, 'sdk.cgi', function(data, err){
        if(!err){
            res.send("Command Sent");
        }
        else{
            logger.info("Unable to Send Command");
            logger.info(err);
            res.send(err);
        }
    });
});

///DEVICES
devices.post('/', (req,res) => {
   //TBC
});
devices.get('/', (req,res) => {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    logger.info("Loading Devices");
    postGateway('{"control":{"cmd":"getdevice"}}', reqIPhash, 'sdk.cgi', function(data, err){
        if(!err){
            const devices = parseDevices(data);
            res.send(devices);
            logger.info("Sent Devices");
            updateStoredDevices(devices);
        }
        else{
            logger.info("Unable to Send Command");
            logger.info(err);
            verifyIdentity(reqIPhash, function(authorised, error) {
                if (error) res.send(error);
                else if (authorised) {
                    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                        if (err) res.send(500);
                        let ebmsDB = db.db("ebms");
                            
                        ebmsDB.collection("devices").find({}).toArray(function(err, result) {
                            if (err) res.send(500);
                                else res.send(result);
                        });
                        db.close();
                        logger.info("Sent Stored Devices");
                    
                    });
                    logger.info("Authorised");
                }
                else {
                    logger.info("Invalid credentials");
                    res.send(401);
                };
            });
        }
    });
});
devices.get('/:deviceID', (req,res) => {
    var id = parseInt(req.params.deviceID);
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    logger.info("Loading Devices");
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        let ebmsDB = db.db("ebms");
        
        ebmsDB.collection("devices").find({_id: id}).toArray(function(err, result) {
            if (err) res.send(500);
            else res.send(result);
        });
        db.close();
    
        logger.info("Sent Devices");

    });
    if (!gatewayConfig.requestInProgress) {
        gatewayConfig.requestInProgress = true;
        loadDevices(id, reqIPhash, res);
    }
    else logger.info("gateway busy");
});

///SCHEDULE
schedule.post('/', (req,res) => {
    var startTime = req.body.start;
    var endTime = req.body.end;
    var day = req.body.day;
    var title = req.body.title;
    var devices = req.body.devices;

    var obj = {
        "start":startTime,
        "end":endTime,
        "day":day,
        "name":title,
        "devices":devices
    }

    if(verifyIdentity(reqIPhash, function(auth, err) {})){
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var ebmsDB = db.db("ebms");
    
            ebmsDB.collection("schedule").insertOne(obj, function(err, result) {
                if (err) throw err;
                res.send(200);
                ebmsDB.close();
            });
            logger.info("Added new event to schedule");
        });
    }
    else{

    }
});
schedule.get('/', (req,res) => {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    if(verifyIdentity(reqIPhash, function(auth, err) {})){
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var ebmsDB = db.db("ebms");
    
            ebmsDB.collection("schedule").find({}, function(err, result) {
                if (err) throw err;
                res.send(result);
                ebmsDB.close();
            });
        });
    }
    else
    {
        res.send(401);
    }
});

///ALERTS
alerts.post('/', (req,res) => {
    //Push new Alert
    // Will need to regularly poll this endpoint and rules for an alert implemented 
});
alerts.get('/', (req,res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var ebmsDB = db.db("ebms");

        ebmsDB.collection("alerts").find({}, function(err, result) {
            if (err) throw err;
            res.send(result);
            ebmsDB.close();
        });
        logger.info("Added new event to schedule");
    });
});

///ROOMS
rooms.post('/', (req,res) => {
    //Update all the rooms with devices or names
    var title = req.body.title;
    var devices = req.body.devices;

    var obj = {
        "name":title,
        "devices":devices
    }
    ebmsDB.collection("apiKeys").insertOne(obj, function(err, result) {
        if (err) throw err;
        res.send(result);
        ebmsDB.close();
    });
    logger.info("Added new event to schedule");
});
rooms.get('/', (req,res) => {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    if(verifyIdentity(reqIPhash, function(auth, err) {})){
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var ebmsDB = db.db("ebms");
    
            ebmsDB.collection("rooms").find({}, function(err, result) {
                if (err) throw err;
                res.send(result);
                ebmsDB.close();
            });
        });
    }
    else
    {
        res.send(401);
    }
});
rooms.get('/:roomName', (req, res)=> {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    var room = req.params.roomName;
    if(verifyIdentity(reqIPhash, function(auth, err) {})){
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var ebmsDB = db.db("ebms");
    
            ebmsDB.collection("rooms").find({"name": room}, function(err, result) {
                if (err) throw err;
                res.send(result);
                ebmsDB.close();
            });
        });
    }
    else
    {
        res.send(401);
    }
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
net.get('', () => {res.send("POST /net to send command")});




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
        else {
            logger.info("Invalid credentials");
            return callback(null, 401);
        };
    });
}
///
///Pre-populates the database with the devices
///
function initializeDatabase(callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) return callback(null, err);
        let ebmsDB = db.db("ebms");
        
        // ebmsDB.createCollection("devices");
        // ebmsDB.createCollection("rooms");
        // ebmsDB.createCollection("schedule");
        // ebmsDB.createCollection("alerts");
        ebmsDB.collection("apiKeys").insertOne({"token":"3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7"}); //sha256 for 127.0.0.1
        
        db.close();
        
        logger.info("Added localhost token to DB");

        return callback(true, false);
    
    });
}

function parseDevices(devices) {
    let parsedDevices = [];
    devices = JSON.parse(devices);
    devices.device.forEach(element => {
        let channels = '[';
        element.channel.forEach(channel => {
            channels += '{"name":"' + channel.name + '", "basicValue":' + channel.basicvalue + ',"sensorValue":' + channel.sensorvalue + '},'
        });
        channels += ']'
        channels = channels.replace(",]", "]");

        let currentDevice = {'_id': element.uid, 'battery':element.battery, 'channels':JSON.parse(channels)};
        parsedDevices.push(currentDevice);
    });
    return parsedDevices;
}

function updateStoredDevices(devices) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        let ebmsDB = db.db("ebms");
        let deviceIDs = [];
        devices.forEach(device => {
            deviceIDs.push(device._id);
            ebmsDB.collection("devices").updateOne({_id: device._id},{ $set : device}, { upsert: true });
        });

        ebmsDB.collection("devices").find({}).toArray(function(err, result) {
            try {
                if (err) throw err;
                else {
                    result.forEach(element => {
                        if(!deviceIDs.includes(element._id)) {
                            ebmsDB.collection("devices").deleteOne({_id: element._id}); 
                            logger.info("Deleted removed device");
                        }
                    });
                }
            }
            catch (err) {throw err;}
            finally {
            db.close();
            }
        });
    
        logger.info("Devices Updated");

    });
}

function loadDevices(reqIPhash,callback) {
    logger.info("Loading Devices");
    postGateway('{"control":{"cmd":"getdevice"}}', reqIPhash, 'sdk.cgi', function(data, err){
        if(!err){
            updateStoredDevices(parseDevices(data));
        }
        else{
            logger.info("Unable to get devices from Gateway");
            logger.info(err);
            if (res != null) res.send(500);
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
            if (err || (item === null)) return callback(false, err);
            else return callback(true, null);
        });    
        db.close();
    });
}

initializeDatabase(function(success, error) {
    if (success) loadDevices("3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7",function(error, data){});
    else throw error;
});
 //Call to load the devices