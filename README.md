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

## Validate sucessful start-up

If all has worked, if you type

```bash
docker ps
```

you should see 3 containers running: ebms-midi_database, ebms-midi_api & ebms-midi_frontend

## API default credentials 

This API gives direct access to the SDK which requires authentication for each request. To simplify this, you authenticate once at the start to log your IP address then you can make as many requests as you wish.

```json
{
    "username": "admin",
    "password": "888888"
}
```

