#!/bin/sh
docker run -it  --name tools-node --link tools-mongodb:tools-mongodb -v "$(pwd)":/usr/src/app -v /var/log:/var/log -w /usr/src/app --expose 80 -d node:0.10.31 npm start
