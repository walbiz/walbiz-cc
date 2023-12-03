FROM node:20.10-alpine

WORKDIR /app

COPY package*json /app

RUN npm install --omit=dev

COPY . /app

EXPOSE 8080

CMD [ "npm", "run", "start" ]