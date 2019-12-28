FROM node:10
EXPOSE 5000
EXPOSE 27017
ENV PORT=5000 
ENV USRNAME="admin"
ENV PSWD = "888888"
RUN node build.js
RUN nodemon server.js

