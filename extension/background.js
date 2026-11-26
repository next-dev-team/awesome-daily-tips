'use strict';
importScripts("protocol.js");
const tabKey=id=>"tab:"+id;
let opening=false;
async function launch(m,sender){
 if(!isSite(sender.url)||!sender.tab||sender.frameId!==0||!validLaunch(m))throw Error("Invalid launch request");
 if(opening)throw Error("Another launch is in progress");opening=true;
 try{
 const existing=await chrome.storage.session.get(null);const stale=Object.entries(existing).filter(([k,v])=>k.startsWith("tab:")&&!fresh(v)).map(([k])=>k);if(stale.length)await chrome.storage.session.remove(stale);
 if(Object.entries(existing).filter(([k,v])=>k.startsWith("tab:")&&fresh(v)).length+m.providers.length>21)throw Error("Close some bridge tabs before launching more");
 let opened=0;
 for(const provider of m.providers){const tab=await chrome.tabs.create({url:PROVIDERS[provider],active:false,openerTabId:sender.tab.id});if(typeof tab.id!=="number")throw Error("No provider tab ID");await chrome.storage.session.set({[tabKey(tab.id)]:{job:m.job,provider,prompt:m.prompt,siteTab:sender.tab.id,created:Date.now()}});opened++;}
 return {job:m.job,opened};
 }finally{opening=false;}
}
async function popup(m,sender){
 if(sender.url!==chrome.runtime.getURL("popup.html")||!Number.isInteger(m.tabId))throw Error("Invalid popup request");
 const tab=await chrome.tabs.get(m.tabId);const record=(await chrome.storage.session.get(tabKey(m.tabId)))[tabKey(m.tabId)];
 if(!fresh(record)||!isProvider(tab.url,record.provider))throw Error("This tab is not a current Skillspace provider tab");
 if(m.type==="CONTEXT")return {provider:record.provider,prompt:record.prompt};
 if(m.type==="IMPORT"){
 if(typeof m.text!=="string"||!m.text.trim()||m.text.length>MAX_RESPONSE)throw Error("Select response text between 1 and 200,000 characters");
 // The original tab has a matching content-script permission; the content script checks its path too.
 await chrome.tabs.sendMessage(record.siteTab,{type:"RESPONSE",job:record.job,provider:record.provider,text:m.text},{frameId:0});
 return {imported:true};
 }throw Error("Unknown action");
}
chrome.runtime.onMessage.addListener((m,sender,reply)=>{if(!m||typeof m.type!=="string")return;const task=m.type==="LAUNCH"?launch(m,sender):popup(m,sender);task.then(result=>reply({ok:true,...result}),error=>reply({ok:false,job:m.job,error:String(error.message||error).slice(0,300)}));return true;});
chrome.tabs.onRemoved.addListener(id=>{void chrome.storage.session.remove(tabKey(id));});
