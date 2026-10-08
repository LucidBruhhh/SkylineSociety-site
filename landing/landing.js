// One progress value controls both the camera move and the expanding reflection.
// The full-resolution reflection is always separate from the cabin, never a
// screenshot enlarged from its tiny initial size. No wheel/touch interception.
const root=document.documentElement;
const journey=document.querySelector('.journey'),viewport=document.querySelector('.viewport');
const cabin=document.querySelector('.cabin'),mirror=document.querySelector('.mirror');
const intro=document.querySelector('.intro'),cue=document.querySelector('.scroll-cue');
const arrival=document.querySelector('.arrival'),bar=document.querySelector('.progress i');
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>v*v*(3-2*v);
const mix=(a,b,t)=>a+(b-a)*t;
let scheduled=false,metrics,lastProgress=-1;
function measure(){
 const w=viewport.clientWidth,h=viewport.clientHeight;
 metrics={w,h,top:journey.getBoundingClientRect().top+scrollY,distance:Math.max(1,journey.offsetHeight-h)};
 lastProgress=-1;request();
}
function render(){
 scheduled=false;
 if(!metrics)return;
 const {w,h}=metrics;
 const mobile=w<650;
 // Portrait: crop towards the centre/right to retain the mirror and gauges.
 const base=mobile?Math.max(w/1020,h/1080):Math.max(w/1440,h/1080);
 const x0=mobile?w*.5-780*base:(w-1440*base)/2;
 const y0=0;
 const p=preference.matches?0:clamp((scrollY-metrics.top)/metrics.distance);
 if(p===lastProgress)return;
 lastProgress=p;
 const t=smooth(clamp((p-.09)/.77));
 const mx=641,my=145,mw=282,mh=84;
 const startX=x0+mx*base,startY=y0+my*base,startW=mw*base,startH=mh*base;
 // Zoom around the mirror, then widen its aperture into the full photograph.
 const left=mix(startX,0,t),top=mix(startY,0,t);
 const width=mix(startW,w,t),height=mix(startH,h,t);
 const cameraScale=width/mw;
 // Keep the photographed mirror and the replacement reflection registered.
 // Its aperture unfolds vertically while the cabin moves towards that mirror.
 const focusX=left-mx*cameraScale,focusY=top-my*cameraScale;
 cabin.style.transform=`translate(${focusX}px,${focusY}px) scale(${cameraScale})`;
 cabin.style.opacity=1-smooth(clamp((t-.7)/.3));
 mirror.style.left='0';
 mirror.style.top='0';
 mirror.style.transform=`translate3d(${left}px,${top}px,0)`;
 mirror.style.width=`${width}px`;
 mirror.style.height=`${height}px`;
 mirror.style.borderRadius=`${mix(13*base,0,t)}px`;
 mirror.style.outlineWidth=`${mix(5*base,0,t)}px`;
 const out=1-smooth(clamp(p/.18));
 intro.style.opacity=out;intro.style.visibility=out<.01?'hidden':'visible';
 cue.style.opacity=out;cue.style.visibility=out<.01?'hidden':'visible';
 const inside=smooth(clamp((p-.84)/.12));
 arrival.style.opacity=inside;arrival.style.visibility=inside>.01?'visible':'hidden';
 bar.style.transform=`scaleX(${p})`;
 viewport.dataset.progress=p.toFixed(3);
}
function request(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
function mode(){root.classList.add('enhanced');root.classList.toggle('no-motion',preference.matches);measure()}
addEventListener('scroll',request,{passive:true});addEventListener('resize',measure);preference.addEventListener('change',mode);
new ResizeObserver(measure).observe(viewport);
mode();render();
