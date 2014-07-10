#DOCKER-VERSION 0.3.4
FROM node:0.10.28

ADD . /usr/src/app
WORKDIR /usr/src/app

# install your application's dependencies
RUN npm install
RUN npm install -g supervisor

RUN mkdir -p /usr/log

RUN chmod -R 0777 /usr/log/

# replace this with your application's default port
EXPOSE 18080

ENV MODE dev

# replace this with your main "server" script file
CMD [ "supervisor", "server.js" ]
