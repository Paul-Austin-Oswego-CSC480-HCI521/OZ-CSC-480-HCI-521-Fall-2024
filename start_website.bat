@echo off

REM Starting authorization service
cd backend\auth-service
call mvn liberty:start

REM Starting database service
cd ..\database-service
call mvn liberty:start

REM Installing dependencies... Starting frontend server
cd ..\..\frontend
call npm i
call npm run dev
