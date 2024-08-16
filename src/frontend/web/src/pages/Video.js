import React, { useEffect, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { Badge, Button, ButtonGroup, IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import CallIcon from '@mui/icons-material/Call';
import VideoContext from '../context/VideoContext';
import { useLocation } from 'react-router-dom';

const Video = () => {
    const { peer, sendJsonMessage, lastJsonMessage } = React.useContext(VideoContext);
    const location = useLocation();
    const { userID, action } = location.state || {};

    const connectionStatus = {
        INIT: "init",
        CALLING: 'calling',
        ACTIVE: 'active',
    };

    const [localStream, setLocalStream] = useState(new MediaStream());
    const [remoteStream, setRemoteStream] = useState(null);
    const videoLocalRef = useRef(localStream);
    const videoRemoteRef = useRef(remoteStream);

    useEffect(() => {
        // peer.on()
    }, [])

    // If call was accepted - start connection with peer js
    useEffect(() => {
        if (lastJsonMessage) {
            if (lastJsonMessage.type === 'video_answer') {
                console.log(lastJsonMessage);
                peer.connect(lastJsonMessage.peer);
            } else if (lastJsonMessage.type === "end_call") {
                // peer.disconnect();
            }
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        if (action === "startCall") {
            console.log("startCall");
            sendJsonMessage({
                type: "video_offer",
                recipient: location.state.userID,
            })
        } else if (action === "acceptCall") {
            console.log("acceptCall");
            console.log(peer.id);

            sendJsonMessage({
                type: "video_answer",
                recipient: location.state.userID,
                peer: peer.id,
            })
        }
    }, [action, userID])


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
                        {/* <ButtonGroup color="info" variant="contained" aria-label="video call control buttons">
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
                        </ButtonGroup> */}
                    </Box>
                </Grid>
            </Box>
        </Container>
    );
};

export default Video;