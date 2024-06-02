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
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AuthContext from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChatWebSocket } from '../components/ws/ChatWebSocket';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';
import CallIcon from '@mui/icons-material/Call';
import { IconButton, Tooltip } from '@mui/material';

function ChatWindow({ recipientID, profile, newMessageCallback }) {
    const { user, authTokens } = React.useContext(AuthContext);
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // State to track if there are more messages to fetch
    // eslint-disable-next-line no-unused-vars
    const { sendJsonMessage, lastJsonMessage, readyState } = ChatWebSocket();
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            if (lastJsonMessage.type === "chat-single-message" && lastJsonMessage.sender === recipientID) {
                lastJsonMessage.send_timestamp = new Date(lastJsonMessage.send_timestamp)
                setMessages(oldMessages => [...oldMessages, lastJsonMessage]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastJsonMessage]);

    useQueryClient()

    const fetchMessages = async ({ queryKey }) => {
        // eslint-disable-next-line no-unused-vars
        const [_key, recipientID, page] = queryKey;
        const response = await fetch(`http://127.0.0.1:8082/api/chat/messages/${recipientID}?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                setHasMore(false);
                throw new Error('There are no more messages to download.');
            }
            throw new Error('Failed to fetch');
        }

        const data = await response.json();

        return data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ['ChatMessages', recipientID, page, hasMore],
        queryFn: fetchMessages,
        enabled: !!recipientID && hasMore, // Only fetch if there are more messages
        keepPreviousData: true,
    });

    if (error) {
        console.log(error);
    }

    useEffect(() => {
        setPage(1);
        setMessages([]);
        setHasMore(true);
    }, [recipientID]);

    useEffect(() => {
        if (data) {
            const chatContainer = chatContainerRef.current;
            const previousHeight = chatContainer.scrollHeight;
            const previousScrollTop = chatContainer.scrollTop;


            setMessages((prevMessages) => {
                const newMessages = data.filter(
                    (newData) => !prevMessages.some((msg) => msg.message_id === newData.message_id)
                );
                let allMessages = [...newMessages, ...prevMessages];

                // remove all messages belonging to other user
                allMessages = allMessages.filter(
                    (message) => message.recipient_id === recipientID || message.sender_id === recipientID
                );

                // Sort messages by timestamp
                allMessages.sort((a, b) => new Date(a.send_timestamp) - new Date(b.send_timestamp));

                requestAnimationFrame(() => {
                    chatContainer.scrollTop = chatContainer.scrollHeight - previousHeight + previousScrollTop;
                });

                return allMessages;
            });
        }
    }, [data, recipientID]);

    const updateMessageHandler = (event) => {
        setUserMessage(event.target.value);
    };

    const sendMessageHandler = () => {
        if (!userMessage) {
            return
        }

        setMessages([...messages, { sender_id: user.user_id, body: userMessage, send_timestamp: new Date() }]);

        sendJsonMessage({
            type: 'chat_message',
            message: userMessage,
            recipient: recipientID,
        })

        newMessageCallback(recipientID);

        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // TODO: make it scroll all the way down

        setUserMessage('');
    };

    const handleScroll = () => {
        const chatContainer = chatContainerRef.current;

        if (chatContainer.scrollTop === 0 && !isLoading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        chatContainer.addEventListener('scroll', handleScroll);
        return () => {
            chatContainer.removeEventListener('scroll', handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, hasMore]);

    return (
        <Grid item xs={9} sx={{ display: 'flex', flexDirection: 'column', height: '700px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', maxHeight: '65px' }}>
                <Avatar alt={profile?.first_name || 'P'} src={`http://127.0.0.1:8080/api/profile/get_avatar_by_user/${profile?.id}`} />
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>{profile?.first_name} {profile?.last_name} </Typography>
                <Tooltip title="Zadzwoń">
                    <IconButton>
                        <CallIcon sx={{ fontSize: 25 }} />
                    </IconButton>
                </Tooltip>
            </Box>
            <Divider />
            <Box ref={chatContainerRef} sx={{ overflow: 'auto', flex: 1 }}>
                <List sx={{ flex: 1, overflowY: 'auto' }}>
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
                                                overflowX: "hidden",
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            <ListItemText align={message.sender_id === user.user_id ? 'right' : 'left'} primary={message.body} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ListItemText align={message.sender_id === user.user_id ? 'right' : 'left'} secondary={new Date(message.send_timestamp).toLocaleString()} />
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
                            event.preventDefault();
                        }
                    }} label="Napisz wiadomość" fullWidth />
                </Grid>

                <Grid item xs={1} align="right">
                    <Fab onClick={sendMessageHandler} color="primary" aria-label="add"><SendIcon /></Fab>
                </Grid>
            </Grid>
        </Grid>
    );
}

