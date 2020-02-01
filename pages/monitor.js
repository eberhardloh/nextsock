import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';

import { getParams } from '../lib/tools';

import Head from 'next/head';

const Monitor = () => {
    const [update,  setUpdate]  = useState(0);
    const [payload, setPayload] = useState({});
    const [data,    setData]    = useState({});
    const [rpl,     setRpl]     = useState('');

    const socket = useSocket();

    useSocket('hello', cargo => {
        socket.emit('monitor', 1);
    });

    useSocket('monitor', cargo => {
        console.log(' > %s', JSON.stringify(cargo, null, 0));
        setPayload(cargo);
    });

    useEffect(() => {
        // Object.keys(payload).map((item, index) => { console.log(item); setData({ ...data, [item]: payload[item] }) });
        setUpdate(update + 1);
        setData({ ...data, ...payload });
        setRpl('"(' + Object.keys(payload).join('|') + ')"');
    }, [payload]);

    return (
        <div className="Monitor">
            <Head>
              <title>Server variables monitor</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <p>Update {update}: {Object.keys(payload).join(', ')}</p>
            <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2).replace(new RegExp(rpl, 'g'), '"<span style="background-color: #FF9; border: 1px navy dashed">$1</span>"') }} />
            <style jsx>{`
                pre { color: navy; font-family: 'Courier New'; font-size: 12px; }
            `}</style>
        </div>
    );
}

export default Monitor;
