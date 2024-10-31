import os
import secrets

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
    
    # Generate a static secret key for the desktop app
    SECRET_KEY = secrets.token_hex(32)

    # Optional: If you want to persist the key between sessions
    @classmethod
    def load_persistent_key(cls):
        key_file = os.path.join(cls.BASE_DIR, 'instance', 'secret.key')
        try:
            if os.path.exists(key_file):
                with open(key_file, 'r') as f:
                    return f.read().strip()
            else:
                key = secrets.token_hex(32)
                os.makedirs(os.path.dirname(key_file), exist_ok=True)
                with open(key_file, 'w') as f:
                    f.write(key)
                return key
        except (OSError, IOError):
            return secrets.token_hex(32)
