#!/bin/sh
container="jackong/node"
cont=/usr/src/app
host=/Users/daisy/Project/node/iwomen

echo "destroy env"
docker ps -a | grep 'iwomen' | awk '{print $1}' | xargs docker stop >/dev/null 2>&1
docker ps -a | grep "Exited" | awk '{print $1}' | xargs docker rm >/dev/null 2>&1
docker images -a | grep "<none>" | awk '{print $3}' | xargs docker rmi >/dev/null 2>&1

echo "build $container"
docker build -t $container .

echo "build mongo container"
docker run --name iwomen-mongo -d -p 27017:27017 mongo:2.6.1

echo "run $container"
ps=$(docker run -p 80:18080 --name iwomen-web -d -v $host:$cont -v $host/log:/var/log/node $container)

docker ps
