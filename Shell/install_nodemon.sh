#!/bin/sh
echo "---- start install npm ----"
sudo curl -O -L https://npmjs.org/install.sh
sudo sh install.sh
sudo npm install -g nodemon

echo "---- finish install npm ----"
