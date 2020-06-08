#!/bin/sh
rm -rf /opt/dash/*
chmod 777 -R /opt/uploads

#convert all .avi files
cd /opt/uploads/
while true; do 
    for f in *.avi; do 
        [ -f "$f" ] || continue
        ffmpeg -i "$f"  "${f%.avi}.mp4"
        echo $f
    done
done