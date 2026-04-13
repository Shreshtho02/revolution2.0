// ================================================================
//  CONFIG — CHANGE THESE VALUES BEFORE GOING LIVE
// ================================================================

// Supabase config is loaded from supabase-config.js into:
//   window.SUPABASE_URL
//   window.SUPABASE_ANON_KEY
// This file intentionally does not hardcode keys.
const SUPABASE_URL = (window.SUPABASE_URL || "").trim();
const SUPABASE_ANON_KEY = (window.SUPABASE_ANON_KEY || "").trim();

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!window.supabase || !window.supabase.createClient) return null;
  if (!window.__sb) window.__sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return window.__sb;
}

// CHANGE THIS: Event date for countdown (YYYY, Month-1, Day, Hour, Min, Sec)
// Month is 0-indexed: 6 = July
const EVENT_DATE = new Date(2026, 6, 21, 9, 0, 0);

// ================================================================
//  SEGMENT DATA
// ================================================================
const SEGS = {
  pen:   { name:"Ink & Fire",          desc:"Experience Writing",    prize:"৳3,000", badge:"online", type:"solo"  },
  pic:   { name:"Rebel's Lens",        desc:"Photography",           prize:"৳2,500", badge:"online", type:"solo"  },
  voice: { name:"Voice of Revolution", desc:"Speech / Extempore",    prize:"৳3,000", badge:"online", type:"solo"  },
  mic:   { name:"Bijoyer Shur",        desc:"Singing Competition",   prize:"৳3,500", badge:"online", type:"solo"  },
  poem:  { name:"Verses of Revolt",    desc:"Poetry Recitation",     prize:"৳2,500", badge:"online", type:"solo"  },
  dance: { name:"Step to Glory",       desc:"Dance Competition",     prize:"৳4,000", badge:"online", type:"group" },
  art:   { name:"Strokes of Rebellion",desc:"Visual Art",            prize:"৳3,000", badge:"online", type:"solo"  },
  quiz:  { name:"Knowledge Rebellion", desc:"Quiz — Offline",        prize:"৳5,000", badge:"offline",type:"group" },
};

// CHANGE THIS: Segment descriptions shown on the Segments page
// Edit the desc field for each segment
const SEG_DETAIL = {
  pen:   { short:"Pour your soul into words. Capture the untold stories of courage, sacrifice, and humanity's undying spirit of revolt.", rules:["Original, unpublished work only. Plagiarism = disqualification.","Word limit: 800–1500 words. Bengali or English.","Theme must reflect revolution, courage, or social change.","Submit via Google Form link. Deadline: July 10, 2026."] },
  pic:   { short:"A single frame can ignite a revolution. Capture rawness of emotion, struggle, and triumph through your lens.", rules:["Submit 1–3 original photos. JPEG/RAW. Min 3000px longest side.","No heavy digital manipulation. Natural filters allowed.","Caption required for each photo (max 50 words).","Email to contact@gsccc.com by July 12, 2026."] },
  voice: { short:"Your voice is your weapon. Speak with conviction and fire, commanding the room with unscripted truth.", rules:["Video: 3–5 minutes. Clear audio, well-lit environment.","Topic revealed 30 minutes before recording (via email).","No reading from scripts. Natural delivery only.","Single continuous take required."] },
  mic:   { short:"Let your voice be the anthem of an era. Perform with fire in your chest and revolution in your soul.", rules:["Video: 3–6 minutes. Acapella or with backing track.","Song must relate to patriotism, revolution, or social awakening.","Original compositions welcome. Cover songs must be credited.","External mic strongly recommended for audio quality."] },
  poem:  { short:"Words have toppled empires. Recite with passion, precision, and the kind of fire that makes history remember.", rules:["Video recitation of a poem (self-written or classic). 2–4 minutes.","Self-written poems awarded extra marks for creativity.","Bengali and English both accepted.","Background music allowed but must not overpower voice."] },
  dance: { short:"Movement is language. Dance the story of a generation that refused to bow — with rhythm, grace, and rebellion.", rules:["Video: 3–6 minutes. Any dance form (classical, folk, fusion, contemporary).","Solo or group (max 5 members). All must register separately.","Performance must carry a narrative or thematic message.","Props and costumes encouraged. No inappropriate content."] },
  art:   { short:"A brushstroke can say what words cannot. Create art that bleeds revolution and stirs conscience.", rules:["High-res scan/photo of original artwork (min 150 DPI).","Any medium: oil, watercolor, charcoal, digital, mixed media.","Work must be created within 2 months for this contest.","Artist statement (max 100 words) required with submission."] },
  quiz:  { short:"Knowledge is the sharpest weapon. Test your awareness of history, culture, science, and revolutionary ideas.", rules:["Offline event at Govt. Science College, Dhaka. Date TBA.","Teams of 2. Both members must register with same team name.","Prelims (MCQ written) → Finals (buzzer round).","Topics: BD history, science, current affairs, culture, sports."] },
};

