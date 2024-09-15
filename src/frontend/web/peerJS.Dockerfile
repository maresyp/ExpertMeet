FROM node

WORKDIR /usr/src/app
RUN npm install peer -g

CMD ["peerjs", "--port", "9000", "--path", "/video-peer"]