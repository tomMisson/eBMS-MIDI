FROM arm32v6/node:10.19.0-alpine3.11

WORKDIR /usr/src/app

COPY . .

RUN npm i --no-optional
 
RUN npm audit fix --no-optional

COPY . .

EXPOSE 5000

CMD node server.js
