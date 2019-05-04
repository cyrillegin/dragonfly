echo "Starting Dragonfly"
export MONGO_URL=mongodb://$DRAGONFLY_MONGO_PORT_27017_TCP_ADDR:$DRAGONFLY_MONGO_PORT_27017_TCP_PORT/dragonfly
cd /home/dragon/dragonfly
$@
