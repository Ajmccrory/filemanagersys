# Installation script for CaseMap Lite
param (
    [string]$RepoUrl = "https://github.com/Ajmccrory/Case_Map_Clone"
)

Write-Host "CaseMap Lite Installer" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green

# Check if Git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Please install Git first from: https://git-scm.com/download/win" -ForegroundColor Red
    Exit 1
}

# Create installation directory
$installDir = "$env:LOCALAPPDATA\CaseMapLite"
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir | Out-Null
}

# Clone the repository
Write-Host "Downloading CaseMap Lite..." -ForegroundColor Yellow
git clone $RepoUrl $installDir

# Check OS and run appropriate installer
$os = [System.Environment]::OSVersion.Platform
if ($os -eq "Win32NT") {
    Write-Host "Installing for Windows..." -ForegroundColor Yellow
    Start-Process "$installDir\installers\windows\CaseMapLite_Setup.exe"
} else {
    Write-Host "This doesn't appear to be a Windows system. Please run the macOS installer instead." -ForegroundColor Red
} 