import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';

import { getParams } from '../lib/tools';

import Head from 'next/head';
import Nav from '../components/nav';

const Home = () => {
    const [payload, setPayload] = useState({});
    const [user,    setUser]    = useState({ id: 0, username: '', role: '', email: '' });

    const socket = useSocket();

    useSocket('hello', cargo => {
        console.log('on(hello)\n%s', JSON.stringify(cargo, null, 0));

        setPayload(cargo);

        let usercode = getParams('user') || '4b116d47';

        socket.emit('hello', { who: usercode });
    });

    useSocket('role-type-one', cargo => {
        console.log('on(role-type-one)\n%s', JSON.stringify(cargo, null, 2));

        setPayload(cargo);
    });

    useEffect(() => {
        if(payload.user) {
            setUser(payload.user);
            socket.emit(user.role, { confirm: 'user-data' });
        }
    }, [payload]);

    return (
        <div className="Index">
            <Head>
              <title>Home</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <Nav />

            <div className="hero">
                <ul>
                    <li>{user.id}</li>
                    <li>{user.username}</li>
                    <li>{user.role}</li>
                    <li>{user.email}</li>
                </ul>
            </div>
            <style jsx>{`
            `}</style>
        </div>
    );
}

export default Home;
