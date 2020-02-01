import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';

import { getParams } from '../lib/tools';

import Head from 'next/head';

const Monitor = () => {
    const [payload, setPayload] = useState({});
    const [data,    setData]    = useState({});

    const socket = useSocket();

    useSocket('hello', cargo => {
        socket.emit('hello', { who: 'monitor' });
    });

    useSocket('monitor', cargo => {
        console.log(' > %s', JSON.stringify(cargo, null, 0));
        setPayload(cargo);
    });

    useEffect(() => {
        Object.keys(payload).map((item, index) => { setData({ ...data, [item]: payload[item] }) });
    }, [payload]);

    return (
        <div className="Monitor">
            <Head>
              <title>Server variables monitor</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <p>Last payload</p>
            <pre>{JSON.stringify(payload, null, 2)}</pre>
            <style jsx>{`
                pre { color: navy; font-family: 'Courier New'; font-size: 12px; }
            `}</style>
        </div>
    );
}

export default Monitor;
