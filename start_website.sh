#!/bin/bash

cd backend || exit
mvn install

# Starting authorization service
echo "Starting authorization service..."
mvn -pl auth-service liberty:run &

# Starting database service
echo "Starting database service..."
mvn -pl auth-service liberty:run &

# Installing dependencies and starting frontend server
echo "Installing dependencies... Starting frontend server..."
cd ../frontend || exit
npm install
npm run dev
