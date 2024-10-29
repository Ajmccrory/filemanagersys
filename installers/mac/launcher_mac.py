import os
import sys
import webbrowser
import subprocess
from time import sleep

def main():
    # Get the application bundle path
    if getattr(sys, 'frozen', False):
        bundle_dir = os.path.join(os.path.dirname(sys.executable), 'Contents/Resources')
    else:
        bundle_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Start the bundled Flask application
    app_path = os.path.join(bundle_dir, 'app.py')
    process = subprocess.Popen([
        sys.executable,
        app_path
    ])
    
    # Wait for server to start
    sleep(2)
    
    # Open browser
    webbrowser.open('http://127.0.0.1:5000')
    
    try:
        process.wait()
    except KeyboardInterrupt:
        process.terminate()

if __name__ == '__main__':
    main() 