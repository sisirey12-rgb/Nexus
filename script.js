const $=s=>document.querySelector(s)||document.createElement('i');
const $$=s=>[...document.querySelectorAll(s)];
const mobile=matchMedia('(max-width:760px)').matches;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;

// Edit these values before publishing. Links and handle labels are filled in from here.
const CONTACT={
  email:'sisirey12@gmail.com',
  instagram:'https://www.instagram.com/sisirey.vox',
  instagramHandle:'@sisirey.vox',
  whatsapp:'https://wa.me/qr/JAKK7D6SSIJVK1',
  telegram:'https://t.me/yor_forg3r',
  telegramHandle:'@yor_forg3r'
};
const asUrl=u=>/^(https?:|mailto:)/i.test(u)?u:'https://'+u;

/* ---------- UI (runs even if WebGL or the CDN fails) ---------- */
$('#emailLink').href=`mailto:${CONTACT.email}`;
$('#emailLink b').textContent=CONTACT.email;
$('#briefLink').href=`mailto:${CONTACT.email}?subject=VOXX%20NEXUS%20Project%20Brief`;
[['#instagramLink',CONTACT.instagram,CONTACT.instagramHandle],['#whatsappLink',CONTACT.whatsapp],['#telegramLink',CONTACT.telegram,CONTACT.telegramHandle]].forEach(([sel,url,label])=>{
  const a=$(sel);a.href=asUrl(url);a.target='_blank';a.rel='noopener noreferrer';
  if(label)a.querySelector('b').textContent=label;
});

const loader=$('#loader');
let loaderDone=false;
function hideLoader(){
  if(loaderDone)return;loaderDone=true;
  loader.classList.add('loader-hidden');
  setTimeout(()=>loader.remove(),900);
}
setTimeout(hideLoader,10000); // never leave the visitor stuck on the boot screen

const sections=$$('.scene-section');
const links=$$('.rail-link');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const id=entry.target.id;
  links.forEach(l=>l.classList.toggle('active',l.dataset.section===id));
  const index=sections.findIndex(s=>s.id===id);
  const name=entry.target.dataset.name||id.toUpperCase();
  $('#hudSection').textContent=name;
  $('#hudNumber').textContent=String(index+1).padStart(3,'0');
  $('#sceneLabel').textContent=name;
  $('#sceneNumber').textContent=String(index+1).padStart(3,'0');
}),{threshold:.35});
sections.forEach(s=>observer.observe(s));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
$$('.reveal').forEach(e=>revealObserver.observe(e));

const menu=$('#menuToggle');
const rail=$('#rail');
function setMenu(open){rail.classList.toggle('open',open);menu?.setAttribute('aria-expanded',String(open))}
menu?.addEventListener('click',()=>setMenu(!rail.classList.contains('open')));
links.forEach(l=>l.addEventListener('click',()=>setMenu(false)));

function note(msg,ok){const d=document.createElement('div');d.style.cssText='position:fixed;left:8px;right:8px;bottom:44px;z-index:99;font:11px monospace;color:'+(ok?'#9fffd0':'#ffb4b4')+';background:#200;padding:6px;border:1px solid #a33;word-break:break-word';d.textContent=msg;document.body.append(d);if(ok)setTimeout(()=>d.remove(),5000)}
let punch=0;
const chips=[['WEB','#systems'],['AI','#intelligence'],['API','#network'],['AUTO','#automation'],['CREATIVE','#creative']].map(([l,h])=>{
  const a=document.createElement('a');a.className='orb';a.href=h;a.textContent=l;a.addEventListener('click',()=>{punch=1});document.body.append(a);return a});

