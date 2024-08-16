import React from 'react';
import { VideoWebSocket } from '../components/ws/VideoWebSocket';
import { Peer } from "peerjs";

const VideoContext = React.createContext();

export default VideoContext;

export const VideoProvider = ({ children }) => {
    const peerRef = React.useRef(null);
    const { sendJsonMessage, lastJsonMessage, readyState } = VideoWebSocket();

    React.useEffect(() => {
        if (!peerRef.current) {
            peerRef.current = new Peer({
                config: {
                    'iceServers': [{
                        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
                    }]
                },
                debug: 3,
                host: "localhost",
                port: 9000,
                path: "/video-peer"
            });

            peerRef.current.on('open', function (id) {
                console.log('My peer ID is: ' + id);
            });
        }
    }, []);

    let contextData = {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        peer: peerRef.current,
    }

    return (
        <VideoContext.Provider value={contextData}>
            {children}
        </VideoContext.Provider>
    );
};