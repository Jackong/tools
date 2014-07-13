#!/bin/sh
container="jackong/node"
cont=/usr/src/app
host=/Users/iwomen

echo "destroy env"
~/clean_docker.sh 'iwomen'

echo "make dir for upload"
uploadDir=$(pwd)/view/tmp
if [ ! -d $uploadDir ]
then
    mkdir $uploadDir
    chmod 0700 $uploadDir
fi

echo "build $container"
docker build -t $container .

echo "set shared folder"
VBoxManage sharedfolder add boot2docker-vm -name home -hostpath $(pwd | sed 's/\/iwomen//g') >/dev/null 2>&1

echo "build mongo container"
docker run --name iwomen-mongo -d -p 27017:27017 mongo:2.6.1

echo "run $container"
ps=$(docker run -p 80:18080 --name iwomen-web -d -v $host:$cont -v $host/log:/var/log/node $container)

docker ps
