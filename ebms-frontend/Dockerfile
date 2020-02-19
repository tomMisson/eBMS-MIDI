FROM node:10.19.0-alpine3.9 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --no-optional

COPY . .

RUN npm run build

FROM nginx:1.16.0-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]