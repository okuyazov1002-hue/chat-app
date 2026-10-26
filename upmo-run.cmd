@echo off
cd /d "D:\01 Project\chat-app-git"
:loop
node server.js
timeout /t 3 /nobreak >nul
goto loop
