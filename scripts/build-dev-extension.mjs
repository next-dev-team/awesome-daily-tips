import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';import {fileURLToPath} from 'node:url';import {join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),dest=join(root,'dist','extension-dev');
mkdirSync(dest,{recursive:true});cpSync(join(root,'extension'),dest,{recursive:true});
function edit(file,fn){const p=join(dest,file),before=readFileSync(p,'utf8'),after=fn(before);if(before===after)throw Error('Dev replacement missing: '+file);writeFileSync(p,after);}
const prod='https://next-dev-team.github.io',local='http://localhost:8000';
edit('manifest.json',s=>{const m=JSON.parse(s);m.name+=' (LOCAL DEV)';m.host_permissions=['http://localhost/*'];m.content_scripts[0].matches=['http://localhost/*'];return JSON.stringify(m,null,2)+'\n';});
for(const file of ['protocol.js','content.js','background.js','panel.html'])edit(file,s=>s.replaceAll(prod+'/awesome-daily-tips/',local+'/').replaceAll(prod,local).replaceAll('/awesome-daily-tips/index.html','/index.html').replaceAll('/awesome-daily-tips/','/').replaceAll('http://localhost:8000/*','http://localhost/*'));
console.log('Load unpacked: '+dest+' — local only; production source untouched.');
