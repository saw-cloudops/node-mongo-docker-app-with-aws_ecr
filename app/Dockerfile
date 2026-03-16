FROM node:20-alpine

WORKDIR /home/node-app

COPY package*.json ./
RUN mkdir -p /home/node-app

COPY . .

EXPOSE 3000

RUN npm install

CMD ["node", "server.js"]