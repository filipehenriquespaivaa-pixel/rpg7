/* js/engine/audio.js
 * Audio sintetico (classe AudioManager) e instancia hi.
 * Trecho de legacy/app.original.js (linhas 23192-24030); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  class AudioManager {
    constructor() {
      ((this.ctx = null),
        (this.enabled = !1),
        (this.ambientGain = null),
        (this.ambientSource = null));
    }
    initContext() {
      if (!this.ctx) {
        const t = window.AudioContext || window.webkitAudioContext;
        this.ctx = new t();
      }
      this.ctx.state === "suspended" && this.ctx.resume();
    }
    setEnabled(t) {
      ((this.enabled = t),
        t
          ? (this.initContext(), this.startAmbientSound())
          : this.stopAmbientSound());
    }
    isEnabled() {
      return this.enabled;
    }
    playFootstep(t = !1) {
      if (!(!this.enabled || !this.ctx))
        try {
          const l = this.ctx,
            o = l.currentTime,
            u = l.createOscillator(),
            m = l.createGain();
          t
            ? ((u.type = "sine"),
              u.frequency.setValueAtTime(320, o),
              u.frequency.exponentialRampToValueAtTime(140, o + 0.08),
              m.gain.setValueAtTime(0.08, o),
              m.gain.exponentialRampToValueAtTime(0.001, o + 0.08),
              u.connect(m),
              m.connect(l.destination),
              u.start(o),
              u.stop(o + 0.08))
            : ((u.type = "triangle"),
              u.frequency.setValueAtTime(120, o),
              u.frequency.exponentialRampToValueAtTime(45, o + 0.05),
              m.gain.setValueAtTime(0.05, o),
              m.gain.exponentialRampToValueAtTime(0.001, o + 0.05),
              u.connect(m),
              m.connect(l.destination),
              u.start(o),
              u.stop(o + 0.05));
        } catch {}
    }
    playExhaustedSigh() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "sine"),
            o.frequency.setValueAtTime(180, l),
            o.frequency.exponentialRampToValueAtTime(80, l + 0.35),
            u.gain.setValueAtTime(0.06, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.35),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.35));
        } catch {}
    }
    playChestChime() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx;
          [261.63, 329.63, 392, 523.25, 659.25].forEach((o, u) => {
            const m = t.currentTime + u * 0.09,
              c = t.createOscillator(),
              f = t.createGain();
            ((c.type = "triangle"),
              c.frequency.setValueAtTime(o, m),
              f.gain.setValueAtTime(0.12, m),
              f.gain.exponentialRampToValueAtTime(0.001, m + 0.25),
              c.connect(f),
              f.connect(t.destination),
              c.start(m),
              c.stop(m + 0.25));
          });
        } catch {}
    }
    playShrineActivation() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime;
          [440, 554.37, 659.25, 880].forEach((u) => {
            const m = t.createOscillator(),
              c = t.createGain();
            ((m.type = "sine"),
              m.frequency.setValueAtTime(u, l),
              m.frequency.linearRampToValueAtTime(u * 1.05, l + 1.2),
              c.gain.setValueAtTime(0.08, l),
              c.gain.exponentialRampToValueAtTime(0.001, l + 1.4),
              m.connect(c),
              c.connect(t.destination),
              m.start(l),
              m.stop(l + 1.4));
          });
        } catch {}
    }
    playCaveEnter() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "sawtooth"),
            o.frequency.setValueAtTime(110, l),
            o.frequency.exponentialRampToValueAtTime(45, l + 0.8));
          const m = t.createBiquadFilter();
          ((m.type = "lowpass"),
            m.frequency.setValueAtTime(220, l),
            m.frequency.exponentialRampToValueAtTime(80, l + 0.8),
            u.gain.setValueAtTime(0.18, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.9),
            o.connect(m),
            m.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.9));
          const c = t.createOscillator(),
            f = t.createGain();
          ((c.type = "sine"),
            c.frequency.setValueAtTime(329.63, l + 0.2),
            c.frequency.exponentialRampToValueAtTime(164.81, l + 1.2),
            f.gain.setValueAtTime(0.1, l + 0.2),
            f.gain.exponentialRampToValueAtTime(0.001, l + 1.2),
            c.connect(f),
            f.connect(t.destination),
            c.start(l + 0.2),
            c.stop(l + 1.2));
        } catch {}
    }
    playCaveExit() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx;
          [220, 277.18, 329.63, 440, 554.37].forEach((o, u) => {
            const m = t.currentTime + u * 0.08,
              c = t.createOscillator(),
              f = t.createGain();
            ((c.type = "sine"),
              c.frequency.setValueAtTime(o, m),
              f.gain.setValueAtTime(0.1, m),
              f.gain.exponentialRampToValueAtTime(0.001, m + 0.4),
              c.connect(f),
              f.connect(t.destination),
              c.start(m),
              c.stop(m + 0.4));
          });
        } catch {}
    }
    playMineCrystal() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx;
          [880, 1174.66, 1396.91, 1760].forEach((o, u) => {
            const m = t.currentTime + u * 0.06,
              c = t.createOscillator(),
              f = t.createGain();
            ((c.type = "triangle"),
              c.frequency.setValueAtTime(o, m),
              f.gain.setValueAtTime(0.12, m),
              f.gain.exponentialRampToValueAtTime(0.001, m + 0.3),
              c.connect(f),
              f.connect(t.destination),
              c.start(m),
              c.stop(m + 0.3));
          });
        } catch {}
    }
    playWhipCrack() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain(),
            m = t.createBiquadFilter();
          // assobio da tira cortando o ar
          ((o.type = "sawtooth"),
            o.frequency.setValueAtTime(380, l),
            o.frequency.exponentialRampToValueAtTime(1500, l + 0.2),
            (m.type = "bandpass"),
            m.frequency.setValueAtTime(1100, l),
            m.frequency.exponentialRampToValueAtTime(2600, l + 0.2),
            m.Q.setValueAtTime(2.2, l),
            u.gain.setValueAtTime(0.0001, l),
            u.gain.linearRampToValueAtTime(0.09, l + 0.1),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.22),
            o.connect(m),
            m.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.22));
          // estalo seco quando a ponta se estica (~68% do golpe)
          const c = l + 0.26,
            f = Math.floor(t.sampleRate * 0.07),
            g = t.createBuffer(1, f, t.sampleRate),
            y = g.getChannelData(0);
          for (let w = 0; w < f; w++) y[w] = (Math.random() * 2 - 1) * Math.pow(1 - w / f, 3);
          const v = t.createBufferSource(),
            T = t.createBiquadFilter(),
            S = t.createGain();
          ((v.buffer = g),
            (T.type = "highpass"),
            T.frequency.setValueAtTime(1800, c),
            S.gain.setValueAtTime(0.34, c),
            S.gain.exponentialRampToValueAtTime(0.001, c + 0.07),
            v.connect(T),
            T.connect(S),
            S.connect(t.destination),
            v.start(c));
        } catch {}
    }
    playSwordSlash() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "sawtooth"),
            o.frequency.setValueAtTime(580, l),
            o.frequency.exponentialRampToValueAtTime(70, l + 0.13));
          const m = t.createBiquadFilter();
          ((m.type = "bandpass"),
            m.frequency.setValueAtTime(1400, l),
            m.frequency.exponentialRampToValueAtTime(260, l + 0.13),
            m.Q.setValueAtTime(3.2, l),
            u.gain.setValueAtTime(0.2, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.13),
            o.connect(m),
            m.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.13));
        } catch {}
    }
    playSpearThrust() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(750, l),
            o.frequency.exponentialRampToValueAtTime(110, l + 0.11));
          const m = t.createBiquadFilter();
          ((m.type = "bandpass"),
            m.frequency.setValueAtTime(2400, l),
            m.frequency.exponentialRampToValueAtTime(320, l + 0.11),
            m.Q.setValueAtTime(4.5, l),
            u.gain.setValueAtTime(0.26, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.11),
            o.connect(m),
            m.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.11));
          const c = t.createOscillator(),
            f = t.createGain();
          ((c.type = "sine"),
            c.frequency.setValueAtTime(1200, l),
            c.frequency.exponentialRampToValueAtTime(280, l + 0.08),
            f.gain.setValueAtTime(0.12, l),
            f.gain.exponentialRampToValueAtTime(0.001, l + 0.08),
            c.connect(f),
            f.connect(t.destination),
            c.start(l),
            c.stop(l + 0.08));
        } catch {}
    }
    playSpearHit() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "sawtooth"),
            o.frequency.setValueAtTime(360, l),
            o.frequency.exponentialRampToValueAtTime(65, l + 0.09));
          const m = t.createBiquadFilter();
          ((m.type = "lowpass"),
            m.frequency.setValueAtTime(1100, l),
            m.frequency.exponentialRampToValueAtTime(180, l + 0.09),
            u.gain.setValueAtTime(0.28, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.09),
            o.connect(m),
            m.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.09));
          const c = t.createOscillator(),
            f = t.createGain();
          ((c.type = "square"),
            c.frequency.setValueAtTime(600, l),
            c.frequency.exponentialRampToValueAtTime(90, l + 0.06),
            f.gain.setValueAtTime(0.18, l),
            f.gain.exponentialRampToValueAtTime(0.001, l + 0.06),
            c.connect(f),
            f.connect(t.destination),
            c.start(l),
            c.stop(l + 0.06));
        } catch {}
    }
    playPunchWhoosh() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(280, l),
            o.frequency.exponentialRampToValueAtTime(60, l + 0.11));
          const m = t.createBiquadFilter();
          ((m.type = "lowpass"),
            m.frequency.setValueAtTime(800, l),
            m.frequency.exponentialRampToValueAtTime(160, l + 0.11),
            u.gain.setValueAtTime(0.22, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.11),
            o.connect(m),
            m.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.11));
        } catch {}
    }
    playHitImpact() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "square"),
            o.frequency.setValueAtTime(220, l),
            o.frequency.exponentialRampToValueAtTime(45, l + 0.11),
            u.gain.setValueAtTime(0.25, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.11),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.11));
          const m = t.createOscillator(),
            c = t.createGain();
          ((m.type = "triangle"),
            m.frequency.setValueAtTime(840, l),
            m.frequency.exponentialRampToValueAtTime(120, l + 0.08),
            c.gain.setValueAtTime(0.15, l),
            c.gain.exponentialRampToValueAtTime(0.001, l + 0.08),
            m.connect(c),
            c.connect(t.destination),
            m.start(l),
            m.stop(l + 0.08));
        } catch {}
    }
    playPunchImpact() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(180, l),
            o.frequency.exponentialRampToValueAtTime(38, l + 0.13),
            u.gain.setValueAtTime(0.3, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.13),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.13));
        } catch {}
    }
    playPlayerHurt() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "sawtooth"),
            o.frequency.setValueAtTime(140, l),
            o.frequency.exponentialRampToValueAtTime(55, l + 0.16),
            u.gain.setValueAtTime(0.28, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.16),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.16));
        } catch {}
    }
    playPlayerDeath() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx;
          [220, 196, 174.61, 146.83].forEach((o, u) => {
            const m = t.currentTime + u * 0.14,
              c = t.createOscillator(),
              f = t.createGain();
            ((c.type = "sawtooth"),
              c.frequency.setValueAtTime(o, m),
              c.frequency.exponentialRampToValueAtTime(o * 0.7, m + 0.38),
              f.gain.setValueAtTime(0.24, m),
              f.gain.exponentialRampToValueAtTime(0.001, m + 0.38),
              c.connect(f),
              f.connect(t.destination),
              c.start(m),
              c.stop(m + 0.38));
          });
        } catch {}
    }
    playPlayerRespawn() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx;
          [261.63, 329.63, 392, 523.25].forEach((o, u) => {
            const m = t.currentTime + u * 0.08,
              c = t.createOscillator(),
              f = t.createGain();
            ((c.type = "triangle"),
              c.frequency.setValueAtTime(o, m),
              f.gain.setValueAtTime(0.18, m),
              f.gain.exponentialRampToValueAtTime(0.001, m + 0.28),
              c.connect(f),
              f.connect(t.destination),
              c.start(m),
              c.stop(m + 0.28));
          });
        } catch {}
    }
    playMonsterDefeated() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx;
          [392, 523.25, 659.25, 783.99].forEach((o, u) => {
            const m = t.currentTime + u * 0.065,
              c = t.createOscillator(),
              f = t.createGain();
            ((c.type = "triangle"),
              c.frequency.setValueAtTime(o, m),
              f.gain.setValueAtTime(0.14, m),
              f.gain.exponentialRampToValueAtTime(0.001, m + 0.22),
              c.connect(f),
              f.connect(t.destination),
              c.start(m),
              c.stop(m + 0.22));
          });
        } catch {}
    }
    playTorchIgnite() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(140, l),
            o.frequency.linearRampToValueAtTime(280, l + 0.1),
            o.frequency.exponentialRampToValueAtTime(90, l + 0.32),
            u.gain.setValueAtTime(0.08, l),
            u.gain.linearRampToValueAtTime(0.16, l + 0.08),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.32),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.32));
        } catch {}
    }
    playCampfireFeed() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "sawtooth"),
            o.frequency.setValueAtTime(95, l),
            o.frequency.linearRampToValueAtTime(180, l + 0.12),
            o.frequency.exponentialRampToValueAtTime(65, l + 0.45));
          const m = t.createBiquadFilter();
          ((m.type = "lowpass"),
            m.frequency.setValueAtTime(380, l),
            m.frequency.linearRampToValueAtTime(720, l + 0.15),
            m.frequency.exponentialRampToValueAtTime(220, l + 0.45),
            u.gain.setValueAtTime(0.05, l),
            u.gain.linearRampToValueAtTime(0.24, l + 0.1),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.45),
            o.connect(m),
            m.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.45),
            [0.05, 0.12, 0.22, 0.29].forEach((c, f) => {
              const g = t.createOscillator(),
                y = t.createGain();
              ((g.type = "triangle"),
                g.frequency.setValueAtTime(400 + f * 150, l + c),
                g.frequency.exponentialRampToValueAtTime(120, l + c + 0.04),
                y.gain.setValueAtTime(0.12, l + c),
                y.gain.exponentialRampToValueAtTime(0.001, l + c + 0.04),
                g.connect(y),
                y.connect(t.destination),
                g.start(l + c),
                g.stop(l + c + 0.04));
            }));
        } catch {}
    }
    playInventoryOpen() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime;
          [440, 660].forEach((o, u) => {
            const m = t.createOscillator(),
              c = t.createGain();
            ((m.type = "sine"),
              m.frequency.setValueAtTime(o, l + u * 0.05),
              c.gain.setValueAtTime(0.06, l + u * 0.05),
              c.gain.exponentialRampToValueAtTime(0.001, l + u * 0.05 + 0.18),
              m.connect(c),
              c.connect(t.destination),
              m.start(l + u * 0.05),
              m.stop(l + u * 0.05 + 0.18));
          });
        } catch {}
    }
    playInventoryClose() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(320, l),
            o.frequency.exponentialRampToValueAtTime(180, l + 0.12),
            u.gain.setValueAtTime(0.05, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.12),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.12));
        } catch {}
    }
    playEquipItem() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(580, l),
            o.frequency.exponentialRampToValueAtTime(880, l + 0.08),
            u.gain.setValueAtTime(0.09, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.14),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.14));
        } catch {}
    }
    playUnequipItem() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "sine"),
            o.frequency.setValueAtTime(520, l),
            o.frequency.exponentialRampToValueAtTime(320, l + 0.1),
            u.gain.setValueAtTime(0.06, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.1),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.1));
        } catch {}
    }
    playItemPickup() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(587.33, l),
            o.frequency.exponentialRampToValueAtTime(880, l + 0.08),
            u.gain.setValueAtTime(0.12, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.12),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.12));
          const m = t.createOscillator(),
            c = t.createGain();
          ((m.type = "sine"),
            m.frequency.setValueAtTime(1174.66, l + 0.05),
            c.gain.setValueAtTime(0.09, l + 0.05),
            c.gain.exponentialRampToValueAtTime(0.001, l + 0.18),
            m.connect(c),
            c.connect(t.destination),
            m.start(l + 0.05),
            m.stop(l + 0.18));
        } catch {}
    }
    playSlimePickup() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(220, l),
            o.frequency.exponentialRampToValueAtTime(560, l + 0.07),
            o.frequency.exponentialRampToValueAtTime(320, l + 0.14),
            u.gain.setValueAtTime(0.14, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.14),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.14));
          const m = t.createOscillator(),
            c = t.createGain();
          ((m.type = "sine"),
            m.frequency.setValueAtTime(650, l + 0.06),
            m.frequency.exponentialRampToValueAtTime(1046.5, l + 0.16),
            c.gain.setValueAtTime(0.12, l + 0.06),
            c.gain.exponentialRampToValueAtTime(0.001, l + 0.2),
            m.connect(c),
            c.connect(t.destination),
            m.start(l + 0.06),
            m.stop(l + 0.2));
        } catch {}
    }
    playClayHarvest() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(140, l),
            o.frequency.exponentialRampToValueAtTime(380, l + 0.08),
            o.frequency.exponentialRampToValueAtTime(210, l + 0.18),
            u.gain.setValueAtTime(0.16, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.18),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.18));
          const m = t.createOscillator(),
            c = t.createGain();
          ((m.type = "sine"),
            m.frequency.setValueAtTime(587.33, l + 0.05),
            m.frequency.exponentialRampToValueAtTime(880, l + 0.12),
            c.gain.setValueAtTime(0.1, l + 0.05),
            c.gain.exponentialRampToValueAtTime(0.001, l + 0.32),
            m.connect(c),
            c.connect(t.destination),
            m.start(l + 0.05),
            m.stop(l + 0.32));
        } catch {}
    }
    playFusionSuccess() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(180, l),
            o.frequency.exponentialRampToValueAtTime(45, l + 0.15),
            u.gain.setValueAtTime(0.25, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.15),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.15));
          const m = t.createOscillator(),
            c = t.createGain();
          ((m.type = "sine"),
            m.frequency.setValueAtTime(1400, l),
            m.frequency.exponentialRampToValueAtTime(820, l + 0.25),
            c.gain.setValueAtTime(0.18, l),
            c.gain.exponentialRampToValueAtTime(0.001, l + 0.25),
            m.connect(c),
            c.connect(t.destination),
            m.start(l),
            m.stop(l + 0.25),
            [523.25, 659.25, 783.99, 1046.5].forEach((g, y) => {
              const w = l + 0.08 + y * 0.055,
                v = t.createOscillator(),
                T = t.createGain();
              ((v.type = "triangle"),
                v.frequency.setValueAtTime(g, w),
                T.gain.setValueAtTime(0.1, w),
                T.gain.exponentialRampToValueAtTime(0.001, w + 0.28),
                v.connect(T),
                T.connect(t.destination),
                v.start(w),
                v.stop(w + 0.28));
            }));
        } catch {}
    }
    playFusionFail() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "sawtooth"),
            o.frequency.setValueAtTime(140, l),
            o.frequency.linearRampToValueAtTime(80, l + 0.15),
            u.gain.setValueAtTime(0.1, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.15),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.15));
        } catch {}
    }
    playSpearThrow() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "triangle"),
            o.frequency.setValueAtTime(580, l),
            o.frequency.exponentialRampToValueAtTime(140, l + 0.16),
            u.gain.setValueAtTime(0.18, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.16),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.16));
        } catch {}
    }
    playWaterSplash() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            o = t.createOscillator(),
            u = t.createGain();
          ((o.type = "sine"),
            o.frequency.setValueAtTime(420, l),
            o.frequency.exponentialRampToValueAtTime(80, l + 0.25),
            u.gain.setValueAtTime(0.22, l),
            u.gain.exponentialRampToValueAtTime(0.001, l + 0.25),
            o.connect(u),
            u.connect(t.destination),
            o.start(l),
            o.stop(l + 0.25));
        } catch {}
    }
    playFishCatch() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime;
          [440, 554, 659, 880].forEach((u, m) => {
            const c = t.createOscillator(),
              f = t.createGain();
            ((c.type = "sine"),
              c.frequency.setValueAtTime(u, l + m * 0.07),
              f.gain.setValueAtTime(0.12, l + m * 0.07),
              f.gain.exponentialRampToValueAtTime(0.001, l + m * 0.07 + 0.18),
              c.connect(f),
              f.connect(t.destination),
              c.start(l + m * 0.07),
              c.stop(l + m * 0.07 + 0.18));
          });
        } catch {}
    }
    startAmbientSound() {
      if (this.ctx)
        try {
          const t = this.ctx,
            l = t.sampleRate * 2,
            o = t.createBuffer(1, l, t.sampleRate),
            u = o.getChannelData(0);
          let m = 0,
            c = 0,
            f = 0;
          for (let y = 0; y < l; y++) {
            const w = Math.random() * 2 - 1;
            ((m = 0.99886 * m + w * 0.0555179),
              (c = 0.99332 * c + w * 0.0750759),
              (f = 0.969 * f + w * 0.153852),
              (u[y] = (m + c + f) * 0.04));
          }
          ((this.ambientSource = t.createBufferSource()),
            (this.ambientSource.buffer = o),
            (this.ambientSource.loop = !0));
          const g = t.createBiquadFilter();
          ((g.type = "lowpass"),
            g.frequency.setValueAtTime(320, t.currentTime),
            (this.ambientGain = t.createGain()),
            this.ambientGain.gain.setValueAtTime(0.04, t.currentTime),
            this.ambientSource.connect(g),
            g.connect(this.ambientGain),
            this.ambientGain.connect(t.destination),
            this.ambientSource.start());
        } catch {}
    }
    stopAmbientSound() {
      if (this.ambientSource) {
        try {
          (this.ambientSource.stop(), this.ambientSource.disconnect());
        } catch {}
        this.ambientSource = null;
      }
    }
    playThunderClap() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime;
          // 1. Estrondo grave de trovão
          const osc = t.createOscillator(),
            gain = t.createGain();
          ((osc.type = "sawtooth"),
            osc.frequency.setValueAtTime(115, l),
            osc.frequency.exponentialRampToValueAtTime(32, l + 0.85),
            gain.gain.setValueAtTime(0.14, l),
            gain.gain.exponentialRampToValueAtTime(0.001, l + 0.9),
            osc.connect(gain),
            gain.connect(t.destination),
            osc.start(l),
            osc.stop(l + 0.92));

          // 2. Estalo elétrico de relâmpago + reverberação de trovão
          const bufLen = Math.floor(t.sampleRate * 0.95),
            buf = t.createBuffer(1, bufLen, t.sampleRate),
            data = buf.getChannelData(0);
          for (let i = 0; i < bufLen; i++) {
            const env = Math.pow(1 - i / bufLen, 1.5);
            data[i] = (Math.random() * 2 - 1) * env;
          }
          const noise = t.createBufferSource();
          noise.buffer = buf;
          const filter = t.createBiquadFilter();
          ((filter.type = "lowpass"),
            filter.frequency.setValueAtTime(680, l),
            filter.frequency.exponentialRampToValueAtTime(120, l + 0.9));
          const nGain = t.createGain();
          (nGain.gain.setValueAtTime(0.18, l),
            nGain.gain.exponentialRampToValueAtTime(0.001, l + 0.92),
            noise.connect(filter),
            filter.connect(nGain),
            nGain.connect(t.destination),
            noise.start(l));
        } catch {}
    }
    playWoodChop() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime,
            osc = t.createOscillator(),
            gain = t.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(180, l);
          osc.frequency.exponentialRampToValueAtTime(55, l + 0.08);
          gain.gain.setValueAtTime(0.2, l);
          gain.gain.exponentialRampToValueAtTime(0.001, l + 0.09);
          osc.connect(gain);
          gain.connect(t.destination);
          osc.start(l);
          osc.stop(l + 0.09);
        } catch {}
    }
    playTreeFall() {
      if (!(!this.enabled || !this.ctx))
        try {
          const t = this.ctx,
            l = t.currentTime;
          [130, 95, 70, 45].forEach((freq, idx) => {
            const t0 = l + idx * 0.07,
              osc = t.createOscillator(),
              gain = t.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, t0);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t0 + 0.22);
            gain.gain.setValueAtTime(0.16, t0);
            gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.25);
            osc.connect(gain);
            gain.connect(t.destination);
            osc.start(t0);
            osc.stop(t0 + 0.25);
          });
        } catch {}
    }
  }
  const hi = new AudioManager();
  window.AudioManager = AudioManager;
  window.hi = hi;
  window.Game = window.Game || {};
  window.Game.AudioManager = AudioManager;
  window.Game.audio = hi;
