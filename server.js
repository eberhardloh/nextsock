require('dotenv').config();

const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const path = require('path');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({dev})
const nextHandler = nextApp.getRequestHandler()

// ===============================
const db = require('./lib/db');
const { findByKey } = require('./lib/tools');


nextApp.prepare().then(() => {
/*
    app.get('/messages/:chat', (req, res) => {
        res.json(messages[req.params.chat]);
    })
*/
    app.get('*', (req, res) => {
        return nextHandler(req, res);
    })

    server.listen(port, err => {
        if (err) {
            throw err;
        }
        console.log('started http://localhost:%d/', port);
    })
})

// based on socket.id, just containing user.id and minor informations
const connections = {};
// container for the connected individuals ("user.id": {...})
const connected = {};

let totalConnections = 0;

// socket.io server
io.on('connection', async (socket) => {

    totalConnections++;

    if(socket.handshake.query.z) {
        // see hooks/useSocket.js,
        // parameter z signals the connection is NOT coming from Hot Module Reload

        connections[socket.id] = { who: 0, what: '' };

        console.log('CONNECT: %d %s', totalConnections, socket.id);

        // triggers the client to send basic information about himself, kind of a login
        socket.emit('hello', { msg: '#1.1', n: totalConnections });

//    } else {
//        console.log('HMR connect: %s', socket.id);
    }


    // Handshake with User-Identifikation
    socket.on('hello', async (payload) => {
        console.log('HELLO\n%s', JSON.stringify(payload, null, 2));

        if(payload.who) {
            let user = await db.getUser(payload.who);
            if(user && user.role) {
                socket.emit(user.role, { user: user });
            }
        } else {
            console.log('invalid user');
        }

        if(payload.what) {
            switch(payload.what) {

                case 'user-type-one': {


                    break;
                }

                default: { /* 'audience' */
                }
            }

            console.log('HELLO %s', JSON.stringify(user, null, 0));

        }

    });


    socket.on('role-type-one', async (payload) => {
        console.log('ROLE-TYPE-ONE: ' + JSON.stringify(payload));
    });


    socket.once('disconnect', () => {
        if(connections[socket.id]) {
            let user = { id: 0 };

            // ...

            delete connections[socket.id];

            // console.log('DISCONNECT: %s', socket.id);

        }
//		socket.disconnect();
	});


});
