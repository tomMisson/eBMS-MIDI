FROM node:10.19.0-alpine3.9

WORKDIR /usr/src/app

COPY . .

RUN npm i

COPY . .

EXPOSE 5000

CMD node server.js
