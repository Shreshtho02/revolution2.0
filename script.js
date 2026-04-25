// ================================================================
//  SECURITY CONFIGURATION
// ================================================================




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
const EVENT_DATE = new Date(2026, 6, 1, 0, 0, 0);

// ================================================================
//  SEGMENT DATA
// ================================================================
const SEGS = {
  pen:   { name:"Ink & Fire",               desc:"Experience Writing",              badge:"online",  type:"solo"  },
  pic:   { name:"Rebel’s Lens",             desc:"Photography",                     badge:"online",  type:"solo"  },
  voice: { name:"Voice of Revolution",      desc:"Speech / Extempore",              badge:"online",  type:"solo"  },
  mic:   { name:"Bijoyer Shur (Singing)",   desc:"Category A / Category B",         badge:"online",  type:"solo"  },
  poem:  { name:"Verses of Revolt",         desc:"Poetry Recitation",               badge:"online",  type:"solo"  },
  dance: { name:"Step to Glory",            desc:"Dance",                           badge:"online",  type:"solo" },
  art:   { name:"Strokes of Rebellion",     desc:"Art",                             badge:"online",  type:"solo"  },
  quiz:  { name:"The Knowledge Rebellion",  desc:"Quiz – Offline", badge:"offline", type:"solo" },
};

// CHANGE THIS: Segment descriptions shown on the Segments page
// Edit the desc field for each segment
const SEG_DETAIL = {
  pen:   { short:"“Where the pen meets the heartbeat of struggle – <span class=\"bn\">লিখিত শব্দে জীবিত হয় সাহস ও সংগ্রামের গল্প।</span>”<br>Capture stories that echo bravery, sacrifice, and the untold journeys of heroes.", rules:["All submissions will be online.","Any AI-generated / AI-assisted or third-party assisted work will not be accepted.","Use the submission format & hashtags provided in the event description.","Segment Fee: 50 BDT (per segment)."] },
  pic:   { short:"“Through the eyes of today, moments of courage are immortalized – <span class=\"bn\">আজকের চোখে, সংগ্রামের মুহূর্তগুলো চিরস্থায়ী হয়ে ওঠে।</span>”<br>Show the revolution through powerful frames that reflect courage, equality, and expression.", rules:["All submissions will be online.","Photos must be submitted via form first, then posted in the official Facebook group.","Any AI-generated / AI-assisted or third-party assisted work will not be accepted.","Use the submission format & hashtags provided in the event description."] },
  voice: { short:"“Unshackled voices, bearing the fire of change – <span class=\"bn\">মুক্ত কণ্ঠে, যাদের ভাষা প্রেরণা প্রজ্বলন করে।</span>”<br>Speak spontaneously, ignite minds, and let your voice become a beacon of courage.", rules:["All submissions will be online.","Any AI-generated / AI-assisted or third-party assisted work will not be accepted.","Use the submission format & hashtags provided in the event description.","Segment Fee: 50 BDT (per segment)."] },
  mic:   { short:"“Songs that weave the melody of hope – <span class=\"bn\">প্রত্যয়ের সুরে বোনা গান যা হৃদয় স্পর্শ করে।</span>”<br>Perform classics, original pieces, or patriotic songs that celebrate triumph, bravery, and inspiration.", rules:["Category A: Class 8–10.","Category B: Class 11–12 & HSC Batch 26.","All submissions will be online.","Any AI-generated / AI-assisted or third-party assisted work will not be accepted."] },
  poem:  { short:"“Silent verses that speak louder than words – <span class=\"bn\">নিস্তব্ধ কবিতা, যা অন্তরের গভীরে আলো জ্বালায়।</span>”<br>Recite poems that reflect struggle, resilience, and the light of hope.", rules:["All submissions will be online.","Any AI-generated / AI-assisted or third-party assisted work will not be accepted.","Use the submission format & hashtags provided in the event description.","Segment Fee: 50 BDT (per segment)."] },
  dance: { short:"“Every step tells a story of freedom – <span class=\"bn\">নৃত্যের প্রতিটি পদক্ষেপে স্বাধীনতার গল্প।</span>”<br>Move with rhythm, creativity, and energy that celebrates courage.", rules:["All submissions will be online.","Any AI-generated / AI-assisted or third-party assisted work will not be accepted.","Use the submission format & hashtags provided in the event description.","Segment Fee: 50 BDT (per segment)."] },
  art:   { short:"“Where imagination confronts reality – <span class=\"bn\">কল্পনার রঙে, সংগ্রামের চিত্র ফুটিয়ে তোলা।</span>”<br>Create artworks that reflect thought, struggle, and the power of expression.", rules:["All submissions will be online.","Any AI-generated / AI-assisted or third-party assisted work will not be accepted.","Use the submission format & hashtags provided in the event description.","Segment Fee: 50 BDT (per segment)."] },
  quiz:  { short:"“Knowledge is courage, every answer a declaration – <span class=\"bn\">জ্ঞানই সাহস, প্রতিটি উত্তর হলো প্রেরণা।</span>”<br>Test your awareness and understanding of culture, history, and revolutionary ideas.", rules:["Quiz is Offline.","Segment Fee: 50 BDT (per segment)."] },
};

const SEG_IMGS = { pen:IMG_PEN, pic:IMG_PIC, voice:IMG_VOICE, mic:IMG_MIC, poem:IMG_POEM, dance:IMG_DANCE, art:IMG_ART, quiz:IMG_QUIZ };

