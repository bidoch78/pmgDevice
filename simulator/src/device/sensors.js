export class sensors {

    constructor(device) {

        this._device = device;
        this._sensors = new Map();

    }

    initializeSensorsToRead() {
        this._sensors = new Map();
        //Default
        this._sensors.set("env.daynight", { 'hasChanged': false, 'data': null });
        //Add sensors from template
        const sensorsU = this._device.getConfiguration().extractSensorsFromTemplate();
        if (sensorsU) {
            for(const sensor of sensorsU) {
                this._sensors.set(sensor, { 'hasChanged': false, 'data': null } );
            }
        }
        console.log(this.getSensorsUsed());
    }

    readSensors(sensorValues) {

        for (const [id, data] of Object.entries(sensorValues)) {
            if (!this._sensors.has(id)) continue;
            const currentData = this._sensors.get(id);
            if (currentData && (!currentData.data || currentData.data.value != data.value)) {
                currentData.data = data;
                currentData.hasChanged = true;
            }
        }

    }

    getSensorData(sensor) {
        return this._sensors.has(sensor) ? this._sensors.get(sensor).data : null; 
    }

    getSensorsUsed() {
        return [...this._sensors.keys()];
    }

}