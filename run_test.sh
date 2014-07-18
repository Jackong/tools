#!/bin/sh
if [ $# -lt 1 ]
then
	echo "usage: $0 which"
	exit 1
fi
which=$1
docker run -it --link iwomen-node:node --rm node sh -c "exec mocha /usr/src/app/$which"
