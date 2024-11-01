#!/bin/bash

# Stopping the authorization service
echo "Stopping authorization service..."
cd backend/auth-service || exit
mvn liberty:stop

# Stopping the database service
echo "Stopping database service..."
cd ../database-service || exit
mvn liberty:stop
