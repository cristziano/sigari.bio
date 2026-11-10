// 18k avatar decorations: original drawings, detailed (gradients, light, shading, small animations).
// Box 100x100, the photo is the circle of radius 30 at 50,50; everything can go out of the box.
const P = (n, f) => Array.from({ length: n }, (_, i) => f(i, i * 360 / n)).join("");
const rad = a => (a - 90) * Math.PI / 180;
const pt = (r, a) => [(50 + r * Math.cos(rad(a))).toFixed(2), (50 + r * Math.sin(rad(a))).toFixed(2)];
// a closed path around the centre whose radius changes with the angle
const polar = (fr, steps = 120) => "M" + Array.from({ length: steps }, (_, i) => pt(fr(i * 360 / steps), i * 360 / steps).join(" ")).join("L") + "Z";
const star = (x, y, s, fill, d = 0) => `<path class="tw" style="animation-delay:${d}s" d="M${x} ${y - 3 * s}C${x + .4 * s} ${y - .6 * s} ${x + .6 * s} ${y - .4 * s} ${x + 3 * s} ${y}C${x + .6 * s} ${y + .4 * s} ${x + .4 * s} ${y + .6 * s} ${x} ${y + 3 * s}C${x - .4 * s} ${y + .6 * s} ${x - .6 * s} ${y + .4 * s} ${x - 3 * s} ${y}C${x - .6 * s} ${y - .4 * s} ${x - .4 * s} ${y - .6 * s} ${x} ${y - 3 * s}Z" fill="${fill}"/>`;
const lg = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`;
const rg = (id, stops, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</radialGradient>`;
const glow = (id, sd = 1.6) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

