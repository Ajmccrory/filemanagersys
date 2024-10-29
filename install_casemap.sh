#!/bin/bash

# Installation script for CaseMap Lite
REPO_URL="https://github.com/Ajmccrory/Case_Map_Clone"
INSTALL_DIR="$HOME/Applications/CaseMapLite"

echo "CaseMap Lite Installer"
echo "====================="

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    echo "You can install it using Homebrew: brew install git"
    exit 1
fi

# Create installation directory
mkdir -p "$INSTALL_DIR"

# Clone the repository
echo "Downloading CaseMap Lite..."
git clone "$REPO_URL" "$INSTALL_DIR"

# Check OS and run appropriate installer
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Installing for macOS..."
    chmod +x "$INSTALL_DIR/installers/mac/create_dmg.sh"
    "$INSTALL_DIR/installers/mac/create_dmg.sh"
else
    echo "This doesn't appear to be a macOS system. Please run the Windows installer instead."
    exit 1
fi 