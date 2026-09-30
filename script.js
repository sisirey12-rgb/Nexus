const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ls={get:(k,d)=>{try{return localStorage.getItem(k)||d}catch{return d}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
const reduceMQ=matchMedia('(prefers-reduced-motion:reduce)');
/* 12 themes: name, bg, text, muted, accent, accent2, mode */
const T={void:['#050609','#F5F7FA','#8a94a3','#00E5FF','#7C3AED','dark'],ice:['#060a10','#EAF6FF','#8aa0b5','#8DEBFF','#4f8cff','dark'],violet:['#07050c','#F3EEFF','#9a90b0','#A855F7','#00E5FF','dark'],matrix:['#040806','#E8FFF3','#7fa591','#00FF88','#00E0FF','dark'],ember:['#0a0605','#FFF3EA','#b39a8a','#FF7A2F','#FFC24B','dark'],rose:['#0a0508','#FFEFF5','#b08a98','#FF4D8D','#A855F7','dark'],
paper:['#F5F7FA','#0B0F14','#5b6675','#0066FF','#7C3AED','light'],mint:['#EFFAF5','#06221a','#4d6f62','#00A86B','#0097B2','light'],lavender:['#F4F0FF','#1a1033','#63588a','#7C3AED','#D946EF','light'],sand:['#FAF5EA','#2b1a08','#7a6a52','#C2410C','#B45309','light'],sky:['#EEF7FF','#06223a','#4a6b88','#0284C7','#4F46E5','light'],blush:['#FFF1F4','#3a0a18','#8a5a68','#E11D48','#9333EA','light']};
const st={theme:ls.get('vx-theme','void'),motion:ls.get('vx-motion','cinematic'),font:ls.get('vx-font','Space Grotesk')};
if(!T[st.theme])st.theme='void';
let col={a:'#00E5FF',b:'#7C3AED',dark:true};
function apply(){
  const t=T[st.theme],r=document.documentElement.style;
  ['bg','text','muted','accent','accent-2'].forEach((k,i)=>r.setProperty('--'+k,t[i]));r.colorScheme=t[5];
  col={a:t[3],b:t[4],dark:t[5]==='dark'};
  r.setProperty('--font',`'${st.font}',${/Mono/.test(st.font)?'monospace':'system-ui,sans-serif'}`);
  document.body.dataset.m=st.motion;
  $$('[data-group]').forEach(g=>$$('button',g).forEach(b=>b.classList.toggle('on',b.dataset.v===st[g.dataset.group])));
}
const sw=$('[data-group=theme]');
Object.entries(T).forEach(([n,t])=>{const b=document.createElement('button');b.dataset.v=n;b.title=n.toUpperCase();b.setAttribute('aria-label',n+' theme');b.style.background=`linear-gradient(135deg,${t[0]} 48%,${t[3]} 52%)`;sw.append(b)});
$$('[data-group]').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;st[g.dataset.group]=b.dataset.v;ls.set('vx-'+g.dataset.group,b.dataset.v);apply()}));
$('#hudBtn').addEventListener('click',e=>{const o=$('#hud').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)});
$$('.mnav a').forEach(a=>a.addEventListener('click',()=>$('#hud').classList.remove('open')));

