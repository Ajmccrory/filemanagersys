tell application "Finder"
    -- Show friendly welcome message
    display dialog "Welcome to CaseMap Lite Installation!" buttons {"Start Installation"} default button "Start Installation" with icon note with title "CaseMap Lite Setup"
    
    -- Show progress
    set progress description to "Installing CaseMap Lite..."
    set progress total steps to 4
    
    -- Step 1: Install Python if needed
    set progress completed steps to 1
    set progress description to "Checking for Python..."
    
    try
        do shell script "python3 --version"
    on error
        display dialog "We need to install Python first. Click OK to continue." buttons {"OK"} default button "OK"
        do shell script "curl -o python_installer.pkg 'https://www.python.org/ftp/python/3.11.0/python-3.11.0-macos11.pkg'"
        do shell script "sudo installer -pkg python_installer.pkg -target /"
    end try
    
    -- Step 2: Copy application
    set progress completed steps to 2
    set progress description to "Installing CaseMap Lite..."
    
    -- Create Applications folder if it doesn't exist
    if not (exists folder "Applications" of home) then
        make new folder at home with properties {name:"Applications"}
    end if
    
    -- Copy app bundle
    do shell script "cp -R 'CaseMap Lite.app' /Applications/"
    
    -- Step 3: Create desktop shortcut
    set progress completed steps to 3
    set progress description to "Creating desktop shortcut..."
    
    tell application "Finder"
        make new alias file at desktop to file "CaseMap Lite.app" of folder "Applications"
    end tell
    
    -- Step 4: Final setup
    set progress completed steps to 4
    set progress description to "Completing installation..."
    
    -- Show success message
    display dialog "CaseMap Lite has been installed successfully!
    
    1. You'll find CaseMap Lite on your Desktop
    2. Double-click the CaseMap Lite icon to start
    
    Need help? Call us: 1-800-XXX-XXXX" buttons {"Start CaseMap Lite", "Close"} default button "Start CaseMap Lite" with icon note with title "Installation Complete"
    
    if button returned of result is "Start CaseMap Lite" then
        tell application "CaseMap Lite" to activate
    end if
end tell 