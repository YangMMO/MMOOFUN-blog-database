#!/bin/bash

cp -r ../blogdemo ../blog-backup
git pull
bin/stop.sh
bin/start.sh