// ================================================================
//  TOUCH DETECTION — disable cursor on touch devices
// ================================================================
const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (!IS_TOUCH) {
  document.body.classList.add("no-touch");
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
  const hint = document.getElementById("cursor-nav-hint");
  let mx = 0, my = 0, rx = 0, ry = 0;
  let heroZone = null; // 'prev' | 'next' | null

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left  = mx + "px"; cur.style.top  = my + "px";
    // hint tracks cursor instantly (no lag)
    hint.style.left = mx + "px"; hint.style.top  = my + "px";

    // ── Hero zone detection ──────────────────────────────────────
    const homePage = document.getElementById("page-home");
    const heroEl   = (homePage && homePage.classList.contains("active"))
                     ? homePage.querySelector(".hero") : null;
    if (heroEl) {
      const r = heroEl.getBoundingClientRect();
      const inHero = r.bottom > 0 && r.top < window.innerHeight
                  && mx >= r.left && mx <= r.right
                  && my >= Math.max(r.top, 0)
                  && my <= Math.min(r.bottom, window.innerHeight);
    if (inHero) {
        const pct = (mx - r.left) / r.width;
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        // Don't show hint in navbar area or bottom-right club button area
        const overNav = my < navH + 10;
        const overClub = mx > window.innerWidth - 90 && my > window.innerHeight - 90;
        if (!overNav && !overClub) {
          heroZone = pct < 0.28 ? "prev" : pct > 0.72 ? "next" : null;
        } else {
          heroZone = null;
        }
      } else {
        heroZone = null;
      }
    } else {
      heroZone = null;
    }

    // ── Apply states ─────────────────────────────────────────────
    if (heroZone === "prev") {
      cur.classList.add("hero-zone");
      ring.classList.add("hero-zone");
      hint.className = "show show-prev";
    } else if (heroZone === "next") {
      cur.classList.add("hero-zone");
      ring.classList.add("hero-zone");
      hint.className = "show show-next";
    } else {
      cur.classList.remove("hero-zone");
      ring.classList.remove("hero-zone");
      hint.className = "";
    }
  });

  // Smooth-lagged ring follow
  (function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    requestAnimationFrame(animRing);
  })();

  // Hero navigation on click — skip if clicking an interactive child
  document.addEventListener("mousedown", e => {
    if (e.target.closest("a,button,.btn,.dot")) return;
    if (heroZone === "prev")       goToSlide(si - 1, "left");
    else if (heroZone === "next")  goToSlide(si + 1, "right");
  });

  function bindCursorTargets() {
    document.querySelectorAll("a,button,.btn,.seg-card,.seg-detail-card,.dot,.stat-card,select,.club-logo-btn,.hamburger,.m-link,.nav-links a,.social-icon,.seg-checkbox-item,.query-card,.contact-card").forEach(el => {
      if (el._cursorBound) return;
      el._cursorBound = true;
      el.addEventListener("mouseenter", () => {
        if (!heroZone) { cur.classList.add("grow"); ring.classList.add("grow"); }
      });
      el.addEventListener("mouseleave", () => {
        cur.classList.remove("grow"); ring.classList.remove("grow");
      });
    });
  }

  document.addEventListener("mouseleave", () => { cur.style.opacity="0"; ring.style.opacity="0"; hint.className=""; });
  document.addEventListener("mouseenter", () => { cur.style.opacity="1"; ring.style.opacity="1"; });
  bindCursorTargets();
  window._bindCursor = bindCursorTargets;
}

// ================================================================
//  BACKGROUND — Floating particles only
// ================================================================
(function() {
  const cv = document.getElementById("particles-canvas");
  const cx = cv.getContext("2d");
  let W, H;

  function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  // ── Floating particles ───────────────────────────────────────
  function mkPt() {
    const k = Math.random();
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      sx: (Math.random() - 0.5) * 0.2,
      sy: -Math.random() * 0.4 - 0.06,
      o:  Math.random() * 0.45 + 0.1,
      gold: Math.random() > 0.72,
      kind: k < 0.6 ? 0 : k < 0.85 ? 1 : 2
    };
  }
  const pts = Array.from({ length: 150 }, mkPt);

  function drawPt(p) {
    const col = p.gold ? "#C9A84C" : "#CC1B1B";
    cx.globalAlpha = p.o;
    cx.fillStyle = cx.strokeStyle = col;
    if (p.kind === 0) {
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2); cx.fill();
    } else if (p.kind === 1) {
      const s = p.r * 2.4; cx.lineWidth = 0.8;
      cx.beginPath(); cx.moveTo(p.x-s,p.y); cx.lineTo(p.x+s,p.y); cx.stroke();
      cx.beginPath(); cx.moveTo(p.x,p.y-s); cx.lineTo(p.x,p.y+s); cx.stroke();
    } else {
      const s = p.r * 1.9;
      cx.beginPath();
      cx.moveTo(p.x,p.y-s); cx.lineTo(p.x+s,p.y);
      cx.lineTo(p.x,p.y+s); cx.lineTo(p.x-s,p.y);
      cx.closePath(); cx.fill();
    }
  }

  // ── Render loop ───────────────────────────────────────────────
  function frame() {
    cx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.sx; p.y += p.sy;
      if (p.y < -8) Object.assign(p, mkPt(), { y: H + 8 });
      drawPt(p);
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
// Club logo button
document.getElementById("club-logo-img").src    = IMG_GSCCC;
document.getElementById("club-popover-logo").src = IMG_GSCCC;

// ================================================================
//  CLUB LOGO BUTTON — toggle about popover
// ================================================================
(function() {
  const btn     = document.getElementById("club-logo-btn");
  const popover = document.getElementById("club-popover");
  const closeBtn= document.getElementById("club-popover-close");

  function openPop()  { popover.classList.add("open");  btn.setAttribute("aria-expanded","true"); }
  function closePop() { popover.classList.remove("open"); btn.setAttribute("aria-expanded","false"); }
  function togglePop(){ popover.classList.contains("open") ? closePop() : openPop(); }

  btn.addEventListener("click", e => { e.stopPropagation(); togglePop(); });
  closeBtn.addEventListener("click", e => { e.stopPropagation(); closePop(); });

  // Close when clicking outside
  document.addEventListener("click", e => {
    if (!popover.contains(e.target) && e.target !== btn) closePop();
  });
  // Close on Escape
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePop(); });
})();

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
  // push history state so browser/phone back works
  if (location.hash.replace("#","") !== name) {
    history.pushState({ page: name }, "", "#" + name);
  }
  // page init
  if (name === "control-panel") initCP();
  if (name === "segments")      buildSegDetailGrid();
  if (name === "home")          buildHomeSegGrid();
  initReveal(); initCardReveal();
  if (window._bindCursor) window._bindCursor();
}