/* content */
const IG='https://instagram.com/sisirey.vox',TG='https://t.me/yor_forg3r',WA='https://wa.me/918485800930';
const svc=[['WEB DESIGN','$30','Website design and development.','Website Design service ($30)'],['BACKEND / API','$19','Backend systems, REST APIs and integrations.','Backend/API service ($19)'],['AUTOMATION BOTS','$15','Telegram bots, Discord bots and workflow automation.','Automation Bots service ($15)'],['CREATIVE VIDEO EDITING','$20','Creative video editing, motion design and digital content.','Creative Video Editing ($20)']];
$('#svc').innerHTML=svc.map(s=>`<article class="card rv" data-tilt><h3 class="mono">${s[0]}</h3><p class="price">${s[1]}</p><p>${s[2]}</p><button class="btn solid" data-open data-svc="${s[3]}">BUY / START PROJECT ↗</button></article>`).join('');
const cap=[['WEB','Websites, web apps, dashboards and e-commerce.'],['AI','Assistants, agents and AI integrations.'],['APIs','REST APIs, authentication and databases.'],['AUTOMATION','Telegram and Discord bots, workflows, pipelines.'],['CREATIVE','UI/UX, branding, motion and video.']];
$('#cap').innerHTML=cap.map(c=>`<article class="card rv" data-tilt><h3 class="mono">${c[0]}</h3><p class="big">${c[0]}</p><p>${c[1]}</p></article>`).join('');
const faq=[['Are the prices fixed?','No. They are starting prices and the final price depends on your project requirements.'],['How do I start a project?','Press START A PROJECT and choose Instagram, Telegram or WhatsApp. Tell us what you need.'],['What does VOXX NEXUS build?','Websites, AI systems, APIs, automation bots and creative digital content.'],['Can I request something custom?','Yes. Message us on any channel with your idea.']];
$('#acc').innerHTML=faq.map(f=>`<details class="rv"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('');
const ic={i:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',t:'<path d="M21 4 3 11l6 2 2 6 3-4 5 3L21 4z"/>',w:'<path d="M3 21l1.6-4.6A9 9 0 1 1 8 19.6z"/><path d="M9 8.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-.8.8c-.8-.4-1.6-1.2-2-2l.8-.8-1-2z"/>'};
$('#ct').innerHTML=[['INSTAGRAM','@sisirey.vox',IG,'i'],['TELEGRAM','@yor_forg3r',TG,'t'],['WHATSAPP','+91 8485800930',WA,'w']].map(c=>`<a class="card contact rv" data-tilt href="${c[2]}" target="_blank" rel="noopener" aria-label="Open ${c[0]} ${c[1]}"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${ic[c[3]]}</svg><h3 class="mono">${c[0]}</h3><p class="handle">${c[1]}</p><span class="go mono">OPEN ${c[0]} ↗</span></a>`).join('');
$$('.hero-copy>*,.hero-card,h2,.label,.note,.flow').forEach(e=>e.classList.add('rv'));

/* reveal with stagger */
$$('section').forEach(s=>$$('.rv',s).forEach((e,i)=>e.style.setProperty('--i',i)));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(e=>io.observe(e));

/* chooser */
const dlg=$('#chooser');
document.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(!b)return;const s=b.dataset.svc,m=s?`Hi VOXX NEXUS, I'm interested in the ${s}.`:`Hi VOXX NEXUS, I'd like to start a project.`;
  $('#chSvc').textContent=s?s.toUpperCase():'NEW PROJECT';$('#chIg').href=IG;$('#chTg').href=TG;$('#chWa').href=WA+'?text='+encodeURIComponent(m);dlg.showModal()});
$('#chClose').addEventListener('click',()=>dlg.close());dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});

/* 3D tilt */
$$('[data-tilt]').forEach(c=>{const set=(k,v)=>c.style.setProperty(k,v);
  c.addEventListener('pointermove',e=>{if(reduceMQ.matches||e.pointerType==='touch')return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.classList.add('hot');set('--ry',(x-.5)*16+'deg');set('--rx',(.5-y)*16+'deg');set('--px',x-.5);set('--py',y-.5);set('--mx',x*100+'%');set('--my',y*100+'%')});
  const off=()=>{c.classList.remove('hot');set('--rx','0deg');set('--ry','0deg');set('--px',0);set('--py',0)};
  c.addEventListener('pointerleave',off);c.addEventListener('pointercancel',off)});

/* energy beam (canvas 2D) */
const cv=$('#beam'),g=cv.getContext('2d');let W,H,D,ps=[],mx=0,my=0,sy=0;
const SPEED={cinematic:.55,smooth:1,default:1.5};
function size(){D=Math.min(devicePixelRatio||1,innerWidth<768?1:1.5);W=cv.width=innerWidth*D;H=cv.height=innerHeight*D;
  const n=innerWidth<768?70:170;ps=Array.from({length:n},()=>({o:(Math.random()+Math.random()+Math.random()-1.5)*.22,y:Math.random()*H,v:.4+Math.random()*1.4,r:.6+Math.random()*1.8,p:Math.random()*6.28,k:Math.random()<.3}))}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
addEventListener('scroll',()=>{sy=scrollY;cv.style.transform=`translateY(${-sy*.12}px)`;cv.style.opacity=Math.max(.3,1-sy/(innerHeight*1.4))},{passive:true});
let vis=true;document.addEventListener('visibilitychange',()=>vis=!document.hidden);
let bx=0,t0=performance.now();
function frame(now){requestAnimationFrame(frame);if(!vis)return;const dt=Math.min(now-t0,50)/16.7;t0=now;const t=now/1000*SPEED[st.motion],still=reduceMQ.matches;
  const tx=(innerWidth<900?.5:.72)*W+mx*40*D;bx+=(tx-bx)*.05;
  g.clearRect(0,0,W,H);g.globalCompositeOperation=col.dark?'lighter':'source-over';
  const path=(w,a,c)=>{g.beginPath();for(let y=-10;y<=H+10;y+=14){const x=bx+Math.sin(y*.008/D+t*1.2)*14*D+Math.sin(y*.02/D-t*2)*5*D;y<0?g.moveTo(x,y):g.lineTo(x,y)}g.lineWidth=w*D;g.globalAlpha=a;g.strokeStyle=c;g.lineCap='round';g.stroke()};
  const a=col.dark?1:.6;path(150,.05*a,col.b);path(70,.1*a,col.a);path(26,.22*a,col.a);path(8,.75*a,col.dark?'#ffffff':col.b);path(2.5,.95,col.dark?'#ffffff':col.a);
  ps.forEach((p,i)=>{if(!still)p.y-=p.v*SPEED[st.motion]*D*dt;if(p.y<-10)p.y=H+10;const x=bx+p.o*W*.6+Math.sin(t*1.5+p.p+p.y*.004)*22*D;g.globalAlpha=(.25+.6*Math.abs(Math.sin(t+p.p)))*(col.dark?1:.7);g.fillStyle=p.k?col.b:col.a;g.beginPath();g.arc(x,p.y,p.r*D,0,6.283);g.fill()});
  g.globalAlpha=1}
apply();requestAnimationFrame(frame);
