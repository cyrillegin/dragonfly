echo "Removing docker images."
docker stop dragon_pg
docker rm dragon_pg

echo "Running clean"
npm run clean

echo "Rebuilding docker images."
cd docker/postgres/
./run.sh
cd ../app/
./build.sh

./_rebuild.sh
