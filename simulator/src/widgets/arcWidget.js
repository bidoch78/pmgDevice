import { widget } from './widget.js';

/*
 
    { => WIDGET SPECIFIC
        'thickness': 25
        'radius': 200
        'start': (in degrees) => 0° is at 0AM / 180° is at 6AM
        'end': (in degrees)
        'linecap': round or flat
        'bgcolor': 
        'color':
        'bordercolor':
        'borderwidth':
        'reverse':
    }

*/

export class arcWidget extends widget {

    constructor(widgetData) {
        super(widgetData);
    }

    render(display, sensors) {
        
        /** GET SENSOR VALUE */
        let sValue = 0;
        const sensorName = this.getSensorsUsed();
        if (sensorName && sensorName.length) {
            const sensorValue = sensors.getSensorData(sensorName[0]);
            sValue = (sensorValue) ? sensorValue.value : 0;
        }

        this.resetRule();
        const condRange = this.getParameter("cond-range", null);
        if (condRange) this.addRule("range", widget.getByRange(sValue, condRange));

        // ------------------
        // ------------------

        let start = ((this.getParameterBasedOnRule("start", 0)) * Math.PI / 180) - (Math.PI / 2);
        let end = ((this.getParameterBasedOnRule("end", 180)) * Math.PI / 180) - (Math.PI / 2);
        const sweep = end - start;
    
        const cx = this.getParameterBasedOnRule("left", 0);
        const cy = this.getParameterBasedOnRule("top", 0);
        const radius = this.getParameterBasedOnRule("radius", 50);
        const linecap = this.getParameterBasedOnRule("linecap", "round");
        const thickness = this.getParameterBasedOnRule("thickness", 5);

        let color = this.getParameterBasedOnRule("color", "#FFFFFF");
        let bgColor = this.getParameterBasedOnRule("bgcolor", "#252525");
        let borderColor = this.getParameterBasedOnRule("bordercolor");
        let borderWidth = this.getParameterBasedOnRule("borderwidth");

        //draw background
        display.drawArc(cx, cy, radius, start, end, thickness, linecap, bgColor, borderColor, borderWidth);

        const pct = this.getPercentageValueInInterval(sValue);

        if (this.getParameter("reverse", false)) {
            display.drawArc(cx, cy, radius, end - (sweep * pct), end, thickness, linecap, color);
        }
        else {
            display.drawArc(cx, cy, radius, start, start + sweep * pct, thickness, linecap, color);
        }

    }

}