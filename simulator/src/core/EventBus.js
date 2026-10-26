export class EventBus {

  constructor({capacity=256}={}) {
    this.capacity=capacity;
    this.queue=[];
    this.listeners=new Map();
    this.scheduled=false;
    this.closed=false;
  }

  subscribe(type,callback) {
    if(this.closed) throw new Error('EventBus closed');
    const listeners=this.listeners.get(type)||new Set();listeners.add(callback);this.listeners.set(type,listeners);return ()=>{listeners.delete(callback);if(!listeners.size)this.listeners.delete(type);};}
  
  publish(type,payload={}){if(this.closed||this.queue.length>=this.capacity)return false;this.queue.push({type,payload});if(!this.scheduled){this.scheduled=true;setImmediate(()=>this.dispatch());}return true;}
  
  dispatch() {
    
    this.scheduled=false;
    if(this.closed) return;
    
    const batch = this.queue.splice(0,64);
    
    for(const event of batch) {
      for(const callback of [...(this.listeners.get(event.type)||[])]) {
        
        try{

          Promise.resolve(callback(event)).catch( error=> console.error('Event listener error:',error));
        
        }
        catch(error) {
          console.error('Event listener error:',error);
        }

      }
    }

    if(this.queue.length && !this.scheduled) { 
      this.scheduled=true;
      setImmediate(()=>this.dispatch());
    }
        
  }
  
  close() {
    this.closed=true;
    this.queue.length=0;
    this.listeners.clear();
  }

}
