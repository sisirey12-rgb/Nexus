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
  ['pointermove','pointerdown'].forEach(ev=>c.addEventListener(ev,e=>{if(reduceMQ.matches)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.classList.add('hot');set('--ry',(x-.5)*16+'deg');set('--rx',(.5-y)*16+'deg');set('--px',x-.5);set('--py',y-.5);set('--mx',x*100+'%');set('--my',y*100+'%')}));
  const off=()=>{c.classList.remove('hot');set('--rx','0deg');set('--ry','0deg');set('--px',0);set('--py',0)};
  c.addEventListener('pointerleave',off);c.addEventListener('pointerup',off);c.addEventListener('pointercancel',off)});

/* energy beam: 3D helix + spiral galaxy, rotated by scroll position (fully reversible) */
const cv=$('#beam'),g=cv.getContext('2d');
let W,H,D,gal=[],fl=[],mx=0,my=0,sm=0,vs=0,lastY=scrollY,spKey='',spr={},vis=true,bx=0,t0=performance.now();
const SPEED={cinematic:.55,smooth:1,default:1.5},K={cinematic:.05,smooth:.1,default:.22};
function mk(c){const s=document.createElement('canvas');s.width=s.height=48;const x=s.getContext('2d'),q=[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),r=x.createRadialGradient(24,24,0,24,24,24);
  r.addColorStop(0,'#fff');r.addColorStop(.25,c);r.addColorStop(1,`rgba(${q},0)`);x.fillStyle=r;x.fillRect(0,0,48,48);return s}
function size(){D=Math.min(devicePixelRatio||1,innerWidth<768?1.25:2);W=cv.width=innerWidth*D;H=cv.height=innerHeight*D;
  const n=innerWidth<768?600:1600,R=Math.min(W*.6,H*.8);
  gal=Array.from({length:n},(_,i)=>{const u=Math.pow(Math.random(),.65);return{r:u*R,a:(i%3)*2.094+u*5+(Math.random()-.5)*.5,h:(Math.random()-.5)*R*.07*(1-u*.6),s:.4+Math.random()*1.1,k:Math.random()<.3||u>.6,w:1/Math.sqrt(u+.15)}});
  fl=Array.from({length:innerWidth<768?60:150},()=>({o:(Math.random()+Math.random()+Math.random()-1.5)*.2,y:Math.random()*H,v:.4+Math.random()*1.4,s:.5+Math.random(),p:Math.random()*6.28,k:Math.random()<.3}))}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
document.addEventListener('visibilitychange',()=>vis=!document.hidden);
/* scroll-linked 3D card motion: position + velocity driven, so scrolling up reverses it */
const cards=$$('.card'),cst=cards.map(()=>({rx:0,ry:0,z:0,a:0}));
function cardFx(punch,still){const vh=innerHeight,k=K[st.motion]*2+.05,rs=cards.map(c=>c.getBoundingClientRect());
  cards.forEach((c,i)=>{const r=rs[i],d=Math.max(-1.4,Math.min(1.4,(r.top+r.height/2-vh/2)/vh)),o=cst[i],a=Math.max(0,1-Math.abs(d)*1.3),sg=i%2?1:-1;
    o.rx+=((still?0:-d*26+vs*.3)-o.rx)*k;o.ry+=((still?0:sg*d*12+vs*.1)-o.ry)*k;o.z+=((still?0:a*40+punch*60)-o.z)*k;o.a+=(a-o.a)*k;
    const th=Math.hypot(o.rx,o.ry);
    c.style.rotate=th>.02?`${o.rx.toFixed(3)} ${o.ry.toFixed(3)} 0 ${th.toFixed(2)}deg`:'none';
    c.style.translate=`0 0 ${o.z.toFixed(1)}px`;c.style.scale=(1+punch*.05*o.a).toFixed(3);c.style.setProperty('--act',o.a.toFixed(3))})}