const SEG_IMGS = { pen:IMG_PEN, pic:IMG_PIC, voice:IMG_VOICE, mic:IMG_MIC, poem:IMG_POEM, dance:IMG_DANCE, art:IMG_ART, quiz:IMG_QUIZ };

// ================================================================
//  TOUCH DETECTION — disable cursor on touch devices
// ================================================================
const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (!IS_TOUCH) {
  document.body.style.cursor = "none";
  document.querySelectorAll("a,button,.btn,.seg-card,.dot,.slider-btn").forEach(el => el.style.cursor = "none");
  document.getElementById("cursor").style.display      = "block";
  document.getElementById("cursor-ring").style.display = "block";
} else {
  document.getElementById("cursor").style.display      = "none";
  document.getElementById("cursor-ring").style.display = "none";
}

// ================================================================
//  CURSOR LOGIC (desktop only)
// ================================================================
if (!IS_TOUCH) {
  const cur  = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + "px"; cur.style.top = my + "px";
  });

  (function animRing() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx + "px"; ring.style.top  = ry + "px";
    requestAnimationFrame(animRing);
  })();

  function bindCursorTargets() {
    document.querySelectorAll("a,button,.btn,.seg-card,.seg-detail-card,.dot,.slider-btn,.stat-card,select").forEach(el => {
      el.addEventListener("mouseenter", () => { cur.classList.add("grow"); ring.classList.add("grow"); });
      el.addEventListener("mouseleave", () => { cur.classList.remove("grow"); ring.classList.remove("grow"); });
    });
  }

  document.addEventListener("mouseleave", () => { cur.style.opacity = "0"; ring.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { cur.style.opacity = "1"; ring.style.opacity = "1"; });
  bindCursorTargets();
  window._bindCursor = bindCursorTargets;
}

// ================================================================
//  PARTICLES
// ================================================================
(function() {
  const cv = document.getElementById("particles-canvas");
  const cx = cv.getContext("2d");
  let W, H, pts = [];
  function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  resize(); window.addEventListener("resize", resize);

  for (let i = 0; i < 70; i++) pts.push(mkPt());
  function mkPt() {
    return { x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.4+.3,
             sx: (Math.random()-.5)*.25, sy: -Math.random()*.45-.08,
             o: Math.random()*.45+.08, gold: Math.random() > .8 };
  }
  function frame() {
    cx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x += p.sx; p.y += p.sy;
      if (p.y < -4) { Object.assign(p, mkPt(), { y: H+4 }); }
      cx.globalAlpha = p.o;
      cx.fillStyle = p.gold ? "#C9A84C" : "#CC1B1B";
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI*2); cx.fill();
    });
    cx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  frame();
})();

// ================================================================
//  NAVBAR SCROLL
// ================================================================
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 36);
});

// ================================================================
//  HAMBURGER
// ================================================================
const hb  = document.getElementById("hamburger");
const mob = document.getElementById("mobile-menu");
hb.addEventListener("click", () => { hb.classList.toggle("open"); mob.classList.toggle("open"); });

