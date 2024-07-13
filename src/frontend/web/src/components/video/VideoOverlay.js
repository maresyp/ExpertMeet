import { VideoWebSocket } from "../ws/VideoWebSocket";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useState, useEffect } from 'react';

const VideoOverlay = () => {
    const { sendJsonMessage, lastJsonMessage, readyState } = VideoWebSocket();
    const [isCalling, setIsCalling] = useState(false);
    const [callStack, setCallStack] = useState([]);

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === "video_offer") {
            setIsCalling(true);
            setCallStack(prevStack => [...prevStack, lastJsonMessage.callerID]);
        }
    }, [lastJsonMessage]);

    const handleAcceptCall = () => {
        setIsCalling(false);
    };

    const handleDeclineCall = () => {
        setIsCalling(false);
        callStack.forEach(callerID => {
            sendJsonMessage({
                type: "video_rejected",
                recipient: callerID,
            })
        })
        setCallStack([]);
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