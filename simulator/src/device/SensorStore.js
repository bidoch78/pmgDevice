export class SensorStore {
 constructor(events){this.events=events;this.values=new Map();}
 get(id){return this.values.get(id);}
 update(id,value){this.values.set(id,value);this.events.publish('sensor.updated',{id,value});}
}
