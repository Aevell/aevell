import {mkdir,copyFile} from 'node:fs/promises';
const assets=['index.html','styles.css','script.js','favicon.svg','halenn-lockup.png','halenn-lockup-sharp-2x.png','geist.ttf','OFL.txt','manrope-light.ttf','Manrope-OFL.txt','robots.txt','sitemap.xml'];
await mkdir('dist',{recursive:true});
for(const asset of assets) await copyFile(asset,`dist/${asset}`);
console.log(`Built ${assets.length} static assets in dist/`);
