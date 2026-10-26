import {readFile,writeFile,mkdir,rename,chmod} from 'node:fs/promises';
import path from 'node:path';
export class StorageManager {
 constructor(directory){this.directory=directory;}
 async read(name,fallback=null){try{return JSON.parse(await readFile(path.join(this.directory,name),'utf8'));}catch(e){if(e.code==='ENOENT')return fallback;throw e;}}
 async write(name,data,{secret=false}={}){
  await mkdir(this.directory,{recursive:true,mode:0o700});
  const target=path.join(this.directory,name),temp=target+'.'+process.pid+'.tmp';
  try{await writeFile(temp,JSON.stringify(data,null,2)+'\n',{mode:secret?0o600:0o644});await chmod(temp,secret?0o600:0o644);await rename(temp,target);}catch(e){throw e;}
 }
 async loadSettings(){return this.read('settings.json',{mac:'02:00:00:00:00:01',hubUrl:'ws://127.0.0.1:8080',autoConnect:false});}
 async saveSettings(settings){await this.write('settings.json',settings);}
 async loadTemplate(){return this.read('template.json',null);}
 async saveTemplate(template){await this.write('template.json',template);}
 async loadToken(){return (await this.read('credentials.json',{})).token||null;}
 async saveToken(token){if(typeof token!=='string'||token.length<16||token.length>4096)throw Error('Invalid token');await this.write('credentials.json',{token},{secret:true});}
 async clearToken(){await this.write('credentials.json',{}, {secret:true});}
}
