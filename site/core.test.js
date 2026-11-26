'use strict';
function runTests(core,skills){
 let count=0;const assert=(condition,name)=>{if(!condition)throw Error("FAIL: "+name);count++;};
 const {split,compose,launch,activeMention,insertMention,removeMention}=core;
 assert(split("@translate Hello @translate",skills).skills.length===1,"deduplication");
 assert(split("x@y.com @unknown @translate-extra",skills).skills.length===0,"literal unrelated mentions");
 assert(split("@TRANSLATE hi",skills).task==="hi","case insensitive");
 assert(compose("@translate",skills,false).prompt==="","empty task");
 assert(compose("hello",skills,false).prompt==="hello","plain prompt");
 assert(compose("@translate hi",skills,false).prompt.includes(skills[0].docs[0].url),"compact source");
 assert(compose("@translate hi",skills,true).prompt.includes(skills[0].docs[0].content),"full source");
 assert(compose("@translate @production-code-audit hi",skills,true).skills.length===2,"multiple skills");
 const payload="ខ្មែរ & ? # <script>";
 const l=launch("chatgpt",payload,true);assert(l.mode==="prefill"&&decodeURIComponent(l.url.split("?q=")[1])===payload,"encoded Unicode and URL metacharacters");
 assert(launch("gemini",payload,true).mode==="paste","unsupported prefill");
 assert(launch("chatgpt",payload,false).url==="https://chatgpt.com/","privacy mode");
 assert(launch("claude","x".repeat(1900),true).mode==="paste","long prompt fallback");
 assert(launch("chatgpt","",true)===null,"empty launch");
 assert(launch("chatgpt","\ud800",true).mode==="paste","invalid Unicode fallback");
 let rejected=false;try{launch("javascript:alert(1)",payload,true);}catch{rejected=true;}assert(rejected,"fixed provider allowlist");
 assert(activeMention("hello @tra",10).query==="tra","mention detection");
 assert(activeMention("a@tra",5)===null,"email excluded");
 assert(insertMention("@translat tail",5,"translate").text==="@translate  tail","replace full mention");
 assert(removeMention("@translate hi @translate-extra","translate").includes("@translate-extra"),"exact removal");
 assert(core.providers.every(p=>p.url.startsWith("https://")&&!p.url.includes("?")),"safe providers");
 return count;
}
console.log(runTests(require('./core.js'),require('./catalog.js'))+' core checks passed');
