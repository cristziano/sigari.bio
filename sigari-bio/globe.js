// Hero globe: a white dotted globe; orange lines leave from different places, each with a small
// social icon riding on it, and all land on the same point (Italy), then fade away.
const ICON_CDN = "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/";
const ORANGE = "255,106,43";
// rough continents as [lon, lat] polygons: enough for a dotted look
const LAND = [
  [[-168,66],[-162,70],[-140,70],[-125,72],[-95,72],[-80,73],[-62,66],[-56,52],[-66,45],[-70,42],[-76,35],[-81,31],[-80,25],[-82,28],[-90,30],[-97,27],[-97,21],[-92,18],[-87,21],[-84,15],[-83,9],[-79,8],[-86,12],[-92,15],[-105,20],[-110,24],[-112,30],[-117,32],[-124,40],[-124,48],[-132,55],[-140,60],[-152,59],[-158,57],[-165,61]],
  [[-55,60],[-44,60],[-20,70],[-18,78],[-30,83],[-60,82],[-72,78],[-58,75],[-52,68]],
  [[-79,8],[-72,12],[-62,10],[-50,0],[-35,-6],[-39,-14],[-41,-22],[-48,-27],[-58,-35],[-63,-40],[-65,-47],[-69,-52],[-74,-52],[-73,-40],[-71,-30],[-70,-18],[-76,-14],[-81,-5],[-80,1]],
  [[-10,36],[-9,43],[-2,44],[-4,48],[2,51],[8,54],[8,57],[5,62],[14,68],[25,71],[40,68],[44,66],[42,58],[40,47],[30,45],[28,41],[23,37],[20,40],[16,38],[18,40],[13,45],[10,44],[6,43],[3,42],[0,38],[-6,36]],
  [[26,40],[36,36],[34,28],[43,12],[52,16],[58,22],[62,25],[67,24],[72,20],[77,8],[80,14],[88,22],[92,22],[98,16],[100,6],[104,1],[104,10],[109,12],[108,21],[117,23],[121,30],[122,37],[118,39],[122,41],[129,35],[130,42],[136,46],[141,53],[135,55],[143,59],[156,57],[163,60],[170,60],[180,65],[180,69],[160,70],[140,72],[113,74],[100,77],[80,73],[68,69],[60,69],[44,66],[40,68],[30,62],[30,45]],
  [[-17,15],[-17,21],[-13,27],[-10,30],[-6,36],[10,37],[11,33],[20,31],[25,32],[32,31],[34,28],[43,12],[51,12],[50,2],[40,-10],[40,-16],[35,-24],[32,-29],[27,-34],[20,-35],[18,-30],[12,-17],[13,-6],[9,-1],[9,4],[4,6],[-8,4],[-13,8],[-17,13]],
  [[113,-22],[114,-34],[118,-35],[124,-33],[131,-31],[137,-35],[140,-38],[146,-39],[150,-37],[153,-28],[153,-25],[146,-19],[142,-11],[136,-12],[136,-15],[130,-12],[125,-14],[122,-18]],
  [[95,5],[106,-6],[115,-8],[125,-8],[120,-2],[118,6],[110,2],[104,2]],
  [[130,31],[135,34],[141,41],[142,45],[140,40],[136,36]],
  [[-5,50],[1,51],[2,53],[-1,57],[-3,59],[-6,57],[-5,54],[-3,52]],
  [[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]],
];
const inPoly = (x, y, p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const isLand = (lo, la) => LAND.some(p => inPoly(lo, la, p));
const vec = (lo, la) => { const a = lo * Math.PI / 180, b = la * Math.PI / 180; return [Math.cos(b) * Math.sin(a), Math.sin(b), Math.cos(b) * Math.cos(a)]; };

// where the lines start (lon, lat) and which icon rides on them
const FROM = [["instagram", -74, 40], ["telegram", 55, 25], ["x", 3, 6], ["github", 77, 28], ["ethereum", 37, 56], ["bitcoin", 18, -34],
  ["discord", -43, -22], ["tiktok", 103, 1], ["spotify", -22, 64], ["youtube", 31, 30], ["twitch", -9, 38], ["reddit", 47, -19]];
const HOME = vec(12, 43);

export function mountGlobe(canvas) {
  const ctx = canvas.getContext("2d"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dots = [];
  for (let la = -58; la <= 80; la += 2) {
    const step = 2 / Math.max(.25, Math.cos(la * Math.PI / 180));
    for (let lo = -180; lo < 180; lo += step) if (isLand(lo, la)) dots.push(vec(lo, la));
  }
  // icons: the black simple-icons svg, turned white on a small canvas
  const icons = {};
  FROM.forEach(([k]) => {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); g.drawImage(img, 0, 0, 64, 64); g.globalCompositeOperation = "source-in"; g.fillStyle = "#fff"; g.fillRect(0, 0, 64, 64); icons[k] = c; };
    img.src = ICON_CDN + k + ".svg";
  });
  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0;
  const size = () => {
    dpr = Math.min(2, devicePixelRatio || 1); const r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.min(H * .42, W * .48); cx = W - R * .8; cy = H * .54;
  };
  let yaw = 0, pitch = .5;
  const rot = ([x, y, z]) => { const c = Math.cos(yaw), s = Math.sin(yaw); const x1 = x * c - z * s, z1 = x * s + z * c; const cp = Math.cos(pitch), sp = Math.sin(pitch); return [x1, y * cp - z1 * sp, y * sp + z1 * cp]; };
  const proj = p => { const [x, y, z] = rot(p); return [cx + x * R, cy - y * R, z]; };
  const slerp = (a, b, t) => { const d = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), s = Math.sin(d) || 1; const k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s; return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2]; };
  const arcs = []; let next = 0, idx = 0;
  const spawn = now => { const [k, lo, la] = FROM[idx++ % FROM.length]; const a = vec(lo, la); const ang = Math.acos(a[0] * HOME[0] + a[1] * HOME[1] + a[2] * HOME[2]); arcs.push({ k, a, h: .12 + ang * .14, t0: now, dur: 1700 }); };
  const ease = t => 1 - Math.pow(1 - t, 3);
  const point = (arc, t) => { const p = slerp(arc.a, HOME, t), m = 1 + arc.h * Math.sin(Math.PI * t); return proj([p[0] * m, p[1] * m, p[2] * m]); };
  const pulses = [];
  const draw = now => {
    ctx.clearRect(0, 0, W, H);
    yaw = (24 + Math.sin(now / 1900) * 38) * Math.PI / 180;
    // glow: a soft white halo around the globe
    const halo = ctx.createRadialGradient(cx, cy, R * .85, cx, cy, R * 1.45);
    halo.addColorStop(0, "rgba(255,255,255,.13)"); halo.addColorStop(.35, "rgba(255,255,255,.05)"); halo.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.45, 0, Math.PI * 2); ctx.fill();
    // the sphere: soft white body and a light rim
    const g = ctx.createRadialGradient(cx - R * .35, cy - R * .4, R * .1, cx, cy, R);
    g.addColorStop(0, "rgba(255,255,255,.16)"); g.addColorStop(.6, "rgba(255,255,255,.06)"); g.addColorStop(1, "rgba(255,255,255,.02)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.shadowColor = "rgba(255,255,255,.55)"; ctx.shadowBlur = 18; ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    for (const d of dots) { const [x, y, z] = proj(d); if (z <= 0) continue; ctx.fillStyle = `rgba(255,255,255,${.18 + z * .62})`; ctx.fillRect(x - .9, y - .9, 1.8, 1.8); }
    const [hx, hy] = proj(HOME);
    ctx.save(); ctx.shadowColor = "#fff"; ctx.shadowBlur = 12; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(hx, hy, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (!reduce && now > next) { spawn(now); next = now + 900; }
    for (let i = arcs.length - 1; i >= 0; i--) {
      const A = arcs[i], t = (now - A.t0) / A.dur;
      if (t >= 1.35) { arcs.splice(i, 1); continue; }
      const head = ease(Math.min(1, t)), tail = ease(Math.max(0, Math.min(1, (t - .35) / 1)));
      if (t >= 1 && !A.landed) { A.landed = true; pulses.push({ t0: now }); }
      const N = 40; ctx.lineWidth = 1.6; ctx.lineCap = "round";
      let prev = null;
      for (let j = 0; j <= N; j++) {
        const u = tail + (head - tail) * j / N, p = point(A, u);
        if (prev && (p[2] > -.05 || Math.hypot(p[0] - cx, p[1] - cy) > R)) { const a = j / N; ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.strokeStyle = `rgba(${ORANGE},${a * .22})`; ctx.lineWidth = 7; ctx.stroke(); ctx.strokeStyle = `rgba(${ORANGE},${a * .95})`; ctx.lineWidth = 1.6; ctx.stroke(); }
        prev = p;
      }
      // the icon rides on top of the line head, transparent, and fades as it lands
      const ic = icons[A.k];
      if (ic && t < 1) { const p = point(A, head), al = Math.min(1, t * 5) * (1 - Math.max(0, (t - .75) / .25)); ctx.globalAlpha = al * .7; ctx.drawImage(ic, p[0] - 9, p[1] - 26, 18, 18); ctx.globalAlpha = 1; }
      if (t < 1) { const p = point(A, head); ctx.save(); ctx.shadowColor = `rgb(${ORANGE})`; ctx.shadowBlur = 16; ctx.fillStyle = `rgb(${ORANGE})`; ctx.beginPath(); ctx.arc(p[0], p[1], 2.6, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const k = (now - pulses[i].t0) / 700; if (k >= 1) { pulses.splice(i, 1); continue; }
      ctx.save(); ctx.shadowColor = `rgb(${ORANGE})`; ctx.shadowBlur = 14; ctx.strokeStyle = `rgba(${ORANGE},${(1 - k) * .9})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(hx, hy, 3 + k * 18, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
  };
  let raf = 0, on = false;
  const loop = now => { draw(now); raf = on ? requestAnimationFrame(loop) : 0; };
  size(); addEventListener("resize", () => { size(); if (!on) draw(performance.now()); });
  if (reduce) { draw(performance.now()); return; }
  new IntersectionObserver(([e]) => { on = e.isIntersecting && !document.hidden; if (on && !raf) raf = requestAnimationFrame(loop); }).observe(canvas);
  document.addEventListener("visibilitychange", () => { on = !document.hidden; if (on && !raf) raf = requestAnimationFrame(loop); });
}
