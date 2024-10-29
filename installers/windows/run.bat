@echo off
setlocal enabledelayedexpansion

echo Checking for Python installation...

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Installing Python.

    :: Download Python installer
    curl -o python_installer.exe https://www.python.org/3.11.0/python-3.11.0-amd64.exe

    :: Run installer with required parameters
    start /wait python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_pip=1

    :: Clean up installer
    del python_installer.exe

    :: Refresh env vars
    call refreshenv.cmd
    if %ERRORLEVEL% NEQ 0 (
        echo Refeshing PATH ...
        seth PATH=%PATH%;C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\Scripts\;C:\Users\%USERNAME%AppData\Local\Programs\Python\Python311\
    )
)

:: Check if intall worked
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install Python. Please retry by downloading and installing Python manually from https://www.python.org/downloads/
    echo press any key to exit...
    pause
    exit /b 1
)

echo Python is installed!

:: Create and activate virtual enviornment
if not exist "venv" (
    echo Creating virtual enviornent...
    python -m venv case-map-venv
)

:: Active Virtual enviornment
call case-map-venv\Scripts\activate.virtual

:: Install reqs
echo Installing Required Packages...
python -m pip install --upgrade pip
pip install - r requirements.txt

:: Start Flask app
echo Starting CaseMap Lite...
set FLASK_APP=app
python -m flask run
pause
