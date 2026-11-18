"use client";
// Background of the whole landing: a slow liquid "silk" in black and white (WebGL shader, no library).
// Faint and sharp: it only gives the background a little movement (a bit more behind the hero, even less below).
// Light on purpose: drawn at low resolution and ~30 frames per second, paused when the tab is hidden,
// a single still frame with prefers-reduced-motion. Without WebGL the page stays plain matte black.
import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/site";

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FRAG = `precision mediump float;
uniform vec2 res;uniform float t;uniform float amp;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/res.y*.95;
  float s=t*.035;
  vec2 q=vec2(fbm(uv+s),fbm(uv+vec2(5.2,1.3)-s));
  vec2 r=vec2(fbm(uv+2.6*q+vec2(1.7,9.2)+s*1.3),fbm(uv+2.6*q+vec2(8.3,2.8)-s));
  float f=fbm(uv+2.2*r);
  float silk=smoothstep(.42,.64,f);           // folds with crisper edges
  float edge=smoothstep(.016,0.,abs(r.x-.52));  // a thin, sharp bright line along a fold
  float v=pow(silk,1.7)*.85+edge*.55*silk;
  float left=mix(1.25,1.,smoothstep(0.,.7,gl_FragCoord.x/res.x)); // a touch stronger on the left side
  gl_FragColor=vec4(vec3(.043+v*amp*left),1.);   // matte black + the silk
}`;

export default function AuroraBackground() {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current;
    const gl = c?.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!c || !gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(pr, "res"), uT = gl.getUniformLocation(pr, "t"), uAmp = gl.getUniformLocation(pr, "amp");

    // low resolution: the silk is soft anyway, so it costs little
    const scale = innerWidth < 768 ? .45 : .55; // high enough for sharp lines, still light
    const size = () => { c.width = Math.max(2, Math.round(innerWidth * scale)); c.height = Math.max(2, Math.round(innerHeight * scale)); gl.viewport(0, 0, c.width, c.height); gl.uniform2f(uRes, c.width, c.height); };
    size();
    // more visible behind the hero, very dark and delicate everywhere else
    const amp = () => { const k = Math.min(1, Math.max(0, (scrollY - innerHeight * .25) / (innerHeight * .75))); return .11 + (.07 - .11) * k; };
    const t0 = performance.now();
    const draw = () => { gl.uniform1f(uT, (performance.now() - t0) / 1000); gl.uniform1f(uAmp, amp()); gl.drawArrays(gl.TRIANGLES, 0, 3); };

    let raf = 0, last = 0;
    const still = reducedMotion();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30 frames per second
      last = now; draw();
    };
    const start = () => { if (!raf && !still && !document.hidden) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const vis = () => (document.hidden ? stop() : start());
    const re = () => { size(); draw(); };
    const sc = () => { if (still) draw(); };
    draw(); start();
    document.addEventListener("visibilitychange", vis);
    addEventListener("resize", re);
    addEventListener("scroll", sc, { passive: true });
    return () => { stop(); document.removeEventListener("visibilitychange", vis); removeEventListener("resize", re); removeEventListener("scroll", sc); };
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#0b0b0b]">
      <canvas ref={cv} className="size-full" />
    </div>
  );
}
