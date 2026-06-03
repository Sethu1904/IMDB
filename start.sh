#!/bin/bash

echo "Starting MongoDB..."
brew services start mongodb-community@6.0
sleep 2

echo "Starting Flask app..."
cd "$(dirname "$0")"
source venv/bin/activate
python run.py
