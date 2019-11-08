FROM node:10
RUN npm -g install yarn pm2

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .

EXPOSE 8080
CMD [ "pm2-runtime", "index.js" ]
