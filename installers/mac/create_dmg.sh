#!/bin/bash

# Required variables
APP_NAME="CaseMap Lite"
VOL_NAME="CaseMap Lite Installer"
DMG_TEMP="temp.dmg"
DMG_FINAL="CaseMapLite_Installer.dmg"
STAGING_DIR="./staging"

# Clear any previous files
rm -rf "${STAGING_DIR}" "${DMG_TEMP}" "${DMG_FINAL}"

# Create staging directory
mkdir -p "${STAGING_DIR}"

# Copy application bundle
cp -R "dist/${APP_NAME}.app" "${STAGING_DIR}"

# Create link to Applications folder
ln -s /Applications "${STAGING_DIR}"

# Create temp DMG
hdiutil create -srcfolder "${STAGING_DIR}" -volname "${VOL_NAME}" -fs HFS+ \
      -fsargs "-c c=64,a=16,e=16" -format UDRW "${DMG_TEMP}"

# Mount temp DMG
DEVICE=$(hdiutil attach -readwrite -noverify "${DMG_TEMP}" | \
         egrep '^/dev/' | sed 1q | awk '{print $1}')

# Style the DMG
echo '
   tell application "Finder"
     tell disk "'${VOL_NAME}'"
           open
           set current view of container window to icon view
           set toolbar visible of container window to false
           set statusbar visible of container window to false
           set the bounds of container window to {400, 100, 885, 430}
           set theViewOptions to the icon view options of container window
           set arrangement of theViewOptions to not arranged
           set icon size of theViewOptions to 72
           set position of item "'${APP_NAME}.app'" of container window to {100, 180}
           set position of item "Applications" of container window to {375, 180}
           close
           open
           update without registering applications
           delay 5
           close
     end tell
   end tell
' | osascript

# Finalize DMG
chmod -Rf go-w "/Volumes/${VOL_NAME}"
sync
hdiutil detach "${DEVICE}"
hdiutil convert "${DMG_TEMP}" -format UDZO -imagekey zlib-level=9 -o "${DMG_FINAL}"
rm -f "${DMG_TEMP}"
rm -rf "${STAGING_DIR}" 