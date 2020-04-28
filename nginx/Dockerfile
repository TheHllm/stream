FROM tiangolo/nginx-rtmp
RUN apt update -y && apt install -y ffmpeg x264
COPY nginx.conf /etc/nginx/nginx.conf
COPY html /usr/local/nginx/html
VOLUME /opt/dash