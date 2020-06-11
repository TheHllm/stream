#!/bin/sh
rm -rf /opt/dash/*

mkdir /opt/uploads
chmod 777 -R /opt/uploads

mkdir /opt/convert
chmod 777 -R /opt/convert

mkdir /opt/tmp
chmod 777 -R /opt/tmp

#convert all .avi files
cd /opt/convert/
while true; do 
    for f in *; do 
        [ -f "$f" ] || continue
        echo Starting $f
        ffmpeg -loglevel quiet -y -i "$f"  "/opt/tmp/${f%.*}.mp4"
        mv "/opt/tmp/${f%.*}.mp4" "/opt/uploads/${f%.*}.mp4"
        chmod 777 "/opt/uploads/${f%.*}.mp4"
        rm "$f"
        rm "/opt/tmp/${f%.*}.mp4"
        echo Done with $f
    done
    sleep 0.5
done