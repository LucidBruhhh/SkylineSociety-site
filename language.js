(()=>{'use strict';
 const dictionary=window.SKYLINE_JA||{},textRecords=new WeakMap(),attributeRecords=new WeakMap(),linkRecords=new WeakMap();
 const normalize=s=>s.replace(/\s+/g,' ').trim();let language=new URL(location.href).searchParams.get('lang')==='ja'?'ja':'en';
 const translate=s=>{const key=normalize(s);if(Object.hasOwn(dictionary,key))return dictionary[key];const count=key.match(/^(\d+) photographs?$/);if(count)return '写真'+count[1]+'枚';if(key.startsWith('Enlarge photograph: '))return '写真を拡大：'+translate(key.slice(19));return s};
 function transform(original){if(language==='en')return original;const replacement=translate(original);return original.replace(original.trim(),replacement)}
 function recordText(node){const previous=textRecords.get(node);const original=previous&&node.nodeValue===previous.last?previous.original:node.nodeValue;const next=transform(original);if(node.nodeValue!==next)node.nodeValue=next;textRecords.set(node,{original,last:next});}
 function recordAttribute(el,name){if(!el.hasAttribute(name))return;let records=attributeRecords.get(el);if(!records){records={};attributeRecords.set(el,records)}const value=el.getAttribute(name),previous=records[name],original=previous&&value===previous.last?previous.original:value,next=transform(original);if(value!==next)el.setAttribute(name,next);records[name]={original,last:next};}
 function preserveLanguage(link){const value=link.getAttribute('href');if(!value)return;const previous=linkRecords.get(link),original=previous&&value===previous.last?previous.original:value;let next=original;try{const url=new URL(original,location.href);if(url.origin===location.origin&&!/\.(?:webp|png|jpe?g|svg|mp4|webm|txt|pdf)$/i.test(url.pathname)&&!url.pathname.startsWith('/concepts/')&&url.pathname!=='/designs.html'){if(language==='ja')url.searchParams.set('lang','ja');else url.searchParams.delete('lang');next=url.pathname+url.search+url.hash}}catch{}if(value!==next)link.setAttribute('href',next);linkRecords.set(link,{original,last:next});}
 let scheduled=false;const observer=new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(()=>{scheduled=false;apply()})}});
 function apply(){observer.disconnect();document.documentElement.lang=language==='ja'?'ja':'en-AU';
 const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement&&!node.parentElement.closest('script,style,noscript,.language-control')&&normalize(node.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});let node;while(node=walker.nextNode())recordText(node);
 document.querySelectorAll('[alt],[aria-label],[title],[placeholder]').forEach(el=>{if(!el.closest('.language-control'))for(const attr of ['alt','aria-label','title','placeholder'])recordAttribute(el,attr)});
 document.querySelectorAll('meta[name="description"],meta[property="og:description"]').forEach(el=>recordAttribute(el,'content'));
 document.querySelectorAll('a[href]').forEach(preserveLanguage);
 document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
 observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['alt','aria-label','title','placeholder','href']});}
 function choose(next){language=next==='ja'?'ja':'en';const url=new URL(location.href);if(language==='ja')url.searchParams.set('lang','ja');else url.searchParams.delete('lang');history.replaceState(null,'',url);apply();window.dispatchEvent(new Event('resize'));}
 document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.language)));
 window.addEventListener('popstate',()=>{language=new URL(location.href).searchParams.get('lang')==='ja'?'ja':'en';apply()});
 window.SkylineLanguage={get current(){return language},translate};apply();
})();
