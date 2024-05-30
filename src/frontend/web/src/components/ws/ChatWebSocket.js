import React, { useEffect, useRef, useContext } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import AuthContext from '../../context/AuthContext';


export const ChatWebSocket = () => {
    const { authTokens } = React.useContext(AuthContext);
    const WS_URL = "ws://127.0.0.1:8082/ws/socket-server/chat/"

    const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(
        WS_URL,
        {
            queryParams: {
                "token": authTokens.access
            },
            share: true,
            shouldReconnect: (closeEvent) => true,
            retryOnError: true,
            reconnectAttempts: 600,
            // 1 second, 2 seconds, 4 seconds, 8 seconds, caps at 10 seconds
            reconnectInterval: (attemptNumber) =>
                Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
            heartbeat: {
                message: '{"type": "ping"}',
                returnMessage: '{"type": "pong"}',
                timeout: 60000, // 1 minute, if no response is received, the connection will be closed
                interval: 25000, // every 25 seconds, a ping message will be sent
            },
            onOpen: () => console.log('ChatWebSocket opened.'),
            onClose: () => console.log('ChatWebSocket closed.'),
            onMessage: (event) => console.log('ChatWebSocket received', event),
        }
    );

    return {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        getWebSocket
    };
}