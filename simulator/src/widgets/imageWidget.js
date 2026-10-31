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

        const imgName = this.getParameter("name", null);
        if (!imgName) return;

        const img = this._device.getConfiguration().getImage(imgName);
        
        if (!img || !img.complete) return;

        const colorByRange = this.getParameter("rangecolor");
        const dispOnlyImg = !colorByRange;

        const x = this.getParameter("left", 0);
        const y = this.getParameter("top", 0);

        if (dispOnlyImg) {
            display.drawImage(img, x, y);
            return;
        }

        const sensorName = this.getSensorsUsed();
        let sValue = null;
        if (sensorName && sensorName.length) {
            const sensorValue = sensors.getSensorData(sensorName[0]);
            sValue = (sensorValue) ? sensorValue.value : 0;
        }

        /* rangecolor */
        let rgb = null;
        let colorIndex = -1;

        for (let i = 0; i < colorByRange.length; i++) {

            var colorByR = colorByRange[i];
            if (colorByR.from === null) {
                if (sValue < colorByR.to) {
                    colorIndex = i;
                    rgb = display.hexToRgb(colorByR.color);
                    break;
                }
            }
            else if (colorByR.to === null) {
                if (sValue >= colorByR.from) {
                    rgb = display.hexToRgb(colorByR.color);
                    colorIndex = i;
                    break;
                }
            }
            else {
                if (sValue >= colorByR.from && sValue < colorByR.to) {
                    rgb = display.hexToRgb(colorByR.color);
                    colorIndex = i;
                    break;
                }
            }



        }

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

        if (this._updateImgBuffer) display.drawImage(this._updateImgBuffer, x, y);

    }

}