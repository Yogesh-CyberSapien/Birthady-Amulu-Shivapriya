/* =========================================================
   AMULU ✦ A LITTLE MAGIC  —  interactions
   1. night sky starfield + shooting stars
   2. floating candles
   3. envelope gate ("Lumos") that unlocks the page + music
   4. 3D ring photo carousel (drag / keys / arrows) + lightbox
   5. pointer-driven 3D tilt on parchment + wish card
   6. scroll reveals, hero letter 3D, castle parallax
   7. wand sparkle trail
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =======================================================
     1. STARFIELD
     ======================================================= */
  const sky = $('#starfield');
  const skyCtx = sky.getContext('2d');
  let stars = [], shooters = [], skyW = 0, skyH = 0, skyDpr = 1;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  function sizeSky() {
    skyDpr = Math.min(window.devicePixelRatio || 1, 2);
    skyW = sky.clientWidth;
    skyH = sky.clientHeight;
    sky.width  = Math.floor(skyW * skyDpr);
    sky.height = Math.floor(skyH * skyDpr);
    skyCtx.setTransform(skyDpr, 0, 0, skyDpr, 0, 0);

    const count = clamp(Math.round((skyW * skyH) / 5200), 90, 420);
    stars = Array.from({ length: count }, () => {
      const depth = Math.random();               // 0 = far, 1 = near
      return {
        x: Math.random() * skyW,
        y: Math.random() * skyH,
        r: 0.35 + depth * 1.5,
        depth,
        tw: Math.random() * Math.PI * 2,
        twSpeed: 0.004 + Math.random() * 0.016,
        warm: Math.random() > 0.72            // a few gold stars
      };
    });
  }

  function spawnShooter() {
    if (reduced) return;
    const fromLeft = Math.random() > 0.5;
    shooters.push({
      x: fromLeft ? -80 : skyW + 80,
      y: Math.random() * skyH * 0.5,
      vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 5),
      vy: 2 + Math.random() * 2.4,
      life: 1,
      len: 90 + Math.random() * 120
    });
  }

  function drawSky() {
    skyCtx.clearRect(0, 0, skyW, skyH);

    // ease pointer parallax
    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;

    for (const s of stars) {
      s.tw += s.twSpeed;
      const flick = 0.55 + Math.sin(s.tw) * 0.45;
      const px = s.x + pointer.x * (6 + s.depth * 26);
      const py = s.y + pointer.y * (6 + s.depth * 26);
      const alpha = (0.25 + s.depth * 0.75) * flick;

      skyCtx.beginPath();
      skyCtx.arc(px, py, s.r, 0, Math.PI * 2);
      skyCtx.fillStyle = s.warm
        ? `rgba(246,223,160,${alpha})`
        : `rgba(226,234,255,${alpha})`;
      skyCtx.fill();

      if (s.depth > 0.86) {                 // soft glow on the nearest stars
        skyCtx.beginPath();
        skyCtx.arc(px, py, s.r * 4.5, 0, Math.PI * 2);
        skyCtx.fillStyle = s.warm
          ? `rgba(246,223,160,${alpha * 0.1})`
          : `rgba(180,205,255,${alpha * 0.09})`;
        skyCtx.fill();
      }
    }

    // shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const m = shooters[i];
      m.x += m.vx; m.y += m.vy; m.life -= 0.008;
      const grad = skyCtx.createLinearGradient(m.x, m.y, m.x - m.vx * (m.len / 10), m.y - m.vy * (m.len / 10));
      grad.addColorStop(0, `rgba(255,250,230,${clamp(m.life, 0, 1) * 0.95})`);
      grad.addColorStop(1, 'rgba(255,250,230,0)');
      skyCtx.strokeStyle = grad;
      skyCtx.lineWidth = 1.7;
      skyCtx.beginPath();
      skyCtx.moveTo(m.x, m.y);
      skyCtx.lineTo(m.x - m.vx * (m.len / 10), m.y - m.vy * (m.len / 10));
      skyCtx.stroke();
      if (m.life <= 0 || m.x < -200 || m.x > skyW + 200 || m.y > skyH + 100) shooters.splice(i, 1);
    }

    requestAnimationFrame(drawSky);
  }

  if (sky) {
    sizeSky();
    drawSky();
    setInterval(() => { if (Math.random() > 0.45) spawnShooter(); }, 4200);
  }

  /* =======================================================
     2. FLOATING CANDLES
     ======================================================= */
  const field = $('#candleField');
  function buildCandles() {
    if (!field) return;
    field.innerHTML = '';
    const n = window.innerWidth < 700 ? 8 : 15;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.className = 'candle';
      const scale = (0.55 + Math.random() * 0.95) * (window.innerWidth < 700 ? 0.8 : 1);
      c.style.left = `${Math.random() * 96}%`;
      c.style.top  = `${8 + Math.random() * 82}%`;
      c.style.transform = `scale(${scale.toFixed(2)})`;
      c.style.animationDuration = `${10 + Math.random() * 14}s`;
      c.style.animationDelay = `${-Math.random() * 14}s`;
      c.style.opacity = (0.45 + Math.random() * 0.5).toFixed(2);
      c.innerHTML = `<div class="halo"></div><div class="flame"></div>`;
      frag.appendChild(c);
    }
    field.appendChild(frag);
  }
  buildCandles();

  /* =======================================================
     3. GATE + MUSIC
     ======================================================= */
  const gate    = $('#gate');
  const openBtn = $('#openBtn');
  const audio   = $('#music');
  const musicBtn= $('#musicBtn');
  let opened = false;
  let openStamp = performance.now();

  function startMusic() {
    if (!audio) return;
    audio.volume = 0.7;
    const p = audio.play();
    if (p && p.catch) {
      p.then(() => musicBtn && musicBtn.classList.add('playing'))
       .catch(() => musicBtn && musicBtn.classList.remove('playing'));
    } else if (musicBtn) {
      musicBtn.classList.add('playing');
    }
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;
    openStamp = performance.now();
    document.body.classList.remove('locked');
    document.body.classList.add('opened');
    if (gate) gate.style.pointerEvents = 'none';
    startMusic();
    setTimeout(() => { if (ring) ring.classList.remove('no-anim'); }, 1400);
    // gentle reveal of hero letters (3D flip-in, staggered)
    const chars = $$('#heroName .ch');
    chars.forEach((ch, i) => {
      ch.style.transition = 'transform .95s cubic-bezier(.22,.9,.24,1), opacity .8s ease';
      ch.style.transitionDelay = `${0.3 + i * 0.075}s`;
      ch.style.transform = 'translate3d(0,0,0) rotateY(0deg)';
      ch.style.opacity = '1';
    });
    // release the stagger delays so pointer parallax stays snappy afterwards
    setTimeout(() => chars.forEach((ch) => { ch.style.transitionDelay = '0s'; }), 2400);
  }

  if (openBtn) openBtn.addEventListener('click', openEnvelope);

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (audio.paused) { startMusic(); }
      else {
        audio.pause();
        musicBtn.classList.remove('playing');
      }
    });
  }
  if (audio) {
    audio.addEventListener('playing', () => musicBtn && musicBtn.classList.add('playing'));
    audio.addEventListener('pause',  () => musicBtn && musicBtn.classList.remove('playing'));
    audio.addEventListener('error',  () => {
      if (musicBtn) {
        musicBtn.classList.remove('playing');
        musicBtn.title = 'musicweb.mp3 not found — place it beside index.html';
      }
    });
  }

  /* =======================================================
     HERO NAME : split into 3D letters
     ======================================================= */
  const heroName = $('#heroName');
  if (heroName) {
    const text = heroName.textContent.trim();
    heroName.textContent = '';
    [...text].forEach((letter, i) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = letter;
      span.style.transform = reduced
        ? 'none'
        : `rotateY(${(i % 2 ? -1 : 1) * 55}deg) translateY(14px) translateZ(-60px)`;
      span.style.opacity = reduced ? '1' : '0.001';
      heroName.appendChild(span);
    });
  }

  /* =======================================================
     4. 3D RING CAROUSEL
     ======================================================= */
  const ringWrap = $('.ring-wrap');
  const ring     = $('#ring');
  const frames   = ring ? $$('.frame', ring) : [];
  const N        = frames.length;
  const STEP     = N ? 360 / N : 0;
  let index      = 0;
  let radius     = 340;
  let autoTimer  = null;
  let dragging   = false;
  let dragStartX = 0;
  let dragDelta  = 0;
  let moved      = 0;

  // mark photos that fail to load with a stylish placeholder
  frames.forEach((f, i) => {
    const img = $('img', f);
    const markMissing = () => f.classList.add('missing');
    if (img) {
      img.addEventListener('error', markMissing);
      if (img.complete && img.naturalWidth === 0) markMissing();
    }
    f.dataset.idx = String(i);
  });

  function measureRadius() {
    const wrapW = ringWrap ? ringWrap.clientWidth : 900;
    const itemW = frames[0] ? frames[0].getBoundingClientRect().width : 200;
    const narrow = wrapW < 700;
    // enough room that frames never overlap, tighter ring on phones so
    // the neighbouring frames stay on screen
    const ideal = (itemW * N) / (2 * Math.PI) * (narrow ? 0.95 : 1.18);
    const min   = itemW * (narrow ? 1.02 : 1.35);
    const max   = Math.max(min, wrapW * (narrow ? 0.42 : 0.62));
    return clamp(ideal, min, max);
  }

  function layoutRing() {
    if (!ring || !N) return;
    radius = measureRadius();
    frames.forEach((f, i) => {
      f.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px)`;
    });
    ring.style.setProperty('--radius', radius + 'px');
    applyRing();
  }

  function applyRing() {
    if (!ring) return;
    ring.style.transform = `translateZ(${-radius * 0.28}px) rotateY(${-index * STEP}deg)`;
    const front = ((index % N) + N) % N;
    frames.forEach((f, i) => f.classList.toggle('is-front', i === front));
  }

  function goTo(i) {
    index = i;
    applyRing();
    restartAuto();
  }
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  function restartAuto() {
    if (autoTimer) clearInterval(autoTimer);
    if (reduced) return;
    autoTimer = setInterval(() => {
      if (!document.body.classList.contains('opened')) return;
      if (dragging) return;
      if (document.hidden) return;
      index += 1;
      applyRing();
    }, 4600);
  }

  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // keyboard
  window.addEventListener('keydown', (e) => {
    if ($('#lightbox') && $('#lightbox').classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showLb(lbIndex + 1);
      if (e.key === 'ArrowLeft')  showLb(lbIndex - 1);
      return;
    }
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  // drag / swipe
  if (ringWrap) {
    ringWrap.addEventListener('dragstart', (e) => e.preventDefault());

    ringWrap.addEventListener('pointerdown', (e) => {
      dragging = true;
      dragStartX = e.clientX;
      dragDelta = 0;
      moved = 0;
      ringWrap.classList.add('dragging');
      ring && ring.classList.add('no-anim');
      if (autoTimer) clearInterval(autoTimer);
      // keep receiving moves even if the pointer slips over a frame / outside the box
      try { ringWrap.setPointerCapture(e.pointerId); } catch (_) {}
      if (e.pointerType === 'mouse') e.preventDefault();
    });

    ringWrap.addEventListener('pointermove', (e) => {
      if (!dragging || !ring) return;
      dragDelta = e.clientX - dragStartX;
      moved = Math.max(moved, Math.abs(dragDelta));
      const live = -index * STEP - dragDelta * 0.28;
      ring.style.transform = `translateZ(${-radius * 0.28}px) rotateY(${live}deg)`;
    });

    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      ringWrap.classList.remove('dragging');
      if (ring) ring.classList.remove('no-anim');
      try { ringWrap.releasePointerCapture(e.pointerId); } catch (_) {}
      if (Math.abs(dragDelta) > 42) {
        // one step per ~90px dragged, so a long swipe can skip a couple of frames
        const steps = clamp(Math.round(Math.abs(dragDelta) / 130), 1, 2);
        index += (dragDelta > 0 ? -1 : 1) * steps;
      }
      applyRing();
      restartAuto();
      // let the click that follows a drag be ignored, then re-arm taps
      setTimeout(() => { moved = 0; }, 60);
    };
    ringWrap.addEventListener('pointerup', endDrag);
    ringWrap.addEventListener('pointercancel', endDrag);
    ringWrap.addEventListener('pointerleave', endDrag);
  }

  // frame clicks
  frames.forEach((f, i) => {
    f.addEventListener('click', (e) => {
      if (moved > 8) { moved = 0; return; }        // it was a drag, not a tap
      const front = ((index % N) + N) % N;
      if (i === front) { openLightbox(i); }
      else { goTo(index + shortestStep(i)); }
      e.stopPropagation();
    });
    // subtle 3D parallax on hover
    f.addEventListener('pointermove', (e) => {
      const box = f.getBoundingClientRect();
      const dx = (e.clientX - box.left) / box.width - 0.5;
      const dy = (e.clientY - box.top) / box.height - 0.5;
      const inner = $('.frame-3d', f);
      if (inner) inner.style.transform =
        `translateZ(28px) rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg)`;
    });
    f.addEventListener('pointerleave', () => {
      const inner = $('.frame-3d', f);
      if (inner) inner.style.transform = '';
    });
  });

  function shortestStep(target) {
    const front = ((index % N) + N) % N;
    let d = target - front;
    if (d > N / 2) d -= N;
    if (d < -N / 2) d += N;
    return d;
  }

  /* =======================================================
     5. LIGHTBOX
     ======================================================= */
  const lightbox   = $('#lightbox');
  const lbImg      = $('#lbImg');
  const lbClose    = $('#lbClose');
  const lbPrev     = $('#lbPrev');
  const lbNext     = $('#lbNext');
  let lbIndex = 0;

  function openLightbox(i) { showLb(i); if (lightbox) lightbox.classList.add('open'); }
  function closeLightbox() { if (lightbox) lightbox.classList.remove('open'); }
  function showLb(i) {
    if (!N) return;
    lbIndex = ((i % N) + N) % N;
    const src = frames[lbIndex].dataset.src;
    if (!lightbox || !lbImg) return;
    lightbox.classList.remove('missing');
    lbImg.onerror = () => lightbox.classList.add('missing');
    lbImg.src = src;
  }
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', () => showLb(lbIndex - 1));
  if (lbNext)  lbNext.addEventListener('click', () => showLb(lbIndex + 1));
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  /* =======================================================
     6. REVEALS · TILT · PARALLAX
     ======================================================= */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  // pointer-driven 3D tilt for cards
  if (!reduced) {
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const b = card.getBoundingClientRect();
        const dx = (e.clientX - b.left) / b.width - 0.5;
        const dy = (e.clientY - b.top) / b.height - 0.5;
        card.style.transform =
          `perspective(1000px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateZ(10px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // global pointer → sky + castle parallax + hero letter depth
  const castleLayer = $('#castleLayer');
  window.addEventListener('pointermove', (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    pointer.tx = nx;
    pointer.ty = ny;

    if (castleLayer && !reduced) {
      castleLayer.style.transform = `translate3d(${nx * -26}px, ${ny * -10}px, 0)`;
    }
    if (heroName && !reduced && opened) {
      const chars = $$('.ch', heroName);
      // only parallax once the flip-in has finished
      if (performance.now() - openStamp > 2600) {
        chars.forEach((ch, i) => {
          const depth = 1 + (i % 3) * 0.45;
          ch.style.transform =
            `translate3d(${nx * 11 * depth}px, ${ny * 7 * depth}px, 0) rotateY(${nx * -6}deg)`;
        });
      }
    }
  }, { passive: true });

  // scroll: gentle fade of the castle as the page descends
  const onScroll = () => {
    if (castleLayer) {
      const p = clamp(window.scrollY / (window.innerHeight * 0.9), 0, 1);
      castleLayer.style.opacity = String(1 - p * 0.55);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* =======================================================
     7. WAND SPARKLE TRAIL
     ======================================================= */
  const sp = $('#sparkles');
  const spCtx = sp ? sp.getContext('2d') : null;
  let sparks = [];
  let spW = 0, spH = 0;

  function sizeSparks() {
    if (!sp) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    spW = sp.clientWidth; spH = sp.clientHeight;
    sp.width = Math.floor(spW * dpr);
    sp.height = Math.floor(spH * dpr);
    spCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addSparks(x, y, n = 2) {
    for (let i = 0; i < n; i++) {
      sparks.push({
        x, y,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6 - 0.35,
        r: 0.7 + Math.random() * 1.9,
        life: 1,
        decay: 0.016 + Math.random() * 0.02,
        gold: Math.random() > 0.25
      });
    }
    if (sparks.length > 340) sparks.splice(0, sparks.length - 340);
  }

  function drawSparks() {
    if (!spCtx) return;
    spCtx.clearRect(0, 0, spW, spH);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy;
      s.vy += 0.012;
      s.vx *= 0.985;
      s.life -= s.decay;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      const a = s.life;
      spCtx.beginPath();
      spCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      spCtx.fillStyle = s.gold
        ? `rgba(246,223,160,${a})`
        : `rgba(255,255,255,${a * 0.9})`;
      spCtx.shadowBlur = 10;
      spCtx.shadowColor = s.gold ? 'rgba(246,223,160,.9)' : 'rgba(255,255,255,.8)';
      spCtx.fill();
    }
    spCtx.shadowBlur = 0;
    requestAnimationFrame(drawSparks);
  }

  if (sp && !reduced) {
    sizeSparks();
    drawSparks();
    let last = 0;
    window.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - last < 16) return;          // throttle
      last = now;
      addSparks(e.clientX, e.clientY, 2);
    }, { passive: true });
    window.addEventListener('pointerdown', (e) => addSparks(e.clientX, e.clientY, 14));
  }

  /* =======================================================
     RESIZE
     ======================================================= */
  let rAF = null;
  window.addEventListener('resize', () => {
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      sizeSky();
      sizeSparks();
      buildCandles();
      layoutRing();
    });
  });

  /* =======================================================
     BOOT
     ======================================================= */
  if (ring) ring.classList.add('no-anim');
  layoutRing();
  restartAuto();
  window.addEventListener('load', layoutRing);
})();
