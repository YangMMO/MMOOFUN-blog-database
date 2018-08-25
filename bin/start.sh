#!/bin/bash

echo "server start"
nohup node server.js >> /data/server.log 2>&1 &