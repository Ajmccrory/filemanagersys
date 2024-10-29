@echo off
echo Welcome to CaseMap Lite Installation

:: Check if running with admin privs
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo Please run this isntaller as an Administrator!
    echo Right-click this file and select "Run as administrator"
    echo Press any key to exit and try again...
    pause
    exit /b 1
)

:: Download and install Chocolatey (a package manager for Windows)
echo Installing package manager...
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

:: Install Python using Chocolatey
echo Installing Python...
choco install python -y

:: Refresh environment variables
echo Refreshing environment...
call refreshenv.cmd

echo Installation complete! You can now run CaseMap Lite by double-clicking run.bat
pause