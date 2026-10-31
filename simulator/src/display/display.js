import { widget } from "../widgets/widget.js";

export class display {

    constructor(device) {

        this._device = device;
        this._brightness = -1;
        
    }

    initialize() {

    }

    getScreenInfo() {
        return {
            'width': 0,
            'heigth': 0,
            'round': false
        };
    }

    getBrightness() { return this._brightness == -1 ? 0: this._brightness; }
    setBrightness(brightness) {   

        if (this._brightness != brightness) {
            this._brightness = brightness;
            return true;
        }

        return false;

    };

    beginFrame() { }
    endFrame() { }

    clearDisplay(color) { }

    hexToRgb(hex) {
        hex = hex.replace('#', '');
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }

    /* drawing primitive */
    drawArc(x, y, radius, start, end, width, linecap, fillcolor, bordercolor, borderwidth) {}
    drawRectangle(x, y, width, height, fillcolor, bordercolor, borderwidth, radius) {}
    drawCircle(x, y, radius, fillcolor, bordercolor, borderwidth) {}
    drawLine(x1, y1, x2, y2 ,color, width, linecap) {}
    drawImage(image, x, y, width, height) { }

    /* text functions */
    measureText(font, text) { return { 'width': 0, 'height': 0 }; }
    drawText(text, x, y, width, height, font, color, hAlign, vAlign) {}

}