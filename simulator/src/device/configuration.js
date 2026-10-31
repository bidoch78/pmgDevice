export class configuration {

    constructor(device) {

        this._device = device;

    }

    initialize() {
        this._currentTemplate = this.getTemplate();
    }

    getTemplate() { }

    extractSensorsFromTemplate() {

        let sensors = [];

        if (this._currentTemplate && this._currentTemplate.widgets) {

            for(const widget of this._currentTemplate.widgets) {
                
                //merge and remove existing key
                if (widget.sensors) sensors = [...new Set([...sensors, ...widget.sensors])];
                    
            }

        }

        return sensors;

    }

    getImage(name) { }

}