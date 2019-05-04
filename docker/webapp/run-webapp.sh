#!/bin/bash
DRAGONFLY=$(cd $(dirname "${BASH_SOURCE[0]}")/../../ && pwd -P)
docker run -t -i -P --rm \
    -v $DRAGONFLY:/home/dragon/dragonfly/ \
    --link dragonfly_mongo \
    -p 8080:8080 \
    -p 3000:3000 \
    dragonfly/webapp \
    npm run start
