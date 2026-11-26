'use strict';
importScripts("protocol.js");
const key=id=>"tab:"+id, locks=new Set();let opening=false;
const panelURL=chrome.runtime.getURL("panel.html");
async function read(id){return (await chrome.storage.session.get(key(id)))[key(id)];}
async function save(id,r){await chrome.storage.session.set({[key(id)]:r});}
async function withLock(id,fn){while(locks.has(id))await new Promise(r=>setTimeout(r,25));locks.add(id);try{return await fn();}finally{locks.delete(id);}}
async function sendSite(r,payload){if(!Number.isInteger(r.siteTab))return false;try{const ack=await chrome.tabs.sendMessage(r.siteTab,{job:r.job,provider:r.provider,seq:r.seq,...payload},{frameId:0});return ack?.accepted===true;}catch{return false;}}
async function deliverResult(r,payload){
 if(r.source!=="panel")return sendSite(r,payload);
 const tabs=await chrome.tabs.query({url:"https://next-dev-team.github.io/awesome-daily-tips/*"});const sites=tabs.filter(t=>isSite(t.url));
 if(sites.length!==1)throw Error("Open exactly one Skillspace page to import; provider submission is already independent.");
 return sendSite({...r,siteTab:sites[0].id},{...payload,state:payload.state==="partial"?"incomplete":payload.state,type:"PANEL_RESULT",prompt:r.prompt});
}
async function notify(id,r){await sendSite(r,{type:"STATUS",state:r.state,message:r.message||"",tabId:id,url:r.url||PROVIDERS[r.provider]});}
async function permission(id){return chrome.permissions.contains({origins:[hostPattern(id)]});}
async function start(id){return withLock(id,async()=>{
 const r=await read(id);if(!fresh(r)||!canStart(r))return;
 const tab=await chrome.tabs.get(id);if(tab.status!=="complete")return;
 if(!AUTO_PROVIDERS.includes(r.provider)||!await permission(r.provider)){r.state="blocked";r.message="Automatic adapter or provider permission unavailable. Use manual fill.";await save(id,r);await notify(id,r);return;}
 if(!isProvider(tab.url,r.provider)){r.state="blocked";r.message="Provider redirected or login required.";await save(id,r);await notify(id,r);return;}
 // Persist claim before injecting. Never retry an ambiguous submission.
 r.claimed=true;r.state="waiting";r.updatedAt=Date.now();await save(id,r);await notify(id,r);
 try{await chrome.scripting.executeScript({target:{tabId:id},files:["adapters.js","engine.js"]});const ack=await chrome.tabs.sendMessage(id,{type:"START",job:r.job,token:r.token,provider:r.provider,prompt:r.prompt},{frameId:0});if(!ack?.started)throw Error("DOM engine did not acknowledge");}
 catch(e){r.state="blocked";r.message="Injection unavailable; inspect provider before manually submitting. "+String(e.message).slice(0,120);await save(id,r);await notify(id,r);}
 });}
