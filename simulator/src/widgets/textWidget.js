import { widget } from './widget.js';

export class textWidget extends widget {

    constructor(jsonData, device) {
        super(jsonData);
        this._device = device;
    }

    render(display, sensors) {

        const txt = this.getParameter("text", null);
        if (!txt) return;

        const txtFont = this.getParameter("font", null);
        const fontToUse = this._device.getConfiguration().getFont(txtFont);

        if (!fontToUse || !fontToUse.ready()) return;

        const bgColor = this.getParameter("bgcolor", null);
        const bgBorder = this.getParameter("bgborder", null);
        const bgBorderWidth = this.getParameter("bgborderwidth", null);
        const bgRadius = this.getParameter("bgradius", 0);

        const x = this.getParameter("left", 0);
        const y = this.getParameter("top", 0);
        const width = this.getParameter("width", null);
        const height = this.getParameter("height", null);

        //Draw background
        if (bgColor !== null && bgBorder !== null) display.drawRectangle(x, y, width, height, bgColor, bgBorder, bgBorderWidth, bgRadius);

        display.drawText(txt, x, y, width, height, txtFont, fontToUse, this.getParameter("color", 0), this.getParameter("halign", null), this.getParameter("valign", null));
        
    }

}