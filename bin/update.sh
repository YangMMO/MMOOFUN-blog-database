#!/bin/bash

cp -r ../blog ../blog-backup
git pull
/bin/stop.sh
/bin/start.sh