import {Renderer} from '../core/Renderer.js';
import {colorToCss,textStyle} from '../core/graphics.js';
export class CanvasRenderer extends Renderer {
  constructor(canvas){super(canvas.width,canvas.height);this.canvas=canvas;this.ctx=canvas.getContext('2d');if(!this.ctx)throw new Error('Canvas 2D unavailable');}
  beginFrame(){this.ctx.save();}
  endFrame(){this.ctx.restore();}
  clear(color){this.fillRect(0,0,this.width,this.height,color);}
  drawPixel(x,y,color){this.fillRect(Math.round(x),Math.round(y),1,1,color);}
  drawLine(x1,y1,x2,y2,color){const c=this.ctx;c.beginPath();c.strokeStyle=colorToCss(color);c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();}
  drawRect(x,y,w,h,color){this.ctx.strokeStyle=colorToCss(color);this.ctx.strokeRect(x,y,w,h);}
  fillRect(x,y,w,h,color){this.ctx.fillStyle=colorToCss(color);this.ctx.fillRect(x,y,w,h);}
  drawCircle(x,y,r,color){const c=this.ctx;c.beginPath();c.strokeStyle=colorToCss(color);c.arc(x,y,r,0,Math.PI*2);c.stroke();}
  fillCircle(x,y,r,color){const c=this.ctx;c.beginPath();c.fillStyle=colorToCss(color);c.arc(x,y,r,0,Math.PI*2);c.fill();}
  applyTextStyle(style){const s=textStyle(style);const c=this.ctx;c.font=`${s.size}px ${s.font}`;c.textAlign=s.align;c.textBaseline=s.baseline;c.fillStyle=colorToCss(s.color);}
  drawText(text,x,y,style={}){this.applyTextStyle(style);this.ctx.fillText(String(text),x,y);}
  measureText(text,style={}){this.applyTextStyle(style);const m=this.ctx.measureText(String(text));return {width:m.width,height:(m.actualBoundingBoxAscent||style.size||16)+(m.actualBoundingBoxDescent||0)};}
  drawImage(image,x,y,w,h){this.ctx.drawImage(image,x,y,w,h);}
}
