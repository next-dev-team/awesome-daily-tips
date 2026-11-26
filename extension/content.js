'use strict';
(function(){
 const origin=location.origin,protocol=2;if(origin!=="https://next-dev-team.github.io"||!["/awesome-daily-tips/","/awesome-daily-tips/index.html"].includes(location.pathname)||window.top!==window)return;
 const post=(type,payload)=>window.postMessage({source:"skillspace-extension",protocol,type,...payload},origin);
 const pending=new Map();
 window.addEventListener("message",async e=>{if(e.source!==window||e.origin!==origin||e.data?.source!=="skillspace-page"||e.data.protocol!==protocol)return;const m=e.data;
 if(m.type==="DELIVERY_ACK"){const entry=pending.get(m.deliveryId);if(entry){pending.delete(m.deliveryId);clearTimeout(entry.timer);entry.reply({accepted:m.accepted===true});}return;}
 if(m.type==="PING"&&typeof m.probe==="string"){try{const r=await chrome.runtime.sendMessage({type:"HELLO",protocol});if(r?.ok)post("PONG",{probe:m.probe,protocol:r.protocol,version:r.version,capabilities:r.capabilities});}catch{}return;}
 if(m.type==="LAUNCH"){try{const result=await chrome.runtime.sendMessage({type:"LAUNCH",protocol,job:m.job,providers:m.providers,prompt:m.prompt,auto:m.auto,mode:m.mode});post("LAUNCH_RESULT",result||{job:m.job,error:"No bridge reply"});}catch{post("LAUNCH_RESULT",{job:m.job,error:"Extension disconnected"});}}
 });
 chrome.runtime.onMessage.addListener((m,sender,reply)=>{if(sender.id!==chrome.runtime.id||!["RESPONSE","STATUS","DRAFT","PANEL_RESULT"].includes(m?.type)||!["/awesome-daily-tips/","/awesome-daily-tips/index.html"].includes(location.pathname))return;
 const deliveryId=crypto.randomUUID();const timer=setTimeout(()=>{if(pending.delete(deliveryId))reply({accepted:false});},2000);pending.set(deliveryId,{reply,timer});
 post(m.type,{deliveryId,job:m.job,provider:m.provider,text:m.text,prompt:m.prompt,state:m.state,message:m.message,url:m.url,tabId:m.tabId,seq:m.seq});return true;});
})();
