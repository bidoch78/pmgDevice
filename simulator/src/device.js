import { hubConnection } from './hubConnection.js';
import { sensors } from './sensors.js';
import { configuration } from './configuration.js';
import { displayCanvas } from './display/displayCanvas.js';

export class device {

    constructor() {
    }

    destroy() {
        
    }

    process() {

        if (this.connection) this.connection.process();

    }

    setSensors(sensors) { this.sensors = sensors; }
    getSensors() { return this.sensors; }

    setConnection(conn) { this.connection = conn; }
    getConnection() { return this.connection; }

    setConfiguration(config) { this.configuration = config; }
    getConfiguration() { return this.configuration; }

    setDisplay(display) { this.displayCanvas = display; }
    getDisplay() { return this.displayCanvas; }

}