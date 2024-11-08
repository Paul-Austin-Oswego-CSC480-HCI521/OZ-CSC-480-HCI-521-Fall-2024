FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 2080

CMD [ "npx", "vite", "--host" ]