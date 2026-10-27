/* js/creatures/registry.js
 * REGISTRO DE CRIATURAS (nucleo): CREATURES e funcoes de consulta.
 * Cada criatura migrada tem UM arquivo em js/creatures/<nome>.js que faz CREATURES.<tipo> = {...}.
 * Migradas ate agora: rabbit (coelho), wolf (lobo), deer (cervo), golem, bat (morcego), tardigrade, spider (aranha), scorpion (escorpiao), dragon (dragao) e slime, nessa
 * ordem de carga (a ordem e a prioridade de deteccao por nome). As demais ainda estao espalhadas (ver ARQUITETURA.md).
 * ATENCAO: registrar um tipo faz gl(tipo) ficar verdadeiro (medo de fogo/tocha); use behavior.fearsFire:false para evitar.
 * Carregar ANTES dos arquivos de js/creatures/<nome>.js e dos motores (so e usado em tempo de execucao).
 */
"use strict";
const CREATURES = {};

/** Definicao da criatura ou null (nao migrada). */
function getCreature(type) {
  return Object.prototype.hasOwnProperty.call(CREATURES, type) ? CREATURES[type] : null;
}
/** Funcao de desenho da criatura migrada ("body" corpo vivo, "carcass" carcaca no chao dentro da sombra/alfa padrao de Ag,
 *  "carcassFull" carcaca inteira com sombra propria e tempo de animacao (slime), "icon" icone) ou null. */
function creatureDraw(type, kind) {
  const c = getCreature(type);
  return (c && c.draw && c.draw[kind]) || null;
}
/** Tipo da criatura migrada cujo detectIcon() casa (usado para escolher o desenho do icone), ou null. */
function detectCreatureForIcon(t, l, o) {
  for (const k of Object.keys(CREATURES)) {
    const c = CREATURES[k];
    if (c.detectIcon && c.detectIcon(t, l, o)) return k;
  }
  return null;
}
/** Carcaca da criatura migrada ou null. */
function creatureCarcass(type) {
  const c = getCreature(type);
  return c && c.carcass ? c.carcass : null; // opcionais: rarity (padrao "raro") e value (padrao 35)
}
/** Comportamento da criatura migrada (objeto vazio se nao migrada). */
function creatureBehavior(type) {
  const c = getCreature(type);
  return (c && c.behavior) || {};
}
/** Presa (foge do jogador)? */
function isPreyType(type) {
  return !!creatureBehavior(type).prey;
}
/** Particulas ao morrer (12 e o padrao das criaturas nao migradas). */
function creatureDeathParticles(type) {
  const c = getCreature(type);
  return c && c.behavior && c.behavior.deathParticles != null ? c.behavior.deathParticles : 12;
}
/** Tipo da primeira criatura migrada cujo detect() casa, ou null. */
function detectMigratedCreature(t, l, o) {
  for (const k of Object.keys(CREATURES)) {
    const c = CREATURES[k];
    if (c.detect && c.detect(t, l, o)) return k;
  }
  return null;
}
