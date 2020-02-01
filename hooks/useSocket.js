import { useEffect } from 'react';
import io from 'socket.io-client';

const sockurl = process.env.SOCKURL || "";

const socket = io(sockurl + '?z=1');

const useSocket = (eventName, callbackFunc) => {
    useEffect(() => {
        socket.on(eventName, callbackFunc);

        return function useSocketCleanup() {
            socket.off(eventName, callbackFunc);
        }
    }, [eventName, callbackFunc]);

    return socket;
}

export { socket };
export default useSocket;
