(function () {
  var canvas = document.createElement('canvas');
  canvas.id = 'cloud'; canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:-1;display:block;pointer-events:none';
  document.body.insertBefore(canvas, document.body.firstChild);
  var st = document.createElement('style');
  st.textContent = 'html{background:#fbfbfe!important}body{background:transparent!important}';
  document.head.appendChild(st);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cloudWarn = 0, cloudPulse = 0;
  var gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
  if (!gl) return;
  var VS = [
  'precision highp float;',
  'attribute vec4 a_rand;',
  'uniform mat4 u_mvp; uniform float u_time; uniform float u_pass; uniform float u_px; uniform float u_warn; uniform float u_pulse;',
  'varying vec3 v_col; varying float v_a; varying float v_pass;',
  'vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}',
  'vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}',
  'vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}',
  'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}',
  'float snoise(vec3 v){',
  ' const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);',
  ' vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);',
  ' vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);',
  ' vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;',
  ' i=mod289(i);',
  ' vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));',
  ' float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;',
  ' vec4 j=p-49.*floor(p*ns.z*ns.z);',
  ' vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);',
  ' vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);',
  ' vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);',
  ' vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));',
  ' vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
  ' vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);',
  ' vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));',
  ' p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;',
  ' vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;',
  ' return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));',
  '}',
  'void main(){',
  ' v_pass=u_pass;',
  ' float t=u_time*0.12;',
  ' float isT=step(0.5,a_rand.w);float wr=fract(a_rand.w*2.0);vec3 p=a_rand.xyz;',
  ' vec3 q=p*1.5;',
  ' vec3 w1=vec3(snoise(q+vec3(0.,0.,t)),snoise(q+vec3(31.4,7.1,t)),snoise(q+vec3(-12.3,22.2,t)));',
  ' p+=w1*mix(0.62+0.1*u_pulse,0.07,isT);',
  ' vec3 q2=p*3.1+t*1.7;',
  ' vec3 w2=vec3(snoise(q2),snoise(q2+vec3(17.1,3.3,9.7)),snoise(q2+vec3(-5.2,13.8,21.1)));',
  ' p+=w2*mix(0.2,0.035,isT);',
  ' p*=1.0+0.05*sin(u_time*0.6)+0.22*u_pulse;',
  ' float r=length(p);',
  ' float hn=snoise(p*1.25+vec3(5.,t*2.2,0.));',
  ' float heat=smoothstep(-0.25,0.75,hn)*smoothstep(1.25,0.1,r);',
  ' heat=clamp(heat*(1.0+0.5*u_warn+0.8*u_pulse),0.0,1.0);',
  ' float fil=smoothstep(0.35,0.9,abs(w2.x)+abs(w2.y)*0.6);',
  ' vec3 grey=mix(vec3(0.48,0.30,1.0),vec3(0.17,0.48,1.0),clamp(fil*1.3+0.25*hn+0.3,0.0,1.0))*(0.85+0.3*fil);',
  ' vec3 hot=mix(vec3(0.06,0.78,0.76),vec3(0.85,0.18,0.62),u_warn);',
  ' vec3 white=mix(vec3(0.30,0.92,0.88),vec3(1.0,0.42,0.76),u_warn);',
  ' vec3 col=mix(grey,hot,smoothstep(0.1,0.7,heat));',
  ' col=mix(col,white,pow(heat,3.0)*0.7);',
  ' gl_Position=u_mvp*vec4(p,1.);',
  ' float persp=1.0/max(gl_Position.w,0.2);',
  ' if(u_pass<0.5){',
  '  gl_PointSize=max(1.0,u_px*1.55*persp*(0.7+wr*0.9));',
  '  v_col=col; v_a=0.30+0.2*fil;',
  ' } else {',
  '  gl_PointSize=u_px*13.0*persp*(0.6+wr*0.8);',
  '  v_col=vec3(1.0,0.42,0.16); v_a=0.04*heat*heat;',
  ' }',
  '}'
  ].join('\n');
  var FS = [
  'precision mediump float;',
  'varying vec3 v_col; varying float v_a; varying float v_pass;',
  'void main(){',
  ' float d=length(gl_PointCoord-0.5);',
  ' if(d>0.5) discard;',
  ' float a=v_pass<0.5 ? smoothstep(0.5,0.1,d) : pow(1.0-d*2.0,2.0);',
  ' float al=min(1.0,a*v_a*1.5);',
  ' gl_FragColor=v_pass<0.5 ? vec4(v_col*al,al) : vec4(v_col*a*v_a*3.0,a*v_a*3.0);',
  '}'
  ].join('\n');
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); return s; }
  var prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
  gl.useProgram(prog);
  var N = window.innerWidth < 768 ? 90000 : 260000, data = new Float32Array(N * 4);
  function gauss() { var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * v); }
  var TW=1024,TH=320,tc=document.createElement('canvas');tc.width=TW;tc.height=TH;
  var cx=tc.getContext('2d');cx.fillStyle='#000';cx.font='900 300px Arial, Helvetica, sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('UPMO',TW/2,TH/2+10);
  var id=cx.getImageData(0,0,TW,TH).data,pts=[];
  for(var yy=0;yy<TH;yy++){for(var xx=0;xx<TW;xx++){if(id[(yy*TW+xx)*4+3]>128){pts.push(xx,yy);}}}
  var S=window.innerWidth<768?0.75:1,K=2.1/TW*S,np=pts.length/2;
  for (var i = 0; i < N; i++) {
    if (np>0 && Math.random()<0.4) {
      var k=(Math.random()*np|0)*2;
      data[i*4]=(pts[k]-TW/2)*K+(Math.random()-0.5)*0.006;
      data[i*4+1]=-(pts[k+1]-TH/2-10)*K+(Math.random()-0.5)*0.006;
      data[i*4+2]=gauss()*0.04;data[i*4+3]=0.5+Math.random()*0.5;
    } else {
      var gx=gauss(),gy=gauss(),gz=gauss(),gl2=Math.sqrt(gx*gx+gy*gy+gz*gz)||1,gr=Math.pow(Math.random(),0.42)*S;data[i*4]=gx/gl2*gr;data[i*4+1]=gy/gl2*gr;data[i*4+2]=gz/gl2*gr;data[i*4+3]=Math.random()*0.5;
    }
    
  }
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'a_rand'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
  var U = {}; ['u_mvp', 'u_time', 'u_pass', 'u_px', 'u_warn', 'u_pulse'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
  function mul(a, b) { var o = new Float32Array(16); for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) { var s = 0; for (var k = 0; k < 4; k++) s += a[k*4+r] * b[c*4+k]; o[c*4+r] = s; } return o; }
  function persp(fovy, asp, n, f) { var t = 1 / Math.tan(fovy / 2), m = new Float32Array(16); m[0] = t / asp; m[5] = t; m[10] = (f+n)/(n-f); m[11] = -1; m[14] = 2*f*n/(n-f); return m; }
  function rotX(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]); }
  function rotY(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]); }
  function trans(x, y, z) { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]); }
  var W2 = 0, H2 = 0;
  function resize() {
    var cw = Math.max(2, canvas.clientWidth), ch = Math.max(2, canvas.clientHeight), s = Math.min(window.devicePixelRatio || 1, 2);
    W2 = Math.round(cw * s); H2 = Math.round(ch * s); canvas.width = W2; canvas.height = H2; gl.viewport(0, 0, W2, H2);
  }
  window.addEventListener('resize', resize); resize();
  var visible = true;
  document.addEventListener('visibilitychange', function () { visible = !document.hidden; });
  var t = 0, last = performance.now(), warnS = 0, pulseS = 0;
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (visible) {
      t += dt * (reduce ? 0.25 : 1);
      warnS += (cloudWarn - warnS) * Math.min(1, dt * 2.5);
      cloudPulse = Math.max(0, cloudPulse - dt * 1.3); pulseS = cloudPulse * cloudPulse;
      var asp = W2 / H2, tx = asp > 1 ? -0.8 : 0, dist = 3.7 * Math.max(1, 1 / (asp * 1.1));
      var mvp = mul(persp(0.7, asp, 0.1, 50), mul(trans(tx, 0, -dist), mul(rotX(0.04 * Math.sin(t * 0.25)), rotY(0.12 * Math.sin(t * 0.2)))));
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(U.u_mvp, false, mvp); gl.uniform1f(U.u_time, t);
      gl.uniform1f(U.u_px, H2 / 1080 * 3.0); gl.uniform1f(U.u_warn, warnS); gl.uniform1f(U.u_pulse, pulseS);
      gl.uniform1f(U.u_pass, 0); gl.drawArrays(gl.POINTS, 0, N);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

(function(){
  function card(){
    var pw=document.querySelector('input[type=password]');if(!pw){return;}
    var el=pw.parentElement;
    while(el&&el!==document.body){
      var bg=getComputedStyle(el).backgroundColor;
      if(bg==='rgb(255, 255, 255)'&&el.offsetWidth>200){break;}
      el=el.parentElement;
    }
    if(!el||el===document.body){el=pw.closest('form')||pw.parentElement;}
    function place(){if(window.innerWidth>900){var mg=Math.max(40,window.innerWidth*0.12),mx=(window.innerWidth-el.offsetWidth)/2-mg;el.style.translate=Math.max(0,mx)+'px 0';}else{el.style.translate='';}}place();window.addEventListener('resize',place);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',card);}else{card();}
})();

(function(){requestAnimationFrame(function(){requestAnimationFrame(function(){document.body.classList.add('ready');});});})();
