@echo off

REM Stopping the authorization service
cd backend\auth-service
call mvn liberty:stop

REM Stopping the database service
cd ..\database-service
call mvn liberty:stop
