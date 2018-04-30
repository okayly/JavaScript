#!/bin/sh
echo "---- create db ----"
sudo echo "create database mKUF;show databases;" |  mysql -uroot -pP@ssw0rd mysql
