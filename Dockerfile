#DOCKER-VERSION 0.3.4
FROM node:0.10.28

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install
RUN bower install

RUN mkdir -p /var/log/node
RUN chmod -R 0777 /var/log/node/

EXPOSE 18080

ENV MODE dev

CMD [ "npm", "start"]