// a rose seen from above: base, spiral petals, light
const rose = (x, y, s, id) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="6" fill="url(#${id})"/><path d="M-4.6 1.5C-5 -3 -1 -5.6 2.4 -4.4M4.8 -1.2C5.4 3 1.6 5.8 -2 4.8M-2.6 -1.4C-1.6 -3.4 1.8 -3 2.4 -.6M2.2 1C1.4 2.8 -1.6 2.8 -2 .6M-.8 -.2C-.2 -1 .8 -.6 .6 .2" fill="none" stroke="#5c0614" stroke-width=".7" stroke-linecap="round"/><path d="M-4 -2.6C-2.6 -4.6 0 -5.2 2 -4.6" fill="none" stroke="#ff8195" stroke-width=".55" stroke-linecap="round" opacity=".8"/></g>`;
const leaf = (x, y, a, s, fill) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0C3 -3 8 -3 11 0C8 3 3 3 0 0Z" fill="${fill}"/><path d="M0 0L10 0M4 0L6 -1.6M6.5 0L8.3 -1.3M4 0L6 1.6M6.5 0L8.3 1.3" stroke="rgba(0,0,0,.28)" stroke-width=".35" fill="none"/></g>`;
// maple leaf: five lobes with teeth
const maple = (x, y, a, s, id) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 4.6L.4 2.6 2.6 3.4 2.4 2 4.8 1.2 4 .4 5.6-1.6 3.6-1.6 4 -3.6 2.2-2.6 1.6-4.2 .8-3.2 0-6 -.8-3.2 -1.6-4.2 -2.2-2.6 -4-3.6 -3.6-1.6 -5.6-1.6 -4 .4 -4.8 1.2 -2.4 2 -2.6 3.4 -.4 2.6Z" fill="url(#${id})"/><path d="M0 4.6V-5M0 .4L3.6-2M0 .4L-3.6-2M0 1.8L3.4 2M0 1.8L-3.4 2" stroke="rgba(80,20,0,.45)" stroke-width=".3" fill="none"/><path d="M0 4.6l-.2 2.6" stroke="#6b2a0e" stroke-width=".5"/></g>`;
// a feather for the wings
const feather = (x, y, a, len, w, id) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0C${w} ${-len * .25} ${w * .9} ${-len * .75} 0 ${-len}C${-w * .9} ${-len * .75} ${-w} ${-len * .25} 0 0Z" fill="url(#${id})" stroke="#c9d2ee" stroke-width=".25"/><path d="M0 0L0 ${-len * .92}" stroke="#d8deef" stroke-width=".3"/></g>`;
// a flame pointing out of the circle
const flame = (a, h, w, fill, d, cls = "flick") => `<g transform="rotate(${a} 50 50)"><path class="${cls}" style="animation-delay:${d}s;transform-box:fill-box;transform-origin:50% 100%" d="M${50 - w} 21C${50 - w} ${21 - h * .45} ${50 - w * .15} ${21 - h * .55} 50 ${21 - h}C${50 + w * .15} ${21 - h * .55} ${50 + w} ${21 - h * .45} ${50 + w} 21Z" fill="${fill}"/></g>`;

export const DECO = {
  moon: `<defs>${rg("kxmo", [[0, "#fffef6"], [.55, "#ece7ff"], [1, "#9a94d4"]], .3, .45, .75)}${glow("kxmog", 2.2)}<mask id="kxmom"><rect x="-20" y="-20" width="140" height="140" fill="#fff"/><circle cx="57" cy="46" r="38.5" fill="#000"/></mask></defs>
    <g filter="url(#kxmog)"><circle cx="40" cy="50" r="44" fill="url(#kxmo)" mask="url(#kxmom)"/></g>
    <g mask="url(#kxmom)" opacity=".55"><circle cx="3" cy="44" r="3.2" fill="#b6b0e3"/><circle cx="2.6" cy="43.4" r="2.2" fill="#c9c4ee"/><circle cx="9" cy="66" r="2.2" fill="#b6b0e3"/><circle cx="11" cy="24" r="1.6" fill="#b6b0e3"/><circle cx="6" cy="80" r="1.3" fill="#b6b0e3"/></g>
    <path d="M14 13C6 22 2 34 2.4 48" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".7"/>
    ${star(78, 14, 1.4, "#fffbe6", 0)}${star(90, 34, .9, "#e9e4ff", .7)}${star(86, 78, 1.1, "#fffbe6", 1.3)}${star(64, 95, .7, "#e9e4ff", .4)}<circle cx="70" cy="6" r=".7" fill="#fff" class="tw" style="animation-delay:.9s"/><circle cx="95" cy="56" r=".6" fill="#fff" class="tw" style="animation-delay:1.6s"/>`,

  thorns: `<defs>${lg("kxth", [[0, "#3a0710"], [.5, "#8f1426"], [1, "#2a050b"]], 1, 1)}${lg("kxtt", [[0, "#ff5c72"], [1, "#6a0a17"]])}</defs>
    <path d="${polar(a => 35 + 2.6 * Math.sin(rad(a * 6)), 96)}" fill="none" stroke="url(#kxth)" stroke-width="3" stroke-linejoin="round"/>
    <path d="${polar(a => 35 - 2.6 * Math.sin(rad(a * 6 + 40)), 96)}" fill="none" stroke="url(#kxth)" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="${polar(a => 35.6 + 2.6 * Math.sin(rad(a * 6)), 96)}" fill="none" stroke="#ff6b80" stroke-width=".45" opacity=".55"/>
    ${P(30, (i, a) => { const r = 35 + 2.6 * Math.sin(rad(a * 6)) * (i % 2 ? 1 : -1), out = i % 3 !== 1; const [x, y] = pt(r, a); return `<path transform="translate(${x} ${y}) rotate(${a + (out ? 0 : 180) + (i % 2 ? 18 : -18)})" d="M-1.1 0L0 ${-4.2 - (i % 4) * .6}L1.1 0Z" fill="url(#kxtt)"/>`; })}
    <path d="M71 79c.9 1.6 2.4 3 2.4 4.6a2.4 2.4 0 0 1-4.8 0c0-1.6 1.5-3 2.4-4.6z" fill="#c4122c"/><circle cx="70.4" cy="83.6" r=".6" fill="#ff9aa8"/>`,

  fire: `<defs>${lg("kxf1", [[0, "#fff6b0"], [.35, "#ffb62e"], [.75, "#ff4a0a"], [1, "#b8120a", .0]], 0, -1)}${lg("kxf2", [[0, "#fffbe0"], [.5, "#ffd24a"], [1, "#ff8a00", 0]], 0, -1)}${glow("kxfg", 1.8)}</defs>
    <g filter="url(#kxfg)">
      ${P(16, (i, a) => flame(a, 13 + (i % 3) * 4, 5.4, "#d6260a", (i % 5) * .13))}
      ${P(16, (i, a) => flame(a + 11, 10 + (i % 4) * 3, 4.2, "#ff6a00", (i % 4) * .17))}
      ${P(16, (i, a) => flame(a + 5, 7 + (i % 3) * 2, 2.8, "#ffc42e", (i % 3) * .2))}
      ${P(16, (i, a) => flame(a + 16, 4 + (i % 2) * 2, 1.6, "#fff3b0", (i % 2) * .25))}
    </g>
    <circle cx="50" cy="50" r="30.6" fill="none" stroke="#ffb02e" stroke-width="1.6" opacity=".9"/>`,

  blackcat: `<defs>${lg("kxcf", [[0, "#3b3b42"], [1, "#0b0b0d"]], .4, 1)}${lg("kxcp", [[0, "#ffc2d3"], [1, "#d4607f"]], 0, 1)}${rg("kxcb", [[0, "#fff6c4"], [.5, "#f1c232"], [1, "#9c6a00"]], .35, .35, .7)}</defs>
    ${[-1, 1].map(s => `<g transform="translate(${50 + s * 22} 26) scale(${s} 1)"><path d="M-9 8C-11 -2 -9 -14 -4 -22C2 -16 8 -6 10 4Z" fill="url(#kxcf)" stroke="#4b4b55" stroke-width=".6"/><path d="M-6 6C-7 -2 -6 -10 -3.4 -15.6C.6 -10.6 4 -4 5.6 3Z" fill="url(#kxcp)"/><path d="M-3 4l-1.6-6M0 4l-.2-6.4M2.8 3.4l1-5.6" stroke="#fff" stroke-width=".45" stroke-linecap="round" opacity=".75"/><path d="M-4 -21C-2 -18 0 -16 2 -15" stroke="#6a6a75" stroke-width=".5" fill="none"/></g>`).join("")}
    ${[-1, 1].map(s => P(3, i => `<path d="M${50 + s * 26} ${60 + i * 3.4}C${50 + s * 34} ${58 + i * 4} ${50 + s * 42} ${57 + i * 5.6} ${50 + s * 49} ${56 + i * 7.2}" fill="none" stroke="#f4f4f4" stroke-width=".55" stroke-linecap="round" opacity=".9"/>`)).join("")}
    <path d="M27 82C36 90 64 90 73 82" fill="none" stroke="#b3122e" stroke-width="3.2" stroke-linecap="round"/><path d="M27 82C36 90 64 90 73 82" fill="none" stroke="#ff5c74" stroke-width=".7" stroke-linecap="round" transform="translate(0 -1)" opacity=".7"/>
    <g transform="translate(50 91)"><circle r="3.6" fill="url(#kxcb)"/><path d="M-1.6 .6h3.2M0 .6v2.4" stroke="#6b4a00" stroke-width=".6"/><circle cx="-1" cy="-1.2" r=".7" fill="#fff" opacity=".8"/></g>`,

  fox: `<defs>${lg("kxfo", [[0, "#ffb15a"], [.6, "#ff7a1f"], [1, "#c2440f"]], .3, 1)}${lg("kxft", [[0, "#ff9a3d"], [.7, "#e05a1a"], [1, "#a8360c"]], 1, 0)}</defs>
    ${[-1, 1].map(s => `<g transform="translate(${50 + s * 22} 25) scale(${s} 1)"><path d="M-10 9C-11 -3 -8 -15 -3 -23C3 -16 9 -6 11 5Z" fill="url(#kxfo)"/><path d="M-3 -23C-2 -20 0 -17.6 2.6 -16C1 -19 -.6 -21.6 -3 -23Z" fill="#2b1408"/><path d="M-6 6C-6.6 -2 -5 -9 -2.6 -14C1 -9.4 4.4 -3.6 6 3.4Z" fill="#fff3e3"/>${P(5, i => `<path d="M${-4 + i * 2.2} 5l${-.6 + i * .2} -5" stroke="#f0d6bb" stroke-width=".5" stroke-linecap="round"/>`)}</g>`).join("")}
    <path d="M58 93C70 96 86 90 93 76C95 70 92 64 88 66C85 76 76 84 63 86C58 87 55 91 58 93Z" fill="url(#kxft)"/>
    <path d="M86 70C88 66 92 64 94 68C95 72 93 76 91 79C90 75 88 72 86 70Z" fill="#fff6ea"/>
    ${P(6, i => `<path d="M${64 + i * 4.6} ${89 - i * 2.6}l${1.6} ${-2.2}" stroke="#ffd2a4" stroke-width=".5" stroke-linecap="round" opacity=".8"/>`)}`,

  angel: `<defs>${lg("kxwf", [[0, "#ffffff"], [1, "#d7defa"]], 0, 1)}${lg("kxha", [[0, "#fff6c2"], [.5, "#ffd24a"], [1, "#e0a400"]], 1, 0)}${glow("kxhg", 1.6)}</defs>
    <g class="bob">${[-1, 1].map(s => `<g transform="translate(${50 + s * 21} 60) scale(${s} 1)">${[[0, 9, 38, 6.4], [1, 8, 28, 5.4], [2, 7, 18, 4.4]].map(([row, n, len, w]) => P(n, j => feather(row * 2.6, -row * 2.4, 12 + j * (84 / n) + row * 5, len - j * (row ? 1.6 : 2.4), w, "kxwf"))).join("")}</g>`).join("")}</g>
    <g class="bob" filter="url(#kxhg)"><ellipse cx="50" cy="9" rx="18" ry="4.6" fill="none" stroke="url(#kxha)" stroke-width="2.6"/><ellipse cx="50" cy="8.2" rx="16" ry="3.4" fill="none" stroke="#fffbe0" stroke-width=".6" opacity=".8"/></g>`,

  demon: `<defs>${lg("kxdh", [[0, "#ff8a8a"], [.25, "#c2172f"], [.7, "#5e0713"], [1, "#2a0207"]], 0, 1)}${lg("kxdw", [[0, "#4a0b14"], [1, "#120205"]], 1, 1)}</defs>
    ${[-1, 1].map(s => `<g transform="translate(${50 + s * 18} 24) scale(${s} 1)"><path d="M-6 6C-12 0 -14 -10 -9 -22C-8 -14 -4 -8 4 -4C2 0 -2 4 -6 6Z" fill="url(#kxdh)" stroke="#2a0207" stroke-width=".5"/>${P(5, i => `<path d="M${-11 + i * 1.6} ${-14 + i * 3.6}q2 1 4 .4" stroke="#2a0207" stroke-width=".55" fill="none" opacity=".7"/>`)}<path d="M-9.4 -20C-9.6 -14 -7.6 -9 -3 -6" stroke="#ffb3b3" stroke-width=".5" fill="none" opacity=".7"/></g>`).join("")}
    <g class="bob">${[-1, 1].map(s => `<g transform="translate(${50 + s * 27} 64) scale(${s} 1)"><path d="M0 0C4 -12 14 -18 24 -16C21 -12 21 -8 23 -5C19 -6 16 -4 15 0C12 -2 9 -1 8 2C6 0 3 0 0 0Z" fill="url(#kxdw)" stroke="#c2172f" stroke-width=".7"/><path d="M0 0L24 -16M0 0L23 -5M0 0L15 0M0 0L8 2" stroke="#7a0f1d" stroke-width=".5" fill="none"/></g>`).join("")}</g>`,

  roses: `<defs>${rg("kxro", [[0, "#ff4d6a"], [.6, "#c0102c"], [1, "#6e0716"]], .4, .4, .7)}${lg("kxlv", [[0, "#5cae4a"], [1, "#24561c"]], 1, 1)}</defs>
    <path d="M8 58C6 40 14 22 30 12M92 42C94 60 86 78 70 88" fill="none" stroke="#2f5a26" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M12 48C11 36 16 26 24 18M88 52C89 64 84 74 76 82" fill="none" stroke="#3f7a32" stroke-width=".8" stroke-linecap="round"/>
    ${leaf(9, 46, -120, 1, "url(#kxlv)")}${leaf(14, 30, -150, .9, "url(#kxlv)")}${leaf(25, 16, 160, .9, "url(#kxlv)")}${leaf(91, 54, 60, 1, "url(#kxlv)")}${leaf(86, 70, 30, .9, "url(#kxlv)")}${leaf(75, 84, -20, .9, "url(#kxlv)")}
    ${rose(18, 24, 1.15, "kxro")}${rose(30, 12, .9, "kxro")}${rose(9, 38, .75, "kxro")}${rose(82, 76, 1.15, "kxro")}${rose(70, 88, .9, "kxro")}${rose(91, 62, .75, "kxro")}
    <circle cx="38" cy="7" r="1.6" fill="#ff8ba0"/><circle cx="62" cy="93" r="1.6" fill="#ff8ba0"/>`,

  autumn: `<defs>${lg("kxa1", [[0, "#ffd04a"], [1, "#e0451b"]], 1, 1)}${lg("kxa2", [[0, "#ff7a2e"], [1, "#8f1a0a"]], 1, 1)}${lg("kxa3", [[0, "#ffb02e"], [1, "#b8400c"]], 0, 1)}</defs>
    <path d="M14 84C30 98 70 98 86 84" fill="none" stroke="#5a2e12" stroke-width="2" stroke-linecap="round"/>
    ${[[16, 82, -40, 1.5, 1], [24, 89, -10, 1.7, 2], [33, 93, 20, 1.4, 3], [43, 96, -15, 1.8, 1], [53, 96, 25, 1.5, 2], [63, 94, -25, 1.7, 3], [72, 90, 10, 1.5, 1], [81, 84, 40, 1.6, 2], [38, 90, 60, 1, 3], [60, 90, -50, 1.1, 1]].map(([x, y, a, s, g]) => maple(x, y, a, s, "kxa" + g)).join("")}
    ${[[86, 30, -20, 1.2, 2, 0], [92, 48, 50, 1, 3, .8], [14, 28, 30, 1, 1, 1.4]].map(([x, y, a, s, g, d]) => `<g class="bob" style="animation-delay:${d}s">${maple(x, y, a, s, "kxa" + g)}</g>`).join("")}`,

  pearls: `<defs>${rg("kxpe", [[0, "#ffffff"], [.45, "#f6efff"], [.8, "#d6c8ee"], [1, "#9d8cc0"]], .35, .3, .75)}${lg("kxpi", [[0, "#ff9de2", .5], [.5, "#9de2ff", .2], [1, "#fff59d", .45]], 1, 1)}${rg("kxgb", [[0, "#fff4c0"], [1, "#b98a1a"]], .35, .35, .7)}</defs>
    ${P(20, (i, a) => { const [x, y] = pt(35.5, a), [gx, gy] = pt(35.5, a + 9); return `<circle cx="${x}" cy="${y}" r="3.3" fill="url(#kxpe)"/><circle cx="${x}" cy="${y}" r="3.3" fill="url(#kxpi)"/><circle cx="${(+x - 1.1).toFixed(2)}" cy="${(+y - 1.2).toFixed(2)}" r=".8" fill="#fff"/><circle cx="${gx}" cy="${gy}" r="1.1" fill="url(#kxgb)"/>`; })}
    ${star(86, 16, 1, "#fff", .3)}${star(14, 84, .8, "#fff", 1.1)}`,

  gold: `<defs>${lg("kxgo", [[0, "#fff4b8"], [.25, "#e6ac2c"], [.5, "#8a5a00"], [.75, "#f2c14e"], [1, "#fff0a0"]], 1, 1)}${lg("kxg2", [[0, "#ffe9a0"], [1, "#a8740a"]], 0, 1)}${rg("kxge", [[0, "#ff9ab0"], [.5, "#d4103a"], [1, "#5e0418"]], .35, .3, .75)}${rg("kxgs", [[0, "#b8e8ff"], [.5, "#1a6fd4"], [1, "#062a5e"]], .35, .3, .75)}${glow("kxgg", 1.2)}</defs>
    <circle cx="50" cy="50" r="32.4" fill="none" stroke="url(#kxgo)" stroke-width="3.4"/><circle cx="50" cy="50" r="34.6" fill="none" stroke="#7a4c00" stroke-width=".5"/><circle cx="50" cy="50" r="31.6" fill="none" stroke="#fff3c4" stroke-width=".5" opacity=".8"/>
    ${P(8, (i, a) => `<g transform="rotate(${a + 22.5} 50 50)"><path d="M50 14.6C46 12 43 13.6 44.4 16.2C45.6 18 48 16.8 47.2 15.4M50 14.6C54 12 57 13.6 55.6 16.2C54.4 18 52 16.8 52.8 15.4" fill="none" stroke="url(#kxg2)" stroke-width="1" stroke-linecap="round"/><circle cx="50" cy="13.4" r=".9" fill="#ffe28a"/></g>`)}
    ${P(4, (i, a) => `<g transform="rotate(${a} 50 50)" filter="url(#kxgg)"><path d="M50 12.6L53 17.6 50 22.6 47 17.6Z" fill="url(#${i % 2 ? "kxgs" : "kxge"})" stroke="url(#kxg2)" stroke-width=".8"/><path d="M48.6 16.2L50 14 51 15.6" stroke="#fff" stroke-width=".5" fill="none" opacity=".8"/></g>`)}
    ${star(80, 20, 1.2, "#fff6cf", 0)}${star(20, 80, 1, "#fff6cf", .9)}`,

  cosmos: `<defs><filter id="kxcs" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.4"/></filter>${rg("kxpl", [[0, "#ffd9a8"], [1, "#b8572a"]], .35, .3, .7)}</defs>
    <g class="spin" style="animation-duration:22s" filter="url(#kxcs)">${P(9, (i, a) => { const [x, y] = pt(37, a); return `<ellipse cx="${x}" cy="${y}" rx="${8 + (i % 3) * 2}" ry="5" transform="rotate(${a} ${x} ${y})" fill="${["#ff4fd8", "#7a5cff", "#2fd9ff"][i % 3]}" opacity=".75"/>`; })}</g>
    <circle cx="50" cy="50" r="31" fill="none" stroke="#e8e0ff" stroke-width=".6" opacity=".7"/>
    ${P(14, (i, a) => { const [x, y] = pt(36 + (i % 3) * 4, a + 7); return `<circle class="tw" style="animation-delay:${(i * .23).toFixed(2)}s" cx="${x}" cy="${y}" r="${.4 + (i % 3) * .3}" fill="#fff"/>`; })}
    <g transform="translate(84 18)"><circle r="4.4" fill="url(#kxpl)"/><ellipse rx="8" ry="2" transform="rotate(-20)" fill="none" stroke="#ffe6c2" stroke-width=".8" opacity=".9"/></g>
    ${star(14, 20, 1.3, "#fff", .5)}`,

  ice: `<defs>${lg("kxi1", [[0, "#ffffff"], [1, "#9fdcff"]], 1, 1)}${lg("kxi2", [[0, "#bdeaff"], [1, "#3c8fd4"]], 1, 1)}${glow("kxig", 1.4)}</defs>
    <g filter="url(#kxig)">${P(18, (i, a) => { const h = 6 + ((i * 7) % 5) * 2.4; return `<g transform="rotate(${a + (i % 2) * 6} 50 50)"><path d="M50 ${21 - h}L${52.6} 22L50 23Z" fill="url(#kxi1)"/><path d="M50 ${21 - h}L${47.4} 22L50 23Z" fill="url(#kxi2)"/></g>`; })}</g>
    <circle cx="50" cy="50" r="31" fill="none" stroke="#d8f3ff" stroke-width="1.4" opacity=".9"/>
    ${[[12, 18, 0], [88, 24, .8], [86, 84, 1.5]].map(([x, y, d]) => `<g class="tw" style="animation-delay:${d}s" transform="translate(${x} ${y})">${P(6, (i, a) => `<path transform="rotate(${a})" d="M0 0V-3.4M0 -2l-.9-.9M0 -2l.9-.9" stroke="#e9fbff" stroke-width=".5" fill="none"/>`)}</g>`).join("")}`,

  holoheart: `<defs>${lg("kxhh", [[0, "#7ad8ff"], [.35, "#b98cff"], [.7, "#ff8fd8"], [1, "#ffe08a"]], 1, 1)}${glow("kxhg2", 1.8)}</defs>
    <g filter="url(#kxhg2)"><path d="M50 95C20 76 5 59 7 37 9 18 29 8 42 17c3.4 2.2 6 5 8 8.4 2-3.4 4.6-6.2 8-8.4C71 8 91 18 93 37c2 22-13 39-43 58z" fill="none" stroke="url(#kxhh)" stroke-width="3.6" stroke-linejoin="round"/></g>
    <path d="M50 90C24 73 11 58 12.6 38.4 14.2 22.6 30.6 14 41.4 21.6" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".75"/>
    ${star(88, 18, 1.4, "#fff", 0)}${star(10, 70, 1, "#fff", .8)}${star(78, 86, .9, "#fff", 1.4)}`,

  shark: `<defs>${lg("kxsk", [[0, "#7f9fbf"], [1, "#2b4560"]], 0, 1)}${rg("kxsg", [[.7, "#7a1020"], [.85, "#d4485e"], [1, "#7a1020"]])}${lg("kxst", [[0, "#ffffff"], [1, "#d9d2bf"]], 0, 1)}</defs>
    <path d="M50 50m-46 0a46 46 0 1 0 92 0a46 46 0 1 0-92 0M50 50m-38.6 0a38.6 38.6 0 1 1 77.2 0a38.6 38.6 0 1 1-77.2 0" fill="url(#kxsk)" fill-rule="evenodd"/>
    <path d="M50 50m-38.6 0a38.6 38.6 0 1 0 77.2 0a38.6 38.6 0 1 0-77.2 0M50 50m-31 0a31 31 0 1 1 62 0a31 31 0 1 1-62 0" fill="url(#kxsg)" fill-rule="evenodd"/>
    ${P(18, (i, a) => `<g transform="rotate(${a} 50 50)"><path d="M47.4 12.2L50 ${i % 2 ? 22.6 : 24}L52.6 12.2Z" fill="url(#kxst)"/><path d="M50 13L50 ${i % 2 ? 21 : 22.4}" stroke="#bdb6a4" stroke-width=".35"/></g>`)}
    <path d="M12 30C18 18 30 9 44 6.4" fill="none" stroke="#c8dcef" stroke-width=".8" opacity=".6"/><circle cx="83" cy="20" r="2" fill="#0d1620"/><circle cx="82.4" cy="19.4" r=".6" fill="#fff"/>`,

  phones: `<defs>${lg("kxhm", [[0, "#f2f4f7"], [.5, "#8e959e"], [1, "#3a3f46"]], 0, 1)}${lg("kxhc", [[0, "#2a2d33"], [1, "#0e0f12"]], 1, 0)}</defs>
    <path d="M18 56C18 30 32 12 50 12S82 30 82 56" fill="none" stroke="url(#kxhm)" stroke-width="5" stroke-linecap="round"/>
    <path d="M22 54C22 32 34 17 50 17S78 32 78 54" fill="none" stroke="#1b1d21" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M24 30C30 20 39 15 50 14.6" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".7"/>
    ${[-1, 1].map(s => `<g transform="translate(${50 + s * 33} 60) scale(${s} 1)"><rect x="-6" y="-12" width="12" height="24" rx="5.4" fill="url(#kxhc)" stroke="#4a4f57" stroke-width=".7"/><rect x="3.4" y="-10" width="4.6" height="20" rx="2.2" fill="#2b2e35"/><rect x="-5" y="-9" width="1.4" height="18" rx=".7" fill="currentColor" opacity=".9" style="filter:drop-shadow(0 0 2px currentColor)"/></g>`).join("")}
    <path d="M17 70C17 80 24 86 34 87" fill="none" stroke="#2b2e35" stroke-width="1.8" stroke-linecap="round"/><circle cx="35.4" cy="87.2" r="2.4" fill="#16181c" stroke="#4a4f57" stroke-width=".6"/><circle cx="35.4" cy="87.2" r=".8" fill="currentColor" class="tw"/>`,

  skull: `<defs>${lg("kxbn", [[0, "#fbf7ec"], [1, "#c9c0a8"]], 0, 1)}${rg("kxsk2", [[0, "#ffffff"], [.7, "#e9e2cf"], [1, "#b5ab92"]], .4, .35, .7)}</defs>
    ${P(10, (i, a) => i === 5 ? "" : `<g transform="rotate(${a} 50 50)"><rect x="47.6" y="11.6" width="4.8" height="8" rx="1.4" fill="url(#kxbn)"/><circle cx="47.2" cy="11.8" r="1.9" fill="url(#kxbn)"/><circle cx="52.8" cy="11.8" r="1.9" fill="url(#kxbn)"/><circle cx="47.2" cy="19.4" r="1.9" fill="url(#kxbn)"/><circle cx="52.8" cy="19.4" r="1.9" fill="url(#kxbn)"/><path d="M48.2 13v5.6" stroke="#fff" stroke-width=".5" opacity=".8"/></g>`)}
    <g transform="translate(50 88)"><path d="M-9 0C-9 -7 -5 -11 0 -11S9 -7 9 0C9 3 7 4.4 5.6 5V8H-5.6V5C-7 4.4 -9 3 -9 0Z" fill="url(#kxsk2)" stroke="#8f8670" stroke-width=".5"/><ellipse cx="-3.6" cy="-1" rx="2.6" ry="2.8" fill="#16130e"/><ellipse cx="3.6" cy="-1" rx="2.6" ry="2.8" fill="#16130e"/><path d="M0 2.4l-1.2 2h2.4z" fill="#16130e"/><path d="M-3 8v-2.4M-1 8v-2.4M1 8v-2.4M3 8v-2.4" stroke="#8f8670" stroke-width=".5"/><path d="M4 -10l-1.6 3 1.4 1.4" stroke="#8f8670" stroke-width=".45" fill="none"/><circle cx="-3.2" cy="-1.2" r=".7" fill="#ff3b3b" class="tw"/><circle cx="4" cy="-1.2" r=".7" fill="#ff3b3b" class="tw" style="animation-delay:.4s"/></g>`,

  ribbon: `<defs>${lg("kxbw", [[0, "#ffd3ea"], [.5, "#ff8cc6"], [1, "#d94f98"]], 0, 1)}${lg("kxbs", [[0, "#ffffff", .7], [1, "#ffffff", 0]], 0, 1)}</defs>
    <g transform="translate(30 15) rotate(-14)"><g class="bob">
      <path d="M-2 2L-6 18-1.6 15.6 0 19.6 2 3Z" fill="url(#kxbw)" stroke="#c2407f" stroke-width=".5"/><path d="M2 2L7 17.4 2.6 15.4 1.4 19.4 0 3Z" fill="url(#kxbw)" stroke="#c2407f" stroke-width=".5"/>
      <path d="M0 0C-5 -8 -17 -10 -17 -1 -17 7 -6 6 0 0Z" fill="url(#kxbw)" stroke="#c2407f" stroke-width=".6"/><path d="M0 0C5 -8 17 -10 17 -1 17 7 6 6 0 0Z" fill="url(#kxbw)" stroke="#c2407f" stroke-width=".6"/>
      <path d="M-3 -1C-7 -5 -12 -6 -14 -3M3 -1C7 -5 12 -6 14 -3M-4 1C-8 2 -11 2 -13 1M4 1C8 2 11 2 13 1" fill="none" stroke="#c2407f" stroke-width=".5" opacity=".7"/>
      <path d="M-14 -5C-12 -8 -8 -8 -5 -5" fill="none" stroke="url(#kxbs)" stroke-width="1.4" stroke-linecap="round"/>
      <ellipse rx="3.4" ry="3" fill="#e0559f" stroke="#c2407f" stroke-width=".6"/><path d="M-1.4 -1.4C-.4 -2 .8 -2 1.4 -1.2" stroke="#ffd3ea" stroke-width=".6" fill="none"/>
    </g></g>`,

  storm: `<defs>${glow("kxel", 1.4)}</defs>
    <circle cx="50" cy="50" r="32" fill="none" stroke="#8fd6ff" stroke-width="1" stroke-dasharray="2 3" opacity=".7" class="spin" style="animation-duration:6s"/>
    <g filter="url(#kxel)">${P(5, (i, a) => `<path transform="rotate(${a + 20} 50 50)" class="flk" style="animation-delay:${(i * .31).toFixed(2)}s" d="M50 18L47 11 51 10 48 3 53 1 50 -4" fill="none" stroke="#e8f8ff" stroke-width="1.1" stroke-linejoin="round"/>`)}${P(5, (i, a) => `<path transform="rotate(${a + 56} 50 50)" class="flk" style="animation-delay:${(i * .27 + .5).toFixed(2)}s" d="M50 19L52.6 13 49.4 11.6 52 6" fill="none" stroke="#5ec8ff" stroke-width=".9" stroke-linejoin="round"/>`)}</g>
    <path d="${polar(a => 31.4 + 1.2 * Math.sin(rad(a * 14)), 140)}" fill="none" stroke="#bfeaff" stroke-width=".7" opacity=".8" filter="url(#kxel)"/>`,

  sakura: `<defs>${rg("kxsp", [[0, "#ffffff"], [.45, "#ffd6e6"], [1, "#ff8fb8"]], .5, .5, .55)}</defs>
    <path d="M2 40C10 24 22 14 40 8M14 28C12 22 12 18 15 14M28 16C28 11 30 8 34 6" fill="none" stroke="#a8714c" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M3 38C10 25 21 15 38 9" fill="none" stroke="#c48d68" stroke-width=".6" stroke-linecap="round"/>
    ${[[8, 30, 1.25], [20, 18, 1.1], [33, 10, 1.2], [15, 13, .8], [42, 8, .85], [4, 44, .8]].map(([x, y, s], k) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${k * 37})">${P(5, (i, a) => `<path transform="rotate(${a})" d="M0 0C-2.4 -1.6 -2.8 -4.6 -1 -6C-.4 -5.2 .4 -5.2 1 -6C2.8 -4.6 2.4 -1.6 0 0Z" fill="url(#kxsp)" stroke="#f58ab2" stroke-width=".25"/>`)}${P(6, (i, a) => `<path transform="rotate(${a})" d="M0 0V-2.2" stroke="#d9466f" stroke-width=".3"/><circle transform="rotate(${a})" cy="-2.4" r=".35" fill="#ffe08a"/>`)}</g>`).join("")}
    ${[[70, 20, 0], [88, 46, 1.1], [76, 80, 2.2], [56, 92, .6]].map(([x, y, d]) => `<path class="bob" style="animation-delay:${d}s" d="M${x} ${y}C${x - 2} ${y - 2} ${x - 1} ${y - 4} ${x + 1} ${y - 3}C${x + 3} ${y - 2} ${x + 2} ${y} ${x} ${y}Z" fill="#ffc2d8"/>`).join("")}`
};

/* ---------- New decorations made as images (premium look, like Discord's) ----------
   File: /decos/<id>.webp (or .png), square, transparent, empty circle in the middle (72% of the width).
   They appear in the list only when ready is true. anim = the motion added by the site:
   float, breathe, sway, spin, flicker, shine, sparkle, hue, steps. */
export const DECO_IMG = [
  { id: "sakura-night", name: "Sakura di notte", group: "nature", anim: "sway", ready: false },
  { id: "hellfire", name: "Fiamme", group: "dark", anim: "flicker", ready: false },
  { id: "chrome-thorns", name: "Spine cromate", group: "dark", anim: "shine", ready: false },
  { id: "neon-city", name: "Neon city", group: "magic", anim: "flicker", ready: false },
  { id: "angel-halo", name: "Aureola", group: "magic", anim: "float", ready: false },
  { id: "devil", name: "Diavoletto", group: "dark", anim: "breathe", ready: false },
  { id: "cat-ears", name: "Orecchie da gatto", group: "animal", anim: "float", ready: false },
  { id: "kitsune", name: "Kitsune", group: "animal", anim: "breathe", ready: false },
  { id: "koi", name: "Koi", group: "animal", anim: "spin", ready: false },
  { id: "butterflies", name: "Farfalle", group: "nature", anim: "sway", ready: false },
  { id: "gold-crown", name: "Corona d'oro", group: "luxury", anim: "shine", ready: false },
  { id: "iced-chain", name: "Catena ghiacciata", group: "luxury", anim: "sparkle", ready: false },
  { id: "cash", name: "Soldi", group: "luxury", anim: "float", ready: false },
  { id: "skull-roses", name: "Teschio e rose", group: "dark", anim: "breathe", ready: false },
  { id: "bats", name: "Pipistrelli", group: "dark", anim: "float", ready: false },
  { id: "rgb-gamer", name: "Gamer RGB", group: "gaming", anim: "hue", ready: false },
  { id: "pixel-8bit", name: "Pixel 8-bit", group: "gaming", anim: "steps", ready: false },
  { id: "y2k-chrome", name: "Y2K", group: "magic", anim: "shine", ready: false },
  { id: "storm", name: "Tempesta", group: "magic", anim: "flicker", ready: false },
  { id: "galaxy", name: "Galassia", group: "magic", anim: "spin", ready: false },
];
export const DECO_IMG_BY = Object.fromEntries(DECO_IMG.map(d => [d.id, d]));
export const decoImgSrc = d => `decos/${d.id}.${d.ext || "webp"}`;

export const DECO_LIST_SVG = [["moon", "Luna"], ["thorns", "Corona di spine"], ["fire", "Fuoco"], ["blackcat", "Gatto nero"], ["fox", "Volpe"], ["angel", "Ali d'angelo"], ["demon", "Demone"], ["roses", "Rose"], ["autumn", "Autunno"], ["pearls", "Perle"], ["gold", "Oro e gemme"], ["cosmos", "Cosmo"], ["ice", "Ghiaccio"], ["holoheart", "Cuore olografico"], ["shark", "Squalo"], ["phones", "Cuffie"], ["skull", "Teschio"], ["ribbon", "Fiocco"], ["storm", "Tempesta"], ["sakura", "Sakura"]];
export const DECO_LIST = [...DECO_IMG.filter(d => d.ready).map(d => [d.id, d.name]), ...DECO_LIST_SVG];
export const DECO_GROUP_OF = { ...Object.fromEntries(DECO_IMG.map(d => [d.id, d.group])), moon: "magic", cosmos: "magic", ice: "magic", holoheart: "magic", storm: "magic", gold: "magic", pearls: "magic", blackcat: "animal", fox: "animal", shark: "animal", roses: "nature", autumn: "nature", sakura: "nature", fire: "nature", thorns: "dark", demon: "dark", skull: "dark", angel: "cute", ribbon: "cute", phones: "cute" };
export const DECO_GROUPS = [["all", "Tutte"], ...(DECO_IMG.some(d => d.ready) ? [["luxury", "Lusso"], ["gaming", "Gaming"]] : []), ["magic", "Luci e magia"], ["animal", "Animali"], ["nature", "Natura"], ["dark", "Dark"], ["cute", "Altro"]];
