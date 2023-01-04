onmessage = (e) => {
    const socket = new WebSocket('wss://api.retronetwork.ml');
    const sessionId = sessionStorage.getItem('session');

    socket.addEventListener('open', (event) => {
        socket.send(JSON.stringify({
            sessionId: sessionId
        }))
    });

    socket.addEventListener('message', (event) => {
        let msg;

        try {
            msg = JSON.parse(event.data);
        } catch (err) {
            console.log('Server sent invalid data type');
        }

        if (msg) {
            if (msg.error === false) {
                if (msg.targets.includes(sessionId)) {
                    postMessage({
                        type: 'self',
                        data: msg.data
                    });
                } else if (msg.targets.includes('all')) {
                    postMessage({
                        type: 'brodcast',
                        data: msg.data
                    });
                }
            } else if (msg.error === true) {
                postMessage({
                    error: true,
                    errorMsg: msg.errorMsg
                })

                console.log(msg.errorMsg);
            }
        }
    });
}