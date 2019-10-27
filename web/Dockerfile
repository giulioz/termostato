FROM node:10

RUN npm -g install yarn

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .

RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]
