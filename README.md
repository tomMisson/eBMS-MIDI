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
