#!/bin/bash

rm -rf ../blogdemo
cp -r ../blog-backup ../blogdemo
/bin/stop.sh
/bin/start.sh