// ================================================================
//  ASSET INJECTION (logo images)
// ================================================================
document.getElementById("nl-rev").src = IMG_REV;
document.getElementById("nl-20").src  = IMG_20;
document.getElementById("hs-rev").src = IMG_REV;
document.getElementById("hs-20").src  = IMG_20;
document.getElementById("hw-img").src = IMG_GSCCC;

// ================================================================
//  PAGE ROUTING  —  hash-based, control-panel is HIDDEN
// ================================================================
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = document.getElementById("page-" + name);
  if (!target) return;
  target.classList.add("active");
  target.classList.remove("page-enter");
  void target.offsetWidth;
  target.classList.add("page-enter");
  // nav link highlight (control-panel has no link, so nothing highlights)
  document.querySelectorAll(".nav-link").forEach(l => l.classList.toggle("active", l.dataset.page === name));
  // close mobile menu
  hb.classList.remove("open"); mob.classList.remove("open");
  // scroll to top
  window.scrollTo(0,0);
  // update hash silently
  history.replaceState(null, "", "#" + name);
  // page init
  if (name === "control-panel") initCP();
  if (name === "segments")      buildSegDetailGrid();
  if (name === "home")          buildHomeSegGrid();
  initReveal(); initCardReveal();
  if (window._bindCursor) window._bindCursor();
}

// Hash routing on load — including the hidden control-panel route
function routeFromHash() {
  const h = location.hash.replace("#","").toLowerCase();
  const valid = ["home","segments","register","success","control-panel"];
  showPage(valid.includes(h) ? h : "home");
}
routeFromHash();

// Click delegation for data-page links
document.addEventListener("click", e => {
  const el = e.target.closest("[data-page]");
  if (!el) return;
  e.preventDefault();
  const seg = el.dataset.segment;
  showPage(el.dataset.page);
  if (seg) {
    setTimeout(() => {
      const s = document.getElementById("f-seg");
      if (s) { s.value = seg; updateSegPreview(); }
    }, 80);
  }
});
document.querySelectorAll(".m-link").forEach(l => l.addEventListener("click", e => { e.preventDefault(); showPage(l.dataset.page); }));

// ================================================================
//  HERO SLIDER
// ================================================================
let si = 0, sTimer;
function goToSlide(n, dir) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots   = document.querySelectorAll(".dot");
  slides[si].classList.remove("active","go-right","go-left");
  si = ((n % slides.length) + slides.length) % slides.length;
  slides[si].classList.add("active", dir === "left" ? "go-left" : "go-right");
  dots.forEach((d,i) => d.classList.toggle("active", i === si));
  clearTimeout(sTimer); sTimer = setTimeout(() => goToSlide(si+1,"right"), 5200);
}
document.getElementById("prevBtn").onclick = () => goToSlide(si-1,"left");
document.getElementById("nextBtn").onclick = () => goToSlide(si+1,"right");
// Touch swipe
let txStart = 0;
document.querySelector(".slides-container").addEventListener("touchstart", e => txStart = e.touches[0].clientX, {passive:true});
document.querySelector(".slides-container").addEventListener("touchend", e => {
  const d = txStart - e.changedTouches[0].clientX;
  if (Math.abs(d) > 45) goToSlide(si + (d>0?1:-1), d>0?"right":"left");
}, {passive:true});
document.addEventListener("keydown", e => { if(e.key==="ArrowRight") goToSlide(si+1,"right"); if(e.key==="ArrowLeft") goToSlide(si-1,"left"); });
sTimer = setTimeout(() => goToSlide(1,"right"), 5200);

// ================================================================
//  COUNTDOWN
// ================================================================
function tick() {
  const diff = Math.max(0, EVENT_DATE - new Date());
  document.getElementById("cd-d").textContent = String(Math.floor(diff/86400000)).padStart(2,"0");
  document.getElementById("cd-h").textContent = String(Math.floor((diff%86400000)/3600000)).padStart(2,"0");
  document.getElementById("cd-m").textContent = String(Math.floor((diff%3600000)/60000)).padStart(2,"0");
  document.getElementById("cd-s").textContent = String(Math.floor((diff%60000)/1000)).padStart(2,"0");
}
tick(); setInterval(tick, 1000);

