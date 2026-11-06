import * as CryptoJS from '../../crypto-js@4.2.0+esm.js';

export class hubConnection {

    constructor(device, url) {

        this._device = device;

        this._url = url;
        
        this._ws = null;

        this._nonce = null;
        this._pairingCode = null;
        this._waitingPairing = false;

        this._pingInterval = 0;
        this._lastConn = 0;
        this._lastPong = 0;
        this._lastPing = 0;

        this.PING_INTERVAL = 5000;   // 5s
        this.PONG_TIMEOUT = 2000;    // 2s
        this.CONN_ATTEMPT_INTERVAL = 2000;

        this._identificationRequired = null;
        this.IDENTIFICATIONREQUIRED_INTERVAL = 4000; // 4s

    }

    disconnect(close = true) {

        if (!this._ws) return;

        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.close();
            return;
        }

        this._ws = null;
       
    }

    generateNonce() {
        const bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        return btoa(String.fromCharCode(...bytes))
                    .replace(/\+/g, "-")
                    .replace(/\//g, "_")
                    .replace(/=+$/, "");
    }

    pairingMode() { return this._waitingPairing; }
    getPairingCode() { return this._pairingCode; }
    
    getAuthMessage() {

        const token = this._device.getConfiguration().getToken();
        const dataAuth = { 'type': "device.connect", 'data': { 'mac': this._device.getConfiguration().getMac() } };
        
        this._pairingCode = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');

        dataAuth.data.pairingCode = this._pairingCode;

        if (token) {

            //Generate nonce
            dataAuth.data.nonce = this.generateNonce();
            //Generate signature
            dataAuth.data.signature = CryptoJS.default.HmacSHA256(dataAuth.data.nonce, token).toString(CryptoJS.default.enc.Hex);

        }

        return dataAuth;

    }

    connect() {

        if (this._ws) return;

        this._lastConn = Date.now();
        this._lastPong = 0;
        this._pingInterval = 0;
        this._lastPing = 0;

        const ws = new WebSocket(this._url);
        this._ws = ws;

        ws.onopen = () => {

            console.log("WebSocket connected");

            //Send auth
            ws.send(JSON.stringify(this.getAuthMessage()));

        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
            this._ws = null;
        };

        ws.onerror = (err) => {
            console.error("WebSocket error", err);
            this._ws = null;
        };

        ws.onmessage = (event) => {

            let msg;

            try {
                msg = JSON.parse(event.data);
            }
            catch {
                return;
            }

            switch (msg.type) {

                case "pong":
                    this._lastPong = Date.now();
                    break;

                case "device.authenticated":
                    this._waitingPairing = false;
                    if (msg.data.token) {
                        //save the token
                        this._device.getConfiguration().setToken(msg.data.token);
                    }
                    ws.send(JSON.stringify({ type: "sensors.read", data : this._device.getSensors().getSensorsUsed() }));
                    break;

                case "sensors.value":
                    this._device.getSensors().readSensors(msg.data);
                    break;

                case "pairing.pending":
                    this._waitingPairing = true;
                    break;

                case "pairing.rejected":
                    break;

                case "device.identify":
                    this._identificationRequired = Date.now();
                    break;

            }

        };

    }

    isIdentificationIsRequired() { return !!this._identificationRequired; }

    isConnected() {
        return this._ws && this._ws.readyState === WebSocket.OPEN;
    }

    process() {

        const execNow = Date.now();

        // Check zombie socket (Heartbeat)
        if (this._ws && this.isConnected()) {

            if (!this._lastPong && this._lastPing && (execNow - this._lastPing) > this.PONG_TIMEOUT) {
                console.log("Pong Timeout");
                this._ws.close();
            }
            
            if (!this._pingInterval) {
                this._pingInterval = execNow;
            } 
            else {
                if ((execNow - this._pingInterval) > this.PING_INTERVAL) {
                    this._pingInterval = execNow;
                    this._lastPing = execNow;
                    this._lastPong = 0;
                    this._ws.send(JSON.stringify({ type: "ping" }));
                }
            }

        }

        if (!this._ws) {
            if ((execNow - this._lastConn) > this.CONN_ATTEMPT_INTERVAL) this.connect();
        }

        if (this._identificationRequired && (execNow - this._identificationRequired) > this.IDENTIFICATIONREQUIRED_INTERVAL) this._identificationRequired = null;

    }


}