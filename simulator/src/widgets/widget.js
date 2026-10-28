/*
 
    { => MANDATORY
        'name': 'widgetname',
        'sensors: [ 'engine.coolant-temp', 'engine.oil-pressure' ],
        'top': 0,
        'left': 0,
        => WIDGET SPECIFIC
        'width': 10
        ....
    }

*/

export class widget {

    constructor(jsonData) {
        this.data = jsonData;
    }

    getSensorsUsed() { return null; }
    draw(display) {}
    isDirty() {}

}