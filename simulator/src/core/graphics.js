export const Color = Object.freeze({BLACK:0x000000, WHITE:0xffffff, RED:0xff4040, BLUE:0x42b8ff});
export function colorToCss(color){return `#${(color>>>0).toString(16).padStart(6,'0').slice(-6)}`;}
export function rect(x,y,width,height){return {x,y,width,height};}
export function textStyle({color=Color.WHITE,size=16,font='sans-serif',align='left',baseline='top'}={}){return {color,size,font,align,baseline};}
