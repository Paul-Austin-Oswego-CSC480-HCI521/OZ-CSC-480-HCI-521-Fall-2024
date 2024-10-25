#!/bin/bash

mvnRun() {
if [$2==dev]
then
    mvn -pl $1 liberty:dev &
else
    mvn -pl $1 liberty:run &
}

cd backend || exit
mvn install

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
