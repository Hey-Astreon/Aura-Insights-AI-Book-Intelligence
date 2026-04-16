#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# --- THE TRICKY PART: INSTALLING CHROME FOR SELENIUM ---
# This part ensures Chrome and Chromedriver are available on Render's Linux environment

STORAGE_DIR=$HOME/chrome
mkdir -p $STORAGE_DIR

# Download and install Google Chrome
if [[ ! -f $STORAGE_DIR/chrome/google-chrome ]]; then
  echo "Installing Google Chrome..."
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
  echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
  apt-get update
  apt-get install -y google-chrome-stable
else
  echo "Google Chrome already installed"
fi
