FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --no-optional

COPY . .

EXPOSE 3000

CMD npm build