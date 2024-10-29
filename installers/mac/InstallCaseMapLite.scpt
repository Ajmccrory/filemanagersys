tell application "Finder"
    -- Show friendly welcome message
    display dialog "Welcome to CaseMap Lite Installation!" buttons {"Start Installation"} default button "Start Installation" with icon note with title "CaseMap Lite Setup"
    
    -- Show progress
    set progress description to "Installing CaseMap Lite..."
    set progress total steps to 3
    
    -- Step 1: Copy application
    set progress completed steps to 1
    set progress description to "Installing CaseMap Lite..."
    
    -- Create Applications folder if it doesn't exist
    if not (exists folder "Applications" of home) then
        make new folder at home with properties {name:"Applications"}
    end if
    
    -- Copy app bundle
    do shell script "cp -R '" & (POSIX path of (path to me as text)) & "/../CaseMap Lite.app' /Applications/"
    
    -- Step 2: Create desktop shortcut
    set progress completed steps to 2
    set progress description to "Creating desktop shortcut..."
    
    tell application "Finder"
        make new alias file at desktop to file "CaseMap Lite.app" of folder "Applications"
    end tell
    
    -- Step 3: Final setup
    set progress completed steps to 3
    set progress description to "Completing installation..."
    
    -- Show success message
    display dialog "CaseMap Lite has been installed successfully!
    
    1. You'll find CaseMap Lite on your Desktop
    2. Double-click the CaseMap Lite icon to start
    
    Need help? Email: support@casemaplite.com" buttons {"Start CaseMap Lite", "Close"} default button "Start CaseMap Lite" with icon note with title "Installation Complete"
    
    if button returned of result is "Start CaseMap Lite" then
        tell application "CaseMap Lite" to activate
    end if
end tell 