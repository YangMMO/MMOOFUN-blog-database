#!/bin/bash

rm -rf ../blog
cp -r ../blog-backup ../blog
/bin/stop.sh
/bin/start.sh