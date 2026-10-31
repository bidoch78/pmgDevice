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

        let start = ((this.getParameter("start", 0)) * Math.PI / 180) - (Math.PI / 2);
        let end = ((this.getParameter("end", 180)) * Math.PI / 180) - (Math.PI / 2);
        const sweep = end - start;
        
        const cx = this.getParameter("left", 0);
        const cy = this.getParameter("top", 0);
        const radius = this.getParameter("radius", 50);
        const linecap = this.getParameter("linecap", "round");
        const thickness = this.getParameter("thickness", 5);

        //draw background
        display.drawArc(cx, cy, radius, start, end, thickness, linecap, this.getParameter("bgcolor", "#252525"), this.getParameter("bordercolor"), this.getParameter("borderwidth"));

        //draw sensor pos
        const sensorName = this.getSensorsUsed();
        if (sensorName && sensorName.length) {

            const sensorValue = sensors.getSensorData(sensorName[0]);
            let sValue = (sensorValue) ? sensorValue.value : 0;

            const pct = this.getPercentageValueInInterval(sValue);

            if (this.getParameter("reverse", false)) {
                display.drawArc(cx, cy, radius, end - (sweep * pct), end, thickness, linecap, this.getParameter("color", "#FFFFFF"));
            }
            else {
                display.drawArc(cx, cy, radius, start, start + sweep * pct, thickness, linecap, this.getParameter("color", "#FFFFFF"));
            }

        }

    }

}