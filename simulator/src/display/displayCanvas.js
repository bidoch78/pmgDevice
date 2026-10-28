import { display } from "./display.js";

export class displayCanvas extends display {

    constructor(device, deviceInfo) {
        super(device);
        this.deviceInfo = deviceInfo;
        this.canvas = null;
        this.ctx = null;
    }

    setCanvas(div) {
        this.canvas = div;
    }

    getScreenInfo() {
        return this.deviceInfo.display;
    }

    initDisplay() {

        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d')
        this.clearDisplay('#0');

    }

    clearDisplay(color) {
        
        if (!this.ctx) return;

        this.ctx.fillStyle = '#1b2532';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!(this.deviceInfo && this.deviceInfo.display)) return;

        //Initialize the canvas
        this.canvas.width = this.deviceInfo.display.width;
        this.canvas.height = this.deviceInfo.display.height;
        
        if (this.deviceInfo.display.round) {

            const d = this.deviceInfo.display.width / 2;

            this.ctx.beginPath();
            this.ctx.arc(d, d, d, 0, Math.PI * 2); // x, y, rayon, début, fin
            this.ctx.fillStyle = color;
            this.ctx.fill();

        }
        else {

            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        }

    }

    drawArc(x, y, radius, start, end, width, linecap, fillcolor, bordercolor, borderwidth) {

        if (!this.ctx) return;

        if (borderwidth) {
        
            this.ctx.beginPath();
            this.ctx.lineCap = linecap;
            this.ctx.lineWidth = width + (borderwidth * 2);
            this.ctx.strokeStyle = bordercolor;
            this.ctx.arc(x, y, radius, start, end, false);
            this.ctx.stroke();

        }

        this.ctx.beginPath();
        this.ctx.lineCap = linecap;
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = fillcolor;
        this.ctx.arc(x, y, radius, start, end, false);
        this.ctx.stroke();

    }
  
}