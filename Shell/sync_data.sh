#!/bin/bash
sudo rsync -avz /home/pocatcom/mkServer_Design/DB/BTInsert/ /home/pocatcom/mkServer/DB/BTInsert && \
     rsync -avz /home/pocatcom/mkServer_Design/DB/BTInsert/ /home/pocatcom/mkServer_Build/DB/BTInsert && \
     rsync -avz /home/pocatcom/mkServer_Design/DB/BTInsert/ /home/pocatcom/mkServer_JW/DB/BTInsert && \
     rsync -avz /home/pocatcom/mkServer_Design/DB/BTInsert/ /home/pocatcom/mkServer_JWTest/DB/BTInsert
