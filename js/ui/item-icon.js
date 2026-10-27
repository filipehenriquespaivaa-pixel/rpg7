/* js/ui/item-icon.js
 * Componente ItemIcon: desenha o icone de um item (usa drawItemIcon). Use SEMPRE este para icones.
 * Trecho de legacy/app.original.js (linhas 36330-36370); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  const ItemIcon = ({
    item: e,
    size: t = 32,
    className: l = "",
    animate: o = !1,
  }) => {
    const u = J.useRef(null);
    return (
      J.useEffect(() => {
        const m = u.current;
        if (!m || !e) return;
        const c = m.getContext("2d");
        if (!c) return;
        const f = window.devicePixelRatio || 1;
        ((m.width = t * f), (m.height = t * f));
        let g,
          y = performance.now();
        const w = (v) => {
          const T = o ? (v - y) / 1e3 : 0;
          (c.save(),
            c.scale(f, f),
            drawItemIcon(c, e, t, t, T),
            c.restore(),
            o && (g = requestAnimationFrame(w)));
        };
        return (
          w(performance.now()),
          () => {
            g && cancelAnimationFrame(g);
          }
        );
      }, [e, t, o]),
      e
        ? h.jsx("canvas", {
            ref: u,
            style: { width: t, height: t },
            className: `inline-block shrink-0 select-none pointer-events-none ${l}`,
          })
        : h.jsx("div", { style: { width: t, height: t }, className: l })
    );
  };
