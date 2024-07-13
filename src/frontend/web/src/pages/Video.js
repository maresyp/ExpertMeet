import { useLocation } from 'react-router-dom';
import { VideoWebSocket } from '../components/ws/VideoWebSocket';
import React, { useEffect, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AuthContext from '../context/AuthContext';
import { Badge, Button, ButtonGroup, IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import CallIcon from '@mui/icons-material/Call';

const Video = () => {
    // eslint-disable-next-line no-unused-vars
    const { sendJsonMessage, lastJsonMessage, readyState } = VideoWebSocket();
    const location = useLocation();
    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [screenEnabled, setScreenEnabled] = useState(false);

    const connectionStatus = {
        INIT: "init",
        CALLING: 'calling',
        ACTIVE: 'active',
    };

    const servers = {
        iceServers: [
            { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }
        ]
    };

    const [videoState, setVideoState] = useState(connectionStatus.INIT);
    const [localStream, setLocalStream] = useState(new MediaStream());
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);

    const videoLocalRef = useRef(null);
    const videoRemoteRef = useRef(null);

    const callButtonStyle = videoState === connectionStatus.ACTIVE ? { backgroundColor: 'red' } : { backgroundColor: 'green' };

    const toggleMic = () => {
        setMicEnabled(!micEnabled);
    }

    const toggleVideo = () => {
        setVideoEnabled(!videoEnabled);
        if (screenEnabled) {
            setScreenEnabled(false);
        }
    }

    const toggleScreenShare = () => {
        setScreenEnabled(!screenEnabled);
        if (videoEnabled) {
            setVideoEnabled(false);
        }
    }

    const toggleCallStatus = () => {
        if (videoState === connectionStatus.ACTIVE) {
            setVideoState(connectionStatus.INIT)
        } else {
            setVideoState(connectionStatus.CALLING)
        }
    }

    useEffect(() => {
        if (lastJsonMessage) {
            handleSocketMessage(lastJsonMessage);
        }
    }, [lastJsonMessage]);


    const handleSocketMessage = async (data) => {

    }

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if (videoLocalRef.current) {
                        videoLocalRef.current.srcObject = stream;
                    }
                })
                .catch(error => {
                    console.error("Error accessing the camera: ", error);
                });
        }
    }, []);

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            if (videoLocalRef.current) {
                videoLocalRef.current.srcObject = screenStream;
            }

            // Handle the end of screen sharing
            screenStream.getVideoTracks()[0].onended = () => {
                stopScreenShare();
            };
        } catch (error) {
            console.error("Error sharing the screen:", error);
        }
    };

    const stopScreenShare = () => {
        if (videoLocalRef.current && videoLocalRef.current.srcObject) {
            videoLocalRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoLocalRef.current.srcObject = null;
        }
    };

    const createPeerConnection = () => {
        const pc = new RTCPeerConnection(servers);

        const remoteStream = new MediaStream();
        setRemoteStream(remoteStream);
        if (videoRemoteRef.current) {
            videoRemoteRef.current.srcObject = remoteStream;
        }

        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendJsonMessage({
                    type: 'video_ice_candidate',
                    candidate: event.candidate,
                    recipient: location.state.userID
                });
            }
        };

        setPeerConnection(pc);
    };

    const createOffer = async () => {
        createPeerConnection();

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        return new Promise((resolve) => {
            if (peerConnection.iceGatheringState === 'complete') {
                resolve(peerConnection.localDescription);
            } else {
                peerConnection.addEventListener('icegatheringstatechange', function checkState() {
                    if (peerConnection.iceGatheringState === 'complete') {
                        peerConnection.removeEventListener('icegatheringstatechange', checkState);
                        resolve(peerConnection.localDescription);
                    }
                });
            }
        });
    };

    const init = async () => {
        if (location.state.action === "startCall" && videoState === connectionStatus.INIT) {
            setVideoState(connectionStatus.CALLING);
            sendJsonMessage({
                type: "video_offer",
                recipient: location.state.userID,
                offer: await createOffer()
            })
        }
    }

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
                        autoPlay
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    >

                    </Box>

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
                    ></Box>
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
                                {micEnabled ? <MicOffIcon /> : <MicIcon />}
                            </Button>
                            <Button onClick={toggleVideo}>
                                {videoEnabled ? <VideocamOffIcon /> : <VideocamIcon />}
                            </Button>
                            <Button onClick={toggleScreenShare}>
                                {screenEnabled ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                            </Button>
                            <Button onClick={toggleCallStatus} style={callButtonStyle}>
                                {videoState === connectionStatus.ACTIVE ? <CallEndIcon /> : <CallIcon />}
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Grid>
            </Box>
        </Container>
    );
};

export default Video;