async function launch(m,sender){
 const fromPanel=sender.url===panelURL&&m.type==="PANEL_LAUNCH";if((!fromPanel&&(!isSite(sender.url)||!sender.tab||sender.frameId!==0))||m.protocol!==BRIDGE_PROTOCOL||!validLaunch(m)||!validMode(m.mode)||typeof m.auto!=="boolean"||(fromPanel&&!m.auto))throw Error("Invalid launch");
 const siteTab=fromPanel?null:sender.tab.id;
 if(opening)throw Error("Launch already in progress");opening=true;
 try{const all=await chrome.storage.session.get(null);const old=Object.entries(all).filter(([k,v])=>k.startsWith("tab:")&&!fresh(v)).map(([k])=>k);if(old.length)await chrome.storage.session.remove(old);
 const jobKey="job:"+(fromPanel?"panel":siteTab)+":"+m.job;if(all[jobKey])throw Error("Duplicate job");const staleJobs=Object.entries(all).filter(([k,v])=>k.startsWith("job:")&&!fresh(v)).map(([k])=>k);if(staleJobs.length)await chrome.storage.session.remove(staleJobs);
 if(Object.entries(all).filter(([k,v])=>k.startsWith("tab:")&&fresh(v)).length+m.providers.length>21)throw Error("Close some provider tabs first");
 await chrome.storage.session.set({[jobKey]:{created:Date.now()}});let opened=0;const failures=[];
 for(const provider of m.providers){try{if(fromPanel&&!await permission(provider)){failures.push(provider);continue;}const tab=await chrome.tabs.create({url:PROVIDERS[provider],active:false,...(fromPanel?{}:{openerTabId:siteTab})});if(!Number.isInteger(tab.id))throw Error("No tab ID");const r={job:m.job,token:crypto.randomUUID(),provider,prompt:m.prompt,siteTab,source:fromPanel?"panel":"website",created:Date.now(),auto:m.auto,mode:m.mode,state:"ready",claimed:false,seq:0,text:"",url:PROVIDERS[provider]};await save(tab.id,r);opened++;await notify(tab.id,r);if(m.auto)void start(tab.id).catch(()=>{});}catch{failures.push(provider);}}
 return {job:m.job,opened,failures};
 }finally{opening=false;}
}
async function authorizeClick(m,sender){const id=sender.tab?.id;if(!Number.isInteger(id)||sender.frameId!==0)throw Error("Invalid click sender");return withLock(id,async()=>{const r=await read(id);if(!fresh(r)||!isProvider(sender.url,r.provider)||!canAuthorizeClick(r,m,await permission(r.provider)))throw Error("Click authorization denied; inspect the provider manually");r.clickAuthorized=true;r.updatedAt=Date.now();await save(id,r);return {authorized:true};});}
async function update(m,sender){const id=sender.tab?.id;if(!Number.isInteger(id)||sender.frameId!==0)throw Error("Invalid sender");
 return withLock(id,async()=>{const r=await read(id);if(!fresh(r)||!r.claimed||!isProvider(sender.url,r.provider)||!await permission(r.provider)||!allowedUpdate(r,m)||(["submitted","partial","complete"].includes(m.kind)&&!r.clickAuthorized)||["complete","blocked","uncertain"].includes(r.state))throw Error("Invalid or stale update");
 r.seq=m.seq;r.state=m.kind;r.updatedAt=Date.now();if(m.text)r.delivered=false;r.message=typeof m.message==="string"?m.message.slice(0,300):"";if(m.text)r.text=m.text;
 // Only use the browser-observed origin/path; strip query and fragment for sharing.
 const u=new URL(sender.url);r.url=u.origin+u.pathname;await save(id,r);await notify(id,r);
 if(r.text&&canForward(r.mode,m.kind)){r.delivered=await sendSite(r,{type:"RESPONSE",text:r.text,state:m.kind,url:r.url});await save(id,r);}return {accepted:true};
 });}
