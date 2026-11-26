'use strict';
(function(){
 const origin=location.origin,source="skillspace-page",target="skillspace-extension";
 const callbacks=new Map(),statusListeners=new Set(),responseListeners=new Set();let connected=false,probe=null;
 const send=(type,payload)=>window.postMessage({source,type,...payload},origin);
 function setStatus(value){connected=value;for(const fn of statusListeners)fn(value);}
 window.addEventListener("message",e=>{if(e.source!==window||e.origin!==origin||e.data?.source!==target)return;const m=e.data;if(m.type==="PONG"&&m.probe===probe){setStatus(true);return;}if(m.type==="LAUNCH_RESULT"&&callbacks.has(m.job)){const cb=callbacks.get(m.job);callbacks.delete(m.job);cb(m);return;}if(m.type==="RESPONSE"&&typeof m.job==="string"&&typeof m.provider==="string"&&typeof m.text==="string"&&m.text.length<=200000){for(const fn of responseListeners)fn(m);}});
 function detect(){probe=crypto.randomUUID();send("PING",{probe});}
 window.SkillBridge={get connected(){return connected;},detect,onStatus(fn){statusListeners.add(fn);fn(connected);},onResponse(fn){responseListeners.add(fn);},launch(providers,prompt,callback){const job=crypto.randomUUID();callbacks.set(job,callback);send("LAUNCH",{job,providers,prompt});setTimeout(()=>{if(callbacks.delete(job))callback({job,error:"Bridge did not acknowledge the request"});},15000);return job;}};
})();
