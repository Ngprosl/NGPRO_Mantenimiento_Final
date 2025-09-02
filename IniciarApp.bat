@echo off
REM Guardar la ruta base del .bat
set BASE_DIR=%~dp0

REM Ir a la carpeta publish
cd /d "backend\bin\Release\net8.0\win-x64\publish"
REM Ejecuta el backend en ventana oculta
start "" powershell -WindowStyle Hidden -Command "Start-Process 'NgproMantenimientos.Api.exe' -WindowStyle Hidden"
timeout /t 5 >nul

REM Ejecuta el frontend (Vite) en una ventana minimizada
start "Frontend" /min cmd /k "cd /d "%BASE_DIR%frontend\ngpro-mantenimientos-frontend" && npm run dev"
timeout /t 5 >nul

REM Abre el frontend en el navegador
start "" "http://localhost:5173"