function frame(now){requestAnimationFrame(frame);if(!vis)return;
  const dt=Math.min(now-t0,50)/16.7;t0=now;const still=reduceMQ.matches,sp=SPEED[st.motion],t=now/1000*sp;
  const max=Math.max(1,document.body.scrollHeight-innerHeight);sm+=(scrollY/max-sm)*K[st.motion];
  vs+=((scrollY-lastY)-vs)*.12;lastY=scrollY;const punch=Math.min(Math.abs(vs)/50,1);
  cardFx(punch,still);
  const key=col.a+col.b+col.dark;if(key!==spKey){spKey=key;spr.a=mk(col.a);spr.b=mk(col.b);spr.w=mk(col.dark?'#ffffff':col.a)}
  const tx=(innerWidth<900?.5:.72)*W+mx*40*D;bx+=(tx-bx)*.05;const cx=bx,cy=H*.5;
  const th=sm*Math.PI*5+(still?0:t*.2),pitch=.9+Math.sin(sm*Math.PI*3)*.45+vs*.004,ct=Math.cos(th),st_=Math.sin(th),cp=Math.cos(pitch),sp_=Math.sin(pitch);
  g.clearRect(0,0,W,H);g.globalCompositeOperation=col.dark?'lighter':'source-over';g.lineCap='round';const al=col.dark?1:.6;
  /* core beam + helix strands (rotate with scroll) */
  const path=(w,a,c)=>{g.beginPath();for(let y=-10;y<=H+10;y+=14){const x=cx+Math.sin(y*.008/D+t*1.2)*14*D+Math.sin(y*.02/D-t*2)*5*D;y<0?g.moveTo(x,y):g.lineTo(x,y)}g.lineWidth=w*D;g.globalAlpha=a;g.strokeStyle=c;g.stroke()};
  path(170,.05*al,col.b);path(80,.1*al,col.a);path(28,.22*al,col.a);path(8,.8*al,col.dark?'#ffffff':col.b);path(2.5,.95,col.dark?'#ffffff':col.a);
  for(let s=0;s<6;s++){const Rr=(24+s*15)*D*(1+punch*.4),ph=s*1.047;g.beginPath();
    for(let y=-10;y<=H+10;y+=16){const a=th*1.6+y*.006/D+ph+(still?0:t*.8),X=Rr*Math.cos(a),Z=Rr*Math.sin(a),k=500*D/(500*D+Z),x=cx+X*k;y<0?g.moveTo(x,y):g.lineTo(x,y)}
    g.lineWidth=(1.2+s*.15)*D;g.globalAlpha=.4*al;g.strokeStyle=s%2?col.b:col.a;g.stroke()}
  /* spiral galaxy disc around the beam: rotates + pitches with scroll */
  const F=Math.min(W*.6,H*.8)*1.7;
  for(const p of gal){const an=p.a+(still?0:t*.35*p.w),X=p.r*Math.cos(an),Y=p.h,Z=p.r*Math.sin(an),X1=X*ct+Z*st_,Z1=-X*st_+Z*ct,Y2=Y*cp-Z1*sp_,Z2=Y*sp_+Z1*cp,k=F/(F+Z2);
    const sz=p.s*D*3.2*k*(1+punch*.6);g.globalAlpha=Math.min(1,.25+.6*k*k)*al;g.drawImage(p.k?spr.b:spr.a,cx+X1*k*(1+punch*.2)-sz,cy+Y2*k-sz,sz*2,sz*2)}
  /* vertical plasma stream particles */
  for(const p of fl){if(!still)p.y-=p.v*sp*D*dt;if(p.y<-10)p.y=H+10;const x=cx+p.o*W*.35+Math.sin(t*1.5+p.p+p.y*.004)*22*D,sz=p.s*4*D;
    g.globalAlpha=(.3+.6*Math.abs(Math.sin(t+p.p)))*al;g.drawImage(p.k?spr.b:spr.w,x-sz,p.y-sz,sz*2,sz*2)}
  g.globalAlpha=1}
apply();requestAnimationFrame(frame);
