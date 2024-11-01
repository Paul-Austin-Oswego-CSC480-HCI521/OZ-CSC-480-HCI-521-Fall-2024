@echo off

set OZ_DATABASE_PATH=jdbc:sqlite:%CD%\tasks.db

cd backend
call mvn install -DskipTests

echo "Starting Auth Service"

REM Starting authorization service
call:mvnRun auth-service %1

echo "Starting DB Service"

REM Starting database service
call:mvnRun database-service %1

echo "Starting Frontend"

REM Installing dependencies... Starting frontend server
cd ..\frontend
call npm i
call npm run dev

cd ..
call stop_website.bat

goto:eof

REM start the server in either dev mode or normal depending on the command line argument
:mvnRun
if "%~2"=="dev" (
    start /min mvn -pl %1 liberty:dev ^&^& exit
) else (
    start /b mvn -pl %1 liberty:run < nul >nul 2>&1 ^&^& exit
)
goto:eof