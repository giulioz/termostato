FROM node:10

RUN npm -g install yarn

WORKDIR /usr/src/app
COPY . .
RUN yarn install

RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]
