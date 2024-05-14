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
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'

const useStyles = styled({
    chatSection: {
        width: '100%',
        height: '80vh'
    },

    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

function ChatWindow({ recipientID }) {
    const { user, authTokens } = React.useContext(AuthContext)
    const classes = useStyles();
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const url = `ws://127.0.0.1:8082/ws/socket-server/chat/?token=${authTokens.access}`
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = (event) => {
            console.log('WebSocket is open now.');
        };

        socketRef.current.onmessage = (event) => {
            console.log('Received:', event.data);
        };

        socketRef.current.onclose = (event) => {
            console.log('WebSocket is closed now.');
        };

        socketRef.current.onerror = (event) => {
            console.error('WebSocket error: ', event);
        };

        // Cleanup function
        return () => {
            socketRef.current.close();
        };
    }, [url]);

    useQueryClient()
    const { isLoading, data, error } = useQuery({
        queryKey: ['ChatMessages'],
        queryFn: ({ signal }) =>
            fetch(`http://127.0.0.1:8082/api/chat/messages/${recipientID}`, {
                signal,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens?.access}`
                },
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
    })

    if (error) {
        console.log(error);
    }

    useEffect(() => {
        if (data) {
            console.log(data)
            setMessages(prevMessages => {
                const newMessages = data.filter(
                    newData => !prevMessages.some(msg => msg.message_id === newData.message_id)
                );
                return [...prevMessages, ...newMessages];
            });
        }
    }, [data]); // Only re-run the effect if `data` changes

    // Scroll on new message
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const updateMessageHandler = (event) => {
        setUserMessage(event.target.value);
    }

    const sendMessageHandler = () => {
        if (!userMessage) {
            return
        }

        setMessages([...messages, { sender_id: user.user_id, body: userMessage, send_timestamp: new Date().toLocaleTimeString() }]);

        socketRef.current.send(JSON.stringify({
            'type': 'chat-message',
            'message': userMessage,
            'recipient': recipientID
        }))

        setUserMessage('');
    }

    return (
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
                                margin: message.sender_id === user.user_id ? '0 0 0 auto' : '0 auto 0 0',
                            }}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                maxWidth: '75%',
                                                margin: message.sender_id === user.user_id ? '0 0 0 auto' : '0 auto 0 0',
                                                padding: '10px',
                                                borderRadius: '15px',
                                                backgroundColor: message.sender_id === user.user_id ? '#0b81ff' : '#f0f0f0',
                                                color: message.sender_id === user.user_id ? '#ffffff' : '#000000',
                                            }}
                                        >
                                            <ListItemText align={message.sender_id === user.user_id ? 'right' : 'left'} primary={message.body} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ListItemText align={message.sender_id === user.user_id ? 'right' : 'left'} secondary={message.send_timestamp} />
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
                    <TextField multiline maxRows={4} value={userMessage} onChange={updateMessageHandler} onKeyPress={(event) => {
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
    )
}

const Chat = () => {
    const classes = useStyles();

    // Used for creation of new chat when accessing /chat/<id>
    const { newChatUserId } = useParams(null);
    const { user } = React.useContext(AuthContext)
    const [conversations, setConversations] = useState([
        { personID: 1, },
        // initial conv here
    ]);

    const [currentRecipient, setCurrentRecipient] = useState(2);
    useEffect(() => {
        console.log(`effect recipient set: ${currentRecipient}`);
    }, [currentRecipient])

    const handleFriendClick = () => {
        setCurrentRecipient(2)
        console.log("new user clicked");
    }

    console.log(newChatUserId);
    if (newChatUserId) {
        setCurrentRecipient(newChatUserId)
        // TODO : handle new chat window

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
                            <ListItem onClick={handleFriendClick} button key="RemySharp">
                                <ListItemIcon>
                                    <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                                </ListItemIcon>
                                <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
                                <ListItemText secondary="online" align="right"></ListItemText>
                            </ListItem>
                        </List>
                    </Grid>
                    <ChatWindow recipientID={currentRecipient} />
                </Grid>
            </Box>
        </Container>
    );
}

export default Chat;