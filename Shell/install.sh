echo "---- 1. apt-get update ----"
sudo apt-get update

echo "---- 2. install ssh ----"
sudo apt-get install ssh

echo "---- 3. install python-software-properties ----"
sudo apt-get install python-software-properties
sudo apt-get install python-software-properties-common

echo "---- 4. add-apt-repository ----"
sudo add-apt-repository ppa:chris-lea/node.js

echo "---- 5. install nodejs ----"
sudo apt-get install nodejs


npm install
echo "---- start install npm ----"
sudo curl -O -L https://npmjs.org/install.sh
sudo sh install.sh
sudo npm install -g nodemon

echo "---- finish install npm ----"