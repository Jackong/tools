#/bin/sh
ip="192.168.59.103"
echo "build config mongo"
docker run --name shard1-mongo -d -p 27018:27017 mongo:2.6.1 mongod --smallfiles
docker run --name shard2-mongo -d -p 27028:27017 mongo:2.6.1 mongod --smallfiles
#docker run --name shard3-mongo -d -p 27038:27017 mongo:2.6.1 mongod --smallfiles


docker run --name config1-mongo -d -p 27019:27017 mongo:2.6.1 mongod --smallfiles
#docker run --name config2-mongo -d -p 27029:27017 mongo:2.6.1 mongod --configsvr --smallfiles
#docker run --name config3-mongo -d -p 27039:27017 mongo:2.6.1 mongod --configsvr --smallfiles

#docker run --name mongos-mongo -d -p 27017:27017 mongo:2.6.1 mongos --configdb $ip:27019,$ip:27029,$ip:27039
docker run --name mongos-mongo -d -p 27017:27017 mongo:2.6.1 mongos --configdb $ip:27019

echo "db.runCommand({addshard : \"$ip:27018\", allowLocal : true})"
echo "db.runCommand({addshard : \"$ip:27028\", allowLocal : true})"
#echo "db.runCommand({addshard : \"$ip:27038\", allowLocal : true})"

echo 'db.runCommand({listshards:1})'
echo 'db.runCommand({"enablesharding" : "your-db"})'
echo 'db.runCommand({"shardcollection" : "your-db.your-collection", "key" : {"your-shard-key-1" : 1,"your-shard-key-n":1}})'
echo 'db.printShardingStatus()'
echo 'use config'
echo 'db.shards.find()'
echo 'db.chunks.find()'

docker run -it --link mongos-mongo:mongo --rm mongo sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/admin"'
