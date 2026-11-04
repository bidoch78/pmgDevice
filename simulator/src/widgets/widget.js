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
        this._rule = null;
    }

    getSensorsUsed() { return this.getParameter("sensors", null); }

    render(display, sensors) {}

    resetRule() { this._rule = null; }

    addRule(name, data) {
        this._rule = { 'name': name, 'data': data };
    }

    getRule() { return this._rule; }

    getParameterBasedOnRule(name, defaultValue) {
        
        if (!this._rule) return this.getParameter(name, defaultValue);

        if (this._rule.name == "range") {

            const rgData = this._rule.data.rangeitem;

            if (name == "_rangeindex") return (this._rule && this._rule.data) ? this._rule.data.index : -1;

            if (rgData[name] !== null && rgData[name] !== undefined) return rgData[name];

            return this.getParameter(name, defaultValue);

        }

        return defaultValue;

    }

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

    static getByRange(value, range) {

        if (!range) return { "index": -1, "rangeitem": null };

        for (let i = 0; i < range.length; i++) {

            var rangeItem = range[i];
            if (rangeItem.from === null) {
                if (value < rangeItem.to) {
                    return { "index": i, "rangeitem": rangeItem };
                }
            }
            else if (rangeItem.to === null) {
                if (value >= rangeItem.from) {
                    return { "index": i, "rangeitem": rangeItem };
                }
            }
            else {
                if (value >= rangeItem.from && value < rangeItem.to) {
                    return { "index": i, "rangeitem": rangeItem };
                }
            }

        }

        return { "index": -1, "rangeitem": null };

    }

}