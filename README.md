# eBMS-MIDI
HTML5 User interface for MIDI Gateway

## Contents
- API for interacting with local gateway  
- MongoDB database for storing access tokens to the api and local device data
- React Fronted  
- A fully dockerised platform designed for deployment on to the gateway  

## Spinning up the docker containers
To start the project locally
```bash
docker-compose up
```

### Validate sucessful start-up

If all has worked, if you type

```bash
docker ps
```

you should see 3 containers running: ebms-mongo, ebms-api & ebms-UI

## API
### API default credentials 

This API gives direct access to the SDK which requires authentication for each request. To simplify this, you authenticate once at the start to log your IP address then you can make as many requests as you wish.

```json
{
    "username": "admin",
    "password": "888888"
}
```

### Test mongoDB has been pre-populated

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
## Workflow 

The conainers are spun up on the Pi on boot to mimic how it would be when you plug in the gateway. We then can access the UI via localhost:80 on the pi or for any external devices, port 80 on the machines IP address.  
When we make a request, the request is first sent from the UI to the API running on the Pi which sends the correctly encoded data to the SDK for the update to occour.  

