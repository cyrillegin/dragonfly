source ./.secrets

curl -X POST -H 'Content-type: application/json' --data '{"text":"Backup and update starting."}' $SLACK_URL

# Declare backup vars
currentDate=$(date +'%m-%d-%Y')
backupFile=backup-"$currentDate".sql
backupPath=$(mktemp /tmp/$backupFile)

# Generate the backup file
exec 3>"$backupPath"
docker exec -it dragonfly_postgres_1 pg_dump db -U user > "${backupPath}"

# Send to S3
aws s3api put-object --bucket cyrille-dragonfly --key backups/$backupFile --body $backupPath
# Remove temp file
rm $backupPath

curl -X POST -H 'Content-type: application/json' --data '{"text":"Backup complete."}' $SLACK_URL

# check if master has changes
if [[ -z $(git status -s) ]]
then
  echo "No new updates in master"
  curl -X POST -H 'Content-type: application/json' --data '{"text":"No new updates found."}' $SLACK_URL
  exit
fi

echo "Theres some updates to be had!"
# pull changes
git pull

# update npm
npm i

# rebuild front end in prod
npm run build:client:prod

# rebuild back end in prod
npm run build:server:prod

# restart server
screen -X -S "server" quit
screen -d -S server -m npm run start:server:prod

# run db migration
npm run db:up
# Check if the db migrarion ran
if [ $? -eq 0 ]; then
    echo Database migrated
    curl -X POST -H 'Content-type: application/json' --data '{"text":"Database migrated successfully."}' $SLACK_URL
fi

curl -X POST -H 'Content-type: application/json' --data '{"text":"Update complete"}' $SLACK_URL
