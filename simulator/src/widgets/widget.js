/*
 
    { => MANDATORY
        'type': 'widgetname',
        'sensors: [ 'engine.coolant-temp', 'engine.oil-pressure' ],
        'top': 0,
        'left': 0,
        => OPTIONAL
        'interval: [0, 120]
        => WIDGET SPECIFIC
        'width': 10
        ....
    }

*/

export class widget {

    constructor(widgetData) {
        this._data = widgetData;
    }

    getSensorsUsed() { return this.getParameter("sensors", null); }

    render(display, sensors) {}

    getParameter(name, defaultValue) {
        if (!this._data) return defaultValue;
        return this._data[name] ?? defaultValue;
    }

    getPercentageValueInInterval(value) {

        const interval = this.getParameter("interval", null);

        if (!interval && interval.length != 2) return 0;

        const min = (interval[0] > interval[1]) ? interval[1] : interval[0]; 
        const max = (interval[0] > interval[1]) ? interval[0] : interval[1]; 

        if (value < min) return 0;
        if (value > max) return 1;

        return (value - min) / (max - min);

    }

}