// ================================================================
//  SCROLL REVEAL
// ================================================================
function initReveal() {
  const obs = new IntersectionObserver(ee => ee.forEach(e => { if(e.isIntersecting){e.target.classList.add("revealed");obs.unobserve(e.target);} }), {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}
function initCardReveal() {
  const obs = new IntersectionObserver(ee => ee.forEach(e => { if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);} }), {threshold:.08});
  document.querySelectorAll(".seg-card,.seg-detail-card").forEach((el,i) => { el.style.animationDelay=(i*.07)+"s"; obs.observe(el); });
}
initReveal(); initCardReveal();

// ================================================================
//  BUILD SEGMENT GRIDS
// ================================================================
function buildHomeSegGrid() {
  const g = document.getElementById("home-seg-grid");
  if (!g || g.children.length > 0) return;
  g.innerHTML = Object.entries(SEGS).map(([k,v]) => `
    <div class="seg-card">
      <img src="${SEG_IMGS[k]}" alt="${v.name}" class="seg-icon">
      <h3>${v.name}</h3>
      <p>${SEG_DETAIL[k].short}</p>
      <a href="#" class="btn btn-sm btn-ghost" data-page="register" data-segment="${k}">Register →</a>
    </div>`).join("");
  initCardReveal();
  if (window._bindCursor) window._bindCursor();
}
buildHomeSegGrid();

function buildSegDetailGrid() {
  const g = document.getElementById("seg-detail-grid");
  if (!g || g.children.length > 0) return;
  g.innerHTML = Object.entries(SEGS).map(([k,v]) => `
    <div class="seg-detail-card">
      <div class="seg-card-header">
        <img src="${SEG_IMGS[k]}" alt="${v.name}">
        <div><h3>${v.name}</h3><span>${v.desc}</span></div>
      </div>
      <div class="seg-card-body">
        <p>${SEG_DETAIL[k].short}</p>
        <ul class="rules-list">${SEG_DETAIL[k].rules.map(r=>`<li>${r}</li>`).join("")}</ul>
        <div class="seg-meta">
          <span class="seg-badge ${v.badge}">${v.badge==="online"?"Online":"Offline"}</span>
          <span class="seg-badge ${v.type==="group"?"group":"solo"}">${v.type==="group"?"Group":"Individual"}</span>
          <span class="seg-badge prize">Prize: ${v.prize}</span>
        </div>
        <a href="#" class="btn btn-primary btn-sm" data-page="register" data-segment="${k}">Register →</a>
      </div>
    </div>`).join("");
  initCardReveal();
  if (window._bindCursor) window._bindCursor();
}

// ================================================================
//  SEGMENT PREVIEW ON FORM
// ================================================================
function updateSegPreview() {
  const val = document.getElementById("f-seg").value;
  const box = document.getElementById("seg-preview");
  if (!val) { box.style.display = "none"; return; }
  document.getElementById("sp-img").src   = SEG_IMGS[val];
  document.getElementById("sp-label").textContent = SEGS[val].desc;
  document.getElementById("sp-name").textContent  = SEGS[val].name + " — Prize: " + SEGS[val].prize;
  box.style.display = "flex";
}

// ================================================================
//  TOAST
// ================================================================
function showToast(msg, type="") {
  const t = document.getElementById("toast");
  t.textContent = msg; t.className = "toast show " + type;
  setTimeout(() => t.classList.remove("show"), 3800);
}

// ================================================================
//  FORM VALIDATION + SUBMISSION
// ================================================================
let regCounter = 1000;

function genRegId() {
  // Needs to be unique across refreshes + clients (table uses id as primary key).
  // Keep the existing "REV2026-" prefix for UI familiarity.
  const rand = Math.floor(Math.random() * 1e6).toString().padStart(6, "0");
  return `REV2026-${Date.now()}-${rand}`;
}

