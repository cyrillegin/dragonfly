DRAG=$(cd $(dirname "${BASH_SOURCE[0]}")/../../ && pwd -P)

docker run -t -i -P --rm \
  -v $DRAG:/home/dragon/dragon \
  --link dragon_pg:pg \
  dragon/app \
  npm run fullClean
