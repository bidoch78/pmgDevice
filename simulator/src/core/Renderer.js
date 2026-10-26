export class Renderer {
  constructor(width,height){if(new.target===Renderer)throw new TypeError('Renderer is abstract');this.width=width;this.height=height;}
  beginFrame(){throw new Error('Not implemented');}
  endFrame(){throw new Error('Not implemented');}
  clear(color){throw new Error('Not implemented');}
  drawPixel(x,y,color){throw new Error('Not implemented');}
  drawLine(x1,y1,x2,y2,color){throw new Error('Not implemented');}
  drawRect(x,y,w,h,color){throw new Error('Not implemented');}
  fillRect(x,y,w,h,color){throw new Error('Not implemented');}
  drawCircle(x,y,r,color){throw new Error('Not implemented');}
  fillCircle(x,y,r,color){throw new Error('Not implemented');}
  drawText(text,x,y,style){throw new Error('Not implemented');}
  measureText(text,style){throw new Error('Not implemented');}
  drawImage(image,x,y,w,h){throw new Error('Not implemented');}
}
