const $=s=>document.querySelector(s)||document.createElement('i');
const $$=s=>[...document.querySelectorAll(s)];
const mobile=matchMedia('(max-width:800px)').matches;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const CONTACT={email:'sisirey12@gmail.com',instagram:'https://www.instagram.com/sisirey.vox',instagramHandle:'@sisirey.vox',whatsapp:'https://wa.me/qr/JAKK7D6SSIJVK1',telegram:'https://t.me/yor_forg3r',telegramHandle:'@yor_forg3r'};
const asUrl=u=>/^(https?:|mailto:)/i.test(u)?u:'https://'+u;

/* UI (independent of WebGL) */
$('#emailLink').href='mailto:'+CONTACT.email;$('#emailLink b').textContent=CONTACT.email;
$('#briefLink').href='mailto:'+CONTACT.email+'?subject=VOXX%20NEXUS%20Project%20Brief';
[['#instagramLink',CONTACT.instagram,CONTACT.instagramHandle],['#whatsappLink',CONTACT.whatsapp],['#telegramLink',CONTACT.telegram,CONTACT.telegramHandle]].forEach(([s,u,l])=>{const a=$(s);a.href=asUrl(u);a.target='_blank';a.rel='noopener noreferrer';if(l&&a.querySelector('b'))a.querySelector('b').textContent=l});
const loader=$('#loader');let loaderDone=false;
function hideLoader(){if(loaderDone)return;loaderDone=true;loader.classList.add('loader-hidden');setTimeout(()=>loader.remove(),900)}
setTimeout(hideLoader,10000);
function note(msg,ok){const d=document.createElement('div');d.style.cssText='position:fixed;left:8px;right:8px;bottom:12px;z-index:99;font:11px monospace;color:'+(ok?'#9fffd0':'#ffb4b4')+';background:#200;padding:6px;border:1px solid #a33;word-break:break-word';d.textContent=msg;document.body.append(d);if(ok)setTimeout(()=>d.remove(),4000)}
const sections=$$('.ch');
const dots=sections.map((s,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',s.dataset.name);b.onclick=()=>s.scrollIntoView({behavior:reduced?'auto':'smooth'});$('#dots').append(b);return b});
const act=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const i=sections.indexOf(e.target);dots.forEach((d,k)=>d.classList.toggle('on',k===i));$('#hudNum').textContent=String(i+1).padStart(2,'0');$('#hudName').textContent=e.target.dataset.name}),{threshold:.5});
sections.forEach(s=>act.observe(s));
const rvo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.15});
$$('.rv').forEach(e=>rvo.observe(e));

