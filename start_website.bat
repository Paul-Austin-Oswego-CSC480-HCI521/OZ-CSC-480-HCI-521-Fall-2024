@echo off

REM Starting authorization service
cd backend\auth-service
call mvn compile
call mvn liberty:create
call mvn liberty:install-feature
call mvn liberty:deploy
call mvn liberty:start

REM Starting database service
cd ..\database-service
call mvn compile
call mvn liberty:create
call mvn liberty:install-feature
call mvn liberty:deploy
call mvn liberty:start

REM Installing dependencies... Starting frontend server
cd ..\..\frontend
call npm i
call npm run dev
