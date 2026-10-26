// import {EventBus} from '../core/EventBus.js';
// import {SensorStore} from './SensorStore.js';
// import {ConnectionManager} from '../managers/ConnectionManager.js';
// import {StorageManager} from '../managers/StorageManager.js';
// export class Device {
//  constructor(directory){this.events=new EventBus();this.sensors=new SensorStore(this.events);this.storage=new StorageManager(directory);this.connection=new ConnectionManager(this.events);this.settings=null;this.template=null;this.token=null;this.unsubscribe=this.events.subscribe('sensor.received',e=>this.sensors.update(e.payload.id,e.payload.value));}
//  async begin(defaultTemplate){this.settings=await this.storage.loadSettings();this.template=await this.storage.loadTemplate()||defaultTemplate;this.token=await this.storage.loadToken();if(this.settings.autoConnect)this.connect();}
//  connect(){this.connection.connect(this.settings,this.token);}
//  disconnect(){this.connection.disconnect();}
//  async updateSettings(next){const mac=next.mac?.toUpperCase();if(!/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(mac||''))throw Error('Invalid MAC address');let url;try{url=new URL(next.hubUrl);}catch{throw Error('Invalid Hub URL');}if(!['ws:','wss:'].includes(url.protocol)||url.username||url.password)throw Error('Hub URL must use ws:// or wss:// without embedded credentials');this.settings={mac,hubUrl:url.href,autoConnect:!!next.autoConnect};await this.storage.saveSettings(this.settings);this.disconnect();if(this.settings.autoConnect)this.connect();}
//  async updateTemplate(template){if(!template||!Number.isInteger(template.width)||!Number.isInteger(template.height)||template.width<1||template.width>2048||template.height<1||template.height>2048||!Array.isArray(template.widgets)||template.widgets.length>256)throw Error('Invalid template');await this.storage.saveTemplate(template);this.template=template;this.events.publish('template.updated',template);}
//  async setToken(token){await this.storage.saveToken(token);this.token=token;this.disconnect();if(this.settings.autoConnect)this.connect();}
//  async clearToken(){await this.storage.clearToken();this.token=null;this.disconnect();}
//  close(){this.disconnect();this.unsubscribe();this.events.close();}
// }

export class HubConnection {

    constructor(device) {

        this.device = device;

    }

}