async function reconcile(){
 const all=await chrome.storage.session.get(null),now=Date.now(),stale=Object.entries(all).filter(([k,r])=>k.startsWith("tab:")&&fresh(r)&&r.claimed&&!["complete","blocked","uncertain"].includes(r.state)&&now-(r.updatedAt||r.created)>240000);
 for(const [k] of stale){const id=Number(k.slice(4));await withLock(id,async()=>{const r=await read(id);if(!fresh(r)||["complete","blocked","uncertain"].includes(r.state)||Date.now()-(r.updatedAt||r.created)<=240000)return;r.state=r.clickAuthorized?"uncertain":"blocked";r.message="Automation lost or timed out; inspect original tab. No automatic retry.";await save(id,r);await notify(id,r);});}
}
async function panel(m,sender){
 if(sender.url!==panelURL)throw Error("Only side panel may perform this action");
 if(m.type==="LIST"){await reconcile();const all=await chrome.storage.session.get(null);return {jobs:Object.entries(all).filter(([k,r])=>k.startsWith("tab:")&&fresh(r)).map(([k,r])=>({tabId:Number(k.slice(4)),provider:r.provider,job:r.job,source:r.source||"website",state:r.state,text:r.text,message:r.message,delivered:r.delivered===true,url:r.url,siteTab:r.siteTab,created:r.created}))};}
 if(m.type==="PANEL_LAUNCH")return launch(m,sender);
 if(m.type==="DRAFT"){if(typeof m.text!=="string"||!m.text.trim()||m.text.length>50000)throw Error("Invalid draft");const tabs=await chrome.tabs.query({url:"https://next-dev-team.github.io/awesome-daily-tips/*"});const sites=tabs.filter(t=>isSite(t.url));if(sites.length!==1)throw Error("Open exactly one Skillspace main page before sending a draft");const ack=await chrome.tabs.sendMessage(sites[0].id,{type:"DRAFT",text:m.text},{frameId:0});if(!ack?.accepted)throw Error("Main chat rejected draft");await chrome.tabs.update(sites[0].id,{active:true});return {};}
 if(!Number.isInteger(m.tabId))throw Error("Invalid tab");
 const r=await read(m.tabId);if(!fresh(r))throw Error("No current job for this tab");const tab=await chrome.tabs.get(m.tabId);
 if(m.type==="OPEN"){if(!isProvider(tab.url,r.provider))throw Error("Provider tab navigated elsewhere");await chrome.tabs.update(m.tabId,{active:true});return {};}
 if(m.type==="SEND_MAIN")return withLock(m.tabId,async()=>{const current=await read(m.tabId);if(!fresh(current)||!current.text.trim())throw Error("No observed response");if(!await deliverResult(current,{type:"RESPONSE",text:current.text,state:current.state==="complete"?"complete":current.state==="partial"?"partial":"incomplete",url:current.url}))throw Error("Main chat did not accept this job; keep the original request open or copy the response manually");current.delivered=true;await save(m.tabId,current);return {};});
 if(m.type==="IMPORT")return withLock(m.tabId,async()=>{const current=await read(m.tabId),target=await chrome.tabs.get(m.tabId);if(!fresh(current)||typeof m.text!=="string"||!m.text.trim()||m.text.length>MAX_RESPONSE||!isProvider(target.url,current.provider))throw Error("Invalid selection");if(!await deliverResult(current,{type:"RESPONSE",text:m.text,state:"manual",url:current.url}))throw Error("Main chat did not accept this job; copy the selected response manually");return {};});
 if(m.type==="CONTEXT"){if(!isProvider(tab.url,r.provider))throw Error("Provider mismatch or access not granted");return {provider:r.provider,prompt:r.prompt};}
 throw Error("Unknown side panel action");
}
chrome.runtime.onMessage.addListener((m,sender,reply)=>{if(!m||typeof m.type!=="string")return;const task=m.type==="HELLO"?Promise.resolve().then(()=>{if(!isSite(sender.url)||sender.frameId!==0||m.protocol!==BRIDGE_PROTOCOL)throw Error("Incompatible bridge");void reconcile().catch(()=>{});return {protocol:BRIDGE_PROTOCOL,version:chrome.runtime.getManifest().version,capabilities:BRIDGE_CAPABILITIES};}):m.type==="LAUNCH"?launch(m,sender):m.type==="UPDATE"?update(m,sender):m.type==="AUTHORIZE_CLICK"?authorizeClick(m,sender):panel(m,sender);task.then(result=>reply({ok:true,...result}),e=>reply({ok:false,job:m.job,error:String(e.message||e).slice(0,300)}));return true;});
chrome.tabs.onUpdated.addListener((id,info)=>{if(info.status==="complete")void start(id).catch(()=>{});if(info.url)void withLock(id,async()=>{const r=await read(id);if(!fresh(r)||isProvider(info.url,r.provider)||["complete","blocked","uncertain"].includes(r.state))return;r.state=r.claimed?"uncertain":"blocked";r.message="Provider tab navigated away; automation will not retry.";await save(id,r);await notify(id,r);}).catch(()=>{});});
chrome.tabs.onRemoved.addListener(id=>{void withLock(id,async()=>{const r=await read(id);if(fresh(r)&&!["complete","blocked","uncertain"].includes(r.state)){r.state=r.clickAuthorized?"uncertain":"blocked";r.message="Provider tab closed; observation stopped.";await notify(id,r);}await chrome.storage.session.remove(key(id));}).catch(()=>{});});
chrome.permissions.onRemoved.addListener(()=>{void (async()=>{const all=await chrome.storage.session.get(null);for(const [k,r] of Object.entries(all)){if(!k.startsWith("tab:")||!fresh(r)||["complete","blocked","uncertain"].includes(r.state)||await permission(r.provider))continue;const id=Number(k.slice(4));await withLock(id,async()=>{const current=await read(id);if(!fresh(current)||["complete","blocked","uncertain"].includes(current.state)||await permission(current.provider))return;current.state=current.clickAuthorized?"uncertain":"blocked";current.message="Provider access revoked; automatic work stopped.";await save(id,current);await notify(id,current);});}})().catch(()=>{});});
if(chrome.sidePanel?.setPanelBehavior)chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true}).catch(()=>{});
