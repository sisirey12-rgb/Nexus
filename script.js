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
/* ---------- WebGL scene (loaded lazily, fails gracefully) ---------- */
async function initWebGL(){
  const [THREE,{GLTFLoader},{EffectComposer},{RenderPass},{UnrealBloomPass},{OutputPass},{RoomEnvironment}]=await Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/postprocessing/EffectComposer.js'),
    import('three/addons/postprocessing/RenderPass.js'),
    import('three/addons/postprocessing/UnrealBloomPass.js'),
    import('three/addons/postprocessing/OutputPass.js'),
    import('three/addons/environments/RoomEnvironment.js')
  ]);

  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x02060a,mobile?.026:.018);
  const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,120);
  camera.position.set(0,.1,7.4);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.15:1.7));
  renderer.setSize(innerWidth,innerHeight);
  renderer.setClearColor(0x02060a,1);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;
  $('#webgl').append(renderer.domElement);

  // Image-based lighting so the dark metallic GLB materials have something to reflect.
  const pmrem=new THREE.PMREMGenerator(renderer);
  scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
  scene.environmentIntensity=.9;

  const composer=new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene,camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),mobile?.7:.9,.68,.78));
  composer.addPass(new OutputPass());

  scene.add(new THREE.HemisphereLight(0x74cfff,0x03050a,.75));
  const key=new THREE.PointLight(0x5fe9ff,18,20);key.position.set(4,3,5);scene.add(key);
  const violet=new THREE.PointLight(0x7c4dff,12,17);violet.position.set(-4,-2,2);scene.add(violet);
  const rim=new THREE.PointLight(0x4f8cff,8,18);rim.position.set(0,4,-4);scene.add(rim);

  const world=new THREE.Group();scene.add(world);
  const core=new THREE.Group();world.add(core);
  const machinery=new THREE.Group();world.add(machinery);

  const GLB='./assets/voxx-nexus-core.glb';
  new GLTFLoader().load(GLB,g=>{
    g.scene.traverse(o=>{
      if(o.isMesh&&o.material&&o.material.metalness!==undefined)o.material.metalness=Math.max(o.material.metalness,.55);
    });
    core.add(g.scene);
    hideLoader();
  },undefined,err=>{
    console.error(`VOXX NEXUS: could not load ${GLB}. Check that the file is at assets/voxx-nexus-core.glb and serve the site over http(s), not file://.`,err);
    note('Model not loaded, using backup core.');
    const m=new THREE.MeshStandardMaterial({color:0x0b1822,metalness:.9,roughness:.2,emissive:0x1fbfff,emissiveIntensity:.7,flatShading:true});
    core.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,1),m));
    const w=new THREE.Mesh(new THREE.IcosahedronGeometry(1.95,1),new THREE.MeshBasicMaterial({color:0x78edff,wireframe:true,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));
    core.add(w);core.add(new THREE.Mesh(new THREE.OctahedronGeometry(.75),new THREE.MeshBasicMaterial({color:0xa77dff})));
    hideLoader();
  });

  // Holographic shell with animated scan bands / Fresnel-like edge energy.
  const holo=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{t:{value:0}},vertexShader:`varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform float t;varying vec3 vN;varying vec3 vP;void main(){float fres=pow(1.0-abs(vN.z),2.6);float scan=pow(0.5+0.5*sin(vP.y*22.0-t*3.0),7.0);float grid=step(.965,fract(vP.x*8.0))*0.05;float a=(fres*.5+scan*.12+grid);gl_FragColor=vec4(.18,.82,1.0,a);}`});
  core.add(new THREE.Mesh(new THREE.SphereGeometry(2.58,96,64),holo));

  const energy=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{t:{value:0}},vertexShader:`varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform float t;varying vec3 p;void main(){float n=sin(p.x*9.0+t*2.8)+sin(p.y*13.0-t*2.1)+sin(p.z*15.0+t*1.7);float e=smoothstep(.72,1.0,sin(n*2.0));gl_FragColor=vec4(.05,.66,1.0,e*.6);}`});
  core.add(new THREE.Mesh(new THREE.SphereGeometry(1.55,72,48),energy));

  // Orbital machinery.
  function ring(radius,tube,tilt,color,speed){
    const m=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,12,160),new THREE.MeshStandardMaterial({color,metalness:.86,roughness:.24,emissive:color,emissiveIntensity:.9}));
    m.rotation.set(tilt.x,tilt.y,tilt.z);m.userData.speed=speed;machinery.add(m);return m;
  }
  const rings=[
    ring(2.05,.045,{x:1.15,y:.2,z:.12},0x65eaff,.12),
    ring(2.35,.035,{x:.25,y:1.12,z:.5},0x744cff,-.09),
    ring(2.72,.028,{x:1.3,y:-.2,z:-.55},0x3f9cff,.055),
    ring(3.05,.022,{x:.55,y:.7,z:1.05},0x8b63ff,-.035)
  ];
  for(let i=0;i<10;i++){
    const a=i*Math.PI*2/10;
    const g=new THREE.Group();g.position.set(Math.cos(a)*2.55,Math.sin(a*2)*.35,Math.sin(a)*2.55);
    const box=new THREE.Mesh(new THREE.BoxGeometry(.16,.42,.08),new THREE.MeshStandardMaterial({color:0x17232d,metalness:.95,roughness:.2,emissive:0x126080,emissiveIntensity:.12}));
    box.rotation.z=a;g.add(box);machinery.add(g);
  }

  // Adaptive star/data field.
  const count=mobile?520:1500;
  const positions=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const r=THREE.MathUtils.randFloat(4.3,22),a=Math.random()*Math.PI*2;
    positions[i*3]=Math.cos(a)*r;
    positions[i*3+1]=THREE.MathUtils.randFloatSpread(13);
    positions[i*3+2]=Math.sin(a)*r;
  }
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const points=new THREE.Points(pg,new THREE.PointsMaterial({color:0x76e9ff,size:mobile?.018:.023,transparent:true,opacity:.52,depthWrite:false,blending:THREE.AdditiveBlending}));
  scene.add(points);

  // Floating shards / data pylons.
  const shards=new THREE.Group();scene.add(shards);
  for(let i=0;i<(mobile?12:24);i++){
    const a=i*Math.PI*2/(mobile?12:24),r=THREE.MathUtils.randFloat(16,25),h=THREE.MathUtils.randFloat(.15,.55);
    const mesh=new THREE.Mesh(new THREE.OctahedronGeometry(h,.2),new THREE.MeshStandardMaterial({color:i%3===0?0x5d46a6:0x183341,metalness:.85,roughness:.28,emissive:i%4===0?0x1d8bb0:0x061016,emissiveIntensity:.4}));
    mesh.position.set(Math.cos(a)*r,THREE.MathUtils.randFloatSpread(5),Math.sin(a)*r);mesh.userData.spin=(Math.random()-.5)*.012;shards.add(mesh);
  }

  // One real 3D station per section, spread on a spiral around the core; the camera flies between them.
  const geos=[null,new THREE.TorusKnotGeometry(1,.3,180,24),new THREE.BoxGeometry(1.7,1.7,1.7,3,3,3),new THREE.IcosahedronGeometry(1.4,1),new THREE.SphereGeometry(1.3,20,14),new THREE.TorusGeometry(1.2,.4,14,40),new THREE.OctahedronGeometry(1.5),new THREE.DodecahedronGeometry(1.4),new THREE.ConeGeometry(1.2,2.4,6),new THREE.TetrahedronGeometry(1.6)];
  const stations=[],camPts=[],tgtPts=[],links3d=[];
  sections.forEach((_,i)=>{
    const a=i*.72,dir=new THREE.Vector3(Math.cos(a),0,Math.sin(a)),y=(i%3-1)*2.2;
    if(!i){camPts.push(new THREE.Vector3(0,.1,7.4));tgtPts.push(new THREE.Vector3());return}
    camPts.push(dir.clone().multiplyScalar(8.4).setY(y*.8));
    const pos=dir.clone().multiplyScalar(13.5).setY(y),c=i%2?0x35d8ff:0x8b63ff;
    tgtPts.push(pos.clone().add(new THREE.Vector3(-dir.z,0,dir.x).multiplyScalar(i%2?-2.6:2.6)));
    const g=new THREE.Group();g.position.copy(pos);g.userData={i,y};
    g.add(new THREE.Mesh(geos[i],new THREE.MeshStandardMaterial({color:0x0b1822,metalness:.9,roughness:.25,emissive:c,emissiveIntensity:.5})));
    const wire=new THREE.Mesh(geos[i],new THREE.MeshBasicMaterial({color:c,wireframe:true,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));
    wire.scale.setScalar(1.06);g.add(wire);scene.add(g);stations.push(g);
    links3d.push(new THREE.Vector3(),pos);
  });
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(links3d),new THREE.LineBasicMaterial({color:0x5fe9ff,transparent:true,opacity:.14})));
  const camCurve=new THREE.CatmullRomCurve3(camPts,false,'catmullrom',.5),tgtCurve=new THREE.CatmullRomCurve3(tgtPts,false,'catmullrom',.5);
  const cp=new THREE.Vector3(),tp=new THREE.Vector3();let sp=0;

  const pointer=new THREE.Vector2(),smooth=new THREE.Vector2();
  addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight*2-1)});

  function animate(ms){
    const t=ms*.001;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const progress=scrollY/max;
    const raw=progress*(sections.length-1);
    smooth.lerp(pointer,reduced?0:.035);

    const travel=raw*.38;
    core.rotation.y=(reduced?0:t*.105)+travel;
    core.rotation.x=smooth.y*.08+Math.sin(t*.17)*.045;
    core.rotation.z=Math.sin(t*.13)*.025;
    machinery.rotation.y=-t*.045+travel*.55;
    machinery.rotation.x=smooth.y*.025;
    points.rotation.y=t*.006;
    shards.rotation.y=-t*.012;
    shards.children.forEach(m=>{m.rotation.x+=m.userData.spin;m.rotation.y+=m.userData.spin*.7});

    sp+=(raw-sp)*.06;
    const u=Math.min(1,Math.max(0,sp/(sections.length-1)));
    camCurve.getPoint(u,cp);tgtCurve.getPoint(u,tp);
    camera.position.set(cp.x+smooth.x*.5,cp.y+smooth.y*.35,cp.z);
    camera.lookAt(tp.x+smooth.x*.3,tp.y+smooth.y*.2,tp.z);
    stations.forEach((g,k)=>{
      const on=Math.abs(sp-g.userData.i)<.6;
      g.rotation.y=t*.25+k;g.rotation.x=t*.12;g.position.y=g.userData.y+Math.sin(t*.8+k)*.15;
      g.scale.setScalar(g.scale.x+((on?1.35:1)-g.scale.x)*.06);
      g.children[0].material.emissiveIntensity+=((on?1.5:.5)-g.children[0].material.emissiveIntensity)*.08;
    });

    key.position.x=3.5+smooth.x*2.5;
    key.position.y=2.5-smooth.y;
    violet.position.x=-4-smooth.x*1.5;
    energy.uniforms.t.value=t;
    holo.uniforms.t.value=t;
    rings.forEach(r=>{r.rotation.z+=r.userData.speed*(reduced?.25:1)});
    try{composer.render()}catch(e){renderer.render(scene,camera)}
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  note('3D v3 running',true);

  addEventListener('resize',()=>{
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.15:1.7));renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);
  });
}

initWebGL().catch(err=>{
  console.error('VOXX NEXUS: 3D scene unavailable, showing the page without it.',err);
  document.documentElement.classList.add('no-webgl');
  note('3D failed: '+(err&&err.message||err));
  hideLoader();
});
