import { io } from "socket.io-client";

// const SOCKET_URL = process.env.REACT_APP_BACKEND_URL; // Change this to production URL if needed

const SOCKET_URL = 'http://localhost:5000'; // Default to local development URL

export const socket = io(SOCKET_URL, {
    autoConnect: false, // we'll connect manually after user login or context init
});
socket.on('connect_error', (err) => {
    console.error('Connection failed:', err);
});
