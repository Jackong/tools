#!/bin/sh
container="jackong/node"

#docker ps | grep $container | awk '{print $1}' | xargs docker stop
#docker ps -a | grep "Exited" | awk '{print $1}' | xargs docker rm
#docker images -a | grep "<none>" | awk '{print $3}' | xargs docker rmi
docker build -t $container .
docker run -p 80:18080 --name iwomen-web -d -v /usr/src/app:/usr/src/app $container
#sshfs -p 2022 docker@localhost:/usr/src/app $(pwd)
#docker run $container -w /usr/src/app npm install & npm install supervisor & supervisor server.js
#docker ps | awk '{print $1}' | xargs docker logs
