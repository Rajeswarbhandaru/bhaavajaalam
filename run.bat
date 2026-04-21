@echo off
adb kill-server
adb start-server
adb connect 192.168.0.2:NEW_PORT
timeout /t 3 /nobreak
cd E:\bhaavajaalam-main
npx cap run android
