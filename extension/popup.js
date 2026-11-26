'use strict';
const $=id=>document.getElementById(id);let tabId;
function status(s){$("status").textContent=s;}
async function call(type,extra={}){const r=await chrome.runtime.sendMessage({type,tabId,...extra});if(!r?.ok)throw Error(r?.error||"Bridge unavailable");return r;}
async function inject(func,args=[]){const [result]=await chrome.scripting.executeScript({target:{tabId},func,args});return result?.result;}
function fillPrompt(provider,prompt){
 const selectors={chatgpt:["#prompt-textarea"],claude:['[contenteditable="true"].ProseMirror'],gemini:['rich-textarea [contenteditable="true"]'],deepseek:["#chat-input"],perplexity:['textarea[placeholder]','[contenteditable="true"][role="textbox"]'],grok:['textarea[placeholder]','[contenteditable="true"][role="textbox"]'],copilot:['textarea[placeholder]','[contenteditable="true"][role="textbox"]']};
 const nodes=[...new Set((selectors[provider]||[]).flatMap(s=>Array.from(document.querySelectorAll(s))))].filter(n=>n.getBoundingClientRect().width>0&&n.getBoundingClientRect().height>0&&!n.disabled&&!n.readOnly);
 if(nodes.length!==1)return {ok:false,reason:"No unique visible composer. Paste manually."};const n=nodes[0];
 if((n.value||n.innerText||"").trim())return {ok:false,reason:"Composer already contains text. Nothing overwritten."};n.focus();
 if(n instanceof HTMLTextAreaElement||n instanceof HTMLInputElement){const proto=n instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,"value").set.call(n,prompt);n.dispatchEvent(new Event("input",{bubbles:true}));}
 else if(n.isContentEditable){const range=document.createRange();range.selectNodeContents(n);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);if(!document.execCommand("insertText",false,prompt))return {ok:false,reason:"Composer refused insertion. Paste manually."};}
 else return {ok:false,reason:"Unsupported composer"};return (n.value??n.innerText??"").trim()===prompt.trim()?{ok:true}:{ok:false,reason:"Insertion could not be verified. Review or paste manually."};
}
async function init(){try{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});tabId=tab?.id;const ctx=await call("CONTEXT");status("Connected to "+ctx.provider+".");$("fill").disabled=false;$("capture").disabled=false;}catch(e){status(e.message);}}
$("fill").addEventListener("click",async()=>{try{const ctx=await call("CONTEXT");const result=await inject(fillPrompt,[ctx.provider,ctx.prompt]);status(result?.ok?"Prompt filled. Review and click Send in the provider.":result?.reason||"Unable to fill. Paste manually.");}catch(e){status(e.message);}});
$("capture").addEventListener("click",async()=>{try{await call("CONTEXT");const text=await inject(()=>window.getSelection()?.toString()||"");if(!text.trim()||text.length>200000)throw Error("Select response text in the provider tab first");$("response").value=text;$("import").disabled=false;status("Review selected text, then import.");}catch(e){$("response").value="";$("import").disabled=true;status(e.message);}});
$("import").addEventListener("click",async()=>{try{await call("IMPORT",{text:$("response").value});status("Response forwarded. If the original prompt changed, it may be ignored.");$("import").disabled=true;}catch(e){status(e.message);}});
void init();
