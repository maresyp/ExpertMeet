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

const Video = () => {
    // eslint-disable-next-line no-unused-vars
    const { sendJsonMessage, lastJsonMessage, readyState } = VideoWebSocket();
    const location = useLocation();
    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [screenEnabled, setScreenEnabled] = useState(false);

    const toggleMic = () => {
        setMicEnabled(!micEnabled);
    }

    const toggleVideo = () => {
        setVideoEnabled(!videoEnabled);
    }

    const toggleScreenShare = () => {
        setScreenEnabled(!screenEnabled);
    }

    const connectionStatus = {
        CALLING: 'calling'
    };

    const servers = {
        iceServers: [
            { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }
        ]
    };

    useEffect(() => {
        if (lastJsonMessage) {
            handleSocketMessage(lastJsonMessage);
        }
    }, [lastJsonMessage]);

    const handleSocketMessage = async (data) => {

    }

    console.log(location.state);
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
                            <Button><MicOffIcon /></Button>
                            <Button><VideocamOffIcon /></Button>
                            <Button><ScreenShareIcon /></Button>
                        </ButtonGroup>
                    </Box>
                </Grid>
            </Box>
        </Container>
    );
};

export default Video;