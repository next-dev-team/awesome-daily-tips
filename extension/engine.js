'use strict';
(function(){
 if(globalThis.SkillEngineInstalled)return;globalThis.SkillEngineInstalled=true;
 let running=false;
 const visible=n=>n.isConnected&&n.getBoundingClientRect().width>0&&n.getBoundingClientRect().height>0&&getComputedStyle(n).visibility!=="hidden";
 const nodes=list=>[...new Set(list.flatMap(s=>Array.from(document.querySelectorAll(s))))].filter(visible);
 const unique=list=>{const a=nodes(list);return a.length===1?a[0]:null;};
 const norm=s=>String(s??"").replace(/\r\n/g,"\n").trim();
 const value=n=>norm(n.value??n.innerText??"");
 const pause=ms=>new Promise(r=>setTimeout(r,ms));
 const until=async(fn,ms)=>{const end=Date.now()+ms;while(Date.now()<end){const x=fn();if(x)return x;await pause(150);}return null;};
 function insert(n,text){if(n instanceof HTMLTextAreaElement||n instanceof HTMLInputElement){const p=n instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,"value").set.call(n,text);n.dispatchEvent(new Event("input",{bubbles:true}));return true;}if(!n.isContentEditable)return false;n.focus();const range=document.createRange();range.selectNodeContents(n);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);return document.execCommand("insertText",false,text);}
 async function run(m){
 const a=globalThis.SkillAdapters?.[m.provider];let seq=0,observer=null,interval=null,timer=null,done=false,busy=false,last="",lastChange=Date.now(),sawStop=false,sent=false;
 const emit=async(kind,text="",message="")=>{const reply=await chrome.runtime.sendMessage({type:"UPDATE",job:m.job,token:m.token,provider:m.provider,seq:++seq,kind,text,message});if(!reply?.ok)throw Error("Job no longer accepted");};
 function cleanup(){observer?.disconnect();clearInterval(interval);clearTimeout(timer);running=false;done=true;}
 async function finish(kind,text,message){if(done)return;cleanup();try{await emit(kind,text,message);}catch{}}
 try{
 const origins={chatgpt:"https://chatgpt.com",claude:"https://claude.ai",gemini:"https://gemini.google.com",deepseek:"https://chat.deepseek.com",perplexity:"https://www.perplexity.ai",grok:"https://grok.com",copilot:"https://copilot.microsoft.com"};if(!a||location.origin!==origins[m.provider])throw Error("Provider origin mismatch");const freshPaths={chatgpt:["/"],claude:["/new","/new/"],gemini:["/app","/app/"],deepseek:["/"],perplexity:["/"],grok:["/"],copilot:["/"]};if(!freshPaths[m.provider]?.includes(location.pathname))throw Error("Not a recognized fresh chat route; inspect provider and submit manually.");await emit("waiting","","Waiting for unique composer");
 const composer=await until(()=>unique(a.composer),20000);if(!composer)throw Error("Composer not found; login, CAPTCHA or UI change may require manual action");
 if(value(composer))throw Error("Composer is not empty; nothing overwritten");
 // Fresh provider tab only. Existing visible turns or an in-progress answer make attribution unsafe.
 if(nodes(a.user).length||nodes(a.answer).length||nodes(a.stop).length)throw Error("Existing conversation or generation detected; use manual mode");
 if(!insert(composer,m.prompt))throw Error("Prompt insertion failed");
 await pause(250);if(value(composer)!==norm(m.prompt))throw Error("Inserted prompt could not be verified");
 await emit("filled","","Exact prompt verified");
 const button=await until(()=>{const b=unique(a.send);return b&&!b.disabled&&b.getAttribute("aria-disabled")!=="true"?b:null;},10000);
 if(!button||!composer.isConnected||!freshPaths[m.provider].includes(location.pathname)||(composer.closest("form")&&button.closest("form")!==composer.closest("form"))||value(composer)!==norm(m.prompt)||nodes(a.user).length||nodes(a.answer).length||nodes(a.stop).length)throw Error("Send not uniquely available or page changed; inspect manually");
 // Click once only, never retry after an ambiguous outcome.
 const ack=await chrome.runtime.sendMessage({type:"AUTHORIZE_CLICK",job:m.job,token:m.token,provider:m.provider});if(!ack?.ok||!ack.authorized)throw Error("Click authorization denied");
 if(!freshPaths[m.provider].includes(location.pathname)||!button.isConnected||unique(a.send)!==button||button.disabled||button.getAttribute("aria-disabled")==="true"||!composer.isConnected||value(composer)!==norm(m.prompt)||nodes(a.user).length||nodes(a.answer).length||nodes(a.stop).length)throw Error("Composer changed after authorization; inspect manually");
 sent=true;button.click();await emit("submitted","","Send clicked once; awaiting matching user turn");
 const user=await until(()=>{const u=nodes(a.user);return u.length===1&&value(u[0])===norm(m.prompt)?u[0]:null;},30000);
 if(!user)throw Error("Could not confirm exact submitted user turn; do not retry automatically");
 const tick=async()=>{if(done||busy)return;busy=true;try{
 if(!user.isConnected||nodes(a.user).length!==1||value(user)!==norm(m.prompt)){await finish("uncertain",last,"Conversation changed; observation stopped");return;}
 const answers=nodes(a.answer).filter(n=>Boolean(user.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING));
 if(answers.length>1){await finish("uncertain",last,"Multiple response nodes; attribution uncertain");return;}
 const stop=nodes(a.stop).length>0;if(stop)sawStop=true;
 if(answers.length===1){const text=value(answers[0]);if(text.length>200000){await finish("uncertain",last,"Response exceeded limit");return;}
 if(text&&text!==last){last=text;lastChange=Date.now();await emit("partial",last,"Observed response text");}
 if(last&&sawStop&&!stop&&Date.now()-lastChange>=1800){await finish("complete",last,"Observed generation control stop and stable answer");}}
 }catch(e){await finish("uncertain",last,String(e.message).slice(0,200));}finally{busy=false;}};
 observer=new MutationObserver(()=>{if(!busy&&Date.now()-lastChange>250)void tick();});observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["disabled","aria-label","aria-disabled"]});interval=setInterval(()=>void tick(),500);timer=setTimeout(()=>void finish("uncertain",last,"Observation timed out; use manual import"),180000);void tick();
 }catch(e){await finish(sent?"uncertain":"blocked",last,String(e.message).slice(0,250));}
 }
 chrome.runtime.onMessage.addListener((m,sender,reply)=>{if(sender.id!==chrome.runtime.id||m?.type!=="START"||running)return;running=true;reply({started:true});void run(m);});
})();
