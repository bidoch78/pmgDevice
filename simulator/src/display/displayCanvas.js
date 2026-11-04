import { display, verticalAlign, horizontalAlign } from "./display.js";

export class displayCanvas extends display {

    constructor(device, deviceInfo) {
        super(device);
        this._deviceInfo = deviceInfo;
        this._canvas = null;
    }

    getScreenInfo() { return this._deviceInfo; }

    setCanvas(div) {

        const scr = this.getScreenInfo();
        this._canvas = div;
        this._canvas.width = scr.width;
        this._canvas.height = scr.height;

        this._ctx = this._canvas.getContext('2d');

        /* here simple buffer */
        this._bufCanvas = document.createElement("canvas");
        this._bufCanvas.width = this._canvas.width;
        this._bufCanvas.height = this._canvas.height;
        
        this._ctxBufCanvas = this._bufCanvas.getContext('2d');   

    }

    beginFrame() { 

        if (!this._ctxBufCanvas) return;

    }

    endFrame() { 

        const scrInfo = this.getScreenInfo();

        //Apply the brightness (simulator only)
        const alpha = 1 - (this.getBrightness() / 100);
        
        this._ctxBufCanvas.fillStyle = `rgba(0,0,0,${alpha})`;
        this._ctxBufCanvas.fillRect(0, 0, scrInfo.width, scrInfo.height);

        //Copy the buffer
        if (scrInfo.round) {

            const d = scrInfo.width / 2;

            this._ctx.save();
            this._ctx.beginPath();
            this._ctx.arc(d, d, d, 0, Math.PI * 2);
            this._ctx.clip();

        }

        this._ctx.drawImage(this._bufCanvas, 0, 0);

        if (scrInfo.round) this._ctx.restore();

    }

    clearDisplay(color) {
        
        if (!this._bufCanvas) return;

        const scrInfo = this.getScreenInfo();

        this._ctxBufCanvas.fillStyle = color;
        this._ctxBufCanvas.fillRect(0, 0, scrInfo.width, scrInfo.height);

    }

    drawArc(x, y, radius, start, end, width, linecap, fillcolor, bordercolor, borderwidth) {

        if (!this._ctxBufCanvas) return;

        if (borderwidth) {
        
            this._ctxBufCanvas.beginPath();
            this._ctxBufCanvas.lineCap = linecap;
            this._ctxBufCanvas.lineWidth = width + (borderwidth * 2);
            this._ctxBufCanvas.strokeStyle = bordercolor;
            this._ctxBufCanvas.arc(x, y, radius, start, end, false);
            this._ctxBufCanvas.stroke();

        }

        this._ctxBufCanvas.beginPath();
        this._ctxBufCanvas.lineCap = linecap;
        this._ctxBufCanvas.lineWidth = width;
        this._ctxBufCanvas.strokeStyle = fillcolor;
        this._ctxBufCanvas.arc(x, y, radius, start, end, false);
        this._ctxBufCanvas.stroke();

    }

    drawImage(image, x, y, width, height) { 

        if (!image || !this._ctxBufCanvas) return;

        if (width == null || height == null)
            this._ctxBufCanvas.drawImage(image, x, y);
        else
            this._ctxBufCanvas.drawImage(image, x, y, width, height);

    }

    drawRectangle(x, y, width, height, fillcolor, bordercolor, borderwidth, radius) {

        if (!this._ctxBufCanvas) return;

        this._ctxBufCanvas.beginPath();

        if (radius) {
            this._ctxBufCanvas.roundRect(x, y, width, height, radius);
        } else {
            this._ctxBufCanvas.rect(x, y, width, height);
        }

        if (fillcolor) {
            this._ctxBufCanvas.fillStyle = fillcolor;
            this._ctxBufCanvas.fill();
        }

        if (bordercolor && borderwidth > 0) {
            this._ctxBufCanvas.strokeStyle = bordercolor;
            this._ctxBufCanvas.lineWidth = borderwidth;
            this._ctxBufCanvas.stroke();
        }

    }

    measureText(font, fontfamily, text) { 
        return { 'width': 0, 'height': 0 }; 
    }

    drawText(text, x, y, width, height, font, fontfamily, color, hAlign, vAlign) {

        if (!this._ctxBufCanvas) return;

        this._ctxBufCanvas.textAlign = 'left';
        this._ctxBufCanvas.textBaseline = 'top';
        this._ctxBufCanvas.font = font;
        this._ctxBufCanvas.fillStyle = color;
        
        x += fontfamily.getHorizontalOffset();
        y += fontfamily.getVerticalOffset();

        if ((width && hAlign) || (height && vAlign)) {

            const textMeasure = this._ctxBufCanvas.measureText(text);

            if (width && hAlign) {

                if (hAlign === horizontalAlign.CENTER) {
                    x += (width - textMeasure.width) / 2;
                }
                else if (hAlign === horizontalAlign.RIGHT) {
                    x -= fontfamily.getHorizontalOffset();
                    x += width - textMeasure.width;
                }

            }

            if (height && vAlign) {

                const textTop = textMeasure.actualBoundingBoxAscent;
                const textBottom = textMeasure.actualBoundingBoxDescent;

                const textHeight = textBottom - textTop;

                if (vAlign === verticalAlign.MIDDLE) {
                    y += height / 2 - (textTop + textBottom) / 2;
                }
                else if (vAlign === verticalAlign.BOTTOM) {
                    y -= fontfamily.getVerticalOffset();
                    y += height - textHeight - textTop;
                }

            }

        }
     
        this._ctxBufCanvas.fillText(text, x, y);

    }
  
}