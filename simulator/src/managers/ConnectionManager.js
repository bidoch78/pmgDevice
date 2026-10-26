import {ProtocolManager} from './ProtocolManager.js';
export class ConnectionManager {
 constructor(events,{retryMin=1000,retryMax=15000}={}){this.events=events;this.retryMin=retryMin;this.retryMax=retryMax;this.retry=retryMin;this.socket=null;this.timer=null;this.heartbeat=null;this.active=false;this.settings=null;this.token=null;this.state='disconnected';}
 connect(settings,token){this.disconnect();this.settings={...settings};this.token=token;this.active=true;this.retry=this.retryMin;this.open();}
 open(){if(!this.active)return;this.setState('connecting');let ws;
  try{ws=new WebSocket(this.settings.hubUrl);}catch(e){this.fail(e);return;}
  this.socket=ws;
  ws.addEventListener('open',()=>{if(this.socket!==ws)return;this.retry=this.retryMin;this.setState('connected');this.send('device.hello',{mac:this.settings.mac,token:this.token});this.heartbeat=setInterval(()=>this.send('device.heartbeat',{timestamp:Date.now()}),15000);});
  ws.addEventListener('message',event=>{if(this.socket!==ws)return;try{if(typeof event.data!=='string')throw Error('Binary message unsupported');const message=ProtocolManager.parse(event.data);this.events.publish('protocol.message',message);for(const [id,value] of ProtocolManager.sensorUpdates(message))this.events.publish('sensor.received',{id,value});if(message.type==='auth.ok')this.events.publish('auth.ok',message);if(message.type==='auth.error')this.events.publish('auth.error',message);}catch(e){this.events.publish('protocol.error',{message:e.message});}});
  ws.addEventListener('error',()=>{if(this.socket===ws)this.events.publish('connection.error',{message:'WebSocket error'});});
  ws.addEventListener('close',()=>{if(this.socket!==ws)return;this.stopHeartbeat();this.socket=null;this.setState('disconnected');if(this.active)this.scheduleRetry();});
 }
 send(type,payload={}){if(this.socket?.readyState!==WebSocket.OPEN)return false;this.socket.send(ProtocolManager.encode(type,payload));return true;}
 fail(e){this.events.publish('connection.error',{message:e.message});this.setState('disconnected');this.scheduleRetry();}
 scheduleRetry(){if(!this.active)return;clearTimeout(this.timer);this.timer=setTimeout(()=>this.open(),this.retry);this.retry=Math.min(this.retry*2,this.retryMax);}
 setState(state){this.state=state;this.events.publish('connection.state',{state});}
 stopHeartbeat(){clearInterval(this.heartbeat);this.heartbeat=null;}
 disconnect(){this.active=false;clearTimeout(this.timer);this.stopHeartbeat();const ws=this.socket;this.socket=null;if(ws){try{ws.close();}catch{}}this.setState('disconnected');}
}
