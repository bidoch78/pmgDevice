import {Widget} from './Widget.js';
export class BarWidget extends Widget {
 draw(renderer,sensors){const c=this.config;const value=sensors.get(c.sensor);const v=Number(value??c.min??0);const fraction=Math.max(0,Math.min(1,(v-c.min)/(c.max-c.min||1)));renderer.drawText(c.label||c.sensor,c.x,c.y,{size:13,color:0x91b3cc});renderer.fillRect(c.x,c.y+25,c.width,c.height,0x2a3c50);renderer.fillRect(c.x,c.y+25,c.width*fraction,c.height,v>=(c.warning??Infinity)?0xff665e:(c.color??0x45b8ff));}
}