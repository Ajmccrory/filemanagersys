#!/bin/bash
echo "Installing required packages..."
pip install -r requirements.txt
echo "Starting CaseMap Lite..."
python -m flask run