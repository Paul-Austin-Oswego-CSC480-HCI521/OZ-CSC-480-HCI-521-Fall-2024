#!/bin/bash

# Starting authorization service
echo "Starting authorization service..."
cd backend/auth-service || exit
mvn liberty:run &

# Starting database service
echo "Starting database service..."
cd ../database-service || exit
mvn liberty:run &

# Installing dependencies and starting frontend server
echo "Installing dependencies... Starting frontend server..."
cd ../../frontend || exit
npm install
npm run dev
