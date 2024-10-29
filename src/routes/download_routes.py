from flask import send_from_directory, render_template, Blueprint


bp = Blueprint('downloads', __name__)

@bp.route('/download', methods=["GET"])
def download_page():
    return render_template('download.html')

@bp.route('/download/windows', methods=['GET'])
def download_windows():
    return send_from_directory(
        directory='../installers/windows',  
        path='CaseMapLite_Setup.exe',
        as_attachment=True
    )

@bp.route('/download/mac', methods=['GET'])
def download_mac():
    return send_from_directory(
        directory='../installers/mac',  
        path='create_dmg.sh',
        as_attachment=True
    )