/* WebGL: new GLB core, cinematic scroll camera, chapter colours */
async function initWebGL(){
  const [THREE,{GLTFLoader},{EffectComposer},{RenderPass},{UnrealBloomPass},{OutputPass},{RoomEnvironment}]=await Promise.all([
    import('three'),import('three/addons/loaders/GLTFLoader.js'),import('three/addons/postprocessing/EffectComposer.js'),import('three/addons/postprocessing/RenderPass.js'),import('three/addons/postprocessing/UnrealBloomPass.js'),import('three/addons/postprocessing/OutputPass.js'),import('three/addons/environments/RoomEnvironment.js')]);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.1,100);
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:1.8));renderer.setSize(innerWidth,innerHeight);renderer.setClearColor(0x02010a,1);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  $('#webgl').append(renderer.domElement);
  try{scene.environment=new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(),.04).texture;scene.environmentIntensity=.6}catch(e){note('env off: '+e.message)}
  let composer=null;
  try{composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),mobile?.7:.95,.8,.2));composer.addPass(new OutputPass())}catch(e){composer=null;note('glow off: '+e.message)}
  const l1=new THREE.PointLight(0x8b63ff,40,24),l2=new THREE.PointLight(0x6fe7ff,34,24);l1.position.set(-5,3,4);l2.position.set(5,-3,5);scene.add(l1,l2,new THREE.HemisphereLight(0x8b63ff,0x02010a,.4));
  const rig=new THREE.Group();scene.add(rig);const P={};
  new GLTFLoader().load('./assets/voxx-nexus-core.glb',g=>{rig.add(g.scene);['Crystal','Core','RingA','RingB','RingC','Shards'].forEach(n=>P[n]=g.scene.getObjectByName(n));
    if(P.RingA)P.RingA.rotation.set(1.15,.2,0);if(P.RingB)P.RingB.rotation.set(.3,1.1,0);if(P.RingC)P.RingC.rotation.set(1.3,-.5,0);hideLoader()},undefined,e=>{note('Model not loaded: check assets/voxx-nexus-core.glb');hideLoader()});
  // dust field
  const n=mobile?900:2200,pa=new Float32Array(n*3);
  for(let i=0;i<n;i++){const r=5+Math.random()*16,a=Math.random()*6.283,y=(Math.random()-.5)*14;pa.set([Math.cos(a)*r,y,Math.sin(a)*r],i*3)}
  const gd=new THREE.BufferGeometry();gd.setAttribute('position',new THREE.BufferAttribute(pa,3));
  const U={a:{value:new THREE.Color(0x6fe7ff)},b:{value:new THREE.Color(0x8b63ff)},s:{value:(mobile?90:120)*renderer.getPixelRatio()}};
  const dust=new THREE.Points(gd,new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:'uniform vec3 a;uniform vec3 b;uniform float s;varying vec3 c;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);c=mix(a,b,fract(position.y*.17+position.x*.05));gl_PointSize=s/-mv.z;gl_Position=projectionMatrix*mv;}',
    fragmentShader:'varying vec3 c;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(c,smoothstep(.5,0.,d)*.7);}'}));
  dust.frustumCulled=false;scene.add(dust);
  const AZ=[0,.9,1.9,2.8,3.8,4.7,5.6,6.3],EL=[.15,.7,-.4,.9,-.6,.5,.1,.3],RD=[9.5,7.2,8.2,6.8,8,6.4,10,9],
  PAL=[[0x6fe7ff,0x8b63ff],[0x8b63ff,0xff4fd8],[0x2a8bff,0x6fe7ff],[0xff4fd8,0x8b63ff],[0x6fe7ff,0xff4fd8],[0x9a6bff,0x6fe7ff],[0xff4fd8,0x6fe7ff],[0x6fe7ff,0x8b63ff]];
  const tc=new THREE.Color(),lerp=(a,b,f)=>a+(b-a)*f,ease=f=>f*f*(3-2*f);
  function fit(){camera.aspect=innerWidth/innerHeight;camera.clearViewOffset();
    if(mobile)camera.setViewOffset(innerWidth,innerHeight,0,innerHeight*.2,innerWidth,innerHeight);else camera.setViewOffset(innerWidth,innerHeight,-innerWidth*.2,0,innerWidth,innerHeight);camera.updateProjectionMatrix()}
  fit();addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);composer?.setSize(innerWidth,innerHeight);fit()});
  const ptr=new THREE.Vector2(),sm=new THREE.Vector2();addEventListener('pointermove',e=>{ptr.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight*2-1))});
  let sp=0,last=0,pulse=0,shown=false;
  function animate(ms){try{
    const t=ms*.001,max=Math.max(1,document.documentElement.scrollHeight-innerHeight),raw=scrollY/max*(AZ.length-1);
    $('#bar').style.transform='scaleX('+scrollY/max+')';
    sp+=(raw-sp)*(reduced?1:.06);sm.lerp(ptr,reduced?0:.05);
    const i0=Math.min(AZ.length-2,Math.max(0,Math.floor(sp))),f=ease(Math.min(1,Math.max(0,sp-i0))),i1=i0+1,idx=Math.round(sp);
    if(idx!==last){last=idx;pulse=1}pulse*=.94;
    const az=lerp(AZ[i0],AZ[i1],f)+sm.x*.25,el=lerp(EL[i0],EL[i1],f)+sm.y*.25,rd=lerp(RD[i0],RD[i1],f)-pulse*1.2;
    camera.position.set(Math.sin(az)*rd,Math.sin(el)*rd*.5,Math.cos(az)*rd);camera.lookAt(0,0,0);
    const s=1+pulse*.1;rig.scale.setScalar(s);
    if(P.Crystal){P.Crystal.rotation.y=t*.25;P.Crystal.rotation.x=t*.12}
    if(P.Core){P.Core.rotation.y=-t*.6;P.Core.rotation.z=t*.4;P.Core.scale.setScalar(1+Math.sin(t*2)*.08+pulse*.3)}
    const v=(reduced?.2:1)*(1+pulse*5);
    if(P.RingA)P.RingA.rotation.z+=.004*v;if(P.RingB)P.RingB.rotation.z-=.003*v;if(P.RingC)P.RingC.rotation.z+=.002*v;
    if(P.Shards)P.Shards.rotation.y=t*.18;dust.rotation.y=t*.012;
    const c0=PAL[i0],c1=PAL[i1];
    U.a.value.lerp(tc.setHex(f<.5?c0[0]:c1[0]),.05);U.b.value.lerp(tc.setHex(f<.5?c0[1]:c1[1]),.05);
    l1.color.lerp(tc.setHex(f<.5?c0[1]:c1[1]),.05);l2.color.lerp(tc.setHex(f<.5?c0[0]:c1[0]),.05);
    if(composer){try{composer.render()}catch(e){composer=null;renderer.render(scene,camera)}}else renderer.render(scene,camera);
  }catch(e){if(!shown){shown=true;note('frame: '+e.message+' '+(e.stack||'').split('\n')[1])}}
    requestAnimationFrame(animate)}
  requestAnimationFrame(animate);note('3D v5 running',true);
}
initWebGL().catch(err=>{console.error(err);note('3D failed: '+(err&&err.message||err)+' '+((err&&err.stack)||'').split('\n').slice(1,3).join(' ').replace(/https?:\/\/[^ )]*\//g,''));hideLoader()});
