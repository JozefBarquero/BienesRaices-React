@echo off
chcp 65001 > nul
echo Backend - Frontend
echo.

set "DIR=%~dp0"

start "BACKEND" /D "%DIR%Backend" cmd /k "npm start"
start "FRONTEND" /D "%DIR%BienesRaices-React" cmd /k "npm run dev"

echo Servicios iniciados en ventanas independientes.
echo Para detener los servicios, cierra las ventanas emergentes.