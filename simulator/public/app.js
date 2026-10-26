import { Device } from '../src/Device.js';

// import {CanvasRenderer} from '../src/renderers/CanvasRenderer.js';
// import {Screen} from '../src/display/Screen.js';

// const canvas=document.querySelector('#display'),renderer=new CanvasRenderer(canvas);

// const values=new Map([['oil_pressure',3.2],['coolant_temp',87]]);

// const sensors={get:id=>values.get(id)};

// let screen;

// const el=id=>document.getElementById(id);

// async function api(url,method='GET',data) {
    
//     const response=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw Error(result.error||'API error');return result;

// }

// async function load() {
    
//     //const config=await api('/api/template');
    
//     canvas.width=config.width;canvas.height=config.height;renderer.width=config.width;renderer.height=config.height;
//     screen=new Screen(config);el('templateInfo').value=JSON.stringify(config,null,2);
//     render();

// }

// function render() { screen?.draw(renderer,sensors); }

// async function loadSettings(){
    
//     //const s=await api('/api/settings');
    
//     el('mac').value=s.mac;el('hubUrl').value=s.hubUrl;el('autoConnect').checked=s.autoConnect;el('tokenStatus').textContent=s.hasToken?'Token enregistré':'Aucun token';el('status').textContent=s.connectionState;}

// async function run(action){
    
//     try{await action();el('error').textContent='';}catch(e){el('error').textContent=e.message;}

// }

// el('saveSettings').onclick=()=>run(async()=>{
    
//     await api('/api/settings','PUT',{mac:el('mac').value,hubUrl:el('hubUrl').value,autoConnect:el('autoConnect').checked});await loadSettings();});

// el('saveToken').onclick=()=>run(async()=>{await api('/api/token','PUT',{token:el('token').value});el('token').value='';await loadSettings();});
// el('clearToken').onclick=()=>run(async()=>{await api('/api/token','DELETE');await loadSettings();});
// el('connect').onclick=()=>run(async()=>{await api('/api/connect','POST');await loadSettings();});
// el('disconnect').onclick=()=>run(async()=>{await api('/api/disconnect','POST');await loadSettings();});
// el('saveTemplate').onclick=()=>run(async()=>{await api('/api/template','PUT',JSON.parse(el('templateInfo').value));await load();});
// el('reload').onclick=()=>run(load);

// for(const [inputId,sensorId,outputId] of [['oil','oil_pressure','oilValue'],['temp','coolant_temp','tempValue']])el(inputId).addEventListener('input',e=>{const value=Number(e.target.value);api('/api/sensor','POST',{id:sensorId,value}).catch(console.error);values.set(sensorId,value);el(outputId).textContent=value;render();});
// //const stream=new EventSource('/api/events');

// stream.onmessage=e=>{const {type,data}=JSON.parse(e.data);if(type==='snapshot'){for(const [id,value] of Object.entries(data.sensors))values.set(id,value);el('status').textContent=data.state;render();}else if(type==='sensor.updated'){values.set(data.id,data.value);render();}else if(type==='connection.state')el('status').textContent=data.state;else if(type==='template.updated')load().catch(console.error);else if(type.endsWith('.error'))el('error').textContent=data.message||type;};

// Promise.all([load(),loadSettings()]).catch(e=>el('error').textContent=e.message);
