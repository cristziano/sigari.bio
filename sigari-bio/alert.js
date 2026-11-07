// One alert for the whole site, always at the top of the screen (never under the form):
//   topAlert("testo", "err")  red, stays 10 s or until closed
//   topAlert("testo", "warn") amber, 8 s
//   topAlert("testo", "ok")   neutral, 3.5 s
(function () {
  const css = `
  .top-alert{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top));transform:translate(-50%,-140%);z-index:2147483600;width:min(560px,calc(100vw - 24px));display:flex;align-items:flex-start;gap:12px;padding:14px 14px 14px 16px;border-radius:14px;font:500 14.5px/1.45 "Geist",system-ui,-apple-system,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.55);transition:transform .28s cubic-bezier(.2,.9,.3,1.2),opacity .2s;opacity:0}
  .top-alert.on{transform:translate(-50%,0);opacity:1}
  .top-alert.err{background:#2a0b0b;border:1.5px solid #ff4d4d;color:#ffdede}
  .top-alert.warn{background:#2a1f08;border:1.5px solid #ffb020;color:#ffefcf}
  .top-alert.ok{background:#111;border:1px solid #3a3a3a;color:#f2f2f2}
  .top-alert .ta-i{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:13px}
  .top-alert.err .ta-i{background:#ff4d4d;color:#2a0b0b}.top-alert.warn .ta-i{background:#ffb020;color:#2a1f08}.top-alert.ok .ta-i{background:#fff;color:#000}
  .top-alert .ta-m{flex:1;min-width:0;padding-top:1px}
  .top-alert .ta-x{flex:none;border:0;background:none;color:inherit;opacity:.7;font-size:20px;line-height:1;cursor:pointer;padding:0 4px;min-width:32px;min-height:32px}
  .top-alert .ta-x:hover{opacity:1}
  @media (prefers-reduced-motion:reduce){.top-alert{transition:none}}`;
  let box, timer;
  function topAlert(msg, type) {
    if (!msg) { if (box) box.classList.remove("on"); return; }
    type = type === "err" || type === "warn" || type === "ok" ? type : "ok";
    if (!box) {
      const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
      box = document.createElement("div");
      box.innerHTML = '<span class="ta-i" aria-hidden="true"></span><span class="ta-m"></span><button type="button" class="ta-x" aria-label="Chiudi">×</button>';
      box.querySelector(".ta-x").addEventListener("click", () => box.classList.remove("on"));
      document.body.appendChild(box);
    }
    box.className = "top-alert " + type;
    box.setAttribute("role", type === "ok" ? "status" : "alert");
    box.querySelector(".ta-i").textContent = type === "ok" ? "✓" : "!";
    box.querySelector(".ta-m").textContent = msg;
    requestAnimationFrame(() => box.classList.add("on"));
    clearTimeout(timer);
    timer = setTimeout(() => box.classList.remove("on"), type === "err" ? 10000 : type === "warn" ? 8000 : 3500);
  }
  window.topAlert = topAlert;
})();
