#!/bin/sh
container="node"
cont=/usr/src/app
host=/Users/iwomen

docker images | grep none | awk '{print $3}'| xargs docker rmi

echo "make dir for upload"
uploadDir=$(pwd)/view/images/looks
if [ ! -d $uploadDir ]
then
    mkdir -p $uploadDir
    chmod 0700 $uploadDir
fi

echo "build $container"
docker build --force-rm=true --rm=true -t $container .

#echo "set shared folder"
#VBoxManage sharedfolder add boot2docker-vm -name home -hostpath $(pwd | sed 's/\/iwomen//g') >/dev/null 2>&1

echo "run $container"
ps=$(docker run -p 80:18080 --name iwomen-web -d -v $host:$cont -v $host/log:/var/log/node $container)

docker ps
