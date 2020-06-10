#!/bin/sh
rm -rf /opt/dash/*

mkdir /opt/uploads
chmod 777 -R /opt/uploads

mkdir /opt/convert
chmod 777 -R /opt/convert

#convert all .avi files
cd /opt/convert/
while true; do 
    for f in *; do 
        [ -f "$f" ] || continue
        ffmpeg -loglevel quiet -i "$f"  "/opt/uploads/${f%.*}.mp4"
        rm "$f"
        echo $f
    done
done