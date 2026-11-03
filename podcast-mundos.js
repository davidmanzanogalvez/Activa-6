/* ACTIVA 6.º: pódcast de cada mundo, sin alterar actividades ni progreso. */
(()=>{
'use strict';
const episodes=[{"title": "Francia, tenemos un problema…", "src": "podcast/audio/01.mp3"}, {"title": "Napoleón: de soldado de la Revolución a emperador", "src": "podcast/audio/02.mp3"}, {"title": "Las máquinas lo cambiaron todo", "src": "podcast/audio/03.mp3"}, {"title": "¿Quién cuidaba de los que movían las máquinas?", "src": "podcast/audio/04.mp3"}, {"title": "¿Quién decidió repartirse el mundo?", "src": "podcast/audio/05.mp3"}, {"title": "Una chispa, una guerra y una revolución", "src": "podcast/audio/06.mp3"}, {"title": "¿Cómo volvió el mundo a la guerra?", "src": "podcast/audio/07.mp3"}, {"title": "Un mundo dividido y pueblos que querían decidir", "src": "podcast/audio/08.mp3"}];
const standalone=Number((document.title.match(/Mundo\s+(\d+)/i)||[])[1])||0;
const positions=new Map(), players=new Set();
const style=document.createElement('style');
style.textContent=`
.activa-podcast{width:100%;min-width:0;box-sizing:border-box;border:1px solid #cce5eb;border-radius:13px;padding:11px 13px;background:#f0f9fb;text-align:left;color:#164958;margin:12px 0 0;flex-shrink:0}
.activa-podcast .podcast-label{display:block;font:800 10px/1.3 system-ui,sans-serif;letter-spacing:.1em;color:#087d99;margin-bottom:4px}
.activa-podcast .podcast-title{display:block;font:700 14px/1.35 system-ui,sans-serif;letter-spacing:0;color:#164958;margin:0 0 8px;min-height:0}
.activa-podcast audio{display:block;width:100%;height:36px;min-width:0}
.activa-podcast .podcast-error{font:12px/1.4 system-ui,sans-serif;color:#8d3028;margin:8px 0 0}
.activa-podcast [hidden]{display:none!important}
#industrial-root .master-world-left:has(.activa-podcast),#nap-root .master-world-left:has(.activa-podcast){flex-direction:column;gap:0}
#industrial-root .master-world-left:has(.activa-podcast) .master-approved-scene,#nap-root .master-world-left:has(.activa-podcast) .master-approved-scene{max-height:30vh;height:30vh;object-fit:contain}
#interior #screen-menu .world-activity-banner:has(.activa-podcast) img{max-height:30vh!important;object-fit:contain}
@media(max-width:700px){.activa-podcast{padding:10px;margin-top:10px}.activa-podcast .podcast-title{font-size:13px}#industrial-root .master-world-left:has(.activa-podcast) .master-approved-scene,#nap-root .master-world-left:has(.activa-podcast) .master-approved-scene{height:160px;max-height:160px}#interior #screen-menu .world-activity-banner:has(.activa-podcast) img{max-height:180px!important}}
`;
document.head.append(style);
function visible(el){return el.isConnected&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'}
function mount(target,n){
 if(!target||target.querySelector('.activa-podcast')||!episodes[n-1])return;
 const ep=episodes[n-1],box=document.createElement('section');box.className='activa-podcast';box.setAttribute('aria-label','Pódcast del mundo '+n);box.dataset.episode=n;
 const label=document.createElement('span');label.className='podcast-label';label.textContent='ESCUCHA LA HISTORIA';
 const title=document.createElement('strong');title.className='podcast-title';title.textContent=ep.title;
 const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.setAttribute('controlslist','nodownload');audio.setAttribute('aria-label','Escuchar: '+ep.title);
 audio.src=location.protocol==='file:'?'https://davidmanzanogalvez.github.io/Activa-6/'+ep.src:ep.src;
 const error=document.createElement('p');error.className='podcast-error';error.hidden=true;error.setAttribute('role','status');error.textContent='No se ha podido cargar el audio. Comprueba tu conexión y vuelve a intentarlo.';
 audio.addEventListener('error',()=>{error.hidden=false});
 audio.addEventListener('loadedmetadata',()=>{const time=positions.get(n)||0;if(time>0&&time<audio.duration)audio.currentTime=time});
 audio.addEventListener('timeupdate',()=>positions.set(n,audio.currentTime));
 audio.addEventListener('pause',()=>positions.set(n,audio.currentTime));
 audio.addEventListener('play',()=>{error.hidden=true;players.forEach(p=>{if(p!==audio)p.pause()})});
 box.append(label,title,audio,error);target.append(box);players.add(audio);
}
let scheduled=false;
function refresh(){
 scheduled=false;
 if(standalone)mount(document.querySelector('#industrial-root .master-world-left'),standalone);
 else{mount(document.querySelector('#screen-menu .world-activity-banner'),1);mount(document.querySelector('#nap-root .master-world-left'),2);mount(document.querySelector('#industrial-root .master-world-left'),3)}
 players.forEach(a=>{if(!visible(a))a.pause();if(!a.isConnected)players.delete(a)});
}
const observer=new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(refresh)}});
observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','style']});
window.addEventListener('pagehide',()=>players.forEach(a=>a.pause()));
refresh();
})();