// Handle browser/phone back & forward buttons
window.addEventListener("popstate", e => {
  const page = (e.state && e.state.page) || location.hash.replace("#","") || "home";
  const valid = ["home","segments","register","contact","success","control-panel","how-to-register"];
  // Show the page without pushing another history entry
  const name = valid.includes(page) ? page : "home";
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = document.getElementById("page-" + name);
  if (!target) return;
  target.classList.add("active");
  target.classList.remove("page-enter");
  void target.offsetWidth;
  target.classList.add("page-enter");
  document.querySelectorAll(".nav-link").forEach(l => l.classList.toggle("active", l.dataset.page === name));
  hb.classList.remove("open"); mob.classList.remove("open");
  window.scrollTo(0,0);
  if (name === "control-panel") initCP();
  if (name === "segments")      buildSegDetailGrid();
  if (name === "home")          buildHomeSegGrid();
  initReveal(); initCardReveal();
  if (window._bindCursor) window._bindCursor();
});

// Hash routing on load — including the hidden control-panel route
function routeFromHash() {
  const h = location.hash.replace("#","").toLowerCase();
  const valid = ["home","segments","register","contact","success","control-panel","how-to-register"];
  const page = valid.includes(h) ? h : "home";
  // Seed the initial history state so popstate can recover it
  history.replaceState({ page: page }, "", "#" + page);
  showPage(page);
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
      // Multi-segment: check the corresponding checkbox for the pre-selected segment
      const cb = document.querySelector(`#seg-checkbox-grid input[value="${seg}"]`);
      if (cb) { cb.checked = true; updateSegmentUI(); }
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
document.getElementById("prevBtn") && (document.getElementById("prevBtn").onclick = () => goToSlide(si-1,"left"));
document.getElementById("nextBtn") && (document.getElementById("nextBtn").onclick = () => goToSlide(si+1,"right"));
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
        </div>
        <a href="#" class="btn btn-primary btn-sm" data-page="register" data-segment="${k}">Register →</a>
      </div>
    </div>`).join("");
  initCardReveal();
  if (window._bindCursor) window._bindCursor();
}

// ================================================================
//  MULTI-SEGMENT SELECTION
// ================================================================
function getSelectedSegments() {
  const checks = document.querySelectorAll("#seg-checkbox-grid input[type=checkbox]:checked");
  return Array.from(checks).map(c => c.value);
}

// Maps class/year values → singing category
function getAutoMicCategory(classVal) {
  if (!classVal) return null;
  const catA = ["Class 8", "Class 9", "Class 10", "SSC Batch 26"];
  const catB = ["HSC Batch 27", "HSC Batch 26"];
  if (catA.includes(classVal)) return "A";
  if (catB.includes(classVal)) return "B";
  return null;
}

function updateSegmentUI() {
  const selected = getSelectedSegments();
  const count = selected.length;
  const hasMic = selected.includes("mic");

  // ── Singing category auto-detection ──────────────────────────
  const micWrap = document.getElementById("cat-mic-wrap");
  if (micWrap) {
    if (hasMic) {
      const classVal = document.getElementById("f-class").value;
      const autocat  = getAutoMicCategory(classVal);
      const micHidden = document.getElementById("f-cat-mic");

      // Update the displayed chip text
      const chipEl   = document.getElementById("mic-cat-chip");
      const warnEl   = document.getElementById("mic-cat-warn");
      if (autocat) {
        if (micHidden) micHidden.value = autocat;
        if (chipEl) {
          chipEl.style.display = "flex";
          chipEl.querySelector(".mic-cat-letter").textContent = autocat;
          chipEl.querySelector(".mic-cat-label").textContent  =
            autocat === "A" ? "Category A — Class 8 to 10" : "Category B — Class 11 to 12 / HSC Batch 26";
        }
        if (warnEl) warnEl.style.display = "none";
      } else {
        if (micHidden) micHidden.value = "";
        if (chipEl)  chipEl.style.display  = "none";
        if (warnEl)  warnEl.style.display  = "flex";
      }
      micWrap.style.display = "block";
    } else {
      micWrap.style.display = "none";
      const micHidden = document.getElementById("f-cat-mic");
      if (micHidden) micHidden.value = "";
    }
  }

  // Total amount
  const totalWrap = document.getElementById("total-amount-wrap");
  const totalVal  = document.getElementById("total-amount-value");
  if (totalWrap) totalWrap.style.display = count > 0 ? "block" : "none";
  if (totalVal)  totalVal.textContent = "৳" + (count * 50);

  // Highlight selected cards
  document.querySelectorAll(".seg-checkbox-item").forEach(el => {
    const cb = el.querySelector("input");
    el.classList.toggle("selected", cb.checked);
  });

  // Clear segment error
  const errEl = document.getElementById("e-seg");
  if (errEl && count > 0) errEl.textContent = "";

  const qn = document.getElementById("quiz-offline-notice");
  if (qn) qn.classList.toggle("visible", selected.includes("quiz"));
}

// Legacy stub — kept so any old references don't crash
function updateSegPreview() { updateSegmentUI(); }

// Bind checkbox change events once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#seg-checkbox-grid input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", updateSegmentUI);
  });
  // Re-evaluate mic category whenever class changes
  const classEl = document.getElementById("f-class");
  if (classEl) classEl.addEventListener("change", updateSegmentUI);
});
// Also bind immediately for cases where DOM is already ready
(function bindSegCheckboxes() {
  const grid = document.getElementById("seg-checkbox-grid");
  if (!grid) return;
  grid.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", updateSegmentUI);
  });
  // Re-evaluate mic category whenever class changes
  const classEl = document.getElementById("f-class");
  if (classEl) classEl.addEventListener("change", updateSegmentUI);
})();

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

function validateFile(id, errId, fn, msg) {
  const el = document.getElementById(id);
  const file = el && el.files ? el.files[0] : null;
  const ok = fn(file);
  if (el) el.classList.toggle("error", !ok);
  document.getElementById(errId).textContent = ok ? "" : msg;
  return ok;
}

function triggerFilePicker(id) {
  const el = document.getElementById(id);
  if (el) el.click();
}

function clearFilePicker(inputId, nameId) {
  const el = document.getElementById(inputId);
  if (el) el.value = "";
  const nm = document.getElementById(nameId);
  if (nm) nm.textContent = "No file selected";
  // Clear error state on the correct wrapper
  const wrapMap = { "f-ss": "ss-wrap", "f-photo": "photo-wrap" };
  const wrapId = wrapMap[inputId];
  if (wrapId) {
    const wrap = document.getElementById(wrapId);
    if (wrap) wrap.classList.remove("error");
  }
}

function bindFileName(inputId, nameId, wrapId) {
  const el = document.getElementById(inputId);
  const nm = document.getElementById(nameId);
  const wrap = document.getElementById(wrapId);
  if (!el || !nm) return;
  el.addEventListener("change", () => {
    const f = el.files && el.files[0];
    nm.textContent = f ? f.name : "No file selected";
    if (wrap) wrap.classList.toggle("error", !f);
  });
}

async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(String(text));
    } else {
      const ta = document.createElement("textarea");
      ta.value = String(text);
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    showToast("✅ Copied!", "success");
  } catch (e) {
    console.error("Copy failed:", e);
    showToast("❌ Could not copy.", "error");
  }
}

function copyRegId() {
  const el = document.getElementById("ss-id");
  if (!el) return;
  copyText(el.textContent.trim());
}

function openInvoice() {
  if (!window.currentRegistration) {
    showToast("⚠️ Registration data not found.", "error");
    return;
  }
  try {
    // Always encode data into URL params — this survives cross-browser opens
    // (Messenger in-app browser → Chrome, etc.) where localStorage is isolated.
    // localStorage is also set as a fallback for browsers that truncate long URLs.
    const d = window.currentRegistration;
    const params = new URLSearchParams({
      id:          d.id          || "",
      name:        d.name        || "",
      email:       d.email       || "",
      phone:       d.phone       || "",
      institution: d.institution || "",
      classyear:   d.classyear   || "",
      segmentname: d.segmentname || "",
      category:    d.category    || "",
      bkash:       d.bkash       || "",
      txn:         d.txn         || "",
      timestamp:   d.timestamp   || "",
      ca_ref:      d.ca_ref      || "",
      _totalAmount: String(d._totalAmount || ""),
      _segments:    (d._segments || []).join(","),
    });
    try {
      localStorage.setItem("currentRegistration", JSON.stringify(d));
    } catch(_) { /* quota exceeded in sandboxed browser — URL params are the fallback */ }
    window.open("invoice.html?" + params.toString(), "_blank");
  } catch (error) {
    console.error("Invoice open error:", error);
    showToast("❌ Failed to open invoice. Please try again.", "error");
  }
}
// Legacy alias
function downloadInvoice() { openInvoice(); }

// ── Supabase Storage uploads ──────────────────────────────────
// Compresses image client-side before upload to keep file sizes small.
function compressImage(file, maxWidthPx, qualityVal) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale  = Math.min(1, maxWidthPx / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob || file), "image/jpeg", qualityVal);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

async function uploadPaymentScreenshot(sb, file, regId) {
  const compressed = await compressImage(file, 1400, 0.78);
  const path = `screenshots/${regId}.jpg`;
  const { error } = await sb.storage
    .from("payment-screenshots")
    .upload(path, compressed, { upsert: false, contentType: "image/jpeg" });
  if (error) throw error;
  const { data: urlData } = sb.storage.from("payment-screenshots").getPublicUrl(path);
  return urlData.publicUrl;
}

async function uploadParticipantPhoto(sb, file, regId) {
  const compressed = await compressImage(file, 1200, 0.80);
  const path = `photos/${regId}.jpg`;
  const { error } = await sb.storage
    .from("payment-screenshots")
    .upload(path, compressed, { upsert: false, contentType: "image/jpeg" });
  if (error) throw error;
  const { data: urlData } = sb.storage.from("payment-screenshots").getPublicUrl(path);
  return urlData.publicUrl;
}

// ── Receipt-style invoice (bKash receipt inspired) ───────────
function loadImg(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function generateInvoice(registrationData) {
  // Canvas setup - CUSTOMIZE: Change SCALE for quality, W_L/H_L for dimensions
  const SCALE = 1; // 2 = High DPI, 1 = Standard
  const W_L = 560, H_L = 1050; // Canvas dimensions (width x height)
  const canvas = document.createElement('canvas');
  canvas.width  = W_L * SCALE;
  canvas.height = H_L * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  // Load background image and club logo watermark
  // CUSTOMIZE: Change paths if your images are in different folders
  const [bgImg, logoGsccc] = await Promise.all([
    loadImg('assets/images/img_invoice.webp'), // Background image from Canva
    loadImg('assets/images/img_gsccc.webp'), // Club logo for watermark
  ]);

  // Draw background image - CUSTOMIZE: Adjust overlay opacity for text readability
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, W_L, H_L);
    // Semi-transparent overlay for text readability (0.0 = transparent, 1.0 = opaque)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // CUSTOMIZE: Change opacity here
    ctx.fillRect(0, 0, W_L, H_L);
  } else {
    // Fallback background if image not found
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, W_L, H_L);
  }

  // Text styling - CUSTOMIZE: Change colors and fonts as needed
  const PAD  = 40; // Horizontal padding
  const CW   = W_L - PAD*2; // Content width
  const MONO = '"Courier New", Courier, monospace'; // Monospace font
  const SANS = '"Segoe UI", Arial, sans-serif'; // Sans-serif font
  const RED  = '#cc1b1b'; // Accent color (red)
  const GOLD = '#c9a84c'; // Accent color (gold)
  const DARK = '#1a1a1a'; // Dark text color
  const MID  = '#555555'; // Medium text color
  const LITE = '#888888'; // Light text color

  // Title section
  ctx.fillStyle = DARK;
  ctx.font = `bold 28px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.fillText('PAYMENT RECEIPT', W_L / 2, 60);

  ctx.fillStyle = MID;
  ctx.font = `14px ${SANS}`;
  ctx.fillText('REVOLUTION 2.0 - GSCCC NATIONAL CULTURAL EVENT', W_L / 2, 85);

  let y = 120; // Starting Y position for content

  function dashDiv(yy, color) {
    ctx.save();
    ctx.strokeStyle = color || '#dddddd';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD - 8, yy); ctx.lineTo(W_L - PAD + 8, yy); ctx.stroke();
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(PAD - 8, yy);
    ctx.lineTo(W_L - PAD + 8, yy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function sectionHeader(label, yy) {
    ctx.fillStyle = DARK;
    ctx.font = `bold 13px ${SANS}`;
    ctx.textAlign = 'left';
    ctx.fillText(label, PAD, yy);
    return yy + 22;
  }

  function row(label, value, yy, highlight) {
    ctx.fillStyle = MID;
    ctx.font = `13px ${MONO}`;
    ctx.textAlign = 'left';
    ctx.fillText(label, PAD, yy);
    ctx.fillStyle = highlight ? RED : DARK;
    ctx.font = highlight ? `bold 13px ${MONO}` : `13px ${MONO}`;
    ctx.textAlign = 'right';
    const maxW = CW - 10;
    const measured = ctx.measureText(String(value)).width;
    if (measured > maxW * 0.55) {
      ctx.font = `11px ${MONO}`;
    }
    ctx.fillText(String(value), W_L - PAD, yy);
    return yy + 26;
  }

  dashDiv(y); y += 16;
  y = sectionHeader('Bill Information', y);
  dashDiv(y); y += 16;
  y = row('Organization Name', 'Government Science College Cultural Club', y);
  y = row('Event', 'Revolution 2.0', y);
  y = row('Segment', registrationData.segmentname || 'N/A', y);
  y = row('Registration ID', (registrationData.id || 'N/A').slice(-10).toUpperCase(), y);
  const adminSegs = (registrationData.segment||"").split(",").filter(Boolean);
  const adminTotal = adminSegs.length > 0 ? adminSegs.length * 50 : 50;
  y = row('Segments', String(adminSegs.length || 1) + ' × BDT 50.00', y);
  y = row('Total Bill Amount', 'BDT ' + adminTotal.toFixed(2), y, true);
  y += 4;
  dashDiv(y); y += 16;

  y = sectionHeader('Participant Details', y);
  dashDiv(y); y += 16;
  y = row('Name', registrationData.name || 'N/A', y);
  y = row('Phone', registrationData.phone || 'N/A', y);
  y = row('Email', registrationData.email || 'N/A', y);
  y = row('Institution', registrationData.institution || 'N/A', y);
  y = row('Class / Year', registrationData.classyear || 'N/A', y);
  if (registrationData.ca_ref) {
    y = row('CA Reference', registrationData.ca_ref, y);
  }
  y += 4;
  dashDiv(y); y += 16;

  y = sectionHeader('Payment Information', y);
  dashDiv(y); y += 16;
  y = row('bKash Number', registrationData.bkash || 'N/A', y);
  y = row('Payment Date', (registrationData.timestamp || registrationData.payment_date
    ? new Date(registrationData.timestamp || registrationData.payment_date)
    : new Date()).toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'}), y);
  y = row('Transaction ID', registrationData.txn || 'N/A', y);
  y = row('Paid To', '01811221844', y);
  y = row('Method', 'bKash Send Money', y);
  y = row('bKash Fee', '0.00', y);

  // Add footer text
  ctx.fillStyle = LITE;
  ctx.font = `10px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.fillText('This receipt has been generated electronically.', W_L / 2, H_L - 60);
  ctx.fillText('No signature required. © 2026 GSCCC Cultural Club.', W_L / 2, H_L - 40);

  // Add club logo as watermark overlay - CUSTOMIZE: Adjust transparency and size
  if (logoGsccc) {
    ctx.save();
    ctx.globalAlpha = 0.15; // CUSTOMIZE: Change watermark opacity (0.0 = invisible, 1.0 = opaque)
    
    // Center watermark - CUSTOMIZE: Adjust size and position
    const watermarkSize = 180; // CUSTOMIZE: Change watermark size
    const watermarkX = (W_L - watermarkSize) / 2;
    const watermarkY = (H_L - watermarkSize) / 2;
    
    ctx.drawImage(logoGsccc, watermarkX, watermarkY, watermarkSize, watermarkSize);
    ctx.restore();
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('Failed to create blob')); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt_Revolution2_${(registrationData.id || 'Unknown').slice(-8)}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/jpeg', 0.85);
  });
}


async function submitForm() {

  const sb = getSupabase();
  if (!sb) {
    showToast("⚠️ Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.", "error");
    return;
  }

  let ok = true;
  ok = ok && validate("f-name",  "e-name",  v => v.length >= 2 && v.length <= 80, "Please enter your full name");
  ok = ok && validate("f-email", "e-email", v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 120, "Enter a valid email");
  ok = ok && validate("f-phone", "e-phone", v => v.replace(/\D/g,"").length >= 8 && v.length <= 30, "Enter a valid phone number");
  ok = ok && validate("f-inst",  "e-inst",  v => v.length >= 2 && v.length <= 120, "Enter your institution name");
  ok = ok && validate("f-class", "e-class", v => v !== "", "Please select your class / year");
  // Multi-segment validation
  const selectedSegs = getSelectedSegments();
  if (selectedSegs.length === 0) {
    const errEl = document.getElementById("e-seg");
    if (errEl) errEl.textContent = "Please select at least one segment";
    ok = false;
  }
  ok = ok && validate("f-txn",   "e-txn",   v => v.length >= 4 && v.length <= 40, "Enter your bKash transaction ID");
  ok = ok && validateFile("f-ss","e-ss",    f => !!f && /^image\//.test(f.type || ""), "Please upload your bKash transaction screenshot (image)");
  ok = ok && validate("f-bkash", "e-bkash", v => v.length >= 11, "Enter your bKash number (11 digits)");
  const hasMicSel  = selectedSegs.includes("mic");
  if (hasMicSel)  ok = ok && validate("f-cat-mic",  "e-cat-mic",  v => v === "A" || v === "B", "Please select a category for Singing");
  if (!ok) return;

  const regId  = genRegId();
  const catMic = (document.getElementById("f-cat-mic") && document.getElementById("f-cat-mic").value) || "";
  const ssFile  = document.getElementById("f-ss").files[0];
  // IMPORTANT: Supabase/PostgREST column names must match the table schema exactly.
  const noteRaw = (document.getElementById("f-note").value.trim() || "");

  // Spinner on
  const btn = document.getElementById("submit-btn");
  btn.classList.add("submitting"); btn.disabled = true;

  let screenshotUrl = "";
  try {
    screenshotUrl = await uploadPaymentScreenshot(sb, ssFile, regId);
  } catch (e) {
    console.error("Screenshot upload failed:", e);
    const ssErr = e?.message || e?.error_description || JSON.stringify(e) || "unknown";
    showToast("❌ Screenshot upload failed: " + ssErr, "error");
    btn.classList.remove("submitting"); btn.disabled = false;
    return;
  }

  // note stores the screenshot URL + any participant note
  const noteFinal = [
    screenshotUrl ? `Screenshot: ${screenshotUrl}` : "",
    noteRaw
  ].filter(Boolean).join("\n");

  // Build segment + category summary
  const segSummary = selectedSegs.map(s => {
    let label = SEGS[s].name;
    if (s === "mic" && catMic) label += " (Cat " + catMic + ")";
    return label;
  }).join(", ");
  const totalAmount = selectedSegs.length * 50;

  // Only columns that exist in the DB schema go here.
  // Do NOT include photo_base64 / screenshot_base64 / photo — legacy columns,
  // left in DB for history but we no longer write to them.
  const dbPayload = {
    id:          regId,
    name:        document.getElementById("f-name").value.trim(),
    email:       document.getElementById("f-email").value.trim(),
    phone:       document.getElementById("f-phone").value.trim(),
    dob:         (document.getElementById("f-dob").value || null),
    institution: document.getElementById("f-inst").value.trim(),
    classyear:   (document.getElementById("f-class").value || null),
    segment:     selectedSegs.join(","),
    segmentname: segSummary,
    category:    (catMic || null),
    ca_ref:      (document.getElementById("f-ca-ref").value.trim() || null),
    txn:         document.getElementById("f-txn").value.trim(),
    bkash:       (document.getElementById("f-bkash").value.trim() || null),
    note:        (noteFinal || null),
    status:      "pending",
    timestamp:   new Date().toISOString(),
  };

  try {
    const { error } = await sb.from("registrations").insert(dbPayload);
    if (error) throw error;

    // Merge local-only meta (not in DB) for invoice generation
    window.currentRegistration = {
      ...dbPayload,
      _totalAmount: totalAmount,
      _segments:    selectedSegs,
    };

    // Show success page
    document.getElementById("ss-seg").textContent   = dbPayload.segmentname;
    document.getElementById("ss-email").textContent = dbPayload.email;
    document.getElementById("ss-id").textContent    = regId;
    showPage("success");

    // Reset form
    ["f-name","f-email","f-phone","f-dob","f-inst","f-txn","f-bkash","f-note","f-ca-ref"].forEach(id => { const el = document.getElementById(id); if(el) el.value=""; });
    const fClass = document.getElementById("f-class"); if(fClass) fClass.value = "";
    clearFilePicker("f-ss","ss-name");
    // Reset multi-segment checkboxes
    document.querySelectorAll("#seg-checkbox-grid input[type=checkbox]").forEach(cb => { cb.checked = false; cb.closest(".seg-checkbox-item").classList.remove("selected"); });
    const micW  = document.getElementById("cat-mic-wrap");  if (micW)  micW.style.display  = "none";
    const totW  = document.getElementById("total-amount-wrap"); if (totW) totW.style.display = "none";
    if (document.getElementById("f-cat-mic"))  document.getElementById("f-cat-mic").value  = "";
  } catch (err) {
    console.error("Supabase insert error:", err, { dbPayload });
    const errMsg = err?.message || err?.details || err?.hint || JSON.stringify(err) || "unknown";
    const errCode = err?.code || err?.status || "";

    if (errCode === "42501" || err?.status === 403) {
      showToast("❌ RLS blocked. Code: " + errCode + " — " + errMsg, "error");
    } else if (errCode === "23502") {
      showToast("❌ Missing required field: " + errMsg, "error");
    } else if (errCode === "42703") {
      showToast("❌ Unknown column in payload: " + errMsg, "error");
    } else {
      showToast("❌ Insert failed [" + errCode + "]: " + errMsg, "error");
    }
    btn.classList.remove("submitting"); btn.disabled = false;
  } finally {
    btn.classList.remove("submitting"); btn.disabled = false;
  }
}


// Init file name binding on load
bindFileName("f-ss","ss-name","ss-wrap");

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
    // Explicitly verify session is alive before querying
    const { data: sessionData } = await sb.auth.getSession();
    if (!sessionData || !sessionData.session) {
      throw new Error("No active session — please log in again.");
    }

    // Auto-retry once — Supabase free tier has cold-start latency
    async function fetchRegs() {
      const fetchPromise = sb
        .from("registrations")
        .select("id,name,email,phone,institution,classyear,segment,segmentname,category,ca_ref,txn,bkash,note,status,timestamp")
        .order("id", { ascending: false })
        .limit(200);
      const timeoutPromise = new Promise((_,reject) => setTimeout(() => reject(new Error("timeout")), 25000));
      return Promise.race([fetchPromise, timeoutPromise]);
    }

    let result;
    try {
      result = await fetchRegs();
    } catch(e) {
      if (e.message === "timeout") {
        ind.innerHTML = '<span class="api-status local"><span class="api-status-dot"></span> Waking up Supabase, retrying…</span>';
        result = await fetchRegs(); // retry once
      } else {
        throw e;
      }
    }
    const { data, error } = result;
    if (error) throw error;
    cpRegs = data || [];
    ind.innerHTML = '<span class="api-status connected"><span class="api-status-dot"></span> Supabase Connected</span>';
  } catch (e) {
    console.error("Supabase load error:", e);
    cpRegs = [];
    const msg = e.message || "Unknown error";
    ind.innerHTML = `<span class="api-status local"><span class="api-status-dot"></span> Error: ${msg}</span>`;
    showToast("⚠️ " + msg, "error");
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
  cpRegs.forEach(r => { (r.segment||"").split(",").forEach(s => { if(cnt[s.trim()]!==undefined) cnt[s.trim()]++; }); });
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
    (!seg || (r.segment||"").split(",").map(s=>s.trim()).includes(seg)) &&
    (!sts || r.status  === sts)
  );
  const tbody = document.getElementById("cp-tbody");
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state"><i class="fas fa-inbox"></i><p>No registrations match filters</p></div></td></tr>`;
    document.getElementById("table-count").textContent = "";
    return;
  }
  tbody.innerHTML = rows.map(r => {
    const hasPhoto = (r.photo||"").startsWith("data:image");
    return `
    <tr>
      <td style="font-family:var(--font-m);font-size:.78rem;color:var(--gold)">${r.id}</td>
      <td style="color:var(--text);font-weight:600">
        ${hasPhoto ? `<img src="${r.photo}" onclick="viewPhotos('${r.id}')" style="width:30px;height:30px;object-fit:cover;border-radius:4px;border:1px solid rgba(201,168,76,.4);cursor:pointer;vertical-align:middle;margin-right:6px;" title="View photos">` : ""}${r.name}
      </td>
      <td>${r.email}</td>
      <td>${r.phone}</td>
      <td>${r.institution||""}</td>
      <td style="color:var(--accent-light)">${r.segmentname}</td>
      <td style="font-family:var(--font-m);font-size:.78rem;color:var(--gold)">${r.category ? "Cat " + r.category : "—"}</td>
      <td style="font-family:var(--font-m);font-size:.78rem">${r.txn}</td>
      <td style="font-family:var(--font-m);font-size:.78rem">${r.bkash||"—"}</td>
      <td style="font-size:.8rem">${new Date(r.timestamp).toLocaleDateString("en-BD",{day:"2-digit",month:"short",year:"2-digit"})}</td>
      <td><span class="status-badge ${r.status}">${r.status}</span></td>
      <td>
        <div class="act-btns">
          <button class="act-btn ok"  onclick="setStatus('${r.id}','approved')">✓</button>
          <button class="act-btn no"  onclick="setStatus('${r.id}','rejected')">✕</button>
          <button class="act-btn"     onclick="viewPhotos('${r.id}')" title="Photos">🖼</button>
          <button class="act-btn del" onclick="delReg('${r.id}')">🗑</button>
        </div>
      </td>
    </tr>`;
  }).join("");
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


// ================================================================
//  PHOTO VIEWER + DOWNLOAD HELPERS
// ================================================================

// Extract the screenshot public URL stored in the note field
function extractScreenshotUrl(note) {
  if (!note) return null;
  const match = note.match(/Screenshot:\s*(https?:\/\/\S+)/);
  return match ? match[1] : null;
}

function viewPhotos(id) {
  const r = cpRegs.find(x => x.id === id);
  if (!r) return;
  const old = document.getElementById("photo-modal");
  if (old) old.remove();

  const ssUrl = extractScreenshotUrl(r.note || "");
  const hasS  = !!ssUrl;
  // Legacy base64 photo column (no longer written, kept for old records)
  const hasP  = (r.photo||"").startsWith("data:image");

  const modal = document.createElement("div");
  modal.id = "photo-modal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.9);backdrop-filter:blur(14px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:2rem;";
  modal.innerHTML = `
    <div style="background:#0f0f0f;border:1px solid rgba(204,27,27,.35);border-radius:16px;padding:2rem;max-width:920px;width:100%;max-height:90vh;overflow-y:auto;position:relative;">
      <button onclick="document.getElementById('photo-modal').remove()" style="position:absolute;top:1rem;right:1rem;background:rgba(204,27,27,.15);border:1px solid rgba(204,27,27,.3);color:#ff3333;width:36px;height:36px;border-radius:8px;font-size:1.1rem;cursor:pointer;">✕</button>
      <div style="font-family:sans-serif;font-size:1.25rem;font-weight:700;color:#F0EDE8;margin-bottom:.2rem;">${r.name}</div>
      <div style="font-size:.82rem;color:#888880;margin-bottom:1.4rem;">${r.id} · ${r.segmentname} · ${r.institution||""}</div>
      <div style="display:grid;grid-template-columns:${hasP ? "1fr 1fr" : "1fr"};gap:1.4rem;">
        <div>
          <div style="font-size:.7rem;color:#CC1B1B;letter-spacing:2px;margin-bottom:.5rem;">PAYMENT SCREENSHOT</div>
          ${hasS
            ? `<img src="${ssUrl}" style="width:100%;border-radius:10px;border:1px solid rgba(201,168,76,.3);" onerror="this.style.display='none';this.nextSibling.style.display='flex'">
               <div style="display:none;height:120px;background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.1);border-radius:10px;align-items:center;justify-content:center;color:#666;font-size:.85rem;">Image failed to load</div>
               <a href="${ssUrl}" target="_blank" rel="noopener" style="display:block;margin-top:.6rem;width:100%;padding:.6rem;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);color:#C9A84C;border-radius:8px;cursor:pointer;text-align:center;text-decoration:none;">⬇ Open / Download Screenshot</a>`
            : `<div style="height:160px;background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.1);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#444;">No screenshot</div>`}
        </div>
        ${hasP ? `<div>
          <div style="font-size:.7rem;color:#CC1B1B;letter-spacing:2px;margin-bottom:.5rem;">PARTICIPANT PHOTO (legacy)</div>
          <img src="${r.photo}" style="width:100%;border-radius:10px;border:1px solid rgba(201,168,76,.3);">
          <button onclick="downloadBase64('${r.photo}','photo_${r.id}.jpg')" style="margin-top:.6rem;width:100%;padding:.6rem;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);color:#C9A84C;border-radius:8px;cursor:pointer;">⬇ Download Photo</button>
        </div>` : ""}
      </div>
      <div style="margin-top:1.4rem;display:flex;gap:.8rem;">
        <button onclick="downloadInvoiceForReg('${r.id}')" style="flex:1;padding:.75rem;background:linear-gradient(135deg,#CC1B1B,#8B0000);border:1px solid rgba(204,27,27,.5);color:#fff;border-radius:8px;cursor:pointer;font-weight:700;letter-spacing:1px;">⬇ Download Invoice</button>
        <button onclick="document.getElementById('photo-modal').remove()" style="padding:.75rem 1.5rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#888;border-radius:8px;cursor:pointer;">Close</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", e => { if(e.target===modal) modal.remove(); });
}

function downloadBase64(dataUrl, filename) {
  if (!dataUrl || !dataUrl.startsWith("data:")) { showToast("No image data.", "error"); return; }
  const a = document.createElement("a");
  a.href = dataUrl; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

async function downloadInvoiceForReg(id) {
  const r = cpRegs.find(x => x.id === id);
  if (!r) { showToast("Not found.", "error"); return; }
  await generateInvoice(r);
  showToast("✅ Invoice downloading...", "success");
}

function exportPhotos() {
  // Collect all registrations that have a screenshot URL in their note
  const list = cpRegs.filter(r => extractScreenshotUrl(r.note || ""));
  if (!list.length) { showToast("No screenshots to export.", "error"); return; }
  // Open each screenshot URL in a new tab — Storage files can't be batch-downloaded
  // via JS fetch due to cross-origin limits, so we open them for manual save
  list.forEach((r, i) => {
    setTimeout(() => {
      const url = extractScreenshotUrl(r.note || "");
      if (url) window.open(url, "_blank", "noopener");
    }, i * 400);
  });
  showToast(`✅ Opened ${list.length} screenshot(s) in new tabs.`, "success");
}

function exportCSV() {
  if (!cpRegs.length) { showToast("No registrations to export."); return; }
  const hdrs = ["ID","Name","Email","Phone","Institution","Class","Segment","Category","CA Reference","TxnID","bKash","Note","Date","Status"];
  const rows = cpRegs.map(r => [
    r.id,
    r.name,
    r.email,
    r.phone,
    r.institution || "",
    r.classyear || "",
    r.segmentname,
    r.category || "",
    r.ca_ref || "",
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
    {name:"Rafiqul Islam",  email:"rafiq@example.com", phone:"01711111111", institution:"Dhaka College",      classyear:"Class 12", segment:"pen",  txn:"8K7H2J4M9N"},
    {name:"Nusrat Jahan",   email:"nusrat@example.com",phone:"01722222222", institution:"Chittagong HS",     classyear:"Class 11", segment:"dance",txn:"3P2Q8W1R5V"},
    {name:"Tanvir Ahmed",   email:"tanvir@example.com",phone:"01733333333", institution:"Rajshahi College",  classyear:"SSC Batch 2026", segment:"quiz", txn:"6M9N4K2J7H"},
    {name:"Shayla Akter",   email:"shayla@example.com",phone:"01744444444", institution:"BUET",              classyear:"HSC Batch 2026", segment:"mic",  txn:"1A5B3C7D9E"},
    {name:"Mehedi Hasan",   email:"mehedi@example.com",phone:"01755555555", institution:"Notre Dame",        classyear:"Class 11", segment:"voice",txn:"2F4G6H8I0J"},
    {name:"Fatema Khatun",  email:"fatema@example.com",phone:"01766666666", institution:"Khulna Collegiate", classyear:"Class 12", segment:"art",  txn:"3K5L7M9N1P"},
    {name:"Saurav Dey",     email:"saurav@example.com",phone:"01777777777", institution:"Sylhet MC College", classyear:"Class 10", segment:"pic",  txn:"4Q6R8S0T2U"},
    {name:"Israt Tasnim",   email:"israt@example.com", phone:"01788888888", institution:"Viqarunnisa Noon",  classyear:"Class 11", segment:"poem", txn:"5V7W9X1Y3Z"},
  ];
  const statuses = ["pending","pending","approved","rejected","pending","approved","pending","approved"];
  samples.forEach((s,i) => {
    cpRegs.push({
      id: "REV2026-"+(++regCounter),
      ...s, segmentname: SEGS[s.segment].name, category: s.segment === "mic" ? "A" : null, ca_ref:"", bkash:"", note:"",
      timestamp: new Date(Date.now()-Math.random()*86400000*7).toISOString(),
      status: statuses[i],
    });
  });
  renderDashboard();
  showToast("✅ 8 sample registrations added", "success");
}

// ================================================================