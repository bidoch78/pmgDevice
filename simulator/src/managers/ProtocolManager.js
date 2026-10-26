export class ProtocolManager {
 static parse(raw){
  const str=typeof raw==='string'?raw:raw.toString('utf8');
  if(str.length>65536)throw Error('Message too large');
  const m=JSON.parse(str);
  if(!m||typeof m!=='object'||Array.isArray(m)||typeof m.type!=='string')throw Error('Invalid message envelope');
  return m;
 }
 static encode(type,payload={}){return JSON.stringify({type,...payload});}
 static sensorUpdates(message){
  if(message.type!=='sensor.update'&&message.type!=='sensor.updated')return [];
  let values=message.values;
  if(values===undefined&&typeof message.id==='string')values={[message.id]:message.value};
  if(!values||typeof values!=='object'||Array.isArray(values))throw Error('Invalid sensor values');
  return Object.entries(values).filter(([id,v])=>id.length>0&&id.length<=128&&typeof v==='number'&&Number.isFinite(v)).slice(0,256);
 }
}
