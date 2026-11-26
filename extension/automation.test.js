'use strict';
const assert=require("node:assert/strict");
const {validMode,canStart,canForward,allowedUpdate}=require("./protocol.js");
assert(validMode("manual")&&validMode("auto")&&validMode("live"));assert(!validMode("bad"));assert(canStart({state:"ready",auto:true}));assert(!canStart({state:"ready",auto:false}));assert(!canStart({state:"ready",auto:true,claimed:true}));assert(!canStart({state:"submitted",auto:true}));assert(canForward("live","partial"));assert(!canForward("manual","complete"));assert(!canForward("auto","partial"));assert(canForward("auto","complete"));assert(!canForward("live","uncertain"));
const r={job:"a",token:"b",provider:"chatgpt",seq:2},e={...r,seq:3,kind:"partial",text:"real text"};assert(allowedUpdate(r,e));for(const patch of [{seq:2},{job:"wrong"},{token:"wrong"},{provider:"claude"},{text:"x".repeat(200001)},{kind:"fake"}])assert(!allowedUpdate(r,{...e,...patch}));console.log("18 automation policy checks passed");
