const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const TicTacToeGame = require('./game');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const game = new TicTacToeGame();

app.use(express.static('public'));

const connections = new Set();

wss.on('connection', ws => {
    if (game.addPlayer(ws)) {
        ws.send(JSON.stringify({ type: 'gameState', data: game.getCurrentState() }))

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({ type: 'gameState', data: game.getCurrentState() })
                )
            }
        })

        ws.on('message', data => {
            try {
                const { type, position } = JSON.parse(data)
                if (type === 'makeMove') {
                    if (game.makeMove(ws, position)) {
                        wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(
                                    JSON.stringify({
                                        type: 'gameState',
                                        data: game.getCurrentState()
                                    })
                                )
                            }
                        })

                        const winner = game.checkWinner()

                        if (winner) {
                            wss.clients.forEach(client => {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(
                                        JSON.stringify({ type: 'gameOver', data: { winner } })
                                    )
                                }
                            })

                            setTimeout(() => {
                                game = new TicTacToeGame()
                                wss.clients.forEach(client => {
                                    if (client.readyState === WebSocket.OPEN) {
                                        client.send(
                                            JSON.stringify({
                                                type: 'gameState',
                                                data: game.getCurrentState()
                                            })
                                        )
                                    }
                                })
                            }, 3000)
                        }
                    }
                }
            } catch (error) {
                console.error('Invalid message format:', error.message)
            }
        })

        ws.on('close', () => {
            game.players = game.players.filter(player => player !== ws)

            if (game.players.length === 0) {
                game = new TicTacToeGame()
            }
        })
    }
})


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