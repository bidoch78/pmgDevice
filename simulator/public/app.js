import { device } from '../src/device.js';
import { displayCanvas } from '../src/display/displayCanvas.js';

let _device = null;

const el=id=>document.getElementById(id);

async function api(url, method='GET', data) {
    
    const response=await fetch(url, {
        method,
        headers: { 'Content-Type':'application/json' },
        body:
        data === undefined ? undefined : JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) throw Error(result.error || 'API error');
    return result;

}

// // import {CanvasRenderer} from '../src/renderers/CanvasRenderer.js';
// // import {Screen} from '../src/display/Screen.js';

// const canvas=document.querySelector('#display');
// //const renderer=new CanvasRenderer(canvas);
// const ctx=canvas.getContext('2d')

//     ctx.beginPath();
//     ctx.arc(240, 240, 240, 0, Math.PI * 2); // x, y, rayon, début, fin
//     ctx.fillStyle = '#0';
//     ctx.fill();


// function drawArc(ctx, cx, cy, r, start, end, color, width, linecap = "round") {
//     ctx.beginPath();
//     ctx.lineCap = linecap;
//     ctx.lineWidth = width;
//     ctx.strokeStyle = color;
//     ctx.arc(cx, cy, r, start, end, false);
//     ctx.stroke();
// }

// function drawTemp(temp) {

//     const minTemp = 50;
//     const maxTemp = 120;

//     let start = Math.PI * (1-0.3);
//     let end = Math.PI * (1+0.3);
//     let sweep = end - start;
//     const cx = 240;
//     const cy = 240;

//     drawArc(ctx, cx, cy, 210, start, end, "#252525", 25);
//     let fillUntil = (temp < minTemp) ? minTemp : temp;
//     if (temp > maxTemp) fillUntil = maxTemp;
//     drawArc(ctx, cx, cy, 210, start, start + sweep * ((fillUntil - minTemp) / (maxTemp - minTemp)), "#e4cd36", 25);

//     const img = new Image();
//     img.src = "logo-water-temp.png";

//     img.onload = () => {

//         const size = 70;

//         ctx.save();

//         //Reset previous logo
//         ctx.fillStyle = '#0';
//         ctx.fillRect((480-size)/2, (480-size - 20), size, size);

//         const tmpCanvas = document.createElement("canvas");
//         tmpCanvas.width = size;
//         tmpCanvas.height = size;

//         const tmpCtx = tmpCanvas.getContext("2d");

//         tmpCtx.drawImage(img, 0, 0, size, size);

//         const imageData = tmpCtx.getImageData(0, 0, size, size);

//         const data = imageData.data;

//         let r = 0;
//         let g = 0;
//         let b = 0;

//         if (temp < 75) { b = 255; }
//         else if (temp > 105) { r = 200; }
//         else if (temp > 95) { r = 255; g = 191;  }
//         else { r = 0; g = 210; b = 88; }

//         for (let i = 0; i < data.length; i += 4) {
//             if (data[i + 3] > 0) {
//                 data[i] = r;
//                 data[i + 1] = g;
//                 data[i + 2] = b;
//             }
//         }

//         tmpCtx.putImageData(imageData, 0, 0);

//         ctx.drawImage(tmpCanvas, (480-size)/2, 480 - size - 20);

//         ctx.restore();

//     };

//     ctx.save();
//     ctx.fillStyle = '#0';
//     ctx.fillRect(65, 260-44, 100, 95);
    
//     ctx.font = "900 48px Dashboard";
//     ctx.fillStyle = "white";
//     ctx.fillText(temp, 70, 260);

//     const widthTemp = ctx.measureText(temp).width;

//     ctx.font = "400 32px Dashboard";
//     const widthCelsius = ctx.measureText("°C").width;
//     let posCelsius = (widthTemp - widthCelsius < 0) ? 0 : widthTemp - widthCelsius;
//     ctx.fillText("°C", 70 + posCelsius, 300);

//     ctx.restore();

// }

// // start = Math.PI * -0.3;
// // end = Math.PI * 0.3;

// // drawArc(ctx, cx, cy, 210, start, end, "#252525", 25);

// //             drawArc(ctx,
// //                 cx,
// //                 cy,
// //                 210,
// //                 start + sweep * (1-0.8) ,
// //                 end,
// //                 "#5c36e4",
// //                 25
// //             );



// // const tempValue = "20";
// // const pressureValue = "32.4"

// // ctx.font = "48px Arial";
// // ctx.fillStyle = "white";
// // ctx.fillText(tempValue, 70, 260);
// // const widthTemp = ctx.measureText(tempValue).width;

// // ctx.fillText(pressureValue, 320, 260);
// // const widthPressure = ctx.measureText(pressureValue).width;

// // ctx.font = "32px Arial";
// // const widthCelsius = ctx.measureText("°C").width;
// // ctx.fillText("°C", 70 + widthTemp - widthCelsius, 300);

// // const widthPSI = ctx.measureText("PSI").width;
// // ctx.fillText("PSI", 320, 300);

// const slider = document.getElementById("temp");

// slider.addEventListener("input", () => {
//     tempValue.textContent = slider.value;
//     drawTemp(slider.value);
// });

// document.fonts.load("700 60px Dashboard").then(() => {
//     drawTemp(slider.value);
// });

// // const values=new Map([['oil_pressure',3.2],['coolant_temp',87]]);

// // const sensors={get:id=>values.get(id)};

// // let screen;

// // async function api(url,method='GET',data) {
    
// //     const response=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw Error(result.error||'API error');return result;

// // }

// // async function load() {
    
// //     //const config=await api('/api/template');
    
// //     canvas.width=config.width;canvas.height=config.height;renderer.width=config.width;renderer.height=config.height;
// //     screen=new Screen(config);el('templateInfo').value=JSON.stringify(config,null,2);
// //     render();

// // }

// // function render() { screen?.draw(renderer,sensors); }

// // async function loadSettings(){
    
// //     //const s=await api('/api/settings');
    
// //     el('mac').value=s.mac;el('hubUrl').value=s.hubUrl;el('autoConnect').checked=s.autoConnect;el('tokenStatus').textContent=s.hasToken?'Token enregistré':'Aucun token';el('status').textContent=s.connectionState;}

// // async function run(action){
    
// //     try{await action();el('error').textContent='';}catch(e){el('error').textContent=e.message;}

// // }

el('readSettings').addEventListener("click", async () => {

    const deviceInfo = await api('/api/getdevicedata', 'PUT', { 'mac': el('mac').value } );

    if (deviceInfo.find) {

        el('error').textContent = "Device found. Load data and start device";
        if (_device) _device.destroy();
        _device = new device();
        _device.setDisplay(new displayCanvas(_device, deviceInfo));
        _device.getDisplay().setCanvas(el('display'));
        _device.getDisplay().initDisplay();

        let start = Math.PI * (1-0.3);
        let end = Math.PI * (1+0.3);
        let sweep = end - start;
        const cx = 240;
        const cy = 240;

        _device.getDisplay().drawArc(cx, cy, 210, start, end, 25, 'round', '#252525');
        _device.getDisplay().drawArc(cx, cy, 210, start, start + sweep * 0.5, 25, 'round', "#e4cd36");

    }
    else {
        el('error').textContent = "Device not found. Please enter the details and save them";
    }

});

el('saveSettings').addEventListener("click", async () => {

});

// // el('saveSettings').onclick=()=>run(async()=>{
    
// //     await api('/api/settings','PUT',{mac:el('mac').value,hubUrl:el('hubUrl').value,autoConnect:el('autoConnect').checked});await loadSettings();});

// // el('saveToken').onclick=()=>run(async()=>{await api('/api/token','PUT',{token:el('token').value});el('token').value='';await loadSettings();});
// // el('clearToken').onclick=()=>run(async()=>{await api('/api/token','DELETE');await loadSettings();});
// // el('connect').onclick=()=>run(async()=>{await api('/api/connect','POST');await loadSettings();});
// // el('disconnect').onclick=()=>run(async()=>{await api('/api/disconnect','POST');await loadSettings();});
// // el('saveTemplate').onclick=()=>run(async()=>{await api('/api/template','PUT',JSON.parse(el('templateInfo').value));await load();});
// // el('reload').onclick=()=>run(load);

// // for(const [inputId,sensorId,outputId] of [['oil','oil_pressure','oilValue'],['temp','coolant_temp','tempValue']])el(inputId).addEventListener('input',e=>{const value=Number(e.target.value);api('/api/sensor','POST',{id:sensorId,value}).catch(console.error);values.set(sensorId,value);el(outputId).textContent=value;render();});
// // //const stream=new EventSource('/api/events');

// // stream.onmessage=e=>{const {type,data}=JSON.parse(e.data);if(type==='snapshot'){for(const [id,value] of Object.entries(data.sensors))values.set(id,value);el('status').textContent=data.state;render();}else if(type==='sensor.updated'){values.set(data.id,data.value);render();}else if(type==='connection.state')el('status').textContent=data.state;else if(type==='template.updated')load().catch(console.error);else if(type.endsWith('.error'))el('error').textContent=data.message||type;};

// // Promise.all([load(),loadSettings()]).catch(e=>el('error').textContent=e.message);
