DRAG=$(cd $(dirname "${BASH_SOURCE[0]}")/../../ && pwd -P)

docker run -t -i -P --rm\
    -v $DRAG:/home/dragon/dragon \
    --link dragon_pg:pg \
    -p 5000:5000 \
    dragon/app \
    bash -l
