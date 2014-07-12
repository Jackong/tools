#!/bin/sh
container="jackong/node"
cont=/usr/src/app
vm=/home/docker/
host=/Users/daisy/Project/node/test

echo "destroy env"
umount $host
docker ps | grep $container | awk '{print $1}' | xargs docker stop >/dev/null 2>&1
docker ps -a | grep "Exited" | awk '{print $1}' | xargs docker rm >/dev/null 2>&1
docker images -a | grep "<none>" | awk '{print $3}' | xargs docker rmi >/dev/null 2>&1

echo "build $container"
docker build -t $container .

echo "init container-vm-host mount dir"
boot2docker ssh "[ ! -d $vm/app ] && mkdir $vm/app && touch $vm/app/server.js"

echo "run $container"
ps=$(docker run -p 80:18080 --name iwomen-web -d -v $vm/app:$cont $container)

echo "cp app from container to vm"
boot2docker ssh "docker cp $ps:$cont $vm"

echo "mount contanier-vm-host"
sshfs -p 2022 docker@localhost:$vm/app $host

docker logs $ps
docker ps
