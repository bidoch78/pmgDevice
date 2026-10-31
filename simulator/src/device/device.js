import { hubConnection } from './hubConnection.js';
import { sensors } from './sensors.js';
import { configuration } from './configuration.js';
import { display } from '../display/display.js';
import { widgetFactory } from '../widgets/widgetFactory.js';

export class device {

    constructor() {
        this._widgets = [];
    }

    destroy() {
        
    }

    initialize() {

        if (this._configuration) {
            //Initialize widgets
            this._configuration.initialize();
            this.useTemplate(this._configuration.getTemplate());
            if (this._sensors) this._sensors.initializeSensorsToRead();
        }

        if (this._display) this._display.initialize();

    }

    useTemplate(templateData) {

        if (templateData && templateData.widgets) {

            for(const w of templateData.widgets) {

                const widgetObject = widgetFactory.create(w, this);
                if (widgetObject) this._widgets.push(widgetObject);

            }

        }

    }

    process() {

        if (this._connection) this._connection.process();

        //Render
        if (this._display) {
            
            let sValue = 0;

            const brightnessValue = this._sensors.getSensorData("env.daynight");
            sValue = 100; // default
            if (brightnessValue) sValue = brightnessValue.value * 100;
            if (sValue < 100) sValue = 50;
            
            this._display.setBrightness(sValue);

            this._display.beginFrame();
            this._display.clearDisplay("#000");

            // Draw widget
            for(const w of this._widgets) w.render(this._display, this._sensors);

            this._display.endFrame();

        }

    }

    setSensors(sensors) { this._sensors = sensors; }
    getSensors() { return this._sensors; }

    setConnection(conn) { this._connection = conn; }
    getConnection() { return this._connection; }

    setConfiguration(config) { this._configuration = config; }
    getConfiguration() { return this._configuration; }

    setDisplay(display) { this._display = display; }
    getDisplay() { return this._display; }

}