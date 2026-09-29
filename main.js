(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'), clamp=v=>Math.max(0,Math.min(1,v));
const menu=$('#menu'),toggle=$('.menu-button'),close=$('.menu-close');
toggle.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true');close.focus();});
close.addEventListener('click',()=>menu.close());
menu.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');toggle.focus();});
function go(hash){if(hash==='#philosophy'&&!reduced.matches){window.scrollTo({top:innerHeight*1.4,behavior:'smooth'});return;}document.querySelector(hash)?.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}
menu.querySelectorAll('a').forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();menu.close();requestAnimationFrame(()=>go(a.getAttribute('href')));});a.addEventListener('pointerenter',()=>{if(a.dataset.photo)swapMenu(a.dataset.photo)});a.addEventListener('focus',()=>{if(a.dataset.photo)swapMenu(a.dataset.photo)});});
function swapMenu(src){const im=$('.menu-photo');if(im.getAttribute('src')==='assets/'+src)return;im.src='assets/'+src;if(!reduced.matches)im.animate([{opacity:.2,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:800,easing:'ease-out'});}
const detail=$('#detail'),box=$('.detail-content');let opener=null;
const data=fetch('details.json?v=1.0').then(r=>{if(!r.ok)throw Error('details');return r.json();});
$$('[data-detail]').forEach(button=>button.addEventListener('click',async()=>{
 opener=button;try{const d=(await data)[button.dataset.detail];box.replaceChildren();
 const label=document.createElement('p');label.className='small';label.textContent=d.label;
 const title=document.createElement('h2');title.id='detail-title';title.textContent=d.title;
 const im=document.createElement('img');im.src='assets/'+d.image;im.alt='住まい・仕事の素材イメージ';
 const p=document.createElement('p');p.textContent=d.text;
 const note=document.createElement('p');note.className='small';note.textContent='架空の企業情報を使用したデザインサンプルです。写真は素材イメージです。';
 box.append(label,title,im,p,note);detail.showModal();detail.scrollTop=0;$('.detail-close').focus();
 }catch(e){box.textContent='表示を読み込めませんでした。ページを再読み込みしてください。';detail.showModal();}
}));
$('.detail-close').addEventListener('click',()=>detail.close());detail.addEventListener('close',()=>opener?.focus({preventScroll:true}));
detail.addEventListener('click',e=>{const r=detail.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)detail.close();});
const track=$('.job-track'),prev=$('[data-prev]'),next=$('[data-next]');
function controls(){prev.disabled=track.scrollLeft<5;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-5;}
function advance(sign){track.scrollBy({left:sign*(track.querySelector('.job-card').getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap)),behavior:reduced.matches?'instant':'smooth'});}
prev.addEventListener('click',()=>advance(-1));next.addEventListener('click',()=>advance(1));track.addEventListener('scroll',controls,{passive:true});addEventListener('resize',controls);controls();
const tiles=$$('.tile'),hero=$('.hero'),collage=$('.collage'),message=$('.hero-message'),heading=$('.hero-message h1'),copy=$('.message-copy'),bg=$('.soft-bg');
const start=performance.now();let opening=true;
function render(now){
 if(reduced.matches){collage.style.opacity='1';message.style.opacity='1';bg.style.opacity='0';tiles.forEach(x=>{x.style.transform='none';x.style.opacity='1';});return;}
 const h=innerHeight,y=scrollY,t=Math.min(1,(now-start)/3400),ease=1-Math.pow(1-t,4),fade=1-clamp(y/(h*.72));
 collage.style.opacity=String(fade);collage.style.transform=`translateY(${-y*.28}px)`;
 if(opening){tiles.forEach((tile,i)=>{if(i===3){tile.style.transform=`scale(${1+(1-ease)*2.65})`;tile.style.opacity='1';}else{const direction=i===4?1:-1;const stagger=clamp((t-.08*(i%3))/.75);tile.style.transform=`translateY(${direction*(1-stagger)*h*1.1}px)`;tile.style.opacity=String(stagger);}});if(t===1)opening=false;}
 bg.style.opacity=String(clamp(y/h));message.style.opacity='1';
 const a=clamp((y/h-.35)/.5),c=clamp((y/h-.65)/.65);
 heading.style.opacity=String(a);heading.style.transform=`translateY(${(1-a)*25}px)`;
 copy.style.opacity=String(c);copy.style.transform=`translateY(${(1-c)*25}px)`;
 message.style.pointerEvents=c>.75?'auto':'none';copy.inert=c<.75;
 $('.scroll-cue').style.opacity=String(1-clamp(y/h));
 if(opening)requestAnimationFrame(render);
}
let pending=false;function update(){if(!pending){pending=true;requestAnimationFrame(t=>{render(t);pending=false;});}}
addEventListener('scroll',update,{passive:true});addEventListener('resize',update);reduced.addEventListener('change',()=>location.reload());requestAnimationFrame(render);
if(location.hash==='#philosophy')requestAnimationFrame(()=>go('#philosophy'));
const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;observer.unobserve(target);if(reduced.matches)return;if(target.classList.contains('en')){target.animate([{filter:'blur(3px)',opacity:.3},{filter:'blur(0)',opacity:1}],{duration:1700,easing:'cubic-bezier(.2,.6,.35,1)'});}else{target.animate([{transform:'translateY(30px)',opacity:.2},{transform:'none',opacity:1}],{duration:1000,easing:'cubic-bezier(.2,.6,.35,1)'});}}),{threshold:.07});
$$('.service-card,.en,.values li').forEach(e=>observer.observe(e));
const hint=$('.cursor-hint');let x=0,y=0,tx=0,ty=0,active=false;
$$('.photo-link').forEach(el=>{el.addEventListener('pointerenter',e=>{if(e.pointerType!=='mouse'||reduced.matches)return;active=true;tx=x=e.clientX;ty=y=e.clientY;hint.style.display='block';cursor();});el.addEventListener('pointerleave',()=>{active=false;hint.style.display='none'});el.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;});});
function cursor(){if(!active)return;x+=(tx-x)*.16;y+=(ty-y)*.16;hint.style.left=x+'px';hint.style.top=y+'px';requestAnimationFrame(cursor);}
})();
