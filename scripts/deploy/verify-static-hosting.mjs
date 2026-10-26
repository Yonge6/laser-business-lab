import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn, spawnSync} from 'node:child_process';
import {createServer} from 'node:net';

const [config, staging] = process.argv.slice(2);
if (!config || !staging) throw new Error('Usage: verify-static-hosting.mjs CONFIG STAGING_DIRECTORY');
const fixture = await fs.mkdtemp(path.join(staging, 'maker-nginx-fixture-'));
let nginx;
try {
  const root=path.join(fixture,'out');
  const files={'index.html':'MAKER_HOME','404.html':'NOT_FOUND', 'radar/2026-09-27/index.html':'RADAR', 'calculator/laser-roi/index.html':'ROI','robots.txt':'ROBOTS','_next/static/chunks/app.js':'ASSET','operations/latest.json':'{}'};
  for(const [name,body] of Object.entries(files)){const file=path.join(root,name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,body);}
  await fs.mkdir(path.join(root,'empty-directory'));
  const port=await new Promise((resolve,reject)=>{const server=createServer();server.on('error',reject);server.listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port));});});
  await fs.writeFile(path.join(fixture,'nginx.conf'),`daemon off; master_process off; pid ${fixture}/nginx.pid; error_log ${fixture}/error.log; events {worker_connections 32;} http {access_log off; server {listen 127.0.0.1:${port}; server_name localhost; root ${root}; include ${path.resolve(config)};}}`);
  const bin=process.env.NGINX_BINARY || 'nginx';
  const args=['-p',fixture+'/', '-c',path.join(fixture,'nginx.conf')];
  const syntax=spawnSync(bin,[...args,'-t'],{encoding:'utf8'});assert.equal(syntax.status,0,syntax.stderr);
  nginx=spawn(bin,args,{stdio:'ignore'});
  const origin=`http://127.0.0.1:${port}`;
  for(let n=0;n<50;n++){try{if((await fetch(origin)).ok)break;}catch{} await new Promise(r=>setTimeout(r,100));}
  const cases=[['/',200],['/radar/2026-09-27/',200],['/radar/2026-09-27',308,'/radar/2026-09-27/'],['/calculator/laser-roi?utm_source=pinterest&ct=trial',308,'/calculator/laser-roi/?utm_source=pinterest&ct=trial'],['/calculator/laser-roi/',200],['/robots.txt',200],['/_next/static/chunks/app.js',200],['/operations/latest.json',200],['/missing',404],['/missing/',404],['/empty-directory',404],['/empty-directory/',404],['/_next/static/chunks/missing.js',404],['/operations/missing.json',404],['/404.html',404]];
  for(const [route,status,target] of cases){const r=await fetch(origin+route,{redirect:'manual'});assert.equal(r.status,status,route);if(target)assert.equal(new URL(r.headers.get('location'),origin).href,origin+target);if(status===404)assert.equal(await r.text(),'NOT_FOUND');console.log('HTTP_OK',status,route);}
  const head=await fetch(origin+'/radar/2026-09-27?ct=trial',{method:'HEAD',redirect:'manual'});assert.equal(head.status,308);assert.equal(new URL(head.headers.get('location'),origin).href,origin+'/radar/2026-09-27/?ct=trial');
  console.log('NGINX_FIXTURE_PASS',cases.length+1);
} finally {
  if(nginx && nginx.exitCode===null){await new Promise(resolve=>{nginx.once('exit',resolve);nginx.kill('SIGTERM');});}
  await fs.rm(fixture,{recursive:true,force:true});
}
