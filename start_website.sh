#!/bin/bash

export OZ_DATABASE_PATH=jdbc:sqlite:$(pwd)/tasks.db

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
