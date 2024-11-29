FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 2080

CMD [ "bun", "run", "devhost" ]