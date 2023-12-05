const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

const connections = new Set();

wss.on('connection', (ws) => {
    connections.add(ws);

    const broadcast = (data) => {
        connections.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    ws.on('message', (data) => {
        broadcast(data);
    });

    ws.on('close', () => {
        connections.delete(ws);
    });

});


process.on('SIGINT', () => {
    console.log('\nReceived SIGINT (Ctrl+C). Initiating graceful shutdown...');

    // Close all WebSocket connections
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.close();
        }
    });

    // Close the server
    server.close(() => {
        console.log('Server closed. Exiting process.');
        process.exit(0);
    });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});