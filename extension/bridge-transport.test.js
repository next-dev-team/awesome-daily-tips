'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,p),'utf8');
const origin='https://next-dev-team.github.io',events=[],posted=[],timers=new Map();let id=0,now=0,online=true,version='0.4.1',listener;
function schedule(fn,ms,repeat=false){const n=++id;timers.set(n,{fn,at:now+ms,ms,repeat});return n;}
async function flush(){for(let i=0;i<20;i++){await Promise.resolve();while(events.length){const m=events.shift();for(const f of handlers)f({source:win,origin,data:m});}}}
async function advance(ms){const end=now+ms;while(true){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;const [n,t]=next;now=t.at;if(t.repeat)t.at+=t.ms;else timers.delete(n);t.fn();await flush();}now=end;await flush();}
const handlers=[];const win={addEventListener:(name,fn)=>{if(name==='message')handlers.push(fn);},postMessage:(m,target)=>{assert.equal(target,origin);posted.push(m);events.push(m);}};win.top=win;
const sandbox={window:win,location:{origin,pathname:'/awesome-daily-tips/'},document:{hidden:false,addEventListener(){}},crypto:{randomUUID:()=>`fixture-${++id}`},setTimeout:(fn,ms)=>schedule(fn,ms),clearTimeout:n=>timers.delete(n),setInterval:(fn,ms)=>schedule(fn,ms,true),chrome:{runtime:{id:'extension-test',getManifest:()=>({version}),sendMessage:async m=>{if(!online)throw Error('disconnected');return {ok:true,protocol:2,version,capabilities:['ack','state-machine','heartbeat']};},onMessage:{addListener:fn=>{listener=fn;}}}}};
vm.createContext(sandbox);for(const file of ['../site/bridge-policy.js','../site/bridge.js','content.js'])vm.runInContext(read(file),sandbox,{filename:file});
(async()=>{const bridge=win.SkillBridge;let accepted=[];bridge.onResponse(m=>{if(m.job!=='active')return false;accepted.push(m.text);return true;});
 version='0.4.0';bridge.detect();await flush();assert.equal(bridge.connected,false,'old version rejected');
 version='0.4.1';await advance(5000);assert.equal(bridge.connected,true,'compatible heartbeat');
 let result;assert.equal(listener({type:'RESPONSE',job:'old',provider:'chatgpt',text:'fixture'}, {id:'extension-test'},r=>{result=r.accepted;}),true);await flush();assert.equal(result,false,'old job rejected');assert.equal(accepted.length,0);
 result=undefined;listener({type:'RESPONSE',job:'active',provider:'chatgpt',text:'fixture only'}, {id:'extension-test'},r=>{result=r.accepted;});await flush();assert.equal(result,true,'accepted only after handler');assert.deepEqual(accepted,['fixture only']);
 result=undefined;listener({type:'DRAFT',text:'fixture'}, {id:'extension-test'},r=>{result=r.accepted;});await flush();assert.equal(result,false,'no accepting handler');
 online=false;await advance(8000);assert.equal(bridge.connected,false,'heartbeat detects disconnection');assert.throws(()=>bridge.launch(['chatgpt'],'fixture',{auto:true,mode:'live'},()=>{}));
 online=true;await advance(5000);assert.equal(bridge.connected,true,'heartbeat recovers');
 console.log('Bridge transport fixture passed: old version, current version, stale delivery, accepted delivery, rejected draft, disconnect, blocked launch, reconnect');
})().catch(e=>{console.error(e);process.exitCode=1;});
