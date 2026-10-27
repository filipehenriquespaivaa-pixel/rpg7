/**
 * noise.js - Geração de Ruído Simplex e Fractal Brownian Motion (FBM)
 * Namespace: window.Game.Noise e window.Game.SimplexNoise
 */
window.Game = window.Game || {};

(function (G) {
  'use strict';

  class SimplexNoise {
    constructor(seed = 1337) {
      this.p = new Uint8Array(256);
      this.perm = new Uint8Array(512);
      this.permMod12 = new Uint8Array(512);
      this.seed(seed);
    }

    seed(sVal) {
      let s = (Math.abs(sVal) % 2147483647) || 1;
      for (let i = 0; i < 256; i++) this.p[i] = i;
      for (let i = 255; i > 0; i--) {
        s = (s * 16807) % 2147483647;
        const j = s % (i + 1);
        const tmp = this.p[i];
        this.p[i] = this.p[j];
        this.p[j] = tmp;
      }
      for (let i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
        this.permMod12[i] = this.perm[i] % 12;
      }
    }

    noise2D(xin, yin) {
      const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
      const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
      const grad3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
      ];

      const s = (xin + yin) * F2;
      const i = Math.floor(xin + s);
      const j = Math.floor(yin + s);
      const t = (i + j) * G2;
      const X0 = i - t;
      const Y0 = j - t;
      const x0 = xin - X0;
      const y0 = yin - Y0;

      let i1 = x0 > y0 ? 1 : 0;
      let j1 = x0 > y0 ? 0 : 1;

      const x1 = x0 - i1 + G2;
      const y1 = y0 - j1 + G2;
      const x2 = x0 - 1.0 + 2.0 * G2;
      const y2 = y0 - 1.0 + 2.0 * G2;

      const ii = i & 255;
      const jj = j & 255;
      const gi0 = this.permMod12[ii + this.perm[jj]];
      const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
      const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];

      let n0 = 0, n1 = 0, n2 = 0;

      let t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 >= 0) {
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0);
      }

      let t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 >= 0) {
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1);
      }

      let t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 >= 0) {
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2);
      }

      return 70.0 * (n0 + n1 + n2);
    }

    fbm2D(x, y, octaves = 4, lacunarity = 2.0, gain = 0.5) {
      let total = 0;
      let freq = 1;
      let amp = 1;
      let maxAmp = 0;
      for (let i = 0; i < octaves; i++) {
        total += this.noise2D(x * freq, y * freq) * amp;
        maxAmp += amp;
        freq *= lacunarity;
        amp *= gain;
      }
      return total / maxAmp;
    }
  }

  G.SimplexNoise = SimplexNoise;
  G.Noise = SimplexNoise;
})(window.Game);
