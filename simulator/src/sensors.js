export class sensors {

    constructor(device) {

        this._device = device;
        this._sensors = new Map();

    }

    readSensors(sensorValues) {

        for (const [id, data] of  Object.entries(sensorValues)) {
            const currentData = this._sensors.get(id);
            if (currentData) {
                if (currentData.data.value != data.value) {
                    currentData.data = data;
                    currentData.hasChanged = true;
                }
            }
            else {
                this._sensors.set(id, { 'hasChanged': true, 'data': data } );
            }
        }

    }

    getSensorData(sensor) {
        return this._sensors.has(sensor) ? this._sensors.get(sensor).data : null; 
    }

    getSensorsUsed() {
        return [ 'engine.coolant-temp' ];
        return [ 'engine.coolant-temp', 'engine.airpressure' ];
    }

}