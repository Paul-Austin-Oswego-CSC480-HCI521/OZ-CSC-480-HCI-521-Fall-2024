@echo off

cd backend
call mvn install -DskipTests

REM Starting authorization service
call:mvnRun auth-service %1

REM Starting database service
call:mvnRun database-service %1

REM Installing dependencies... Starting frontend server
cd ..\frontend
call npm i
call npm run dev

goto:eof

REM start the server in either dev mode or normal depending on the command line argument
:mvnRun
if "%~2"=="dev" (
    start mvn -pl %1 liberty:dev
) else (
    call mvn -pl %1 liberty:create
    call mvn -pl %1 liberty:install-feature
    call mvn -pl %1 liberty:deploy
    call mvn -pl %1 liberty:start
)
goto:eof