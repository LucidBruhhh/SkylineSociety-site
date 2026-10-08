'use strict';
document.documentElement.classList.add('js');
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-nav');
if(toggle&&nav){
 const close=()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open')};
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});
 nav.addEventListener('click',event=>{if(event.target.closest('a'))close()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus()}});
}
const items=[...document.querySelectorAll('[data-photo]')];
const search=document.querySelector('#archive-search'),filters=[...document.querySelectorAll('[data-filter]')];
let filter='all';
function applyFilter(){
 const query=(search?.value||'').trim().toLowerCase();let count=0;
 for(const item of items){const match=(filter==='all'||item.dataset.category.split(' ').includes(filter))&&item.textContent.toLowerCase().includes(query);item.hidden=!match;if(match)count++}
 const result=document.querySelector('#result-count');if(result)result.textContent=`${count} ${count===1?'photograph':'photographs'}`;
 const empty=document.querySelector('#empty-result');if(empty)empty.hidden=count>0;
}
for(const button of filters)button.addEventListener('click',()=>{filter=button.dataset.filter;for(const b of filters)b.setAttribute('aria-pressed',String(b===button));applyFilter()});
search?.addEventListener('input',applyFilter);
const dialog=document.querySelector('#photo-dialog');
if(dialog&&typeof dialog.showModal==='function'){
 let opener,index=0,links=[];
 const image=document.querySelector('#dialog-image');
 function show(next){index=(next+links.length)%links.length;const link=links[index];image.src=link.href;image.alt=link.querySelector('img').alt;document.querySelector('#photo-title').textContent=image.alt;document.querySelector('#photo-credit').textContent=link.dataset.credit;document.querySelector('#photo-count').textContent=`${index+1} / ${links.length}`}
 document.querySelectorAll('.photo-open').forEach(link=>link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();opener=link;
  links=[...document.querySelectorAll('.photo-open')].filter(a=>!a.closest('[hidden]'));show(links.indexOf(link));dialog.showModal();
 }));
 document.querySelector('#close-photo').addEventListener('click',()=>dialog.close());
 document.querySelector('#previous-photo').addEventListener('click',()=>show(index-1));
 document.querySelector('#next-photo').addEventListener('click',()=>show(index+1));
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();show(index+1)}if(event.key==='ArrowLeft'){event.preventDefault();show(index-1)}});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
 dialog.addEventListener('close',()=>opener?.focus());
}
const form=document.querySelector('#build-draft');
form?.addEventListener('submit',event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const values=new FormData(form);
 const text=['SKYLINE SOCIETY — BUILD STORY DRAFT','',`Public name: ${values.get('name')}`,`Car: ${values.get('car')}`,'','THE STORY',values.get('story'),'','PHOTO CREDITS & PERMISSIONS',values.get('credits')||'To add','', 'Prepared locally. Nothing has been sent to Skyline Society.'].join('\n');
 const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='skyline-society-build-story.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 document.querySelector('#draft-status').textContent='Your draft download is ready. Nothing has been submitted. You can share it with the Society when you’re ready.';
});
