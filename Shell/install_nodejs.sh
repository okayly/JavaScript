#!/bin/sh
echo "---- 1. apt-get update ----"
sudo apt-get update

echo "---- 2. install ssh ----"
sudo apt-get install ssh

echo "---- 3. install python-software-properties curl ----"
sudo apt-get install python-software-properties curl

echo "---- 4. add-apt-repository ----"
sudo add-apt-repository ppa:chris-lea/node.js

echo "---- 5. install nodejs ----"
sudo apt-get install nodejs
