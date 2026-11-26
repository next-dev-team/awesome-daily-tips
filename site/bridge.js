'use strict';
(function(){
 const origin=location.origin,source="skillspace-page",target="skillspace-extension",protocol=2;
 const callbacks=new Map(),statusListeners=new Set(),responseListeners=new Set(),eventListeners=new Set();
 let connected=false,probe=null,probeTimer=null;
 const send=(type,payload)=>window.postMessage({source,type,protocol,...payload},origin);
 function setStatus(value,reason){connected=value;for(const fn of statusListeners)fn(value,reason);}
 function dispatch(list,m){let accepted=false;for(const fn of list){try{if(fn(m)===true)accepted=true;}catch{}}return accepted;}
 window.addEventListener("message",e=>{if(e.source!==window||e.origin!==origin||e.data?.source!==target)return;const m=e.data;
 if(m.type==="PONG"&&probe!==null&&m.probe===probe){clearTimeout(probeTimer);probe=null;const ok=window.SkillBridgePolicy.compatibleBridge(m);setStatus(ok,ok?"Connected · "+m.version:"Update extension to v0.4.2+");return;}
 if(m.protocol!==protocol)return;
 if(m.type==="LAUNCH_RESULT"&&callbacks.has(m.job)){const cb=callbacks.get(m.job);callbacks.delete(m.job);cb(m);return;}
 if(typeof m.deliveryId!=="string")return;
 let accepted=false;
 if(m.type==="STATUS"||m.type==="DRAFT"||m.type==="PANEL_RESULT")accepted=dispatch(eventListeners,m);
 else if(m.type==="RESPONSE"&&typeof m.job==="string"&&typeof m.provider==="string"&&typeof m.text==="string"&&m.text.length<=200000)accepted=dispatch(responseListeners,m);
 send("DELIVERY_ACK",{deliveryId:m.deliveryId,accepted});
 });
 function detect(){if(probe)return;probe=crypto.randomUUID();const id=probe;probeTimer=setTimeout(()=>{if(probe===id){probe=null;setStatus(false,"Not connected · reload extension/page");}},3000);send("PING",{probe});}
 window.SkillBridge={get connected(){return connected;},detect,onStatus(fn){statusListeners.add(fn);fn(connected,"Checking extension");},onResponse(fn){responseListeners.add(fn);},onEvent(fn){eventListeners.add(fn);},launch(providers,prompt,options,callback){if(!connected)throw Error("Compatible extension not connected");const job=crypto.randomUUID();callbacks.set(job,callback);send("LAUNCH",{job,providers,prompt,auto:options.auto===true,mode:options.mode});setTimeout(()=>{if(callbacks.delete(job))callback({job,error:"Bridge acknowledgement timed out. Inspect provider tabs before retrying."});},15000);return job;}};
 setInterval(detect,5000);window.addEventListener("focus",detect);document.addEventListener("visibilitychange",()=>{if(!document.hidden)detect();});
})();
