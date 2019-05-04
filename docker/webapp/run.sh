#!/bin/bash
DRAGONFLY=$(cd $(dirname "${BASH_SOURCE[0]}")/../../ && pwd -P)
docker run -t -i -P --rm \
    -v $DRAGONFLY:/home/dragon/dragonfly/ \
    --link dragonfly_mongo \
    dragonfly/webapp \
    bash -l
