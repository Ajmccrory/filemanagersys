import os
import sys
import subprocess
import webbrowser
from time import sleep
import signal

def signal_handler(sig, frame):
    print('Shutting down...')
    sys.exit(0)

def main():
    # Register signal handler for clean shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    # Get the application bundle path
    if getattr(sys, 'frozen', False):
        # Running in a bundle
        bundle_dir = os.path.dirname(os.path.dirname(os.path.dirname(sys.executable)))
    else:
        # Running in development
        bundle_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Set up environment
    os.environ['FLASK_APP'] = os.path.join(bundle_dir, 'app')
    
    # Start Flask server
    process = subprocess.Popen([
        sys.executable,
        '-m', 'flask',
        'run'
    ], cwd=os.path.join(bundle_dir, 'app'))
    
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