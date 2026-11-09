// The "profile" preview the bot posts with /posta: the banner on top and the pfp in a circle over it,
// like a Discord profile (the look of the pfp bots). Animated GIFs use their first frame here;
// the original files are posted too, untouched.
const sharp = require("sharp");

const W = 640, BH = 230, H = 330, AV = 156, RING = 10;
const circle = d => Buffer.from(`<svg width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}" fill="#fff"/></svg>`);

async function preview(pfp, banner) {
  const top = banner
    ? await sharp(banner, { animated: false }).resize(W, BH, { fit: "cover" }).png().toBuffer()
    // no banner: the pfp itself, blurred and darker
    : await sharp(pfp, { animated: false }).resize(W, BH, { fit: "cover" }).blur(22).modulate({ brightness: 0.7, saturation: 1.2 }).png().toBuffer();
  const av = await sharp(pfp, { animated: false }).resize(AV, AV, { fit: "cover" }).composite([{ input: circle(AV), blend: "dest-in" }]).png().toBuffer();
  const ring = await sharp({ create: { width: AV + RING * 2, height: AV + RING * 2, channels: 4, background: "#111214" } })
    .composite([{ input: circle(AV + RING * 2), blend: "dest-in" }]).png().toBuffer();
  const y = BH - Math.round(AV * 0.55);
  return sharp({ create: { width: W, height: H, channels: 4, background: "#111214" } })
    .composite([
      { input: top, top: 0, left: 0 },
      { input: ring, top: y - RING, left: 26 - RING },
      { input: av, top: y, left: 26 }
    ])
    .png().toBuffer();
}

module.exports = { preview };