function validate(id, errId, fn, msg) {
  const v = document.getElementById(id).value.trim();
  const ok = fn(v);
  document.getElementById(id).classList.toggle("error", !ok);
  document.getElementById(errId).textContent = ok ? "" : msg;
  return ok;
}

async function submitForm() {
  const sb = getSupabase();
  if (!sb) {
    showToast("⚠️ Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.", "error");
    return;
  }

  let ok = true;
  ok &= validate("f-name",  "e-name",  v => v.length >= 2 && v.length <= 80, "Please enter your full name");
  ok &= validate("f-email", "e-email", v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 120, "Enter a valid email");
  ok &= validate("f-phone", "e-phone", v => v.replace(/\D/g,"").length >= 8 && v.length <= 30, "Enter a valid phone number");
  ok &= validate("f-inst",  "e-inst",  v => v.length >= 2 && v.length <= 120, "Enter your institution name");
  ok &= validate("f-seg",   "e-seg",   v => v !== "", "Please select a segment");
  ok &= validate("f-txn",   "e-txn",   v => v.length >= 4 && v.length <= 40, "Enter your bKash transaction ID");
  if (!ok) return;

  const segVal  = document.getElementById("f-seg").value;
  const regId   = genRegId();
  // IMPORTANT: Supabase/PostgREST column names must match the table schema exactly.
  // Our DB uses lowercase columns: classyear, segmentname.
  const payload = {
    id:        regId,
    name:      document.getElementById("f-name").value.trim(),
    email:     document.getElementById("f-email").value.trim(),
    phone:     document.getElementById("f-phone").value.trim(),
    dob:       (document.getElementById("f-dob").value || null),
    institution: document.getElementById("f-inst").value.trim(),
    classyear: (document.getElementById("f-class").value || null),
    district:  (document.getElementById("f-dist").value || null),
    segment:   segVal,
    segmentname: SEGS[segVal].name,
    team:      (document.getElementById("f-team").value.trim() || null),
    txn:       document.getElementById("f-txn").value.trim(),
    bkash:     (document.getElementById("f-bkash").value.trim() || null),
    note:      (document.getElementById("f-note").value.trim() || null),
    status:    "pending",
  };

  // Spinner on
  const btn = document.getElementById("submit-btn");
  btn.classList.add("submitting"); btn.disabled = true;

  try {
    const { error } = await sb.from("registrations").insert(payload);
    if (error) throw error;

    showToast("✅ Registration submitted!", "success");

    // Show success page
    document.getElementById("ss-seg").textContent   = payload.segmentname;
    document.getElementById("ss-email").textContent = payload.email;
    document.getElementById("ss-id").textContent    = regId;
    showPage("success");

    // Reset form
    ["f-name","f-email","f-phone","f-dob","f-inst","f-team","f-txn","f-bkash","f-note"].forEach(id => document.getElementById(id).value="");
    ["f-class","f-dist","f-seg"].forEach(id => document.getElementById(id).value="");
    document.getElementById("seg-preview").style.display = "none";
  } catch (err) {
    console.error("Supabase insert error:", err, { payload });
    if (err && (err.code === "42501" || err.status === 403)) {
      showToast("❌ Submissions are blocked (database RLS policy). Ask the admin to allow public INSERT.", "error");
    } else {
      showToast("❌ Submission failed. Please try again in a moment.", "error");
    }
  } finally {
    btn.classList.remove("submitting"); btn.disabled = false;
  }
}

// ================================================================
//  CONTROL PANEL
// ================================================================
let cpLoggedIn = false;
let cpRegs     = [];

// CHANGE THIS: Remove or change the cp-hint paragraph in the HTML above before going live

