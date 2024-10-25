# OZ-CSC-480-HCI-521-Fall-2024
Repo for CSC 480 HCI 521 class of fall 2024

### Tech Stack:
Frontend: React with Vite and JS, Tailwind css, and Shadcn for the UI library

Backend: OpenLiberty, MicroProfile, and SQLite

## Running the demo

### Set up a GitHub OAuth application for social login

1. Sign into github
1. Navigate to Settings->Developer Settings->OAuth Apps
1. Click **New OAuth App**
1. Fill in
    - **Application Name** (anything is fine)
    - set **Homepage URL** to `https://localhost:9443` (9443 or the auth-service https port found in [<liberty.var.https.port>](/backend/auth-service/pom.xml) if you changed it)
    - set **Authorization callback URL** to `https://localhost:9443/ibm/api/social-login/redirect/githubLogin` (again the auth-service https port)
1. Click **Register application**
1. Click **Generate a new client secret**
1. Copy the client secret and store it somewhere

### Set GitHub environment variables
Create a new file at `/backend/auth-service/src/main/liberty/config/server.env`
and put
```
GITHUB_CLIENT_ID=<your OAuth app's client id>
GITHUB_CLIENT_SECRET=<your OAuth app's client secret>
```

### Run the application
Prerequisites: make sure you have mvn and npm (or yarn/bun) installed

In the root directory run:

#### Windows:
```batch
.\start_website.bat
```

#### Linux/Mac:
```shell
.\start_website.sh
```

the webpage will be served at http://localhost

**WARNING: the website does not work on safari**
*we will attepmt to fix it at a later date*

### Stopping the application

first, ctrl+C vite

In the root directory run:

#### Windows:
```batch
.\stop_website.bat
```

#### Linux/Mac:
```shell
.\stop_website.sh
```
### Configuration

Unfortunately, OpenLiberty is allergic to .env files, so two configuration files, [/backend/pom.xml](/backend/pom.xml) and [/frontend/.env](/frontend/.env), must be used and kept in sync.

*I'm really trying to find a better solution*

the configuration options are
1. auth-service port: [<oz.auth.port>](/backend/pom.xml) and [VITE_AUTH_ROOT](/frontend/.env)
1. database-service port: [<oz.api.port>](/backend/pom.xml) and [VITE_API_ROOT](/frontend/.env)
1. frontend port: [<oz.frontend.root>](/backend/pom.xml) and [VITE_FRONTEND_PORT](/frontend/.env)
