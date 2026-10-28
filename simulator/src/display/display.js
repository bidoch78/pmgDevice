import { widget } from "../widgets/widget.js";

export class display {

    constructor(device) {

        this.device = device;
        this.widgets = [];
        
    }

    useTemplate(templateFile) {

    }

    initDisplay() {

    }

    getScreenInfo() {
        return {
            'width': 0,
            'heigth': 0,
            'round': false
        };
    }

    clearDisplay(color) { }

    /* drawing primitive */
    drawArc(x, y, radius, start, end, width, linecap, fillcolor, bordercolor, borderwidth) {}
    drawRectangle(x, y, width, height, fillcolor, bordercolor, borderwidth, radius) {}
    drawCircle(x, y, radius, fillcolor, bordercolor, borderwidth) {}
    drawLine(x1, y1, x2, y2 ,color, width, linecap) {}

    /* text functions */
    measureText(font, text) { return { 'width': 0, 'height': 0 }; }
    drawText(text, x, y, width, height, font, color, hAlign, vAlign) {}

}