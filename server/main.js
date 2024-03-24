import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();

app.get('/', (_req, res) => {
    res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
app.use(cors());

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('message', (data) => {
        io.sockets.emit('message', {
            id: data.id,
            text: data.text,
            author: data.author,
            timestamp: new Date(data.timestamp),
        })
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server listening on 4000');
});
