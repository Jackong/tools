#DOCKER-VERSION 0.3.4
FROM node:0.10.28

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install

RUN mkdir -p /var/log/node
RUN chmod -R 0777 /var/log/node/

# replace this with your application's default port
EXPOSE 18080

ENV MODE dev

# for prod
#CMD [ "node", "server.js" ]

# for dev
COPY ./node_modules/supervisor /usr/src/supervisor
CMD [ "/usr/src/supervisor/lib/cli-wrapper.js", "server.js"]
