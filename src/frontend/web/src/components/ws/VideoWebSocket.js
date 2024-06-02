/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useContext } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import AuthContext from '../../context/AuthContext';


export const VideoWebSocket = () => {
    const { authTokens } = React.useContext(AuthContext);
    const WS_URL = "ws://127.0.0.1:8082/ws/socket-server/video/"

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        WS_URL,
        {
            queryParams: {
                "token": authTokens.access
            },
            share: true,
            shouldReconnect: (closeEvent) => true,
            retryOnError: true,
            reconnectAttempts: 600,
            reconnectInterval: 5000, // try to reconnect every 5 seconds
            heartbeat: {
                message: '{"type": "ping"}',
                returnMessage: 'pong',
                timeout: 60000, // 1 minute, if no response is received, the connection will be closed
                interval: 25000, // every 25 seconds, a ping message will be sent
            },
            onOpen: () => console.log('VideoWebSocket opened.'),
            onClose: () => console.log('VideoWebSocket closed.'),
            onMessage: (event) => {
                if (event.data !== "pong") {
                    console.log('VideoWebSocket received', event)
                }
            },
        }
    );

    return {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
    };
}