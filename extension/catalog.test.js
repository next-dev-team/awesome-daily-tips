'use strict';
const assert=require('node:assert/strict');const skills=require('../site/catalog.js');const panel=require('./panel-catalog.js');assert.deepEqual(panel,skills.map(({id,title,description,summary,docs})=>({id,title,description,summary,docs:docs.map(({url})=>({url}))})));console.log('Side panel catalog matches website');
