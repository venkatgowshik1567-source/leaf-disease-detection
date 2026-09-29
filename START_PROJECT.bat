@echo off
title AI Based Leaf Disease Detection System - Auto Launcher
color 0A

echo =======================================================================
echo          AI BASED LEAF DISEASE DETECTION SYSTEM - AUTO LAUNCHER
echo =======================================================================
echo.
echo Launching all 3 services automatically...
echo [1/3] Starting Python AI ML Microservice (Port 8000)...
echo [2/3] Starting Node.js API Gateway (Port 5000)...
echo [3/3] Starting React.js Frontend UI (Port 3000)...
echo.

:: Launch Python Service in new terminal
start "1. Python AI Service (Port 8000)" cmd /k "cd /d %~dp0backend-python && venv\Scripts\activate && python app.py"

:: Launch Node.js API Gateway in new terminal
start "2. Node.js API Gateway (Port 5000)" cmd /k "cd /d %~dp0backend-node && npm run dev"

:: Launch React Frontend UI in new terminal
start "3. React.js Frontend UI (Port 3000)" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo =======================================================================
echo  SUCCESS! All 3 terminals launched.
echo  Browser will automatically open at: http://localhost:3000
echo =======================================================================
echo.
pause
