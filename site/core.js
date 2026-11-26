'use strict';
function createCore(){
 const providers=[
 {id:"chatgpt",name:"ChatGPT",mark:"✳",color:"green",url:"https://chatgpt.com/",param:"q",note:"Prompt link (best effort)"},
 {id:"claude",name:"Claude",mark:"✺",color:"orange",url:"https://claude.ai/new",param:"q",note:"Prompt link (best effort)"},
 {id:"gemini",name:"Gemini",mark:"✦",color:"blue",url:"https://gemini.google.com/app",param:null,note:"Copy & paste"},
 {id:"perplexity",name:"Perplexity",mark:"◎",color:"teal",url:"https://www.perplexity.ai/",param:"q",note:"Prompt link (best effort)"},
 {id:"deepseek",name:"DeepSeek",mark:"D",color:"blue",url:"https://chat.deepseek.com/",param:null,note:"Copy & paste"},
 {id:"grok",name:"Grok",mark:"◈",color:"gray",url:"https://grok.com/",param:null,note:"Copy & paste"},
 {id:"copilot",name:"Copilot",mark:"◇",color:"purple",url:"https://copilot.microsoft.com/",param:null,note:"Copy & paste"}
 ];
 const mentionPattern=/(^|[\s(])@([a-z][a-z0-9-]*)(?![a-z0-9_-])/gi;
 function split(text,skills){const map=new Map(skills.map(s=>[s.id,s]));const picked=new Map();const task=text.replace(mentionPattern,(whole,prefix,id)=>{const s=map.get(id.toLowerCase());if(!s)return whole;picked.set(s.id,s);return prefix;}).trim();return {task,skills:[...picked.values()]};}
 function compose(text,skills,full){const p=split(text,skills);if(!p.task)return {prompt:"",...p};if(!p.skills.length)return {prompt:p.task,...p};const blocks=p.skills.map(s=>full?("Skill: "+s.title+"\n"+s.docs.map(d=>"Source: "+d.url+"\n"+d.content).join("\n\n")):("Skill: "+s.title+"\n"+s.summary+"\nRead and follow these sources if accessible; disclose if you cannot access them:\n"+s.docs.map(d=>d.url).join("\n")));return {prompt:"Use the following selected skills for this request. Respect their scope and ask about unresolved requirements. Do not pretend unavailable sources were read.\n\n"+blocks.join("\n\n")+"\n\nUser request:\n"+p.task,...p};}
 function launch(providerId,prompt,allowUrl){const p=providers.find(x=>x.id===providerId);if(!p)throw Error("Unknown provider");if(!prompt.trim())return null;let url=p.url;if(allowUrl&&p.param){let encoded;try{encoded=encodeURIComponent(prompt);}catch{encoded=null;}if(encoded!==null){const candidate=p.url+"?"+p.param+"="+encoded;if(candidate.length<=1800)return {url:candidate,mode:"prefill"};}}return {url,mode:"paste"};}
 function activeMention(text,cursor){const before=text.slice(0,cursor);const m=/(^|[\s(])@([a-z0-9-]*)$/i.exec(before);if(!m)return null;const start=cursor-m[2].length-1;const tail=/^[a-z0-9-]*/i.exec(text.slice(cursor))[0];return {start,end:cursor+tail.length,query:m[2].toLowerCase()};}
 function insertMention(text,cursor,id){const m=activeMention(text,cursor);const start=m?m.start:cursor,end=m?m.end:cursor;const prefix=!m&&start>0&&!/\s/.test(text[start-1])?" ":"";const token=prefix+"@"+id+" ";return {text:text.slice(0,start)+token+text.slice(end),cursor:start+token.length};}
 function removeMention(text,id){return text.replace(mentionPattern,(whole,prefix,name)=>name.toLowerCase()===id?prefix:whole);}
 function skinFor(ids){return ids.length===1&&["chatgpt","claude","gemini","grok"].includes(ids[0])?ids[0]:"default";}
 return {providers,split,compose,launch,activeMention,insertMention,removeMention,skinFor};
}
const core = createCore();
if (typeof module !== 'undefined' && module.exports) module.exports = core;
else window.SkillCore = core;
