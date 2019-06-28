FROM node:alpine as armaforces_bot

RUN npm install --global pm2

WORKDIR /usr/armaforces_bot

COPY package.json /usr/armaforces_bot
COPY package-lock.json /usr/armaforces_bot

RUN npm install

COPY src /usr/armaforces_bot/src

CMD ["pm2-runtime", "start", "./src/index.js"]
