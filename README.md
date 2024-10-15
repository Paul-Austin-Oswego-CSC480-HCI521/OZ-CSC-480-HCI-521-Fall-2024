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
1. Copy the client secret and store it somewhere (optionally store the client id somewhere as well for ease of use)

### Set GitHub environment variables
*Note: this must be done every time you start a new terminal, I'll sort an authomated way with like .env.local asap* 
#### Linux/MacOS
```bash
export GITHUB_CLIENT_ID=<your OAuth app client id>
export GITHUB_CLIENT_SECRET=<your OAuth app client secret>
```

#### Windows CMD
```cmd
set GITHUB_CLIENT_ID=<your OAuth app client id>
set GITHUB_CLIENT_SECRET=<your OAuth app client secret>
```
#### Powershell
```powershell
$env:GITHUB_CLIENT_ID='<your OAuth app client id>'
$env:GITHUB_CLIENT_SECRET='<your OAuth app client secret>'
```

### Run the application
Prerequisites: make sure you have mvn and npm (or yarn/bun) installed

In the root directory run:

#### Windows:
```batch
.\start_website.bat
```

#### Linux:
```shell
.\start_website.sh
```

the webpage will be served at http://localhost

### Stopping the application

In the root directory run:

#### Windows:
```batch
.\start_website.bat
```

#### Linux:
```shell
.\start_website.sh
```