import os
from functools import lru_cache
from flask import (
    Blueprint, 
    send_from_directory, 
    render_template, 
    current_app, 
    abort
)

bp = Blueprint('downloads', __name__)

INSTALLER_BASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'installers'))

@lru_cache(maxsize=2)
def get_installer_path(platform):
    """Cached installer path retrieval"""
    platform_paths = {
        'windows': os.path.join(INSTALLER_BASE_PATH, 'windows', 'CaseMapLite_Setup.exe'),
        'mac': os.path.join(INSTALLER_BASE_PATH, 'mac', 'create_dmg.sh')
    }
    return platform_paths.get(platform)

def verify_installer_exists(platform):
    """Verify installer file exists"""
    installer_path = get_installer_path(platform)
    if not installer_path or not os.path.exists(installer_path):
        current_app.logger.error(f"Installer not found for platform: {platform}")
        return False
    return True

@bp.route('/download', methods=["GET"])
def download_page():
    try:
        windows_available = verify_installer_exists('windows')
        mac_available = verify_installer_exists('mac')
        return render_template('download.html', 
                             windows_available=windows_available,
                             mac_available=mac_available)
    except Exception as e:
        current_app.logger.error(f"Error in download_page: {str(e)}")
        return render_template('error.html', message="Failed to load download page"), 500

@bp.route('/download/windows', methods=['GET'])
def download_windows():
    try:
        if not verify_installer_exists('windows'):
            abort(404)
        return send_from_directory(
            directory=os.path.join(INSTALLER_BASE_PATH, 'windows'),
            path='CaseMapLite_Setup.exe',
            as_attachment=True
        )
    except Exception as e:
        current_app.logger.error(f"Error in download_windows: {str(e)}")
        return render_template('error.html', message="Failed to download Windows installer"), 500

@bp.route('/download/mac', methods=['GET'])
def download_mac():
    try:
        if not verify_installer_exists('mac'):
            abort(404)
        return send_from_directory(
            directory=os.path.join(INSTALLER_BASE_PATH, 'mac'),
            path='create_dmg.sh',
            as_attachment=True
        )
    except Exception as e:
        current_app.logger.error(f"Error in download_mac: {str(e)}")
        return render_template('error.html', message="Failed to download Mac installer"), 500