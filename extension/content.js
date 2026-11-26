'use strict';
(function(){
 const origin=location.origin;if(origin!=="https://next-dev-team.github.io"||!["/awesome-daily-tips/","/awesome-daily-tips/index.html"].includes(location.pathname)||window.top!==window)return;
 const post=(type,payload)=>window.postMessage({source:"skillspace-extension",type,...payload},origin);
 window.addEventListener("message",async e=>{if(e.source!==window||e.origin!==origin||e.data?.source!=="skillspace-page")return;const m=e.data;if(m.type==="PING"&&typeof m.probe==="string"){post("PONG",{probe:m.probe});return;}
 if(m.type==="LAUNCH"){try{const result=await chrome.runtime.sendMessage({type:"LAUNCH",job:m.job,providers:m.providers,prompt:m.prompt,auto:m.auto,mode:m.mode});post("LAUNCH_RESULT",result||{job:m.job,error:"No bridge reply"});}catch{post("LAUNCH_RESULT",{job:m.job,error:"Extension disconnected"});}}});
 chrome.runtime.onMessage.addListener((m,sender,reply)=>{if(sender.id!==chrome.runtime.id||!["RESPONSE","STATUS","DRAFT"].includes(m?.type)||!["/awesome-daily-tips/","/awesome-daily-tips/index.html"].includes(location.pathname))return;post(m.type,{job:m.job,provider:m.provider,text:m.text,state:m.state,message:m.message,url:m.url,tabId:m.tabId});reply({ok:true});});
})();
