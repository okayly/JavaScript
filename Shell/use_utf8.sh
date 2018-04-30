#!/bin/sh

ln=`sudo /etc/mysql/my.cnf | grep -n '[client]'`
echo "$ln"
