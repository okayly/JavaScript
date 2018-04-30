#!/bin/bash

sudo rsync -avz --exclude="mkServer.js" --exclude="config.json" --exclude="node_modules" --exclude="logs" --exclude="BTInsert" /home/pocatcom/mkServer_JW/ /home/pocatcom/mkServer_JWTest && \
	 rsync -avz --exclude="mkServer.js" --exclude="config.json" --exclude="node_modules" --exclude="logs" --exclude="BTInsert" /home/pocatcom/mkServer_JW/ /home/pocatcom/mkServer_Design && \
	 rsync -avz --exclude="mkServer.js" --exclude="config.json" --exclude="node_modules" --exclude="logs" --exclude="BTInsert" /home/pocatcom/mkServer_JW/ /home/pocatcom/mkServer_Build && \
	 rsync -avz --exclude="mkServer.js" --exclude="config.json" --exclude="node_modules" --exclude="logs" --exclude="BTInsert" /home/pocatcom/mkServer_JW/ /home/pocatcom/mkServer