function cpLogin() {
  const sb = getSupabase();
  if (!sb) {
    showToast("⚠️ Supabase is not configured.", "error");
    return;
  }

  const email = document.getElementById("cp-user").value.trim();
  const password = document.getElementById("cp-pass").value;

  if (!email || !password) {
    const err = document.getElementById("cp-error");
    err.textContent = "Enter email and password.";
    err.style.display = "block";
    setTimeout(() => err.style.display = "none", 2800);
    return;
  }

  sb.auth.signInWithPassword({ email, password }).then(({ data, error }) => {
    if (error) {
      console.error("Supabase auth error:", error);
      const errEl = document.getElementById("cp-error");
      errEl.textContent = "Invalid credentials. Try again.";
      errEl.style.display = "block";
      setTimeout(() => errEl.style.display = "none", 2800);
      return;
    }

    cpLoggedIn = true;
    document.getElementById("cp-login-screen").style.display = "none";
    document.getElementById("cp-dashboard").style.display    = "block";
    loadRegistrations();
  });
}
document.getElementById("cp-pass").addEventListener("keydown", e => { if(e.key==="Enter") cpLogin(); });
document.getElementById("cp-user").addEventListener("keydown", e => { if(e.key==="Enter") document.getElementById("cp-pass").focus(); });

function cpLogout() {
  const sb = getSupabase();
  if (sb) sb.auth.signOut();
  cpLoggedIn = false;
  document.getElementById("cp-login-screen").style.display = "flex";
  document.getElementById("cp-dashboard").style.display    = "none";
  document.getElementById("cp-user").value = "";
  document.getElementById("cp-pass").value = "";
}

function initCP() {
  const sb = getSupabase();
  if (!sb) {
    document.getElementById("cp-login-screen").style.display = "flex";
    document.getElementById("cp-dashboard").style.display    = "none";
    return;
  }

  sb.auth.getSession().then(({ data }) => {
    cpLoggedIn = !!data.session;
    if (cpLoggedIn) {
      document.getElementById("cp-login-screen").style.display = "none";
      document.getElementById("cp-dashboard").style.display    = "block";
      loadRegistrations();
    } else {
      document.getElementById("cp-login-screen").style.display = "flex";
      document.getElementById("cp-dashboard").style.display    = "none";
    }
  });
}

async function loadRegistrations() {
  const ind = document.getElementById("api-indicator");
  const sb = getSupabase();
  if (!sb) {
    cpRegs = [];
    ind.innerHTML = '<span class="api-status local"><span class="api-status-dot"></span> Supabase not configured</span>';
    renderDashboard();
    return;
  }

  ind.innerHTML = '<span class="api-status local"><span class="api-status-dot"></span> Fetching…</span>';
  try {
    const { data, error } = await sb
      .from("registrations")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(5000);
    if (error) throw error;
    cpRegs = data || [];
    ind.innerHTML = '<span class="api-status connected"><span class="api-status-dot"></span> Supabase Connected</span>';
  } catch (e) {
    console.error("Supabase load error:", e);
    cpRegs = [];
    ind.innerHTML = '<span class="api-status local"><span class="api-status-dot"></span> Supabase error</span>';
    showToast("⚠️ Could not load registrations.", "error");
  }

  renderDashboard();
}

function renderDashboard() {
  renderStats(); renderDist(); filterTable();
  if (window._bindCursor) window._bindCursor();
}

function renderStats() {
  const today = new Date().toDateString();
  const stats = [
    { v: cpRegs.length,                                           l:"Total Registrations" },
    { v: cpRegs.filter(r=>r.status==="pending").length,           l:"Pending"   },
    { v: cpRegs.filter(r=>r.status==="approved").length,          l:"Approved"  },
    { v: cpRegs.filter(r=>r.status==="rejected").length,          l:"Rejected"  },
    { v: cpRegs.filter(r=>new Date(r.timestamp).toDateString()===today).length, l:"Today" },
  ];
  document.getElementById("stats-grid").innerHTML = stats.map(s =>
    `<div class="stat-card"><div class="stat-val">${s.v}</div><div class="stat-lbl">${s.l}</div></div>`
  ).join("");
}

