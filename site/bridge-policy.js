'use strict';
function compatibleBridge(m){return m?.protocol===2&&typeof m.version==="string"&&/^0\.4\.[1-9]\d*$/.test(m.version)&&Array.isArray(m.capabilities)&&["ack","state-machine","heartbeat"].every(c=>m.capabilities.includes(c));}
if(typeof module!=='undefined')module.exports={compatibleBridge};else window.SkillBridgePolicy={compatibleBridge};
