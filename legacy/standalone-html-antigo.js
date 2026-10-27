/* js/export/standalone-html.js
 * Gerador do "Exportar HTML" (buildStandaloneHtml). ATENCAO: contem uma COPIA ANTIGA do jogo dentro de um template; nao recebe as features novas.
 * Trecho de legacy/app.original.js (linhas 32457-35777); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  function buildStandaloneHtml(e = {}) {
    const t = e.seed ?? 54321,
      l = e.timeOfDay ?? 0.5,
      o = e.coords ?? { tx: 0, ty: 0 },
      u = JSON.stringify(
        e.equipment || {
          mao_esquerda: null,
          mao_direita: null,
          chapeu: null,
          camisa: null,
          calca: null,
          botas: null,
          capa: null,
          pingente: null,
          bracelete_esquerdo: null,
          bracelete_direito: null,
          cinto: null,
          mochila: null,
        },
      ),
      m = JSON.stringify(e.backpack || []),
      c = e.gold ?? 150,
      f = e.soundEnabled ?? !0,
      g = e.lanternActive ?? !1;
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Mundo RPG Procedural 2D - Edição Autônoma Completa</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }
    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #090d16;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: #f1f5f9;
    }
    #canvas-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    canvas#game {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* HUD Overlays */
    .hud-panel {
      position: absolute;
      z-index: 10;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      pointer-events: auto;
    }
    #top-left-hud {
      top: 12px;
      left: 12px;
      padding: 10px 14px;
      max-width: 280px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #38bdf8;
    }
    .biome-title {
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
    }
    .biome-desc {
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.4;
    }
    .coords-tag {
      font-family: monospace;
      font-size: 11px;
      color: #f59e0b;
      margin-top: 2px;
      display: flex;
      justify-content: space-between;
    }

    #top-right-hud {
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }
    #minimap-card {
      width: 100px;
      height: 100px;
      padding: 4px;
      border-radius: 12px;
      position: relative;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }
    #minimap-canvas {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      display: block;
    }
    .minimap-center {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      background: #ef4444;
      border: 1px solid #fff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 6px #ef4444;
    }
    .btn-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px;
      max-width: 320px;
    }
    .btn {
      background: rgba(30, 41, 59, 0.9);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
    }
    .btn:hover {
      background: rgba(51, 65, 85, 0.95);
      border-color: rgba(255, 255, 255, 0.3);
      color: #fff;
    }
    .btn.active {
      background: #2563eb;
      border-color: #3b82f6;
      color: #fff;
    }
    .btn-combat {
      background: #b91c1c;
      border-color: #ef4444;
      color: #fff;
    }
    .btn-combat:hover {
      background: #dc2626;
    }
    .btn-interact {
      background: #1d4ed8;
      border-color: #3b82f6;
      color: #fff;
    }
    .btn-interact:hover {
      background: #2563eb;
    }
    .btn-inventory {
      background: #d97706;
      border-color: #f59e0b;
      color: #fff;
    }
    .btn-inventory:hover {
      background: #b45309;
    }

    /* Toast banner */
    #toast-banner {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 50;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid #38bdf8;
      color: #f0fdf4;
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(56, 189, 248, 0.3);
      display: none;
      white-space: nowrap;
      pointer-events: none;
    }

    /* Bottom Controls Hint */
    #controls-hint {
      position: absolute;
      bottom: 14px;
      left: 14px;
      font-size: 11px;
      color: #94a3b8;
      background: rgba(15, 23, 42, 0.8);
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 10;
      pointer-events: auto;
    }

    /* Mobile D-Pad & Actions */
    #mobile-controls {
      display: none;
      position: absolute;
      bottom: 20px;
      right: 16px;
      z-index: 30;
      grid-template-columns: repeat(3, 46px);
      grid-template-rows: repeat(3, 46px);
      gap: 5px;
    }
    @media (max-width: 768px) {
      #mobile-controls {
        display: grid;
      }
      #controls-hint {
        display: none;
      }
      #top-left-hud {
        max-width: 200px;
        padding: 8px 10px;
      }
    }
    .dpad-btn {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #ffffff;
      font-size: 15px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
    }
    .dpad-btn:active {
      background: #2563eb;
    }

    /* Time Slider */
    .time-ctrl {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 0, 0, 0.4);
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 10px;
    }
    .time-ctrl input {
      width: 60px;
      cursor: pointer;
    }

    /* =======================================================
       INVENTORY & FUSION FORGE MODAL
       ======================================================= */
    #inventory-modal {
      position: absolute;
      inset: 0;
      z-index: 100;
      background: rgba(3, 7, 18, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 12px;
      pointer-events: auto;
    }
    #inventory-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      width: 100%;
      max-width: 900px;
      height: 90vh;
      max-height: 640px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      overflow: hidden;
    }
    .modal-header {
      padding: 12px 18px;
      background: #1e293b;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-tabs {
      display: flex;
      gap: 8px;
    }
    .modal-tab-btn {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .modal-tab-btn:hover {
      color: #fff;
      background: rgba(51, 65, 85, 0.8);
    }
    .modal-tab-btn.active {
      background: #2563eb;
      color: #fff;
      border-color: #3b82f6;
    }
    .modal-close-btn {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      padding: 5px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
    }
    .modal-close-btn:hover {
      background: #dc2626;
      color: #fff;
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      gap: 14px;
    }

    /* Paperdoll Equipment Slots Layout */
    .paperdoll-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      width: 320px;
      shrink: 0;
    }
    .equip-slot {
      background: rgba(30, 41, 59, 0.6);
      border: 1px dashed rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 72px;
      cursor: pointer;
      position: relative;
      transition: all 0.15s ease;
      text-align: center;
    }
    .equip-slot:hover {
      border-color: #38bdf8;
      background: rgba(51, 65, 85, 0.8);
    }
    .equip-slot.filled {
      border-style: solid;
      border-color: #38bdf8;
      background: rgba(14, 116, 144, 0.2);
    }
    .equip-slot-name {
      font-size: 9px;
      text-transform: uppercase;
      color: #94a3b8;
      margin-bottom: 2px;
      font-weight: 700;
    }
    .equip-item-title {
      font-size: 11px;
      font-weight: bold;
      color: #f1f5f9;
      line-height: 1.2;
    }
    .equip-slot-empty {
      font-size: 10px;
      color: #64748b;
    }

    /* Stats Panel */
    .stats-panel {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 11px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      color: #cbd5e1;
    }
    .stat-val {
      font-weight: 700;
      color: #38bdf8;
      font-family: monospace;
    }

    /* Backpack Grid */
    .backpack-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .backpack-filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .gold-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid #f59e0b;
      padding: 4px 10px;
      border-radius: 8px;
      color: #fbbf24;
      font-weight: 800;
      font-size: 12px;
    }
    .backpack-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
      gap: 6px;
      max-height: 380px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .item-card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      padding: 6px 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 64px;
      cursor: pointer;
      position: relative;
      transition: all 0.12s ease;
    }
    .item-card:hover {
      border-color: #38bdf8;
      transform: translateY(-1px);
    }
    .item-card.selected {
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.15);
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
    }
    .item-card-count {
      position: absolute;
      top: 2px;
      right: 3px;
      background: #0284c7;
      color: #fff;
      font-size: 9px;
      font-weight: 800;
      padding: 1px 4px;
      border-radius: 6px;
    }
    .item-card-title {
      font-size: 10px;
      font-weight: 600;
      line-height: 1.15;
      margin-top: 2px;
      word-break: break-word;
    }

    /* Item Details Drawer */
    #item-detail-pane {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 220px;
      max-width: 260px;
    }
    .detail-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: auto;
    }
    .action-btn {
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      text-align: center;
    }
    .action-equip { background: #0284c7; color: #fff; }
    .action-equip:hover { background: #0369a1; }
    .action-fuse { background: #d97706; color: #fff; }
    .action-fuse:hover { background: #b45309; }
    .action-use { background: #16a34a; color: #fff; }
    .action-use:hover { background: #15803d; }
    .action-drop { background: #475569; color: #cbd5e1; }
    .action-drop:hover { background: #dc2626; color: #fff; }

    /* =======================================================
       FUSION CHAMBER / ALCHEMY FORGE STYLES
       ======================================================= */
    .fusion-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }
    .fusion-bench {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
      border: 1px solid rgba(245, 158, 11, 0.4);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .fusion-slots-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      width: 100%;
    }
    .fusion-slot-box {
      width: 110px;
      height: 90px;
      background: rgba(15, 23, 42, 0.8);
      border: 2px dashed rgba(245, 158, 11, 0.5);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px;
      text-align: center;
      cursor: pointer;
      position: relative;
      transition: all 0.15s ease;
    }
    .fusion-slot-box:hover {
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.1);
    }
    .fusion-slot-box.has-item {
      border-style: solid;
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.15);
    }
    .fusion-plus {
      font-size: 20px;
      font-weight: 800;
      color: #f59e0b;
    }
    .fusion-arrow {
      font-size: 22px;
      font-weight: 800;
      color: #38bdf8;
    }
    .fusion-result-box {
      width: 130px;
      height: 90px;
      background: rgba(2, 132, 199, 0.15);
      border: 2px solid #0284c7;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px;
      text-align: center;
    }
    .btn-fuse-action {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #0f172a;
      border: none;
      padding: 10px 24px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
      transition: all 0.15s ease;
    }
    .btn-fuse-action:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6);
    }
    .btn-fuse-action:disabled {
      background: #475569;
      color: #94a3b8;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    /* Codex of Recipes */
    .codex-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .codex-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
      max-height: 220px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .codex-card {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 11px;
    }
    .codex-card-title {
      font-weight: 700;
      color: #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .codex-formula {
      font-size: 10px;
      color: #38bdf8;
      font-family: monospace;
    }
    .codex-fill-btn {
      background: #1e293b;
      border: 1px solid #38bdf8;
      color: #38bdf8;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 4px;
      align-self: flex-start;
      transition: all 0.15s ease;
    }
    .codex-fill-btn:hover {
      background: #0284c7;
      color: #fff;
    }
  </style>
</head>
<body>
  <div id="canvas-container">
    <canvas id="game"></canvas>
  </div>

  <!-- Top-Left Biome & Coordinates HUD -->
  <div class="hud-panel" id="top-left-hud">
    <div class="badge">
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#22c55e;"></span>
      <span id="biome-cat">Mundo Procedural RPG</span>
    </div>
    <div class="biome-title" id="biome-name">Planície Florida</div>
    <div class="biome-desc" id="biome-desc">Campos verdejantes com flores silvestres e brisa suave.</div>
    <div class="coords-tag">
      <span id="player-coords">X: 0 | Y: 0</span>
      <span id="world-seed-tag">Seed: #${t}</span>
    </div>
    <div style="margin-top:5px; display:flex; flex-direction:column; gap:3px;">
      <div style="display:flex; justify-content:space-between; font-size:10px; font-weight:600; color:#fbbf24;">
        <span id="stamina-label">⚡ Vigor / Cansaço</span>
        <span id="stamina-val" style="font-family:monospace;">100 / 100</span>
      </div>
      <div style="height:5px; background:rgba(30,41,59,0.8); border-radius:3px; overflow:hidden; border:1px solid rgba(255,255,255,0.1);">
        <div id="stamina-bar" style="width:100%; height:100%; background:linear-gradient(90deg, #f59e0b, #fbbf24); transition:width 0.1s ease;"></div>
      </div>
    </div>
  </div>

  <!-- Top-Right Minimap & Quick Actions -->
  <div class="hud-panel" id="top-right-hud" style="background:transparent; border:none; box-shadow:none;">
    <div id="minimap-card">
      <canvas id="minimap-canvas" width="100" height="100"></canvas>
      <div class="minimap-center"></div>
    </div>
    <div class="btn-row">
      <button class="btn btn-combat" id="btn-combat" title="Combate / Golpear (Espaço ou F)">⚔️ Golpe</button>
      <button class="btn" id="btn-pebble" title="Arremessar Seixo / Mirar (Shift)" style="background:#475569;border-color:#64748b;color:#fff;">⚪ Seixo [Shift]</button>
      <button class="btn btn-interact" id="btn-interact" title="Interagir / Coletar (Tecla E)">✋ Coletar [E]</button>
      <button class="btn" id="btn-torch" title="Tocha das Cavernas (Tecla L)">🔥 Tocha</button>
      <button class="btn btn-inventory" id="btn-inventory" title="Abrir Inventário e Mesa de Fusão (Tecla I ou B)">🎒 Mochila</button>
      <button class="btn" id="btn-sound">🔊 Som</button>
      <button class="btn" id="btn-recenter" style="display:none; color:#38bdf8;">🎯 Centralizar</button>
      <button class="btn" id="btn-reroll">🎲 Nova Seed</button>
    </div>
    <div class="btn-row">
      <div class="time-ctrl">
        <span>☀️</span>
        <input type="range" id="time-slider" min="0" max="1" step="0.01" value="${l}" title="Ciclo Dia e Noite" />
        <span>🌙</span>
        <span id="time-label" style="min-width:44px; text-align:right;">Meio-dia</span>
      </div>
      <button class="btn" id="btn-zoom-out" style="padding:4px 8px;">-</button>
      <span id="zoom-text" style="font-size:10px; font-family:monospace; color:#38bdf8; align-self:center;">100%</span>
      <button class="btn" id="btn-zoom-in" style="padding:4px 8px;">+</button>
    </div>
  </div>

  <!-- Controls hint bar -->
  <div id="controls-hint">
    🎮 <b>WASD / Setas</b> Mover &bull; <b>[Espaço]</b> Atacar/Golpear &bull; <b>[E]</b> Coletar/Interagir &bull; <b>[I / B]</b> Inventário & Forja &bull; <b>[L]</b> Tocha &bull; <b>[C]</b> Câmera &bull; <b>Scroll</b> Zoom
  </div>

  <!-- Mobile D-pad & Actions -->
  <div id="mobile-controls">
    <button class="dpad-btn" id="m-pebble" style="background:#475569; color:#fff;" title="Seixo / Mirar (Shift)">⚪</button>
    <button class="dpad-btn" id="m-up">▲</button>
    <button class="dpad-btn" id="m-combat" style="background:#b91c1c;">⚔️</button>
    <button class="dpad-btn" id="m-left">◀</button>
    <button class="dpad-btn" id="m-interact" style="background:#1d4ed8;">E</button>
    <button class="dpad-btn" id="m-right">▶</button>
    <button class="dpad-btn" id="m-inv" style="background:#d97706;">🎒</button>
    <button class="dpad-btn" id="m-down">▼</button>
    <button class="dpad-btn" id="m-torch" style="background:#f59e0b; color:#000;">🔥</button>
  </div>

  <!-- Toast Notification -->
  <div id="toast-banner">Notificação</div>

  <!-- =======================================================
       INVENTORY, EQUIPMENT & FUSION FORGE MODAL
       ======================================================= -->
  <div id="inventory-modal">
    <div id="inventory-card">
      <!-- Header with Tabs -->
      <div class="modal-header">
        <div class="modal-tabs">
          <button class="modal-tab-btn active" id="tab-btn-equip">🛡️ Equipamentos (12 Slots)</button>
          <button class="modal-tab-btn" id="tab-btn-fuse">⚒️ Forja & Fusão</button>
          <button class="modal-tab-btn" id="tab-btn-backpack">📦 Itens (6 Slots)</button>
        </div>
        <button class="modal-close-btn" id="modal-close-btn">✕ Fechar [ESC]</button>
      </div>

      <!-- TAB 1: EQUIPMENT & PAPERDOLL -->
      <div class="modal-body" id="tab-content-equip">
        <!-- 12-Slot Paperdoll Grid -->
        <div class="paperdoll-container" id="paperdoll-grid">
          <!-- Dynamically injected slots -->
        </div>

        <!-- Character Stats & Inspector -->
        <div style="flex:1; display:flex; flex-direction:column; gap:12px;">
          <div class="stats-panel">
            <h4 style="color:#f59e0b; font-size:13px; font-weight:800; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">
              ⚔️ Atributos do Aventureiro
            </h4>
            <div class="stat-row"><span>Poder de Ataque:</span><span class="stat-val" id="stat-atk">5</span></div>
            <div class="stat-row"><span>Defesa Total:</span><span class="stat-val" id="stat-def">2</span></div>
            <div class="stat-row"><span>Bônus de Marcha:</span><span class="stat-val" id="stat-spd">+0%</span></div>
            <div class="stat-row"><span>Alcance de Luz da Tocha:</span><span class="stat-val" id="stat-luz">+0</span></div>
            <div class="stat-row"><span>Capacidade de Vigor:</span><span class="stat-val" id="stat-vig">100</span></div>
            <p style="color:#94a3b8; font-size:10px; margin-top:4px;">
              Dica: Clique em qualquer slot equipado para devolver o item à mochila.
            </p>
          </div>

          <div id="equip-slot-preview" style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px; flex:1;">
            <span style="font-size:11px; color:#64748b;">Selecione um equipamento para inspecionar seus bônus.</span>
          </div>
        </div>
      </div>

      <!-- TAB 2: FUSION CHAMBER & ALCHEMY FORGE -->
      <div class="modal-body" id="tab-content-fuse" style="display:none; flex-direction:column;">
        <div class="fusion-container">
          <!-- The Alchemy Forge Bench -->
          <div class="fusion-bench">
            <h3 style="color:#f59e0b; font-size:14px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">
              ⚒️ Mesa de Fusão & Transmutação Alquímica
            </h3>
            <p style="color:#94a3b8; font-size:11px; text-align:center;">
              Selecione 2 ingredientes da sua mochila para fundir novas tochas, armas, armaduras, escudos e elixires!
            </p>

            <div class="fusion-slots-row">
              <div class="fusion-slot-box" id="fuse-slot-1">
                <span style="font-size:10px; color:#94a3b8; font-weight:700;">INGREDIENTE 1</span>
                <span id="fuse-slot-1-name" style="font-size:11px; color:#f1f5f9; margin-top:4px;">Vazio</span>
              </div>
              <div class="fusion-plus">+</div>
              <div class="fusion-slot-box" id="fuse-slot-2">
                <span style="font-size:10px; color:#94a3b8; font-weight:700;">INGREDIENTE 2</span>
                <span id="fuse-slot-2-name" style="font-size:11px; color:#f1f5f9; margin-top:4px;">Vazio</span>
              </div>
              <div class="fusion-arrow">➔</div>
              <div class="fusion-result-box" id="fuse-result-box">
                <span style="font-size:9px; color:#38bdf8; font-weight:800;">RESULTADO</span>
                <span id="fuse-result-name" style="font-size:11px; color:#f1f5f9; font-weight:bold; margin-top:2px;">Nenhum</span>
              </div>
            </div>

            <div style="display:flex; gap:10px; margin-top:4px;">
              <button class="btn-fuse-action" id="btn-execute-fusion" disabled>
                ✨ Realizar Fusão e Forjar
              </button>
              <button class="btn" id="btn-clear-fusion" style="background:#334155;">
                Limpar Mesa
              </button>
            </div>
          </div>

          <!-- Recipe Codex -->
          <div class="codex-section">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h4 style="font-size:12px; font-weight:700; color:#38bdf8;">📖 Códice de Fórmulas Conhecidas</h4>
              <div style="display:flex; gap:4px;">
                <button class="btn" id="codex-filter-all" style="padding:2px 8px; font-size:10px;">Todas</button>
                <button class="btn" id="codex-filter-util" style="padding:2px 8px; font-size:10px;">Tochas</button>
                <button class="btn" id="codex-filter-weapons" style="padding:2px 8px; font-size:10px;">Armas</button>
                <button class="btn" id="codex-filter-armor" style="padding:2px 8px; font-size:10px;">Armaduras</button>
                <button class="btn" id="codex-filter-potions" style="padding:2px 8px; font-size:10px;">Poções</button>
              </div>
            </div>
            <div class="codex-grid" id="codex-recipes-list">
              <!-- Dynamically populated recipes -->
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: BACKPACK -->
      <div class="modal-body" id="tab-content-backpack" style="display:none;">
        <div class="backpack-container">
          <div class="backpack-filter-bar">
            <div style="display:flex; gap:4px;">
              <button class="btn active" id="bp-filter-all" style="font-size:11px; padding:4px 10px;">Todos</button>
              <button class="btn" id="bp-filter-equip" style="font-size:11px; padding:4px 10px;">Equipamentos</button>
              <button class="btn" id="bp-filter-mat" style="font-size:11px; padding:4px 10px;">Recursos</button>
              <button class="btn" id="bp-filter-pot" style="font-size:11px; padding:4px 10px;">Consumíveis</button>
            </div>
            <div class="gold-badge">
              <span>🪙</span>
              <span id="gold-counter">${c}</span>
              <span style="font-size:10px; color:#fde68a;">Moedas</span>
            </div>
          </div>

          <div class="backpack-grid" id="backpack-grid">
            <!-- Dynamically populated backpack slots -->
          </div>
        </div>

        <!-- Selected Item Detail Pane -->
        <div id="item-detail-pane">
          <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:700;">Detalhes do Item</div>
          <div id="detail-title" style="font-size:13px; font-weight:800; color:#f1f5f9;">Selecione um item</div>
          <div id="detail-desc" style="font-size:11px; color:#94a3b8; line-height:1.4;">Clique em um item na mochila acima para ver informações ou usá-lo.</div>
          <div id="detail-stats" style="font-size:11px; font-family:monospace; color:#38bdf8;"></div>
          <div id="detail-val" style="font-size:10px; color:#fbbf24;"></div>
          <div class="detail-actions" id="detail-actions" style="display:none;">
            <button class="action-btn action-equip" id="btn-action-equip">Equipar no Personagem</button>
            <button class="action-btn action-fuse" id="btn-action-fuse">Colocar na Mesa de Fusão</button>
            <button class="action-btn action-use" id="btn-action-use" style="display:none;">Usar Poção</button>
            <button class="action-btn action-drop" id="btn-action-drop">Descartar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    /* =======================================================
       1. SIMPLEX / PERLIN NOISE ENGINE
       ======================================================= */
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
          [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
          [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
          [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
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
        let total = 0, freq = 1, amp = 1, maxAmp = 0;
        for (let i = 0; i < octaves; i++) {
          total += this.noise2D(x * freq, y * freq) * amp;
          maxAmp += amp;
          freq *= lacunarity;
          amp *= gain;
        }
        return Math.max(0, Math.min(1, (total / maxAmp + 1) * 0.5));
      }
    }

    /* =======================================================
       2. BIOME SYSTEM & CONSTANTS
       ======================================================= */
    const BIOMES = {
      DEEP_OCEAN: { name: 'Oceano Profundo', ground: '#0c223f', accent: '#1e3a8a', hasWater: true, desc: 'Águas abissais profundas com correntes fortes.' },
      COAST_WATER: { name: 'Águas Rasas', ground: '#0284c7', accent: '#38bdf8', hasWater: true, desc: 'Costa cristalina de águas calmas azul-turquesa.' },
      BEACH: { name: 'Praia Dourada', ground: '#e0c078', accent: '#d4b062', prop: 'palm', desc: 'Areias suaves com conchas e palmeiras tropicais.' },
      MEADOW: { name: 'Planície Florida', ground: '#5fa743', accent: '#6cb64d', prop: 'oak', desc: 'Campos verdejantes com flores silvestres e brisa suave.' },
      FOREST: { name: 'Floresta Temperada', ground: '#458532', accent: '#3c752b', prop: 'oak', desc: 'Bosques frondosos de carvalhos e clareiras.' },
      DEEP_FOREST: { name: 'Floresta Ancestral', ground: '#2d6124', accent: '#24501d', prop: 'oak', desc: 'Árvores colossais milenares e vaga-lumes misteriosos.' },
      SWAMP: { name: 'Pântano Místico', ground: '#4a5b3a', accent: '#3c4b2e', prop: 'willow', desc: 'Solos encharcados com salgueiros e cogumelos.' },
      SAVANNA: { name: 'Savana Árida', ground: '#bfa14c', accent: '#b0923f', prop: 'oak', desc: 'Campos dourados sob o calor do sol.' },
      DESERT: { name: 'Deserto Dourado', ground: '#dfb76c', accent: '#cfa557', prop: 'cactus', desc: 'Dunas de areia fina e cactos imponentes.' },
      OASIS: { name: 'Oásis do Deserto', ground: '#4ade80', accent: '#22c55e', prop: 'palm', desc: 'Oásis verdejante no coração do deserto.' },
      OASIS_LAKE: { name: 'Nascente do Oásis', ground: '#06b6d4', accent: '#22d3ee', hasWater: true, desc: 'Nascente cristalina turquesa no centro do oásis.' },
      MEADOW_LAKE: { name: 'Lago Campestre', ground: '#0284c7', accent: '#38bdf8', hasWater: true, desc: 'Grande lago límpido de águas calmas e nenúfares.' },
      FOREST_LAKE: { name: 'Lago da Floresta', ground: '#0f766e', accent: '#14b8a6', hasWater: true, desc: 'Vasto lago de águas esmeralda envolto pelas árvores.' },
      SWAMP_LAKE: { name: 'Lago Pantanoso', ground: '#14532d', accent: '#166534', hasWater: true, desc: 'Alagadiço denso com águas musgosas e vapores.' },
      SAVANNA_LAKE: { name: 'Bebedouro da Savana', ground: '#0369a1', accent: '#0284c7', hasWater: true, desc: 'Bebedouro natural ensolarado de águas terrosas.' },
      TAIGA_LAKE: { name: 'Lago Boreal', ground: '#0c4a6e', accent: '#38bdf8', hasWater: true, desc: 'Lago alpino de águas azul-safira com margens nevadas.' },
      GLACIER_LAKE: { name: 'Lago Glacial', ground: '#0891b2', accent: '#e0f2fe', hasWater: true, desc: 'Águas de degelo azul-ciano com blocos flutuantes de gelo.' },
      CANYON: { name: 'Cânion Vermelho', ground: '#b45309', accent: '#92400e', prop: 'none', desc: 'Profundas gargantas esculpidas em arenito terracota.' },
      SNOW_TAIGA: { name: 'Taiga Nevada', ground: '#d6e5ea', accent: '#bfd5dd', prop: 'pine', desc: 'Pinheiros cobertos por neve cintilante.' },
      GLACIER: { name: 'Geleiras Ancestrais', ground: '#e0f2fe', accent: '#bae6fd', prop: 'pine', desc: 'Vastas extensões de gelo azul eterno.' },
      SNOW_PEAK: { name: 'Picos Glaciais', ground: '#f1f5f9', accent: '#cbd5e1', prop: 'pine', desc: 'Altas montanhas gélidas com ventos cortantes.' },
      VOLCANIC: { name: 'Vulcão da Ilha', ground: '#292524', accent: '#dc2626', prop: 'burnt', desc: 'Cratera vulcânica imponente com cinzas e lava.' }
    };

    function getBiome(e, m, t, ctx = {}) {
      if (ctx.isVolcano) return BIOMES.VOLCANIC;
      if (e < 0.28) return BIOMES.DEEP_OCEAN;
      if (e < 0.36) return BIOMES.COAST_WATER;
      if (e < 0.42) return BIOMES.BEACH;
      if (e > 0.84) {
        if (t < 0.35) return BIOMES.SNOW_PEAK;
        if (t > 0.70 && ctx.canyonVal > 0.35) return BIOMES.CANYON;
      }
      if (t >= 0.70) {
        if (e < 0.48) return BIOMES.SAVANNA;
        if (ctx.oasisVal > 0.68) {
          if (ctx.oasisVal > 0.81) return BIOMES.OASIS_LAKE;
          return BIOMES.OASIS;
        }
        if (ctx.canyonVal !== undefined && (Math.abs(ctx.canyonVal) < 0.15 || ctx.canyonVal > 0.72)) return BIOMES.CANYON;
        return BIOMES.DESERT;
      }
      if (t >= 0.56) {
        if (e >= 0.48 && e <= 0.66 && ctx.lakeVal > 0.76) return BIOMES.SAVANNA_LAKE;
        return BIOMES.SAVANNA;
      }
      if (t >= 0.44) {
        if (e >= 0.48 && e <= 0.66 && ctx.lakeVal > 0.73) return BIOMES.MEADOW_LAKE;
        return BIOMES.MEADOW;
      }
      if (t >= 0.26) {
        if (e < 0.47) return BIOMES.MEADOW;
        if (ctx.swampVal > 0.68 && e < 0.62) {
          if (ctx.lakeVal > 0.72) return BIOMES.SWAMP_LAKE;
          return BIOMES.SWAMP;
        }
        if (e >= 0.48 && e <= 0.68 && ctx.lakeVal > 0.70) return BIOMES.FOREST_LAKE;
        if (m > 0.62) return BIOMES.DEEP_FOREST;
        return BIOMES.FOREST;
      }
      if (t >= 0.14) {
        if (e >= 0.48 && e <= 0.62 && ctx.lakeVal > 0.73) return BIOMES.TAIGA_LAKE;
        return BIOMES.SNOW_TAIGA;
      }
      if (e > 0.60) return BIOMES.SNOW_PEAK;
      if (e >= 0.47 && e <= 0.60 && ctx.lakeVal > 0.75) return BIOMES.GLACIER_LAKE;
      return BIOMES.GLACIER;
    }

    /* =======================================================
       3. 12 EQUIPMENT SLOTS CONFIGURATION
       ======================================================= */
    const EQUIPMENT_SLOTS_DEF = [
      { id: 'chapeu', label: 'Chapéu / Elmo' },
      { id: 'pingente', label: 'Amuleto / Pingente' },
      { id: 'capa', label: 'Capa / Manto' },
      { id: 'mao_esquerda', label: 'Mão Esquerda (Secundária/Tocha)' },
      { id: 'camisa', label: 'Camisa / Peitoral' },
      { id: 'mao_direita', label: 'Mão Direita (Arma)' },
      { id: 'bracelete_esquerdo', label: 'Bracelete Esquerdo' },
      { id: 'cinto', label: 'Cinto / Faixa' },
      { id: 'bracelete_direito', label: 'Bracelete Direito' },
      { id: 'calca', label: 'Calça / Pernas' },
      { id: 'botas', label: 'Botas de Viagem' },
      { id: 'mochila', label: 'Bolsa de Recursos' }
    ];

    /* =======================================================
       4. ITEM FUSION RECIPES & SYSTEM
       ======================================================= */
    function itemMatchesKw(it, ...keywords) {
      if (!it) return false;
      const n = (it.name || '').toLowerCase();
      const id = (it.id || '').toLowerCase();
      return keywords.some(k => {
        const kwLower = k.toLowerCase();
        if (kwLower === 'fibra' && (n.includes('corda') || id.includes('corda'))) return false;
        return n.includes(kwLower) || id.includes(kwLower);
      });
    }

    function isRawFibra(it) {
      if (!it) return false;
      const n = (it.name || '').toLowerCase();
      const id = (it.id || '').toLowerCase();
      if (n.includes('corda') || id.includes('corda')) return false;
      return n.includes('fibra') || id.includes('fibra');
    }

    function isCordaPequena(it) {
      if (!it) return false;
      const n = (it.name || '').toLowerCase();
      const id = (it.id || '').toLowerCase();
      const hasCorda = n.includes('corda') || id.includes('corda');
      return hasCorda && (n.includes('pequena') || id.includes('pequena'));
    }

    function isCordaMedia(it) {
      if (!it) return false;
      const n = (it.name || '').toLowerCase();
      const id = (it.id || '').toLowerCase();
      const hasCorda = n.includes('corda') || id.includes('corda');
      return hasCorda && (n.includes('média') || n.includes('media') || id.includes('media'));
    }

    function isCordaGrande(it) {
      if (!it) return false;
      const n = (it.name || '').toLowerCase();
      const id = (it.id || '').toLowerCase();
      const hasCorda = n.includes('corda') || id.includes('corda');
      if (n.includes('gigante') || id.includes('gigante')) return false;
      return hasCorda && (n.includes('grande') || id.includes('grande'));
    }

    function isCordaGigante(it) {
      if (!it) return false;
      const n = (it.name || '').toLowerCase();
      const id = (it.id || '').toLowerCase();
      const hasCorda = n.includes('corda') || id.includes('corda');
      return hasCorda && (n.includes('gigante') || id.includes('gigante'));
    }

    function matchPair(a, b, kw1, kw2) {
      return (itemMatchesKw(a, ...kw1) && itemMatchesKw(b, ...kw2)) ||
             (itemMatchesKw(a, ...kw2) && itemMatchesKw(b, ...kw1));
    }

    const FUSION_RECIPES = [
      {
        id: 'fuse_corda_pequena',
        name: 'Corda de Fibra Pequena',
        category: 'utilitario',
        categoryLabel: 'Corda & Utilitário',
        ing1: 'Fibra Vegetal',
        ing2: 'Fibra Vegetal',
        desc: 'Trança rústica de feixes de fibra vegetal. Leve e flexível para o cinto.',
        match: (a, b) => isRawFibra(a) && isRawFibra(b),
        create: () => ({
          id: 'corda_pequena_' + Date.now(),
          name: 'Corda de Fibra Pequena',
          categoryType: 'equipment',
          slot: 'cinto',
          isEquippable: true,
          rarity: 'comum',
          desc: 'Corda flexível trançada com feixes de fibra vegetal (+10 Vigor, +5% Vel).',
          stats: { defense: 2, staminaBonus: 10, speedBonusPercent: 5 },
          value: 20
        })
      },
      {
        id: 'fuse_corda_media',
        name: 'Corda de Fibra Média',
        category: 'utilitario',
        categoryLabel: 'Corda & Utilitário',
        ing1: 'Corda de Fibra Pequena',
        ing2: 'Corda de Fibra Pequena',
        desc: 'Fusão de duas cordas pequenas entrelaçadas em trança dupla com nós firmes.',
        match: (a, b) => isCordaPequena(a) && isCordaPequena(b),
        create: () => ({
          id: 'corda_media_' + Date.now(),
          name: 'Corda de Fibra Média',
          categoryType: 'equipment',
          slot: 'cinto',
          isEquippable: true,
          rarity: 'incomum',
          desc: 'Corda reforçada em trama dupla (+22 Vigor, +10% Vel, +5 Def).',
          stats: { defense: 5, staminaBonus: 22, speedBonusPercent: 10 },
          value: 55
        })
      },
      {
        id: 'fuse_corda_grande',
        name: 'Corda de Fibra Grande',
        category: 'utilitario',
        categoryLabel: 'Corda & Utilitário',
        ing1: 'Corda de Fibra Média',
        ing2: 'Corda de Fibra Média',
        desc: 'Junção de duas cordas médias compactadas com braçadeiras de reforço.',
        match: (a, b) => isCordaMedia(a) && isCordaMedia(b),
        create: () => ({
          id: 'corda_grande_' + Date.now(),
          name: 'Corda de Fibra Grande',
          categoryType: 'equipment',
          slot: 'cinto',
          isEquippable: true,
          rarity: 'raro',
          desc: 'Grossa corda naval forjada com cordas médias (+42 Vigor, +15% Vel, +10 Def).',
          stats: { defense: 10, staminaBonus: 42, speedBonusPercent: 15, attack: 3 },
          value: 130
        })
      },
      {
        id: 'fuse_corda_gigante',
        name: 'Corda de Fibra Gigante',
        category: 'utilitario',
        categoryLabel: 'Corda & Utilitário',
        ing1: 'Corda de Fibra Grande',
        ing2: 'Corda de Fibra Grande',
        desc: 'Cabo colossal de resistência titânica com tramas lendárias!',
        match: (a, b) => isCordaGrande(a) && isCordaGrande(b),
        create: () => ({
          id: 'corda_gigante_' + Date.now(),
          name: 'Corda de Fibra Gigante',
          categoryType: 'equipment',
          slot: 'cinto',
          isEquippable: true,
          rarity: 'epico',
          desc: 'Cabo colossal lendário capaz de conter golens titânicos (+75 Vigor, +22% Vel, +18 Def).',
          stats: { defense: 18, staminaBonus: 75, speedBonusPercent: 22, attack: 8 },
          value: 320
        })
      },
      {
        id: 'fuse_torch_pinho',
        name: 'Tocha de Pinho Flamejante',
        category: 'utilitario',
        categoryLabel: 'Iluminação & Mão',
        ing1: 'Galho de Madeira',
        ing2: 'Pederneira',
        desc: 'Tocha robusta forjada unindo madeira seca e faíscas de pederneira. Equipe na mão!',
        match: (a, b) => matchPair(a, b, ['galho'], ['pederneira', 'pedreneira']),
        create: () => ({
          id: 'torch_' + Date.now(),
          name: 'Tocha de Pinho Flamejante',
          categoryType: 'equipment',
          slot: 'mao_esquerda',
          isEquippable: true,
          rarity: 'incomum',
          desc: 'Tocha acesa com faísca de pederneira. Ilumina a noite e as profundezas.',
          stats: { attack: 3, lightRadiusBonus: 50 },
          value: 30
        })
      },
      {
        id: 'fuse_torch_resina',
        name: 'Tocha de Resina Brilhante',
        category: 'utilitario',
        categoryLabel: 'Iluminação & Mão',
        ing1: 'Galho de Madeira',
        ing2: 'Resina Natural',
        desc: 'Tocha tratada com resina florestal espessa. Emite uma chama âmbar densa com grande raio.',
        match: (a, b) => matchPair(a, b, ['galho'], ['resina']),
        create: () => ({
          id: 'torch_res_' + Date.now(),
          name: 'Tocha de Resina Brilhante',
          categoryType: 'equipment',
          slot: 'mao_esquerda',
          isEquippable: true,
          rarity: 'incomum',
          desc: 'Tocha densa que queima com luminescência ampliada nas trevas.',
          stats: { attack: 4, lightRadiusBonus: 65 },
          value: 40
        })
      },
      {
        id: 'fuse_wood_staff',
        name: 'Bastão de Madeira Reforçado',
        category: 'arma',
        categoryLabel: 'Arma Principal',
        ing1: 'Galho de Madeira',
        ing2: 'Galho de Madeira',
        desc: 'Dois galhos rígidos entrelaçados para desferir golpes contundentes.',
        match: (a, b) => itemMatchesKw(a, 'galho') && itemMatchesKw(b, 'galho'),
        create: () => ({
          id: 'staff_' + Date.now(),
          name: 'Bastão de Madeira Reforçado',
          categoryType: 'equipment',
          slot: 'mao_direita',
          isEquippable: true,
          rarity: 'comum',
          desc: 'Arma básica de madeira torneada.',
          stats: { attack: 6, defense: 1 },
          value: 35
        })
      },
      {
        id: 'fuse_stone_mace',
        name: 'Maça Rústica de Pedra',
        category: 'arma',
        categoryLabel: 'Arma Principal',
        ing1: 'Galho de Madeira',
        ing2: 'Seixo de Pedra',
        desc: 'Um seixo angular amarrado à extremidade de um galho forte.',
        match: (a, b) => matchPair(a, b, ['galho'], ['seixo']),
        create: () => ({
          id: 'mace_' + Date.now(),
          name: 'Maça Rústica de Pedra',
          categoryType: 'equipment',
          slot: 'mao_direita',
          isEquippable: true,
          rarity: 'comum',
          desc: 'Arma de impacto pesado construída com pedra e madeira.',
          stats: { attack: 8, defense: 2 },
          value: 45
        })
      },
      {
        id: 'fuse_iron_sword',
        name: 'Espada de Ferro Forjado',
        category: 'arma',
        categoryLabel: 'Arma Principal',
        ing1: 'Galho de Madeira',
        ing2: 'Cristal de Ferro',
        desc: 'Lâmina afiada forjada com ferro denso e empunhadura ergonômica.',
        match: (a, b) => matchPair(a, b, ['galho'], ['ferro']),
        create: () => ({
          id: 'sword_' + Date.now(),
          name: 'Espada de Ferro Forjado',
          categoryType: 'equipment',
          slot: 'mao_direita',
          isEquippable: true,
          rarity: 'incomum',
          desc: 'Lâmina de corte preciso. Estilhaça defesas e acelera o combate.',
          stats: { attack: 11, defense: 2 },
          value: 65
        })
      },
      {
        id: 'fuse_crystal_staff',
        name: 'Cajado de Cristal Arcano',
        category: 'arma',
        categoryLabel: 'Arma Principal',
        ing1: 'Galho de Madeira',
        ing2: 'Drusa de Cristal',
        desc: 'Cajado esculpido com cristal lapidado em seu topo. Emana luz e poder.',
        match: (a, b) => matchPair(a, b, ['galho'], ['ametista', 'safira', 'rubi', 'esmeralda', 'drusa', 'cristal']),
        create: () => ({
          id: 'cstaff_' + Date.now(),
          name: 'Cajado de Cristal Arcano',
          categoryType: 'equipment',
          slot: 'mao_direita',
          isEquippable: true,
          rarity: 'raro',
          desc: 'Arma mística canalizadora que amplifica ataque e emana luz.',
          stats: { attack: 14, lightRadiusBonus: 35, staminaBonus: 15 },
          value: 120
        })
      },
      {
        id: 'fuse_stone_shield',
        name: 'Escudo de Pedra Lapidada',
        category: 'armadura',
        categoryLabel: 'Secundária / Escudo',
        ing1: 'Seixo de Pedra',
        ing2: 'Seixo de Pedra',
        desc: 'Broquel de rocha densa para aparar investidas corporais.',
        match: (a, b) => itemMatchesKw(a, 'seixo') && itemMatchesKw(b, 'seixo'),
        create: () => ({
          id: 'shield_s_' + Date.now(),
          name: 'Escudo de Pedra Lapidada',
          categoryType: 'equipment',
          slot: 'mao_esquerda',
          isEquippable: true,
          rarity: 'comum',
          desc: 'Escudo convexo que bloqueia golpes com estabilidade.',
          stats: { defense: 9, attack: 1 },
          value: 40
        })
      },
      {
        id: 'fuse_iron_shield',
        name: 'Escudo de Ferro Temperado',
        category: 'armadura',
        categoryLabel: 'Secundária / Escudo',
        ing1: 'Cristal de Ferro',
        ing2: 'Seixo de Pedra',
        desc: 'Escudo com reforços de aço e fixadores rígidos.',
        match: (a, b) => matchPair(a, b, ['ferro'], ['seixo']),
        create: () => ({
          id: 'shield_i_' + Date.now(),
          name: 'Escudo de Ferro Temperado',
          categoryType: 'equipment',
          slot: 'mao_esquerda',
          isEquippable: true,
          rarity: 'raro',
          desc: 'Escudo impenetrável forjado em bigorna rúnica.',
          stats: { defense: 16, attack: 2 },
          value: 110
        })
      },
      {
        id: 'fuse_cinto_fibra',
        name: 'Cinto de Fibra',
        category: 'acessorio',
        categoryLabel: 'Cinto / Faixa',
        ing1: 'Corda de Fibra',
        ing2: 'Fibra Vegetal',
        desc: 'Cinto trançado com corda e fibras vegetais. Concede +2 Defesa, +15 Vigor e libera 2 bolsos utilitários.',
        match: (a, b) => (itemMatchesKw(a, 'corda') && isRawFibra(b)) || (itemMatchesKw(b, 'corda') && isRawFibra(a)),
        create: () => ({
          id: 'cinto_fibra_' + Date.now(),
          name: 'Cinto de Fibra',
          categoryType: 'equipment',
          slot: 'cinto',
          isEquippable: true,
          rarity: 'comum',
          desc: 'Cinto trançado com cordas e fibras vegetais. Ao equipar, libera 2 bolsos utilitários para itens na cintura.',
          stats: { defense: 2, staminaBonus: 15 },
          value: 35
        })
      },
      {
        id: 'fuse_linen_tunic',
        name: 'Túnica de Linho do Aventureiro',
        category: 'armadura',
        categoryLabel: 'Peitoral / Camisa',
        ing1: 'Corda de Fibra Pequena',
        ing2: 'Fibra Vegetal',
        desc: 'Tecida com fibras puras e arrematada com corda pequena.',
        match: (a, b) => (isCordaPequena(a) && isRawFibra(b)) || (isCordaPequena(b) && isRawFibra(a)),
        create: () => ({
          id: 'tunic_' + Date.now(),
          name: 'Túnica de Linho do Aventureiro',
          categoryType: 'equipment',
          slot: 'camisa',
          isEquippable: true,
          rarity: 'comum',
          desc: 'Proteção leve que não restringe a agilidade de caminhada.',
          stats: { defense: 8, staminaBonus: 15 },
          value: 45
        })
      },
      {
        id: 'fuse_travel_boots',
        name: 'Botas Ágeis de Viajante',
        category: 'armadura',
        categoryLabel: 'Botas',
        ing1: 'Fibra Vegetal',
        ing2: 'Seixo de Pedra',
        desc: 'Solado reforçado com forro macio de fibra, impulsionando a marcha (+15% Vel).',
        match: (a, b) => matchPair(a, b, ['fibra'], ['seixo']),
        create: () => ({
          id: 'boots_' + Date.now(),
          name: 'Botas Ágeis de Viajante',
          categoryType: 'equipment',
          slot: 'botas',
          isEquippable: true,
          rarity: 'incomum',
          desc: 'Calçado confortável que acelera a velocidade em +15%.',
          stats: { defense: 5, speedBonusPercent: 15 },
          value: 60
        })
      },
      {
        id: 'fuse_gold_pendant',
        name: 'Pingente do Luar Radiante',
        category: 'acessorio',
        categoryLabel: 'Amuleto / Pingente',
        ing1: 'Pepita de Ouro',
        ing2: 'Drusa de Cristal',
        desc: 'Jóia nobre em ouro polido com cristal prismático.',
        match: (a, b) => matchPair(a, b, ['ouro'], ['ametista', 'safira', 'rubi', 'esmeralda', 'drusa', 'cristal']),
        create: () => ({
          id: 'pendant_' + Date.now(),
          name: 'Pingente do Luar Radiante',
          categoryType: 'equipment',
          slot: 'pingente',
          isEquippable: true,
          rarity: 'epico',
          desc: 'Amuleto místico que emite brilho espectral, concedendo luz e poder.',
          stats: { attack: 6, defense: 6, lightRadiusBonus: 35 },
          value: 150
        })
      },
      {
        id: 'fuse_vigor_potion',
        name: 'Frasco de Poção de Vigor',
        category: 'pocao',
        categoryLabel: 'Consumível / Poção',
        ing1: 'Esporos de Cogumelo',
        ing2: 'Resina Natural',
        desc: 'Tônico revitalizante que recupera 100% de energia física.',
        match: (a, b) => matchPair(a, b, ['cogumelo', 'esporos'], ['resina']),
        create: () => ({
          id: 'pot_vig_' + Date.now(),
          name: 'Frasco de Poção de Vigor',
          categoryType: 'consumable',
          isEquippable: false,
          rarity: 'incomum',
          desc: 'Recupera instantaneamente todo o vigor físico ao beber.',
          stackCount: 1,
          value: 35
        })
      }
    ];

    function checkFusionMatch(itemA, itemB) {
      if (!itemA || !itemB) return null;
      for (const r of FUSION_RECIPES) {
        if (r.match(itemA, itemB)) return r;
      }
      return null;
    }

    /* =======================================================
       5. GAME STATE & INVENTORY
       ======================================================= */
    let currentSeed = ${t};
    let elevNoise = new SimplexNoise(currentSeed);
    let moistNoise = new SimplexNoise(currentSeed + 101);
    let tempNoise = new SimplexNoise(currentSeed + 202);
    let lakeNoise = new SimplexNoise(currentSeed + 1010);

    const TILE_SIZE = 36;
    const player = {
      x: ${o.tx} * TILE_SIZE,
      y: ${o.ty} * TILE_SIZE,
      vx: 0,
      vy: 0,
      dir: 'down',
      isMoving: false,
      walkCycle: 0,
      sprinting: false,
      stamina: 100,
      maxStamina: 100,
      isExhausted: false,
      attackTimer: 0,
      attackDuration: 0.28,
      attackCombo: 0,
      attackAngle: undefined
    };

    let equipment = ${u};
    let backpack = ${m};
    let gold = ${c};
    let timeOfDay = ${l};
    let soundEnabled = ${f};
    let lanternActive = ${g};
    let zoom = 1.0;
    let camOffsetX = 0;
    let camOffsetY = 0;
    let animTimer = 0;

    // Fusion Chamber state
    let fuseSlot1 = null;
    let fuseSlot2 = null;

    // Selected item in backpack
    let selectedBackpackIndex = -1;

    const keys = {};
    const interactedProps = new Set();

    function hash2D(x, y, s = 0) {
      let h = (x * 374761393) ^ (y * 668265263) ^ (currentSeed * 31) ^ (s * 1013904223);
      h = (h ^ (h >>> 13)) * 1274126177;
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    }

    function getTile(tx, ty) {
      const e = elevNoise.fbm2D(tx * 0.012, ty * 0.012, 4);
      const m = moistNoise.fbm2D(tx * 0.01 + 50, ty * 0.01 + 50, 3);
      const t = tempNoise.fbm2D(tx * 0.007 + 120, ty * 0.007 + 120, 3);
      const distFromSpawn = Math.hypot(tx, ty);
      const lakeVal = distFromSpawn < 24 ? 0 : lakeNoise.fbm2D(tx * 0.0078 + 920, ty * 0.0078 + 920, 2, 2.0, 0.45);
      const oasisVal = lakeNoise.fbm2D(tx * 0.0028 + 560, ty * 0.0028 + 560, 2, 2.0, 0.5);
      const biome = getBiome(e, m, t, { lakeVal, oasisVal });
      const h = hash2D(tx, ty, 7);

      let prop = null;
      const key = tx + ',' + ty;
      const isInteracted = interactedProps.has(key);
      const poiRoll = hash2D(tx, ty, 99);

      if (!biome.hasWater) {
        if (poiRoll < 0.002) {
          prop = { kind: 'shrine', interactive: true, activated: isInteracted };
        } else if (poiRoll < 0.004) {
          prop = { kind: 'campfire', interactive: true };
        } else if (poiRoll < 0.007) {
          prop = { kind: 'chest', interactive: !isInteracted, opened: isInteracted };
        } else {
          const roll = hash2D(tx, ty, 23);
          if (roll < 0.12 && biome.prop) {
            prop = { kind: biome.prop, harvestable: true };
          } else if (roll < 0.16) {
            prop = { kind: 'rock', harvestable: true };
          } else if (roll < 0.22 && biome.name.includes('Planície')) {
            prop = { kind: 'flower', harvestable: true };
          }
        }
      }
      return { tx, ty, elevation: e, moisture: m, temperature: t, biome, prop, hash: h };
    }

    /* =======================================================
       6. AUDIO SYNTHESIZER
       ======================================================= */
    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function playTone(freq, duration, type = 'triangle', volume = 0.08) {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (err) {}
    }

    function playAttackSound() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        // Weapon swoosh vs unarmed jab
        const hasWeapon = !!equipment.mao_direita;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = hasWeapon ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(hasWeapon ? 420 : 180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } catch (err) {}
    }

    function playTorchSound() {
      if (!soundEnabled) return;
      playTone(280, 0.1, 'sawtooth', 0.06);
      setTimeout(() => playTone(540, 0.15, 'sine', 0.08), 80);
    }

    function playFusionSuccessSound() {
      if (!soundEnabled) return;
      // Anvil strike + magical harmonic arpeggio
      playTone(180, 0.1, 'square', 0.15);
      setTimeout(() => playTone(523, 0.18, 'triangle', 0.1), 80);
      setTimeout(() => playTone(659, 0.22, 'triangle', 0.1), 160);
      setTimeout(() => playTone(784, 0.35, 'sine', 0.12), 240);
      setTimeout(() => playTone(1046, 0.45, 'sine', 0.15), 320);
    }

    function playFusionFailSound() {
      if (!soundEnabled) return;
      playTone(160, 0.2, 'sawtooth', 0.1);
      setTimeout(() => playTone(120, 0.3, 'sawtooth', 0.1), 150);
    }

    /* =======================================================
       7. STATS COMPUTATION
       ======================================================= */
    function computePlayerStats() {
      const stats = {
        attack: 5,
        defense: 2,
        speedBonus: 0,
        lightBonus: 0,
        stamina: 100
      };
      for (const slotKey of Object.keys(equipment)) {
        const it = equipment[slotKey];
        if (it && it.stats) {
          if (it.stats.attack) stats.attack += it.stats.attack;
          if (it.stats.defense) stats.defense += it.stats.defense;
          if (it.stats.speedBonusPercent) stats.speedBonus += it.stats.speedBonusPercent;
          if (it.stats.lightRadiusBonus) stats.lightBonus += it.stats.lightRadiusBonus;
          if (it.stats.staminaBonus) stats.stamina += it.stats.staminaBonus;
        }
      }
      return stats;
    }

    function updateStatsUI() {
      const s = computePlayerStats();
      document.getElementById('stat-atk').innerText = s.attack;
      document.getElementById('stat-def').innerText = s.defense;
      document.getElementById('stat-spd').innerText = '+' + s.speedBonus + '%';
      document.getElementById('stat-luz').innerText = '+' + s.lightBonus;
      document.getElementById('stat-vig').innerText = s.stamina;
    }

    /* =======================================================
       8. NOTIFICATION TOAST
       ======================================================= */
    function showToast(msg) {
      const toast = document.getElementById('toast-banner');
      toast.innerText = msg;
      toast.style.display = 'block';
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => { toast.style.display = 'none'; }, 3200);
    }

    /* =======================================================
       9. CANVAS ENGINE & DRAWING
       ======================================================= */
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const minimapCanvas = document.getElementById('minimap-canvas');
    const miniCtx = minimapCanvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function attack() {
      // Auto-turn to nearest harvestable prop within 1.5x reach if one is nearby
      const curTx = Math.round(player.x / TILE_SIZE);
      const curTy = Math.round(player.y / TILE_SIZE);
      let nearestProp = null;
      let minPropDist = Infinity;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const t = getTile(curTx + dx, curTy + dy);
          if (t.prop && t.prop.harvestable) {
            const px = (curTx + dx) * TILE_SIZE;
            const py = (curTy + dy) * TILE_SIZE;
            const d = Math.hypot(px - player.x, py - player.y);
            if (d < minPropDist) {
              minPropDist = d;
              nearestProp = { dx, dy, dist: d };
            }
          }
        }
      }
      if (nearestProp && minPropDist <= 54) {
        if (Math.abs(nearestProp.dx) > Math.abs(nearestProp.dy)) {
          player.dir = nearestProp.dx > 0 ? 'right' : 'left';
        } else {
          player.dir = nearestProp.dy > 0 ? 'down' : 'up';
        }
        player.attackAngle = Math.atan2(nearestProp.dy, nearestProp.dx);
      } else {
        const moveX = (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) - (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0);
        const moveY = (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0) - (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0);
        if (moveX !== 0 || moveY !== 0) {
          player.attackAngle = Math.atan2(moveY, moveX);
        } else {
          player.attackAngle =
            player.dir === 'right' ? 0 :
            player.dir === 'left' ? Math.PI :
            player.dir === 'up' ? -Math.PI / 2 :
            Math.PI / 2;
        }
      }

      const isSpear = Boolean((equipment.mao_direita?.name || '').toLowerCase().match(/lança|lanca|spear/));
      const atkDur = isSpear ? 0.24 : 0.28;
      player.attackTimer = atkDur;
      player.attackDuration = atkDur;
      player.attackCombo = ((player.attackCombo || 0) + 1) % 2;
      playAttackSound();

      // Check if striking near prop
      const targetTile = getTile(curTx, curTy);

      if (targetTile.prop && targetTile.prop.harvestable) {
        // Collect resource through combat hit
        interact();
      }
    }

    function interact() {
      const curTx = Math.round(player.x / TILE_SIZE);
      const curTy = Math.round(player.y / TILE_SIZE);
      const tile = getTile(curTx, curTy);

      if (!tile.prop) {
        showToast('Nada por perto para coletar ou interagir aqui.');
        return;
      }

      const key = curTx + ',' + curTy;
      interactedProps.add(key);

      if (tile.prop.kind === 'chest') {
        gold += 120;
        addItemToBackpack({
          id: 'pep_' + Date.now(),
          name: 'Pepita de Ouro Maciço',
          categoryType: 'material',
          rarity: 'raro',
          desc: 'Ouro puro de alto valor para forjar joias e pingentes.',
          value: 90
        });
        showToast('🎁 Baú Aberto! Encontrado 120 Moedas e Pepita de Ouro!');
        playTone(523, 0.35, 'square');
        updateBackpackUI();
      } else if (tile.prop.kind === 'shrine') {
        showToast('✨ Santuário Desperto! Velocidade e Vigor revigorados!');
        playTone(659, 0.45, 'sine');
      } else if (tile.prop.kind === 'campfire') {
        showToast('🔥 Você descansou junto ao fogo reconfortante.');
        playTone(330, 0.25, 'triangle');
      } else if (['oak', 'pine', 'palm', 'willow'].includes(tile.prop.kind)) {
        addItemToBackpack({
          id: 'branch_' + Date.now(),
          name: 'Galho de Madeira',
          categoryType: 'equipment',
          slot: 'mao_direita',
          isEquippable: true,
          rarity: 'comum',
          desc: 'Galho rígido de madeira. Pode ser empunhado como arma (+5 de Ataque) ou usado na forja.',
          stats: { attack: 5 },
          value: 10
        });
        if (Math.random() < 0.4) {
          addItemToBackpack({
            id: 'resin_' + Date.now(),
            name: 'Resina Natural',
            categoryType: 'material',
            rarity: 'incomum',
            desc: 'Seiva resinosa aromática usada em tochas de longa duração e poções.',
            value: 25
          });
        }
        playTone(220, 0.15, 'triangle');
        updateBackpackUI();
      } else if (tile.prop.kind === 'rock') {
        addItemToBackpack({
          id: 'pebble_' + Date.now(),
          name: 'Seixo de Pedra',
          categoryType: 'material',
          rarity: 'comum',
          desc: 'Rocha sólida densa para maças, escudos e alvenaria.',
          value: 15
        });
        if (Math.random() < 0.35) {
          addItemToBackpack({
            id: 'flint_' + Date.now(),
            name: 'Pederneira',
            categoryType: 'material',
            rarity: 'incomum',
            desc: 'Mineral vulcânico que gera centelhas ao atrito para acender tochas.',
            value: 30
          });
        }
        playTone(180, 0.12, 'sawtooth');
        updateBackpackUI();
      } else if (tile.prop.kind === 'flower') {
        addItemToBackpack({
          id: 'fiber_' + Date.now(),
          name: 'Fibra Vegetal',
          categoryType: 'material',
          rarity: 'comum',
          desc: 'Fibras resistentes colhidas para tecer roupas, botas e cintos.',
          value: 12
        });
        playTone(440, 0.1, 'sine');
        updateBackpackUI();
      }
    }

    function addItemToBackpack(item) {
      // Group stackable materials
      const existing = backpack.find(i => i.name === item.name && !i.isEquippable);
      if (existing) {
        existing.stackCount = (existing.stackCount || 1) + (item.stackCount || 1);
        return true;
      } else {
        if (backpack.length >= 6) {
          showToast('⚠️ Limite de 6 slots de itens atingido! Use ou forje itens.');
          playTone(140, 0.25, 'sawtooth');
          return false;
        }
        backpack.push({ ...item, stackCount: item.stackCount || 1 });
        return true;
      }
    }

    function toggleTorch() {
      // Check if equipped torch or in backpack
      const hasEquippedTorch = (equipment.mao_esquerda && equipment.mao_esquerda.name.toLowerCase().includes('tocha')) ||
                               (equipment.mao_direita && equipment.mao_direita.name.toLowerCase().includes('tocha'));
      if (hasEquippedTorch) {
        lanternActive = !lanternActive;
        document.getElementById('btn-torch').classList.toggle('active', lanternActive);
        playTorchSound();
        return;
      }

      // Check backpack for a torch to equip automatically
      const bpTorch = backpack.find(i => i.name.toLowerCase().includes('tocha'));
      if (bpTorch) {
        equipment.mao_esquerda = bpTorch;
        backpack = backpack.filter(i => i !== bpTorch);
        lanternActive = true;
        document.getElementById('btn-torch').classList.add('active');
        playTorchSound();
        updatePaperdollUI();
        updateBackpackUI();
        return;
      }

      // No torch
      lanternActive = false;
      document.getElementById('btn-torch').classList.remove('active');
      showToast('⚠️ Você não possui uma tocha! Funda Galho + Pederneira na Mesa.');
    }

    /* =======================================================
       10. PAPERDOLL & BACKPACK UI LOGIC
       ======================================================= */
    function openInventory(tab = 'equip') {
      document.getElementById('inventory-modal').style.display = 'flex';
      switchTab(tab);
      updatePaperdollUI();
      updateBackpackUI();
      updateFusionUI();
      updateStatsUI();
    }

    function closeInventory() {
      document.getElementById('inventory-modal').style.display = 'none';
    }

    function switchTab(tab) {
      document.getElementById('tab-btn-equip').classList.toggle('active', tab === 'equip');
      document.getElementById('tab-btn-fuse').classList.toggle('active', tab === 'fuse');
      document.getElementById('tab-btn-backpack').classList.toggle('active', tab === 'backpack');

      document.getElementById('tab-content-equip').style.display = tab === 'equip' ? 'flex' : 'none';
      document.getElementById('tab-content-fuse').style.display = tab === 'fuse' ? 'flex' : 'none';
      document.getElementById('tab-content-backpack').style.display = tab === 'backpack' ? 'flex' : 'none';
    }

    function updatePaperdollUI() {
      const container = document.getElementById('paperdoll-grid');
      container.innerHTML = '';

      for (const slotDef of EQUIPMENT_SLOTS_DEF) {
        const item = equipment[slotDef.id];
        const slotEl = document.createElement('div');
        slotEl.className = 'equip-slot' + (item ? ' filled' : '');
        slotEl.innerHTML = \`
          <div class="equip-slot-name">\${slotDef.label}</div>
          \${item ? \`<div class="equip-item-title" style="color:\${item.color || '#38bdf8'}">\${item.name}</div>\` : \`<div class="equip-slot-empty">Vazio</div>\`}
        \`;

        slotEl.addEventListener('click', () => {
          if (item) {
            // Unequip to backpack
            addItemToBackpack(item);
            equipment[slotDef.id] = null;
            showToast('Desequipado: ' + item.name);
            playTone(300, 0.1, 'triangle');
            updatePaperdollUI();
            updateBackpackUI();
            updateStatsUI();
          }
        });

        container.appendChild(slotEl);
      }
      updateStatsUI();
    }

    function updateBackpackUI(filter = 'all') {
      const container = document.getElementById('backpack-grid');
      container.innerHTML = '';
      document.getElementById('gold-counter').innerText = gold;

      let list = backpack;
      if (filter === 'equip') list = backpack.filter(i => i.isEquippable);
      else if (filter === 'mat') list = backpack.filter(i => i.categoryType === 'material');
      else if (filter === 'pot') list = backpack.filter(i => i.categoryType === 'consumable');

      list.forEach((it, idx) => {
        const card = document.createElement('div');
        card.className = 'item-card' + (selectedBackpackIndex === idx ? ' selected' : '');
        card.innerHTML = \`
          \${it.stackCount > 1 ? \`<span class="item-card-count">\${it.stackCount}</span>\` : ''}
          <span style="font-size:16px;">\${it.isEquippable ? '🛡️' : (it.categoryType === 'consumable' ? '🧪' : '📦')}</span>
          <div class="item-card-title" style="color:\${it.color || '#f1f5f9'}">\${it.name}</div>
        \`;

        card.addEventListener('click', () => {
          selectedBackpackIndex = idx;
          inspectItem(it);
          updateBackpackUI(filter);
        });

        container.appendChild(card);
      });

      // Render remaining empty slots up to 6
      for (let i = list.length; i < 6; i++) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'item-card';
        emptyCard.style.opacity = '0.35';
        emptyCard.style.borderStyle = 'dashed';
        emptyCard.innerHTML = '<span style="font-size:10px; color:#64748b; font-family:monospace;">Slot #' + (i + 1) + ' Vazio</span>';
        container.appendChild(emptyCard);
      }

      if (selectedBackpackIndex >= 0 && selectedBackpackIndex < backpack.length) {
        inspectItem(backpack[selectedBackpackIndex]);
      } else {
        document.getElementById('detail-actions').style.display = 'none';
        document.getElementById('detail-title').innerText = 'Selecione um item';
        document.getElementById('detail-desc').innerText = 'Clique em um dos 6 slots de itens acima para inspecionar ou usar.';
        document.getElementById('detail-stats').innerText = '';
        document.getElementById('detail-val').innerText = '';
      }
    }

    function inspectItem(it) {
      document.getElementById('detail-actions').style.display = 'flex';
      document.getElementById('detail-title').innerText = it.name;
      document.getElementById('detail-desc').innerText = it.desc || 'Item utilitário para forja e sobrevivência.';

      let statsTxt = '';
      if (it.stats) {
        if (it.stats.attack) statsTxt += 'Ataque: +' + it.stats.attack + ' ';
        if (it.stats.defense) statsTxt += 'Defesa: +' + it.stats.defense + ' ';
        if (it.stats.speedBonusPercent) statsTxt += 'Velocidade: +' + it.stats.speedBonusPercent + '% ';
        if (it.stats.lightRadiusBonus) statsTxt += 'Luz: +' + it.stats.lightRadiusBonus + ' ';
      }
      document.getElementById('detail-stats').innerText = statsTxt;
      document.getElementById('detail-val').innerText = it.value ? 'Valor: ' + it.value + ' Moedas' : '';

      document.getElementById('btn-action-equip').style.display = it.isEquippable ? 'block' : 'none';
      document.getElementById('btn-action-use').style.display = it.categoryType === 'consumable' ? 'block' : 'none';
    }

    // Backpack Action Buttons
    document.getElementById('btn-action-equip').addEventListener('click', () => {
      if (selectedBackpackIndex < 0 || selectedBackpackIndex >= backpack.length) return;
      const it = backpack[selectedBackpackIndex];
      if (!it.isEquippable || !it.slot) return;

      const currentEquipped = equipment[it.slot];
      equipment[it.slot] = it;

      // Remove 1 from backpack
      if (it.stackCount > 1) {
        it.stackCount--;
      } else {
        backpack.splice(selectedBackpackIndex, 1);
        selectedBackpackIndex = -1;
      }

      if (currentEquipped) {
        addItemToBackpack(currentEquipped);
      }

      showToast('Equipado: ' + it.name);
      playTone(480, 0.15, 'sine');
      updatePaperdollUI();
      updateBackpackUI();
      updateStatsUI();
    });

    document.getElementById('btn-action-fuse').addEventListener('click', () => {
      if (selectedBackpackIndex < 0 || selectedBackpackIndex >= backpack.length) return;
      const it = backpack[selectedBackpackIndex];

      if (!fuseSlot1) {
        fuseSlot1 = it;
      } else if (!fuseSlot2) {
        fuseSlot2 = it;
      } else {
        fuseSlot1 = it;
      }
      switchTab('fuse');
      updateFusionUI();
    });

    document.getElementById('btn-action-use').addEventListener('click', () => {
      if (selectedBackpackIndex < 0 || selectedBackpackIndex >= backpack.length) return;
      const it = backpack[selectedBackpackIndex];
      showToast('Consumido: ' + it.name + '! Vigor restaurado.');
      playTone(600, 0.25, 'sine');

      if (it.stackCount > 1) {
        it.stackCount--;
      } else {
        backpack.splice(selectedBackpackIndex, 1);
        selectedBackpackIndex = -1;
      }
      updateBackpackUI();
    });

    document.getElementById('btn-action-drop').addEventListener('click', () => {
      if (selectedBackpackIndex < 0 || selectedBackpackIndex >= backpack.length) return;
      const it = backpack[selectedBackpackIndex];
      if (it.stackCount > 1) {
        it.stackCount--;
      } else {
        backpack.splice(selectedBackpackIndex, 1);
        selectedBackpackIndex = -1;
      }
      showToast('Item descartado.');
      updateBackpackUI();
    });

    /* =======================================================
       11. FUSION CHAMBER LOGIC & CODEX
       ======================================================= */
    function updateFusionUI() {
      document.getElementById('fuse-slot-1-name').innerText = fuseSlot1 ? fuseSlot1.name : 'Vazio (Clique para escolher)';
      document.getElementById('fuse-slot-1').classList.toggle('has-item', !!fuseSlot1);

      document.getElementById('fuse-slot-2-name').innerText = fuseSlot2 ? fuseSlot2.name : 'Vazio (Clique para escolher)';
      document.getElementById('fuse-slot-2').classList.toggle('has-item', !!fuseSlot2);

      const match = checkFusionMatch(fuseSlot1, fuseSlot2);
      const resBox = document.getElementById('fuse-result-name');
      const execBtn = document.getElementById('btn-execute-fusion');

      if (match) {
        resBox.innerText = match.name;
        resBox.style.color = '#38bdf8';
        execBtn.disabled = false;
        execBtn.innerText = '✨ Fundir: ' + match.name;
      } else {
        resBox.innerText = (fuseSlot1 && fuseSlot2) ? 'Combinação Incompatível' : 'Nenhum';
        resBox.style.color = (fuseSlot1 && fuseSlot2) ? '#ef4444' : '#94a3b8';
        execBtn.disabled = true;
        execBtn.innerText = '✨ Realizar Fusão e Forjar';
      }

      renderCodexRecipes();
    }

    function renderCodexRecipes(category = 'all') {
      const container = document.getElementById('codex-recipes-list');
      container.innerHTML = '';

      let list = FUSION_RECIPES;
      if (category === 'util') list = FUSION_RECIPES.filter(r => r.category === 'utilitario');
      else if (category === 'arma') list = FUSION_RECIPES.filter(r => r.category === 'arma');
      else if (category === 'armor') list = FUSION_RECIPES.filter(r => r.category === 'armadura');
      else if (category === 'pot') list = FUSION_RECIPES.filter(r => r.category === 'pocao');

      list.forEach(r => {
        const card = document.createElement('div');
        card.className = 'codex-card';
        card.innerHTML = \`
          <div class="codex-card-title">
            <span>\${r.name}</span>
            <span style="font-size:9px; color:#f59e0b; text-transform:uppercase;">\${r.categoryLabel}</span>
          </div>
          <div class="codex-formula">\${r.ing1} + \${r.ing2}</div>
          <div style="color:#94a3b8; font-size:10px;">\${r.desc}</div>
          <button class="codex-fill-btn">Colocar na Mesa de Fusão</button>
        \`;

        card.querySelector('.codex-fill-btn').addEventListener('click', () => {
          // Attempt to find matching items in backpack
          const it1 = backpack.find(i => itemMatchesKw(i, r.ing1));
          const it2 = backpack.find(i => itemMatchesKw(i, r.ing2) && (i !== it1 || (i.stackCount || 1) >= 2));

          if (it1 && it2) {
            fuseSlot1 = it1;
            fuseSlot2 = it2;
            updateFusionUI();
            showToast('Ingredientes inseridos na mesa de fusão!');
          } else {
            showToast('⚠️ Faltam recursos na mochila: ' + r.ing1 + ' + ' + r.ing2);
          }
        });

        container.appendChild(card);
      });
    }

    document.getElementById('fuse-slot-1').addEventListener('click', () => {
      switchTab('backpack');
      showToast('Selecione um item da mochila e clique em "Colocar na Mesa de Fusão".');
    });
    document.getElementById('fuse-slot-2').addEventListener('click', () => {
      switchTab('backpack');
      showToast('Selecione um segundo item e clique em "Colocar na Mesa de Fusão".');
    });

    document.getElementById('btn-clear-fusion').addEventListener('click', () => {
      fuseSlot1 = null;
      fuseSlot2 = null;
      updateFusionUI();
    });

    document.getElementById('btn-execute-fusion').addEventListener('click', () => {
      const match = checkFusionMatch(fuseSlot1, fuseSlot2);
      if (!match) {
        playFusionFailSound();
        showToast('Falha na alquimia: combinação incompatível!');
        return;
      }

      // Deduct ingredients from backpack
      function deductItem(target) {
        const idx = backpack.indexOf(target);
        if (idx !== -1) {
          if (backpack[idx].stackCount > 1) {
            backpack[idx].stackCount--;
          } else {
            backpack.splice(idx, 1);
          }
        }
      }
      deductItem(fuseSlot1);
      deductItem(fuseSlot2);

      const crafted = match.create();
      addItemToBackpack(crafted);

      playFusionSuccessSound();
      showToast('⚒️ Forja Concluída com Sucesso! Criado: ' + crafted.name);

      fuseSlot1 = null;
      fuseSlot2 = null;
      updateFusionUI();
      updateBackpackUI();
    });

    // Tab buttons & filters
    document.getElementById('tab-btn-equip').addEventListener('click', () => switchTab('equip'));
    document.getElementById('tab-btn-fuse').addEventListener('click', () => switchTab('fuse'));
    document.getElementById('tab-btn-backpack').addEventListener('click', () => switchTab('backpack'));
    document.getElementById('modal-close-btn').addEventListener('click', closeInventory);

    document.getElementById('bp-filter-all').addEventListener('click', () => updateBackpackUI('all'));
    document.getElementById('bp-filter-equip').addEventListener('click', () => updateBackpackUI('equip'));
    document.getElementById('bp-filter-mat').addEventListener('click', () => updateBackpackUI('mat'));
    document.getElementById('bp-filter-pot').addEventListener('click', () => updateBackpackUI('pot'));

    document.getElementById('codex-filter-all').addEventListener('click', () => renderCodexRecipes('all'));
    document.getElementById('codex-filter-util').addEventListener('click', () => renderCodexRecipes('util'));
    document.getElementById('codex-filter-weapons').addEventListener('click', () => renderCodexRecipes('arma'));
    document.getElementById('codex-filter-armor').addEventListener('click', () => renderCodexRecipes('armor'));
    document.getElementById('codex-filter-potions').addEventListener('click', () => renderCodexRecipes('pot'));

    /* =======================================================
       12. INPUT EVENT LISTENERS
       ======================================================= */
    const lastDirTap = { up: 0, down: 0, left: 0, right: 0 };
    const doubleTapSprint = { up: false, down: false, left: false, right: false };

    const getDirKey = (code, key) => {
      if (code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'W' || key === 'ArrowUp') return 'up';
      if (code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'S' || key === 'ArrowDown') return 'down';
      if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'A' || key === 'ArrowLeft') return 'left';
      if (code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'D' || key === 'ArrowRight') return 'right';
      return null;
    };

    window.addEventListener('keydown', (e) => {
      keys[e.code] = true;
      keys[e.key] = true;

      const d = getDirKey(e.code, e.key);
      if (d && !e.repeat) {
        const now = performance.now();
        if (now - (lastDirTap[d] || 0) < 360 && now - (lastDirTap[d] || 0) > 40) {
          doubleTapSprint[d] = true;
        }
        lastDirTap[d] = now;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) ||
          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.code === 'KeyE' || e.key === 'e' || e.key === 'E') interact();
      if (e.code === 'Space' || e.code === 'KeyF' || e.key === 'f' || e.key === 'F') attack();
      if (e.code === 'KeyI' || e.code === 'KeyB' || e.key === 'i' || e.key === 'b') {
        const modal = document.getElementById('inventory-modal');
        if (modal.style.display === 'flex') closeInventory();
        else openInventory('equip');
      }
      if (e.code === 'KeyL' || e.key === 'l' || e.key === 'L') toggleTorch();
      if (e.code === 'KeyC' || e.key === 'c' || e.key === 'C') recenterCamera();
      if (e.code === 'Escape' || e.key === 'Escape') closeInventory();
    });

    window.addEventListener('keyup', (e) => {
      keys[e.code] = false;
      keys[e.key] = false;
      const d = getDirKey(e.code, e.key);
      if (d) doubleTapSprint[d] = false;
    });

    document.getElementById('btn-combat').addEventListener('click', attack);
    document.getElementById('btn-interact').addEventListener('click', interact);
    document.getElementById('btn-torch').addEventListener('click', toggleTorch);
    document.getElementById('btn-inventory').addEventListener('click', () => openInventory('equip'));
    document.getElementById('btn-sound').addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      document.getElementById('btn-sound').classList.toggle('active', soundEnabled);
      showToast(soundEnabled ? 'Áudio Ativado' : 'Áudio Silenciado');
    });

    document.getElementById('btn-reroll').addEventListener('click', () => {
      currentSeed = Math.floor(Math.random() * 999999);
      elevNoise.seed(currentSeed);
      moistNoise.seed(currentSeed + 101);
      tempNoise.seed(currentSeed + 202);
      interactedProps.clear();
      document.getElementById('world-seed-tag').innerText = 'Seed: #' + currentSeed;
      showToast('Novo Mundo Criado! Seed: ' + currentSeed);
    });

    const recenterBtn = document.getElementById('btn-recenter');
    function recenterCamera() {
      camOffsetX = 0;
      camOffsetY = 0;
      if (recenterBtn) recenterBtn.style.display = 'none';
      showToast('Câmera centralizada no aventureiro!');
    }
    recenterBtn.addEventListener('click', recenterCamera);

    // Zoom
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
      zoom = Math.min(2.5, +(zoom + 0.15).toFixed(2));
      document.getElementById('zoom-text').innerText = Math.round(zoom * 100) + '%';
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
      zoom = Math.max(0.25, +(zoom - 0.15).toFixed(2));
      document.getElementById('zoom-text').innerText = Math.round(zoom * 100) + '%';
    });

    // Time of day slider
    const timeSlider = document.getElementById('time-slider');
    const timeLabel = document.getElementById('time-label');
    timeSlider.addEventListener('input', (e) => {
      timeOfDay = parseFloat(e.target.value);
      if (timeOfDay >= 0.2 && timeOfDay < 0.35) timeLabel.innerText = 'Amanhecer';
      else if (timeOfDay >= 0.35 && timeOfDay < 0.65) timeLabel.innerText = 'Meio-dia';
      else if (timeOfDay >= 0.65 && timeOfDay < 0.8) timeLabel.innerText = 'Pôr do Sol';
      else timeLabel.innerText = 'Noite';
    });

    // Mobile D-Pad
    const bindBtn = (id, code, keyName, dir) => {
      const b = document.getElementById(id);
      if (!b) return;
      const onStart = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        keys[code] = true;
        if (keyName) keys[keyName] = true;
        if (dir) {
          const now = performance.now();
          if (now - (lastDirTap[dir] || 0) < 360 && now - (lastDirTap[dir] || 0) > 40) {
            doubleTapSprint[dir] = true;
          }
          lastDirTap[dir] = now;
        }
      };
      const onEnd = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        keys[code] = false;
        if (keyName) keys[keyName] = false;
        if (dir) doubleTapSprint[dir] = false;
      };
      b.addEventListener('touchstart', onStart);
      b.addEventListener('touchend', onEnd);
      b.addEventListener('mousedown', onStart);
      b.addEventListener('mouseup', onEnd);
    };
    bindBtn('m-up', 'KeyW', 'ArrowUp', 'up');
    bindBtn('m-down', 'KeyS', 'ArrowDown', 'down');
    bindBtn('m-left', 'KeyA', 'ArrowLeft', 'left');
    bindBtn('m-right', 'KeyD', 'ArrowRight', 'right');
    document.getElementById('m-combat').addEventListener('click', attack);
    const mPebble = document.getElementById('m-pebble');
    if (mPebble) mPebble.addEventListener('click', attack);
    const btnPebble = document.getElementById('btn-pebble');
    if (btnPebble) btnPebble.addEventListener('click', attack);
    document.getElementById('m-interact').addEventListener('click', interact);
    document.getElementById('m-inv').addEventListener('click', () => openInventory('equip'));
    document.getElementById('m-torch').addEventListener('click', toggleTorch);

    /* =======================================================
       13. MAIN GAME LOOP & RENDERING
       ======================================================= */
    let lastTime = performance.now();
    function gameLoop(now) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      animTimer += 0.03;

      if (player.attackTimer > 0) {
        player.attackTimer = Math.max(0, player.attackTimer - dt);
        if (player.attackTimer === 0) player.attackAngle = undefined;
      }

      // Movement
      let moveX = 0, moveY = 0;
      if (keys['KeyW'] || keys['ArrowUp'] || keys['Up']) moveY -= 1;
      if (keys['KeyS'] || keys['ArrowDown'] || keys['Down']) moveY += 1;
      if (keys['KeyA'] || keys['ArrowLeft'] || keys['Left']) moveX -= 1;
      if (keys['KeyD'] || keys['ArrowRight'] || keys['Right']) moveX += 1;

      const isDoubleTap = (
        (doubleTapSprint.up && (keys['KeyW'] || keys['ArrowUp'] || keys['Up'])) ||
        (doubleTapSprint.down && (keys['KeyS'] || keys['ArrowDown'] || keys['Down'])) ||
        (doubleTapSprint.left && (keys['KeyA'] || keys['ArrowLeft'] || keys['Left'])) ||
        (doubleTapSprint.right && (keys['KeyD'] || keys['ArrowRight'] || keys['Right']))
      );
      const wantsSprint = (isDoubleTap || keys['ShiftLeft'] || keys['ShiftRight']) && (moveX !== 0 || moveY !== 0);

      if (wantsSprint && !player.isExhausted && player.stamina > 0) {
        player.sprinting = true;
        player.stamina = Math.max(0, player.stamina - 24 * dt);
        if (player.stamina <= 0) {
          player.stamina = 0;
          player.isExhausted = true;
          player.sprinting = false;
        }
      } else {
        player.sprinting = false;
        const regen = (moveX !== 0 || moveY !== 0) ? 18 : 30;
        player.stamina = Math.min(player.maxStamina, player.stamina + regen * dt);
        if (player.isExhausted && player.stamina >= player.maxStamina * 0.25) {
          player.isExhausted = false;
        }
      }

      const pStats = computePlayerStats();
      const speedMult = 1 + (pStats.speedBonus / 100);
      const baseSpd = (player.sprinting ? 5.2 : (player.isExhausted ? 2.8 : 3.2)) * speedMult;

      if (moveX !== 0 && moveY !== 0) {
        moveX *= 0.7071;
        moveY *= 0.7071;
      }

      player.isMoving = moveX !== 0 || moveY !== 0;
      if (player.isMoving) {
        player.x += moveX * baseSpd;
        player.y += moveY * baseSpd;
        player.walkCycle += 0.25;

        if (Math.abs(moveX) > Math.abs(moveY)) {
          player.dir = moveX > 0 ? 'right' : 'left';
        } else {
          player.dir = moveY > 0 ? 'down' : 'up';
        }

        if (Math.floor(player.walkCycle / Math.PI) % 2 === 0 && Math.random() < 0.08) {
          playTone(110, 0.04, 'triangle');
        }
      }

      renderScene();
      renderMinimap();

      // Update UI coords & biome
      const curTx = Math.round(player.x / TILE_SIZE);
      const curTy = Math.round(player.y / TILE_SIZE);
      const curTile = getTile(curTx, curTy);

      document.getElementById('biome-name').innerText = curTile.biome.name;
      document.getElementById('biome-desc').innerText = curTile.biome.desc;
      document.getElementById('player-coords').innerText = 'X: ' + curTx + ' | Y: ' + curTy;

      const stamBar = document.getElementById('stamina-bar');
      const stamVal = document.getElementById('stamina-val');
      const stamLabel = document.getElementById('stamina-label');
      if (stamBar && stamVal && stamLabel) {
        stamVal.innerText = Math.round(player.stamina) + ' / ' + player.maxStamina;
        stamBar.style.width = Math.max(0, Math.min(100, (player.stamina / player.maxStamina) * 100)) + '%';
        if (player.isExhausted) {
          stamBar.style.background = '#ef4444';
          stamLabel.innerText = '⚠️ EXAUSTO';
          stamLabel.style.color = '#ef4444';
        } else if (player.sprinting) {
          stamBar.style.background = '#10b981';
          stamLabel.innerText = '⚡ CORRENDO';
          stamLabel.style.color = '#10b981';
        } else {
          stamBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
          stamLabel.innerText = '⚡ Vigor / Cansaço';
          stamLabel.style.color = '#fbbf24';
        }
      }

      requestAnimationFrame(gameLoop);
    }

    function renderScene() {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      const camX = player.x + camOffsetX;
      const camY = player.y + camOffsetY;
      ctx.translate(-camX, -camY);

      const halfW = (canvas.width / 2) / zoom;
      const halfH = (canvas.height / 2) / zoom;
      const startCol = Math.floor((camX - halfW) / TILE_SIZE) - 1;
      const endCol = Math.ceil((camX + halfW) / TILE_SIZE) + 1;
      const startRow = Math.floor((camY - halfH) / TILE_SIZE) - 1;
      const endRow = Math.ceil((camY + halfH) / TILE_SIZE) + 1;

      // 1. Terrain Tiles
      for (let ty = startRow; ty <= endRow; ty++) {
        for (let tx = startCol; tx <= endCol; tx++) {
          const t = getTile(tx, ty);
          const px = tx * TILE_SIZE;
          const py = ty * TILE_SIZE;

          if (t.biome.hasWater) {
            const isDeep = t.biome.name === 'Oceano Profundo';
            ctx.fillStyle = isDeep ? '#0c223f' : '#0284c7';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

            // Animated wave lines
            const waveY1 = Math.sin(px * 0.045 + animTimer * 1.5 + py * 0.035) * 3 + TILE_SIZE * 0.35;
            ctx.strokeStyle = isDeep ? 'rgba(56, 189, 248, 0.18)' : 'rgba(224, 242, 254, 0.4)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(px, py + waveY1);
            ctx.lineTo(px + TILE_SIZE, py + waveY1);
            ctx.stroke();
          } else {
            ctx.fillStyle = t.biome.ground;
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      // 2. Y-Sorted Props & Player
      const drawList = [];
      for (let ty = startRow; ty <= endRow; ty++) {
        for (let tx = startCol; tx <= endCol; tx++) {
          const t = getTile(tx, ty);
          if (t.prop) {
            drawList.push({
              y: ty * TILE_SIZE + TILE_SIZE / 2,
              draw: () => drawProp(t.prop, tx * TILE_SIZE + TILE_SIZE / 2, ty * TILE_SIZE + TILE_SIZE / 2)
            });
          }
        }
      }
      drawList.push({
        y: player.y,
        draw: () => drawPlayer()
      });

      drawList.sort((a, b) => a.y - b.y);
      for (const item of drawList) item.draw();

      ctx.restore();

      // 3. Day / Night Darkness & Torch Light Overlay
      renderLighting();
    }

    function renderLighting() {
      // Calculate darkness factor from timeOfDay (0 = midnight, 0.5 = noon)
      const nightFactor = Math.cos(timeOfDay * Math.PI * 2) * 0.5 + 0.5; // 1 at midnight, 0 at noon
      const ambientDarkness = nightFactor * 0.75;

      if (ambientDarkness > 0.05 || lanternActive) {
        ctx.save();
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        if (lanternActive) {
          // Warm golden radial light around player
          const pStats = computePlayerStats();
          const lightRadius = 140 + pStats.lightBonus * 1.5;
          const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, lightRadius);
          grad.addColorStop(0, 'rgba(245, 158, 11, 0.05)');
          grad.addColorStop(0.5, 'rgba(0, 5, 20, ' + (ambientDarkness * 0.4) + ')');
          grad.addColorStop(1, 'rgba(0, 5, 20, ' + Math.max(0.65, ambientDarkness) + ')');
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = 'rgba(0, 5, 20, ' + ambientDarkness + ')';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }

    function drawProp(prop, x, y) {
      ctx.save();
      ctx.translate(x, y);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 4, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      if (prop.kind === 'oak') {
        ctx.fillStyle = '#5c3d2e';
        ctx.fillRect(-3, -12, 6, 16);
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(0, -22, 18, 0, Math.PI * 2);
        ctx.fill();
      } else if (prop.kind === 'pine') {
        ctx.fillStyle = '#452b1f';
        ctx.fillRect(-2, -8, 4, 12);
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.moveTo(-12, -6); ctx.lineTo(12, -6); ctx.lineTo(0, -28); ctx.closePath();
        ctx.fill();
      } else if (prop.kind === 'palm') {
        ctx.strokeStyle = '#78350f'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(6, -14, 2, -26); ctx.stroke();
        ctx.strokeStyle = '#15803d'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(2, -26); ctx.lineTo(-14, -18); ctx.moveTo(2, -26); ctx.lineTo(16, -18); ctx.stroke();
      } else if (prop.kind === 'cactus') {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-3, -22, 6, 24);
      } else if (prop.kind === 'shrine') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(-12, -4, 24, 8);
        const bob = Math.sin(animTimer * 2) * 3;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, -26 + bob); ctx.lineTo(6, -16 + bob); ctx.lineTo(0, -6 + bob); ctx.lineTo(-6, -16 + bob); ctx.closePath();
        ctx.fill();
      } else if (prop.kind === 'campfire') {
        ctx.fillStyle = '#52525b';
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.beginPath(); ctx.arc(0, -3 + Math.sin(animTimer * 10) * 1.5, 4, 0, Math.PI * 2); ctx.fill();
      } else if (prop.kind === 'chest') {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-8, -8, 16, 12);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-8, -4, 16, 2);
      } else if (prop.kind === 'rock') {
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.arc(0, -2, 8, 0, Math.PI * 2); ctx.fill();
      } else if (prop.kind === 'flower') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(0, -4, 3.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function drawPlayer() {
      ctx.save();
      ctx.translate(player.x, player.y);

      // 1. Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 2, 9, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      const walkBob = player.isMoving ? Math.abs(Math.sin(player.walkCycle)) * 1.5 : 0;
      const walkPhase = player.isMoving ? Math.sin(player.walkCycle) : 0;
      const dir = player.dir || 'down';

      const isAttacking = player.attackTimer > 0;
      const attackDur = player.attackDuration || 0.28;
      const attackProg = isAttacking ? Math.max(0, Math.min(1, 1 - (player.attackTimer / attackDur))) : 0;

      let punchExt = 0;
      if (isAttacking) {
        if (attackProg < 0.38) {
          punchExt = Math.sin((attackProg / 0.38) * (Math.PI / 2));
        } else {
          punchExt = Math.cos(((attackProg - 0.38) / 0.62) * (Math.PI / 2));
        }
      }

      const isLeftPunch = isAttacking && ((player.attackCombo || 0) % 2 === 1);
      const hasWeapon = Boolean(
        equipment.mao_direita ||
        (equipment.mao_esquerda && equipment.mao_esquerda.name && equipment.mao_esquerda.name.toLowerCase().includes('espada'))
      );

      let leanX = 0, leanY = 0;
      if (isAttacking) {
        if (dir === 'left') leanX = -punchExt * 2;
        else if (dir === 'right') leanX = punchExt * 2;
        else if (dir === 'up') leanY = -punchExt * 2;
        else leanY = punchExt * 2;
      }

      // 2. Cape (behind body if not facing up)
      if (equipment.capa && dir !== 'up') {
        const capeColor = equipment.capa.color || '#b91c1c';
        const flutter = player.isMoving ? Math.cos(animTimer * 8) * 2 : (punchExt * 3);
        ctx.fillStyle = capeColor;
        if (dir === 'down') {
          ctx.fillRect(-8, -15 - walkBob, 16, 17 + flutter * 0.5);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(-8, -15 - walkBob, 3, 3);
          ctx.fillRect(5, -15 - walkBob, 3, 3);
        } else if (dir === 'left') {
          ctx.fillRect(2, -16 - walkBob, 6 + flutter, 18);
        } else {
          ctx.fillRect(-8 - flutter, -16 - walkBob, 6 + flutter, 18);
        }
      }

      // Backpack (behind body if not facing up)
      if (equipment.mochila && dir !== 'up') {
        ctx.fillStyle = equipment.mochila.color || '#78350f';
        if (dir === 'left') {
          ctx.fillRect(4, -14 - walkBob, 5, 10);
        } else if (dir === 'right') {
          ctx.fillRect(-9, -14 - walkBob, 5, 10);
        } else {
          ctx.fillRect(-6, -16 - walkBob, 2.5, 12);
          ctx.fillRect(3.5, -16 - walkBob, 2.5, 12);
        }
      }

      // 3. Legs & Boots
      const legL = walkPhase * 4;
      const legR = -walkPhase * 4;
      ctx.fillStyle = equipment.calca ? (equipment.calca.color || '#475569') : '#334155';
      if (dir === 'up' || dir === 'down') {
        ctx.fillRect(-6, 0 + legL, 4, 4);
        ctx.fillRect(2, 0 + legR, 4, 4);
        ctx.fillStyle = equipment.botas ? (equipment.botas.color || '#92400e') : '#1e293b';
        ctx.fillRect(-6, 3 + legL, 4, 3);
        ctx.fillRect(2, 3 + legR, 4, 3);
      } else {
        ctx.fillRect(-3, 0 + legL, 4, 4);
        ctx.fillRect(1, 0 + legR, 4, 4);
        ctx.fillStyle = equipment.botas ? (equipment.botas.color || '#92400e') : '#1e293b';
        ctx.fillRect(-3, 3 + legL, 4, 3);
        ctx.fillRect(1, 3 + legR, 4, 3);
      }

      // 4. Torso & Shirt / Armor
      let shirtColor = '#2563eb';
      if (equipment.camisa) {
        const cName = equipment.camisa.name.toLowerCase();
        if (cName.includes('armadura') || cName.includes('ferro') || cName.includes('aço')) shirtColor = '#64748b';
        else if (cName.includes('couro')) shirtColor = '#854d0e';
        else shirtColor = equipment.camisa.color || '#2563eb';
      }
      ctx.fillStyle = shirtColor;
      ctx.fillRect(-7 + leanX, -16 - walkBob + leanY, 14, 14);

      // Belt
      ctx.fillStyle = equipment.cinto ? (equipment.cinto.color || '#78350f') : '#f59e0b';
      ctx.fillRect(-7 + leanX, -4 - walkBob + leanY, 14, 3);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-2 + leanX, -5 - walkBob + leanY, 4, 4);

      // Pendant (glowing)
      if (equipment.pingente && dir !== 'up') {
        ctx.fillStyle = equipment.pingente.color || '#38bdf8';
        ctx.beginPath();
        ctx.arc(0 + leanX, -11 - walkBob + leanY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cape & Backpack if facing up
      if (dir === 'up') {
        if (equipment.capa) {
          ctx.fillStyle = equipment.capa.color || '#b91c1c';
          ctx.fillRect(-8, -16 - walkBob, 16, 19);
        }
        if (equipment.mochila) {
          ctx.fillStyle = equipment.mochila.color || '#78350f';
          ctx.fillRect(-6, -15 - walkBob, 12, 10);
        }
      }

      // 5. Head
      const headX = leanX * 0.5;
      const headY = -22 - walkBob + leanY * 0.5;
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(headX, headY, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(headX, headY - 2, 6.5, Math.PI, 0);
      ctx.fill();

      // Eyes
      if (dir === 'down') {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(headX - 3, headY, 2, 2);
        ctx.fillRect(headX + 1, headY, 2, 2);
      } else if (dir === 'left') {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(headX - 4, headY, 2, 2);
      } else if (dir === 'right') {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(headX + 2, headY, 2, 2);
      }

      // 6. Hat / Helmet
      if (equipment.chapeu) {
        const hName = equipment.chapeu.name.toLowerCase();
        if (hName.includes('coroa')) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(headX - 6, headY - 11, 12, 7);
        } else if (hName.includes('elmo') || hName.includes('capacete')) {
          ctx.fillStyle = '#64748b';
          ctx.fillRect(headX - 7, headY - 6, 14, 8);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(headX - 4, headY - 2, 8, 2);
        } else {
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.ellipse(headX, headY - 4, 11, 4.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = equipment.chapeu.color || '#78350f';
          ctx.beginPath();
          ctx.arc(headX, headY - 6, 6, Math.PI, 0);
          ctx.fill();
        }
      }

      // 7. ARMS & COMBAT ANIMATION
      // UNARMED PUNCHING: Moving arm with clenched fist punching forward
      if (isAttacking && !hasWeapon) {
        const punchDist = punchExt * 14;
        const punchingLeft = isLeftPunch;

        // Guarding hand at chest
        const guardX = punchingLeft ? (3.5 + leanX) : (-3.5 + leanX);
        const guardY = -9 - walkBob + leanY;
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(guardX, guardY, 2.6, 0, Math.PI * 2);
        ctx.fill();

        // Punching arm (compact, natural extension)
        const punchDist = punchExt * 4.5;
        const shoulderX = punchingLeft ? (-4.5 + leanX) : (4.5 + leanX);
        const shoulderY = -11 - walkBob + leanY;
        let fistX = shoulderX;
        let fistY = shoulderY;

        if (dir === 'down') {
          fistY += 6 + punchDist;
        } else if (dir === 'up') {
          fistY -= 5 + punchDist;
        } else if (dir === 'left') {
          fistX = -5.5 + leanX - punchDist;
          fistY = -9 - walkBob + leanY;
        } else {
          fistX = 5.5 + leanX + punchDist;
          fistY = -9 - walkBob + leanY;
        }

        // Arm link
        ctx.strokeStyle = '#fbcfe8';
        ctx.lineWidth = 3.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(fistX, fistY);
        ctx.stroke();

        // Vambrace on punching arm
        if ((punchingLeft && equipment.bracelete_esquerdo) || (!punchingLeft && equipment.bracelete_direito)) {
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 4.2;
          ctx.beginPath();
          ctx.moveTo((shoulderX + fistX)/2 - 1, (shoulderY + fistY)/2 - 1);
          ctx.lineTo((shoulderX + fistX)/2 + 1, (shoulderY + fistY)/2 + 1);
          ctx.stroke();
        }

        // Clenched fist
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(fistX, fistY, 3.0, 0, Math.PI * 2);
        ctx.fill();

        // Air shockwave at peak
        if (punchExt > 0.45) {
          const shockAlpha = (punchExt - 0.45) / 0.55;
          ctx.strokeStyle = 'rgba(255, 255, 255, ' + (shockAlpha * 0.85) + ')';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          if (dir === 'right') ctx.arc(fistX + 3.5, fistY, 4.5, -Math.PI * 0.4, Math.PI * 0.4);
          else if (dir === 'left') ctx.arc(fistX - 3.5, fistY, 4.5, Math.PI * 0.6, Math.PI * 1.4);
          else if (dir === 'down') ctx.arc(fistX, fistY + 3.5, 4.5, Math.PI * 0.1, Math.PI * 0.9);
          else ctx.arc(fistX, fistY - 3.5, 4.5, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        }
      } else if (isAttacking && hasWeapon) {
        function drawHeldWeaponItem() {
          const wName = (equipment.mao_direita && equipment.mao_direita.name || '').toLowerCase();
          const isGalho = wName.includes('galho');
          const isMace = wName.includes('maça') || wName.includes('maca') || wName.includes('mace');
          if (isGalho) {
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(-1.5, -16, 3, 19);
            ctx.fillStyle = '#854d0e';
            ctx.fillRect(-0.8, -15, 1.6, 17);
            ctx.strokeStyle = '#713f12';
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(1, -9); ctx.lineTo(4.5, -13); ctx.stroke();
            ctx.fillStyle = '#65a30d';
            ctx.beginPath(); ctx.arc(4.5, -13.5, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(0, -17, 1.5, 0, Math.PI * 2); ctx.fill();
          } else if (isMace) {
            // Rustic Stone Mace (shaft + faceted stone head)
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(-1.5, -15, 3, 18);
            ctx.fillStyle = '#854d0e';
            ctx.fillRect(-0.8, -14, 1.6, 16);
            ctx.fillStyle = '#b45309';
            ctx.fillRect(-1.8, -4, 3.6, 5);
            ctx.fillStyle = '#a16207';
            ctx.fillRect(-2.2, -12, 4.4, 2.5);
            // Heavy stone head
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(-4, -18); ctx.lineTo(0, -21); ctx.lineTo(4, -18);
            ctx.lineTo(5.5, -14.5); ctx.lineTo(4, -11); ctx.lineTo(-4, -11); ctx.lineTo(-5.5, -14.5);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.moveTo(0, -21); ctx.lineTo(-4, -18); ctx.lineTo(-2, -14.5); ctx.lineTo(0, -14.5);
            ctx.closePath(); ctx.fill();
          } else if (wName.includes('lança') || wName.includes('lanca') || wName.includes('spear')) {
            // Primitive Spear (Lança Primitiva)
            ctx.fillStyle = '#78350f';
            ctx.fillRect(-1.2, -20, 2.4, 23);
            ctx.fillStyle = '#a16207';
            ctx.fillRect(-0.6, -19, 1.2, 21);
            ctx.fillStyle = '#b45309';
            ctx.fillRect(-1.5, -4, 3, 4);
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(0, -28); ctx.lineTo(3, -21); ctx.lineTo(-3, -21); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.moveTo(0, -28); ctx.lineTo(-3, -21); ctx.lineTo(0, -21); ctx.closePath(); ctx.fill();
          } else {
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(-1.5, -16, 3, 13);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(-4, -3, 8, 2);
          }
        }

        const wName = (equipment.mao_direita && equipment.mao_direita.name || '').toLowerCase();
        const isSpear = wName.includes('lança') || wName.includes('lanca') || wName.includes('spear');

        // 4-Directional tailored weapon slashes or spear thrusts with anatomically connected arm
        if (isSpear) {
          // Lança: Estocada transversal orientada na direção do alvo ou ângulo de ataque
          const defaultAngle =
            dir === 'right' ? 0 :
            dir === 'left' ? Math.PI :
            dir === 'up' ? -Math.PI / 2 :
            Math.PI / 2;
          const thrustAngle = player.attackAngle !== undefined ? player.attackAngle : defaultAngle;
          const cosA = Math.cos(thrustAngle);
          const sinA = Math.sin(thrustAngle);

          const thrustDist = Math.sin(Math.pow(attackProg, 0.6) * Math.PI) * 16;
          const isAimingLeft = cosA < -0.15 || (Math.abs(cosA) <= 0.15 && dir === 'left');

          const shoulderX = (isAimingLeft ? -4 : 4) + leanX;
          const shoulderY = -11 - walkBob + leanY + (sinA < -0.3 ? -1 : 0);

          const baseReach = 3.5;
          const totalReach = baseReach + thrustDist;
          const handX = shoulderX + cosA * totalReach;
          const handY = shoulderY + sinA * totalReach;

          ctx.strokeStyle = '#fbcfe8';
          ctx.lineWidth = 3.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(handX, handY);
          ctx.stroke();

          if (equipment.bracelete_direito || equipment.bracelete_esquerdo) {
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 4.2;
            ctx.beginPath();
            ctx.moveTo((shoulderX + handX) / 2 - 0.5, (shoulderY + handY) / 2 - 0.5);
            ctx.lineTo((shoulderX + handX) / 2 + 0.5, (shoulderY + handY) / 2 + 0.5);
            ctx.stroke();
          }

          ctx.save();
          ctx.translate(handX, handY);
          ctx.rotate(thrustAngle + Math.PI / 2);

          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath(); ctx.arc(0, 0, 2.8, 0, Math.PI * 2); ctx.fill();

          if (thrustDist > 7) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-3, -20); ctx.lineTo(-3, -32);
            ctx.moveTo(3, -20); ctx.lineTo(3, -32);
            ctx.stroke();
          }

          drawHeldWeaponItem();
          ctx.restore();
        } else if (dir === 'down') {
          // Facing DOWN: High-impact overhead-to-downward diagonal chop
          const shoulderX = 5 + leanX;
          const shoulderY = -11 - walkBob + leanY;
          const handX = (5.5 - attackProg * 3.5) + leanX;
          const handY = (-10 + Math.sin(attackProg * Math.PI) * 7) - walkBob + leanY;

          // Arm connecting shoulder to hand
          ctx.strokeStyle = '#fbcfe8';
          ctx.lineWidth = 3.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(handX, handY);
          ctx.stroke();

          if (equipment.bracelete_direito) {
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 4.2;
            ctx.beginPath();
            ctx.moveTo((shoulderX + handX) / 2 - 0.5, (shoulderY + handY) / 2 - 0.5);
            ctx.lineTo((shoulderX + handX) / 2 + 0.5, (shoulderY + handY) / 2 + 0.5);
            ctx.stroke();
          }

          ctx.save();
          ctx.translate(handX, handY);
          const swingAngle = 0.45 + attackProg * (Math.PI * 1.3 - 0.45);
          ctx.rotate(swingAngle);

          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath(); ctx.arc(0, 0, 2.8, 0, Math.PI * 2); ctx.fill();
          drawHeldWeaponItem();
          ctx.restore();
        } else if (dir === 'right') {
          const shoulderX = 4 + leanX;
          const shoulderY = -11 - walkBob + leanY;
          const handX = (5 + Math.sin(attackProg * Math.PI) * 5) + leanX;
          const handY = (-9 + attackProg * 3) - walkBob + leanY;

          ctx.strokeStyle = '#fbcfe8';
          ctx.lineWidth = 3.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(handX, handY);
          ctx.stroke();

          if (equipment.bracelete_direito) {
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 4.2;
            ctx.beginPath();
            ctx.moveTo((shoulderX + handX) / 2 - 0.5, (shoulderY + handY) / 2 - 0.5);
            ctx.lineTo((shoulderX + handX) / 2 + 0.5, (shoulderY + handY) / 2 + 0.5);
            ctx.stroke();
          }

          ctx.save();
          ctx.translate(handX, handY);
          const swingAngle = -0.6 + attackProg * 2.8;
          ctx.rotate(swingAngle);

          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath(); ctx.arc(0, 0, 2.8, 0, Math.PI * 2); ctx.fill();
          drawHeldWeaponItem();
          ctx.restore();
        } else if (dir === 'left') {
          const shoulderX = -4 + leanX;
          const shoulderY = -11 - walkBob + leanY;
          const handX = (-5 - Math.sin(attackProg * Math.PI) * 5) + leanX;
          const handY = (-9 + attackProg * 3) - walkBob + leanY;

          ctx.strokeStyle = '#fbcfe8';
          ctx.lineWidth = 3.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(handX, handY);
          ctx.stroke();

          if (equipment.bracelete_direito) {
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 4.2;
            ctx.beginPath();
            ctx.moveTo((shoulderX + handX) / 2 - 0.5, (shoulderY + handY) / 2 - 0.5);
            ctx.lineTo((shoulderX + handX) / 2 + 0.5, (shoulderY + handY) / 2 + 0.5);
            ctx.stroke();
          }

          ctx.save();
          ctx.translate(handX, handY);
          ctx.scale(-1, 1);
          const swingAngle = -0.6 + attackProg * 2.8;
          ctx.rotate(swingAngle);

          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath(); ctx.arc(0, 0, 2.8, 0, Math.PI * 2); ctx.fill();
          drawHeldWeaponItem();
          ctx.restore();
        } else {
          const shoulderX = 4 + leanX;
          const shoulderY = -12 - walkBob + leanY;
          const handX = (4 - attackProg * 2) + leanX;
          const handY = (-12 - Math.sin(attackProg * Math.PI) * 4) - walkBob + leanY;

          ctx.strokeStyle = '#fbcfe8';
          ctx.lineWidth = 3.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(handX, handY);
          ctx.stroke();

          if (equipment.bracelete_direito) {
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 4.2;
            ctx.beginPath();
            ctx.moveTo((shoulderX + handX) / 2 - 0.5, (shoulderY + handY) / 2 - 0.5);
            ctx.lineTo((shoulderX + handX) / 2 + 0.5, (shoulderY + handY) / 2 + 0.5);
            ctx.stroke();
          }

          ctx.save();
          ctx.translate(handX, handY);
          const swingAngle = 0.8 - attackProg * 1.8;
          ctx.rotate(swingAngle);

          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath(); ctx.arc(0, 0, 2.8, 0, Math.PI * 2); ctx.fill();
          drawHeldWeaponItem();
          ctx.restore();
        }

        // Slash trail
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        let slashRadius = 18;
        let startAngle = 0;
        if (dir === 'right') startAngle = -0.5;
        else if (dir === 'left') startAngle = 2.5;
        else if (dir === 'up') startAngle = -2.2;
        else startAngle = 0.5;
        ctx.arc(0, -10, slashRadius, startAngle, startAngle + 1.4);
        ctx.stroke();
      } else {
        // IDLE / WALKING
        // Offhand: Torch, Shield, or bare hand
        if (lanternActive) {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-9, -14 - walkBob, 3, 12);
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.arc(-7.5, -16 - walkBob + Math.sin(animTimer * 12), 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (equipment.mao_esquerda && equipment.mao_esquerda.name.toLowerCase().includes('escudo')) {
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.ellipse(-8, -8 - walkBob, 5, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        } else {
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.arc(-8, -8 - walkBob, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main hand: Weapon or bare hand
        if (equipment.mao_direita) {
          ctx.save();
          ctx.translate(8, -7 - walkBob);
          ctx.rotate(0.35);
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
          const wName = (equipment.mao_direita && equipment.mao_direita.name || '').toLowerCase();
          const isGalho = wName.includes('galho');
          const isMace = wName.includes('maça') || wName.includes('maca') || wName.includes('mace');
          if (isGalho) {
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(-1.5, -14, 3, 18);
            ctx.fillStyle = '#854d0e';
            ctx.fillRect(-0.8, -13, 1.6, 16);
            ctx.fillStyle = '#65a30d';
            ctx.beginPath(); ctx.arc(0, -15, 1.5, 0, Math.PI * 2); ctx.fill();
          } else if (isMace) {
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(-1.5, -13, 3, 16);
            ctx.fillStyle = '#854d0e';
            ctx.fillRect(-0.8, -12, 1.6, 14);
            ctx.fillStyle = '#a16207';
            ctx.fillRect(-2, -10, 4, 2);
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.arc(0, -15, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(-1.2, -16.2, 2.8, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(-1.5, -14, 3, 12);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(-3, -2, 6, 2);
          }
          ctx.restore();
        } else {
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.arc(8, -8 - walkBob, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    function renderMinimap() {
      const mw = minimapCanvas.width;
      const mh = minimapCanvas.height;
      const mData = miniCtx.createImageData(mw, mh);
      const data = mData.data;

      const pTx = Math.round(player.x / TILE_SIZE);
      const pTy = Math.round(player.y / TILE_SIZE);
      const half = mw / 2;

      for (let y = 0; y < mh; y += 2) {
        for (let x = 0; x < mw; x += 2) {
          const tx = pTx + Math.floor((x - half) * 0.8);
          const ty = pTy + Math.floor((y - half) * 0.8);
          const t = getTile(tx, ty);

          let r = 95, g = 167, b = 67;
          if (t.biome.hasWater) { r = 2; g = 132; b = 199; }
          else if (t.biome.name.includes('Praia')) { r = 224; g = 192; b = 120; }
          else if (t.biome.name.includes('Deserto')) { r = 223; g = 183; b = 108; }
          else if (t.biome.name.includes('Taiga') || t.biome.name.includes('Glaciais')) { r = 220; g = 230; b = 240; }
          else if (t.biome.name.includes('Ancestral')) { r = 45; g = 97; b = 36; }

          for (let dy = 0; dy < 2; dy++) {
            for (let dx = 0; dx < 2; dx++) {
              const idx = ((y + dy) * mw + (x + dx)) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = 255;
            }
          }
        }
      }
      miniCtx.putImageData(mData, 0, 0);
    }

    requestAnimationFrame(gameLoop);
  <\/script>
</body>
</html>`;
  }
