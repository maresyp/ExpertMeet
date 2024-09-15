import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoContext from "../../context/VideoContext";

const VideoOverlay = () => {
    const { lastJsonMessage, sendJsonMessage } = React.useContext(VideoContext);
    const [isCalling, setIsCalling] = useState(false);
    const [callStack, setCallStack] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === "video_offer") {
            setIsCalling(true);
            setCallStack(prevStack => [...prevStack, lastJsonMessage.callerID]);
        }
    }, [lastJsonMessage]);

    const handleAcceptCall = () => {
        setIsCalling(false);
        navigate('/video', { state: { userID: lastJsonMessage.callerID, action: "acceptCall", } })
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
            <DialogTitle sx={{ textAlign: 'center' }} id="alert-dialog-title">Nadchodzące połączenie</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar alt={'P'} src={`http://127.0.0.1:8080/api/profile/get_avatar_by_user/${callStack[callStack.length - 1]}`}
                    sx={{ width: 75, height: 75, fontSize: '3rem', marginBottom: 5 }} // Adjust width, height, and fontSize as needed
                />
                <DialogContentText id="alert-dialog-description">
                    Someone is calling you. Would you like to accept the call?
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant="contained" onClick={handleDeclineCall} color="error">
                    Odrzuć
                </Button>
                <Button variant="contained" onClick={handleAcceptCall} color="success" autoFocus>
                    Zaakceptuj
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VideoOverlay;