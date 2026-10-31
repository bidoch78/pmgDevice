import { display } from "./display.js";

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
  
}