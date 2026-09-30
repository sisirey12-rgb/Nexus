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
Object.entries(T).forEach(([n,t],i)=>{if(i%6===0){const l=document.createElement('span');l.className='lab mono';l.textContent=i?'LIGHT THEMES':'DARK THEMES';sw.append(l)}const b=document.createElement('button');b.dataset.v=n;b.title=n.toUpperCase();b.setAttribute('aria-label',n+' theme');b.style.cssText=`background:linear-gradient(135deg,${t[3]},${t[4]});--ring:${t[0]}`;sw.append(b)});
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

/* scroll-driven particle scenes: nebula bow-tie > starfield > ring > ribbons > clusters > spiral galaxy (reversible) */
const cv=$('#beam'),g=cv.getContext('2d'),SEC=['hero','services','about','workflow','faq','contact'],NAMES=['NEXUS CORE','SYSTEMS','CAPABILITIES','PROCESS','SIGNAL','OPEN CHANNEL'];
const SPEED={cinematic:.55,smooth:1,default:1.5},K={cinematic:.05,smooth:.1,default:.22},SC=[['a','w'],['w','b'],['a','b'],['b','a'],['b','a'],['a','b']];
let W,H,D,N,P=[],SCN=[],tops=[],mx=0,my=0,sm=0,vs=0,lastY=scrollY,vis=true,t0=performance.now(),lastSc=-1,fc=0;
const gs=()=>(Math.random()+Math.random()+Math.random()-1.5)/.75;
const rotX=(v,a)=>{const c=Math.cos(a),s=Math.sin(a);return[v[0],v[1]*c-v[2]*s,v[1]*s+v[2]*c]};
const GEN=[
 i=>{if(Math.random()<.12)return[gs()*2,gs()*1.2,gs()];const t=Math.random()*2-1,w=Math.pow(Math.abs(t),.9)*.6+.015;return[t*1.7,gs()*w*.5+t*.3,gs()*w]},
 i=>Math.random()<.3?[gs()*.6+.5,gs()*.35-.2,gs()*.4]:[(Math.random()-.5)*4,(Math.random()-.5)*2.4,(Math.random()-.5)*3],
 i=>{if(Math.random()<.3)return[gs()*.9,gs()*.9,gs()*.9];const a=Math.random()*6.283,r=.85+gs()*.07;return rotX([r*Math.cos(a),r*Math.sin(a),gs()*.08],.5)},
 i=>{if(Math.random()<.2)return[gs()*1.6,gs()*.8,gs()*.3];const k=i%3,s=Math.random();return[(s-.5)*3.4,Math.sin(s*5+k*2.1)*.55+(k-1)*.45+gs()*.03,gs()*.15]},
 i=>{if(i%9<4){const s=(i%8)*.83;return[Math.sin(s*3)*1.3+gs()*.12,Math.cos(s*2.3)*.7+gs()*.12,gs()*.12]}const s=Math.random();return[Math.sin(s*3.2)*.35+.2+gs()*.05,(s-.5)*2.6,gs()*.08]},
 i=>{const r=Math.pow(Math.random(),.6)*1.5,a=(i%3)*2.094+r*3.2+gs()*.15;return rotX([r*Math.cos(a),gs()*.05*(1-r*.4),r*Math.sin(a)],.8)}];
const calc=()=>tops=SEC.map(id=>document.getElementById(id).offsetTop);
function size(){D=Math.min(devicePixelRatio||1,innerWidth<768?1.25:2);W=cv.width=innerWidth*D;H=cv.height=innerHeight*D;N=innerWidth<768?2600:7000;
  P=Array.from({length:N},(_,i)=>({d:Math.random(),s:.4+Math.random()*1.1,b:.3+Math.random()*.7,k:i%3===0})).sort((a,b)=>a.k-b.k);
  SCN=GEN.map(f=>{const a=new Float32Array(N*3);for(let i=0;i<N;i++)a.set(f(i),i*3);return a});calc()}
