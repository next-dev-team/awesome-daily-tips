'use strict';
function compatibleBridge(m){return m?.protocol===2&&typeof m.version==="string"&&/^0\.4\.(?:[2-9]|[1-9]\d+)$/.test(m.version)&&Array.isArray(m.capabilities)&&["ack","state-machine","heartbeat","panel-direct"].every(c=>m.capabilities.includes(c));}
if(typeof module!=='undefined')module.exports={compatibleBridge};else window.SkillBridgePolicy={compatibleBridge};
