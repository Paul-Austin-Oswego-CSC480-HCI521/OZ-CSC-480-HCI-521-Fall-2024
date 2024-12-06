# Docker instructions

## Building the services

```bash
docker build -t checkmate-frontend ./frontend/
docker build -t checkmate-auth-service --build-arg SERVICE=auth-service ./backend/
docker build -t checkmate-database-service --build-arg SERVICE=database-service ./backend/
```

Optionally, add a `:version.number` to the end of the image names if you want to differentiate multiple versions (say stable and testing)

## Configuration

In the same directory as `compose.yaml`, create a file called auth.env containing
```
GITHUB_CLIENT_ID=<the project's OAuth app client id>
GITHUB_CLIENT_SECRET=<the project's OAuth app client secret>
```

The corrosponding GitHub OAuth app should have its **Homepage URL** set to the `${DOMAIN}:${AUTH_PORT}` set in [.env.production](.env.production). Similar for the **Authorization callback URL**

*in our case, we should just have an auth.env file on moxie ready to go*

In [.env.production](.env.production), ensure `DOMAIN` is set to the server you are running on, and `VERSION` matches the `version.number` (or `latest`, if you left it unspecified)

## Running the application

```bash
docker compose --env-file .env.production up -d
```

## Stopping the appplication

```bash
docker compose down
```