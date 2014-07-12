#!/bin/sh
container="jackong/node"
cont=/usr/src/app
vm=/home/docker/app
host=/Users/daisy/Project/node/iwomen

echo "destroy env"
umount -f $host
docker ps | grep $container | awk '{print $1}' | xargs docker stop >/dev/null 2>&1
docker ps -a | grep "Exited" | awk '{print $1}' | xargs docker rm >/dev/null 2>&1
docker images -a | grep "<none>" | awk '{print $3}' | xargs docker rmi >/dev/null 2>&1

echo "build $container"
docker build -t $container .

echo "init container-vm-host mount dir"
boot2docker ssh "[ ! -d $vm ] && mkdir $vm && touch $vm/server.js"

echo "run $container"
ps=$(docker run -p 80:18080 --name iwomen-web -d -v $vm:$cont -v $vm/log:/var/log/node $container)

echo "cp app from container to vm"
boot2docker ssh "docker cp $ps:$cont /home/docker/"

echo "mount contanier-vm-host"
echo "tcuser" | sshfs -p 2022 docker@localhost:$vm $host -o password_stdin

docker logs $ps | tail
docker ps
