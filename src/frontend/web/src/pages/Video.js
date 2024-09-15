import React, { useEffect, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, ButtonGroup } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideoContext from '../context/VideoContext';
import { useLocation } from 'react-router-dom';

const Video = () => {
    const { peer, sendJsonMessage, lastJsonMessage } = React.useContext(VideoContext);
    const location = useLocation();
    const { userID, action } = location.state || {};

    const [localStream, setLocalStream] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [remoteStream, setRemoteStream] = useState(null);
    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const videoLocalRef = useRef();
    const videoRemoteRef = useRef();

    // Initialize the local stream
    const initializeLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            if (videoLocalRef.current) {
                videoLocalRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    };

    // Toggle Microphone
    const toggleMic = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setMicEnabled(audioTrack.enabled);
            }
        }
    };

    // Toggle Video
    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoEnabled(videoTrack.enabled);
            }
        }
    };

    // End Call
    const endCall = () => {
        // peer.disconnect();
        sendJsonMessage({
            type: "end_call",
            recipient: userID,
        });
        setLocalStream(null);
        setRemoteStream(null);
    };

    // Handle incoming call
    useEffect(() => {
        if (!localStream) return;

        peer.on('call', (call) => {
            call.answer(localStream); // Answer the call with the local stream
            call.on('stream', (stream) => {
                setRemoteStream(stream);
                if (videoRemoteRef.current) {
                    videoRemoteRef.current.srcObject = stream;
                }
            });
        });

        return () => {
            peer.removeAllListeners('call');
        };
    }, [localStream]);

    // Handle outgoing call and incoming messages
    useEffect(() => {
        if (!localStream || !lastJsonMessage) return;

        if (lastJsonMessage.type === 'video_answer') {
            const mediaConnection = peer.call(lastJsonMessage.peer, localStream);
            mediaConnection.on('stream', (stream) => {
                setRemoteStream(stream);
                if (videoRemoteRef.current) {
                    videoRemoteRef.current.srcObject = stream;
                }
            });
        }
    }, [lastJsonMessage, localStream]);

    useEffect(() => {
        if (action === "startCall") {
            initializeLocalStream().then(() => {
                sendJsonMessage({
                    type: "video_offer",
                    recipient: userID,
                });
            });
        } else if (action === "acceptCall") {
            initializeLocalStream().then(() => {
                sendJsonMessage({
                    type: "video_answer",
                    recipient: userID,
                    peer: peer.id,
                });
            });
        }
    }, [action, userID]);

    return (
        <Container component="main" maxWidth="lg" sx={{ height: '700px' }}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <Grid container>
                    <Grid item xs={12} >
                        <Typography variant="h5" className="header-message" style={{ textAlign: 'center', paddingBottom: '25px' }}>Video </Typography>
                    </Grid>
                </Grid>
                <Grid container component={Paper}
                    sx={{
                        width: '100%',
                        height: "700px",
                        display: 'flex',
                        position: 'relative',
                    }}>
                    {/* Main Video */}
                    <Box
                        component="video"
                        ref={videoRemoteRef}
                        autoPlay
                        muted
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />

                    {/* Self Video */}
                    <Box
                        component="video"
                        ref={videoLocalRef}
                        autoPlay
                        muted
                        sx={{
                            position: 'absolute',
                            bottom: 20,
                            right: 20,
                            width: 275,
                            height: 175,
                            border: '2px solid #fff',
                            backgroundColor: '#000',
                            objectFit: 'cover',
                            borderRadius: '5%'
                        }}
                    />

                    {/* Control Buttons */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            justifyContent: 'center',
                            width: 'auto',
                        }}
                    >
                        <ButtonGroup color="info" variant="contained" aria-label="video call control buttons">
                            <Button onClick={toggleMic}>
                                {micEnabled ? <MicIcon /> : <MicOffIcon />}
                            </Button>
                            <Button onClick={toggleVideo}>
                                {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                            </Button>
                            <Button onClick={endCall} color="error">
                                <CallEndIcon />
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Grid>
            </Box>
        </Container>
    );
};

export default Video;
