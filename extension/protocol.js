'use strict';
const PROVIDERS={chatgpt:"https://chatgpt.com/",claude:"https://claude.ai/new",gemini:"https://gemini.google.com/app",perplexity:"https://www.perplexity.ai/",deepseek:"https://chat.deepseek.com/",grok:"https://grok.com/",copilot:"https://copilot.microsoft.com/"};
const MAX_PROMPT=250000,MAX_RESPONSE=200000,TTL=60*60*1000;
function isSite(url){try{const u=new URL(url);return u.origin==="https://next-dev-team.github.io"&&(u.pathname==="/awesome-daily-tips/"||u.pathname==="/awesome-daily-tips/index.html");}catch{return false;}}
function isProvider(url,id){if(!Object.hasOwn(PROVIDERS,id))return false;try{return new URL(url).origin===new URL(PROVIDERS[id]).origin;}catch{return false;}}
function validLaunch(m){return typeof m.job==="string"&&/^[a-f0-9-]{36}$/i.test(m.job)&&typeof m.prompt==="string"&&m.prompt.trim().length>0&&m.prompt.length<=MAX_PROMPT&&Array.isArray(m.providers)&&m.providers.length>=1&&m.providers.length<=7&&new Set(m.providers).size===m.providers.length&&m.providers.every(id=>typeof id==="string"&&Object.hasOwn(PROVIDERS,id));}
function fresh(record,now=Date.now()){return !!record&&Number.isFinite(record.created)&&now-record.created>=0&&now-record.created<TTL;}


function validMode(mode){return ["manual","auto","live"].includes(mode);}
function canStart(record){return !!record&&record.state==="ready"&&record.auto===true&&record.claimed!==true;}
function canForward(mode,kind){return mode==="live"&&["partial","complete"].includes(kind)||mode==="auto"&&kind==="complete";}
const BRIDGE_PROTOCOL=2, BRIDGE_CAPABILITIES=['ack','state-machine','heartbeat'];
function legalTransition(from,to){return ({waiting:["waiting","filled","blocked"],filled:["submitted","blocked","uncertain"],submitted:["partial","uncertain"],partial:["partial","complete","uncertain"]})[from]?.includes(to)===true;}
function allowedUpdate(record,event){return !!record&&record.job===event.job&&record.token===event.token&&record.provider===event.provider&&Number.isSafeInteger(event.seq)&&event.seq>record.seq&&legalTransition(record.state,event.kind)&&typeof event.text==="string"&&(!["partial","complete"].includes(event.kind)||event.text.trim().length>0)&&event.text.length<=200000;}
function canAuthorizeClick(record,event,granted){return granted===true&&!!record&&record.state==="filled"&&record.claimed===true&&record.clickAuthorized!==true&&record.job===event.job&&record.token===event.token&&record.provider===event.provider;}
const AUTO_PROVIDERS=["chatgpt","claude","gemini"];
function identify(url){return Object.keys(PROVIDERS).find(id=>isProvider(url,id))||null;}
function hostPattern(id){return new URL(PROVIDERS[id]).origin+"/*";}
if(typeof module!=="undefined")module.exports={PROVIDERS,isSite,isProvider,validLaunch,fresh,TTL,validMode,canStart,canForward,allowedUpdate,canAuthorizeClick,legalTransition,BRIDGE_PROTOCOL,BRIDGE_CAPABILITIES,AUTO_PROVIDERS,identify,hostPattern};
