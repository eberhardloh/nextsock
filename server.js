require('dotenv').config();

const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const path = require('path');
const ip = require('ip');

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
        console.log('\nserver started: http://%s:%d/\n--------------------------------------------', ip.address(), port);
    })
})

// based on socket.id, just containing user.id and minor informations
const connections = {};

// container for the connected individuals ("user.id": {...})
const individuals = {};

let totalConnections = 0;


// MONITOR
let monitorId = '';
const monitor = (obj, log = '', indent = 0) => {
    if(monitorId) {
        io.to(monitorId).emit('monitor', obj);
    }
    if(log) {
        console.log('MONITOR ' + log + '\n%s', JSON.stringify(obj, null, indent));
    }
}


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

    let user = connections[socket.id].who ? individuals[connections[socket.id].who] : { id: 0 }

    // Handshake specials
    socket.on('monitor', (payload) => {
        monitorId = socket.id;
        connections[socket.id].what = 'monitor';
        monitor({ connections: connections });
    });

    // Handshake with User-Identifikation
    socket.on('hello', async (payload) => {
        console.log('HELLO\n%s', JSON.stringify(payload, null, 2));

        if(payload.who) {
            let user = await db.getUser(payload.who);
            if(user && user.role) {
                connections[socket.id].who = user.id;
                connections[socket.id].what = user.role;
                monitor({ connections: connections }, 'user');

                individuals[user.id] = user;
                individuals[user.id].socket_id = socket.id;

                socket.emit(user.role, { user: user });

            }
            monitor({ individuals: individuals });
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

            if(socket.id == monitorId) {
                monitorId = '';
            }

            delete connections[socket.id];
            monitor({ connections: connections });

            // indiviuals[...] is kept due to reconnect!

            // console.log('DISCONNECT: %s', socket.id);

        }
//		socket.disconnect();
	});


});