function renderDist() {
  const cnt = {}; Object.keys(SEGS).forEach(k => cnt[k]=0);
  cpRegs.forEach(r => { if(cnt[r.segment]!==undefined) cnt[r.segment]++; });
  const max = Math.max(1, ...Object.values(cnt));
  document.getElementById("dist-bars").innerHTML = Object.entries(SEGS).map(([k,v]) =>
    `<div class="dist-row">
      <div class="dist-label">${v.name}</div>
      <div class="dist-track"><div class="dist-fill" style="width:${(cnt[k]/max*100).toFixed(0)}%"></div></div>
      <div class="dist-count">${cnt[k]}</div>
    </div>`
  ).join("");
}

function filterTable() {
  const q   = (document.getElementById("cp-search").value||"").toLowerCase();
  const seg = document.getElementById("f-segment").value;
  const sts = document.getElementById("f-status").value;
  const rows = cpRegs.filter(r =>
    (!q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || (r.institution||"").toLowerCase().includes(q)) &&
    (!seg || r.segment === seg) &&
    (!sts || r.status  === sts)
  );
  const tbody = document.getElementById("cp-tbody");
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><i class="fas fa-inbox"></i><p>No registrations match filters</p></div></td></tr>`;
    document.getElementById("table-count").textContent = "";
    return;
  }
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td style="font-family:var(--font-m);font-size:.78rem;color:var(--gold)">${r.id}</td>
      <td style="color:var(--text);font-weight:600">${r.name}</td>
      <td>${r.email}</td>
      <td>${r.phone}</td>
      <td>${r.institution||""}</td>
      <td style="color:var(--accent-light)">${r.segmentname}</td>
      <td style="font-family:var(--font-m);font-size:.78rem">${r.txn}</td>
      <td style="font-size:.8rem">${new Date(r.timestamp).toLocaleDateString("en-BD",{day:"2-digit",month:"short",year:"2-digit"})}</td>
      <td><span class="status-badge ${r.status}">${r.status}</span></td>
      <td>
        <div class="act-btns">
          <button class="act-btn ok"  onclick="setStatus('${r.id}','approved')">✓</button>
          <button class="act-btn no"  onclick="setStatus('${r.id}','rejected')">✕</button>
          <button class="act-btn del" onclick="delReg('${r.id}')">🗑</button>
        </div>
      </td>
    </tr>`).join("");
  document.getElementById("table-count").textContent = `Showing ${rows.length} of ${cpRegs.length} registrations`;
}

async function setStatus(id, status) {
  const sb = getSupabase();
  if (!sb) { showToast("Supabase not configured.", "error"); return; }

  const r = cpRegs.find(r=>r.id===id);
  if (!r) return;

  const prev = r.status;
  r.status = status;
  renderDashboard();

  const { error } = await sb.from("registrations").update({ status }).eq("id", id);
  if (error) {
    console.error("Supabase update error:", error);
    r.status = prev;
    renderDashboard();
    showToast("❌ Could not update status.", "error");
  } else {
    showToast("✅ Status updated.", "success");
  }
}

async function delReg(id) {
  if (!confirm("Delete " + id + "?")) return;
  const sb = getSupabase();
  if (!sb) { showToast("Supabase not configured.", "error"); return; }

  const before = cpRegs.length;
  cpRegs = cpRegs.filter(r=>r.id!==id);
  renderDashboard();

  const { error } = await sb.from("registrations").delete().eq("id", id);
  if (error) {
    console.error("Supabase delete error:", error);
    showToast("❌ Could not delete.", "error");
    await loadRegistrations();
  } else if (before !== cpRegs.length) {
    showToast("🗑 Deleted.", "success");
  }
}

