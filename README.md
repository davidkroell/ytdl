# ytdl
A simple web-based YouTube MP3 downloader

# Installation

```bash
# get the code and build a Docker image
git clone https://github.com/david-kroell/ytdl
cd ytdl
docker build -t davidkroell/ytdl:fromSource .

# run it
docker run -d -p 3000:3000 davidkroell/ytdl:fromSource
```

## Behind reverse proxy

If you are behind a reversed proxy, you should make use of the environement variable `PROXY_HEADER_REAL_IP_KEY`. This variable specifies the HTTP header in which the original IP-Address is stored by the proxy. For apache this is normally `X-Forwarded-For`, for [jwilder's automated reverse proxy](https://github.com/jwilder/nginx-proxy) this should be `X-Real-Ip`

```bash
# run behind proxy
docker run -d -p 3000:3000 -e PROXY_HEADER_REAL_IP_KEY=X-Forwarded-For davidkroell/ytdl:fromSource
```

# Disclaimer
The authors are not responsible for any misuse of the software.