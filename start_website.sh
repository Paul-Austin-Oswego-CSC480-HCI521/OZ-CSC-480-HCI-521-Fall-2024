#!/bin/bash

export OZ_DATABASE_PATH=jdbc:sqlite:$(pwd)/tasks.db

# will be replaced with compitent config once the frontend is hosted properly
export VITE_FRONTEND_PORT=2080
export VITE_AUTH_ROOT=https://localhost:9443
export VITE_API_ROOT=https://localhost:8443

mvnRun() {
if [ $# -ge 2 -a $2==dev ]; then
    mvn -pl $1 liberty:dev < /dev/null &
else
    mvn -pl $1 liberty:run < /dev/null > /dev/null 2>&1 &
fi
}

cd backend || exit
mvn install -DskipTests

# Starting authorization service
echo "Starting authorization service..."
mvnRun auth-service $1

# Starting database service
echo "Starting database service..."
mvnRun database-service $1

# Installing dependencies and starting frontend server
echo "Installing dependencies... Starting frontend server..."
cd ../frontend || exit
npm install
npm run dev

cd..
./stop_website.sh
