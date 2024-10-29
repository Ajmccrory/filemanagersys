from setuptools import setup

APP = ['launcher_mac.py']
DATA_FILES = [
    ('', ['requirements.txt']),
    ('app', [
        'app/app.py',
        # Add other specific app files needed
    ]),
    ('docs', [
        # Add specific doc files needed
    ])
]

OPTIONS = {
    'argv_emulation': True,
    'packages': ['flask', 'flask_sqlalchemy', 'sqlite3'],
    'iconfile': 'app/static/icon.icns',
    'plist': {
        'CFBundleName': 'CaseMap Lite',
        'CFBundleDisplayName': 'CaseMap Lite',
        'CFBundleGetInfoString': "Case Management Made Simple",
        'CFBundleIdentifier': "com.yourdomain.casemaplite",
        'CFBundleVersion': "1.0.0",
        'CFBundleShortVersionString': "1.0.0",
        'NSHumanReadableCopyright': "© 2024 Your Law Firm",
        'NSHighResolutionCapable': True,
    }
}

setup(
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
    name="CaseMap Lite"
) 