/* ---------- WebGL: Living Core + Orbit Hub ---------- */
async function initWebGL(){
  const [THREE,{GLTFLoader},{EffectComposer},{RenderPass},{UnrealBloomPass},{OutputPass},{RoomEnvironment}]=await Promise.all([
    import('three'),import('three/addons/loaders/GLTFLoader.js'),import('three/addons/postprocessing/EffectComposer.js'),import('three/addons/postprocessing/RenderPass.js'),import('three/addons/postprocessing/UnrealBloomPass.js'),import('three/addons/postprocessing/OutputPass.js'),import('three/addons/environments/RoomEnvironment.js')
  ]);
  const TAU=Math.PI*2,R=Math.random,J=()=>(R()-.5)*.25;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);
  const baseZ=mobile?12:9.5;camera.position.set(0,0,baseZ);
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:1.8));renderer.setSize(innerWidth,innerHeight);
  renderer.setClearColor(0x02010a,1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  $('#webgl').append(renderer.domElement);
  try{scene.environment=new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(),.04).texture;scene.environmentIntensity=.55}catch(e){note('env off: '+e.message)}
  let composer=null;
  try{composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),mobile?.6:.85,.9,.15));composer.addPass(new OutputPass())}catch(e){composer=null;note('glow off: '+e.message)}
  scene.add(new THREE.HemisphereLight(0x8b63ff,0x02010a,.5));
  const l1=new THREE.PointLight(0xff4fd8,30,22);l1.position.set(-5,3,4);scene.add(l1);
  const l2=new THREE.PointLight(0x4de9ff,26,22);l2.position.set(5,-3,5);scene.add(l2);

  const world=new THREE.Group();world.position.set(mobile?0:2.4,mobile?1.8:0,0);scene.add(world);
  const glb=new THREE.Group();world.add(glb);
  const GLB='./assets/voxx-nexus-core.glb';
  new GLTFLoader().load(GLB,g=>{g.scene.scale.setScalar(1.5);glb.add(g.scene);hideLoader()},undefined,err=>{
    console.error('VOXX NEXUS: could not load '+GLB,err);
    glb.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.6,1),new THREE.MeshStandardMaterial({color:0x0b0820,metalness:.9,roughness:.2,emissive:0x5b2bff,emissiveIntensity:.6,flatShading:true})));
    glb.add(new THREE.Mesh(new THREE.IcosahedronGeometry(2,1),new THREE.MeshBasicMaterial({color:0x7be9ff,wireframe:true,transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false})));
    hideLoader();
  });
  const rings=[[2.3,0x4de9ff,1.2,.2],[2.75,0xff4fd8,.3,1.1]].map(([r,c,rx,ry])=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,.012,8,200),new THREE.MeshBasicMaterial({color:c}));m.rotation.set(rx,ry,0);world.add(m);return m});

  // Living core: one particle cloud that morphs into a new form per section.
  const N=mobile?2600:5200;
  const gen=[
    i=>{const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),a=i*2.39996;return[Math.cos(a)*r*2.9,y*2.9,Math.sin(a)*r*2.9]},
    ()=>{const u=R()*TAU,v=R()*TAU,q=2.6+.8*Math.cos(v);return[q*Math.cos(u),.8*Math.sin(v),q*Math.sin(u)]},
    ()=>{const f=R()*6|0,k=f>>1,o=[0,0,0];o[k]=f%2?2.2:-2.2;o[(k+1)%3]=(R()-.5)*4.4;o[(k+2)%3]=(R()-.5)*4.4;return o},
    ()=>{const t=R()*TAU,r=1.6+.7*Math.cos(3*t);return[r*Math.cos(2*t)*1.3+J(),.9*Math.sin(3*t)*1.3+J(),r*Math.sin(2*t)*1.3+J()]},
    i=>{const t=i/N*TAU*3-TAU*1.5,s=i%2?0:Math.PI;return[Math.cos(t+s)*1.5+J(),t*.55+J(),Math.sin(t+s)*1.5+J()]},
    ()=>{const r=R()*3.6,a=r*1.6+R()*.4;return[Math.cos(a)*r,(R()-.5)*.35*(1+r*.3),Math.sin(a)*r]},
    ()=>{const x=(R()-.5)*7,z=(R()-.5)*7;return[x,Math.sin(x*1.3)*.5+Math.cos(z*1.3)*.5,z]},
    ()=>{const h=R()*3.6,a=R()*TAU,r=(3.6-h)*.6;return[Math.cos(a)*r,h-1.8,Math.sin(a)*r]}
  ];
  const map=[0,1,2,3,4,5,6,7,1,0];
  const targets=gen.map(f=>{const a=new Float32Array(N*3);for(let i=0;i<N;i++)a.set(f(i),i*3);return a});
  const pos=Float32Array.from(targets[0]);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const U={a:{value:new THREE.Color(0x4de9ff)},b:{value:new THREE.Color(0x7b5cff)},s:{value:(mobile?70:95)*renderer.getPixelRatio()},t:{value:0}};
  const cloud=new THREE.Points(geo,new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:'uniform vec3 a;uniform vec3 b;uniform float s;uniform float t;varying vec3 c;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);c=mix(a,b,clamp(position.y*.2+.5+.2*sin(t*.6+position.x),0.,1.));gl_PointSize=s*(1.+.4*sin(t*2.+position.x*3.+position.z*2.))/-mv.z;gl_Position=projectionMatrix*mv;}',
    fragmentShader:'varying vec3 c;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(c,smoothstep(.5,0.,d)*.85);}'}));
  cloud.frustumCulled=false;world.add(cloud);
  const pal=[[0x4de9ff,0x7b5cff],[0x7b5cff,0xff4fd8],[0x2a8bff,0x7b5cff],[0xff4fd8,0x4de9ff],[0x4de9ff,0xff4fd8],[0x7b5cff,0x4de9ff],[0x2a6bff,0xff4fd8],[0x9a6bff,0x4de9ff],[0xff4fd8,0x7b5cff],[0x4de9ff,0x7b5cff]];
  const tc=new THREE.Color();

  // Orbit hub: five glowing service nodes; DOM chips follow them and act as the menu.
  const orbit=new THREE.Group();orbit.rotation.set(.3,0,.25);world.add(orbit);
  const nodes=chips.map((_,k)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.14,16,12),new THREE.MeshBasicMaterial({color:[0x4de9ff,0x9a6bff,0xff4fd8,0x2a8bff,0xffffff][k]}));orbit.add(m);return m});

  const pointer=new THREE.Vector2(),smooth=new THREE.Vector2(),v=new THREE.Vector3();
  addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight*2-1)});
  let shown=false;
  function animate(ms){try{
    const t=ms*.001,max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const raw=scrollY/max*(sections.length-1),idx=Math.max(0,Math.min(sections.length-1,Math.round(raw)));
    smooth.lerp(pointer,reduced?0:.04);
    const tg=targets[map[idx]],k=reduced?1:.045;
    for(let i=0;i<pos.length;i++)pos[i]+=(tg[i]-pos[i])*k;
    geo.attributes.position.needsUpdate=true;
    U.t.value=t;U.a.value.lerp(tc.setHex(pal[idx][0]),.04);U.b.value.lerp(tc.setHex(pal[idx][1]),.04);
    world.rotation.y=(reduced?0:t*.12)+raw*.35;world.rotation.x=smooth.y*.15;
    glb.scale.setScalar(glb.scale.x+((idx===0?1:.001)-glb.scale.x)*.08);glb.rotation.y=t*.2;
    rings.forEach((r,i)=>r.rotation.z+=(i?-.004:.003));
    punch*=.96;
    camera.position.x+=(smooth.x*.6-camera.position.x)*.05;camera.position.y+=(smooth.y*.4-camera.position.y)*.05;
    camera.position.z+=(baseZ-punch*2-camera.position.z)*.08;camera.lookAt(0,0,0);
    nodes.forEach((n,i)=>{
      const a=t*.35+i*TAU/5;n.position.set(Math.cos(a)*4.1,Math.sin(a*2)*.5,Math.sin(a)*4.1);
      n.getWorldPosition(v);v.project(camera);
      chips[i].style.transform='translate('+((v.x*.5+.5)*innerWidth)+'px,'+((-v.y*.5+.5)*innerHeight)+'px) translate(-50%,-50%)';
      chips[i].classList.add('on');
    });
    if(composer){try{composer.render()}catch(e){composer=null;renderer.render(scene,camera)}}else renderer.render(scene,camera);
  }catch(e){if(!shown){shown=true;note('frame: '+e.message+' '+(e.stack||'').split('\n')[1])}}
    requestAnimationFrame(animate)}
  requestAnimationFrame(animate);
  note('3D v4 running',true);
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer?.setSize(innerWidth,innerHeight)});
}

initWebGL().catch(err=>{
  console.error('VOXX NEXUS: 3D scene unavailable.',err);
  document.documentElement.classList.add('no-webgl');
  note('3D failed: '+(err&&err.message||err)+' '+((err&&err.stack)||'').split('\n').slice(1,3).join(' ').replace(/https?:\/\/[^ )]*\//g,''));
  hideLoader();
});
