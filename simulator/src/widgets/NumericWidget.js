import {Widget} from './widget.js';
import {Color} from '../core/graphics.js';
export class NumericWidget extends Widget {
 draw(renderer,sensors){const c=this.config;const value=sensors.get(c.sensor);renderer.drawText(c.label||c.sensor,c.x,c.y,{size:13,color:0x91b3cc});renderer.drawText(value===undefined?'--':Number(value).toFixed(c.decimals??1),c.x,c.y+24,{size:c.fontSize||38,color:c.color??Color.WHITE});renderer.drawText(c.unit||'',c.x+115,c.y+43,{size:14,color:0x91b3cc});}
}
