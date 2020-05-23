FROM node:12-alpine

WORKDIR /app

COPY ./package*.json ./
RUN npm i
COPY . .

# RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD npm run start:server:prod
