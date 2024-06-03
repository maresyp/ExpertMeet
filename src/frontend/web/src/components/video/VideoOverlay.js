import { VideoWebSocket } from "../ws/VideoWebSocket";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useState, useEffect } from 'react';

const VideoOverlay = () => {
    const { sendJsonMessage, lastJsonMessage, readyState } = VideoWebSocket();
    const [isCalling, setIsCalling] = useState(true);

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === "incoming_call") {
            setIsCalling(true);
        }
    }, [lastJsonMessage]);

    const handleAcceptCall = () => {
        setIsCalling(false);
    };

    const handleDeclineCall = () => {
        setIsCalling(false);
    };

    return (
        <Dialog
            open={isCalling}
            onClose={handleDeclineCall}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Incoming Call</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Someone is calling you. Would you like to accept the call?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeclineCall} color="primary">
                    Decline
                </Button>
                <Button onClick={handleAcceptCall} color="primary" autoFocus>
                    Accept
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VideoOverlay;