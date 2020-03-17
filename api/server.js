const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const hash = require('hash.js');
const request = require('request');
const http = require('http');
const cors = require('cors');
let MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;

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
    postGateway('json',req.body, reqIPhash,'sdk.cgi', function(data, err){
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
    postGateway('json','{"control":{"cmd":"' + cmd + '","uid":' + uid + ',"val":' + val +'}}', reqIPhash, 'sdk.cgi', function(data, err){
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
    postGateway('json','{"control":{"cmd":"getdevice"}}', reqIPhash, 'sdk.cgi', function(data, err){
        if(!err){
            const devices = parseDevices(data);
            res.send(devices);
            logger.info("Sent Devices");
            updateStoredDevices(devices);
            updateAlerts(data);
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
    postGateway('json','{"control":{"cmd":"getdevice","uid":' + id + '}}', reqIPhash, 'sdk.cgi', function(data, err){
        if(!err){
            const devices = parseDevices(data);
            res.send(devices);
            logger.info("Sent Devices");
            loadDevices(reqIPhash, function(error, data) {});
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
                            
                        ebmsDB.collection("devices").find({_id: id}).toArray(function(err, result) {
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

///SCHEDULE
schedule.post('/create', (req,res) => {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    
    var obj = JSON.parse(JSON.stringify(req.body));

    verifyIdentity(reqIPhash, function(authorised, error) {
        if (error) res.send(error);
        else if (authorised) {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                if (err) res.sendStatus(500);
                var ebmsDB = db.db("ebms");
        
                ebmsDB.collection("schedules").insertOne(obj, function(err, result) {
                    if (err) res.sendStatus(500);
                    else res.sendStatus(200);
                    db.close();
                });
                logger.info("Added new event to schedule");
                db.close();
            });
        }
        else {
            logger.info("Invalid credentials");
            res.send(401);
        };
    });
});
schedule.post('/edit', (req,res) => {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    
    var obj = JSON.parse(JSON.stringify(req.body));

    verifyIdentity(reqIPhash, function(authorised, error) {
        if (error) res.send(error);
        else if (authorised) {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                if (err) res.sendStatus(500);
                var ebmsDB = db.db("ebms");
                objectId = new ObjectID(obj._id);
                delete obj._id;
                ebmsDB.collection("schedules").updateOne({_id: objectId},{ $set : obj}, function(err, result) {
                    console.log(err);
                    if (err) res.sendStatus(500);
                    else res.sendStatus(200);
                    db.close();
                });
                logger.info("Update the schedule");
                db.close();
            });
        }
        else {
            logger.info("Invalid credentials");
            res.send(401);
        };
    });
});
schedule.delete('/', (req,res) => {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');

    verifyIdentity(reqIPhash, function(authorised, error) {
        if (error) res.send(error);
        else if (authorised) {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                if (err) res.sendStatus(500);
                var ebmsDB = db.db("ebms");
                objectId = new ObjectID(req.body.id);
                ebmsDB.collection("schedules").deleteOne({_id: objectId}, function(err, result) {
                    if (err) res.sendStatus(500);
                    else res.sendStatus(200);
                    db.close();
                });
                logger.info("deleted from the schedule");
                db.close();
            });
        }
        else {
            logger.info("Invalid credentials");
            res.send(401);
        };
    });
});
schedule.get('/', (req,res) => {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    verifyIdentity(reqIPhash, function(authorised, error) {
        if (error) res.send(error);
        else if (authorised) {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                if (err) res.sendStatus(500);
                var ebmsDB = db.db("ebms");
        
                ebmsDB.collection("schedules").find({}).toArray(function(err, result) {
                    if (err) res.send(500);
                    else res.send(result);
                });
            });
        }
        else {
            logger.info("Invalid credentials");
            res.send(401);
        };
    });
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
            db.close();
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
        db.close();
    });
    logger.info("Added new event to schedule");
});
rooms.get('/', (req,res) => {
    var reqIPhash =  hash.sha256().update(req.headers['x-forwarded-for'] || req.connection.remoteAddress).digest('hex');
    logger.info("Loading Rooms");
    postGateway('jsongetall','', reqIPhash, 'network.cgi', function(data, err){
        if(!err){
            const rooms = parseRooms(data.replace("<br>jsongetall done", ''));
            res.send(rooms);
            logger.info("Sent Rooms");
            updateStoredRooms(rooms);
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
                            
                        ebmsDB.collection("rooms").find({}).toArray(function(err, result) {
                            if (err) res.send(500);
                                else res.send(result);
                        });
                        db.close();
                        logger.info("Sent Stored Rooms");
                    
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
                db.close();
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
    postGateway('json',req.body.command, reqIPhash, 'network.cgi', function(data, err){
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
function postGateway(postKey, postData, hashedIP, page, callback){
    let requestOptions = JSON.parse(JSON.stringify(gatewayConfig));
    requestOptions.uri += page;
    requestOptions.form = {
        [postKey]: postData
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

        // ebmsDB.createCollection("schedule");
        ebmsDB.collection("apiKeys").insertOne({"token":"3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7"}, function(err, result) {
            if (err) return callback(false, err);
            logger.info("Added localhost token to DB");
            db.close();
            return callback(true, false);
        }); //sha256 for 127.0.0.1
        
        db.close();
    
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
        if (element.uid != 273) //Deals with phantom device REMOVE FOR USE WITH A NEW HUB
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
    postGateway('json','{"control":{"cmd":"getdevice"}}', reqIPhash, 'sdk.cgi', function(data, err){
        if(!err){
            updateStoredDevices(parseDevices(data));
            updateAlerts(data);
        }
        else{
            logger.info("Unable to get devices from Gateway");
            logger.info(err);
        }
    });
}

function updateAlerts(devices) {
    let parsedAlerts = [];
    devices = JSON.parse(devices);
    devices.device.forEach(element => {
        if (element.lasttampertime != 0) {
            let currentDeviceAlert = {'_id': element.uid, 'lastTamperTime':element.lasttampertime, 'name':element.channel[0].name};
            parsedAlerts.push(currentDeviceAlert);
        }
    });
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        let ebmsDB = db.db("ebms");
        let deviceIDs = [];
        parsedAlerts.forEach(device => {
            ebmsDB.collection("alerts").updateOne({_id: device._id},{ $set : {name:device.name}, $push : {tamperTimes:device.lastTamperTime}}, { upsert: true });
            db.close();
        });
    
        logger.info("Alerts Updated");

    });
}

function loadRooms(reqIPhash,callback) {
    logger.info("Loading Rooms");
    postGateway('jsongetall','', reqIPhash, 'network.cgi', function(data, err){
        if(!err){
            updateStoredRooms(parseRooms(data.replace("<br>jsongetall done", '')));
        }
        else{
            logger.info("Unable to get rooms from Gateway");
            logger.info(err);
        }
    });
}

function parseRooms(rooms) {
    let parsedRooms = [];
    rooms = JSON.parse(rooms);
    rooms.rooms.forEach(element => {
        let devices = '[';
        element.targets.forEach(target => {
            devices += '{"devID":' + target.dev + '},'
        });
        devices += ']'
        devices = devices.replace(",]", "]");

        let currentRoom = {'_id': element.title, 'devices':JSON.parse(devices)};
        parsedRooms.push(currentRoom);
    });
    return parsedRooms;
}

function updateStoredRooms(rooms) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        let ebmsDB = db.db("ebms");
        let roomIDs = [];
        rooms.forEach(room => {
            roomIDs.push(room._id);
            ebmsDB.collection("rooms").updateOne({_id: room._id},{ $set : room}, { upsert: true });
        });

        ebmsDB.collection("rooms").find({}).toArray(function(err, result) {
            try {
                if (err) throw err;
                else {
                    result.forEach(element => {
                        if(!roomIDs.includes(element._id)) {
                            ebmsDB.collection("rooms").deleteOne({_id: element._id}); 
                            logger.info("Deleted removed room");
                        }
                    });
                }
            }
            catch (err) {throw err;}
            finally {
            db.close();
            }
        });
    
        logger.info("Rooms Updated");

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
    if (success) {
        loadDevices("3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7", function(error, data){});
        loadRooms("3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7", function(error, data){})
    }
    else throw error;
});
 //Call to load the devices

setInterval( () => 
    loadDevices("3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7", function(error, data){}),
    300000
);// Update Devices / alerts every 10 min

setInterval( () => 
    checkSchedule("3e48ef9d22e096da6838540fb846999890462c8a32730a4f7a5eaee6945315f7", function(error, data){}),
    60000
);// Update Devices / alerts every 10 min


function checkSchedule(reqIPhash, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ebms");
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes();
        var day = today.getDay();
        day += -1;
        if (day < 0) day = 6;
        day += "";
        console.log(day);
        console.log(typeof day);
        dbo.collection("schedules").find({"time":time, "day":day}).toArray(function(err, result) {
            if (err) return callback(err, null);
            else {
                result.map(function(event, index) {
                    const uid = event.deviceID;
                    const cmd = event.command;
                    const val = event.value;
                    postGateway('json','{"control":{"cmd":"' + cmd + '","uid":' + uid + ',"val":' + val +'}}', reqIPhash, 'sdk.cgi', function(data, err){
                        if(!err){
                            logger.info("Command Sent");
                        }
                        else{
                            logger.info("Unable to Send Command");
                            logger.info(err);
                        }
                        db.close();
                    });
                });
                
                db.close();
            }
        });    
        db.close();
    });
}