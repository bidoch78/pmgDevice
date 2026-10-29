import { display } from "./display.js";

export class displayCanvas extends display {

    constructor(device, deviceInfo) {
        super(device);
        this._deviceInfo = deviceInfo;
        this._canvas = null;
        this._ctx = null;
    }

    setCanvas(div) {
        this._canvas = div;
    }

    getScreenInfo() {
        return this._deviceInfo.display;
    }

    initDisplay() {

        if (!this._canvas) return;

        this._ctx = this._canvas.getContext('2d')
        this.clearDisplay('#0');

    }

    clearDisplay(color) {
        
        if (!this._ctx) return;

        this._ctx.fillStyle = '#1b2532';
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        if (!(this._deviceInfo && this._deviceInfo.display)) return;

        //Initialize the canvas
        this._canvas.width = this._deviceInfo.display.width;
        this._canvas.height = this._deviceInfo.display.height;
        
        if (this._deviceInfo.display.round) {

            const d = this._deviceInfo.display.width / 2;

            this._ctx.beginPath();
            this._ctx.arc(d, d, d, 0, Math.PI * 2); // x, y, rayon, début, fin
            this._ctx.fillStyle = color;
            this._ctx.fill();

        }
        else {

            this._ctx.fillStyle = color;
            this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        }

    }

    drawArc(x, y, radius, start, end, width, linecap, fillcolor, bordercolor, borderwidth) {

        if (!this._ctx) return;

        if (borderwidth) {
        
            this._ctx.beginPath();
            this._ctx.lineCap = linecap;
            this._ctx.lineWidth = width + (borderwidth * 2);
            this._ctx.strokeStyle = bordercolor;
            this._ctx.arc(x, y, radius, start, end, false);
            this._ctx.stroke();

        }

        this._ctx.beginPath();
        this._ctx.lineCap = linecap;
        this._ctx.lineWidth = width;
        this._ctx.strokeStyle = fillcolor;
        this._ctx.arc(x, y, radius, start, end, false);
        this._ctx.stroke();

    }
  
}