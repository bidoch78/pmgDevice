import { widget } from './widget.js';

/*
 
    { => WIDGET SPECIFIC
      
    }

*/

export class imageWidget extends widget {

    constructor(widgetData, device) {
        super(widgetData);
        this._device = device;
        this._updateImgTag = null;
        this._updateImgBuffer = null; 
    }

    render(display, sensors) {

        /** GET SENSOR VALUE */
        let sValue = 0;
        let noSensor = false;
        const sensorName = this.getSensorsUsed();

        if (sensorName && sensorName.length) {
            const sensorValue = sensors.getSensorData(sensorName[0]);
            sValue = (sensorValue) ? sensorValue.value : 0;
            noSensor = !sensorValue;
        }

        this.resetRule();

        if (!noSensor) {
            const condRange = this.getParameter("cond-range", null);
            if (condRange) this.addRule("range", widget.getByRange(sValue, condRange));
        }
        
        // ------------------
        // ------------------
        
        const imgName = this.getParameterBasedOnRule("name", null);
        if (!imgName) return;

        const img = this._device.getConfiguration().getImage(imgName);
        
        if (!img || !img.complete) return;

        const zoom = this.getParameterBasedOnRule("zoom", 1);
        const x = this.getParameterBasedOnRule("left", 0);
        const y = this.getParameterBasedOnRule("top", 0);

        let colorIndex = this.getParameterBasedOnRule("_rangeindex", -1);
        if (noSensor) colorIndex = -2;

        if (colorIndex == -1) {
            display.drawImage(img, x, y, img.width * zoom, img.height * zoom);
            return;
        }

        const rgb = display.hexToRgb(this.getParameterBasedOnRule("color"));

        const imgTag = colorIndex;
        if (this._updateImgTag != imgTag && rgb) {

            //Update color
            const tmpCanvas = document.createElement("canvas");
            tmpCanvas.width = img.width;
            tmpCanvas.height = img.height;

            const tmpCtx = tmpCanvas.getContext("2d");
            tmpCtx.drawImage(img, 0, 0, img.width, img.height);            

            const imageData = tmpCtx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] > 0) {
                    data[i] = rgb.r;
                    data[i + 1] = rgb.g;
                    data[i + 2] = rgb.b;
                }
            }

            tmpCtx.putImageData(imageData, 0, 0);

            this._updateImgBuffer = tmpCanvas;
            this._updateImgTag = imgTag;

        }

        if (this._updateImgBuffer) display.drawImage(this._updateImgBuffer, x, y, img.width * zoom, img.height * zoom);

    }

}