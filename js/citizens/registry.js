/* js/citizens/registry.js
 * REGISTRO DE HABITANTES DAS CIDADES (CITIZEN_KINDS): um arquivo por tipo de habitante em js/citizens/<tipo>.js.
 * Cada tipo guarda as suas SKINS (paletas de pele, cabelo e roupa), os PERFIS (nome, titulo, adereco...) e a funcao
 * `draw` que o desenha no Canvas. A criacao, o movimento, as portas e as conversas continuam nos modulos das cidades
 * (js/core/desert-city.js, port-city.js, snow-peak-city.js), que leem estas paletas na hora de criar os moradores
 * (_initCitizens) e chamam `draw` na hora de desenhar (updateAndGetCitizenRenderItems).
 *
 * Forma de um tipo (todos os campos de dados sao opcionais, cada cidade usa os seus):
 *   CITIZEN_KINDS["desert-citizen"] = {
 *     id, city, description,
 *     skinTones, hairColors, outfitPalettes (ou outfitColors), profiles,
 *     draw: function (ctx, npc, timeOfDay, animTimer, player) { ... },
 *   };
 *
 * Como adicionar um habitante novo: crie js/citizens/<tipo>.js, registre em CITIZEN_KINDS e inclua o <script> em index.html
 * (depois deste arquivo). Os arquivos sao scripts classicos (sem import/export) e escopo global compartilhado.
 */
"use strict";
const CITIZEN_KINDS = {};

/** Tipo de habitante registrado (ou null). */
function getCitizenKind(id) {
  return Object.prototype.hasOwnProperty.call(CITIZEN_KINDS, id) ? CITIZEN_KINDS[id] : null;
}
