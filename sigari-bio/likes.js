// Likes on public profiles: one per account. The like is a document at
// profiles/{handle}/likes/{uid}, and the profile keeps a "likes" counter that the
// rules only let move by one together with that document (same batch).
const AUTH = "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
let userP = null;

export function currentUser(app) {
  return userP || (userP = import(AUTH).then(A => new Promise(res => {
    const off = A.onAuthStateChanged(A.getAuth(app), u => { off(); res(u); });
  })).catch(() => null));
}

export async function hasLiked(F, db, app, handle) {
  const u = await currentUser(app);
  if (!u) return false;
  try { return (await F.getDoc(F.doc(db, "profiles", handle, "likes", u.uid))).exists(); }
  catch (_) { return false; }
}

// Throws { login: true } when nobody is signed in
export async function setLike(F, db, app, handle, on) {
  const u = await currentUser(app);
  if (!u) throw { login: true };
  const b = F.writeBatch(db);
  const like = F.doc(db, "profiles", handle, "likes", u.uid);
  if (on) b.set(like, { createdAt: F.serverTimestamp() }); else b.delete(like);
  b.update(F.doc(db, "profiles", handle), { likes: F.increment(on ? 1 : -1) });
  await b.commit();
}

export const loginUrl = () => "/login.html?mode=login&next=" + encodeURIComponent(location.pathname + location.search);

export const HEART = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.6 3.6 4.5 7 4.5c2 0 3.8 1.1 5 2.8 1.2-1.7 3-2.8 5-2.8 3.4 0 5.6 3.1 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" fill="currentColor"/></svg>';
