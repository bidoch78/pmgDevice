import {NumericWidget} from '../widgets/NumericWidget.js';
import {BarWidget} from '../widgets/BarWidget.js';
const TYPES={numeric:NumericWidget,bar:BarWidget};
export class Screen {
 constructor(config){this.config=config;this.widgets=config.widgets.map(w=>{const Type=TYPES[w.type];if(!Type)throw new Error(`Unknown widget: ${w.type}`);return new Type(w);});}
 draw(renderer,sensors){renderer.beginFrame();try{renderer.clear(this.config.background??0x101820);for(const widget of this.widgets)widget.draw(renderer,sensors);}finally{renderer.endFrame();}}
}
