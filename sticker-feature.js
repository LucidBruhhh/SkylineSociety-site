const feature=document.querySelector('.sticker-feature');
if(feature){
 feature.addEventListener('keydown',event=>{if(event.key==='Escape')feature.classList.add('sf-hide-labels');else if(event.key==='Tab')feature.classList.remove('sf-hide-labels')});
 feature.addEventListener('pointermove',()=>feature.classList.remove('sf-hide-labels'));
}
