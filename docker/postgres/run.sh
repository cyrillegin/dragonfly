#!/bin/bash
docker run -t -i -P -d \
    --name dragon_pg \
    -e POSTGRES_DB=drag \
    -e POSTGRES_USER=drag \
    -e POSTGRES_PASSWORD=password \
    -p 5432:5432 \
    postgres:10.3
