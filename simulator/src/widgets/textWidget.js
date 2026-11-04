import { widget } from './widget.js';

/*

    "type": "text",
    "sensors": [ "engine.coolant-temp" ],
    "top": 230,
    "left": 130,
    "width": 20,
    "height": 20,
    "text": "${engine.coolant-temp}",
    "color": "#CCCCCC",
    "font": "400 48px DIN1451-36breit",
    "--bgcolor": "#FF0000",
    "--bgborder": "#11743a",
    "--bgborderwidth": 0,
    "--bgradius": 10,
    "halign": "right",
    "--valign": "middle"

*/

export class textWidget extends widget {

    constructor(jsonData, device) {
        super(jsonData);
        this._device = device;
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

        let txt = this.getParameterBasedOnRule("text", null);
        if (!txt) return;

        txt = textWidget.replaceSensorsValue(txt, sensors);

        const txtFont = this.getParameterBasedOnRule("font", null);
        const fontToUse = this._device.getConfiguration().getFont(txtFont);

        if (!fontToUse || !fontToUse.ready()) return;

        const bgColor = this.getParameterBasedOnRule("bgcolor", null);
        const bgBorder = this.getParameterBasedOnRule("bgborder", null);
        const bgBorderWidth = this.getParameterBasedOnRule("bgborderwidth", null);
        const bgRadius = this.getParameterBasedOnRule("bgradius", 0);

        const x = this.getParameterBasedOnRule("left", 0);
        const y = this.getParameterBasedOnRule("top", 0);
        const width = this.getParameterBasedOnRule("width", null);
        const height = this.getParameterBasedOnRule("height", null);

        //Draw background
        if (bgColor !== null || bgBorder !== null) display.drawRectangle(x, y, width, height, bgColor, bgBorder, bgBorderWidth, bgRadius);

        display.drawText(txt, x, y, width, height, txtFont, fontToUse, this.getParameterBasedOnRule("color", 0), this.getParameterBasedOnRule("halign", null), this.getParameterBasedOnRule("valign", null));
        
    }

    /*
        ${sensorname:formatdec:default}
    */
    static replaceSensorsValue(text, sensors) {

        const regex = /\$\{([^}]+)\}/g;

        let match;

        while ((match = regex.exec(text)) !== null) {
            
            const params = match[1].split("|");

            let sensorName = params[0];
            let format = null;
            let defaultValue = null;

            if (params.length > 1) format = params[1];
            if (params.length > 2) defaultValue = params[2];
            
            let sensorValueDisplayed = defaultValue ?? "";
            const sensorValue = sensors.getSensorData(sensorName);
            if (sensorValue) {
                sensorValueDisplayed = sensorValue.value;
                if (format && !Number.isNaN(sensorValueDisplayed)) {
                   sensorValueDisplayed = Number(sensorValueDisplayed).toFixed(Number(format));
                }
            }

            text = text.replace(match[0], sensorValueDisplayed);

        }

        return text;

    }

}