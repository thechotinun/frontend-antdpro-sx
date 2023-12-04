FROM node:18.19.0-alpine3.17

WORKDIR /app/frontend-antdpro-sx

COPY ./frontend-antdpro-sx/package*.json ./

RUN npm install

COPY ./frontend-antdpro-sx .

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
