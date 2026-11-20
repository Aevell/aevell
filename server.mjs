import http from 'node:http';
import {readFile} from 'node:fs/promises';
const port=Number(process.env.PORT||4173);
const assets=new Set(['index.html','styles.css','script.js','favicon.svg','halenn-lockup.png','halenn-lockup-sharp-2x.png','geist.ttf','OFL.txt','manrope-light.ttf','Manrope-OFL.txt','robots.txt','sitemap.xml']);
const mime={html:'text/html; charset=utf-8',css:'text/css',js:'text/javascript',svg:'image/svg+xml',webp:'image/webp',png:'image/png',ttf:'font/ttf',txt:'text/plain',xml:'application/xml'};
http.createServer(async(req,res)=>{const file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';if(!assets.has(file)){res.writeHead(404);res.end('Not found');return;}try{const body=await readFile(new URL(file,import.meta.url));res.writeHead(200,{'Content-Type':mime[file.split('.').pop()]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
