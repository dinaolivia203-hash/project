/* =========================================================
   Cika's 21st — interactions
   ========================================================= */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =======================================================
     Confetti / floating hearts
     ======================================================= */
  const Effects = (() => {
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');
    const COLORS = ['#e6a2b4', '#d4859b', '#b5677c', '#f7d3dc', '#f3c98b', '#fff6ef', '#c98f9e', '#e8c8b0'];
    let dpr = 1;
    let W = 0;
    let H = 0;
    let pieces = [];
    let raf = null;
    let last = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function heartPath(c, x, y, size) {
      const s = size / 16;
      c.beginPath();
      c.moveTo(x, y + 4 * s);
      c.bezierCurveTo(x, y, x - 8 * s, y, x - 8 * s, y + 5 * s);
      c.bezierCurveTo(x - 8 * s, y + 9 * s, x, y + 12 * s, x, y + 14 * s);
      c.bezierCurveTo(x, y + 12 * s, x + 8 * s, y + 9 * s, x + 8 * s, y + 5 * s);
      c.bezierCurveTo(x + 8 * s, y, x, y, x, y + 4 * s);
      c.closePath();
    }

    function addPiece(x, y, opts = {}) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2 * (opts.spread ?? 1);
      const speed = (2.2 + Math.random() * 5.5) * (opts.power ?? 1);
      pieces.push({
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed - Math.random() * 1.5,
        g: 0.075 + Math.random() * 0.05,
        drag: 0.992,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.22,
        size: 5 + Math.random() * 7,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: Math.random() < (opts.heartChance ?? 0.35)
          ? 'heart'
          : Math.random() < 0.55 ? 'rect' : 'circle',
        life: 0,
        ttl: 110 + Math.random() * 70,
        alpha: 0.7 + Math.random() * 0.3,
        sway: Math.random() * Math.PI * 2
      });
    }

    function ensureLoop() {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }

    function burst(x, y, opts = {}) {
      if (reduceMotion) return;
      const count = opts.count ?? 46;
      for (let i = 0; i < count; i++) addPiece(x, y, opts);
      if (pieces.length > 560) pieces = pieces.slice(-560);
      ensureLoop();
    }

    function rain() {
      if (reduceMotion) return;
      for (let i = 0; i < 64; i++) {
        pieces.push({
          x: Math.random() * W,
          y: -20 - Math.random() * Math.min(H, 260),
          vx: (Math.random() - 0.5) * 1.1,
          vy: 1.1 + Math.random() * 1.8,
          g: 0.012,
          drag: 0.999,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.12,
          size: 5 + Math.random() * 6,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          shape: Math.random() < 0.4 ? 'heart' : 'rect',
          life: 0,
          ttl: 280 + Math.random() * 120,
          alpha: 0.45 + Math.random() * 0.4,
          sway: Math.random() * Math.PI * 2
        });
      }
      if (pieces.length > 560) pieces = pieces.slice(-560);
      ensureLoop();
    }

    function tick(now) {
      const dt = Math.min((now - last) / 16.667, 2.2);
      last = now;
      ctx.clearRect(0, 0, W, H);

      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.life += dt;
        p.vy += p.g * dt;
        p.vx *= Math.pow(p.drag, dt);
        p.vy *= Math.pow(p.drag, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.sway += 0.08 * dt;

        const fade = Math.min(1, (p.ttl - p.life) / 22);
        if (p.life > p.ttl || p.y > H + 50) {
          pieces.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x + Math.sin(p.sway) * 6, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, fade) * p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'heart') {
          heartPath(ctx, 0, -p.size * 0.85, p.size);
          ctx.fill();
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(-p.size / 2, -p.size * 0.32, p.size, p.size * 0.64, 1.5);
          } else {
            ctx.rect(-p.size / 2, -p.size * 0.32, p.size, p.size * 0.64);
          }
          ctx.fill();
        }
        ctx.restore();
      }

      if (pieces.length) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
        ctx.clearRect(0, 0, W, H);
      }
    }

    function celebrate() {
      burst(W * 0.5, H * 0.42, { count: 78, power: 1.3, spread: 1.25, heartChance: 0.4 });
      setTimeout(() => burst(W * 0.12, H * 0.7, { count: 46, power: 1.1, spread: 1.1, heartChance: 0.4 }), 190);
      setTimeout(() => burst(W * 0.88, H * 0.7, { count: 46, power: 1.1, spread: 1.1, heartChance: 0.4 }), 330);
      setTimeout(rain, 380);
    }

    resize();
    window.addEventListener('resize', resize);

    return { burst, celebrate, rain };
  })();

  /* =======================================================
     Music
     1) assets/audio/monokrom.mp3 — full track, works offline
     2) official 30-second preview (streamed) if the MP3 is absent
     3) gentle music-box fallback if both are unavailable
     ======================================================= */
  const Music = (() => {
    const BPM = 112;
    const BEAT = 60 / BPM;
    const SEMI = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
    const MELODY = [
      ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
      ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
      ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
      ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
      [null, 2]
    ];

    const TRACK_SRC = 'assets/audio/monokrom.mp3';
    // Official 30-second preview stream — only used when the local MP3 is missing.
    const PREVIEW_SRC = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f0/7b/00/f07b00d4-cea0-79f0-3062-7e2b2d2d274a/mzaf_7698224852945153762.plus.aac.p.m4a';
    const TRACK_VOLUME = 0.42;

    const track = document.getElementById('bg-audio');

    let audio = null;
    let master = null;
    let fxBus = null;
    let delaySend = null;
    let playing = false;
    let loopTimer = null;
    let onStateChange = () => {};
    let playToken = 0;
    let fadeFrame = null;
    let trackUnavailable = false;

    function freq(name) {
      const match = /^([A-G]#?)(\d)$/.exec(name);
      if (!match) return 440;
      const midi = SEMI[match[1]] + (parseInt(match[2], 10) + 1) * 12;
      return 440 * Math.pow(2, (midi - 69) / 12);
    }

    function ensure() {
      if (audio) return true;
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return false;

      audio = new AudioCtor();
      const comp = audio.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 22;
      comp.ratio.value = 3;
      comp.attack.value = 0.005;
      comp.release.value = 0.3;
      comp.connect(audio.destination);

      master = audio.createGain();
      master.gain.value = 0.0001;
      master.connect(comp);

      fxBus = audio.createGain();
      fxBus.gain.value = 0.5;
      fxBus.connect(comp);

      delaySend = audio.createGain();
      delaySend.gain.value = 0.3;
      const delay = audio.createDelay(1);
      delay.delayTime.value = 0.36;
      const feedback = audio.createGain();
      feedback.gain.value = 0.23;
      const damp = audio.createBiquadFilter();
      damp.type = 'lowpass';
      damp.frequency.value = 2100;

      delaySend.connect(delay);
      delay.connect(damp);
      damp.connect(feedback);
      feedback.connect(delay);
      damp.connect(master);

      return true;
    }

    function playNote(name, when, duration, volume) {
      const f = freq(name);
      const gain = audio.createGain();
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(volume, when + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + duration * 1.55 + 0.2);

      const fundamental = audio.createOscillator();
      fundamental.type = 'triangle';
      fundamental.frequency.value = f;

      const shimmer = audio.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = f * 2;
      shimmer.detune.value = 4;

      const shimmerGain = audio.createGain();
      shimmerGain.gain.value = 0.16;
      shimmer.connect(shimmerGain);
      shimmerGain.connect(gain);

      fundamental.connect(gain);
      gain.connect(master);
      gain.connect(delaySend);

      const end = when + duration * 1.7 + 0.3;
      fundamental.start(when);
      shimmer.start(when);
      fundamental.stop(end);
      shimmer.stop(end);
    }

    function scheduleLoop() {
      if (!playing) return;
      const start = audio.currentTime + 0.12;
      let t = start;
      for (const [name, beats] of MELODY) {
        const duration = beats * BEAT;
        if (name) playNote(name, t, duration, 0.15);
        t += duration;
      }
      const total = t - start;
      loopTimer = setTimeout(scheduleLoop, Math.max(600, (total - 0.18) * 1000));
    }

    function notify() {
      try { onStateChange(playing); } catch (err) { /* noop */ }
    }

    function fadeTrackTo(target, duration) {
      if (!track) return;
      cancelAnimationFrame(fadeFrame);
      const from = track.volume;
      const startedAt = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        track.volume = Math.min(1, Math.max(0, from + (target - from) * eased));
        if (progress < 1) fadeFrame = requestAnimationFrame(step);
      };
      fadeFrame = requestAnimationFrame(step);
    }

    function startSynth() {
      if (!playing) return;
      if (track) track.pause();
      if (!ensure()) {
        playing = false;
        notify();
        return;
      }
      if (audio.state === 'suspended') audio.resume();
      const now = audio.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.22, now + 1.4);
      clearTimeout(loopTimer);
      scheduleLoop();
      notify();
    }

    function playPreviewOrSynth(token) {
      if (!playing || token !== playToken) return;
      if (!track || trackUnavailable) {
        startSynth();
        return;
      }

      track.src = PREVIEW_SRC;
      track.volume = 0;
      const attempt = track.play();
      if (!attempt || typeof attempt.then !== 'function') {
        trackUnavailable = true;
        startSynth();
        return;
      }

      attempt.then(() => {
        if (!playing || token !== playToken) return;
        fadeTrackTo(TRACK_VOLUME, 1200);
      }).catch(() => {
        if (!playing || token !== playToken) return;
        trackUnavailable = true;
        startSynth();
      });
    }

    function start() {
      if (playing) return true;
      playing = true;
      const token = ++playToken;
      notify();

      if (!track || trackUnavailable) {
        startSynth();
        return playing;
      }

      if (!track.src) track.src = TRACK_SRC;
      track.loop = true;
      track.volume = 0;

      const attempt = track.play();
      if (!attempt || typeof attempt.then !== 'function') {
        trackUnavailable = true;
        startSynth();
        return playing;
      }

      attempt.then(() => {
        if (!playing || token !== playToken) return;
        fadeTrackTo(TRACK_VOLUME, 1200);
      }).catch(() => {
        if (!playing || token !== playToken) return;
        playPreviewOrSynth(token);
      });

      return playing;
    }

    function stop() {
      if (!playing) return;
      playing = false;
      const token = ++playToken;

      if (track) {
        fadeTrackTo(0, 380);
        setTimeout(() => {
          if (!playing && token === playToken) track.pause();
        }, 400);
      }

      clearTimeout(loopTimer);
      if (audio) {
        const now = audio.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      }
      notify();
    }

    function toggle() {
      if (playing) {
        stop();
      } else {
        start();
      }
      return playing;
    }

    function chime() {
      if (!ensure()) return;
      if (audio.state === 'suspended') audio.resume();
      const notes = ['C6', 'E6', 'G6', 'C7'];
      const now = audio.currentTime + 0.02;
      notes.forEach((name, index) => {
        const at = now + index * 0.075;
        const f = freq(name);
        const gain = audio.createGain();
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.1, at + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.75);
        const osc = audio.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.connect(gain);
        gain.connect(fxBus);
        gain.connect(delaySend);
        osc.start(at);
        osc.stop(at + 0.85);
      });
    }

    function setOnStateChange(fn) { onStateChange = fn; }
    function isPlaying() { return playing; }

    return { start, stop, toggle, chime, isPlaying, setOnStateChange };
  })();

  /* =======================================================
     Elements
     ======================================================= */
  const gate = $('#gate');
  const gateHint = $('#gateHint');
  const openBtn = $('#openBtn');
  const openEmoji = $('#openEmoji');
  const openLabel = $('#openLabel');
  const progressDots = $$('#gateProgress span');
  const candleEls = $$('.candle');
  const tuneBtn = $('#tuneBtn');
  const tuneLabel = $('.tune__label', tuneBtn);
  const menuBtn = $('#menuBtn');
  const nav = $('#primaryNav');
  const siteHead = $('#siteHead');
  const navLinks = $$('.nav__link');
  const toastBtn = $('#toastBtn');
  const toastNote = $('#toastNote');
  const sealBtn = $('#sealBtn');
  const wishWall = $('#wishWall');

  let blown = 0;
  let gateOpened = false;

  /* =======================================================
     Gate: candles
     ======================================================= */
  function updateGate() {
    const remaining = candleEls.length - blown;
    progressDots.forEach((dot, index) => dot.classList.toggle('is-done', index < blown));
    if (openBtn) openBtn.disabled = remaining > 0;

    if (remaining === 0) {
      if (openLabel) openLabel.textContent = 'Buka Kado untuk Cika';
      if (openEmoji) openEmoji.textContent = '🎁';
      gateHint.innerHTML = '<span aria-hidden="true">✦</span> Semua lilin sudah ditiup — kado siap dibuka!';
      gateHint.classList.add('is-done');
    } else {
      if (openLabel) openLabel.textContent = 'Tiup semua lilin untuk membuka';
      if (openEmoji) openEmoji.textContent = '🕯️';
      gateHint.innerHTML =
        '<span aria-hidden="true">✧</span> Klik tiap lilin untuk meniupnya ' +
        '<span class="gate__remaining">(tersisa: <b>' + remaining + '</b> lilin)</span>';
      gateHint.classList.remove('is-done');
    }
  }

  function blowCandle(candle) {
    if (!candle || candle.classList.contains('is-out') || gateOpened) return;
    candle.classList.add('is-out');
    candle.setAttribute('aria-pressed', 'true');
    blown += 1;
    updateGate();

    const rect = candle.getBoundingClientRect();
    Effects.burst(rect.left + rect.width / 2, rect.top + 16, {
      count: 9,
      power: 0.55,
      spread: 0.8,
      heartChance: 0.35
    });

    if (blown === candleEls.length) {
      setTimeout(() => {
        if (gateOpened) return;
        Effects.burst(window.innerWidth / 2, window.innerHeight * 0.34, {
          count: 34,
          power: 0.95,
          spread: 1.1,
          heartChance: 0.45
        });
        openBtn.focus({ preventScroll: true });
      }, 260);
    }
  }

  candleEls.forEach((candle) => {
    candle.addEventListener('click', () => blowCandle(candle));
  });

  updateGate();

  /* =======================================================
     Gate: open the gift
     ======================================================= */
  const inertTargets = [$('#siteHead'), $('#main'), $('.footer')].filter(Boolean);
  inertTargets.forEach((el) => { el.inert = true; });

  function openGift() {
    if (gateOpened || blown < candleEls.length) return;
    gateOpened = true;

    document.body.classList.remove('is-locked');
    gate.classList.add('is-opening');
    gate.setAttribute('aria-hidden', 'true');
    inertTargets.forEach((el) => { el.inert = false; });

    window.scrollTo(0, 0);
    Effects.celebrate();
    Music.start();

    setTimeout(() => {
      gate.style.display = 'none';
      const main = $('#main');
      if (main) main.focus({ preventScroll: true });
    }, 1000);
  }

  if (openBtn) openBtn.addEventListener('click', openGift);

  /* =======================================================
     Header, nav, scrollspy
     ======================================================= */
  function closeMenu() {
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Buka menu');
  }

  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (nav.classList.contains('is-open') && !event.target.closest('.site-head')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const sections = ['story', 'gallery', 'letter', 'wishes']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateScrollUI() {
    const y = window.scrollY;
    siteHead.classList.toggle('is-stuck', y > 22);

    const probe = y + 160;
    let current = sections[0] ? sections[0].id : 'story';
    sections.forEach((section) => {
      if (section.offsetTop <= probe) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollUI();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateScrollUI();

  /* =======================================================
     Music button
     ======================================================= */
  function syncTuneUI(isPlaying) {
    const playing = typeof isPlaying === 'boolean' ? isPlaying : Music.isPlaying();
    tuneBtn.classList.toggle('is-playing', playing);
    tuneBtn.setAttribute('aria-pressed', String(playing));
    tuneBtn.setAttribute('aria-label', playing ? 'Jeda Monokrom — Tulus' : 'Putar Monokrom — Tulus');
    tuneBtn.title = 'Monokrom — Tulus';
    tuneLabel.textContent = playing ? 'Pause Tune' : 'Play Tune';
  }

  Music.setOnStateChange(syncTuneUI);

  tuneBtn.addEventListener('click', () => {
    const nowPlaying = Music.toggle();
    syncTuneUI(nowPlaying);
  });

  /* =======================================================
     Reveal on scroll
     ======================================================= */
  $$('.hero__copy .reveal').forEach((el, index) => {
    el.style.setProperty('--delay', (index * 100) + 'ms');
  });
  $$('.hero__photo.reveal').forEach((el) => el.style.setProperty('--delay', '260ms'));
  $$('.collage .reveal').forEach((el, index) => {
    el.style.setProperty('--delay', (index * 80) + 'ms');
  });
  $$('.letter .section-head.reveal').forEach((el) => el.style.setProperty('--delay', '0ms'));
  $$('.envelope.reveal').forEach((el) => el.style.setProperty('--delay', '120ms'));

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* =======================================================
     Toast
     ======================================================= */
  const toastMessages = [
    'To Chapter 21 — may it be your softest, brightest year yet. 🥂',
    'Clink! To the girl who makes ordinary days feel like golden hour. ✨',
    'May 21 bring you everything you have been quietly wishing for. 🤍',
    'A toast to Cika: more laughter, less worry, and dreams that finally say yes. 💫'
  ];
  let toastIndex = 0;
  let toastTimer = null;

  toastBtn.addEventListener('click', () => {
    toastNote.textContent = toastMessages[toastIndex % toastMessages.length];
    toastIndex += 1;
    toastNote.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastNote.classList.remove('is-visible'), 5500);

    const rect = toastBtn.getBoundingClientRect();
    Effects.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      count: 42,
      power: 1.15,
      spread: 1.2,
      heartChance: 0.45
    });
    Music.chime();
  });

  /* =======================================================
     Seal
     ======================================================= */
  sealBtn.addEventListener('click', () => {
    sealBtn.classList.remove('is-pulsed');
    void sealBtn.offsetWidth;
    sealBtn.classList.add('is-pulsed');

    const rect = sealBtn.getBoundingClientRect();
    Effects.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      count: 28,
      power: 0.95,
      spread: 1.15,
      heartChance: 0.75
    });
    Music.chime();
  });

  /* =======================================================
     Wish jar
     ======================================================= */
  const seedWishes = [
    {
      name: 'Dinaaaa',
      message: 'Semoga di umur 21 ini, semua doa yang ang simpan diam-diam mulai satu per satu jadi nyata. 🤍',
      date: '2026-11-08T09:00:00.000Z'
    },
    {
      name: 'Calon S.kom',
      message: 'makasi yo ka, ang alah jadi manusia yang hebat karena alah kuat malawan badai ang salamo ko, semoga hal itu dak pernah menghilangkan senyum ang.',
      date: '2026-11-08T10:30:00.000Z'
    },
    {
      name: 'olipiyuu',
      message: 'Walaupun wak jarang komunikasi, den harap ang dak pernah cangguang samo den.',
      date: '2026-11-08T12:15:00.000Z'
    }
  ];

  function formatWishDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const wishes = seedWishes;

  function renderWishes() {
    wishWall.innerHTML = '';
    wishes.slice(0, 12).forEach((wish) => {
      const card = document.createElement('article');
      card.className = 'wish';

      const message = document.createElement('p');
      message.className = 'wish__msg';
      message.textContent = wish.message;

      const foot = document.createElement('footer');
      foot.className = 'wish__foot';

      const name = document.createElement('span');
      name.className = 'wish__name';
      name.textContent = '— ' + wish.name;

      const date = document.createElement('time');
      date.className = 'wish__date';
      date.dateTime = wish.date;
      date.textContent = formatWishDate(wish.date);

      foot.append(name, date);
      card.append(message, foot);
      wishWall.appendChild(card);
    });
  }

  renderWishes();

  /* =======================================================
     Small niceties
     ======================================================= */
  // Pause the tune when the tab is hidden, then resume only if it was playing.
  let resumeTune = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resumeTune = Music.isPlaying();
      if (resumeTune) {
        Music.stop();
        syncTuneUI(false);
      }
    } else if (resumeTune) {
      resumeTune = false;
      Music.start();
      syncTuneUI(true);
    }
  });

})();
