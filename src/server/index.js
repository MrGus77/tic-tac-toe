const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const TicTacToeGame = require('./game');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const game = new TicTacToeGame();

app.use(express.static('public'));

wss.on('connection', (ws) => {
    // Handle WebSocket connections...

    // When a new player connects, try to add them to the game
    if (game.addPlayer(ws)) {
        // Notify the new player about the current state
        ws.send(JSON.stringify({ type: 'gameState', data: game.getCurrentState() }));

        // Broadcast the updated state to all players
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'gameState', data: game.getCurrentState() }));
            }
        });

        ws.on('message', (data) => {
            // Handle moves from clients
            try {
                const { type, position } = JSON.parse(data);
                if (type === 'makeMove') {
                    if (game.makeMove(ws, position)) {
                        // Broadcast the updated state to all players
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({ type: 'gameState', data: game.getCurrentState() }));
                            }
                        });

                        // Check for a winner or tie
                        const winner = game.checkWinner();
                        if (winner) {
                            wss.clients.forEach((client) => {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({ type: 'gameOver', data: { winner } }));
                                }
                            });
                            // Reset the game after a delay
                            setTimeout(() => {
                                game = new TicTacToeGame();
                                wss.clients.forEach((client) => {
                                    if (client.readyState === WebSocket.OPEN) {
                                        client.send(JSON.stringify({ type: 'gameState', data: game.getCurrentState() }));
                                    }
                                });
                            }, 3000);
                        }
                    }
                }
            } catch (error) {
                console.error('Invalid message format:', error.message);
            }
        });

        ws.on('close', () => {
            // Handle player disconnect
            game.players = game.players.filter(player => player !== ws);
            if (game.players.length === 0) {
                // Reset the game if there are no players
                game = new TicTacToeGame();
            }
        });
    }
});


const bodyParser = require('body-parser');

// Use bodyParser middleware to parse JSON in POST requests
app.use(bodyParser.json());

// RESTful API endpoints...
app.post('/join', (req, res) => {
    // Handle joining the game...
    const { playerName } = req.body;

    if (playerName && game.addPlayer(playerName)) {
        res.status(200).json({ message: 'Successfully joined the game.' });
    } else {
        res.status(400).json({ error: 'Failed to join the game. The game is full or invalid player name.' });
    }
});

app.get('/state', (req, res) => {
    // Handle getting the game state...
    res.status(200).json(game.getCurrentState());
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