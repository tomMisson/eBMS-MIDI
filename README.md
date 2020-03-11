# eBMS-MIDI
HTML5 User interface for MIDI Gateway

## Contents
- [API](##API)
- [React Fronted](##Frontend)
- [Docker platform for deployment](##Docker-platform)   


## API
### Auth endpoint

This API gives direct access to the SDK which requires authentication for each request. To simplify this, you authenticate once at the start to log your IP address then you can make as many requests as you wish. To authenticatue, make sure the API is running then navigate to `http://<Ip-address of device running the api>/auth` and post the following JSON object. 

```json
{
    "username": "admin",
    "password": "888888"
}
```

This should return a token that you don't have to take note of that will have been added to the database and will authorise your IP address. If you have authenticated already, you will get a `200 - Good` staus and if you have failed authentication (due to an error with the credentails, you will get a `401 - Unauthorised`response. By default localhost is authenticated to allow data-communication between the frontend and api. 
  
### API endpoint

All of the API endpoints require you to have authenticated to be able to interact with them, failure to pre-authenticate will result in a `401 - Unauthenticated`. The default `/API` endpoint allows the most direct form of communication with the SDK as it takes a command in the form of a JSOn object, such commands are like the one below for retreving device information:

```JSON
{
    "control":{"cmd":"getdevices"}}
}
```

Please read the gateway technical documentation for the full list of commands. 

### API sub-endpoints
These endpoints extend `/api` and allow you to view and add data for the rooms and schedule, functionality such as deleting or editing rooms currently in't suppoted but the archutecture could be extended to support these by extedning the sub endpoints. 

#### Devices 
A GET on `/api/devices` will return a full list of the device information from the SDK, this includes details like the name of devices and current status of sensors. 

A GET on `/api/devices/<deviceID>` will return a specific devices information from the SDK.

A POST on `api/devices` currently has no purpose.

#### Schedule
A GET on `api/schedule` will return the full schedule of for the week including the device, the action for that device, the time at which it should happen.

A POST to `api/shedule` will add a action to the shedule, it takes a JSON array in the form below:

```JSON
{
    "name":"<name of action>",
    "startTime": <hour to start>,
    "endTime": <hour to end>,
    "day": "<day of week>",
    "devices": [<device id>]
}
```

#### Rooms

A GET on `/api/rooms` will return a full list of all the rooms and the devices within them.

A GET on `/api/rooms/<rooms name>` will return the devices and name of that specific room.

A POST on `api/rooms` will add the room to the database, it expects data in the form below.

```JSON
{
    "title":"Bedroom",
    "devices":[511,389, <device id>]
}

```

#### Alerts

A GET on `api/alerts` allows you to get a list of the alerts history from the DB.

A POST on `api/alerts` will run the rules to check conditions of devices, eg battery percentage to see if it is worth publishing an alert. 

### Test mongoDB pre-population

To test this, run these commands:
```bash
sudo docker ps
```
Take the first 2 characters from the container ID
```bash
sudo docker exec -it [CONTAINER ID] mongo
```
Then, in the mongo shell you have opened, run:
```javascript
show dbs
```
This should show the ebms db, to select the ebms db, do:
```javascript
use ebms
```
To show the collections run:
```javascript
show collections
```
Then finally, to show the localhost API key that should be pre-populated, do:
```javascript
db.apiKeys.find().pretty();
```
## Docker platform 

The conainers are spun up on the Pi to mimic how it would be when you plug in the gateway. We then can access the UI via localhost:80 on the pi or for any external devices, port 80 on the machines IP address.  
When we make a request, the request is first sent from the UI to the API running on the Pi which sends the correctly encoded data to the SDK for the update to occour.  

### Spinning up the docker containers
To start the project locally
```bash
docker-compose up
```
If all has worked, if you type

```bash
docker ps
```
you should see 3 containers running: ebms-mongo, ebms-api & ebms-UI

This container structure will automatically re-build if an error is encountered.  
  
If you see these containers, you should be able to post to the api via localhost:3000 and access the UI on localhost:80 or wherever you may be running it on the network.

## Frontend

Our frontend is written in react and is compiled each time to docker containers spin up. Data is fetched from the API and posted using the javascript fetch command. 
