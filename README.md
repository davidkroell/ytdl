# ytdl
A simple web-based YouTube MP3 downloader

# Installation

```bash
# get the code and build a Docker image
git clone https://github.com/david-kroell/ytdl
cd ytdl
docker build -t davidkroell/ytdl .

# run it
docker run -d -p 3000:3000 davidkroell/ytdl
```

# Disclaimer
The authors are not responsible for any misuse of the software.