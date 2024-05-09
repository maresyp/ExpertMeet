import React, { useEffect, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AuthContext from '../context/AuthContext';

const useStyles = styled({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const Chat = () => {
    const classes = useStyles();
    const { user } = React.useContext(AuthContext)
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([
        { owner: 2137, text: 'Hey, Iam Good! What about you ?', time: '09:31' },
        // initial messages here
    ]);

    // Scroll on new message
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const updateMessageHandler = (event) => {
        setUserMessage(event.target.value);
    }

    const sendMessageHandler = () => {
        console.log(user)
        console.log(userMessage);
        if (!userMessage) {
            return
        }
        // TODO: send message
        setMessages([...messages, { owner: user.user_id, text: userMessage, time: new Date().toLocaleTimeString() }]);
        setUserMessage('');
    }

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                }}
            >
                <Grid container>
                    <Grid item xs={12} >
                        <Typography variant="h5" className="header-message">Czat</Typography>
                    </Grid>
                </Grid>
                <Grid container component={Paper} className={classes.chatSection}>
                    <Grid item xs={3} className={classes.borderRight500}>
                        <Grid item xs={12} style={{ padding: '10px' }}>
                            <TextField id="outlined-basic-email" label="Wyszukaj" variant="outlined" fullWidth />
                        </Grid>
                        <Divider />
                        <List>
                            <ListItem button key="RemySharp">
                                <ListItemIcon>
                                    <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                                </ListItemIcon>
                                <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
                                <ListItemText secondary="online" align="right"></ListItemText>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={9}>
                        <Box sx={{
                            height: '600px',
                            overflow: 'auto',
                        }}>
                            <List className={classes.messageArea}>
                                {messages.map((message, index) => (
                                    <ListItem key={index}>
                                        <Box sx={{
                                            maxWidth: '75%',
                                            margin: message.owner === user.user_id ? '0 0 0 auto' : '0 auto 0 0',
                                        }}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <ListItemText align={message.owner === user.user_id ? 'right' : 'left'} primary={message.text} />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <ListItemText align={message.owner === user.user_id ? 'right' : 'left'} secondary={message.time} />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </ListItem>
                                ))}
                                <div ref={messagesEndRef} />
                            </List>
                        </Box>
                        <Divider />
                        <Grid container style={{ padding: '20px' }}>

                            <Grid item xs={11}>
                                <TextField value={userMessage} onChange={updateMessageHandler} onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        sendMessageHandler();
                                        event.preventDefault(); // Prevents the addition of a new line in the TextField after pressing 'Enter'
                                    }
                                }} label="Napisz wiadomość" fullWidth />
                            </Grid>

                            <Grid item xs={1} align="right">
                                <Fab onClick={sendMessageHandler} color="primary" aria-label="add"><SendIcon /></Fab>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Chat;