addEventListener('resize',size);addEventListener('load',calc);size();
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
const SHORT=['NEXUS','SYSTEMS','CAPABILITIES','PROCESS','SIGNAL','CHANNEL'],CAPS=['Software, intelligence, automation and visual systems, engineered as one connected ecosystem.','Websites, APIs, bots and video from $15. Pick a system and open a channel.','Five disciplines. One signal.','From idea to live system in five connected steps.','Straight answers before you start.','Instagram, Telegram or WhatsApp. Pick one and say hello.'];
$('#idx').innerHTML=SEC.map((id,i)=>`<a href="#${id}">${SHORT[i]}</a>`).join('');
function updateUI(s){$('#sc').textContent=`[ SCENE 0${s+1} / ${NAMES[s]} ]`;$('#capt').innerHTML=`<b>SEC.00${s+1} — ${NAMES[s]}</b><p>${CAPS[s]}</p><button data-open>START A PROJECT ↗</button>`;$$('#idx a').forEach((a,i)=>a.classList.toggle('on',i===s))}
updateUI(0);
function frame(now){requestAnimationFrame(frame);if(!vis)return;
  if(++fc%90===0)calc();
  const still=reduceMQ.matches,sp=SPEED[st.motion],t=now/1000*sp;
  vs+=((scrollY-lastY)-vs)*.12;lastY=scrollY;const punch=Math.min(Math.abs(vs)/50,1);
  cardFx(punch,still);
  const y=scrollY+innerHeight*.5;let i=0;while(i<5&&y>=tops[i+1])i++;
  const f=i>=5?0:(y-tops[i])/Math.max(1,tops[i+1]-tops[i]),f2=Math.min(1,Math.max(0,(f-.2)/.6));
  sm+=((i+f2)-sm)*K[st.motion];
  const a=Math.min(4,Math.floor(sm)),ff=sm-a,sc=Math.round(sm);
  if(sc!==lastSc){lastSc=sc;updateUI(sc)}
  const ta=SCN[a],tb=SCN[a+1],C={a:col.a,b:col.b,w:col.dark?'#ffffff':col.a},cs=SC[sc];
  const R=Math.min(W,H)*.5*(1+punch*.15),F=R*3,cx=(innerWidth<900?.5:.6)*W+mx*30*D,cy=H*.5+my*20*D;
  const th=(still?0:t*.12)+mx*.5+sm*.35,ct=Math.cos(th),s_=Math.sin(th),pit=my*.25,cp=Math.cos(pit),sp_=Math.sin(pit),burst=Math.sin(Math.PI*ff);
  g.clearRect(0,0,W,H);g.globalCompositeOperation=col.dark?'lighter':'source-over';let cur=-1;
  for(let n=0;n<N;n++){const p=P[n],j=n*3,q=Math.min(1,Math.max(0,(ff-p.d*.35)/.65)),pe=q*q*(3-2*q),bs=1+burst*.6*(.4+p.d);
    let X=(ta[j]+(tb[j]-ta[j])*pe)*bs,Y=(ta[j+1]+(tb[j+1]-ta[j+1])*pe)*bs,Z=(ta[j+2]+(tb[j+2]-ta[j+2])*pe)*bs;
    if(!still){X+=Math.sin(t+p.d*40)*.008;Y+=Math.cos(t*.8+p.d*30)*.008}
    const X1=X*ct+Z*s_,Z1=-X*s_+Z*ct,Y2=Y*cp-Z1*sp_,Z2=Y*sp_+Z1*cp,k=F/(F+Z2*R),c=p.k?1:0;
    if(c!==cur){cur=c;g.fillStyle=C[cs[c]]}
    const s=p.s*D*k*(1.1+punch);g.globalAlpha=(.25+.75*p.b)*Math.min(1,k*k)*(col.dark?1:.75);g.fillRect(cx+X1*R*k-s/2,cy+Y2*R*k-s/2,s,s)}
  if(col.dark){const w=Math.max(0,1-sm)+.6*Math.max(0,sm-4),gr=g.createRadialGradient(cx,cy,0,cx,cy,R*.45);gr.addColorStop(0,C.a);gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=.4*Math.min(1,w);g.fillStyle=gr;g.fillRect(cx-R,cy-R,R*2,R*2)}
  g.globalAlpha=1}
apply();requestAnimationFrame(frame);
