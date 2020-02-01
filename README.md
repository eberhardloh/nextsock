# nextsock

A skeleton app based on a tri-front audience / speaker / board system.

That's the solution of the mystery, how to deal with socket and state.
Several hours and lots of experiments to find out.

yarn recommended.

## setup

* git clone ...
* cd ...
* yarn
* create .env
```
# MySQL
DBHOST="localhost"
DBPORT= 3306
DBUSERNAME="nextsock"
DBPASSWORD="nextsock"
DBDATABASE="nextsock"
```
* sql/*
  init contains mylsq.user, create & insert table
  usercodes explains a simple code generation
* yarn sv
(sv starts supervisor server.js)

## in brief

### useState

use as many stateful variables you app needs...

```js
const [payload, setPayload] = useState({});
const [user,    setUser]    = useState({});
const [what,    setWhat]    = useState({});
```

### socket.on('...', payload)

the center of the protocol.

Depending on the payload it controls all states and functions of the app.

```
socket.on('target', (payload) => {
	if(payload.what) {
		setWhat(payload.what);
	}
	if(payload.user) {
		setUser(payload.user);
		if(payload.user.whoami) {
			setWhoAmI(payload.user.whoami);
		}
	}
});
```

### useEffect

The only event happening on the client side is `on(payload)`, so useEffect only has to watch the payload.

```js
useEffect(() => {
	if(payload.what) {
		switch(payload.what) {
			//...
		}
	}
}, [payload]);
```

Also import useEffect in hooks/useSocket

---

This file was edited with Typora

