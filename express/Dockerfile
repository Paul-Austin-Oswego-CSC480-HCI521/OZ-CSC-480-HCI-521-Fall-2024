FROM oven/bun:latest AS build

ARG SERVICE_ROOT

WORKDIR /build

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN bun install

COPY frontend/ .

RUN VITE_AUTH_ROOT=${SERVICE_ROOT} bun run build

FROM node:22-alpine

COPY --from=build /build/dist /www/data

WORKDIR /app

COPY express/index.js .
COPY frontend/proxy.js .
COPY express/package.json .
COPY express/package-lock.json .

RUN npm i

CMD ["node", "index.js"]