const Chat = () => {
    useQueryClient()
    const { newChatUserId } = useParams(null);
    const { user, authTokens } = React.useContext(AuthContext)
    const [conversations, setConversations] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // State to track if there are more conversations to fetch
    // eslint-disable-next-line no-unused-vars
    const { sendJsonMessage, lastJsonMessage, readyState } = ChatWebSocket();
    const [currentRecipient, setCurrentRecipient] = useState(null);
    const friendsContainerRef = useRef(null);

    // Used for updating conversations when new message was sent in chat component
    const newMessageCallback = (userID) => {
        // Create a new array from the current conversations
        const updatedConversations = [...conversations];

        const conversation = updatedConversations.find(cov => (cov.person1 === userID || cov.person2 === userID));
        if (conversation) {
            conversation.last_message_time = new Date().toISOString();
            updatedConversations.sort((a, b) => new Date(a.last_message_time) - new Date(b.last_message_time));
            updatedConversations.reverse();
            setConversations(updatedConversations);
        }
    }

    useEffect(() => {
        // TODO: add indicator of new message
        if (lastJsonMessage !== null) {
            console.log('Chat Received:', lastJsonMessage);
            if (lastJsonMessage.type === "chat-single-message") {
                newMessageCallback(lastJsonMessage.sender);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastJsonMessage]);

    useEffect(() => {
        console.log("Socket readyState: ", readyState);
    }, [readyState]);

    const fetchConversations = async ({ queryKey }) => {
        // eslint-disable-next-line no-unused-vars
        const [_key, page, hasMore] = queryKey;
        const response = await fetch(`http://127.0.0.1:8082/api/chat/conversations/?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                setHasMore(false);
                throw new Error('There are no more conversations to download.');
            }
            throw new Error('Failed to fetch');
        }

        const data = await response.json();

        return data;
    };

    const fetchUserData = async (userID) => {
        const res = await fetch(`http://127.0.0.1:8080/api/user/get_basic_info/${userID}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch user data');
        }
        return res.json();
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ['ChatFriends', page, hasMore],
        queryFn: fetchConversations,
        enabled: hasMore,
        keepPreviousData: true,
    })

    if (isLoading) {

    }

    if (error) {
        console.log(error);
    }

    useEffect(() => {
        if (data) {
            const loadUsers = async () => {
                const updatedConversations = await Promise.all(data.map(async (conversation) => {
                    const otherPersonId = conversation.person1 === user.user_id ? conversation.person2 : conversation.person1;
                    try {
                        const profileData = await fetchUserData(otherPersonId);
                        return {
                            ...conversation,
                            profile: profileData
                        };
                    } catch (err) {
                        console.error(`Failed to fetch user data for user ${otherPersonId}:`, err);
                        return {
                            ...conversation,
                            // Return conversation with default profile data if there's an error
                            profile: { id: -1, username: null, first_name: "Load", last_name: "Failed" }
                        }
                    }
                }));


                updatedConversations.sort((a, b) => new Date(a.last_message_time) - new Date(b.last_message_time));
                updatedConversations.reverse();

                setConversations((prevConversations) => {
                    const filteredConversations = updatedConversations.filter(
                        (newData) => !prevConversations.some((cov) => cov.id === newData.id)
                    );
                    return [...prevConversations, ...filteredConversations]
                }
                );

                // Set currentRecipient to the first conversation's profile ID if not already set
                if (!currentRecipient && updatedConversations.length > 0) {
                    setCurrentRecipient(updatedConversations[0].profile.id);
                }
            };

            loadUsers();
        }
    }, [data, user.user_id, currentRecipient]);


    useEffect(() => {
        console.log(`effect recipient set: ${currentRecipient}`);
    }, [currentRecipient])

    const handleFriendClick = (userID) => {
        setCurrentRecipient(userID)

        sendJsonMessage({
            'type': 'chat_message_read',
            'recipient': userID
        })

        console.log("new user clicked", userID);
    }

    // Used for creation of new chat when accessing /chat/<id>
    if (newChatUserId && (currentRecipient !== newChatUserId)) {
        console.log(newChatUserId);
        setCurrentRecipient(newChatUserId)
        // TODO : handle new chat window

    }

    const handleScroll = () => {
        const friendsContainer = friendsContainerRef.current;
        if (friendsContainer.scrollTop + friendsContainer.clientHeight >= friendsContainer.scrollHeight) {
            if (!isLoading && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    };

    useEffect(() => {
        const friendsContainer = friendsContainerRef.current;
        friendsContainer.addEventListener('scroll', handleScroll);
        return () => {
            friendsContainer.removeEventListener('scroll', handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, hasMore]);

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
                        <Typography variant="h5" className="header-message" style={{ textAlign: 'center', paddingBottom: '25px' }}>Czat</Typography>
                    </Grid>
                </Grid>
                <Grid container component={Paper}
                    sx={{
                    width: '100%',
                    height: "700px",
                    display: 'flex',
                }}>
                    <Grid item xs={3} sx={{
                        borderRight: '1px solid #e0e0e0',
                        flexDirection: 'column',
                    }}>
                        <Grid item xs={12} style={{ padding: '10px' }}>
                            <TextField id="outlined-friend-search" label="Wyszukaj" variant="outlined" fullWidth />
                        </Grid>

                        <List ref={friendsContainerRef} sx={{ flexGrow: 1, maxHeight: "625px", overflowY: 'auto' }}>
                            {conversations.map((conversation, index) => {
                                const profile = conversation.profile
                                return (
                                    <ListItem onClick={() => handleFriendClick(profile?.id)} button key={index}>
                                    <ListItemIcon>
                                            <Avatar alt={profile?.first_name || 'P'} src={`http://127.0.0.1:8080/api/profile/get_avatar_by_user/${profile?.id}`} />
                                    </ListItemIcon>
                                        <ListItemText primary={profile?.first_name + " " + profile?.last_name}></ListItemText>
                                    <ListItemText secondary={new Date(conversation.last_message_time).toLocaleTimeString()} align="right"></ListItemText>
                                </ListItem>
                                )
                            })}
                        </List>
                    </Grid>
                    <ChatWindow recipientID={currentRecipient} profile={conversations.find(conversation => conversation.profile.id === currentRecipient)?.profile} newMessageCallback={newMessageCallback} />
                </Grid>
            </Box>
        </Container>
    );
}

export default Chat;