async function clearAll() {
  if (!confirm("Clear ALL registrations? This cannot be undone.")) return;
  if (!confirm("This will delete ALL rows from Supabase. Confirm again.")) return;

  const sb = getSupabase();
  if (!sb) { showToast("Supabase not configured.", "error"); return; }

  const { error } = await sb.from("registrations").delete().neq("id", "__never__");
  if (error) {
    console.error("Supabase clearAll error:", error);
    showToast("❌ Could not clear all.", "error");
    return;
  }

  cpRegs = [];
  renderDashboard();
  showToast("✅ All cleared.", "success");
}

function exportCSV() {
  if (!cpRegs.length) { showToast("No registrations to export."); return; }
  const hdrs = ["ID","Name","Email","Phone","Institution","Class","District","Segment","Team","TxnID","bKash","Note","Date","Status"];
  const rows = cpRegs.map(r => [
    r.id,
    r.name,
    r.email,
    r.phone,
    r.institution || "",
    r.classyear || "",
    r.district || "",
    r.segmentname,
    r.team || "",
    r.txn,
    r.bkash || "",
    r.note || "",
    new Date(r.timestamp).toLocaleString(),
    r.status
  ].map(v=>`"${String(v||"").replace(/"/g,'""')}"`).join(","));
  const csv  = [hdrs.join(","),...rows].join("\n");
  const url  = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
  const a    = document.createElement("a");
  a.href = url; a.download = "Revolution2_Registrations_" + new Date().toISOString().slice(0,10) + ".csv";
  a.click(); URL.revokeObjectURL(url);
  showToast("✅ CSV exported!", "success");
}

function addSamples() {
  const samples = [
    {name:"Rafiqul Islam",  email:"rafiq@example.com", phone:"01711111111", institution:"Dhaka College",      classyear:"Class 12 / HSC 2nd Year", district:"Dhaka",      segment:"pen",  txn:"8K7H2J4M9N"},
    {name:"Nusrat Jahan",   email:"nusrat@example.com",phone:"01722222222", institution:"Chittagong HS",     classyear:"Class 11 / HSC 1st Year", district:"Chittagong", segment:"dance",txn:"3P2Q8W1R5V"},
    {name:"Tanvir Ahmed",   email:"tanvir@example.com",phone:"01733333333", institution:"Rajshahi College",  classyear:"Undergraduate Year 2",     district:"Rajshahi",   segment:"quiz", txn:"6M9N4K2J7H"},
    {name:"Shayla Akter",   email:"shayla@example.com",phone:"01744444444", institution:"BUET",              classyear:"Undergraduate Year 1",     district:"Dhaka",      segment:"mic",  txn:"1A5B3C7D9E"},
    {name:"Mehedi Hasan",   email:"mehedi@example.com",phone:"01755555555", institution:"Notre Dame",        classyear:"Class 11 / HSC 1st Year", district:"Dhaka",      segment:"voice",txn:"2F4G6H8I0J"},
    {name:"Fatema Khatun",  email:"fatema@example.com",phone:"01766666666", institution:"Khulna Collegiate", classyear:"Class 12 / HSC 2nd Year", district:"Khulna",     segment:"art",  txn:"3K5L7M9N1P"},
    {name:"Saurav Dey",     email:"saurav@example.com",phone:"01777777777", institution:"Sylhet MC College", classyear:"Class 10 (SSC)",          district:"Sylhet",     segment:"pic",  txn:"4Q6R8S0T2U"},
    {name:"Israt Tasnim",   email:"israt@example.com", phone:"01788888888", institution:"Viqarunnisa Noon",  classyear:"Class 11 / HSC 1st Year", district:"Dhaka",      segment:"poem", txn:"5V7W9X1Y3Z"},
  ];
  const statuses = ["pending","pending","approved","rejected","pending","approved","pending","approved"];
  samples.forEach((s,i) => {
    cpRegs.push({
      id: "REV2026-"+(++regCounter),
      ...s, segmentname: SEGS[s.segment].name, team:"", bkash:"", note:"",
      timestamp: new Date(Date.now()-Math.random()*86400000*7).toISOString(),
      status: statuses[i],
    });
  });
  renderDashboard();
  showToast("✅ 8 sample registrations added", "success");
}

// ================================================================
