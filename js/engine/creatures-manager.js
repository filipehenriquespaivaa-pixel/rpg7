/* js/engine/creatures-manager.js
 * Gerenciador de criaturas/entidades (CreatureManager): monstros, carcacas, itens no chao, projeteis.
 * Trecho de legacy/app.original.js (linhas 30087-32456); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  class CreatureManager {
    constructor(t, l) {
      ((this.monsters = []),
        (this.carcasses = []),
        (this.droppedItems = []),
        (this.floatingTexts = []),
        (this.slashEffects = []),
        (this.pebbleProjectiles = []),
        (this.hitParticles = []),
        (this.slimeParticles = []),
        (this.spawnCooldown = 0),
        (this.slimeSwarmTimer = 2),
        (this.nextId = 1),
        (this.lastPlayerX = 0),
        (this.lastPlayerY = 0),
        (this.lastIsUnderground = !1),
        (this.hasSpawnedTardigradeQueen = !1),
        (this.animTimer = 0),
        (this.engine = t),
        (this.audio = l));
    }
    setAudio(t) {
      this.audio = t;
    }
    addDamageNumber(x, y, text, color = "#ef4444", isCrit = false, life = 1.0) {
      if (!this.floatingTexts) this.floatingTexts = [];
      this.floatingTexts.push({
        id: `dmg_${this.nextId++}`,
        x: x,
        y: y,
        text: String(text),
        color: color || "#ef4444",
        isCrit: !!isCrit,
        life: typeof life === "number" ? life : 1.0,
      });
    }
    addFloatingText(x, y, text, color = "#ffffff", isCrit = false, life = 1.0) {
      this.addDamageNumber(x, y, text, color, isCrit, life);
    }
    getMonsterFacing(t, l, o = "down") {
      const u = Math.abs(t),
        m = Math.abs(l);
      return u < 0.04 && m < 0.04
        ? o
        : m > u * (o === "up" || o === "down" ? 0.82 : 1.22)
          ? l > 0
            ? "down"
            : "up"
          : t >= 0
            ? "right"
            : "left";
    }
    getMonsterFacingToTarget(t, l, o, u, m = "down") {
      const c = o - t,
        f = u - l;
      return Math.abs(c) < 1 && Math.abs(f) < 1
        ? m
        : Math.abs(f) > Math.abs(c)
          ? f > 0
            ? "down"
            : "up"
          : c >= 0
            ? "right"
            : "left";
    }
    scareMonstersNearFire(t, l, o) {
      for (const u of this.monsters) {
        if (!gl(u.type) || u.hp <= 0) continue;
        if (Math.hypot(u.x - t, u.y - l) < o * 1.3) {
          ((u.fleeFireTimer = 3.8),
            (u.giveUpPursuitTimer = 8),
            (u.attackCooldown = 3.5),
            u.isLeaping && (u.isLeaping = !1),
            u.attached && (u.attached = !1));
          const c = Math.atan2(u.y - l, u.x - t) || Math.random() * Math.PI * 2;
          u.targetAngle = c;
          const f = u.speed * 1.55;
          ((u.vx = Math.cos(c) * f),
            (u.vy = Math.sin(c) * f),
            (u.facing = this.getMonsterFacing(u.vx, u.vy, u.facing)),
            (!u.fireFearTimer || u.fireFearTimer <= 0) &&
              (u.fireFearTimer = 2.5));
        }
      }
    }
    getAnimalFireDeterrence(t, l) {
      if (
        this.engine &&
        typeof this.engine.isCabinWallBetween === "function" &&
        this.engine.isCabinWallBetween(t.x, t.y, l.x, l.y)
      ) {
        return {
          isDeterred: !1,
          canAttack: !1,
          blockedByCabin: !0,
          fireSourceX: l.x,
          fireSourceY: l.y,
        };
      }
      if (!gl(t.type))
        return {
          isDeterred: !1,
          canAttack: !0,
          fireSourceX: l.x,
          fireSourceY: l.y,
        };
      const o = Math.hypot(l.x - t.x, l.y - t.y);
      if (l.hasTorch && o < 58 && !l.isDead)
        return {
          isDeterred: !0,
          canAttack: !1,
          fireSourceX: l.x,
          fireSourceY: l.y,
        };
      const u = this.engine.getClosestLitCampfire(t.x, t.y, 650);
      if (u) {
        const m = Math.hypot(t.x - u.fireX, t.y - u.fireY),
          c = Math.hypot(l.x - u.fireX, l.y - u.fireY),
          f = u.lightRadius * 0.5;
        if (m < f)
          return {
            isDeterred: !0,
            canAttack: !1,
            fireSourceX: u.fireX,
            fireSourceY: u.fireY,
          };
        if (!l.isDead && c < f)
          return {
            isDeterred: m < f + 24 || o < 50,
            canAttack: !1,
            fireSourceX: u.fireX,
            fireSourceY: u.fireY,
          };
      }
      return {
        isDeterred: !1,
        canAttack: !0,
        fireSourceX: l.x,
        fireSourceY: l.y,
      };
    }
    isPathClear(x, y, ang, dist) {
      const e = this.engine,
        ux = Math.cos(ang),
        uy = Math.sin(ang);
      for (const k of [0.35, 0.7, 1.0]) {
        const qx = x + ux * dist * k,
          qy = y + uy * dist * k;
        const tx = Math.floor(qx / e.tileSize);
        const ty = Math.floor(qy / e.tileSize);
        if (
          !e.isTileCreaturePassable(tx, ty) ||
          (e.isCabinWallBlockedAt && e.isCabinWallBlockedAt(qx, qy)) ||
          e.isCaveRockAt(qx, qy) ||
          e.isCliffDarkWallAt(qx, qy) ||
          e.isTrunkAt(qx, qy)
        ) {
          return !1;
        }
      }
      return !0;
    }
    steerAroundObstacles(p, targetX, targetY, speed, isPrey = !1) {
      const baseAngle = isPrey
        ? Math.atan2(p.y - targetY, p.x - targetX)
        : Math.atan2(targetY - p.y, targetX - p.x);
      const probeDist = Math.max(20, speed * 60 * 0.45);
      if (this.isPathClear(p.x, p.y, baseAngle, probeDist)) {
        p.contourTimer = 0;
        return baseAngle;
      }
      if (!p.contourSide || (p.contourTimer || 0) <= 0) {
        let chosenSide = 1;
        for (const angleOff of [0.55, 0.95, 1.35]) {
          const clearPos = this.isPathClear(p.x, p.y, baseAngle + angleOff, probeDist);
          const clearNeg = this.isPathClear(p.x, p.y, baseAngle - angleOff, probeDist);
          if (clearPos && !clearNeg) { chosenSide = 1; break; }
          if (clearNeg && !clearPos) { chosenSide = -1; break; }
        }
        p.contourSide = chosenSide;
        p.contourTimer = 0.8 + Math.random() * 0.4;
      }
      const primarySide = p.contourSide || 1;
      const angleOffsets = [0.38, 0.75, 1.1, 1.48, 1.85, 2.2];
      for (const off of angleOffsets) {
        const a1 = baseAngle + off * primarySide;
        if (this.isPathClear(p.x, p.y, a1, probeDist)) return a1;
        const a2 = baseAngle - off * primarySide;
        if (this.isPathClear(p.x, p.y, a2, probeDist)) {
          p.contourSide = -primarySide;
          return a2;
        }
      }
      return baseAngle + Math.PI * 0.5 * primarySide;
    }
    isFleePathFree(p, ang, dist) {
      const e = this.engine,
        ux = Math.cos(ang),
        uy = Math.sin(ang);
      for (const k of [0.34, 0.67, 1]) {
        const qx = p.x + ux * dist * k,
          qy = p.y + uy * dist * k;
        if (
          !e.isTileCreaturePassable(
            Math.floor(qx / e.tileSize),
            Math.floor(qy / e.tileSize),
          ) ||
          (e.isCabinWallBlockedAt && e.isCabinWallBlockedAt(qx, qy)) ||
          e.isCaveRockAt(qx, qy) ||
          e.isCliffDarkWallAt(qx, qy) ||
          e.isTrunkAt(qx, qy)
        )
          return !1;
      }
      return !0;
    }
    pickFleeAngle(p, fx, fy, t, speed) {
      p.fleeDirTimer = (p.fleeDirTimer || 0) - t;
      const dist = Math.max(20, speed * 60 * 0.4);
      if (
        p.fleeDirTimer > 0 &&
        p.fleeDir !== void 0 &&
        this.isFleePathFree(p, p.fleeDir, dist)
      )
        return p.fleeDir;
      const base =
        Math.atan2(p.y - fy, p.x - fx) || Math.random() * Math.PI * 2;
      p.fleeSide || (p.fleeSide = Math.random() < 0.5 ? 1 : -1);
      let best = base,
        found = !1;
      for (const off of [0, 0.5, 1, 1.5, 2.2]) {
        for (const sg of off === 0 ? [1] : [p.fleeSide, -p.fleeSide]) {
          const a = base + off * sg;
          if (this.isFleePathFree(p, a, dist)) {
            ((best = a), (found = !0));
            break;
          }
        }
        if (found) break;
      }
      ((p.fleeDir = best),
        (p.fleeDirTimer = found ? 0.8 + Math.random() * 0.4 : 0.15));
      return best;
    }
    avoidFireZone(p, fire, zone) {
      const sp = Math.hypot(p.vx, p.vy);
      if (sp < 0.01) return;
      const look = Math.max(24, sp * 60 * 0.9),
        lim = zone * 1.25,
        outside = (a) =>
          Math.hypot(
            p.x + Math.cos(a) * look - fire.fireX,
            p.y + Math.sin(a) * look - fire.fireY,
          ) >= lim;
      if (outside(Math.atan2(p.vy, p.vx))) return;
      const base = Math.atan2(p.y - fire.fireY, p.x - fire.fireX);
      p.fireSide || (p.fireSide = Math.random() < 0.5 ? 1 : -1);
      for (const off of [0.9, 1.3, 0.5, 1.7, 0.2])
        for (const sg of [p.fireSide, -p.fireSide]) {
          const a = base + off * sg;
          if (outside(a) && this.isFleePathFree(p, a, look)) {
            ((p.vx = Math.cos(a) * sp),
              (p.vy = Math.sin(a) * sp),
              (p.targetAngle = a),
              (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)));
            return;
          }
        }
    }
    steerAnimalExploration(t, l, o, u, m) {
      if (
        ((t.exploreTimer = (t.exploreTimer || 0) - l),
        !t.exploreTimer || t.exploreTimer <= 0)
      ) {
        t.exploreTimer = 1.8 + Math.random() * 2.2;
        let f = Math.random() * Math.PI * 2;
        if (o) {
          const g = Math.hypot(t.x - o.fireX, t.y - o.fireY),
            y = o.lightRadius * 0.5;
          if (g < y * 1.5) {
            const w = Math.atan2(t.y - o.fireY, t.x - o.fireX),
              v = (Math.random() < 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.8);
            f = w + v;
          }
        }
        (t.type === "slime" &&
          u &&
          !t.isUnderground &&
          ((!t.shelterCooldown || t.shelterCooldown <= 0) &&
            ((t.shelterCooldown = 2 + Math.random() * 1.5),
            (t.shelterTarget = this.findNearestShelter(
              t.x,
              t.y,
              m,
              t.isUnderground,
            ))),
          t.shelterTarget &&
            Math.random() < 0.75 &&
            (f = Math.atan2(t.shelterTarget.y - t.y, t.shelterTarget.x - t.x))),
          (t.targetAngle = f));
      }
      const c =
        t.type === "slime" && t.inWater ? t.speed * 0.85 : t.speed * 0.7;
      ((t.vx = Math.cos(t.targetAngle || 0) * c),
        (t.vy = Math.sin(t.targetAngle || 0) * c),
        (t.facing = this.getMonsterFacing(t.vx, t.vy, t.facing)));
    }
    updatePreyAI(t, l, o) {
      const ai = creatureBehavior(t.type).preyAI;
      t.alertEffectTimer && t.alertEffectTimer > 0 && (t.alertEffectTimer -= l);
      const visMult =
        !t.isUnderground &&
        typeof window !== "undefined" &&
        window.weatherSystem &&
        typeof window.weatherSystem.getEffectiveVisibilityMultiplier === "function"
          ? window.weatherSystem.getEffectiveVisibilityMultiplier(!1)
          : 1.0;
      const c = ai.alertRadius * visMult,
        f = ai.wolfRadius * visMult,
        g = ai.giveUpRadius * Math.max(0.65, visMult),
        y = Math.hypot(o.x - t.x, o.y - t.y),
        cabinWallBlocksPlayer = !!(
          this.engine &&
          typeof this.engine.isCabinWallBetween === "function" &&
          this.engine.isCabinWallBetween(t.x, t.y, o.x, o.y)
        ),
        w = !o.isDead && y < c && !cabinWallBlocksPlayer;
      let v = null,
        T = f;
      for (const p of this.monsters) {
        if (
          p.id === t.id ||
          !creatureBehavior(p.type).predator ||
          p.hp <= 0 ||
          p.isUnderground !== t.isUnderground
        )
          continue;
        const j = Math.hypot(p.x - t.x, p.y - t.y);
        j < T && ((T = j), (v = p));
      }
      const S = v !== null;
      if (w || S) {
        const p = (t.fleeTimer || 0) > 0;
        ((t.fleeTimer = ai.fleeTimerOnThreat),
          S && v
            ? ((t.lastThreatX = v.x),
              (t.lastThreatY = v.y),
              (t.threatName = creatureBehavior(v.type).threatName))
            : ((t.lastThreatX = o.x),
              (t.lastThreatY = o.y),
              (t.threatName = "jogador")),
          !p &&
            (!t.alertEffectTimer || t.alertEffectTimer <= 0) &&
            (t.alertEffectTimer = 3.5));
      }
      if (t.fleeTimer && t.fleeTimer > 0) {
        t.fleeTimer -= l;
        let p = 0,
          j = 0;
        if (S && v) {
          const V = Math.atan2(t.y - v.y, t.x - v.x),
            O = Math.max(0.5, 1 - T / f) * 2;
          ((p += Math.cos(V) * O), (j += Math.sin(V) * O));
        }
        if (w) {
          const V = Math.atan2(t.y - o.y, t.x - o.x),
            O = Math.max(0.5, 1 - y / c);
          ((p += Math.cos(V) * O), (j += Math.sin(V) * O));
        }
        if (p === 0 && j === 0)
          if (t.lastThreatX !== void 0 && t.lastThreatY !== void 0) {
            const V = Math.atan2(t.y - t.lastThreatY, t.x - t.lastThreatX);
            ((p = Math.cos(V)), (j = Math.sin(V)));
          } else
            ((p = Math.cos(t.targetAngle || 0)),
              (j = Math.sin(t.targetAngle || 0)));
        let P = Math.atan2(j, p);
        const A = ai.fleeProbeDistance,
          x = t.x + Math.cos(P) * A,
          M = t.y + Math.sin(P) * A,
          $ = Math.floor(x / this.engine.tileSize),
          z = Math.floor(M / this.engine.tileSize);
        const isBlocked = (cx, cy) => {
          const tx = Math.floor(cx / this.engine.tileSize),
            ty = Math.floor(cy / this.engine.tileSize);
          return (
            !this.engine.isTileCreaturePassable(tx, ty) ||
            this.engine.isTrunkAt(cx, cy, this.engine.footHX + 1, this.engine.footHY + 1) ||
            this.engine.isCaveRockAt(cx, cy) ||
            this.engine.isCliffDarkWallAt(cx, cy)
          );
        };
        if (isBlocked(x, M)) {
          const V = [0.45, -0.45, 0.9, -0.9, 1.35, -1.35, 1.8, -1.8];
          for (const O of V) {
            const _ = P + O;
            const px = t.x + Math.cos(_) * A;
            const py = t.y + Math.sin(_) * A;
            if (!isBlocked(px, py)) {
              P = _;
              break;
            }
          }
        }
        ai.zigzag && (P += Math.sin(this.animTimer * 12) * 0.28);
        const K = t.speed * ai.fleeSpeedMult;
        ((t.targetAngle = P),
          (t.vx = Math.cos(P) * K),
          (t.vy = Math.sin(P) * K),
          (t.facing = this.getMonsterFacing(t.vx, t.vy, t.facing)),
          t.fleeTimer <= 1 && y >= g && T >= g && (t.fleeTimer = 0));
        return;
      }
      if (((t.fleeTimer = 0), (t.wanderTimer -= l), t.wanderTimer <= 0))
        if (Math.random() < 0.45)
          ((t.wanderTimer = ai.idleWait[0] + Math.random() * ai.idleWait[1]),
            (t.vx = 0),
            (t.vy = 0));
        else {
          ((t.wanderTimer = ai.wanderWait[0] + Math.random() * ai.wanderWait[1]),
            (t.targetAngle = Math.random() * Math.PI * 2));
          const p = t.speed * ai.wanderSpeedMult;
          ((t.vx = Math.cos(t.targetAngle) * p),
            (t.vy = Math.sin(t.targetAngle) * p),
            (t.facing = this.getMonsterFacing(t.vx, t.vy, t.facing)));
        }
    }
    getNearestPreyForWolf(t, l, o, u, hunter = null) {
      let m = null,
        c = o;
      const isTardigrade = hunter && hunter.type === "tardigrade";
      for (const f of this.monsters) {
        if (f.hp <= 0 || f.isUnderground !== u) continue;
        if (isTardigrade) {
          // Tardígrados caçam ativamente escorpiões e aranhas da caverna!
          if ((f.type !== "scorpion" && f.type !== "spider") || f.isGiantScorpion) continue;
        } else {
          if (!isPreyType(f.type)) continue;
        }
        const g = Math.hypot(f.x - t, f.y - l);
        g < c && ((c = g), (m = f));
      }
      return m;
    }
    tardigradeDevourPrey(t, l) {
      const isSpider = l.type === "spider";
      const o = t.attack + (Math.random() * 3 - 1),
        u = Math.max(4, Math.round(o - (l.defense || 2) * 0.4));
      ((l.hp -= u),
        (l.hitFlashTimer = 0.22),
        this.floatingTexts.push({
          id: `dmg_${this.nextId++}`,
          x: l.x,
          y: l.y - 16,
          text: `-${u}`,
          color: "#ef4444",
          isCrit: !1,
          life: 0.8,
        }));
      for (let m = 0; m < 5; m++)
        this.hitParticles.push({
          x: l.x,
          y: l.y,
          vx: (Math.random() - 0.5) * 2.5,
          vy: -Math.random() * 2.5,
          life: 0.4,
          color: isSpider ? "#fbbf24" : "#f59e0b",
          size: 2,
        });
      if (l.hp <= 0) {
        // Devorado por completo pelo disco bucal do tardígrado!
        for (let c = 0; c < 14; c++) {
          const f = Math.random() * Math.PI * 2,
            g = 2 + Math.random() * 3.5;
          this.hitParticles.push({
            x: l.x,
            y: l.y,
            vx: Math.cos(f) * g,
            vy: Math.sin(f) * g,
            life: 0.75,
            color: c % 2 === 0 ? (isSpider ? "#a855f7" : "#f59e0b") : "#4ade80",
            size: 2.6 + Math.random() * 2,
          });
        }
        var audio;
        (audio = this.audio) == null || audio.playSlimePickup?.();
        const healAmt = isSpider ? 18 : 22;
        t.hp = Math.min(t.maxHp, t.hp + healAmt);
        if (t.scale < (t.maxScale || t.scale * 1.25)) {
          t.scale = Math.min((t.maxScale || t.scale * 1.25), Math.round((t.scale + 0.05) * 100) / 100);
        }
        const preyName = isSpider ? "Aranha" : "Escorpião";
        this.floatingTexts.push({
          id: `feed_${this.nextId++}`,
          x: t.x,
          y: t.y - 28,
          text: `🍴 Devorou ${preyName}! (+${healAmt} HP)`,
          color: "#facc15",
          isCrit: !0,
          life: 1.4,
        });
        const m = this.monsters.findIndex((c) => c.id === l.id);
        m >= 0 && this.monsters.splice(m, 1);
      } else {
        // Presa sobrevivente (escorpião ou aranha) entra em pânico e foge em alta velocidade!
        l.fleeTimer = 4.5;
        l.lastThreatX = t.x;
        l.lastThreatY = t.y;
        l.threatName = t.name;
        l.alertEffectTimer = 3.5;
        const fleeAngle = Math.atan2(l.y - t.y, l.x - t.x) || (Math.random() * Math.PI * 2);
        l.targetAngle = fleeAngle;
        const sprintSpeed = l.speed * 1.5;
        l.vx = Math.cos(fleeAngle) * sprintSpeed;
        l.vy = Math.sin(fleeAngle) * sprintSpeed;
        l.facing = this.getMonsterFacing(l.vx, l.vy, l.facing);
      }
    }
    tardigradeDevourScorpion(t, l) {
      this.tardigradeDevourPrey(t, l);
    }
    wolfAttackPrey(t, l) {
      if (t.type === "tardigrade" && (l.type === "scorpion" || l.type === "spider")) {
        this.tardigradeDevourPrey(t, l);
        return;
      }
      const o = t.attack + (Math.random() * 2 - 1),
        u = Math.max(3, Math.round(o - l.defense * 0.4));
      ((l.hp -= u),
        (l.hitFlashTimer = 0.22),
        (l.fleeTimer = creatureBehavior(l.type).wolfHitFleeTimer ?? 3.5),
        (l.lastThreatX = t.x),
        (l.lastThreatY = t.y),
        (l.threatName = creatureBehavior(t.type).threatName),
        this.floatingTexts.push({
          id: `dmg_${this.nextId++}`,
          x: l.x,
          y: l.y - 16,
          text: `-${u}`,
          color: "#ef4444",
          isCrit: !1,
          life: 0.8,
        }));
      for (let m = 0; m < 4; m++)
        this.hitParticles.push({
          x: l.x,
          y: l.y,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2,
          life: 0.4,
          color: "#ef4444",
          size: 2,
        });
      if (l.hp <= 0) {
        for (let c = 0; c < creatureDeathParticles(l.type); c++) {
          const f = Math.random() * Math.PI * 2,
            g = 2 + Math.random() * 3;
          this.hitParticles.push({
            x: l.x,
            y: l.y,
            vx: Math.cos(f) * g,
            vy: Math.sin(f) * g,
            life: 0.75,
            color: l.accentColor,
            size: 2.5 + Math.random() * 2.5,
          });
        }
        this.carcasses.push(this.createCarcassForMonster(l));
        const m = this.monsters.findIndex((c) => c.id === l.id);
        m >= 0 && this.monsters.splice(m, 1);
      }
    }
    createCarcassForMonster(t) {
      const l = t.type === "slime";
      let o = `Corpo de ${t.name}`,
        u = `Corpo de ${t.name}`,
        m = t.isGiantScorpion ? "epico" : "raro",
        c = t.isGiantScorpion ? 160 : 35,
        f = t.isGiantScorpion
          ? "Carcaça colossal de um Escorpião Gigante Noturno do deserto, com carapaça quitinosa espessa e ferrão maciço e esmagador."
          : `Corpo intacto de ${t.name} recolhido após o combate.`;
      return (
        creatureCarcass(t.type)
 ? ((o = creatureCarcass(t.type).name),
 (u = creatureCarcass(t.type).bodyName),
 (f = creatureCarcass(t.type).description),
 creatureCarcass(t.type).rarity && (m = creatureCarcass(t.type).rarity),
 creatureCarcass(t.type).value && (c = creatureCarcass(t.type).value))
              : null,
        t.isQueen &&
          ((o = "Carcaça da Rainha dos Tardígrados"),
          (u = "Corpo da Rainha dos Tardígrados"),
          (m = "lendario"),
          (c = 320),
          (f =
            "Carcaça monumental da Rainha dos Tardígrados das profundezas do deserto. Pode ser destrinchada com uma faca para extrair a rara Geleia Real, Membrana Criptobiótica lendária e micro-garras colossais.")),
        {
          id: `carcass_${this.nextId++}`,
          monsterId: t.id,
          name: o,
          type: t.type,
          x: t.x,
          y: t.y,
          color: t.color,
          accentColor: t.accentColor,
          scale: t.scale,
          isQueen: !!t.isQueen,
          isUnderground: t.isUnderground,
          isSlime: l,
          collected: !1,
          settleProgress: 0,
          lifetime: t.isQueen ? 60 : 20,
          maxLifetime: t.isQueen ? 60 : 20,
          lootItemName: u,
          lootItemIcon: `creature_${t.type}`,
          lootItemColor: t.color,
          lootItemRarity: m,
          lootItemDescription: f,
          lootItemValue: c,
          gold: t.isQueen ? Math.floor(Math.random() * 25) + 35 : Math.floor(Math.random() * 8) + 4,
        }
      );
    }
    monsterAttackPlayer(t, l, o = 2) {
      if (
        l.isDead ||
        (l.invulnerableTimer && l.invulnerableTimer > 0) ||
        !this.getAnimalFireDeterrence(t, l).canAttack
      )
        return;

      const superior = this.getSuperiorPlayerAttacker(t, l);
      if (superior) {
        t.desistedAndLeaving = true;
        t.leavingCombatTimer = 16.0;
        t.giveUpPursuitTimer = 20.0;
        t.fleeFromCombatX = l.x;
        t.fleeFromCombatY = l.y;
        t.aggroTimer = 0;
        t.attackCooldown = 8.0;
        return;
      }

      t.inCombatTimer = 4.0;
      this.dismissInferiorAttackers(t, l);

      if (t.type === "scorpion") {
        t.attackCombo = ((t.attackCombo || 0) % 3) + 1;
        t.attackTargetX = l.x;
        t.attackTargetY = l.y;
        t.attackHitApplied = !1;
        t.attackPlayerDef = o;
        if (t.attackCombo === 3) {
          t.attackType = "stinger";
          t.attackDuration = 0.44;
          t.attackTimer = t.attackDuration;
        } else {
          t.attackType = "claw";
          t.attackDuration = 0.36;
          t.attackTimer = t.attackDuration;
          if (t.facing === "down" || t.facing === "up") {
            const dx = l.x - t.x;
            t.attackClawSide = Math.abs(dx) > 6 ? (dx < 0 ? -1 : 1) : (t.attackCombo === 1 ? -1 : 1);
          } else {
            const dy = l.y - t.y;
            t.attackClawSide = Math.abs(dy) > 6 ? (dy < 0 ? -1 : 1) : (t.attackCombo === 1 ? -1 : 1);
          }
        }
        return;
      }

      if (t.type === "tardigrade") {
        this.tardigradeAttackPlayer(t, l, o);
        return;
      }

      if (t.type === "wolf" && typeof CREATURES !== "undefined" && CREATURES.wolf && typeof CREATURES.wolf.onAttackPlayer === "function") {
        CREATURES.wolf.onAttackPlayer(this, t, l, o);
        return;
      }

      this.applyMonsterHitToPlayer(t, l, o, !1);
    }
    tardigradeAttackPlayer(t, l, o = 2) {
      if (
        l.isDead ||
        (l.invulnerableTimer && l.invulnerableTimer > 0) ||
        !this.getAnimalFireDeterrence(t, l).canAttack
      )
        return;
      const baseAtk = t.attack + (Math.random() * 3 - 1.2);
      const c = Math.max(2, Math.round(baseAtk - o * 0.42));
      l.hp = Math.max(0, (l.hp ?? 100) - c);
      var f;
      (f = this.audio) == null || f.playPlayerHurt?.();
      t.animTimer = (t.animTimer || 0) + 1.2;
      this.floatingTexts.push({
        id: `dmg_${this.nextId++}`,
        x: l.x,
        y: l.y - 20,
        text: `-${c}`,
        color: "#ef4444",
        isCrit: !!t.isQueen,
        life: 0.85,
      });
      for (let g = 0; g < 7; g++) {
        const y = Math.random() * Math.PI * 2;
        const spd = 3.5 + Math.random() * 2;
        this.hitParticles.push({
          x: l.x,
          y: l.y - 6,
          vx: Math.cos(y) * spd,
          vy: Math.sin(y) * spd,
          life: 0.45,
          color: g % 2 === 0 ? "#ef4444" : "#f59e0b",
          size: 2.2,
        });
      }
      if (l.hp <= 0) {
        // Devorou o jogador!
        const healAmt = 35;
        t.hp = Math.min(t.maxHp, t.hp + healAmt);
        if (t.scale < (t.maxScale || t.scale * 1.25)) {
          t.scale = Math.min((t.maxScale || t.scale * 1.25), Math.round((t.scale + 0.08) * 100) / 100);
        }
        var audio;
        (audio = this.audio) == null || audio.playSlimePickup?.();
        this.floatingTexts.push({
          id: `feed_${this.nextId++}`,
          x: t.x,
          y: t.y - 32,
          text: `🍴 Tardígrado Devorou o Jogador! (+${healAmt} HP)`,
          color: "#f87171",
          isCrit: !0,
          life: 1.8,
        });
        if (!l.isDead) this.handlePlayerDeath(l);
      }
    }
    applyMonsterHitToPlayer(t, l, o = 2, isStinger = !1, impactX = l.x, impactY = l.y) {
      var f;
      if (
        l.isDead ||
        (l.invulnerableTimer && l.invulnerableTimer > 0) ||
        !this.getAnimalFireDeterrence(t, l).canAttack
      )
        return;
      if (t.isGiantScorpion && l.poisonTimer) {
        l.poisonTimer = 0;
      }
      t.inCombatTimer = 4.0;
      this.dismissInferiorAttackers(t, l);
      const isNeckBite = (t.type === "wolf" && t.wolfAttackState === "arm_hold");
      const extraDmg = isStinger ? 2.5 : (isNeckBite ? 9.5 : 0);
      const m = t.attack + (Math.random() * 2.5 - 1.2) + extraDmg,
        c = Math.max(1, Math.round(m - o * 0.45));
      ((l.hp = Math.max(0, (l.hp ?? 100) - c)),
        (f = this.audio) == null || f.playPlayerHurt(),
        isStinger && !t.isGiantScorpion && (
          (l.paralyzedTimer = Math.max(l.paralyzedTimer || 0, 0.3)),
          (l.attackTimer = 0),
          (l.isAiming = !1)
        ),
        isNeckBite && (
          (l.bleedTimer = 3.05),
          (l.bleedTickTimer = 1.0)
        ),
        this.floatingTexts.push({
          id: `dmg_${this.nextId++}`,
          x: impactX + (Math.random() - 0.5) * 10,
          y: impactY - 20,
          text: isNeckBite ? `-${c} 🐺 Mordida no Pescoço` : `-${c}`,
          color: isNeckBite ? "#f43f5e" : "#ef4444",
          isCrit: (isStinger && !t.isGiantScorpion) || isNeckBite,
          life: isNeckBite ? 1.05 : 0.85,
        }));
      const particleCount = isStinger ? 6 : (isNeckBite ? 7 : 4);
      for (let g = 0; g < particleCount; g++) {
        const y = Math.random() * Math.PI * 2;
        const spd = isStinger ? 3.5 : 4;
        this.slimeParticles.push({
          x: impactX,
          y: impactY - 8,
          vx: Math.cos(y) * spd,
          vy: Math.sin(y) * spd,
          life: 0.4,
          maxLife: 0.4,
          type: "bubble",
          color: "#f87171",
          size: 1.8,
        });
      }
      l.hp <= 0 && !l.isDead && this.handlePlayerDeath(l);
    }
    spawnGroundDust(x, y, scale = 1) {
      const count = Math.round(15 * Math.max(0.7, scale));
      const colors = [
        "rgba(217, 119, 6, 0.72)",
        "rgba(245, 158, 11, 0.65)",
        "rgba(180, 83, 9, 0.6)",
        "rgba(254, 240, 138, 0.55)",
        "rgba(202, 138, 4, 0.58)",
      ];
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const spd = (1.5 + Math.random() * 4.2) * Math.max(0.8, scale * 0.85);
        this.slimeParticles.push({
          x: x + (Math.random() - 0.5) * 10 * scale,
          y: y + (Math.random() - 0.5) * 7 * scale,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * (spd * 0.45) - (1.4 + Math.random() * 2.2),
          life: 0.7 + Math.random() * 0.4,
          maxLife: 0.7 + Math.random() * 0.4,
          type: "dust",
          color: colors[i % colors.length],
          size: (3.6 + Math.random() * 4.4) * Math.max(0.8, scale * 0.78),
        });
      }
      for (let i = 0; i < 9; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.4 + Math.random() * 4.6;
        this.hitParticles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 4,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.2,
          life: 0.55,
          color: i % 2 === 0 ? "#f59e0b" : "#b45309",
          size: 2.2 + Math.random() * 2,
        });
      }
    }
    // ==========================================
    // SISTEMA DE HIERARQUIA DE ATAQUES
    // ==========================================
    getCreatureCombatTier(c) {
      if (!c) return 0;
      if (c.type === "dragon") return 100;
      if (c.type === "tardigrade") return c.isQueen ? 95 : 80;
      if (c.type === "golem") return 85;
      if (c.type === "scorpion") return c.isGiantScorpion ? 80 : 45;
      if (c.type === "wolf") return 55;
      if (c.type === "spider") return 35;
      if (c.type === "bat") return 25;
      if (c.type === "slime") return 15;
      return Math.max(10, (c.attack || 2) * 5);
    }
    isCreatureAttackingPlayer(c, player) {
      if (!c || c.hp <= 0 || player.isDead) return false;
      const isPlayerUnderground = !!(
        player.isUnderground !== undefined
          ? player.isUnderground
          : (this.lastIsUnderground !== undefined ? this.lastIsUnderground : (this.engine && this.engine.isUnderground))
      );
      const isCreatureUnderground = !!c.isUnderground;
      if (isCreatureUnderground !== isPlayerUnderground) return false;

      // Criatura que já está fugindo/desistindo do combate não conta como ameaça ativa
      if (c.leavingCombatTimer && c.leavingCombatTimer > 0) return false;

      const d = Math.hypot(c.x - player.x, c.y - player.y);
      const maxCombatDist = c.type === "dragon" ? 420 : 320 * Math.max(1, (c.scale || 1) * 0.85);
      if (d > maxCombatDist) return false;

      // Em animação ou estado ativo de ataque
      if (c.wolfAttackState) return true;
      if (c.inCombatTimer && c.inCombatTimer > 0) return true;
      if (c.isCapturingPlayer) return true;
      if (c.attached || c.isLeaping) return true;
      if (c.clawAttackTimer && c.clawAttackTimer > 0) return true;
      if (c.stingerAttackTimer && c.stingerAttackTimer > 0) return true;
      if (c.attackTimer && c.attackTimer > 0) return true;

      // Dragão atacando jogador em voo ou solo
      if (c.type === "dragon" && d <= 380) return true;

      // Lobo em combate ativo, investida, perseguição ou proximidade agressiva ao jogador
      if (c.type === "wolf") {
        if (c.wolfAttackState || (c.inCombatTimer && c.inCombatTimer > 0)) return true;
        if (d <= 280) return true;
        if ((c.attackCooldown > 0 || (c.aggroTimer && c.aggroTimer > 0)) && d <= 320) return true;
      }

      // Em perseguição próxima agressiva ou combate corpo a corpo
      const closeRange = Math.max(90, 160 * Math.max(0.8, (c.scale || 1) * 0.75));
      if (d <= closeRange && (c.attackCooldown > 0 || (c.aggroTimer && c.aggroTimer > 0) || d <= 70)) return true;

      return false;
    }
    getSuperiorPlayerAttacker(c, player) {
      if (!this.monsters || player.isDead) return null;
      const myTier = this.getCreatureCombatTier(c);
      let superior = null;
      let superiorTier = myTier;

      for (let i = 0; i < this.monsters.length; i++) {
        const other = this.monsters[i];
        if (!other || other.id === c.id || other.hp <= 0) continue;

        // Mesma espécie caça junto (ex: outros lobos atacam juntos em matilha)
        if (other.type === c.type) continue;

        const otherTier = this.getCreatureCombatTier(other);
        // Só é superior se tiver tier estritamente MAIOR que o meu
        if (otherTier > superiorTier) {
          if (this.isCreatureAttackingPlayer(other, player)) {
            superiorTier = otherTier;
            superior = other;
          }
        }
      }
      return superior;
    }
    dismissInferiorAttackers(superiorMonster, player) {
      if (!this.monsters || !superiorMonster || !player || player.isDead) return;
      const superiorTier = this.getCreatureCombatTier(superiorMonster);
      let anySlimeDetached = false;

      for (let i = 0; i < this.monsters.length; i++) {
        const m = this.monsters[i];
        if (!m || m.id === superiorMonster.id || m.hp <= 0) continue;
        if (m.type === superiorMonster.type) continue; // Mesma espécie (ex: lobos em matilha) caça junto
        const mTier = this.getCreatureCombatTier(m);
        if (mTier < superiorTier) {
          const dToPlayer = Math.hypot(m.x - player.x, m.y - player.y);
          // Se estiver atacando, agarrado, perseguindo ou em raio de combate (<= 450px)
          if (m.attached || m.isLeaping || (m.aggroTimer && m.aggroTimer > 0) || dToPlayer <= 450) {
            if (m.attached) {
              m.attached = false;
              m.attachOffsetX = 0;
              m.attachOffsetY = 0;
              anySlimeDetached = true;
              const popAng = Math.atan2(m.y - player.y, m.x - player.x) || (Math.random() * Math.PI * 2);
              m.x = player.x + Math.cos(popAng) * 28;
              m.y = player.y + Math.sin(popAng) * 28;
            }
            m.isLeaping = false;
            m.emerging = false;
            m.desistedAndLeaving = true;
            m.leavingCombatTimer = 20.0;
            m.giveUpPursuitTimer = 35.0;
            m.fleeFromCombatX = player.x;
            m.fleeFromCombatY = player.y;
            m.aggroTimer = 0;
            m.attackCooldown = Math.max(m.attackCooldown || 0, 10.0);
            const fleeSpd = (m.speed || 1) * 2.3;
            const fleeAng = (this.pickFleeAngle ? this.pickFleeAngle(m, player.x, player.y, 0.016, fleeSpd) : Math.atan2(m.y - player.y, m.x - player.x)) || Math.random() * Math.PI * 2;
            m.vx = Math.cos(fleeAng) * fleeSpd;
            m.vy = Math.sin(fleeAng) * fleeSpd;
            m.facing = this.getMonsterFacing(m.vx, m.vy, m.facing);

            // Feedback visual no jogo indicando claramente que o monstro desistiu do ataque
            if (!m._desistTextShown) {
              m._desistTextShown = true;
              this.floatingTexts.push({
                id: `flee_${this.nextId++}`,
                x: m.x,
                y: m.y - 18,
                text: "Desistiu do ataque!",
                color: "#94a3b8",
                isCrit: false,
                life: 1.3,
              });
            }
          }
        }
      }

      if (anySlimeDetached) {
        player.attachedSlimes = 0;
        player.poisonTimer = 0;
      }
    }
    handlePlayerDeath(t) {
      var l;
      ((t.isDead = !0),
        (t.hp = 0),
        (t.deathTimer = 0),
        (t.paralyzedTimer = 0),
        (t.capturedByScorpionId = null),
        (l = this.audio) == null || l.playPlayerDeath());
      for (const o of this.monsters) {
        o.isCapturingPlayer && (o.isCapturingPlayer = !1);
        o.attached &&
          ((o.attached = !1),
          (o.isLeaping = !1),
          (o.vx = (Math.random() - 0.5) * 5),
          (o.vy = (Math.random() - 0.5) * 5));
      }
      ((t.attachedSlimes = 0),
        this.floatingTexts.push({
          id: `death_${this.nextId++}`,
          x: t.x,
          y: t.y - 28,
          text: "DERROTADO!",
          color: "#f43f5e",
          isCrit: !0,
          life: 3,
        }));
    }
    respawnPlayer(t, l = 0, o = 0) {
      var u;
      ((t.isDead = !1),
        (t.hp = t.maxHp ?? 100),
        (t.poisonTimer = 0),
        (t.poisonTickTimer = 0),
        (t.bleedTimer = 0),
        (t.bleedTickTimer = 0),
        (t.paralyzedTimer = 0),
        (t.capturedByScorpionId = null),
        (t.attachedSlimes = 0),
        (t.invulnerableTimer = 3.5),
        (t.deathTimer = 0),
        (t.x = l),
        (t.y = o),
        (t.vx = 0),
        (t.vy = 0));
      for (const m of this.monsters) {
        m.isCapturingPlayer && (m.isCapturingPlayer = !1);
        m.attached && ((m.attached = !1), (m.isLeaping = !1));
      }
      ((u = this.audio) == null || u.playPlayerRespawn(),
        this.floatingTexts.push({
          id: `respawn_${this.nextId++}`,
          x: l,
          y: o - 24,
          text: "RENASCIDO!",
          color: "#38bdf8",
          isCrit: !0,
          life: 2,
        }));
    }
    reset() {
      ((this.monsters = []),
        (this.carcasses = []),
        (this.droppedItems = []),
        (this.floatingTexts = []),
        (this.slashEffects = []),
        (this.pebbleProjectiles = []),
        (this.hitParticles = []),
        (this.slimeParticles = []),
        (this.slimeSwarmTimer = 2));
    }
    getAttachedSlimesCount() {
      return this.monsters.filter(
        (t) => t.type === "slime" && t.attached && t.hp > 0,
      ).length;
    }
    getPlayerSpeedMultiplier() {
      const t = this.getAttachedSlimesCount();
      return t <= 0 ? 1 : Math.max(0.2, 1 - t * 0.35);
    }
    transferChasingMonsters(fromX, fromY, toX, toY, toUnderground) {
      let count = 0;
      for (const m of this.monsters) {
        if (m.hp <= 0) continue;
        const dist = Math.hypot(m.x - fromX, m.y - fromY);
        const isHostile = !isPreyType(m.type);
        const isChasing = m.attached || (isHostile && dist <= (m.isGiantScorpion ? 340 : 180));
        if (isChasing) {
          // Escorpiões Gigantes não entram na caverna! Eles ficam na entrada tentando puxar o player com a garra para fora.
          if (m.isGiantScorpion && toUnderground) {
            m.isUnderground = !1;
            const e = this.engine;
            const cCoords = e.activeCaveEntranceCoords || {
              tx: Math.floor(toX / e.tileSize),
              ty: Math.floor(toY / e.tileSize),
            };
            m.caveEntranceTx = cCoords.tx;
            m.caveEntranceTy = cCoords.ty;
            m.caveDoorX = cCoords.tx * e.tileSize + e.tileSize / 2;
            m.caveDoorY = cCoords.ty * e.tileSize + e.tileSize / 2 - 2;
            m.x = m.caveDoorX;
            m.y = m.caveDoorY + 18;
            m.vx = 0;
            m.vy = 0;
            m.facing = "up";
            m.isWaitingOutsideCave = !0;
            m.caveReachCooldown = 0.45;
            m.caveReachTimer = 0;
            m.caveReachProg = 0;
            m.isPullingFromCave = !1;
            continue;
          }
          m.isUnderground = toUnderground;
          m.isWaitingOutsideCave = !1;
          m.isPullingFromCave = !1;
          m.caveReachTimer = 0;
          m.caveReachProg = 0;
          const relAngle =
            Math.atan2(m.y - fromY, m.x - fromX) || Math.random() * Math.PI * 2;
          const spawnDist = Math.max(16, Math.min(dist * 0.7, 44));
          m.x = toX + Math.cos(relAngle) * spawnDist;
          m.y = toY + Math.sin(relAngle) * spawnDist;
          m.vx = 0;
          m.vy = 0;
          m.attackCooldown = Math.max(m.attackCooldown || 0, 0.4);
          count++;
        }
      }
      return count;
    }
    isShallowWater(t, l) {
      const o = this.engine.getTile(t, l);
      return (
        o.biome.id === BiomeId.COAST_WATER ||
        o.biome.id === BiomeId.CAVE_LAKE ||
        (o.biome.hasWater && o.biome.passable)
      );
    }
    isPositionInShade(t, l, o = 0.5, u = !1) {
      if (u || o < 0.22 || o > 0.78) return !0;
      const m = Math.floor(t / this.engine.tileSize),
        c = Math.floor(l / this.engine.tileSize),
        f = (o - 0.2) / 0.6,
        g = f * Math.PI,
        y = (f - 0.5) * 2.2,
        w = Math.sin(g),
        v = Math.max(0.35, Math.min(2.2, 0.45 + (1 - w) * 1.6)),
        T = y,
        S = 0.5 * (1 - w * 0.3);
      for (let p = -2; p <= 2; p++)
        for (let j = -2; j <= 2; j++) {
          const P = m + p,
            A = c + j,
            x = this.engine.getTile(P, A);
          if (!x.prop) continue;
          const M = x.prop.kind,
            $ = M.startsWith("tree_"),
            z = M === "rock" || M === "ruin_pillar" || M === "shrine" || M === "cliff_wall";
          if (!$ && !z) continue;
          const K = x.prop.scale || 1,
            V =
              P * this.engine.tileSize +
              this.engine.tileSize / 2 +
              (x.prop.offsetX || 0),
            O =
              A * this.engine.tileSize +
              this.engine.tileSize / 2 +
              (x.prop.offsetY || 0);
          if ($) {
            if (Math.hypot(t - V, l - (O - 10)) <= 24 * K) return !0;
            const se = (M === "tree_palm" ? 44 : 36) * K,
              ue = T * se * v * 0.55,
              N = S * se * v * 0.45,
              Ee = V + ue,
              ne = O + N,
              ke = 24 * K,
              G = 16 * v * K;
            if (Math.hypot((t - Ee) / ke, (l - ne) / Math.max(9, G)) <= 1.05)
              return !0;
          } else if (z && Math.hypot(t - V, l - O) <= 16 * K) return !0;
        }
      return !1;
    }
    findNearestShelter(t, l, o = 0.5, u = !1) {
      const m = Math.floor(t / this.engine.tileSize),
        c = Math.floor(l / this.engine.tileSize);
      let f = null,
        g = 1 / 0;
      for (let y = 1; y <= 5; y++) {
        for (let w = -y; w <= y; w++)
          for (let v = -y; v <= y; v++) {
            if (Math.abs(w) !== y && Math.abs(v) !== y) continue;
            const T = m + w,
              S = c + v;
            if (!this.engine.isTileCreaturePassable(T, S)) continue;
            const p = T * this.engine.tileSize + this.engine.tileSize / 2,
              j = S * this.engine.tileSize + this.engine.tileSize / 2,
              P = this.isShallowWater(T, S),
              A = P ? !1 : this.isPositionInShade(p, j, o, u);
            if (P || A) {
              const x = Math.hypot(p - t, j - l),
                M = P ? x * 0.55 : x;
              M < g && ((g = M), (f = { x: p, y: j, isWater: P }));
            }
          }
        if (f) break;
      }
      return f;
    }
    update(t, l, o, u, m = 0.5, c = 2) {
      var w, v, T;
      if (l.paralyzedTimer && l.paralyzedTimer > 0) {
        l.paralyzedTimer = Math.max(0, l.paralyzedTimer - t);
      }
      ((this.lastPlayerX = l.x),
        (this.lastPlayerY = l.y),
        (this.lastIsUnderground = o),
        (this.animTimer += t));
      for (let S = this.carcasses.length - 1; S >= 0; S--) {
        const p = this.carcasses[S];
        if (
          (p.settleProgress < 1 &&
            (p.settleProgress = Math.min(1, p.settleProgress + t * 2.5)),
          (p.lifetime -= t),
          p.lifetime <= 0)
        ) {
          if (p.isSlime)
            for (let P = 0; P < 5; P++)
              this.hitParticles.push({
                x: p.x + (Math.random() - 0.5) * 14,
                y: p.y + (Math.random() - 0.5) * 8,
                vx: (Math.random() - 0.5) * 0.8,
                vy: -0.8 - Math.random() * 1.2,
                life: 0.65,
                color: p.accentColor || "#4ade80",
                size: 1.8 + Math.random() * 1.5,
              });
          this.carcasses.splice(S, 1);
          continue;
        }
        Math.hypot(p.x - l.x, p.y - l.y) > 1500 && this.carcasses.splice(S, 1);
      }
      for (let S = this.droppedItems.length - 1; S >= 0; S--) {
        const p = this.droppedItems[S];
        if (
          (p.pickupCooldown &&
            p.pickupCooldown > 0 &&
            (p.pickupCooldown = Math.max(0, p.pickupCooldown - t)),
          (p.lifetime -= t),
          p.lifetime <= 0)
        ) {
          for (let P = 0; P < 7; P++)
            this.hitParticles.push({
              x: p.x + (Math.random() - 0.5) * 14,
              y: p.y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 1.2,
              vy: -0.8 - Math.random() * 1.2,
              life: 0.65,
              color: p.item.color || "#fbbf24",
              size: 2 + Math.random() * 1.5,
            });
          this.droppedItems.splice(S, 1);
          continue;
        }
        Math.hypot(p.x - l.x, p.y - l.y) > 1800 &&
          this.droppedItems.splice(S, 1);
      }
      const f = m >= 0.22 && m <= 0.78,
        isNightTime = !f,
        isDesertSurface = !o && u === BiomeId.DESERT;
      if (!isNightTime || o) {
        this._nightGiantScorpionsSpawned = !1;
      }
      if (isDesertSurface && isNightTime && !this._nightGiantScorpionsSpawned && !l.isDead) {
        this._nightGiantScorpionsSpawned = !0;
        this.triggerDesertNightGiantScorpions(l, o);
      }
      // Durante a noite no deserto, os escorpiões gigantes continuam surgindo normalmente pelo mapa respeitando o limite de até 3
      if (isDesertSurface && isNightTime && !l.isDead) {
        this._desertGiantRepopTimer = (this._desertGiantRepopTimer || 0) + t;
        if (this._desertGiantRepopTimer >= 4.0) {
          this._desertGiantRepopTimer = 0;
          this.spawnNightGiantScorpionNearPlayer(l);
        }
      }
      if (
        (l.invulnerableTimer &&
          l.invulnerableTimer > 0 &&
          (l.invulnerableTimer = Math.max(0, l.invulnerableTimer - t)),
        l.isDead)
      ) {
        l.deathTimer = (l.deathTimer || 0) + t;
        for (const S of this.monsters)
          S.attached && ((S.attached = !1), (S.isLeaping = !1));
        l.attachedSlimes = 0;
      }
      for (let S = this.monsters.length - 1; S >= 0; S--) {
        const p = this.monsters[S];
        if (this.engine.undergroundLevel === 3 && p.type === "tardigrade") {
          this.monsters.splice(S, 1);
          continue;
        }
        if (p.isUnderground !== o) {
          // Escorpião Gigante do lado de fora da caverna: permanece vivo na entrada e enfia a garra pela abertura para tentar pegar e retirar o player da caverna!
          if (p.isGiantScorpion && !p.isUnderground && o && this.engine.undergroundLevel === 1) {
            if (!isNightTime) {
              this.monsters.splice(S, 1);
              continue;
            }
            p.animTimer += t * 3;
            if (p.hitFlashTimer > 0) p.hitFlashTimer = Math.max(0, p.hitFlashTimer - t);
            const cCoords = this.engine.activeCaveEntranceCoords;
            const doorTx = p.caveEntranceTx !== void 0 ? p.caveEntranceTx : (cCoords ? cCoords.tx : Math.floor(p.x / this.engine.tileSize));
            const doorTy = p.caveEntranceTy !== void 0 ? p.caveEntranceTy : (cCoords ? cCoords.ty : Math.floor(p.y / this.engine.tileSize));
            const doorX = doorTx * this.engine.tileSize + this.engine.tileSize / 2;
            const doorY = doorTy * this.engine.tileSize + this.engine.tileSize / 2 - 2;
            p.caveDoorX = doorX;
            p.caveDoorY = doorY;
            const distPlayerToDoor = Math.hypot(l.x - doorX, l.y - doorY);
            if (distPlayerToDoor > (p.isGiantScorpion ? 1600 : 680)) {
              this.monsters.splice(S, 1);
              continue;
            }
            if (p.isPullingFromCave) {
              if (l.isDead || l.capturedByScorpionId !== p.id) {
                p.isPullingFromCave = !1;
                p.caveReachTimer = 0;
                p.caveReachProg = 0;
              } else {
                const pullDur = p.cavePullDuration || 1.15;
                p.cavePullProgress = Math.min(1, (p.cavePullProgress || 0) + t / pullDur);
                const startX = p.cavePullStartX ?? l.x;
                const startY = p.cavePullStartY ?? l.y;
                l.x = startX + (doorX - startX) * p.cavePullProgress;
                l.y = startY + (doorY + 4 - startY) * p.cavePullProgress;
                l.vx = 0;
                l.vy = 0;
                l.isMoving = !1;
                if (p.cavePullProgress >= 1) {
                  // Retirou o jogador da caverna para a superfície e agora o leva até a boca!
                  p.isPullingFromCave = !1;
                  p.caveReachTimer = 0;
                  p.caveReachProg = 0;
                  p.isWaitingOutsideCave = !1;
                  p.x = doorX;
                  p.y = doorY + 42;
                  p.facing = "up";
                  p.isCapturingPlayer = !0;
                  p.captureProgress = 0;
                  p.capturePullDuration = 2.15;
                  p.captureStartLocalX = 0;
                  p.captureStartLocalY = -28;
                  l._pulledOutOfCaveByScorpion = {
                    tx: doorTx,
                    ty: doorTy,
                    x: doorX,
                    y: doorY + 14,
                  };
                }
              }
              continue;
            }
            const maxCaveClawReach = 108;
            if (p.caveReachTimer && p.caveReachTimer > 0) {
              p.caveReachTimer = Math.max(0, p.caveReachTimer - t);
              const rDur = p.caveReachDuration || 0.72;
              p.caveReachProg = Math.max(0, Math.min(1, 1 - p.caveReachTimer / rDur));
              if (p.caveReachProg < 0.42 && distPlayerToDoor <= maxCaveClawReach + 24) {
                const angToP = Math.atan2(l.y - doorY, l.x - doorX);
                const clampedDist = Math.min(maxCaveClawReach, distPlayerToDoor);
                const desX = doorX + Math.cos(angToP) * clampedDist;
                const desY = doorY + Math.sin(angToP) * clampedDist;
                p.caveReachTargetX = p.caveReachTargetX !== void 0 ? p.caveReachTargetX + (desX - p.caveReachTargetX) * 0.35 : desX;
                p.caveReachTargetY = p.caveReachTargetY !== void 0 ? p.caveReachTargetY + (desY - p.caveReachTargetY) * 0.35 : desY;
              }
              const ext = Math.sin(p.caveReachProg * Math.PI);
              const tipX = doorX + ((p.caveReachTargetX ?? doorX) - doorX) * ext;
              const tipY = doorY + 4 + ((p.caveReachTargetY ?? (doorY + 26)) - (doorY + 4)) * ext;
              p._caveClawTipX = tipX;
              p._caveClawTipY = tipY;
              const clawRad = Math.max(8, 3.8 * (p.scale || 3.4));
              p._caveClawRadius = clawRad;
              const playerHitRadius = Math.max(this.engine.footHX || 6, this.engine.footHY || 5) + 4;
              if (
                !p.caveReachHitApplied &&
                p.caveReachProg >= 0.2 &&
                p.caveReachProg <= 0.82 &&
                !l.isDead &&
                !l.capturedByScorpionId &&
                Math.hypot(l.x - tipX, l.y - tipY) <= clawRad + playerHitRadius
              ) {
                p.caveReachHitApplied = !0;
                this.applyMonsterHitToPlayer(p, l, c, !1, tipX, tipY);
                if (!l.isDead) {
                  // Agarrou o jogador dentro da caverna e começa a puxá-lo para fora!
                  p.isPullingFromCave = !0;
                  p.cavePullProgress = 0;
                  p.cavePullDuration = 1.15;
                  p.cavePullStartX = l.x;
                  p.cavePullStartY = l.y;
                  const singlePunchDmg = Math.max(1, 5 - (p.defense || 5) + 0.5);
                  p.captureBreakDamageNeeded = Math.round(singlePunchDmg * 3);
                  p.captureDamageTaken = 0;
                  l.capturedByScorpionId = p.id;
                  l.vx = 0;
                  l.vy = 0;
                  l.isMoving = !1;
                }
              }
              if (p.caveReachTimer <= 0) {
                p.caveReachProg = 0;
              }
            } else {
              p.caveReachProg = 0;
              p.caveReachCooldown = Math.max(0, (p.caveReachCooldown || 0) - t);
              const fireDet = this.getAnimalFireDeterrence(p, l);
              if (
                p.caveReachCooldown <= 0 &&
                !l.isDead &&
                !l.capturedByScorpionId &&
                distPlayerToDoor <= maxCaveClawReach &&
                fireDet.canAttack
              ) {
                p.caveReachDuration = 0.72;
                p.caveReachTimer = p.caveReachDuration;
                p.caveReachProg = 0.01;
                p.caveReachHitApplied = !1;
                p.attackClawSide = l.x < doorX ? -1 : 1;
                const angToP = Math.atan2(l.y - doorY, l.x - doorX);
                const clampedDist = Math.min(maxCaveClawReach, Math.max(20, distPlayerToDoor));
                p.caveReachTargetX = doorX + Math.cos(angToP) * clampedDist;
                p.caveReachTargetY = doorY + Math.sin(angToP) * clampedDist;
                p.caveReachCooldown = 1.25;
              }
            }
            continue;
          }
          this.monsters.splice(S, 1);
          continue;
        }
        if (p.isWaitingOutsideCave && !o) {
          p.isWaitingOutsideCave = !1;
          p.caveReachTimer = 0;
          p.caveReachProg = 0;
          p.isPullingFromCave = !1;
        }
        const j = Math.hypot(l.x - p.x, l.y - p.y);
        const maxDist = p.isGiantScorpion ? 1600 : 680;
        if (j > maxDist) {
          this.monsters.splice(S, 1);
          continue;
        }
        ((p.animTimer += t * 3),
          p.hitFlashTimer > 0 &&
            (p.hitFlashTimer = Math.max(0, p.hitFlashTimer - t)),
          p.inCombatTimer > 0 &&
            (p.inCombatTimer = Math.max(0, p.inCombatTimer - t)),
          p.attackTimer > 0 &&
            (p.attackTimer = Math.max(0, p.attackTimer - t)));
        const P = Math.floor(p.x / this.engine.tileSize),
          A = Math.floor(p.y / this.engine.tileSize);
        if (
          !p.isUnderground &&
          p.type === "wolf" &&
          typeof window !== "undefined" &&
          window.SnowPeakCity &&
          typeof window.SnowPeakCity.isCityTerritory === "function" &&
          window.SnowPeakCity.isCityTerritory(P, A)
        ) {
          this.monsters.splice(S, 1);
          continue;
        }
        if (p.type === "scorpion") {
          // À noite no deserto, os escorpiões pequenos se enterram na areia e somem!
          if (!p.isUnderground && isNightTime && !p.isGiantScorpion && !p.burrowing) {
            p.burrowing = !0;
            p.burrowDuration = 0.9;
            p.burrowTimer = 0.9;
            p.vx = 0;
            p.vy = 0;
            this.floatingTexts.push({
              id: `burrow_${this.nextId++}`,
              x: p.x,
              y: p.y - 14,
              text: "Se enterrou na areia!",
              color: "#f59e0b",
              isCrit: !1,
              life: 0.9,
            });
          }
          // Ao amanhecer, os escorpiões gigantes noturnos também retornam para debaixo da areia
          if (!p.isUnderground && !isNightTime && p.isGiantScorpion && !p.burrowing) {
            if (p.isCapturingPlayer) {
              p.isCapturingPlayer = !1;
              if (l.capturedByScorpionId === p.id) l.capturedByScorpionId = null;
            }
            p.burrowing = !0;
            p.burrowDuration = 1.1;
            p.burrowTimer = 1.1;
            p.vx = 0;
            p.vy = 0;
          }
          if (p.burrowing) {
            p.burrowTimer = (p.burrowTimer || 0.9) - t;
            p.vx = 0;
            p.vy = 0;
            if (Math.random() < t * 14) {
              const sScale = p.scale || 1;
              this.slimeParticles.push({
                x: p.x + (Math.random() - 0.5) * 16 * sScale,
                y: p.y + 3 * sScale,
                vx: (Math.random() - 0.5) * 8 * Math.min(2.5, sScale),
                vy: -5 - Math.random() * 8,
                life: 0.5,
                maxLife: 0.5,
                type: "mud",
                color: Math.random() < 0.5 ? "#d97706" : "#92400e",
                size: (1.8 + Math.random() * 1.4) * Math.min(2.2, sScale * 0.6),
              });
            }
            if (p.burrowTimer <= 0) {
              this.monsters.splice(S, 1);
            }
            continue;
          }
          if (p.emerging) {
            p.emergeTimer = (p.emergeTimer || 1.15) - t;
            p.vx = 0;
            p.vy = 0;
            if (Math.random() < t * 16) {
              const sScale = p.scale || 1;
              this.slimeParticles.push({
                x: p.x + (Math.random() - 0.5) * 20 * Math.min(3, sScale * 0.65),
                y: p.y + 4 * Math.min(3, sScale * 0.65),
                vx: (Math.random() - 0.5) * 14,
                vy: -8 - Math.random() * 12,
                life: 0.55,
                maxLife: 0.55,
                type: "mud",
                color: Math.random() < 0.5 ? "#f59e0b" : "#78350f",
                size: 2.6 + Math.random() * 2.2,
              });
            }
            if (p.emergeTimer <= 0) {
              p.emerging = !1;
            }
            continue;
          }
          if (p.isGiantScorpion) {
            if (p.clawAttackTimer && p.clawAttackTimer > 0) {
              const prevClawTimer = p.clawAttackTimer;
              p.clawAttackTimer = Math.max(0, p.clawAttackTimer - t);
              if (prevClawTimer > 0.16 && p.clawAttackTimer <= 0.16 && !p.clawGroundDustSpawned) {
                p.clawGroundDustSpawned = !0;
                if (typeof getScorpionHitColliders === "function") {
                  const cols = getScorpionHitColliders(p);
                  const activeClaw = cols.find((c) => c.part === (p.attackClawSide === -1 ? "claw_left" : "claw_right"));
                  if (activeClaw) {
                    this.spawnGroundDust(activeClaw.x, activeClaw.y, (p.scale || 4.75) / 3.4);
                  }
                }
              }
            }
            if (p.stingerAttackTimer && p.stingerAttackTimer > 0) {
              p.stingerAttackTimer = Math.max(0, p.stingerAttackTimer - t);
            }
            if (p.clawAttackCooldown && p.clawAttackCooldown > 0) {
              p.clawAttackCooldown = Math.max(0, p.clawAttackCooldown - t);
            }
            if (p.stingerAttackCooldown && p.stingerAttackCooldown > 0) {
              p.stingerAttackCooldown = Math.max(0, p.stingerAttackCooldown - t);
            }
            // Velocidade do Escorpião Gigante: 10% mais lento que a velocidade do player correndo
            const playerBaseSpeed = l.speed || 2.15;
            p.speed = playerBaseSpeed * 1.6 * 0.85 * 0.9;
            if (p.isCapturingPlayer) {
              if (l.isDead || l.capturedByScorpionId !== p.id) {
                p.isCapturingPlayer = !1;
              } else {
                p.vx = 0;
                p.vy = 0;
                const pullDuration = p.capturePullDuration || 2.35;
                p.captureProgress = Math.min(1, (p.captureProgress || 0) + t / pullDuration);
                if (typeof getScorpionHitColliders === "function") {
                  const cols = getScorpionHitColliders(p);
                  const activePart = p.attackClawSide === -1 ? "claw_left" : "claw_right";
                  const grabCol = cols.find((col) => col.part === activePart) || cols[0];
                  if (grabCol) {
                    l.x = grabCol.x;
                    l.y = grabCol.y;
                    l.vx = 0;
                    l.vy = 0;
                    l.isMoving = !1;
                  }
                }
                if (p.captureProgress >= 1) {
                  p.isCapturingPlayer = !1;
                  l.capturedByScorpionId = null;
                  l.hp = 0;
                  this.floatingTexts.push({
                    id: `fatal_bite_${this.nextId++}`,
                    x: l.x,
                    y: l.y - 26,
                    text: "💀 DEVORADO! ATAQUE FATAL!",
                    color: "#dc2626",
                    isCrit: !0,
                    life: 2.2,
                  });
                  for (let k = 0; k < 14; k++) {
                    const ang = Math.random() * Math.PI * 2;
                    const spd = 2.5 + Math.random() * 5;
                    this.hitParticles.push({
                      x: l.x,
                      y: l.y - 6,
                      vx: Math.cos(ang) * spd,
                      vy: Math.sin(ang) * spd,
                      life: 0.9,
                      color: k % 2 === 0 ? "#dc2626" : "#f87171",
                      size: 2.8 + Math.random() * 2.2,
                    });
                  }
                  if (!l.isDead) {
                    this.handlePlayerDeath(l);
                  }
                }
                continue;
              }
            }
          }
          const hasActiveScorpionStrike = p.isGiantScorpion
            ? ((p.clawAttackTimer && p.clawAttackTimer > 0 && !p.clawHitApplied) ||
               (p.stingerAttackTimer && p.stingerAttackTimer > 0 && !p.stingerHitApplied))
            : (p.attackTimer && p.attackTimer > 0 && !p.attackHitApplied);
          if (hasActiveScorpionStrike && typeof getScorpionHitColliders === "function") {
            if (p.isGiantScorpion) {
              if (p.clawAttackTimer && p.clawAttackTimer > 0) {
                const cProg = 1 - p.clawAttackTimer / (p.clawAttackDuration || 0.36);
                if (cProg < 0.38) {
                  p.clawTargetX = p.clawTargetX !== void 0 ? p.clawTargetX + (l.x - p.clawTargetX) * 0.4 : l.x;
                  p.clawTargetY = p.clawTargetY !== void 0 ? p.clawTargetY + (l.y - p.clawTargetY) * 0.4 : l.y;
                }
              }
              if (p.stingerAttackTimer && p.stingerAttackTimer > 0) {
                const sProg = 1 - p.stingerAttackTimer / (p.stingerAttackDuration || 0.44);
                if (sProg < 0.38) {
                  p.stingerTargetX = p.stingerTargetX !== void 0 ? p.stingerTargetX + (l.x - p.stingerTargetX) * 0.4 : l.x;
                  p.stingerTargetY = p.stingerTargetY !== void 0 ? p.stingerTargetY + (l.y - p.stingerTargetY) * 0.4 : l.y;
                }
              }
            } else {
              const dur = p.attackDuration || 0.36;
              const prog = 1 - p.attackTimer / dur;
              if (prog < 0.35) {
                p.attackTargetX = p.attackTargetX !== void 0 ? p.attackTargetX + (l.x - p.attackTargetX) * 0.35 : l.x;
                p.attackTargetY = p.attackTargetY !== void 0 ? p.attackTargetY + (l.y - p.attackTargetY) * 0.35 : l.y;
              }
            }
            const colliders = getScorpionHitColliders(p);
            const playerHitRadius = Math.max(this.engine.footHX || 6, this.engine.footHY || 5) + 4;
            for (const col of colliders) {
              if (!col.active) continue;
              const isSting = col.part === "stinger";
              if (p.isGiantScorpion) {
                if (isSting && p.stingerHitApplied) continue;
                if (!isSting && p.clawHitApplied) continue;
              } else if (p.attackHitApplied) {
                continue;
              }
              const distToPlayer = Math.hypot(l.x - col.x, l.y - col.y);
              if (distToPlayer <= col.radius + playerHitRadius) {
                if (p.isGiantScorpion) {
                  if (isSting) p.stingerHitApplied = !0;
                  else p.clawHitApplied = !0;
                } else {
                  p.attackHitApplied = !0;
                }
                this.applyMonsterHitToPlayer(
                  p,
                  l,
                  p.attackPlayerDef ?? c,
                  isSting,
                  col.x,
                  col.y,
                );
                // 30% de chance da garra do Escorpião Gigante capturar o jogador e levá-lo até a boca!
                let wasCaptured = !1;
                if (
                  p.isGiantScorpion &&
                  !isSting &&
                  !l.isDead &&
                  !l.capturedByScorpionId &&
                  Math.random() < 0.3
                ) {
                  wasCaptured = !0;
                  p.isCapturingPlayer = !0;
                  p.captureProgress = 0;
                  p.capturePullDuration = 2.35;
                  p.clawAttackTimer = 0;
                  // Equivalente ao dano de 3 socos do player na defesa do escorpião gigante (5 atk - 5 def => 1~2 por soco => 4 de dano total para 3 socos)
                  const singlePunchDmg = Math.max(1, 5 - (p.defense || 5) + 0.5);
                  p.captureBreakDamageNeeded = Math.round(singlePunchDmg * 3);
                  p.captureDamageTaken = 0;
                  if (p.facing === "down" || p.facing === "up") {
                    p.captureStartLocalX = col.x - p.x;
                    p.captureStartLocalY = col.y - p.y;
                  } else {
                    const uDir = p.facing === "left" ? -1 : 1;
                    p.captureStartLocalX = (col.x - p.x) * uDir;
                    p.captureStartLocalY = col.y - p.y;
                  }
                  l.capturedByScorpionId = p.id;
                  l.vx = 0;
                  l.vy = 0;
                  l.isMoving = !1;
                }
                // Quando o player for atingido e NÃO for capturado:
                // É jogado para trás, e a garra acerta o chão fazendo subir poeira!
                if (p.isGiantScorpion && !wasCaptured && !l.isDead) {
                  const knockAngle = Math.atan2(l.y - col.y, l.x - col.x) || Math.atan2(l.y - p.y, l.x - p.x) || (Math.PI / 2);
                  const knockDist = 52;
                  if (typeof this.engine?.moveWithSlide === "function") {
                    const slid = this.engine.moveWithSlide(l.x, l.y, Math.cos(knockAngle) * knockDist, Math.sin(knockAngle) * knockDist, !0);
                    l.x = slid.x;
                    l.y = slid.y;
                  } else {
                    l.x += Math.cos(knockAngle) * knockDist;
                    l.y += Math.sin(knockAngle) * knockDist;
                  }
                  l.vx = Math.cos(knockAngle) * 4.6;
                  l.vy = Math.sin(knockAngle) * 4.6;

                  // A garra acerta o chão fazendo subir poeira!
                  this.spawnGroundDust(col.x, col.y, (p.scale || 4.75) / 3.2);
                  var audioImpact = this.audio;
                  audioImpact == null || audioImpact.playHitImpact();
                }
                break;
              }
            }
          }
        }
        // Se a criatura desistiu do ataque perante um predador mais forte, ela vai embora para longe da luta
        if (p.leavingCombatTimer && p.leavingCombatTimer > 0) {
          p.leavingCombatTimer = Math.max(0, p.leavingCombatTimer - t);
          p.aggroTimer = 0;
          p.attackCooldown = Math.max(p.attackCooldown || 0, 8.0);
          if (p.wolfAttackState) p.wolfAttackState = null;
          if (p.attached) {
            p.attached = false;
            p.attachOffsetX = 0;
            p.attachOffsetY = 0;
            if (l.attachedSlimes) l.attachedSlimes = Math.max(0, l.attachedSlimes - 1);
            p.isLeaping = false;
          }
          const fX = p.fleeFromCombatX ?? l.x;
          const fY = p.fleeFromCombatY ?? l.y;
          const distFromFight = Math.hypot(p.x - fX, p.y - fY);

          // Ao se afastar da zona de combate, a criatura vai embora de vez (despawna do mundo)
          if (distFromFight > 240) {
            this.monsters.splice(S, 1);
            continue;
          }

          const fleeSpd = (p.speed || 1) * 2.3;
          const fleeAng = this.pickFleeAngle(p, fX, fY, t, fleeSpd);
          p.vx = Math.cos(fleeAng) * fleeSpd;
          p.vy = Math.sin(fleeAng) * fleeSpd;
          p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);

          const moveStepX = p.vx * t * 60;
          const moveStepY = p.vy * t * 60;
          const _m = this.engine.moveWithSlide(p.x, p.y, moveStepX, moveStepY, false);
          p.x = _m.x;
          p.y = _m.y;
          p.isMoving = true;
          continue;
        }
        if (p.type === "wolf" && p.wolfAttackState && typeof CREATURES !== "undefined" && CREATURES.wolf && typeof CREATURES.wolf.updateAttack === "function") {
          const isHandlingWolfAttack = CREATURES.wolf.updateAttack(this, p, l, t, c);
          if (isHandlingWolfAttack) {
            continue;
          }
        }
        if (p.type === "slime") {
          const superiorAttacker = this.getSuperiorPlayerAttacker(p, l);
          if (superiorAttacker) {
            if (p.attached) {
              p.attached = !1;
              p.attachOffsetX = 0;
              p.attachOffsetY = 0;
              if (l.attachedSlimes) l.attachedSlimes = Math.max(0, l.attachedSlimes - 1);
              const popAng = Math.atan2(p.y - l.y, p.x - l.x) || (Math.random() * Math.PI * 2);
              p.x = l.x + Math.cos(popAng) * 28;
              p.y = l.y + Math.sin(popAng) * 28;
            }
            if (!this.monsters.some(mOther => mOther.id !== p.id && mOther.type === "slime" && mOther.attached && mOther.hp > 0)) {
              l.attachedSlimes = 0;
              l.poisonTimer = 0;
            }
            p.isLeaping = !1;
            p.emerging = !1;
            p.desistedAndLeaving = true;
            p.leavingCombatTimer = 20.0;
            p.giveUpPursuitTimer = 35.0;
            p.fleeFromCombatX = l.x;
            p.fleeFromCombatY = l.y;
            p.aggroTimer = 0;
            p.attackCooldown = Math.max(p.attackCooldown || 0, 10.0);
            if (!p._desistTextShown) {
              p._desistTextShown = true;
              this.floatingTexts.push({
                id: `flee_${this.nextId++}`,
                x: p.x,
                y: p.y - 18,
                text: "Desistiu do ataque!",
                color: "#94a3b8",
                isCrit: !1,
                life: 1.3,
              });
            }
            const fleeSpd = (p.speed || 1) * 2.3;
            const fleeAng = this.pickFleeAngle(p, l.x, l.y, t, fleeSpd);
            p.vx = Math.cos(fleeAng) * fleeSpd;
            p.vy = Math.sin(fleeAng) * fleeSpd;
            p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
            const moveStepX = p.vx * t * 60;
            const moveStepY = p.vy * t * 60;
            const _m = this.engine.moveWithSlide(p.x, p.y, moveStepX, moveStepY, false);
            p.x = _m.x;
            p.y = _m.y;
            p.isMoving = true;
            continue;
          }
          if (p.attached) {
            const W = this.getAnimalFireDeterrence(p, l);
            if (W.isDeterred) {
              ((p.attached = !1), (p.isLeaping = !1), (p.attackCooldown = 3));
              const le =
                Math.atan2(p.y - W.fireSourceY, p.x - W.fireSourceX) ||
                Math.random() * Math.PI * 2;
              ((p.vx = Math.cos(le) * (p.speed * 1.5)),
                (p.vy = Math.sin(le) * (p.speed * 1.5)),
                (p.x = l.x + Math.cos(le) * 36),
                (p.y = l.y + Math.sin(le) * 36),
                (l.poisonTimer = 0));
              continue;
            }
            if (
              ((p.x = l.x + (p.attachOffsetX || 0)),
              (p.y = l.y + (p.attachOffsetY || 0)),
              (p.vx = 0),
              (p.vy = 0),
              (p.animTimer += t * 4.5),
              (l.poisonTimer = Math.max(l.poisonTimer || 0, 6.5)),
              (p.poisonTickCooldown = (p.poisonTickCooldown || 1) - t),
              p.poisonTickCooldown <= 0)
            ) {
              if (
                ((p.poisonTickCooldown = 1),
                !l.isDead && (!l.invulnerableTimer || l.invulnerableTimer <= 0))
              ) {
                const le = Math.max(1, Math.round(p.attack * 0.55));
                ((l.hp = Math.max(0, (l.hp ?? 100) - le)),
                  (w = this.audio) == null || w.playPlayerHurt(),
                  this.floatingTexts.push({
                    id: `pois_${this.nextId++}`,
                    x: l.x + (p.attachOffsetX || 0),
                    y: l.y - 18,
                    text: `-${le} ☠ Veneno`,
                    color: "#4ade80",
                    isCrit: !1,
                    life: 0.9,
                  }),
                  l.hp <= 0 && !l.isDead && this.handlePlayerDeath(l));
              }
              for (let le = 0; le < 3; le++)
                this.slimeParticles.push({
                  x: p.x + (Math.random() - 0.5) * 8,
                  y: p.y - 4,
                  vx: (Math.random() - 0.5) * 4,
                  vy: 4 + Math.random() * 6,
                  life: 0.5,
                  maxLife: 0.5,
                  type: "poison",
                  color: "#4ade80",
                  size: 1.6,
                });
            }
            continue;
          }
          if (p.emerging) {
            ((p.emergeTimer = (p.emergeTimer || 0.55) - t),
              (p.vx = 0),
              (p.vy = 0),
              Math.random() < t * 6 &&
                this.slimeParticles.push({
                  x: p.x + (Math.random() - 0.5) * 8,
                  y: p.y + 2,
                  vx: (Math.random() - 0.5) * 4,
                  vy: -4 - Math.random() * 6,
                  life: 0.45,
                  maxLife: 0.45,
                  type: "mud",
                  color: "#78350f",
                  size: 2,
                }),
              p.emergeTimer <= 0 && (p.emerging = !1));
            continue;
          }
          if (p.isLeaping) {
            const superiorLeap = this.getSuperiorPlayerAttacker(p, l);
            if (superiorLeap) {
              p.isLeaping = !1;
              p.desistedAndLeaving = true;
              p.leavingCombatTimer = 20.0;
              p.giveUpPursuitTimer = 35.0;
              p.fleeFromCombatX = l.x;
              p.fleeFromCombatY = l.y;
              p.aggroTimer = 0;
              p.attackCooldown = Math.max(p.attackCooldown || 0, 10.0);
              if (!p._desistTextShown) {
                p._desistTextShown = true;
                this.floatingTexts.push({
                  id: `flee_${this.nextId++}`,
                  x: p.x,
                  y: p.y - 18,
                  text: "Desistiu do ataque!",
                  color: "#94a3b8",
                  isCrit: !1,
                  life: 1.3,
                });
              }
              const fleeSpd = (p.speed || 1) * 2.3;
              const fleeAng = this.pickFleeAngle(p, l.x, l.y, t, fleeSpd);
              p.vx = Math.cos(fleeAng) * fleeSpd;
              p.vy = Math.sin(fleeAng) * fleeSpd;
              p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
              const moveStepX = p.vx * t * 60;
              const moveStepY = p.vy * t * 60;
              const _m = this.engine.moveWithSlide(p.x, p.y, moveStepX, moveStepY, false);
              p.x = _m.x;
              p.y = _m.y;
              p.isMoving = true;
              continue;
            }
            const W = this.getAnimalFireDeterrence(p, l);
            if (W.isDeterred) {
              p.isLeaping = !1;
              const te =
                Math.atan2(p.y - W.fireSourceY, p.x - W.fireSourceX) ||
                Math.random() * Math.PI * 2;
              ((p.vx = Math.cos(te) * (p.speed * 1.4)),
                (p.vy = Math.sin(te) * (p.speed * 1.4)),
                (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)),
                (p.attackCooldown = 3));
              continue;
            }
            p.leapProgress = (p.leapProgress || 0) + t / 0.35;
            const le = Math.min(1, p.leapProgress);
            const nextLeapX =
              (p.leapStartX ?? p.x) +
              ((p.leapTargetX ?? l.x) - (p.leapStartX ?? p.x)) * le;
            const nextLeapY =
              (p.leapStartY ?? p.y) +
              ((p.leapTargetY ?? l.y) - (p.leapStartY ?? p.y)) * le;
            if (
              this.engine &&
              typeof this.engine.isCabinWallBlockedAt === "function" &&
              this.engine.isCabinWallBlockedAt(nextLeapX, nextLeapY)
            ) {
              p.isLeaping = !1;
              p.attackCooldown = 1.2;
              continue;
            }
            if (
              ((p.x = nextLeapX),
              (p.y = nextLeapY),
              le >= 1 || j <= 16)
            ) {
              p.isLeaping = !1;
              const superiorLanding = this.getSuperiorPlayerAttacker(p, l);
              if (superiorLanding) {
                p.desistedAndLeaving = true;
                p.leavingCombatTimer = 20.0;
                p.giveUpPursuitTimer = 35.0;
                p.fleeFromCombatX = l.x;
                p.fleeFromCombatY = l.y;
                p.aggroTimer = 0;
                p.attackCooldown = 10.0;
                if (!p._desistTextShown) {
                  p._desistTextShown = true;
                  this.floatingTexts.push({
                    id: `flee_${this.nextId++}`,
                    x: p.x,
                    y: p.y - 18,
                    text: "Desistiu do ataque!",
                    color: "#94a3b8",
                    isCrit: !1,
                    life: 1.3,
                  });
                }
                const esc = this.pickFleeAngle(p, l.x, l.y, t, (p.speed || 1) * 2.3);
                p.vx = Math.cos(esc) * ((p.speed || 1) * 2.3);
                p.vy = Math.sin(esc) * ((p.speed || 1) * 2.3);
                p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
                const _m = this.engine.moveWithSlide(p.x, p.y, p.vx * t * 60, p.vy * t * 60, false);
                p.x = _m.x;
                p.y = _m.y;
                continue;
              }
              const te = this.getAnimalFireDeterrence(p, l);
              if (j <= 26 && !l.isDead && te.canAttack) {
                ((p.attached = !0), (p.poisonTickCooldown = 0.5));
                const oe = this.monsters.filter(
                    (C) =>
                      C.id !== p.id &&
                      C.type === "slime" &&
                      C.attached &&
                      C.hp > 0,
                  ).length,
                  Ne = [
                    { dx: -6, dy: -8 },
                    { dx: 7, dy: -12 },
                    { dx: 0, dy: 3 },
                    { dx: 6, dy: -6 },
                    { dx: -7, dy: -12 },
                    { dx: 0, dy: -14 },
                  ],
                  X = Ne[oe % Ne.length];
                if (
                  ((p.attachOffsetX = X.dx),
                  (p.attachOffsetY = X.dy),
                  (p.x = l.x + X.dx),
                  (p.y = l.y + X.dy),
                  (l.poisonTimer = Math.max(l.poisonTimer || 0, 6.5)),
                  !l.invulnerableTimer || l.invulnerableTimer <= 0)
                ) {
                  const C = Math.max(1, Math.round(p.attack * 0.45 - c * 0.2));
                  ((l.hp = Math.max(0, (l.hp ?? 100) - C)),
                    (v = this.audio) == null || v.playPlayerHurt(),
                    l.hp <= 0 && !l.isDead && this.handlePlayerDeath(l));
                }
                this.floatingTexts.push({
                  id: `grud_${this.nextId++}`,
                  x: l.x,
                  y: l.y - 20,
                  text: "GRUDOU!",
                  color: "#4ade80",
                  isCrit: !1,
                  life: 0.95,
                });
                for (let C = 0; C < 6; C++) {
                  const I = Math.random() * Math.PI * 2;
                  this.slimeParticles.push({
                    x: l.x,
                    y: l.y - 8,
                    vx: Math.cos(I) * 3,
                    vy: Math.sin(I) * 3,
                    life: 0.5,
                    maxLife: 0.5,
                    type: "poison",
                    color: "#4ade80",
                    size: 2,
                  });
                }
              } else p.attackCooldown = 0.8;
            }
            continue;
          }
          const ne = this.isShallowWater(P, A),
            ke = this.isPositionInShade(p.x, p.y, m, p.isUnderground),
            isRainingNow =
              !p.isUnderground &&
              typeof window !== "undefined" &&
              window.weatherSystem &&
              typeof window.weatherSystem.isWetWeather === "function" &&
              window.weatherSystem.isWetWeather(),
            G = !p.isUnderground && !ne && !ke && f && !isRainingNow;
          ((p.inWater = ne || isRainingNow),
            (p.inShadow = ke || isRainingNow),
            (p.inSun = G),
            ne &&
              Math.random() < t * 1.5 &&
              this.slimeParticles.push({
                x: p.x + (Math.random() - 0.5) * 12 * p.scale,
                y: p.y + 2 * p.scale,
                vx: (Math.random() - 0.5) * 5,
                vy: -8 - Math.random() * 6,
                life: 0.7,
                maxLife: 0.7,
                type: "bubble",
                color: "#38bdf8",
                size: 1.4 + Math.random() * 1.2,
              }),
            G &&
              Math.random() < t * 1.8 &&
              this.slimeParticles.push({
                x: p.x + (Math.random() - 0.5) * 10 * p.scale,
                y: p.y - 8 * p.scale,
                vx: (Math.random() - 0.5) * 6,
                vy: -14 - Math.random() * 8,
                life: 0.6,
                maxLife: 0.6,
                type: "vapor",
                color: "rgba(255, 255, 255, 0.5)",
                size: 1.8 + Math.random() * 1.5,
              }));
          const superiorSlime = this.getSuperiorPlayerAttacker(p, l);
          if (superiorSlime) {
            p.desistedAndLeaving = true;
            p.leavingCombatTimer = 20.0;
            p.giveUpPursuitTimer = 35.0;
            p.fleeFromCombatX = l.x;
            p.fleeFromCombatY = l.y;
            p.aggroTimer = 0;
            p.attackCooldown = Math.max(p.attackCooldown || 0, 10.0);
            if (!p._desistTextShown) {
              p._desistTextShown = true;
              this.floatingTexts.push({
                id: `flee_${this.nextId++}`,
                x: p.x,
                y: p.y - 18,
                text: "Desistiu do ataque!",
                color: "#94a3b8",
                isCrit: !1,
                life: 1.3,
              });
            }
            const fleeSpd = (p.speed || 1) * 2.3;
            const esc = this.pickFleeAngle(p, l.x, l.y, t, fleeSpd);
            p.vx = Math.cos(esc) * fleeSpd;
            p.vy = Math.sin(esc) * fleeSpd;
            p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
            const moveStepX = p.vx * t * 60;
            const moveStepY = p.vy * t * 60;
            const _m = this.engine.moveWithSlide(p.x, p.y, moveStepX, moveStepY, false);
            p.x = _m.x;
            p.y = _m.y;
            p.isMoving = true;
            continue;
          }
          const de = this.getAnimalFireDeterrence(p, l);
          if (
            ((p.attackCooldown = Math.max(0, (p.attackCooldown || 0) - t)),
            j < 58 && j > 14 && p.attackCooldown <= 0 && de.canAttack)
          ) {
            ((p.isLeaping = !0),
              (p.leapProgress = 0),
              (p.leapStartX = p.x),
              (p.leapStartY = p.y),
              (p.leapTargetX =
                l.x +
                (l.isMoving
                  ? l.direction === "left"
                    ? -10
                    : l.direction === "right"
                      ? 10
                      : 0
                  : 0)),
              (p.leapTargetY =
                l.y +
                (l.isMoving
                  ? l.direction === "up"
                    ? -10
                    : l.direction === "down"
                      ? 10
                      : 0
                  : 0)),
              (p.attackCooldown = 1.6));
            continue;
          }
        }
        ((p.wanderTimer -= t),
          (p.attackCooldown = Math.max(0, (p.attackCooldown || 0) - t)),
          p.fireFearTimer &&
            p.fireFearTimer > 0 &&
            (p.fireFearTimer = Math.max(0, p.fireFearTimer - t)),
          p.fleeFireTimer &&
            p.fleeFireTimer > 0 &&
            (p.fleeFireTimer = Math.max(0, p.fleeFireTimer - t)),
          p.giveUpPursuitTimer &&
            p.giveUpPursuitTimer > 0 &&
            (p.giveUpPursuitTimer = Math.max(0, p.giveUpPursuitTimer - t)),
          p.aggroTimer &&
            p.aggroTimer > 0 &&
            (p.aggroTimer = Math.max(0, p.aggroTimer - t)));
        const x = this.engine.getClosestLitCampfire(p.x, p.y, 650),
          M = x ? Math.hypot(p.x - x.fireX, p.y - x.fireY) : 1 / 0,
          $ = x ? x.lightRadius * 0.5 : 0;
        if (!l.hasTorch && !(x && M < $ * 1.6)) {
          p.fleeFireTimer = 0;
          if (!p.desistedAndLeaving) {
            p.giveUpPursuitTimer = 0;
            p.attackCooldown = Math.min(p.attackCooldown || 0, 0.3);
          }
          p.fireFearTimer = 0;
        }
        // Escorpiões e aranhas da caverna detectam Tardígrados (seus predadores naturais) e fogem apavorados!
        let tardigradeThreat = null;
        if ((p.type === "scorpion" || p.type === "spider") && !p.isGiantScorpion && !p.burrowing) {
          for (const m of this.monsters) {
            if (m.type === "tardigrade" && m.hp > 0 && m.isUnderground === p.isUnderground) {
              const d = Math.hypot(m.x - p.x, m.y - p.y);
              if (d < (160 + (m.scale || 1) * 30)) {
                tardigradeThreat = m;
                break;
              }
            }
          }
        }
        if (tardigradeThreat) {
          const fleeG = this.pickFleeAngle(p, tardigradeThreat.x, tardigradeThreat.y, t, p.speed * 1.45);
          p.targetAngle = fleeG;
          const fleeSpd = p.speed * 1.45;
          ((p.vx = Math.cos(fleeG) * fleeSpd),
            (p.vy = Math.sin(fleeG) * fleeSpd),
            (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)));
          if (!p.alertEffectTimer || p.alertEffectTimer <= 0) {
            p.alertEffectTimer = 2.5;
          }
          continue;
        }
        const z = this.getAnimalFireDeterrence(p, l),
          weatherMod =
            typeof window !== "undefined" &&
            window.weatherSystem &&
            typeof window.weatherSystem.getCreatureWeatherBehavior === "function"
              ? window.weatherSystem.getCreatureWeatherBehavior(p, l, t, this)
              : { visionMult: 1, speedMult: 1, forceRetreat: !1, seekShelter: !1 },
          wSpeedMult = weatherMod.speedMult || 1,
          wVisMult = weatherMod.visionMult || 1,
          K = gl(p.type) && !!(x && M < $),
          V = gl(p.type) && !!(l.hasTorch && j < 58 && !l.isDead),
          O = gl(p.type) && !!((p.fleeFireTimer || 0) > 0 && x && M < $ * 1.6),
          _ = K || V || O,
          NC = gl(p.type) && ((p.giveUpPursuitTimer || 0) > 0 || !z.canAttack || weatherMod.forceRetreat);
        const meleeAttackDist = p.isGiantScorpion ? 105 : p.type === "scorpion" ? ((p.scale || 0.58) <= 0.65 ? 24 : 32) : p.type === "tardigrade" ? Math.max(28, Math.round(30 * (p.scale || 1) * 0.95)) : p.type === "wolf" ? 30 : 26,
          chaseStopDist = p.isGiantScorpion ? 78 : p.type === "scorpion" ? ((p.scale || 0.58) <= 0.65 ? 18 : 24) : p.type === "tardigrade" ? Math.max(20, Math.round(22 * (p.scale || 1) * 0.95)) : 22;
        if (weatherMod.forceRetreat) {
          // Criaturas de fogo (Dragão Ancião, Golem Magmático) recuando da chuva/neve ou criaturas assustadas por raios!
          p.attackCooldown = Math.max(p.attackCooldown || 0, 1.5);
          p.isLeaping && (p.isLeaping = !1);
          const retreatAngle = this.pickFleeAngle(
            p,
            weatherMod.retreatFromX ?? l.x,
            weatherMod.retreatFromY ?? l.y,
            t,
            p.speed * wSpeedMult,
          );
          p.targetAngle = retreatAngle;
          const rSpd = p.speed * wSpeedMult;
          p.vx = Math.cos(retreatAngle) * rSpd;
          p.vy = Math.sin(retreatAngle) * rSpd;
          p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
        } else if (_) {
          ((!p.fleeFireTimer || p.fleeFireTimer <= 0) &&
            (p.fleeFireTimer = 3.5),
            (p.giveUpPursuitTimer = 8),
            (p.attackCooldown = Math.max(p.attackCooldown || 0, 3.5)),
            p.isLeaping && (p.isLeaping = !1),
            p.attached &&
              ((p.attached = !1),
              (l.attachedSlimes = Math.max(0, (l.attachedSlimes || 1) - 1))),
            (!p.fireFearTimer || p.fireFearTimer <= 0) &&
              (p.fireFearTimer = 2.5));
          const ne = V ? l.x : x.fireX,
            ke = V ? l.y : x.fireY,
            G = this.pickFleeAngle(p, ne, ke, t, p.speed * 1.55);
          p.targetAngle = G;
          const de = p.speed * 1.55;
          ((p.vx = Math.cos(G) * de),
            (p.vy = Math.sin(G) * de),
            (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)),
            (p.exploreTimer = 1.5));
        } else if (
          NC &&
          !creatureBehavior(p.type).hunter &&
          !isPreyType(p.type)
        )
          this.steerAnimalExploration(p, t, x, f, m);
        else if (isPreyType(p.type)) {
          this.updatePreyAI(p, t, l);
          p.vx *= wSpeedMult;
          p.vy *= wSpeedMult;
        } else if (p.isGiantScorpion && !NC && !l.isDead && j < ((p.aggroTimer || 0) > 0 ? 580 : 320 * wVisMult) && z.canAttack) {
          // Escorpião Gigante: persegue na velocidade do player correndo e ataca de forma independente com a garra mais próxima quando estiver no alcance!
          if (j > chaseStopDist) {
            const chaseSpeed = p.speed * wSpeedMult;
            const G = this.steerAroundObstacles(p, l.x, l.y, chaseSpeed, !1);
            ((p.vx = Math.cos(G) * chaseSpeed),
              (p.vy = Math.sin(G) * chaseSpeed),
              (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)));
          } else {
            ((p.vx = 0),
              (p.vy = 0),
              (p.facing = this.getMonsterFacingToTarget(
                p.x,
                p.y,
                l.x,
                l.y,
                p.facing,
              )));
          }
          // Verifica de forma independente se as garras estão no alcance do player e escolhe a garra mais próxima do alvo!
          if ((!p.clawAttackCooldown || p.clawAttackCooldown <= 0) && (!p.clawAttackTimer || p.clawAttackTimer <= 0) && (!l.invulnerableTimer || l.invulnerableTimer <= 0)) {
            let closestClawSide = -1;
            let closestClawDist = 1 / 0;
            if (typeof getScorpionHitColliders === "function") {
              const cols = getScorpionHitColliders(p);
              for (const col of cols) {
                if (col.part === "claw_left" || col.part === "claw_right") {
                  const dClaw = Math.hypot(l.x - col.x, l.y - col.y);
                  if (dClaw < closestClawDist) {
                    closestClawDist = dClaw;
                    closestClawSide = col.side;
                  }
                }
              }
            } else {
              closestClawDist = j;
              closestClawSide = (p.facing === "down" || p.facing === "up")
                ? (l.x < p.x ? -1 : 1)
                : (l.y < p.y ? -1 : 1);
            }
            // Se a garra mais próxima está dentro do alcance de bote da garra (~82px da ponta da garra ou j <= 105)
            if (closestClawDist <= 82 || j <= 105) {
              p.attackClawSide = closestClawSide;
              p.clawTargetX = l.x;
              p.clawTargetY = l.y;
              p.clawAttackDuration = 0.36;
              p.clawAttackTimer = p.clawAttackDuration;
              p.clawHitApplied = !1;
              p.clawGroundDustSpawned = !1;
              p.attackPlayerDef = c;
              p.clawAttackCooldown = 0.85;
              // Sincroniza campos legados para compatibilidade
              p.attackType = "claw";
              p.attackDuration = p.clawAttackDuration;
              p.attackTimer = p.clawAttackTimer;
              p.attackTargetX = l.x;
              p.attackTargetY = l.y;
            }
          }
          // Verifica de forma independente o ataque do ferrão quando o player está no alcance do ferrão
          if ((!p.stingerAttackCooldown || p.stingerAttackCooldown <= 0) && (!p.stingerAttackTimer || p.stingerAttackTimer <= 0) && (!l.invulnerableTimer || l.invulnerableTimer <= 0) && j <= 115) {
            p.stingerTargetX = l.x;
            p.stingerTargetY = l.y;
            p.stingerAttackDuration = 0.44;
            p.stingerAttackTimer = p.stingerAttackDuration;
            p.stingerHitApplied = !1;
            p.attackPlayerDef = c;
            p.stingerAttackCooldown = 2.1;
          }
        } else if (p.isQueen && (() => {
          const pTx = Math.floor(l.x / this.engine.tileSize);
          const pTy = Math.floor(l.y / this.engine.tileSize);
          const pTile = this.engine.getTile(pTx, pTy);
          const nest = typeof this.engine.getDesertTardigradeNest === "function"
            ? this.engine.getDesertTardigradeNest(pTx, pTy)
            : null;
          const playerInNest = !!(
            (pTile && pTile.isTardigradeNest) ||
            (typeof this.engine.isTardigradeNest === "function" && this.engine.isTardigradeNest(pTx, pTy)) ||
            (nest && Math.hypot(pTx - nest.cx, pTy - nest.cy) <= (nest.radius + 1.0))
          );
          return !playerInNest;
        })()) {
          // RAINHA DOS TARDÍGRADOS: NÃO PERSEGUE O JOGADOR SE ELE SAIR DO NINHO!
          // Permanece guardando sua câmara, ninhada e ovos.
          p.aggroTimer = 0;
          const qTx = Math.floor(p.x / this.engine.tileSize);
          const qTy = Math.floor(p.y / this.engine.tileSize);
          const nest = typeof this.engine.getDesertTardigradeNest === "function"
            ? this.engine.getDesertTardigradeNest(qTx, qTy)
            : null;
          if (nest) {
            const nestCenterX = nest.cx * this.engine.tileSize + 16;
            const nestCenterY = nest.cy * this.engine.tileSize + 16;
            const distFromNestCenter = Math.hypot(p.x - nestCenterX, p.y - nestCenterY);
            if (distFromNestCenter > 3.2 * this.engine.tileSize) {
              const returnAngle = this.steerAroundObstacles(p, nestCenterX, nestCenterY, p.speed * 0.75, !1);
              p.vx = Math.cos(returnAngle) * (p.speed * 0.75);
              p.vy = Math.sin(returnAngle) * (p.speed * 0.75);
              p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
            } else {
              p.wanderTimer = (p.wanderTimer || 0) - t;
              if (p.wanderTimer <= 0) {
                p.wanderTimer = 2.0 + Math.random() * 2.5;
                if (Math.random() < 0.35) {
                  p.vx = 0;
                  p.vy = 0;
                } else {
                  p.targetAngle = Math.random() * Math.PI * 2;
                  p.vx = Math.cos(p.targetAngle) * (p.speed * 0.55);
                  p.vy = Math.sin(p.targetAngle) * (p.speed * 0.55);
                  p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
                }
              }
            }
          }
        } else if (!NC && !l.isDead && (j < ((p.aggroTimer || 0) > 0 ? 550 : (p.type === "tardigrade" ? Math.round(220 * Math.max(1, (p.scale || 1) * 0.75)) : (p.isGiantScorpion ? 260 : 150)) * wVisMult)) && j > chaseStopDist && z.canAttack) {
          const superiorAttacker = this.getSuperiorPlayerAttacker(p, l);
          if (superiorAttacker) {
            // Criatura mais forte está na luta: desiste do ataque e vai embora!
            p.desistedAndLeaving = true;
            p.leavingCombatTimer = 20.0;
            p.giveUpPursuitTimer = 35.0;
            p.fleeFromCombatX = l.x;
            p.fleeFromCombatY = l.y;
            p.aggroTimer = 0;
            p.attackCooldown = Math.max(p.attackCooldown || 0, 10.0);
            if (p.wolfAttackState) p.wolfAttackState = null;
            if (!p._desistTextShown) {
              p._desistTextShown = true;
              this.floatingTexts.push({
                id: `flee_${this.nextId++}`,
                x: p.x,
                y: p.y - 18,
                text: "Desistiu do ataque!",
                color: "#94a3b8",
                isCrit: !1,
                life: 1.3,
              });
            }
            const fleeSpd = (p.speed || 1) * 2.3;
            const avoidAng = this.pickFleeAngle(p, l.x, l.y, t, fleeSpd);
            p.vx = Math.cos(avoidAng) * fleeSpd;
            p.vy = Math.sin(avoidAng) * fleeSpd;
            p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
            const moveStepX = p.vx * t * 60;
            const moveStepY = p.vy * t * 60;
            const _m = this.engine.moveWithSlide(p.x, p.y, moveStepX, moveStepY, false);
            p.x = _m.x;
            p.y = _m.y;
            p.isMoving = true;
            continue;
          } else {
            // Lobo ou predador superior avançando contra o jogador: faz criaturas fracas (como gosmas) dispersarem imediatamente!
            if (p.type === "wolf" || this.getCreatureCombatTier(p) >= 55) {
              this.dismissInferiorAttackers(p, l);
            }
            const de = (p.type === "slime" && p.inWater ? 1.15 : 1) * ((p.aggroTimer || 0) > 0 ? 1.25 : 1) * wSpeedMult;
            const chaseSpeed = p.speed * de;
            const G = this.steerAroundObstacles(p, l.x, l.y, chaseSpeed, !1);
            ((p.vx = Math.cos(G) * chaseSpeed),
              (p.vy = Math.sin(G) * chaseSpeed),
              (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)));
          }
        } else if (!NC && !l.isDead && j <= meleeAttackDist && z.canAttack) {
          const superiorAttacker = this.getSuperiorPlayerAttacker(p, l);
          if (superiorAttacker) {
            // Criatura mais forte está na luta: desiste do ataque e vai embora!
            p.desistedAndLeaving = true;
            p.leavingCombatTimer = 20.0;
            p.giveUpPursuitTimer = 35.0;
            p.fleeFromCombatX = l.x;
            p.fleeFromCombatY = l.y;
            p.aggroTimer = 0;
            p.attackCooldown = Math.max(p.attackCooldown || 0, 10.0);
            if (p.wolfAttackState) p.wolfAttackState = null;
            if (!p._desistTextShown) {
              p._desistTextShown = true;
              this.floatingTexts.push({
                id: `flee_${this.nextId++}`,
                x: p.x,
                y: p.y - 18,
                text: "Desistiu do ataque!",
                color: "#94a3b8",
                isCrit: !1,
                life: 1.3,
              });
            }
            const fleeSpd = (p.speed || 1) * 2.3;
            const avoidAng = this.pickFleeAngle(p, l.x, l.y, t, fleeSpd);
            p.vx = Math.cos(avoidAng) * fleeSpd;
            p.vy = Math.sin(avoidAng) * fleeSpd;
            p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
            const moveStepX = p.vx * t * 60;
            const moveStepY = p.vy * t * 60;
            const _m = this.engine.moveWithSlide(p.x, p.y, moveStepX, moveStepY, false);
            p.x = _m.x;
            p.y = _m.y;
            p.isMoving = true;
            continue;
          } else {
            ((p.vx = 0),
              (p.vy = 0),
              (p.facing = this.getMonsterFacingToTarget(
                p.x,
                p.y,
                l.x,
                l.y,
                p.facing,
              )),
              p.attackCooldown <= 0 &&
                (!l.invulnerableTimer || l.invulnerableTimer <= 0) &&
                ((p.attackCooldown =
                  (creatureBehavior(p.type).attackCooldown ?? 1.25)),
                this.monsterAttackPlayer(p, l, c)));
          }
        }
        else if (creatureBehavior(p.type).hunter && (!p.aggroTimer || p.aggroTimer <= 0) && !p.isQueen) {
          const hunterAI = creatureBehavior(p.type).hunter;
          const G = this.getNearestPreyForWolf(p.x, p.y, hunterAI.huntRadius * wVisMult, p.isUnderground, p);
          if (G)
            if (Math.hypot(G.x - p.x, G.y - p.y) > (hunterAI.meleeRange + (p.scale || 1) * 6)) {
              const le = p.speed * hunterAI.huntSpeedMult * wSpeedMult;
              const W = this.steerAroundObstacles(p, G.x, G.y, le, !1);
              ((p.vx = Math.cos(W) * le),
                (p.vy = Math.sin(W) * le),
                (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)));
            } else
              ((p.vx = 0),
                (p.vy = 0),
                (p.facing = this.getMonsterFacingToTarget(
                  p.x,
                  p.y,
                  G.x,
                  G.y,
                  p.facing,
                )),
                p.attackCooldown <= 0 &&
                  ((p.attackCooldown = hunterAI.attackCooldownPrey), this.wolfAttackPrey(p, G)));
          else
            p.wanderTimer <= 0 &&
              ((p.wanderTimer = hunterAI.wanderWait[0] + Math.random() * hunterAI.wanderWait[1]),
              Math.random() < hunterAI.idleChance
                ? ((p.vx = 0), (p.vy = 0))
                : ((p.targetAngle = Math.random() * Math.PI * 2),
                  (p.vx = Math.cos(p.targetAngle) * (p.speed * hunterAI.wanderSpeedMult * wSpeedMult)),
                  (p.vy = Math.sin(p.targetAngle) * (p.speed * hunterAI.wanderSpeedMult * wSpeedMult)),
                  (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing))));
        } else if ((p.type === "slime" && p.inSun) || weatherMod.seekShelter)
          if (
            ((p.shelterCooldown = (p.shelterCooldown || 0) - t),
            p.shelterCooldown <= 0 &&
              ((p.shelterCooldown = 1.6 + Math.random() * 0.8),
              (p.shelterTarget = this.findNearestShelter(
                p.x,
                p.y,
                m,
                p.isUnderground,
              ))),
            p.shelterTarget)
          )
            if (
              Math.hypot(p.shelterTarget.x - p.x, p.shelterTarget.y - p.y) < 16
            )
              ((p.shelterTarget = null), (p.shelterCooldown = 2), (p.vx = 0), (p.vy = 0));
            else {
              const de = Math.atan2(
                  p.shelterTarget.y - p.y,
                  p.shelterTarget.x - p.x,
                ),
                W = p.speed * 1.1 * wSpeedMult;
              ((p.vx = Math.cos(de) * W),
                (p.vy = Math.sin(de) * W),
                (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)));
            }
          else
            p.wanderTimer <= 0 &&
              ((p.wanderTimer = 1 + Math.random() * 1.2),
              (p.targetAngle = Math.random() * Math.PI * 2),
              (p.vx = Math.cos(p.targetAngle) * (p.speed * 0.85 * wSpeedMult)),
              (p.vy = Math.sin(p.targetAngle) * (p.speed * 0.85 * wSpeedMult)),
              (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)));
        else if (p.type === "slime") {
          if (p.wanderTimer <= 0)
            if (
              ((p.wanderTimer = 2 + Math.random() * 2.2), Math.random() < 0.35)
            )
              ((p.vx = 0), (p.vy = 0));
            else {
              let G = Math.random() * Math.PI * 2;
              const de = (p.inWater ? p.speed * 0.75 : p.speed * 0.55) * wSpeedMult,
                W = p.x + Math.cos(G) * de * 24,
                le = p.y + Math.sin(G) * de * 24,
                te = Math.floor(W / this.engine.tileSize),
                oe = Math.floor(le / this.engine.tileSize);
              (!p.isUnderground &&
                !this.isShallowWater(te, oe) &&
                !this.isPositionInShade(W, le, m, p.isUnderground) &&
                f &&
                Math.random() < 0.85 &&
                (G += Math.PI),
                (p.targetAngle = G),
                (p.vx = Math.cos(G) * de),
                (p.vy = Math.sin(G) * de),
                (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing)));
            }
        } else
          p.wanderTimer <= 0 &&
            ((p.wanderTimer = 1.8 + Math.random() * 2.5),
            Math.random() < 0.35
              ? ((p.vx = 0), (p.vy = 0))
              : ((p.targetAngle = Math.random() * Math.PI * 2),
                (p.vx = Math.cos(p.targetAngle) * (p.speed * 0.55 * wSpeedMult)),
                (p.vy = Math.sin(p.targetAngle) * (p.speed * 0.55 * wSpeedMult)),
                (p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing))));
        !_ &&
          gl(p.type) &&
          x &&
          !(!NC && !l.isDead && j < 150 && z.canAttack) &&
          this.avoidFireZone(p, x, $);
        const moveStepX = p.vx * t * 60,
          moveStepY = p.vy * t * 60;
        const attemptedDist = Math.hypot(moveStepX, moveStepY);
        p.isMoving = attemptedDist > 0.001;
        if (attemptedDist > 0.001) {
          const _m = this.engine.moveWithSlide(
            p.x,
            p.y,
            moveStepX,
            moveStepY,
            !1,
          );
          const actualMoved = Math.hypot(_m.x - p.x, _m.y - p.y);
          p.x = _m.x;
          p.y = _m.y;
          if (_m.blocked) {
            if (actualMoved < attemptedDist * 0.3) {
              p.contourSide = (p.contourSide || 1) * -1;
              p.contourTimer = 0.7;
              if (p.wanderTimer > 0) p.wanderTimer = 0;
            }
          }
        } else {
          p.isMoving = !1;
        }
      }
      const g = this.monsters.filter(
        (S) => S.type === "slime" && S.attached && S.hp > 0,
      ).length;
      l.attachedSlimes = g;
      const y = !!(
        l.fireProtected ||
        l.hasTorch ||
        l.isNearCampfire ||
        this.engine.isNearLitCampfire(l.x, l.y)
      );
      const hasSuperiorFight = this.monsters.some(
        (m) => m.hp > 0 && this.getCreatureCombatTier(m) > 15 && this.isCreatureAttackingPlayer(m, l)
      );
      if (g > 0 && !l.isDead && !y && !hasSuperiorFight) {
        if (((this.slimeSwarmTimer -= t), this.slimeSwarmTimer <= 0)) {
          this.slimeSwarmTimer = 2;
          const S = this.monsters.filter(
            (p) => p.type === "slime" && p.hp > 0,
          ).length;
          if (S < 9) {
            const p = Math.min(9 - S, Math.random() < 0.5 ? 1 : 2);
            for (let j = 0; j < p; j++) this.spawnSwarmSlimeNearPlayer(l, o, u);
          }
        }
      } else this.slimeSwarmTimer = 2;
      if (
        (y && l.poisonTimer && l.poisonTimer > 0 && (l.poisonTimer = 0),
        l.poisonTimer &&
          l.poisonTimer > 0 &&
          !l.isDead &&
          ((l.poisonTimer = Math.max(0, l.poisonTimer - t)),
          (l.poisonTickTimer = (l.poisonTickTimer || 1) - t),
          l.poisonTickTimer <= 0))
      ) {
        l.poisonTickTimer = 1;
        const S = 2;
        ((l.hp = Math.max(0, (l.hp ?? 100) - S)),
          (T = this.audio) == null || T.playPlayerHurt(),
          this.floatingTexts.push({
            id: `pois_${this.nextId++}`,
            x: l.x,
            y: l.y - 18,
            text: `-${S} ☠ Veneno`,
            color: "#4ade80",
            isCrit: !1,
            life: 0.9,
          }),
          l.hp <= 0 && !l.isDead && this.handlePlayerDeath(l));
        for (let p = 0; p < 3; p++)
          this.slimeParticles.push({
            x: l.x + (Math.random() - 0.5) * 12,
            y: l.y - 8 + Math.random() * 8,
            vx: (Math.random() - 0.5) * 5,
            vy: -10 - Math.random() * 8,
            life: 0.55,
            maxLife: 0.55,
            type: "poison",
            color: "#4ade80",
            size: 1.8,
          });
      }
      // Efeito de Sangramento no jogador (mordida do lobo no pescoço: 2 de dano/s por 3 segundos)
      if (
        l.bleedTimer &&
        l.bleedTimer > 0 &&
        !l.isDead
      ) {
        l.bleedTimer = Math.max(0, l.bleedTimer - t);
        l.bleedTickTimer = (l.bleedTickTimer || 1) - t;
        if (l.bleedTickTimer <= 0) {
          l.bleedTickTimer = 1;
          const bleedDmg = 2;
          l.hp = Math.max(0, (l.hp ?? 100) - bleedDmg);
          var audioBleed = this.audio;
          audioBleed?.playPlayerHurt?.();
          this.floatingTexts.push({
            id: `bleed_${this.nextId++}`,
            x: l.x,
            y: l.y - 18,
            text: `-${bleedDmg} 🩸 Sangramento`,
            color: "#ef4444",
            isCrit: !1,
            life: 0.9,
          });
          for (let p = 0; p < 4; p++) {
            this.slimeParticles.push({
              x: l.x + (Math.random() - 0.5) * 10,
              y: l.y - 10 + Math.random() * 6,
              vx: (Math.random() - 0.5) * 3,
              vy: 2 + Math.random() * 3,
              life: 0.45,
              maxLife: 0.45,
              type: "blood",
              color: "#dc2626",
              size: 1.8,
            });
          }
          if (l.hp <= 0 && !l.isDead) this.handlePlayerDeath(l);
        }
      }
      ((this.spawnCooldown -= t),
        this.spawnCooldown <= 0 &&
          this.monsters.length < 7 &&
          !l.isDead &&
          ((this.spawnCooldown = 2 + Math.random() * 1.5),
          this.spawnMonsterNearPlayer(l, o, u, m)));
      if (o && !l.isDead) {
        this.checkTardigradeNestEncounter(l);
      }
      for (let S = this.floatingTexts.length - 1; S >= 0; S--) {
        const p = this.floatingTexts[S];
        ((p.life -= t * 1.8),
          (p.y -= t * 32),
          p.life <= 0 && this.floatingTexts.splice(S, 1));
      }
      for (let S = this.pebbleProjectiles.length - 1; S >= 0; S--) {
        const p = this.pebbleProjectiles[S];
        p.progress = Math.min(1, p.progress + t / p.duration);
        const arc = Math.sin(p.progress * Math.PI) * 18;
        const curX = p.startX + (p.targetX - p.startX) * p.progress;
        const curY = p.startY + (p.targetY - p.startY) * p.progress;
        p.x = curX;
        p.y = curY - arc;
        this.slashEffects.push({
          kind: "pebble",
          x: p.x,
          y: p.y,
          angle: p.angle,
          progress: p.progress,
          trail: !0,
        });
        let hitMonster = null;
        if (p.progress > 0.08) {
          for (const m of this.monsters) {
            if (m.hp <= 0 || m.isUnderground !== p.underground) continue;
            let dist = Math.hypot(m.x - curX, m.y - curY);
            let mRadius = (m.size || 16) + 18;
            let hitLegPt = null;
            if (m.isGiantScorpion && typeof getScorpionHitColliders === "function") {
              const cols = getScorpionHitColliders(m);
              for (const col of cols) {
                if (col.isLeg || (col.part && col.part.startsWith("leg"))) {
                  const dLeg = Math.hypot(col.x - curX, col.y - curY);
                  if (dLeg <= (col.radius || 12) + 16) {
                    dist = dLeg;
                    mRadius = (col.radius || 12) + 16;
                    hitLegPt = { x: col.x, y: col.y };
                    break;
                  }
                }
              }
            }
            if (dist <= mRadius) {
              hitMonster = m;
              if (hitLegPt) hitMonster._hitImpactPoint = hitLegPt;
              break;
            }
          }
        }
        if (hitMonster || p.progress >= 1) {
          const impactPoint = hitMonster ? (hitMonster._hitImpactPoint ?? { x: hitMonster.x, y: hitMonster.y }) : { x: p.targetX, y: p.targetY };
          if (hitMonster) delete hitMonster._hitImpactPoint;
          const result = this.performAttack(p.player, p.damage, !1, p.underground, !0, p.angle, p.distance, impactPoint);
          const audio = this.audio;
          audio?.playHitImpact?.();
          if (result.hitCount > 0) {
            for (let i = 0; i < 6; i++) {
              this.hitParticles.push({
                x: impactPoint.x + (Math.random() - 0.5) * 12,
                y: impactPoint.y + (Math.random() - 0.5) * 12,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 3,
                life: 0.45,
                color: "#cbd5e1",
                size: 2.5 + Math.random() * 1.5,
              });
            }
          }
          this.pebbleProjectiles.splice(S, 1);
        }
      }
      for (let S = this.slashEffects.length - 1; S >= 0; S--) {
        const p = this.slashEffects[S];
        ((p.progress += t * 5.5),
          p.progress >= 1 && this.slashEffects.splice(S, 1));
      }
      for (let S = this.hitParticles.length - 1; S >= 0; S--) {
        const p = this.hitParticles[S];
        ((p.x += p.vx * t * 60),
          (p.y += p.vy * t * 60),
          (p.life -= t * 3.5),
          p.life <= 0 && this.hitParticles.splice(S, 1));
      }
      for (let S = this.slimeParticles.length - 1; S >= 0; S--) {
        const p = this.slimeParticles[S];
        if (p.type === "dust") {
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.x += p.vx * t * 60;
          p.y += p.vy * t * 60;
        } else {
          p.x += p.vx * t;
          p.y += p.vy * t;
        }
        p.life -= t;
        p.life <= 0 && this.slimeParticles.splice(S, 1);
      }
    }
    createGiantScorpion(spawnX, spawnY, player, withEmerge = true) {
      const baseScale = CREATURES.scorpion.spawnVariants.giant.scale; // 5 vezes maior que o escorpião normal (4.75)
      const giant = {
        id: `giant_scorpion_${this.nextId++}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: CREATURES.scorpion.spawnVariants.giant.name,
        type: "scorpion",
        isGiantScorpion: !0,
        size: 56,
        x: spawnX,
        y: spawnY,
        vx: 0,
        vy: 0,
        hp: CREATURES.scorpion.spawnVariants.giant.hp,
        maxHp: CREATURES.scorpion.spawnVariants.giant.hp,
        attack: CREATURES.scorpion.spawnVariants.giant.attack,
        defense: CREATURES.scorpion.spawnVariants.giant.defense,
        speed: (player.speed || 2.15) * 1.6 * 0.85 * 0.9,
        color: CREATURES.scorpion.spawnVariants.giant.color,
        accentColor: CREATURES.scorpion.spawnVariants.giant.accentColor,
        scale: baseScale,
        isUnderground: !1,
        isMoving: !1,
        hitFlashTimer: 0,
        animTimer: Math.random() * 10,
        wanderTimer: 0.6,
        targetAngle: Math.atan2(player.y - spawnY, player.x - spawnX),
        facing: this.getMonsterFacingToTarget(spawnX, spawnY, player.x, player.y, "down"),
        emerging: !!withEmerge,
        emergeDuration: withEmerge ? 1.25 : 0,
        emergeTimer: withEmerge ? 1.25 : 0,
        attackCooldown: 1.3,
      };
      this.monsters.push(giant);
      if (withEmerge) {
        for (let pIdx = 0; pIdx < 16; pIdx++) {
          const ang = Math.random() * Math.PI * 2,
            spd = 3 + Math.random() * 8;
          this.slimeParticles.push({
            x: spawnX + (Math.random() - 0.5) * 36,
            y: spawnY + (Math.random() - 0.5) * 18,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 6,
            life: 0.7,
            maxLife: 0.7,
            type: "mud",
            color: Math.random() < 0.5 ? "#f59e0b" : "#78350f",
            size: 3 + Math.random() * 2.5,
          });
        }
      }
      return giant;
    }
    spawnNightGiantScorpionNearPlayer(player) {
      const livingGiants = this.monsters.filter(
        (m) => m.type === "scorpion" && m.isGiantScorpion && m.hp > 0 && !m.burrowing
      ).length;
      if (livingGiants >= 3) return;

      const baseAngle = Math.random() * Math.PI * 2;
      for (let attempt = 0; attempt < 12; attempt++) {
        const tryDist = 240 + attempt * 24,
          tryAng = baseAngle + attempt * 0.45,
          cx = player.x + Math.cos(tryAng) * tryDist,
          cy = player.y + Math.sin(tryAng) * tryDist,
          tx = Math.floor(cx / this.engine.tileSize),
          ty = Math.floor(cy / this.engine.tileSize);
        if (
          this.engine.isTileCreaturePassable(tx, ty) &&
          !this.engine.isNearLitCampfire(cx, cy) &&
          this.engine.getBiome(tx, ty) === BiomeId.DESERT &&
          !(typeof window !== "undefined" && window.DesertCity && typeof window.DesertCity.getHouseAt === "function" && window.DesertCity.getHouseAt(tx, ty))
        ) {
          this.createGiantScorpion(cx, cy, player, Math.random() < 0.35);
          break;
        }
      }
    }
    triggerDesertNightGiantScorpions(player, isUnderground = !1) {
      if (isUnderground) return;
      // 1. Todos os escorpiões pequenos presentes se enterram na areia e somem
      for (const m of this.monsters) {
        if (m.type === "scorpion" && !m.isGiantScorpion && !m.isUnderground && !m.burrowing) {
          m.burrowing = !0;
          m.burrowDuration = 0.9;
          m.burrowTimer = 0.9;
          m.vx = 0;
          m.vy = 0;
        }
      }
      // 2. Cria até 3 Escorpiões Gigantes emergindo do chão ao cair da noite no deserto
      const existingGiants = this.monsters.filter(
        (m) => m.type === "scorpion" && m.isGiantScorpion && m.hp > 0 && !m.burrowing
      ).length;
      const toSpawn = Math.max(0, 3 - existingGiants);
      for (let i = 0; i < toSpawn; i++) {
        const baseAngle = (i / 3) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
        let spawnX = player.x + Math.cos(baseAngle) * 195,
          spawnY = player.y + Math.sin(baseAngle) * 195;
        for (let attempt = 0; attempt < 10; attempt++) {
          const tryDist = 165 + attempt * 18,
            tryAng = baseAngle + attempt * 0.35,
            cx = player.x + Math.cos(tryAng) * tryDist,
            cy = player.y + Math.sin(tryAng) * tryDist,
            tx = Math.floor(cx / this.engine.tileSize),
            ty = Math.floor(cy / this.engine.tileSize);
          if (
            this.engine.isTileCreaturePassable(tx, ty) &&
            !this.engine.isNearLitCampfire(cx, cy) &&
            !(typeof window !== "undefined" && window.DesertCity && typeof window.DesertCity.getHouseAt === "function" && window.DesertCity.getHouseAt(tx, ty))
          ) {
            spawnX = cx;
            spawnY = cy;
            break;
          }
        }
        this.createGiantScorpion(spawnX, spawnY, player, !0);
      }
      if (toSpawn > 0) {
        this.floatingTexts.push({
          id: `giant_scorp_alert_${this.nextId++}`,
          x: player.x,
          y: player.y - 34,
          text: `🦂 ${toSpawn === 3 ? "3 " : ""}Escorpiões Gigantes emergiram da areia!`,
          color: "#f59e0b",
          isCrit: !0,
          life: 2.2,
        });
      }
    }
    spawnBabyTardigradeAt(x, y) {
      const babySize = 0.44 + Math.random() * 0.12;
      const z = {
        id: `mob_${this.nextId++}_${Date.now()}`,
        name: "Tardígrado Filhote",
        type: "tardigrade",
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        hp: 18,
        maxHp: 18,
        attack: 2,
        defense: 4,
        speed: 0.48, // Filhotes lentos e fofos!
        color: "#f59e0b",
        accentColor: "#fef08a",
        scale: Math.round(babySize * 100) / 100,
        maxScale: 0.65,
        isUnderground: true,
        isBaby: true,
        isMoving: true,
        hitFlashTimer: 0,
        animTimer: Math.random() * 10,
        wanderTimer: 1.5,
        targetAngle: Math.random() * Math.PI * 2,
        facing: ["down", "left", "right", "up"][Math.floor(Math.random() * 4)],
      };
      this.monsters.push(z);
      return z;
    }
    checkTardigradeNestEncounter(l) {
      if (!l || l.isDead || !this.engine.isUnderground || this.engine.undergroundLevel === 3) return;
      const pTx = Math.floor(l.x / this.engine.tileSize);
      const pTy = Math.floor(l.y / this.engine.tileSize);
      const curTile = this.engine.getTile(pTx, pTy);
      if (curTile && curTile.isGeodeInterior) return;
      const isDesert = !!(
        (curTile && (curTile.isDesertCave || curTile.isTardigradeNest)) ||
        this.engine.activeCaveEntranceIsDesert
      );
      if (!isDesert) return;

      const nest = typeof this.engine.getDesertTardigradeNest === "function"
        ? this.engine.getDesertTardigradeNest(pTx, pTy)
        : null;
      if (!nest) return;

      const nestDist = Math.hypot(pTx - nest.cx, pTy - nest.cy);
      if (nestDist <= 16) {
        const nestWorldX = nest.cx * this.engine.tileSize + 16;
        const nestWorldY = nest.cy * this.engine.tileSize + 16;

        const hasQueen = !!(this.hasSpawnedTardigradeQueen || this.monsters.some(
          (m) => m.type === "tardigrade" && m.isQueen
        ));
        if (!hasQueen) {
          this.hasSpawnedTardigradeQueen = !0;
          const queenMonster = {
            id: `mob_${this.nextId++}_${Date.now()}`,
            name: "Rainha dos Tardígrados",
            type: "tardigrade",
            x: nestWorldX,
            y: nestWorldY,
            vx: 0,
            vy: 0,
            hp: 350,
            maxHp: 350,
            attack: 24,
            defense: 18,
            speed: 0.38, // Lenta e colossal!
            color: "#b45309",
            accentColor: "#fef08a",
            scale: 5.7, // DOBRO DO TAMANHO ANTERIOR!
            maxScale: 6.2,
            isUnderground: true,
            isQueen: true,
            isBoss: true,
            isMoving: false,
            hitFlashTimer: 0,
            animTimer: Math.random() * 10,
            wanderTimer: 2.2,
            targetAngle: Math.random() * Math.PI * 2,
            facing: "down",
          };
          this.monsters.push(queenMonster);

          // Inicializa o ninho com ninhada numerosa de filhotes lentos!
          for (let k = 0; k < 8; k++) {
            const ang = Math.random() * Math.PI * 2;
            const dist = (1.5 + Math.random() * 5.0) * this.engine.tileSize;
            const bx = nestWorldX + Math.cos(ang) * dist;
            const by = nestWorldY + Math.sin(ang) * dist;
            const bTx = Math.floor(bx / this.engine.tileSize);
            const bTy = Math.floor(by / this.engine.tileSize);
            if (this.engine.isTileCreaturePassable(bTx, bTy)) {
              this.spawnBabyTardigradeAt(bx, by);
            }
          }
        }

        const babyCount = this.monsters.filter(
          (m) => m.type === "tardigrade" && m.isBaby && m.isUnderground && Math.hypot(m.x - nestWorldX, m.y - nestWorldY) < 650
        ).length;

        const maxBabies = 12; // Maior quantidade de filhotes no ninho!
        if (babyCount < maxBabies) {
          const needed = Math.min(3, maxBabies - babyCount);
          for (let k = 0; k < needed; k++) {
            const ang = Math.random() * Math.PI * 2;
            const dist = (1.8 + Math.random() * 5.2) * this.engine.tileSize;
            const bx = nestWorldX + Math.cos(ang) * dist;
            const by = nestWorldY + Math.sin(ang) * dist;
            const bTx = Math.floor(bx / this.engine.tileSize);
            const bTy = Math.floor(by / this.engine.tileSize);
            if (this.engine.isTileCreaturePassable(bTx, bTy)) {
              this.spawnBabyTardigradeAt(bx, by);
            }
          }
        }
      }
    }
    spawnMonsterNearPlayer(t, l, o, u = 0.5) {
      const m = Math.random() * Math.PI * 2,
        c = 180 + Math.random() * 180;
      let f = t.x + Math.cos(m) * c,
        g = t.y + Math.sin(m) * c,
        y = Math.floor(f / this.engine.tileSize),
        w = Math.floor(g / this.engine.tileSize);
      if (
        !this.engine.isTileCreaturePassable(y, w) ||
        this.engine.isNearLitCampfire(f, g)
      )
        return;
      if (
        !l &&
        typeof window !== "undefined" &&
        window.SnowPeakCity &&
        typeof window.SnowPeakCity.isCityTerritory === "function" &&
        (window.SnowPeakCity.isCityTerritory(y, w) ||
          window.SnowPeakCity.isCityTerritory(
            Math.floor(t.x / this.engine.tileSize),
            Math.floor(t.y / this.engine.tileSize),
          ))
      )
        return;
      if (
        !l &&
        typeof window !== "undefined" &&
        window.DesertCity &&
        typeof window.DesertCity.isCityTerritory === "function" &&
        (window.DesertCity.isCityTerritory(y, w) ||
          window.DesertCity.isCityTerritory(
            Math.floor(t.x / this.engine.tileSize),
            Math.floor(t.y / this.engine.tileSize),
          ))
      )
        return;
      if (
        !l &&
        typeof window !== "undefined" &&
        window.PortCity &&
        typeof window.PortCity.isCityTerritory === "function" &&
        (window.PortCity.isCityTerritory(y, w) ||
          window.PortCity.isCityTerritory(
            Math.floor(t.x / this.engine.tileSize),
            Math.floor(t.y / this.engine.tileSize),
          ))
      )
        return;
      let v = "slime",
        T = CREATURES.slime.spawn.name,
        S = CREATURES.slime.spawn.color,
        p = CREATURES.slime.spawn.accentColor,
        j = CREATURES.slime.spawn.hp,
        P = CREATURES.slime.spawn.attack,
        A = CREATURES.slime.spawn.speed,
        x = CREATURES.slime.spawn.scale,
        customDef = null,
        isQueen = false,
        isBaby = false,
        isBoss = false;
      const M = o === BiomeId.SNOW_TAIGA || o === BiomeId.SNOW_PEAK || o === BiomeId.GLACIER,
        $ =
          o === BiomeId.DESERT ||
          o === BiomeId.CANYON ||
          o === BiomeId.SAVANNA ||
          o === BiomeId.BEACH ||
          o === BiomeId.VOLCANIC;
      if (o === BiomeId.MOUNTAIN_25D) {
        const K = Math.random();
        K < 0.38
          ? ((v = "golem"),
            (T = CREATURES.golem.spawnVariants.mountain.name),
            (S = CREATURES.golem.spawnVariants.mountain.color),
            (p = CREATURES.golem.spawnVariants.mountain.accentColor),
            (j = CREATURES.golem.spawnVariants.mountain.hp),
            (P = CREATURES.golem.spawnVariants.mountain.attack),
            (A = CREATURES.golem.spawnVariants.mountain.speed),
            (x = CREATURES.golem.spawnVariants.mountain.scale))
          : K < 0.72
            ? ((v = "wolf"),
              (T = CREATURES.wolf.spawn.name),
              (S = CREATURES.wolf.spawn.color),
              (p = CREATURES.wolf.spawn.accentColor),
              (j = CREATURES.wolf.spawn.hp),
              (P = CREATURES.wolf.spawn.attack),
              (A = CREATURES.wolf.spawn.speed),
              (x = CREATURES.wolf.spawn.scale))
            : ((v = "deer"),
              (T = CREATURES.deer.spawn.name),
              (S = CREATURES.deer.spawn.color),
              (p = CREATURES.deer.spawn.accentColor),
              (j = CREATURES.deer.spawn.hp),
              (P = CREATURES.deer.spawn.attack),
              (A = CREATURES.deer.spawn.speed),
              (x = CREATURES.deer.spawn.scale));
      } else if (M)
        ((v = "wolf"),
          (T = CREATURES.wolf.spawnVariants.snow.name),
          (S = CREATURES.wolf.spawnVariants.snow.color),
          (p = CREATURES.wolf.spawnVariants.snow.accentColor),
          (j = CREATURES.wolf.spawnVariants.snow.hp),
          (P = CREATURES.wolf.spawnVariants.snow.attack),
          (A = CREATURES.wolf.spawnVariants.snow.speed),
          (x = CREATURES.wolf.spawnVariants.snow.scale));
      else if ($)
        o === BiomeId.VOLCANIC
          ? Math.random() < 0.35
            ? ((v = "dragon"),
              (T = CREATURES.dragon.spawn.name),
              (S = CREATURES.dragon.spawn.color),
              (p = CREATURES.dragon.spawn.accentColor),
              (j = CREATURES.dragon.spawn.hp),
              (P = CREATURES.dragon.spawn.attack),
              (A = CREATURES.dragon.spawn.speed),
              (x = CREATURES.dragon.spawn.scale))
            : ((v = "golem"),
              (T = CREATURES.golem.spawn.name),
              (S = CREATURES.golem.spawn.color),
              (p = CREATURES.golem.spawn.accentColor),
              (j = CREATURES.golem.spawn.hp),
              (P = CREATURES.golem.spawn.attack),
              (A = CREATURES.golem.spawn.speed),
              (x = CREATURES.golem.spawn.scale))
          : ((v = "scorpion"),
            (T = CREATURES.scorpion.spawn.name),
            (S = CREATURES.scorpion.spawn.color),
            (p = CREATURES.scorpion.spawn.accentColor),
            (j = CREATURES.scorpion.spawn.hp),
            (P = CREATURES.scorpion.spawn.attack),
            (A = CREATURES.scorpion.spawn.speed),
            (x = CREATURES.scorpion.spawn.scale));
      else if (l) {
        if (this.engine.undergroundLevel === 3) {
          // Dentro do Geodo: NUNCA nascem tardígrados!
          const K = Math.random();
          K < 0.65
            ? ((v = "slime"),
              (T = CREATURES.slime.spawnVariants.geode.name),
              (S = CREATURES.slime.spawnVariants.geode.color),
              (p = CREATURES.slime.spawnVariants.geode.accentColor),
              (j = CREATURES.slime.spawnVariants.geode.hp),
              (P = CREATURES.slime.spawnVariants.geode.attack),
              (A = CREATURES.slime.spawnVariants.geode.speed),
              (x = CREATURES.slime.spawnVariants.geode.scale))
            : ((v = "bat"),
              (T = "Morcego Cristalino"),
              (S = "#6b21a8"),
              (p = "#e879f9"),
              (j = 18),
              (P = 5),
              (A = 1.2),
              (x = 0.9));
        } else {
        const isInPrisonEarthMine =
          typeof window !== "undefined" &&
          window.SnowPeakCity &&
          typeof window.SnowPeakCity.isPrisonMineArea === "function" &&
          window.SnowPeakCity.isPrisonMineArea(y, w);
        const spawnTile = this.engine.getTile(y, w);
        const curTile = this.engine.getTile(Math.floor(t.x / this.engine.tileSize), Math.floor(t.y / this.engine.tileSize));
        const isGeodeTile = !!(
          (spawnTile && spawnTile.isGeodeInterior) ||
          (curTile && curTile.isGeodeInterior) ||
          this.engine.undergroundLevel === 3
        );
        const isDesertCave = !isInPrisonEarthMine && !isGeodeTile && !!(
          (spawnTile && (spawnTile.isDesertCave || spawnTile.biome.id === BiomeId.DESERT_CAVE_FLOOR || spawnTile.biome.id === BiomeId.DESERT_CAVE_WALL)) ||
          (curTile && (curTile.isDesertCave || curTile.biome.id === BiomeId.DESERT_CAVE_FLOOR || curTile.biome.id === BiomeId.DESERT_CAVE_WALL)) ||
          (o === BiomeId.DESERT_CAVE_FLOOR || o === BiomeId.DESERT_CAVE_WALL || o === BiomeId.DESERT || o === BiomeId.CANYON) ||
          this.engine.activeCaveEntranceIsDesert ||
          (this.engine.activeCaveEntranceBiome && (this.engine.activeCaveEntranceBiome.id === BiomeId.DESERT || this.engine.activeCaveEntranceBiome.id === BiomeId.CANYON)) ||
          (this.engine._computeSurfaceBaseBiome && (
            (this.engine._computeSurfaceBaseBiome(y, w) && (this.engine._computeSurfaceBaseBiome(y, w).id === BiomeId.DESERT || this.engine._computeSurfaceBaseBiome(y, w).id === BiomeId.CANYON))
          ))
        );

        if (isDesertCave) {
          // ===================================================================
          // CAVERNAS TEMÁTICAS DO DESERTO:
          // Se estiver dentro da área média do Ninho dos Tardígrados:
          // Rainha colossal 3x maior e tardígrados pequenos!
          // ===================================================================
          const isNest = !!(
            (spawnTile && spawnTile.isTardigradeNest) ||
            (typeof this.engine.isTardigradeNest === "function" && this.engine.isTardigradeNest(y, w))
          );

          if (isNest) {
            // TARDÍGRADOS PEQUENOS (Filhotes andando na área do ninho):
            v = "tardigrade";
            T = "Tardígrado Filhote";
            isBaby = true;
            const babySize = 0.44 + Math.random() * 0.12;
            x = Math.round(babySize * 100) / 100;
            S = "#f59e0b";
            p = "#fef08a";
            j = 18;
            P = 2;
            customDef = 4;
            A = 0.48; // Filhotes lentos!
          } else {
            // Túneis normais fora do ninho
            const K = Math.random();
            if (K < 0.40) {
              v = "scorpion";
              T = CREATURES.scorpion.spawnVariants.cave.name;
              S = CREATURES.scorpion.spawnVariants.cave.color;
              p = CREATURES.scorpion.spawnVariants.cave.accentColor;
              j = CREATURES.scorpion.spawnVariants.cave.hp;
              P = CREATURES.scorpion.spawnVariants.cave.attack;
              A = CREATURES.scorpion.spawnVariants.cave.speed;
              x = CREATURES.scorpion.spawnVariants.cave.scale;
            } else if (K < 0.78) {
              // TARDÍGRADO CAVERNOSO: vive especificamente nesta caverna!
              v = "tardigrade";
              const sizeRoll = Math.random();
              let sizeMult = 1.0;
              if (sizeRoll < 0.35) {
                sizeMult = 1.0 + Math.random() * 0.35;
                T = "Tardígrado Cavernoso";
              } else if (sizeRoll < 0.70) {
                sizeMult = 1.5 + Math.random() * 0.65;
                T = "Tardígrado Cavernoso Grande";
              } else {
                sizeMult = 2.4 + Math.random() * 0.6;
                T = "Tardígrado Cavernoso Titânico";
              }
              const baseScale = (typeof CREATURES !== "undefined" && CREATURES.tardigrade) ? CREATURES.tardigrade.spawn.scale : 0.95;
              x = Math.round(baseScale * sizeMult * 100) / 100;
              S = (typeof CREATURES !== "undefined" && CREATURES.tardigrade) ? CREATURES.tardigrade.spawn.color : "#d97706";
              p = (typeof CREATURES !== "undefined" && CREATURES.tardigrade) ? CREATURES.tardigrade.spawn.accentColor : "#fef08a";
              const baseHp = (typeof CREATURES !== "undefined" && CREATURES.tardigrade) ? CREATURES.tardigrade.spawn.hp : 42;
              const baseAtk = (typeof CREATURES !== "undefined" && CREATURES.tardigrade) ? CREATURES.tardigrade.spawn.attack : 5;
              j = Math.round(baseHp * (0.75 + sizeMult * 0.65));
              P = Math.round(baseAtk * (0.75 + sizeMult * 0.65));
              customDef = Math.round(6 + (sizeMult - 1) * 2.0);
              A = Math.max(0.66, Math.round((0.85 - (sizeMult - 1) * 0.07) * 100) / 100);
            } else {
              v = "spider";
              T = CREATURES.spider.spawnVariants.sand.name;
              S = CREATURES.spider.spawnVariants.sand.color;
              p = CREATURES.spider.spawnVariants.sand.accentColor;
              j = CREATURES.spider.spawnVariants.sand.hp;
              P = CREATURES.spider.spawnVariants.sand.attack;
              A = CREATURES.spider.spawnVariants.sand.speed;
              x = CREATURES.spider.spawnVariants.sand.scale;
            }
          }
        } else {
          const K = isInPrisonEarthMine ? 0.5 : Math.random();
          K < 0.35
            ? ((v = "slime"),
              (T = CREATURES.slime.spawnVariants.cave.name),
              (S = CREATURES.slime.spawnVariants.cave.color),
              (p = CREATURES.slime.spawnVariants.cave.accentColor),
              (j = CREATURES.slime.spawnVariants.cave.hp),
              (P = CREATURES.slime.spawnVariants.cave.attack),
              (A = CREATURES.slime.spawnVariants.cave.speed),
              (x = CREATURES.slime.spawnVariants.cave.scale))
            : K < 0.68
              ? ((v = "bat"),
                (T = "Morcego das Profundezas"),
                (S = "#475569"),
                (p = "#f43f5e"),
                (j = 18),
                (P = 5),
                (A = 1.25),
                (x = 0.9))
              : ((v = "spider"),
                (T = CREATURES.spider.spawn.name),
                (S = CREATURES.spider.spawn.color),
                (p = CREATURES.spider.spawn.accentColor),
                (j = CREATURES.spider.spawn.hp),
                (P = CREATURES.spider.spawn.attack),
                (A = CREATURES.spider.spawn.speed),
                (x = CREATURES.spider.spawn.scale));
        }
        }
      } else if (
        o === BiomeId.COAST_WATER ||
        o === BiomeId.OASIS_LAKE ||
        o === BiomeId.MEADOW_LAKE ||
        o === BiomeId.FOREST_LAKE ||
        o === BiomeId.SWAMP_LAKE ||
        o === BiomeId.SAVANNA_LAKE ||
        o === BiomeId.TAIGA_LAKE ||
        o === BiomeId.GLACIER_LAKE
      )
        ((v = "slime"),
          o === BiomeId.OASIS_LAKE
            ? ((T = CREATURES.slime.spawnVariants.lakeOasis.name),
              (S = CREATURES.slime.spawnVariants.lakeOasis.color),
              (p = CREATURES.slime.spawnVariants.lakeOasis.accentColor),
              (j = CREATURES.slime.spawnVariants.lakeOasis.hp),
              (P = CREATURES.slime.spawnVariants.lakeOasis.attack),
              (A = CREATURES.slime.spawnVariants.lakeOasis.speed),
              (x = CREATURES.slime.spawnVariants.lakeOasis.scale))
            : o === BiomeId.FOREST_LAKE
              ? ((T = CREATURES.slime.spawnVariants.lakeForest.name),
                (S = CREATURES.slime.spawnVariants.lakeForest.color),
                (p = CREATURES.slime.spawnVariants.lakeForest.accentColor),
                (j = CREATURES.slime.spawnVariants.lakeForest.hp),
                (P = CREATURES.slime.spawnVariants.lakeForest.attack),
                (A = CREATURES.slime.spawnVariants.lakeForest.speed),
                (x = CREATURES.slime.spawnVariants.lakeForest.scale))
              : o === BiomeId.SWAMP_LAKE
                ? ((T = CREATURES.slime.spawnVariants.lakeSwamp.name),
                  (S = CREATURES.slime.spawnVariants.lakeSwamp.color),
                  (p = CREATURES.slime.spawnVariants.lakeSwamp.accentColor),
                  (j = CREATURES.slime.spawnVariants.lakeSwamp.hp),
                  (P = CREATURES.slime.spawnVariants.lakeSwamp.attack),
                  (A = CREATURES.slime.spawnVariants.lakeSwamp.speed),
                  (x = CREATURES.slime.spawnVariants.lakeSwamp.scale))
                : o === BiomeId.SAVANNA_LAKE
                  ? ((T = CREATURES.slime.spawnVariants.lakeSavanna.name),
                    (S = CREATURES.slime.spawnVariants.lakeSavanna.color),
                    (p = CREATURES.slime.spawnVariants.lakeSavanna.accentColor),
                    (j = CREATURES.slime.spawnVariants.lakeSavanna.hp),
                    (P = CREATURES.slime.spawnVariants.lakeSavanna.attack),
                    (A = CREATURES.slime.spawnVariants.lakeSavanna.speed),
                    (x = CREATURES.slime.spawnVariants.lakeSavanna.scale))
                  : o === BiomeId.TAIGA_LAKE
                    ? ((T = CREATURES.slime.spawnVariants.lakeTaiga.name),
                      (S = CREATURES.slime.spawnVariants.lakeTaiga.color),
                      (p = CREATURES.slime.spawnVariants.lakeTaiga.accentColor),
                      (j = CREATURES.slime.spawnVariants.lakeTaiga.hp),
                      (P = CREATURES.slime.spawnVariants.lakeTaiga.attack),
                      (A = CREATURES.slime.spawnVariants.lakeTaiga.speed),
                      (x = CREATURES.slime.spawnVariants.lakeTaiga.scale))
                    : o === BiomeId.GLACIER_LAKE
                      ? ((T = CREATURES.slime.spawnVariants.lakeGlacier.name),
                        (S = CREATURES.slime.spawnVariants.lakeGlacier.color),
                        (p = CREATURES.slime.spawnVariants.lakeGlacier.accentColor),
                        (j = CREATURES.slime.spawnVariants.lakeGlacier.hp),
                        (P = CREATURES.slime.spawnVariants.lakeGlacier.attack),
                        (A = CREATURES.slime.spawnVariants.lakeGlacier.speed),
                        (x = CREATURES.slime.spawnVariants.lakeGlacier.scale))
                      : ((T = o === BiomeId.MEADOW_LAKE ? CREATURES.slime.spawnVariants.lakeMeadow.name : CREATURES.slime.spawnVariants.lakeShallow.name),
                        (S = CREATURES.slime.spawnVariants.lakeShallow.color),
                        (p = CREATURES.slime.spawnVariants.lakeShallow.accentColor),
                        (j = CREATURES.slime.spawnVariants.lakeShallow.hp),
                        (P = CREATURES.slime.spawnVariants.lakeShallow.attack),
                        (A = CREATURES.slime.spawnVariants.lakeShallow.speed),
                        (x = CREATURES.slime.spawnVariants.lakeShallow.scale)));
      else if (o === BiomeId.SWAMP)
        Math.random() < 0.7
          ? ((v = "slime"),
            (T = CREATURES.slime.spawnVariants.swamp.name),
            (S = CREATURES.slime.spawnVariants.swamp.color),
            (p = CREATURES.slime.spawnVariants.swamp.accentColor),
            (j = CREATURES.slime.spawnVariants.swamp.hp),
            (P = CREATURES.slime.spawnVariants.swamp.attack),
            (A = CREATURES.slime.spawnVariants.swamp.speed),
            (x = CREATURES.slime.spawnVariants.swamp.scale))
          : ((v = "spider"),
            (T = CREATURES.spider.spawnVariants.swamp.name),
            (S = CREATURES.spider.spawnVariants.swamp.color),
            (p = CREATURES.spider.spawnVariants.swamp.accentColor),
            (j = CREATURES.spider.spawnVariants.swamp.hp),
            (P = CREATURES.spider.spawnVariants.swamp.attack),
            (A = CREATURES.spider.spawnVariants.swamp.speed),
            (x = CREATURES.spider.spawnVariants.swamp.scale));
      else if (o === BiomeId.FOREST || o === BiomeId.DEEP_FOREST) {
        const K = Math.random();
        K < 0.28
          ? ((v = "deer"),
 (T = CREATURES.deer.spawn.name),
 (S = CREATURES.deer.spawn.color),
 (p = CREATURES.deer.spawn.accentColor),
 (j = CREATURES.deer.spawn.hp),
 (P = CREATURES.deer.spawn.attack),
 (A = CREATURES.deer.spawn.speed),
 (x = CREATURES.deer.spawn.scale))
          : K < 0.52
            ? ((v = "wolf"),
              (T = CREATURES.wolf.spawn.name),
              (S = CREATURES.wolf.spawn.color),
              (p = CREATURES.wolf.spawn.accentColor),
              (j = CREATURES.wolf.spawn.hp),
              (P = CREATURES.wolf.spawn.attack),
              (A = CREATURES.wolf.spawn.speed),
              (x = CREATURES.wolf.spawn.scale))
            : K < 0.78
              ? ((v = "slime"),
                (T = o === BiomeId.DEEP_FOREST ? CREATURES.slime.spawnVariants.deepForest.name : CREATURES.slime.spawn.name),
                (S = o === BiomeId.DEEP_FOREST ? CREATURES.slime.spawnVariants.deepForest.color : CREATURES.slime.spawn.color),
                (p = o === BiomeId.DEEP_FOREST ? CREATURES.slime.spawnVariants.deepForest.accentColor : CREATURES.slime.spawn.accentColor),
                (j = CREATURES.slime.spawn.hp),
                (P = CREATURES.slime.spawn.attack),
                (A = CREATURES.slime.spawn.speed),
                (x = CREATURES.slime.spawn.scale))
              : ((v = "spider"),
                (T = CREATURES.spider.spawnVariants.forest.name),
                (S = CREATURES.spider.spawnVariants.forest.color),
                (p = CREATURES.spider.spawnVariants.forest.accentColor),
                (j = CREATURES.spider.spawnVariants.forest.hp),
                (P = CREATURES.spider.spawnVariants.forest.attack),
                (A = CREATURES.spider.spawnVariants.forest.speed),
                (x = CREATURES.spider.spawnVariants.forest.scale));
      } else
        Math.random() < 0.6
          ? ((v = "rabbit"),
 (T = CREATURES.rabbit.spawn.name),
 (S = CREATURES.rabbit.spawn.color),
 (p = CREATURES.rabbit.spawn.accentColor),
 (j = CREATURES.rabbit.spawn.hp),
 (P = CREATURES.rabbit.spawn.attack),
 (A = CREATURES.rabbit.spawn.speed),
 (x = CREATURES.rabbit.spawn.scale))
          : ((v = "slime"),
            (T = CREATURES.slime.spawnVariants.meadow.name),
            (S = CREATURES.slime.spawnVariants.meadow.color),
            (p = CREATURES.slime.spawnVariants.meadow.accentColor),
            (j = CREATURES.slime.spawnVariants.meadow.hp),
            (P = CREATURES.slime.spawnVariants.meadow.attack),
            (A = CREATURES.slime.spawnVariants.meadow.speed),
            (x = CREATURES.slime.spawnVariants.meadow.scale));
      // No deserto à noite, os escorpiões pequenos se enterram e somem;
      // em vez disso, escorpiões gigantes podem surgir normalmente pelo mapa respeitando o limite de até 3!
      if (!l && v === "scorpion" && (u < 0.22 || u > 0.78)) {
        if (o === BiomeId.DESERT) {
          const livingGiants = this.monsters.filter(
            (mg) => mg.type === "scorpion" && mg.isGiantScorpion && mg.hp > 0 && !mg.burrowing
          ).length;
          if (livingGiants < 3) {
            this.createGiantScorpion(f, g, t, Math.random() < 0.4);
          }
        }
        return;
      }
      if (v === "slime" && !l && u >= 0.22 && u <= 0.78) {
        const V = this.isShallowWater(y, w),
          O = this.isPositionInShade(f, g, u, l);
        if (!V && !O) {
          const _ = this.findNearestShelter(f, g, u, l);
          if (_)
            ((f = _.x),
              (g = _.y),
              (y = Math.floor(f / this.engine.tileSize)),
              (w = Math.floor(g / this.engine.tileSize)));
          else return;
        }
      }
      const z = {
        id: `mob_${this.nextId++}_${Date.now()}`,
        name: T,
        type: v,
        x: f,
        y: g,
        vx: 0,
        vy: 0,
        hp: j,
        maxHp: j,
        attack: P,
        defense: customDef ?? (typeof CREATURES !== "undefined" && CREATURES[v]?.spawn?.defense !== void 0 ? CREATURES[v].spawn.defense : 2),
        speed: A,
        color: S,
        accentColor: p,
        scale: x,
        maxScale: (v === "tardigrade" ? Math.max(x, Math.min(3.2, x * 1.15)) : x),
        isQueen: !!isQueen,
        isBaby: !!isBaby,
        isBoss: !!isBoss,
        isUnderground: l,
        isMoving: !1,
        hitFlashTimer: 0,
        animTimer: Math.random() * 10,
        wanderTimer: 1,
        targetAngle: Math.random() * Math.PI * 2,
        facing: ["down", "left", "right", "up"][Math.floor(Math.random() * 4)],
        dodgeChance: (typeof CREATURES !== "undefined" && CREATURES[v]?.spawn?.dodgeChance !== void 0 ? CREATURES[v].spawn.dodgeChance : (v === "wolf" ? 0.20 : 0)),
      };
      this.monsters.push(z);
    }
    spawnSwarmSlimeNearPlayer(t, l, o) {
      const u = o === BiomeId.SNOW_TAIGA || o === BiomeId.SNOW_PEAK || o === BiomeId.GLACIER,
        m =
          o === BiomeId.DESERT ||
          o === BiomeId.CANYON ||
          o === BiomeId.SAVANNA ||
          o === BiomeId.BEACH ||
          o === BiomeId.VOLCANIC;
      if (u || m) return;
      const c = Math.random() * Math.PI * 2,
        f = 36 + Math.random() * 44,
        g = t.x + Math.cos(c) * f,
        y = t.y + Math.sin(c) * f,
        w = Math.floor(g / this.engine.tileSize),
        v = Math.floor(y / this.engine.tileSize);
      if (
        !this.engine.isTileCreaturePassable(w, v) ||
        this.engine.isNearLitCampfire(g, y) ||
        this.engine.isNearLitCampfire(t.x, t.y)
      )
        return;
      const T = CREATURES.slime.swarm.forms,
        S = T[Math.floor(Math.random() * T.length)],
        p = {
          id: `slime_swarm_${this.nextId++}`,
          name: S.name,
          type: "slime",
          x: g,
          y,
          vx: 0,
          vy: 0,
          hp: CREATURES.slime.swarm.hp,
          maxHp: CREATURES.slime.swarm.hp,
          attack: CREATURES.slime.swarm.attack,
          defense: CREATURES.slime.swarm.defense,
          speed: CREATURES.slime.swarm.speed,
          color: S.color,
          accentColor: S.accentColor,
          scale: 0.85 + Math.random() * 0.25,
          isUnderground: l,
          hitFlashTimer: 0,
          animTimer: Math.random() * 10,
          wanderTimer: 0.2,
          targetAngle: c + Math.PI,
          facing: this.getMonsterFacingToTarget(g, y, t.x, t.y, "down"),
          emerging: !0,
          emergeTimer: 0.55,
          attackCooldown: 0.5,
        };
      this.monsters.push(p);
      for (let j = 0; j < 8; j++) {
        const P = Math.random() * Math.PI * 2,
          A = 1.2 + Math.random() * 3.5;
        this.slimeParticles.push({
          x: g,
          y: y + 2,
          vx: Math.cos(P) * A,
          vy: Math.sin(P) * A - 2,
          life: 0.55,
          maxLife: 0.55,
          type: Math.random() < 0.5 ? "mud" : "bubble",
          color: Math.random() < 0.5 ? "#78350f" : S.color,
          size: 1.8 + Math.random() * 2,
        });
      }
      this.floatingTexts.push({
        id: `txt_${this.nextId++}`,
        x: g,
        y: y - 14,
        text: "+ Gosma emergiu!",
        color: "#4ade80",
        isCrit: !1,
        life: 0.85,
      });
    }
    getAttackReachAndRadius(t, l = !1, rangeOverride) {
      if (rangeOverride !== void 0) return { reach: rangeOverride, hitRadius: 18, maxRange: rangeOverride + 18 };
      if (l) return { reach: 26, hitRadius: 16, maxRange: 42 };
      const o = t ? 18 : 12,
        u = t ? 22 : 16;
      return { reach: o, hitRadius: u, maxRange: o + u };
    }
    findNearestMonster(t, l, o, u = !1) {
      let m = null,
        c = 1 / 0;
      for (const f of this.monsters) {
        if (f.hp <= 0 || f.isUnderground !== u) continue;
        let g = Math.hypot(f.x - t, f.y - l);
        if (f.isGiantScorpion && typeof getScorpionHitColliders === "function") {
          const cols = getScorpionHitColliders(f);
          for (const col of cols) {
            if (col.isLeg || (col.part && col.part.startsWith("leg"))) {
              const dLeg = Math.hypot(col.x - t, col.y - l);
              if (dLeg < g) g = dLeg;
            }
          }
        }
        g <= o && g < c && ((c = g), (m = f));
      }
      return m ? { monster: m, distance: c } : null;
    }
    isTargetInAttackRange(t, l, o, u, m, c, f = !1, g) {
      const { reach: y, hitRadius: w } = this.getAttackReachAndRadius(c, f);
      let v = t,
        T = l;
      return (
        f && g !== void 0
          ? ((v += Math.cos(g) * y), (T += Math.sin(g) * y))
          : o === "up"
            ? (T -= y)
            : o === "down"
              ? (T += y)
              : o === "left"
                ? (v -= y)
                : (v += y),
        Math.hypot(u - v, m - T) <= w
      );
    }
    queuePebbleProjectile(player, angle, damage, underground, maxRange = 330, snapshotPoint) {
      const dirX = Math.cos(angle), dirY = Math.sin(angle);
      let targetX = player.x + dirX * maxRange;
      let targetY = player.y + dirY * maxRange;
      if (snapshotPoint) {
        targetX = snapshotPoint.x;
        targetY = snapshotPoint.y;
      } else {
        let distance = maxRange;
        for (const target of this.monsters) {
          if (target.hp <= 0 || target.isUnderground !== underground) continue;
          const checkPoints = [{ x: target.x, y: target.y, rad: 28 }];
          if (target.isGiantScorpion && typeof getScorpionHitColliders === "function") {
            const cols = getScorpionHitColliders(target);
            for (const col of cols) {
              if (col.isLeg || (col.part && col.part.startsWith("leg"))) {
                checkPoints.push({ x: col.x, y: col.y, rad: (col.radius || 12) + 12 });
              }
            }
          }
          for (const pt of checkPoints) {
            const dx = pt.x - player.x, dy = pt.y - player.y;
            const along = dx * dirX + dy * dirY;
            const perpendicular = Math.abs(dx * dirY - dy * dirX);
            if (along >= 0 && along <= distance && perpendicular <= pt.rad) distance = along;
          }
        }
        distance = Math.max(18, distance);
        targetX = player.x + dirX * distance;
        targetY = player.y + dirY * distance;
      }
      const distance = Math.max(18, Math.hypot(targetX - player.x, targetY - player.y));
      this.pebbleProjectiles.push({
        x: player.x, y: player.y,
        startX: player.x, startY: player.y,
        targetX, targetY,
        angle, distance, damage, underground,
        progress: 0,
        duration: Math.max(0.22, Math.min(0.58, distance / 420)),
        player,
      });
    }
    performAttack(t, l, o, u = !1, m = !1, c, rangeOverride, lockedPoint, whipFlag) {
      if (t.isDead || (t.paralyzedTimer && t.paralyzedTimer > 0))
        return {
          hitCount: 0,
          defeatedCount: 0,
          totalDamage: 0,
          lootGold: 0,
          defeatedNames: [],
        };
      let f = lockedPoint?.x ?? t.x,
        g = lockedPoint?.y ?? t.y;
      let { reach: y, hitRadius: w } = this.getAttackReachAndRadius(o, m, rangeOverride),
        v = c !== void 0 ? c : t.attackAngle;
      if (!lockedPoint && rangeOverride !== void 0 && v !== void 0) {
        let nearestDistance = rangeOverride;
        const dirX = Math.cos(v), dirY = Math.sin(v);
        for (const target of this.monsters) {
          if (target.hp <= 0 || target.isUnderground !== u) continue;
          const dx = target.x - t.x, dy = target.y - t.y;
          const along = dx * dirX + dy * dirY;
          const perpendicular = Math.abs(dx * dirY - dy * dirX);
          if (along >= 0 && along <= nearestDistance && perpendicular <= w + 10) nearestDistance = along;
        }
        y = Math.max(18, nearestDistance);
      }
      if (lockedPoint) {
        w = Math.max(w, 36);
      } else {
        (m && v !== void 0
          ? ((f += Math.cos(v) * y), (g += Math.sin(v) * y))
          : t.direction === "up"
            ? (g -= y)
            : t.direction === "down"
              ? (g += y)
              : t.direction === "left"
                ? (f -= y)
                : (f += y),
        !whipFlag && this.slashEffects.push({
          x: f,
          y: g,
          direction: t.direction,
          progress: 0,
          hasSword: o,
          isThrust: m,
          angle: v,
          color: m || o ? "#38bdf8" : "#e2e8f0",
        }));
      }
      const T = {
        hitCount: 0,
        defeatedCount: 0,
        totalDamage: 0,
        lootGold: 0,
        defeatedNames: [],
      };
      for (let S = this.monsters.length - 1; S >= 0; S--) {
        const p = this.monsters[S];
        const isCaveReachActive = !!(
          p.isGiantScorpion &&
          !p.isUnderground &&
          u &&
          ((p.caveReachTimer && p.caveReachTimer > 0) || p.isPullingFromCave)
        );
        if (p.isUnderground !== u && !isCaveReachActive) continue;
        const hitCheckX = isCaveReachActive ? (p._caveClawTipX ?? p.caveDoorX ?? p.x) : p.x;
        const hitCheckY = isCaveReachActive ? (p._caveClawTipY ?? p.caveDoorY ?? p.y) : p.y;
        const j = Math.hypot(hitCheckX - f, hitCheckY - g),
          P = !!(p.type === "slime" && p.attached),
          isCapturingMe = !!(
            p.isGiantScorpion &&
            (p.isCapturingPlayer || p.isPullingFromCave) &&
            t.capturedByScorpionId === p.id
          );
        const monsterRadius = (isCaveReachActive ? (p._caveClawRadius || 14) : (p.size || 16)) + (lockedPoint ? 14 : 0);
        let hitOnLeg = null;
        let isHit = (j <= w + monsterRadius || P || isCapturingMe);
        if (!isHit && p.isGiantScorpion && typeof getScorpionHitColliders === "function") {
          const cols = getScorpionHitColliders(p);
          for (const col of cols) {
            if (col.isLeg || (col.part && col.part.startsWith("leg"))) {
              const dLeg = Math.hypot(col.x - f, col.y - g);
              if (dLeg <= w + (col.radius || 12)) {
                isHit = !0;
                hitOnLeg = col;
                break;
              }
            }
          }
        }
        if (isHit) {
          // Chance de esquiva do lobo de 20%: ele sai do bote/agarre e se afasta 2 passos do alvo
          const wolfDodgeChance = p.dodgeChance !== void 0 ? p.dodgeChance : (p.type === "wolf" ? 0.20 : 0);
          if (wolfDodgeChance > 0 && Math.random() < wolfDodgeChance) {
            // Se estiver em bote ou mordendo/segurando o alvo, solta imediatamente
            if (p.wolfAttackState) {
              p.wolfAttackState = null;
            }

            // O lobo pode esquivar em qualquer direção (360 graus)
            const dodgeAng = Math.random() * Math.PI * 2;
            const dodgeDist = 72; // 2 passos (2 tiles de 36px = 72px)
            const dodgeDuration = 0.38; // Duração rápida e dinâmica do salto

            // Vira imediatamente em direção ao local da esquiva!
            p.facing = Math.cos(dodgeAng) < 0 ? "left" : "right";
            p.targetAngle = dodgeAng;
            p.dodgeAngle = dodgeAng;
            p.dodgeDist = dodgeDist;
            p.dodgeSpeed = dodgeDist / dodgeDuration; // ~189.5 px/s

            // Ativa o estado de salto (dodge_leap): o lobo se desloca suavemente frame a frame no loop, sem teleportar
            p.wolfAttackState = "dodge_leap";
            p.wolfAttackDuration = dodgeDuration;
            p.wolfAttackTimer = dodgeDuration;

            p.vx = Math.cos(dodgeAng) * p.dodgeSpeed;
            p.vy = Math.sin(dodgeAng) * p.dodgeSpeed;
            p.isMoving = !0;
            p.aggroTimer = 9.5;
            p.giveUpPursuitTimer = 0;
            p.fleeFireTimer = 0;

            // Poeira de impulsão do salto sob as patas
            for (let d = 0; d < 6; d++) {
              this.slimeParticles.push({
                x: p.x + (Math.random() - 0.5) * 10,
                y: p.y + 4 + (Math.random() - 0.5) * 4,
                vx: -Math.cos(dodgeAng) * (1.2 + Math.random() * 1.6) + (Math.random() - 0.5) * 1.0,
                vy: -Math.sin(dodgeAng) * (1.2 + Math.random() * 1.6) - Math.random() * 1.2,
                life: 0.35,
                maxLife: 0.35,
                type: "dust",
                color: "#e2e8f0",
                size: 2.2 + Math.random() * 1.5,
              });
            }

            this.audio?.playPunchWhoosh?.();
            continue;
          }
          T.hitCount++;
          const A = Math.random() < 0.22,
            x = Math.floor(Math.random() * 3) - 1,
            M = Math.max(1, l - p.defense + x),
            $ = A ? Math.round(M * 1.6) : M;
          let brokeCapture = !1;
          if (isCapturingMe) {
            p.captureDamageTaken = (p.captureDamageTaken || 0) + $;
            const needed = p.captureBreakDamageNeeded || 4;
            if (p.captureDamageTaken >= needed || p.hp - $ <= 0) {
              brokeCapture = !0;
              const wasPullingFromCave = !!p.isPullingFromCave;
              p.isCapturingPlayer = !1;
              p.isPullingFromCave = !1;
              p.caveReachTimer = 0;
              p.caveReachProg = 0;
              p.caveReachCooldown = 1.6;
              p.clawAttackCooldown = 1.4;
              p.stingerAttackCooldown = Math.max(p.stingerAttackCooldown || 0, 1.1);
              t.capturedByScorpionId = null;
              t.invulnerableTimer = Math.max(t.invulnerableTimer || 0, 0.85);
              const refX = wasPullingFromCave ? (p.caveDoorX ?? p.x) : p.x;
              const refY = wasPullingFromCave ? (p.caveDoorY ?? p.y) : p.y;
              const escAngle = Math.atan2(t.y - refY, t.x - refX) || Math.PI / 2;
              const _esc = this.engine.moveWithSlide(t.x, t.y, Math.cos(escAngle) * 28, Math.sin(escAngle) * 28, !0);
              t.x = _esc.x;
              t.y = _esc.y;
            }
          }
          if (
            ((p.hp -= $),
            (p.hitFlashTimer = 0.22),
            (p.giveUpPursuitTimer = 0),
            (p.fleeFireTimer = 0),
            (T.totalDamage += $),
            p.type === "wolf" && p.wolfAttackState && ((p.wolfAttackState = null), (p.attackCooldown = 0.9)),
            P)
          ) {
            ((p.attached = !1), (p.isLeaping = !1), (p.attackCooldown = 1.8));
            const z = Math.random() * Math.PI * 2;
            ((p.x = t.x + Math.cos(z) * 28), (p.y = t.y + Math.sin(z) * 28));
          } else if (!isCapturingMe) {
            const z = A ? 14 : 9;
            const kx = m && v !== void 0 ? Math.cos(v) * z : (t.direction === "left" ? -z : t.direction === "right" ? z : 0);
            const ky = m && v !== void 0 ? Math.sin(v) * z : (t.direction === "up" ? -z : t.direction === "down" ? z : 0);
            if (this.engine && typeof this.engine.moveWithSlide === "function") {
              const _sl = this.engine.moveWithSlide(p.x, p.y, kx, ky, !1);
              p.x = _sl.x;
              p.y = _sl.y;
            } else {
              p.x += kx;
              p.y += ky;
            }
          }
          if (isPreyType(p.type)) {
            p.fleeTimer = creatureBehavior(p.type).playerHitFleeTimer ?? 4.5;
            p.lastThreatX = t.x;
            p.lastThreatY = t.y;
            p.threatName = "jogador";
            p.alertEffectTimer = 3.5;
            const fleeAngle = Math.atan2(p.y - t.y, p.x - t.x) || (Math.random() * Math.PI * 2);
            p.targetAngle = fleeAngle;
            const sprintSpeed = p.speed * 1.85;
            p.vx = Math.cos(fleeAngle) * sprintSpeed;
            p.vy = Math.sin(fleeAngle) * sprintSpeed;
            p.facing = this.getMonsterFacing(p.vx, p.vy, p.facing);
          } else {
            p.aggroTimer = 9.5;
            const rushAngle = Math.atan2(t.y - p.y, t.x - p.x);
            p.targetAngle = rushAngle;
            p.facing = this.getMonsterFacingToTarget(p.x, p.y, t.x, t.y, p.facing);
            const rushSpeed = p.speed * 1.35;
            p.vx = Math.cos(rushAngle) * rushSpeed;
            p.vy = Math.sin(rushAngle) * rushSpeed;
          }
          const impactPtX = hitOnLeg ? hitOnLeg.x : p.x;
          const impactPtY = hitOnLeg ? hitOnLeg.y : p.y;
          this.floatingTexts.push({
            id: `dmg_${this.nextId++}`,
            x: impactPtX,
            y: impactPtY - 18,
            text: brokeCapture
              ? `-${$} (ESCAPOU DA GARRA!)`
              : P
                ? `-${$} (Soltou!)`
                : hitOnLeg
                  ? (A ? `CRÍTICO! -${$} (Perna)` : `-${$} (Perna)`)
                  : A
                    ? `CRÍTICO! -${$}`
                    : `-${$}`,
            color: brokeCapture || P ? "#38bdf8" : hitOnLeg ? "#fb923c" : A ? "#f59e0b" : "#f87171",
            isCrit: A || brokeCapture,
            life: 1,
          });
          for (let z = 0; z < (A ? 8 : 5); z++) {
            const K = Math.random() * Math.PI * 2,
              V = 2 + Math.random() * 4;
            this.hitParticles.push({
              x: impactPtX,
              y: impactPtY,
              vx: Math.cos(K) * V,
              vy: Math.sin(K) * V,
              life: 1,
              color: hitOnLeg ? (z % 2 === 0 ? "#b45309" : "#f59e0b") : A ? "#fbbf24" : "#ef4444",
              size: 2.5 + Math.random() * 2,
            });
          }
          if (hitOnLeg) {
            p.speed = Math.max((p.speed || 3) * 0.9, 1.4);
          }
          if (p.hp <= 0) {
            (T.defeatedCount++, T.defeatedNames.push(p.name), (T.lootGold = 0));
            for (let N = 0; N < (p.type === "slime" ? 8 : 12); N++) {
              const Ee = Math.random() * Math.PI * 2,
                ne = 2 + Math.random() * 3.5;
              this.hitParticles.push({
                x: p.x,
                y: p.y,
                vx: Math.cos(Ee) * ne,
                vy: Math.sin(Ee) * ne,
                life: 0.75,
                color: p.accentColor,
                size: 2.5 + Math.random() * 2.5,
              });
            }
            const z = p.type === "slime";
            let K = `Corpo de ${p.name}`,
              V = `Corpo de ${p.name}`,
              O = p.isGiantScorpion ? "epico" : "raro",
              _ = p.isGiantScorpion ? 160 : 35,
              se = p.isGiantScorpion
                ? "Carcaça colossal de um Escorpião Gigante Noturno do deserto, com carapaça quitinosa espessa e ferrão maciço e esmagador."
                : `Corpo intacto de ${p.name} recolhido após o combate.`;
            creatureCarcass(p.type)
 ? ((K = creatureCarcass(p.type).name),
 (V = creatureCarcass(p.type).bodyName),
 (se = creatureCarcass(p.type).description),
 creatureCarcass(p.type).rarity && (O = creatureCarcass(p.type).rarity),
 creatureCarcass(p.type).value && (_ = creatureCarcass(p.type).value))
                  : null;
            const ue = {
              id: `carcass_${this.nextId++}`,
              monsterId: p.id,
              name: K,
              type: p.type,
              x: p.x,
              y: p.y,
              color: p.color,
              accentColor: p.accentColor,
              scale: p.scale,
              isUnderground: p.isUnderground,
              isSlime: z,
              collected: !1,
              settleProgress: 0,
              lifetime: 20,
              maxLifetime: 20,
              lootItemName: V,
              lootItemIcon: `creature_${p.type}`,
              lootItemColor: p.color,
              lootItemRarity: O,
              lootItemDescription: se,
              lootItemValue: _,
              gold: Math.floor(Math.random() * 8) + 4,
            };
            (this.carcasses.push(ue),
              (p.attached = !1),
              this.monsters.splice(S, 1));
          }
        }
      }
      return T;
    }
    getNearestCarcass(t, l, o = 54, u = !1) {
      let m = null,
        c = 1 / 0;
      for (const f of this.carcasses) {
        if (f.collected || f.isUnderground !== u) continue;
        const g = Math.hypot(f.x - t, f.y - l);
        g <= o && g < c && ((c = g), (m = f));
      }
      return m;
    }
    collectCarcass(t) {
      var u, m;
      const l = this.carcasses.findIndex((c) => c.id === t);
      if (l === -1) return null;
      const o = this.carcasses[l];
      (this.carcasses.splice(l, 1),
        o.isSlime
          ? (u = this.audio) == null || u.playSlimePickup()
          : (m = this.audio) == null || m.playItemPickup());
      for (let c = 0; c < 12; c++) {
        const f = -Math.PI / 2 + (Math.random() - 0.5) * 1.4,
          g = 1.5 + Math.random() * 2.5;
        this.hitParticles.push({
          x: o.x + (Math.random() - 0.5) * 14,
          y: o.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(f) * g,
          vy: Math.sin(f) * g,
          life: 0.85,
          color: o.accentColor || "#4ade80",
          size: 2.2 + Math.random() * 2.5,
        });
      }
      return o;
    }
    getRenderItems(t, l, o, u, m) {
      const c = [];
      for (const f of this.monsters) {
        if (f.isUnderground !== this.lastIsUnderground) {
          if (
            f.isGiantScorpion &&
            !f.isUnderground &&
            this.lastIsUnderground &&
            ((f.caveReachProg && f.caveReachProg > 0) || f.isPullingFromCave) &&
            typeof drawGiantScorpionCaveReachClaw === "function"
          ) {
            const sortY = (f._caveClawTipY ?? f.caveDoorY ?? f.y) + 2;
            c.push({ y: sortY, draw: () => drawGiantScorpionCaveReachClaw(t, f) });
          }
          continue;
        }
        const pad = Math.max(60, (f.scale || 1) * 28);
        if (
          f.x >= l - pad &&
          f.x <= o + pad &&
          f.y >= u - pad &&
          f.y <= m + pad
        ) {
          c.push({ y: f.y, draw: () => Eg(t, f) });
          if (
            f.type === "wolf" &&
            f.wolfAttackState === "arm_hold" &&
            typeof CREATURES !== "undefined" &&
            CREATURES.wolf &&
            CREATURES.wolf.draw &&
            typeof CREATURES.wolf.draw.frontPawOverlay === "function"
          ) {
            const pawSortY = (f._playerY !== undefined ? f._playerY : (this.lastPlayerY !== undefined ? this.lastPlayerY : f.y)) + 0.6;
            c.push({
              y: pawSortY,
              draw: () => {
                t.save();
                t.translate(f.x, f.y);
                CREATURES.wolf.draw.frontPawOverlay(t, f, f.scale || 1, f.hitFlashTimer > 0);
                t.restore();
              },
            });
          }
        }
      }
      for (const f of this.carcasses) {
        const pad = Math.max(60, (f.scale || 1) * 28);
        f.collected ||
          f.isUnderground !== this.lastIsUnderground ||
          f.x < l - pad ||
          f.x > o + pad ||
          f.y < u - pad ||
          f.y > m + pad ||
          c.push({ y: f.y - 4, draw: () => Ag(t, f, this.animTimer) });
      }
      for (const f of this.droppedItems) {
        if (
          f.isUnderground !== this.lastIsUnderground ||
          f.x < l - 60 ||
          f.x > o + 60 ||
          f.y < u - 60 ||
          f.y > m + 60
        )
          continue;
        const g = Math.hypot(f.x - this.lastPlayerX, f.y - this.lastPlayerY);
        c.push({ y: f.y - 2, draw: () => this.drawDroppedItem(t, f, g) });
      }
      return c;
    }
    drawDroppedItem(t, l, o) {
      if ((t.save(), l.lifetime <= 15)) {
        const f = 8 + (15 - l.lifetime) * 2,
          g = Math.sin(this.animTimer * f) > 0 ? 0.35 : 1;
        t.globalAlpha = g;
      }
      let u = 1;
      l.lifetime < 1.5 && (u = Math.max(0.1, l.lifetime / 1.5));
      const m = Math.sin(this.animTimer * 3.5 + l.bobOffset) * 2.5;
      if (
        (t.save(),
        (t.fillStyle = "rgba(0, 0, 0, 0.35)"),
        t.beginPath(),
        t.ellipse(l.x, l.y + 6, 8 * u, 4 * u, 0, 0, Math.PI * 2),
        t.fill(),
        t.restore(),
        t.save(),
        t.translate(l.x, l.y + m),
        u !== 1 && t.scale(u, u),
        o < 52)
      ) {
        const f = Math.sin(this.animTimer * 5) * 0.15 + 0.85;
        (t.save(),
          (t.strokeStyle = l.item.color || "#38bdf8"),
          (t.lineWidth = 1.2),
          (t.globalAlpha = 0.5 * f),
          t.beginPath(),
          t.ellipse(0, 5, 12 * f, 6 * f, 0, 0, Math.PI * 2),
          t.stroke(),
          t.restore());
      }
      (t.translate(-13, -13),
        drawItemIcon(t, l.item, 26, 26, this.animTimer, !1),
        t.restore());
      const c = l.quantity || l.item.stackCount || 1;
      if (c > 1) {
        (t.save(),
          (t.fillStyle = "rgba(15, 23, 42, 0.9)"),
          (t.strokeStyle = "rgba(245, 158, 11, 0.7)"),
          (t.lineWidth = 1));
        const f = `x${c}`;
        t.font = "bold 8px monospace";
        const g = t.measureText(f).width,
          y = Math.max(14, g + 6);
        (t.beginPath(),
          t.roundRect(l.x + 2, l.y + m + 1, y, 10, 3),
          t.fill(),
          t.stroke(),
          (t.fillStyle = "#fde68a"),
          (t.textAlign = "center"),
          (t.textBaseline = "middle"),
          t.fillText(f, l.x + 2 + y / 2, l.y + m + 6),
          t.restore());
      }
      t.restore();
    }
    dropItem(t, l, o, u, m = 1) {
      const c = Math.random() * Math.PI * 2,
        f = 4 + Math.random() * 14,
        g = l + Math.cos(c) * f,
        y = o + Math.sin(c) * f,
        w = {
          id: `drop_${this.nextId++}_${Date.now()}`,
          item: { ...t, stackCount: m },
          quantity: m,
          x: g,
          y,
          isUnderground: u,
          lifetime: 60,
          maxLifetime: 60,
          bobOffset: Math.random() * Math.PI * 2,
          pickupCooldown: 0.8,
        };
      this.droppedItems.push(w);
      for (let v = 0; v < 5; v++)
        this.hitParticles.push({
          x: g + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.9,
          vy: -0.6 - Math.random() * 0.8,
          life: 0.5,
          color: t.color || "#38bdf8",
          size: 1.8 + Math.random() * 1.2,
        });
      return w;
    }
    getNearestDroppedItem(t, l, o = 48, u = !1) {
      let m = null,
        c = o;
      for (const f of this.droppedItems) {
        if (f.isUnderground !== u) continue;
        const g = Math.hypot(f.x - t, f.y - l);
        g < c && ((c = g), (m = f));
      }
      return m;
    }
    collectDroppedItem(t) {
      const l = this.droppedItems.findIndex((u) => u.id === t);
      if (l === -1) return null;
      const o = this.droppedItems[l];
      this.droppedItems.splice(l, 1);
      for (let u = 0; u < 6; u++)
        this.hitParticles.push({
          x: o.x + (Math.random() - 0.5) * 12,
          y: o.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -0.9 - Math.random() * 1,
          life: 0.5,
          color: o.item.color || "#38bdf8",
          size: 1.8 + Math.random() * 1.5,
        });
      return o;
    }
    renderEffects(t) {
      for (const l of this.slashEffects) {
        (t.save(), t.translate(l.x, l.y));
        const o = Math.max(0, 1 - l.progress);
        if (l.kind === "pebble") {
          t.rotate(l.angle || 0);
          t.globalAlpha = l.trail ? 0.75 : 1;
          t.strokeStyle = "rgba(226, 232, 240, 0.45)";
          t.lineWidth = 2;
          t.beginPath();
          t.moveTo(-18, 0);
          t.lineTo(-5, 0);
          t.stroke();
          t.fillStyle = "#94a3b8";
          t.strokeStyle = "#f8fafc";
          t.lineWidth = 1.4;
          t.beginPath();
          t.ellipse(0, 0, 5.5, 4.2, -0.25, 0, Math.PI * 2);
          t.fill();
          t.stroke();
          t.fillStyle = "#475569";
          t.beginPath();
          t.arc(-1.5, -1, 1.1, 0, Math.PI * 2);
          t.fill();
          t.restore();
          continue;
        }
        if (l.isThrust) {
          const f =
            l.angle !== void 0
              ? l.angle
              : l.direction === "right"
                ? 0
                : l.direction === "left"
                  ? Math.PI
                  : l.direction === "up"
                    ? -Math.PI / 2
                    : Math.PI / 2;
          t.rotate(f);
          const g = 22 + (1 - l.progress) * 10,
            y = 8 * (1 - l.progress);
          ((t.fillStyle = "#ffffff"),
            (t.globalAlpha = o),
            t.beginPath(),
            t.moveTo(g + 6, 0),
            t.lineTo(g - 8, -y * 0.7),
            t.lineTo(g - 3, 0),
            t.lineTo(g - 8, y * 0.7),
            t.closePath(),
            t.fill(),
            (t.strokeStyle = l.color || "#38bdf8"),
            (t.lineWidth = 3.8),
            t.beginPath(),
            t.moveTo(-12, 0),
            t.lineTo(g + 5, 0),
            t.stroke(),
            (t.strokeStyle = "#ffffff"),
            (t.lineWidth = 1.6),
            t.beginPath(),
            t.moveTo(-8, 0),
            t.lineTo(g + 8, 0),
            t.stroke(),
            (t.strokeStyle = "#7dd3fc"),
            (t.lineWidth = 1.3),
            t.beginPath(),
            t.moveTo(g - 2, -1),
            t.lineTo(g - 20, -y - 3),
            t.moveTo(g - 2, 1),
            t.lineTo(g - 20, y + 3),
            t.moveTo(g - 6, -0.5),
            t.lineTo(-6, -y * 0.6),
            t.moveTo(g - 6, 0.5),
            t.lineTo(-6, y * 0.6),
            t.stroke(),
            (t.fillStyle = "#ffffff"),
            t.beginPath(),
            t.arc(g + 6, 0, 3.5 * (1 - l.progress), 0, Math.PI * 2),
            t.fill(),
            t.restore());
          continue;
        }
        const u = l.hasSword ? 20 : 13;
        let m = 0,
          c = Math.PI;
        (l.direction === "right"
          ? ((m = -Math.PI * 0.4), (c = Math.PI * 0.4))
          : l.direction === "left"
            ? ((m = Math.PI * 0.6), (c = Math.PI * 1.4))
            : l.direction === "up"
              ? ((m = -Math.PI * 0.9), (c = -Math.PI * 0.1))
              : ((m = Math.PI * 0.1), (c = Math.PI * 0.9)),
          (t.strokeStyle = l.color),
          (t.lineWidth = l.hasSword ? 5 : 3.5),
          (t.globalAlpha = o),
          t.beginPath(),
          t.arc(0, 0, u, m, c),
          t.stroke(),
          (t.strokeStyle = "#ffffff"),
          (t.lineWidth = 1.8),
          (t.globalAlpha = o * 0.9),
          t.beginPath(),
          t.arc(0, 0, u * 0.92, m, c),
          t.stroke(),
          l.hasSword ||
            ((t.fillStyle = "#ffffff"),
            (t.globalAlpha = o),
            t.beginPath(),
            t.arc(0, 0, 5 * (1 - l.progress), 0, Math.PI * 2),
            t.fill()),
          t.restore());
      }
      for (const l of this.hitParticles)
        (t.save(),
          (t.fillStyle = l.color),
          (t.globalAlpha = l.life),
          t.beginPath(),
          t.arc(l.x, l.y, l.size, 0, Math.PI * 2),
          t.fill(),
          t.restore());
      for (const l of this.floatingTexts)
        (t.save(),
          (t.font = l.isCrit
            ? "bold 14px monospace, sans-serif"
            : "bold 12px monospace, sans-serif"),
          (t.textAlign = "center"),
          (t.strokeStyle = "#020617"),
          (t.lineWidth = 3),
          (t.globalAlpha = l.life),
          t.strokeText(l.text, l.x, l.y),
          (t.fillStyle = l.color),
          t.fillText(l.text, l.x, l.y),
          t.restore());
      for (const l of this.slimeParticles) {
        t.save();
        const o = l.life / l.maxLife;
        if (
          ((t.globalAlpha = Math.max(0, Math.min(1, o * 0.85))),
          l.type === "vapor")
        )
          ((t.fillStyle = l.color),
            t.beginPath(),
            t.arc(
              l.x + Math.sin(o * 8) * 2,
              l.y,
              l.size * (1.6 - o * 0.6),
              0,
              Math.PI * 2,
            ),
            t.fill());
        else if (l.type === "bubble")
          ((t.strokeStyle = "rgba(255, 255, 255, 0.8)"),
            (t.fillStyle = "rgba(56, 189, 248, 0.35)"),
            (t.lineWidth = 1),
            t.beginPath(),
            t.arc(l.x, l.y, l.size, 0, Math.PI * 2),
            t.fill(),
            t.stroke(),
            (t.fillStyle = "#ffffff"),
            t.beginPath(),
            t.arc(
              l.x - l.size * 0.35,
              l.y - l.size * 0.35,
              l.size * 0.25,
              0,
              Math.PI * 2,
            ),
            t.fill());
        else if (l.type === "heal") {
          t.fillStyle = l.color;
          const u = l.size;
          (t.fillRect(l.x - 0.5, l.y - u, 1.5, u * 2),
            t.fillRect(l.x - u, l.y - 0.5, u * 2, 1.5));
        } else if (l.type === "dust") {
          t.fillStyle = l.color || "rgba(217, 119, 6, 0.65)";
          t.globalAlpha = Math.max(0, Math.min(1, o * 0.85));
          const rad = l.size * (1 + (1 - o) * 1.8);
          t.beginPath();
          t.arc(l.x, l.y, rad, 0, Math.PI * 2);
          t.fill();
        } else
          l.type === "poison"
            ? ((t.fillStyle = l.color),
              t.beginPath(),
              t.arc(l.x, l.y, l.size, 0, Math.PI * 2),
              t.fill(),
              (t.fillStyle = "#ffffff"),
              t.beginPath(),
              t.arc(
                l.x - l.size * 0.35,
                l.y - l.size * 0.35,
                l.size * 0.28,
                0,
                Math.PI * 2,
              ),
              t.fill())
            : l.type === "mud" &&
              ((t.fillStyle = l.color),
              t.beginPath(),
              t.ellipse(
                l.x,
                l.y,
                l.size * 1.2,
                l.size * 0.8,
                0,
                0,
                Math.PI * 2,
              ),
              t.fill());
        t.restore();
      }
    }
  }
  if (typeof window !== "undefined") {
    window.CreatureManager = CreatureManager;
  }
