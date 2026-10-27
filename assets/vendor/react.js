/* assets/vendor/react.js
 * React 19 + ReactDOM + scheduler. Terceiros: nao editar.
 * Trecho de legacy/app.original.js (linhas 56-14545); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  function sp() {
    if (Su) return ua;
    Su = 1;
    var e = Symbol.for("react.transitional.element"),
      t = Symbol.for("react.portal"),
      l = Symbol.for("react.fragment"),
      o = Symbol.for("react.strict_mode"),
      u = Symbol.for("react.profiler"),
      m = Symbol.for("react.consumer"),
      c = Symbol.for("react.context"),
      f = Symbol.for("react.forward_ref"),
      g = Symbol.for("react.suspense"),
      y = Symbol.for("react.memo"),
      w = Symbol.for("react.lazy"),
      v = Symbol.for("react.activity"),
      T = Symbol.for("react.view_transition"),
      S = Symbol.iterator;
    function p(C) {
      return C === null || typeof C != "object"
        ? null
        : ((C = (S && C[S]) || C["@@iterator"]),
          typeof C == "function" ? C : null);
    }
    var j = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      P = Object.assign,
      A = {};
    function x(C, I, be) {
      ((this.props = C),
        (this.context = I),
        (this.refs = A),
        (this.updater = be || j));
    }
    ((x.prototype.isReactComponent = {}),
      (x.prototype.setState = function (C, I) {
        if (typeof C != "object" && typeof C != "function" && C != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables.",
          );
        this.updater.enqueueSetState(this, C, I, "setState");
      }),
      (x.prototype.forceUpdate = function (C) {
        this.updater.enqueueForceUpdate(this, C, "forceUpdate");
      }));
    function M() {}
    M.prototype = x.prototype;
    function $(C, I, be) {
      ((this.props = C),
        (this.context = I),
        (this.refs = A),
        (this.updater = be || j));
    }
    var z = ($.prototype = new M());
    ((z.constructor = $), P(z, x.prototype), (z.isPureReactComponent = !0));
    var K = Array.isArray;
    function V() {}
    var O = { H: null, A: null, T: null, S: null },
      _ = Object.prototype.hasOwnProperty;
    function se(C, I, be) {
      var Me = be.ref;
      return {
        $$typeof: e,
        type: C,
        key: I,
        ref: Me !== void 0 ? Me : null,
        props: be,
      };
    }
    function ue(C, I) {
      return se(C.type, I, C.props);
    }
    function N(C) {
      return typeof C == "object" && C !== null && C.$$typeof === e;
    }
    function Ee(C) {
      var I = { "=": "=0", ":": "=2" };
      return (
        "$" +
        C.replace(/[=:]/g, function (be) {
          return I[be];
        })
      );
    }
    var ne = /\/+/g;
    function ke(C, I) {
      return typeof C == "object" && C !== null && C.key != null
        ? Ee("" + C.key)
        : I.toString(36);
    }
    function G(C) {
      switch (C.status) {
        case "fulfilled":
          return C.value;
        case "rejected":
          throw C.reason;
        default:
          switch (
            (typeof C.status == "string"
              ? C.then(V, V)
              : ((C.status = "pending"),
                C.then(
                  function (I) {
                    C.status === "pending" &&
                      ((C.status = "fulfilled"), (C.value = I));
                  },
                  function (I) {
                    C.status === "pending" &&
                      ((C.status = "rejected"), (C.reason = I));
                  },
                )),
            C.status)
          ) {
            case "fulfilled":
              return C.value;
            case "rejected":
              throw C.reason;
          }
      }
      throw C;
    }
    function de(C, I, be, Me, Te) {
      var Fe = typeof C;
      (Fe === "undefined" || Fe === "boolean") && (C = null);
      var _e = !1;
      if (C === null) _e = !0;
      else
        switch (Fe) {
          case "bigint":
          case "string":
          case "number":
            _e = !0;
            break;
          case "object":
            switch (C.$$typeof) {
              case e:
              case t:
                _e = !0;
                break;
              case w:
                return ((_e = C._init), de(_e(C._payload), I, be, Me, Te));
            }
        }
      if (_e)
        return (
          (Te = Te(C)),
          (_e = Me === "" ? "." + ke(C, 0) : Me),
          K(Te)
            ? ((be = ""),
              _e != null && (be = _e.replace(ne, "$&/") + "/"),
              de(Te, I, be, "", function ($a) {
                return $a;
              }))
            : Te != null &&
              (N(Te) &&
                (Te = ue(
                  Te,
                  be +
                    (Te.key == null || (C && C.key === Te.key)
                      ? ""
                      : ("" + Te.key).replace(ne, "$&/") + "/") +
                    _e,
                )),
              I.push(Te)),
          1
        );
      _e = 0;
      var xe = Me === "" ? "." : Me + ":";
      if (K(C))
        for (var Ue = 0; Ue < C.length; Ue++)
          ((Me = C[Ue]), (Fe = xe + ke(Me, Ue)), (_e += de(Me, I, be, Fe, Te)));
      else if (((Ue = p(C)), typeof Ue == "function"))
        for (C = Ue.call(C), Ue = 0; !(Me = C.next()).done; )
          ((Me = Me.value),
            (Fe = xe + ke(Me, Ue++)),
            (_e += de(Me, I, be, Fe, Te)));
      else if (Fe === "object") {
        if (typeof C.then == "function") return de(G(C), I, be, Me, Te);
        throw (
          (I = String(C)),
          Error(
            "Objects are not valid as a React child (found: " +
              (I === "[object Object]"
                ? "object with keys {" + Object.keys(C).join(", ") + "}"
                : I) +
              "). If you meant to render a collection of children, use an array instead.",
          )
        );
      }
      return _e;
    }
    function W(C, I, be) {
      if (C == null) return C;
      var Me = [],
        Te = 0;
      return (
        de(C, Me, "", "", function (Fe) {
          return I.call(be, Fe, Te++);
        }),
        Me
      );
    }
    function le(C) {
      if (C._status === -1) {
        var I = C._result,
          be = I();
        (be.then(
          function (Me) {
            (C._status === 0 || C._status === -1) &&
              ((C._status = 1),
              (C._result = Me),
              be.status === void 0 &&
                ((be.status = "fulfilled"), (be.value = Me)));
          },
          function (Me) {
            (C._status === 0 || C._status === -1) &&
              ((C._status = 2),
              (C._result = Me),
              be.status === void 0 &&
                ((be.status = "rejected"), (be.reason = Me)));
          },
        ),
          C._status === -1 && ((C._status = 0), (C._result = be)));
      }
      if (C._status === 1) return C._result.default;
      throw C._result;
    }
    var te =
      typeof reportError == "function"
        ? reportError
        : function (C) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var I = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof C == "object" &&
                  C !== null &&
                  typeof C.message == "string"
                    ? String(C.message)
                    : String(C),
                error: C,
              });
              if (!window.dispatchEvent(I)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", C);
              return;
            }
            console.error(C);
          };
    function oe(C) {
      var I = O.T,
        be = {};
      ((be.types = I !== null ? I.types : null), (O.T = be));
      try {
        var Me = C(),
          Te = O.S;
        (Te !== null && Te(be, Me),
          typeof Me == "object" &&
            Me !== null &&
            typeof Me.then == "function" &&
            Me.then(V, te));
      } catch (Fe) {
        te(Fe);
      } finally {
        (I !== null && be.types !== null && (I.types = be.types), (O.T = I));
      }
    }
    function Ne(C) {
      var I = O.T;
      if (I !== null) {
        var be = I.types;
        be === null ? (I.types = [C]) : be.indexOf(C) === -1 && be.push(C);
      } else oe(Ne.bind(null, C));
    }
    var X = {
      map: W,
      forEach: function (C, I, be) {
        W(
          C,
          function () {
            I.apply(this, arguments);
          },
          be,
        );
      },
      count: function (C) {
        var I = 0;
        return (
          W(C, function () {
            I++;
          }),
          I
        );
      },
      toArray: function (C) {
        return (
          W(C, function (I) {
            return I;
          }) || []
        );
      },
      only: function (C) {
        if (!N(C))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return C;
      },
    };
    return (
      (ua.Activity = v),
      (ua.Children = X),
      (ua.Component = x),
      (ua.Fragment = l),
      (ua.Profiler = u),
      (ua.PureComponent = $),
      (ua.StrictMode = o),
      (ua.Suspense = g),
      (ua.ViewTransition = T),
      (ua.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = O),
      (ua.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (C) {
          return O.H.useMemoCache(C);
        },
      }),
      (ua.addTransitionType = Ne),
      (ua.cache = function (C) {
        return function () {
          return C.apply(null, arguments);
        };
      }),
      (ua.cacheSignal = function () {
        return null;
      }),
      (ua.cloneElement = function (C, I, be) {
        if (C == null)
          throw Error(
            "The argument must be a React element, but you passed " + C + ".",
          );
        var Me = P({}, C.props),
          Te = C.key;
        if (I != null)
          for (Fe in (I.key !== void 0 && (Te = "" + I.key), I))
            !_.call(I, Fe) ||
              Fe === "key" ||
              Fe === "__self" ||
              Fe === "__source" ||
              (Fe === "ref" && I.ref === void 0) ||
              (Me[Fe] = I[Fe]);
        var Fe = arguments.length - 2;
        if (Fe === 1) Me.children = be;
        else if (1 < Fe) {
          for (var _e = Array(Fe), xe = 0; xe < Fe; xe++)
            _e[xe] = arguments[xe + 2];
          Me.children = _e;
        }
        return se(C.type, Te, Me);
      }),
      (ua.createContext = function (C) {
        return (
          (C = {
            $$typeof: c,
            _currentValue: C,
            _currentValue2: C,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
          }),
          (C.Provider = C),
          (C.Consumer = { $$typeof: m, _context: C }),
          C
        );
      }),
      (ua.createElement = function (C, I, be) {
        var Me,
          Te = {},
          Fe = null;
        if (I != null)
          for (Me in (I.key !== void 0 && (Fe = "" + I.key), I))
            _.call(I, Me) &&
              Me !== "key" &&
              Me !== "__self" &&
              Me !== "__source" &&
              (Te[Me] = I[Me]);
        var _e = arguments.length - 2;
        if (_e === 1) Te.children = be;
        else if (1 < _e) {
          for (var xe = Array(_e), Ue = 0; Ue < _e; Ue++)
            xe[Ue] = arguments[Ue + 2];
          Te.children = xe;
        }
        if (C && C.defaultProps)
          for (Me in ((_e = C.defaultProps), _e))
            Te[Me] === void 0 && (Te[Me] = _e[Me]);
        return se(C, Fe, Te);
      }),
      (ua.createRef = function () {
        return { current: null };
      }),
      (ua.forwardRef = function (C) {
        return { $$typeof: f, render: C };
      }),
      (ua.isValidElement = N),
      (ua.lazy = function (C) {
        return {
          $$typeof: w,
          _payload: { _status: -1, _result: C },
          _init: le,
        };
      }),
      (ua.memo = function (C, I) {
        return { $$typeof: y, type: C, compare: I === void 0 ? null : I };
      }),
      (ua.startTransition = oe),
      (ua.unstable_useCacheRefresh = function () {
        return O.H.useCacheRefresh();
      }),
      (ua.use = function (C) {
        return O.H.use(C);
      }),
      (ua.useActionState = function (C, I, be) {
        return O.H.useActionState(C, I, be);
      }),
      (ua.useCallback = function (C, I) {
        return O.H.useCallback(C, I);
      }),
      (ua.useContext = function (C) {
        return O.H.useContext(C);
      }),
      (ua.useDebugValue = function () {}),
      (ua.useDeferredValue = function (C, I) {
        return O.H.useDeferredValue(C, I);
      }),
      (ua.useEffect = function (C, I) {
        return O.H.useEffect(C, I);
      }),
      (ua.useEffectEvent = function (C) {
        return O.H.useEffectEvent(C);
      }),
      (ua.useId = function () {
        return O.H.useId();
      }),
      (ua.useImperativeHandle = function (C, I, be) {
        return O.H.useImperativeHandle(C, I, be);
      }),
      (ua.useInsertionEffect = function (C, I) {
        return O.H.useInsertionEffect(C, I);
      }),
      (ua.useLayoutEffect = function (C, I) {
        return O.H.useLayoutEffect(C, I);
      }),
      (ua.useMemo = function (C, I) {
        return O.H.useMemo(C, I);
      }),
      (ua.useOptimistic = function (C, I) {
        return O.H.useOptimistic(C, I);
      }),
      (ua.useReducer = function (C, I, be) {
        return O.H.useReducer(C, I, be);
      }),
      (ua.useRef = function (C) {
        return O.H.useRef(C);
      }),
      (ua.useState = function (C) {
        return O.H.useState(C);
      }),
      (ua.useSyncExternalStore = function (C, I, be) {
        return O.H.useSyncExternalStore(C, I, be);
      }),
      (ua.useTransition = function () {
        return O.H.useTransition();
      }),
      (ua.version = "19.3.0"),
      ua
    );
  }
  var ku;
  function Os() {
    return (ku || ((ku = 1), (Ls.exports = sp())), Ls.exports);
  }
  var J = Os(),
    qs = { exports: {} },
    ci = {},
    Bs = { exports: {} },
    Vs = {};
  /**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */ var Mu;
  function cp() {
    return (
      Mu ||
        ((Mu = 1),
        (function (e) {
          function t(G, de) {
            var W = G.length;
            G.push(de);
            e: for (; 0 < W; ) {
              var le = (W - 1) >>> 1,
                te = G[le];
              if (0 < u(te, de)) ((G[le] = de), (G[W] = te), (W = le));
              else break e;
            }
          }
          function l(G) {
            return G.length === 0 ? null : G[0];
          }
          function o(G) {
            if (G.length === 0) return null;
            var de = G[0],
              W = G.pop();
            if (W !== de) {
              G[0] = W;
              e: for (var le = 0, te = G.length, oe = te >>> 1; le < oe; ) {
                var Ne = 2 * (le + 1) - 1,
                  X = G[Ne],
                  C = Ne + 1,
                  I = G[C];
                if (0 > u(X, W))
                  C < te && 0 > u(I, X)
                    ? ((G[le] = I), (G[C] = W), (le = C))
                    : ((G[le] = X), (G[Ne] = W), (le = Ne));
                else if (C < te && 0 > u(I, W))
                  ((G[le] = I), (G[C] = W), (le = C));
                else break e;
              }
            }
            return de;
          }
          function u(G, de) {
            var W = G.sortIndex - de.sortIndex;
            return W !== 0 ? W : G.id - de.id;
          }
          if (
            ((e.unstable_now = void 0),
            typeof performance == "object" &&
              typeof performance.now == "function")
          ) {
            var m = performance;
            e.unstable_now = function () {
              return m.now();
            };
          } else {
            var c = Date,
              f = c.now();
            e.unstable_now = function () {
              return c.now() - f;
            };
          }
          var g = [],
            y = [],
            w = 1,
            v = null,
            T = 3,
            S = !1,
            p = !1,
            j = !1,
            P = !1,
            A = typeof setTimeout == "function" ? setTimeout : null,
            x = typeof clearTimeout == "function" ? clearTimeout : null,
            M = typeof setImmediate < "u" ? setImmediate : null;
          function $(G) {
            for (var de = l(y); de !== null; ) {
              if (de.callback === null) o(y);
              else if (de.startTime <= G)
                (o(y), (de.sortIndex = de.expirationTime), t(g, de));
              else break;
              de = l(y);
            }
          }
          function z(G) {
            if (((j = !1), $(G), !p))
              if (l(g) !== null) ((p = !0), K || ((K = !0), N()));
              else {
                var de = l(y);
                de !== null && ke(z, de.startTime - G);
              }
          }
          var K = !1,
            V = -1,
            O = 5,
            _ = -1;
          function se() {
            return P ? !0 : !(e.unstable_now() - _ < O);
          }
          function ue() {
            if (((P = !1), K)) {
              var G = e.unstable_now();
              _ = G;
              var de = !0;
              try {
                e: {
                  ((p = !1), j && ((j = !1), x(V), (V = -1)), (S = !0));
                  var W = T;
                  try {
                    a: {
                      for (
                        $(G), v = l(g);
                        v !== null && !(v.expirationTime > G && se());

                      ) {
                        var le = v.callback;
                        if (typeof le == "function") {
                          ((v.callback = null), (T = v.priorityLevel));
                          var te = le(v.expirationTime <= G);
                          if (
                            ((G = e.unstable_now()), typeof te == "function")
                          ) {
                            ((v.callback = te), $(G), (de = !0));
                            break a;
                          }
                          (v === l(g) && o(g), $(G));
                        } else o(g);
                        v = l(g);
                      }
                      if (v !== null) de = !0;
                      else {
                        var oe = l(y);
                        (oe !== null && ke(z, oe.startTime - G), (de = !1));
                      }
                    }
                    break e;
                  } finally {
                    ((v = null), (T = W), (S = !1));
                  }
                  de = void 0;
                }
              } finally {
                de ? N() : (K = !1);
              }
            }
          }
          var N;
          if (typeof M == "function")
            N = function () {
              M(ue);
            };
          else if (typeof MessageChannel < "u") {
            var Ee = new MessageChannel(),
              ne = Ee.port2;
            ((Ee.port1.onmessage = ue),
              (N = function () {
                ne.postMessage(null);
              }));
          } else
            N = function () {
              A(ue, 0);
            };
          function ke(G, de) {
            V = A(function () {
              G(e.unstable_now());
            }, de);
          }
          ((e.unstable_IdlePriority = 5),
            (e.unstable_ImmediatePriority = 1),
            (e.unstable_LowPriority = 4),
            (e.unstable_NormalPriority = 3),
            (e.unstable_Profiling = null),
            (e.unstable_UserBlockingPriority = 2),
            (e.unstable_cancelCallback = function (G) {
              G.callback = null;
            }),
            (e.unstable_forceFrameRate = function (G) {
              0 > G || 125 < G
                ? console.error(
                    "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                  )
                : (O = 0 < G ? Math.floor(1e3 / G) : 5);
            }),
            (e.unstable_getCurrentPriorityLevel = function () {
              return T;
            }),
            (e.unstable_next = function (G) {
              switch (T) {
                case 1:
                case 2:
                case 3:
                  var de = 3;
                  break;
                default:
                  de = T;
              }
              var W = T;
              T = de;
              try {
                return G();
              } finally {
                T = W;
              }
            }),
            (e.unstable_requestPaint = function () {
              P = !0;
            }),
            (e.unstable_runWithPriority = function (G, de) {
              switch (G) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                  break;
                default:
                  G = 3;
              }
              var W = T;
              T = G;
              try {
                return de();
              } finally {
                T = W;
              }
            }),
            (e.unstable_scheduleCallback = function (G, de, W) {
              var le = e.unstable_now();
              switch (
                (typeof W == "object" && W !== null
                  ? ((W = W.delay),
                    (W = typeof W == "number" && 0 < W ? le + W : le))
                  : (W = le),
                G)
              ) {
                case 1:
                  var te = -1;
                  break;
                case 2:
                  te = 250;
                  break;
                case 5:
                  te = 1073741823;
                  break;
                case 4:
                  te = 1e4;
                  break;
                default:
                  te = 5e3;
              }
              return (
                (te = W + te),
                (G = {
                  id: w++,
                  callback: de,
                  priorityLevel: G,
                  startTime: W,
                  expirationTime: te,
                  sortIndex: -1,
                }),
                W > le
                  ? ((G.sortIndex = W),
                    t(y, G),
                    l(g) === null &&
                      G === l(y) &&
                      (j ? (x(V), (V = -1)) : (j = !0), ke(z, W - le)))
                  : ((G.sortIndex = te),
                    t(g, G),
                    p || S || ((p = !0), K || ((K = !0), N()))),
                G
              );
            }),
            (e.unstable_shouldYield = se),
            (e.unstable_wrapCallback = function (G) {
              var de = T;
              return function () {
                var W = T;
                T = de;
                try {
                  return G.apply(this, arguments);
                } finally {
                  T = W;
                }
              };
            }));
        })(Vs)),
      Vs
    );
  }
  var Cu;
  function dp() {
    return (Cu || ((Cu = 1), (Bs.exports = cp())), Bs.exports);
  }
  var Us = { exports: {} },
    yt = {};
  /**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */ var Pu;
  function up() {
    if (Pu) return yt;
    Pu = 1;
    var e = Os();
    function t(w) {
      var v = "https://react.dev/errors/" + w;
      if (1 < arguments.length) {
        v += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var T = 2; T < arguments.length; T++)
          v += "&args[]=" + encodeURIComponent(arguments[T]);
      }
      return (
        "Minified React error #" +
        w +
        "; visit " +
        v +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
      );
    }
    function l() {}
    var o = {
        d: {
          f: l,
          r: function () {
            throw Error(t(522));
          },
          D: l,
          C: l,
          L: l,
          m: l,
          X: l,
          S: l,
          M: l,
        },
        p: 0,
        findDOMNode: null,
      },
      u = Symbol.for("react.portal"),
      m = Symbol.for("react.recoverable"),
      c = Symbol.for("react.optimistic_key");
    function f(w, v, T) {
      var S =
        3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: u,
        key: S == null ? null : S === c ? c : "" + S,
        children: w,
        containerInfo: v,
        implementation: T,
      };
    }
    var g = e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function y(w, v) {
      if (w === "font") return "";
      if (typeof v == "string") return v === "use-credentials" ? v : "";
    }
    return (
      (yt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o),
      (yt.browser = function (w) {
        return { $$typeof: m, _reason: w };
      }),
      (yt.createPortal = function (w, v) {
        var T =
          2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!v || (v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11))
          throw Error(t(299));
        return f(w, v, null, T);
      }),
      (yt.flushSync = function (w) {
        var v = g.T,
          T = o.p;
        try {
          if (((g.T = null), (o.p = 2), w)) return w();
        } finally {
          ((g.T = v), (o.p = T), o.d.f());
        }
      }),
      (yt.preconnect = function (w, v) {
        typeof w == "string" &&
          (v
            ? ((v = v.crossOrigin),
              (v =
                typeof v == "string"
                  ? v === "use-credentials"
                    ? v
                    : ""
                  : void 0))
            : (v = null),
          o.d.C(w, v));
      }),
      (yt.prefetchDNS = function (w) {
        typeof w == "string" && o.d.D(w);
      }),
      (yt.preinit = function (w, v) {
        if (typeof w == "string" && v && typeof v.as == "string") {
          var T = v.as,
            S = y(T, v.crossOrigin),
            p = typeof v.integrity == "string" ? v.integrity : void 0,
            j = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
          T === "style"
            ? o.d.S(
                w,
                typeof v.precedence == "string" ? v.precedence : void 0,
                { crossOrigin: S, integrity: p, fetchPriority: j },
              )
            : T === "script" &&
              o.d.X(w, {
                crossOrigin: S,
                integrity: p,
                fetchPriority: j,
                nonce: typeof v.nonce == "string" ? v.nonce : void 0,
              });
        }
      }),
      (yt.preinitModule = function (w, v) {
        if (typeof w == "string")
          if (typeof v == "object" && v !== null) {
            if (v.as == null || v.as === "script") {
              var T = y(v.as, v.crossOrigin);
              o.d.M(w, {
                crossOrigin: T,
                integrity:
                  typeof v.integrity == "string" ? v.integrity : void 0,
                nonce: typeof v.nonce == "string" ? v.nonce : void 0,
                fetchPriority:
                  typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
              });
            }
          } else v == null && o.d.M(w);
      }),
      (yt.preload = function (w, v) {
        if (
          typeof w == "string" &&
          typeof v == "object" &&
          v !== null &&
          typeof v.as == "string"
        ) {
          var T = v.as,
            S = y(T, v.crossOrigin);
          o.d.L(w, T, {
            crossOrigin: S,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0,
            type: typeof v.type == "string" ? v.type : void 0,
            fetchPriority:
              typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
            referrerPolicy:
              typeof v.referrerPolicy == "string" ? v.referrerPolicy : void 0,
            imageSrcSet:
              typeof v.imageSrcSet == "string" ? v.imageSrcSet : void 0,
            imageSizes: typeof v.imageSizes == "string" ? v.imageSizes : void 0,
            media: typeof v.media == "string" ? v.media : void 0,
          });
        }
      }),
      (yt.preloadModule = function (w, v) {
        if (typeof w == "string")
          if (v) {
            var T = y(v.as, v.crossOrigin);
            o.d.m(w, {
              as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
              crossOrigin: T,
              integrity: typeof v.integrity == "string" ? v.integrity : void 0,
              nonce: typeof v.nonce == "string" ? v.nonce : void 0,
              fetchPriority:
                typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
            });
          } else o.d.m(w);
      }),
      (yt.requestFormReset = function (w) {
        o.d.r(w);
      }),
      (yt.unstable_batchedUpdates = function (w, v) {
        return w(v);
      }),
      (yt.useFormState = function (w, v, T) {
        return g.H.useFormState(w, v, T);
      }),
      (yt.useFormStatus = function () {
        return g.H.useHostTransitionStatus();
      }),
      (yt.version = "19.3.0"),
      yt
    );
  }
  var _u;
  function fp() {
    if (_u) return Us.exports;
    _u = 1;
    function e() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
        } catch (t) {
          console.error(t);
        }
    }
    return (e(), (Us.exports = up()), Us.exports);
  }
  /**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */ var Au;
  function mp() {
    if (Au) return ci;
    Au = 1;
    var e = dp(),
      t = Os(),
      l = fp();
    function o(a) {
      var r = "https://react.dev/errors/" + a;
      if (1 < arguments.length) {
        r += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i = 2; i < arguments.length; i++)
          r += "&args[]=" + encodeURIComponent(arguments[i]);
      }
      return (
        "Minified React error #" +
        a +
        "; visit " +
        r +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
      );
    }
    function u(a) {
      return !(
        !a ||
        (a.nodeType !== 1 && a.nodeType !== 9 && a.nodeType !== 11)
      );
    }
    function m(a) {
      for (var r = a, i = r; i && !i.alternate; )
        ((r = i), (r.flags & 4098) !== 0 && (a = r.return), (i = r.return));
      for (; r.return; ) r = r.return;
      return r.tag === 3 ? a : null;
    }
    function c(a) {
      if (a.tag === 13) {
        var r = a.memoizedState;
        if (
          (r === null &&
            ((a = a.alternate), a !== null && (r = a.memoizedState)),
          r !== null)
        )
          return r.dehydrated;
      }
      return null;
    }
    function f(a) {
      if (a.tag === 31) {
        var r = a.memoizedState;
        if (
          (r === null &&
            ((a = a.alternate), a !== null && (r = a.memoizedState)),
          r !== null)
        )
          return r.dehydrated;
      }
      return null;
    }
    function g(a) {
      if (m(a) !== a) throw Error(o(188));
    }
    function y(a) {
      var r = a.alternate;
      if (!r) {
        if (((r = m(a)), r === null)) throw Error(o(188));
        return r !== a ? null : a;
      }
      for (var i = a, n = r; ; ) {
        var s = i.return;
        if (s === null) break;
        var d = s.alternate;
        if (d === null) {
          if (((n = s.return), n !== null)) {
            i = n;
            continue;
          }
          break;
        }
        if (s.child === d.child) {
          for (d = s.child; d; ) {
            if (d === i) return (g(s), a);
            if (d === n) return (g(s), r);
            d = d.sibling;
          }
          throw Error(o(188));
        }
        if (i.return !== n.return) ((i = s), (n = d));
        else {
          for (var b = !1, k = s.child; k; ) {
            if (k === i) {
              ((b = !0), (i = s), (n = d));
              break;
            }
            if (k === n) {
              ((b = !0), (n = s), (i = d));
              break;
            }
            k = k.sibling;
          }
          if (!b) {
            for (k = d.child; k; ) {
              if (k === i) {
                ((b = !0), (i = d), (n = s));
                break;
              }
              if (k === n) {
                ((b = !0), (n = d), (i = s));
                break;
              }
              k = k.sibling;
            }
            if (!b) throw Error(o(189));
          }
        }
        if (i.alternate !== n) throw Error(o(190));
      }
      if (i.tag !== 3) throw Error(o(188));
      return i.stateNode.current === i ? a : r;
    }
    function w(a) {
      var r = a.tag;
      if (r === 5 || r === 26 || r === 27 || r === 6) return a;
      for (a = a.child; a !== null; ) {
        if (((r = w(a)), r !== null)) return r;
        a = a.sibling;
      }
      return null;
    }
    function v(a, r, i, n, s, d) {
      for (; a !== null; ) {
        if (
          ((a.tag === 5 || a.tag === 27 || a.tag === 6) && i(a, n, s, d)) ||
          ((a.tag !== 22 || a.memoizedState === null) &&
            (r || (a.tag !== 5 && a.tag !== 27)) &&
            v(a.child, r, i, n, s, d))
        )
          return !0;
        a = a.sibling;
      }
      return !1;
    }
    function T(a) {
      for (a = a.return; a !== null; ) {
        if (a.tag === 3 || a.tag === 5 || a.tag === 27) return a;
        a = a.return;
      }
      return null;
    }
    function S(a) {
      var r = !1;
      for (
        a = a.return;
        a !== null &&
        (a.tag === 4 && (r = !0),
        !(a.tag === 3 || a.tag === 5 || a.tag === 27));

      )
        a = a.return;
      return r;
    }
    function p(a) {
      var r = [null, null],
        i = T(a);
      return (i === null || j(r, a, i.child, { foundSelf: !1 }), r);
    }
    function j(a, r, i, n) {
      for (; i !== null; ) {
        if (i === r) n.foundSelf = !0;
        else if (i.tag === 5 || i.tag === 27 || i.tag === 6) {
          if (n.foundSelf) return ((a[1] = i), !0);
          a[0] = i;
        } else if (
          (i.tag !== 22 || i.memoizedState === null) &&
          j(a, r, i.child, n)
        )
          return !0;
        i = i.sibling;
      }
      return !1;
    }
    function P(a) {
      switch (a.tag) {
        case 5:
        case 27:
        case 6:
          return a.stateNode;
        case 3:
          return a.stateNode.containerInfo;
        default:
          throw Error(o(559));
      }
    }
    var A = null,
      x = null;
    function M(a, r, i) {
      return a === i ? !0 : a === r ? ((A = a), !0) : !1;
    }
    function $(a, r, i) {
      return a === i
        ? ((x = a), !1)
        : a === r
          ? (x !== null && (A = a), !0)
          : !1;
    }
    function z(a) {
      if (a === null) return null;
      do a = a === null ? null : a.return;
      while (a && a.tag !== 5 && a.tag !== 27 && a.tag !== 3);
      return a || null;
    }
    function K(a, r, i) {
      for (var n = 0, s = a; s; s = i(s)) n++;
      s = 0;
      for (var d = r; d; d = i(d)) s++;
      for (; 0 < n - s; ) ((a = i(a)), n--);
      for (; 0 < s - n; ) ((r = i(r)), s--);
      for (; n--; ) {
        if (a === r || (r !== null && a === r.alternate)) return a;
        ((a = i(a)), (r = i(r)));
      }
      return null;
    }
    var V = Object.assign,
      O = Symbol.for("react.element"),
      _ = Symbol.for("react.transitional.element"),
      se = Symbol.for("react.portal"),
      ue = Symbol.for("react.fragment"),
      N = Symbol.for("react.strict_mode"),
      Ee = Symbol.for("react.profiler"),
      ne = Symbol.for("react.consumer"),
      ke = Symbol.for("react.context"),
      G = Symbol.for("react.forward_ref"),
      de = Symbol.for("react.suspense"),
      W = Symbol.for("react.suspense_list"),
      le = Symbol.for("react.memo"),
      te = Symbol.for("react.lazy"),
      oe = Symbol.for("react.activity"),
      Ne = Symbol.for("react.legacy_hidden"),
      X = Symbol.for("react.memo_cache_sentinel"),
      C = Symbol.for("react.view_transition"),
      I = Symbol.for("react.recoverable"),
      be = Symbol.iterator;
    function Me(a) {
      return a === null || typeof a != "object"
        ? null
        : ((a = (be && a[be]) || a["@@iterator"]),
          typeof a == "function" ? a : null);
    }
    var Te = Symbol.for("react.client.reference");
    function Fe(a) {
      if (a == null) return null;
      if (typeof a == "function")
        return a.$$typeof === Te ? null : a.displayName || a.name || null;
      if (typeof a == "string") return a;
      switch (a) {
        case ue:
          return "Fragment";
        case Ee:
          return "Profiler";
        case N:
          return "StrictMode";
        case de:
          return "Suspense";
        case W:
          return "SuspenseList";
        case oe:
          return "Activity";
        case C:
          return "ViewTransition";
      }
      if (typeof a == "object")
        switch (a.$$typeof) {
          case se:
            return "Portal";
          case ke:
            return a.displayName || "Context";
          case ne:
            return (a._context.displayName || "Context") + ".Consumer";
          case G:
            var r = a.render;
            return (
              (a = a.displayName),
              a ||
                ((a = r.displayName || r.name || ""),
                (a = a !== "" ? "ForwardRef(" + a + ")" : "ForwardRef")),
              a
            );
          case le:
            return (
              (r = a.displayName || null),
              r !== null ? r : Fe(a.type) || "Memo"
            );
          case te:
            ((r = a._payload), (a = a._init));
            try {
              return Fe(a(r));
            } catch {}
        }
      return null;
    }
    var _e = Array.isArray,
      xe = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      Ue = l.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      $a = { pending: !1, data: null, method: null, action: null },
      Ie = [],
      ee = -1;
    function He(a) {
      return { current: a };
    }
    function Sa(a) {
      0 > ee || ((a.current = Ie[ee]), (Ie[ee] = null), ee--);
    }
    function oa(a, r) {
      (ee++, (Ie[ee] = a.current), (a.current = r));
    }
    var ga = He(null),
      we = He(null),
      je = He(null),
      Be = He(null);
    function Se(a, r) {
      switch ((oa(je, r), oa(we, a), oa(ga, null), r.nodeType)) {
        case 9:
        case 11:
          a = (a = r.documentElement) && (a = a.namespaceURI) ? ph(a) : 0;
          break;
        default:
          if (((a = r.tagName), (r = r.namespaceURI)))
            ((r = ph(r)), (a = gh(r, a)));
          else
            switch (a) {
              case "svg":
                a = 1;
                break;
              case "math":
                a = 2;
                break;
              default:
                a = 0;
            }
      }
      (Sa(ga), oa(ga, a));
    }
    function Ae() {
      (Sa(ga), Sa(we), Sa(je));
    }
    function fa(a) {
      var r = a.memoizedState;
      (r !== null && ((li._currentValue = r.memoizedState), oa(Be, a)),
        (r = ga.current));
      var i = gh(r, a.type);
      r !== i && (oa(we, a), oa(ga, i));
    }
    function Oe(a) {
      (we.current === a && (Sa(ga), Sa(we)),
        Be.current === a && (Sa(Be), (li._currentValue = $a)));
    }
    var Wa, Ve;
    function ra(a) {
      if (Wa === void 0)
        try {
          throw Error();
        } catch (i) {
          var r = i.stack.trim().match(/\n( *(at )?)/);
          ((Wa = (r && r[1]) || ""),
            (Ve =
              -1 <
              i.stack.indexOf(`
    at`)
                ? " (<anonymous>)"
                : -1 < i.stack.indexOf("@")
                  ? "@unknown:0:0"
                  : ""));
        }
      return (
        `
` +
        Wa +
        a +
        Ve
      );
    }
    var ct = !1;
    function _t(a, r) {
      if (!a || ct) return "";
      ct = !0;
      var i = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var n = {
          DetermineComponentFrameRoot: function () {
            try {
              if (r) {
                var pe = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(pe.prototype, "props", {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == "object" && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(pe, []);
                  } catch (Le) {
                    var B = Le;
                  }
                  Reflect.construct(a, [], pe);
                } else {
                  try {
                    pe.call();
                  } catch (Le) {
                    B = Le;
                  }
                  pe = !1;
                  try {
                    var Z = Object.getOwnPropertyDescriptor(
                      a.prototype,
                      "props",
                    );
                    (Object.defineProperty(a.prototype, "props", {
                      configurable: !0,
                      set: function () {
                        throw Error();
                      },
                    }),
                      (pe = !0),
                      new a());
                  } finally {
                    pe &&
                      (Z !== void 0
                        ? Object.defineProperty(a.prototype, "props", Z)
                        : delete a.prototype.props);
                  }
                }
              } else {
                try {
                  throw Error();
                } catch (Le) {
                  B = Le;
                }
                (pe = a()) &&
                  typeof pe.catch == "function" &&
                  pe.catch(function () {});
              }
            } catch (Le) {
              if (Le && B && typeof Le.stack == "string")
                return [Le.stack, B.stack];
            }
            return [null, null];
          },
        };
        n.DetermineComponentFrameRoot.displayName =
          "DetermineComponentFrameRoot";
        var s = Object.getOwnPropertyDescriptor(
          n.DetermineComponentFrameRoot,
          "name",
        );
        s &&
          s.configurable &&
          Object.defineProperty(n.DetermineComponentFrameRoot, "name", {
            value: "DetermineComponentFrameRoot",
          });
        var d = n.DetermineComponentFrameRoot(),
          b = d[0],
          k = d[1];
        if (b && k) {
          var R = b.split(`
`),
            Y = k.split(`
`);
          for (
            s = n = 0;
            n < R.length && !R[n].includes("DetermineComponentFrameRoot");

          )
            n++;
          for (
            ;
            s < Y.length && !Y[s].includes("DetermineComponentFrameRoot");

          )
            s++;
          if (n === R.length || s === Y.length)
            for (
              n = R.length - 1, s = Y.length - 1;
              1 <= n && 0 <= s && R[n] !== Y[s];

            )
              s--;
          for (; 1 <= n && 0 <= s; n--, s--)
            if (R[n] !== Y[s]) {
              if (n !== 1 || s !== 1)
                do
                  if ((n--, s--, 0 > s || R[n] !== Y[s])) {
                    var ae =
                      `
` + R[n].replace(" at new ", " at ");
                    return (
                      a.displayName &&
                        ae.includes("<anonymous>") &&
                        (ae = ae.replace("<anonymous>", a.displayName)),
                      ae
                    );
                  }
                while (1 <= n && 0 <= s);
              break;
            }
        }
      } finally {
        ((ct = !1), (Error.prepareStackTrace = i));
      }
      return (i = a ? a.displayName || a.name : "") ? ra(i) : "";
    }
    function qr(a, r) {
      switch (a.tag) {
        case 26:
        case 27:
        case 5:
          return ra(a.type);
        case 16:
          return ra("Lazy");
        case 13:
          return a.child !== r && r !== null
            ? ra("Suspense Fallback")
            : ra("Suspense");
        case 19:
          return ra("SuspenseList");
        case 0:
        case 15:
          return _t(a.type, !1);
        case 11:
          return _t(a.type.render, !1);
        case 1:
          return _t(a.type, !0);
        case 31:
          return ra("Activity");
        case 30:
          return ra("ViewTransition");
        default:
          return "";
      }
    }
    function zo(a) {
      try {
        var r = "",
          i = null;
        do ((r += qr(a, i)), (i = a), (a = a.return));
        while (a);
        return r;
      } catch (n) {
        return (
          `
Error generating stack: ` +
          n.message +
          `
` +
          n.stack
        );
      }
    }
    var Lo = Object.prototype.hasOwnProperty,
      tr = e.unstable_scheduleCallback,
      So = e.unstable_cancelCallback,
      We = e.unstable_shouldYield,
      Aa = e.unstable_requestPaint,
      ma = e.unstable_now,
      Ya = e.unstable_getCurrentPriorityLevel,
      ko = e.unstable_ImmediatePriority,
      or = e.unstable_UserBlockingPriority,
      Br = e.unstable_NormalPriority,
      Da = e.unstable_LowPriority,
      Zt = e.unstable_IdlePriority,
      yl = e.log,
      pn = e.unstable_setDisableYieldValue,
      Oa = null,
      At = null;
    function Et(a) {
      if (
        (typeof yl == "function" && pn(a),
        At && typeof At.setStrictMode == "function")
      )
        try {
          At.setStrictMode(Oa, a);
        } catch {}
    }
    var Ka = Math.clz32 ? Math.clz32 : wl,
      oc = Math.log,
      vl = Math.LN2;
    function wl(a) {
      return ((a >>>= 0), a === 0 ? 32 : (31 - ((oc(a) / vl) | 0)) | 0);
    }
    var rr = 256,
      lr = 262144,
      ve = 4194304;
    function Qt(a) {
      var r = a & 42;
      if (r !== 0) return r;
      switch (a & -a) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return a & -a;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return a & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return a & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return a;
      }
    }
    function ir(a, r, i) {
      var n = a.pendingLanes;
      if (n === 0) return 0;
      var s = 0,
        d = a.suspendedLanes,
        b = a.pingedLanes;
      a = a.warmLanes;
      var k = n & 134217727;
      return (
        k !== 0
          ? ((n = k & ~d),
            n !== 0
              ? (s = Qt(n))
              : ((b &= k),
                b !== 0
                  ? (s = Qt(b))
                  : i || ((i = k & ~a), i !== 0 && (s = Qt(i)))))
          : ((k = n & ~d),
            k !== 0
              ? (s = Qt(k))
              : b !== 0
                ? (s = Qt(b))
                : i || ((i = n & ~a), i !== 0 && (s = Qt(i)))),
        s === 0
          ? 0
          : r !== 0 &&
              r !== s &&
              (r & d) === 0 &&
              ((d = s & -s),
              (i = r & -r),
              d >= i || (d === 32 && (i & 4194048) !== 0))
            ? r
            : s
      );
    }
    function Vr(a, r) {
      return (a.pendingLanes & ~(a.suspendedLanes & ~a.pingedLanes) & r) === 0;
    }
    function gn(a, r) {
      (r & 8) !== 0 && (r |= r & 32);
      var i = a.entangledLanes;
      if (i !== 0)
        for (a = a.entanglements, i &= r; 0 < i; ) {
          var n = 31 - Ka(i),
            s = 1 << n;
          ((r |= a[n]), (i &= ~s));
        }
      return r;
    }
    function rc(a, r) {
      switch (a) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return r + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return r + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function bn() {
      var a = ve;
      return ((ve <<= 1), (ve & 62914560) === 0 && (ve = 4194304), a);
    }
    function bi(a) {
      for (var r = [], i = 0; 31 > i; i++) r.push(a);
      return r;
    }
    function Ut(a, r) {
      ((a.pendingLanes |= r),
        r !== 268435456 &&
          ((a.suspendedLanes = 0), (a.pingedLanes = 0), (a.warmLanes = 0)));
    }
    function lc(a, r, i, n, s, d) {
      var b = a.pendingLanes;
      ((a.pendingLanes = i),
        (a.suspendedLanes = 0),
        (a.pingedLanes = 0),
        (a.warmLanes = 0),
        (a.expiredLanes &= i),
        (a.entangledLanes &= i),
        (a.errorRecoveryDisabledLanes &= i),
        (a.shellSuspendCounter = 0));
      var k = a.entanglements,
        R = a.expirationTimes,
        Y = a.hiddenUpdates;
      for (i = b & ~i; 0 < i; ) {
        var ae = 31 - Ka(i),
          pe = 1 << ae;
        ((k[ae] = 0), (R[ae] = -1));
        var B = Y[ae];
        if (B !== null)
          for (Y[ae] = null, ae = 0; ae < B.length; ae++) {
            var Z = B[ae];
            Z !== null && (Z.lane &= -536870913);
          }
        i &= ~pe;
      }
      (n !== 0 && Ur(a, n, 0),
        d !== 0 &&
          s === 0 &&
          a.tag !== 0 &&
          (a.suspendedLanes |= d & ~(b & ~r)));
    }
    function Ur(a, r, i) {
      ((a.pendingLanes |= r), (a.suspendedLanes &= ~r));
      var n = 31 - Ka(r);
      ((a.entangledLanes |= r),
        (a.entanglements[n] = a.entanglements[n] | 1073741824 | (i & 261930)));
    }
    function Oo(a, r) {
      var i = (a.entangledLanes |= r);
      for (a = a.entanglements; i; ) {
        var n = 31 - Ka(i),
          s = 1 << n;
        ((s & r) | (a[n] & r) && (a[n] |= r), (i &= ~s));
      }
    }
    function nr(a, r) {
      var i = r & -r;
      return (
        (i = (i & 42) !== 0 ? 1 : $r(i)),
        (i & (a.suspendedLanes | r)) !== 0 ? 0 : i
      );
    }
    function $r(a) {
      switch (a) {
        case 2:
          a = 1;
          break;
        case 8:
          a = 4;
          break;
        case 32:
          a = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          a = 128;
          break;
        case 268435456:
          a = 134217728;
          break;
        default:
          a = 0;
      }
      return a;
    }
    function yi(a) {
      return (
        (a &= -a),
        2 < a ? (8 < a ? ((a & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
      );
    }
    function sr() {
      var a = Ue.p;
      return a !== 0 ? a : ((a = window.event), a === void 0 ? 32 : Jh(a.type));
    }
    function Tl(a, r) {
      var i = Ue.p;
      try {
        return ((Ue.p = a), r());
      } finally {
        Ue.p = i;
      }
    }
    var mo = Math.random().toString(36).slice(2),
      dt = "__reactFiber$" + mo,
      ut = "__reactProps$" + mo,
      cr = "__reactContainer$" + mo,
      Sl = "__reactEvents$" + mo,
      ic = "__reactListeners$" + mo,
      qo = "__reactHandles$" + mo,
      Yr = "__reactResources$" + mo,
      Mo = "__reactMarker$" + mo,
      dr = "__reactLoad$" + mo;
    function Gr(a) {
      (delete a[dt], delete a[ut], delete a[ic], delete a[qo]);
    }
    function Bo(a) {
      var r;
      if ((r = a[dt])) return r;
      for (var i = a.parentNode; i; ) {
        if ((r = i[cr] || i[dt])) {
          if (
            ((i = r.alternate),
            r.child !== null || (i !== null && i.child !== null))
          )
            for (a = xh(a); a !== null; ) {
              if ((i = a[dt])) return i;
              a = xh(a);
            }
          return r;
        }
        ((a = i), (i = a.parentNode));
      }
      return null;
    }
    function Ga(a) {
      if ((a = a[dt] || a[cr])) {
        var r = a.tag;
        if (
          r === 5 ||
          r === 6 ||
          r === 13 ||
          r === 31 ||
          r === 26 ||
          r === 27 ||
          r === 3
        )
          return a;
      }
      return null;
    }
    function ur(a) {
      var r = a.tag;
      if (r === 5 || r === 26 || r === 27 || r === 6) return a.stateNode;
      throw Error(o(33));
    }
    function Vo(a) {
      var r = a[Yr];
      return (
        r ||
          (r = a[Yr] =
            { hoistableStyles: new Map(), hoistableScripts: new Map() }),
        r
      );
    }
    function at(a) {
      a[Mo] = !0;
    }
    function vi(a) {
      a[dr] = void 0;
    }
    var wi = new Set(),
      Ti = {};
    function Co(a, r) {
      (Uo(a, r), Uo(a + "Capture", r));
    }
    function Uo(a, r) {
      for (Ti[a] = r, a = 0; a < r.length; a++) wi.add(r[a]);
    }
    var E = RegExp(
        "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
      ),
      D = {},
      Q = {};
    function q(a) {
      return Lo.call(Q, a)
        ? !0
        : Lo.call(D, a)
          ? !1
          : E.test(a)
            ? (Q[a] = !0)
            : ((D[a] = !0), !1);
    }
    var F = !1;
    function ie() {
      var a = F;
      return ((F = !1), a);
    }
    function ge(a, r, i) {
      if (q(r))
        if (i === null) a.removeAttribute(r);
        else {
          switch (typeof i) {
            case "undefined":
            case "function":
            case "symbol":
              a.removeAttribute(r);
              return;
            case "boolean":
              var n = r.toLowerCase().slice(0, 5);
              if (n !== "data-" && n !== "aria-") {
                a.removeAttribute(r);
                return;
              }
          }
          a.setAttribute(r, i);
        }
    }
    function re(a, r, i) {
      if (i === null) a.removeAttribute(r);
      else {
        switch (typeof i) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            a.removeAttribute(r);
            return;
        }
        a.setAttribute(r, i);
      }
    }
    function me(a, r, i, n) {
      if (n === null) a.removeAttribute(i);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            a.removeAttribute(i);
            return;
        }
        a.setAttributeNS(r, i, n);
      }
    }
    function ce(a) {
      switch (typeof a) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return a;
        case "object":
          return a;
        default:
          return "";
      }
    }
    function Re(a) {
      var r = a.type;
      return (
        (a = a.nodeName) &&
        a.toLowerCase() === "input" &&
        (r === "checkbox" || r === "radio")
      );
    }
    function Ce(a, r, i) {
      var n = Object.getOwnPropertyDescriptor(a.constructor.prototype, r);
      if (
        !a.hasOwnProperty(r) &&
        typeof n < "u" &&
        typeof n.get == "function" &&
        typeof n.set == "function"
      ) {
        var s = n.get,
          d = n.set;
        return (
          Object.defineProperty(a, r, {
            configurable: !0,
            get: function () {
              return s.call(this);
            },
            set: function (b) {
              ((i = "" + b), d.call(this, b));
            },
          }),
          Object.defineProperty(a, r, { enumerable: n.enumerable }),
          {
            getValue: function () {
              return i;
            },
            setValue: function (b) {
              i = "" + b;
            },
            stopTracking: function () {
              ((a._valueTracker = null), delete a[r]);
            },
          }
        );
      }
    }
    function ze(a) {
      if (!a._valueTracker) {
        var r = Re(a) ? "checked" : "value";
        a._valueTracker = Ce(a, r, "" + a[r]);
      }
    }
    function la(a) {
      if (!a) return !1;
      var r = a._valueTracker;
      if (!r) return !0;
      var i = r.getValue(),
        n = "";
      return (
        a && (n = Re(a) ? (a.checked ? "true" : "false") : a.value),
        (a = n),
        a !== i ? (r.setValue(a), !0) : !1
      );
    }
    var na = /[\n"\\]/g;
    function ia(a) {
      return a.replace(na, function (r) {
        return "\\" + r.charCodeAt(0).toString(16) + " ";
      });
    }
    function Je(a, r, i, n, s, d, b, k) {
      ((a.name = ""),
        b != null &&
        typeof b != "function" &&
        typeof b != "symbol" &&
        typeof b != "boolean"
          ? (a.type = b)
          : a.removeAttribute("type"),
        r != null
          ? b === "number"
            ? ((r === 0 && a.value === "") || a.value != r) &&
              (a.value = "" + ce(r))
            : a.value !== "" + ce(r) && (a.value = "" + ce(r))
          : (b !== "submit" && b !== "reset") || a.removeAttribute("value"),
        r != null
          ? b === "number" && a.value == r
            ? $e(a, ce(a.value))
            : $e(a, ce(r))
          : i != null
            ? $e(a, ce(i))
            : n != null && a.removeAttribute("value"),
        s == null && d != null && (a.defaultChecked = !!d),
        s != null &&
          (a.checked = s && typeof s != "function" && typeof s != "symbol"),
        k != null &&
        typeof k != "function" &&
        typeof k != "symbol" &&
        typeof k != "boolean"
          ? (a.name = "" + ce(k))
          : a.removeAttribute("name"));
    }
    function he(a, r, i, n, s, d, b, k) {
      if (
        (d != null &&
          typeof d != "function" &&
          typeof d != "symbol" &&
          typeof d != "boolean" &&
          (a.type = d),
        r != null || i != null)
      ) {
        if (!((d !== "submit" && d !== "reset") || r != null)) {
          ze(a);
          return;
        }
        ((i = i != null ? "" + ce(i) : ""),
          (r = r != null ? "" + ce(r) : i),
          k || r === a.value || (a.value = r),
          (a.defaultValue = r));
      }
      ((n = n ?? s),
        (n = typeof n != "function" && typeof n != "symbol" && !!n),
        (a.checked = k ? a.checked : !!n),
        (a.defaultChecked = !!n),
        b != null &&
          typeof b != "function" &&
          typeof b != "symbol" &&
          typeof b != "boolean" &&
          (a.name = b),
        ze(a));
    }
    function $e(a, r) {
      a.defaultValue !== "" + r && (a.defaultValue = "" + r);
    }
    function da(a, r, i, n) {
      if (((a = a.options), r)) {
        r = {};
        for (var s = 0; s < i.length; s++) r["$" + i[s]] = !0;
        for (i = 0; i < a.length; i++)
          ((s = r.hasOwnProperty("$" + a[i].value)),
            a[i].selected !== s && (a[i].selected = s),
            s && n && (a[i].defaultSelected = !0));
      } else {
        for (i = "" + ce(i), r = null, s = 0; s < a.length; s++) {
          if (a[s].value === i) {
            ((a[s].selected = !0), n && (a[s].defaultSelected = !0));
            return;
          }
          r !== null || a[s].disabled || (r = a[s]);
        }
        r !== null && (r.selected = !0);
      }
    }
    function Ye(a, r, i) {
      if (
        r != null &&
        ((r = "" + ce(r)), r !== a.value && (a.value = r), i == null)
      ) {
        a.defaultValue !== r && (a.defaultValue = r);
        return;
      }
      a.defaultValue = i != null ? "" + ce(i) : "";
    }
    function Ge(a, r, i, n) {
      if (r == null) {
        if (n != null) {
          if (i != null) throw Error(o(92));
          if (_e(n)) {
            if (1 < n.length) throw Error(o(93));
            n = n[0];
          }
          i = n;
        }
        (i == null && (i = ""), (r = i));
      }
      ((i = ce(r)),
        (a.defaultValue = i),
        (n = a.textContent),
        n === i && n !== "" && n !== null && (a.value = n),
        ze(a));
    }
    function Pe(a, r) {
      if (r) {
        var i = a.firstChild;
        if (i && i === a.lastChild && i.nodeType === 3) {
          i.nodeValue = r;
          return;
        }
      }
      a.textContent = r;
    }
    var aa = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " ",
      ),
    );
    function Ke(a, r, i) {
      var n = r.indexOf("--") === 0;
      i == null || typeof i == "boolean" || i === ""
        ? n
          ? a.setProperty(r, "")
          : r === "float"
            ? (a.cssFloat = "")
            : (a[r] = "")
        : n
          ? a.setProperty(r, i)
          : typeof i != "number" || i === 0 || aa.has(r)
            ? r === "float"
              ? (a.cssFloat = i)
              : (a[r] = ("" + i).trim())
            : (a[r] = i + "px");
    }
    function De(a, r, i) {
      if (r != null && typeof r != "object") throw Error(o(62));
      if (((a = a.style), i != null)) {
        for (var n in i)
          !i.hasOwnProperty(n) ||
            (r != null && r.hasOwnProperty(n)) ||
            (n.indexOf("--") === 0
              ? a.setProperty(n, "")
              : n === "float"
                ? (a.cssFloat = "")
                : (a[n] = ""),
            (F = !0));
        for (var s in r)
          ((n = r[s]),
            r.hasOwnProperty(s) && i[s] !== n && (Ke(a, s, n), (F = !0)));
      } else for (var d in r) r.hasOwnProperty(d) && Ke(a, d, r[d]);
    }
    function qe(a) {
      if (a.indexOf("-") === -1) return !1;
      switch (a) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var Ze = new Map([
        ["acceptCharset", "accept-charset"],
        ["htmlFor", "for"],
        ["httpEquiv", "http-equiv"],
        ["crossOrigin", "crossorigin"],
        ["accentHeight", "accent-height"],
        ["alignmentBaseline", "alignment-baseline"],
        ["arabicForm", "arabic-form"],
        ["baselineShift", "baseline-shift"],
        ["capHeight", "cap-height"],
        ["clipPath", "clip-path"],
        ["clipRule", "clip-rule"],
        ["colorInterpolation", "color-interpolation"],
        ["colorInterpolationFilters", "color-interpolation-filters"],
        ["colorProfile", "color-profile"],
        ["colorRendering", "color-rendering"],
        ["dominantBaseline", "dominant-baseline"],
        ["enableBackground", "enable-background"],
        ["fillOpacity", "fill-opacity"],
        ["fillRule", "fill-rule"],
        ["floodColor", "flood-color"],
        ["floodOpacity", "flood-opacity"],
        ["fontFamily", "font-family"],
        ["fontSize", "font-size"],
        ["fontSizeAdjust", "font-size-adjust"],
        ["fontStretch", "font-stretch"],
        ["fontStyle", "font-style"],
        ["fontVariant", "font-variant"],
        ["fontWeight", "font-weight"],
        ["glyphName", "glyph-name"],
        ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
        ["glyphOrientationVertical", "glyph-orientation-vertical"],
        ["horizAdvX", "horiz-adv-x"],
        ["horizOriginX", "horiz-origin-x"],
        ["imageRendering", "image-rendering"],
        ["letterSpacing", "letter-spacing"],
        ["lightingColor", "lighting-color"],
        ["markerEnd", "marker-end"],
        ["markerMid", "marker-mid"],
        ["markerStart", "marker-start"],
        ["maskType", "mask-type"],
        ["overlinePosition", "overline-position"],
        ["overlineThickness", "overline-thickness"],
        ["paintOrder", "paint-order"],
        ["panose-1", "panose-1"],
        ["pointerEvents", "pointer-events"],
        ["renderingIntent", "rendering-intent"],
        ["shapeRendering", "shape-rendering"],
        ["stopColor", "stop-color"],
        ["stopOpacity", "stop-opacity"],
        ["strikethroughPosition", "strikethrough-position"],
        ["strikethroughThickness", "strikethrough-thickness"],
        ["strokeDasharray", "stroke-dasharray"],
        ["strokeDashoffset", "stroke-dashoffset"],
        ["strokeLinecap", "stroke-linecap"],
        ["strokeLinejoin", "stroke-linejoin"],
        ["strokeMiterlimit", "stroke-miterlimit"],
        ["strokeOpacity", "stroke-opacity"],
        ["strokeWidth", "stroke-width"],
        ["textAnchor", "text-anchor"],
        ["textDecoration", "text-decoration"],
        ["textRendering", "text-rendering"],
        ["transformOrigin", "transform-origin"],
        ["underlinePosition", "underline-position"],
        ["underlineThickness", "underline-thickness"],
        ["unicodeBidi", "unicode-bidi"],
        ["unicodeRange", "unicode-range"],
        ["unitsPerEm", "units-per-em"],
        ["vAlphabetic", "v-alphabetic"],
        ["vHanging", "v-hanging"],
        ["vIdeographic", "v-ideographic"],
        ["vMathematical", "v-mathematical"],
        ["vectorEffect", "vector-effect"],
        ["vertAdvY", "vert-adv-y"],
        ["vertOriginX", "vert-origin-x"],
        ["vertOriginY", "vert-origin-y"],
        ["wordSpacing", "word-spacing"],
        ["writingMode", "writing-mode"],
        ["xmlnsXlink", "xmlns:xlink"],
        ["xHeight", "x-height"],
      ]),
      sa =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Pa(a) {
      return sa.test("" + a)
        ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
        : a;
    }
    function va() {}
    var Nt = null;
    function rt(a) {
      return (
        (a = a.target || a.srcElement || window),
        a.correspondingUseElement && (a = a.correspondingUseElement),
        a.nodeType === 3 ? a.parentNode : a
      );
    }
    var ka = null,
      ht = null;
    function ho(a) {
      var r = Ga(a);
      if (r && (a = r.stateNode)) {
        var i = a[ut] || null;
        e: switch (((a = r.stateNode), r.type)) {
          case "input":
            if (
              (Je(
                a,
                i.value,
                i.defaultValue,
                i.defaultValue,
                i.checked,
                i.defaultChecked,
                i.type,
                i.name,
              ),
              (r = i.name),
              i.type === "radio" && r != null)
            ) {
              for (i = a; i.parentNode; ) i = i.parentNode;
              for (
                i = i.querySelectorAll(
                  'input[name="' + ia("" + r) + '"][type="radio"]',
                ),
                  r = 0;
                r < i.length;
                r++
              ) {
                var n = i[r];
                if (n !== a && n.form === a.form) {
                  var s = n[ut] || null;
                  if (!s) throw Error(o(90));
                  Je(
                    n,
                    s.value,
                    s.defaultValue,
                    s.defaultValue,
                    s.checked,
                    s.defaultChecked,
                    s.type,
                    s.name,
                  );
                }
              }
              for (r = 0; r < i.length; r++)
                ((n = i[r]), n.form === a.form && la(n));
            }
            break e;
          case "textarea":
            Ye(a, i.value, i.defaultValue);
            break e;
          case "select":
            ((r = i.value), r != null && da(a, !!i.multiple, r, !1));
        }
      }
    }
    var Jt = !1;
    function eo(a, r, i) {
      if (Jt) return a(r, i);
      Jt = !0;
      try {
        var n = a(r);
        return n;
      } finally {
        if (
          ((Jt = !1),
          (ka !== null || ht !== null) &&
            (ys(), ka && ((r = ka), (a = ht), (ht = ka = null), ho(r), a)))
        )
          for (r = 0; r < a.length; r++) ho(a[r]);
      }
    }
    function Rt(a, r) {
      var i = a.stateNode;
      if (i === null) return null;
      var n = i[ut] || null;
      if (n === null) return null;
      i = n[r];
      e: switch (r) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          ((n = !n.disabled) ||
            ((a = a.type),
            (n = !(
              a === "button" ||
              a === "input" ||
              a === "select" ||
              a === "textarea"
            ))),
            (a = !n));
          break e;
        default:
          a = !1;
      }
      if (a) return null;
      if (i && typeof i != "function") throw Error(o(231, r, typeof i));
      return i;
    }
    var ft = !(
        typeof window > "u" ||
        typeof window.document > "u" ||
        typeof window.document.createElement > "u"
      ),
      qa = !1;
    if (ft)
      try {
        var Xa = {};
        (Object.defineProperty(Xa, "passive", {
          get: function () {
            qa = !0;
          },
        }),
          window.addEventListener("test", Xa, Xa),
          window.removeEventListener("test", Xa, Xa));
      } catch {
        qa = !1;
      }
    var za = null,
      It = null,
      $o = null;
    function yn() {
      if ($o) return $o;
      var a,
        r = It,
        i = r.length,
        n,
        s = "value" in za ? za.value : za.textContent,
        d = s.length;
      for (a = 0; a < i && r[a] === s[a]; a++);
      var b = i - a;
      for (n = 1; n <= b && r[i - n] === s[d - n]; n++);
      return ($o = s.slice(a, 1 < n ? 1 - n : void 0));
    }
    function kl(a) {
      var r = a.keyCode;
      return (
        "charCode" in a
          ? ((a = a.charCode), a === 0 && r === 13 && (a = 13))
          : (a = r),
        a === 10 && (a = 13),
        32 <= a || a === 13 ? a : 0
      );
    }
    function Ml() {
      return !0;
    }
    function vn() {
      return !1;
    }
    function wt(a) {
      function r(i, n, s, d, b) {
        ((this._reactName = i),
          (this._targetInst = s),
          (this.type = n),
          (this.nativeEvent = d),
          (this.target = b),
          (this.currentTarget = null));
        for (var k in a)
          a.hasOwnProperty(k) && ((i = a[k]), (this[k] = i ? i(d) : d[k]));
        return (
          (this.isDefaultPrevented = (
            d.defaultPrevented != null
              ? d.defaultPrevented
              : d.returnValue === !1
          )
            ? Ml
            : vn),
          (this.isPropagationStopped = vn),
          this
        );
      }
      return (
        V(r.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var i = this.nativeEvent;
            i &&
              (i.preventDefault
                ? i.preventDefault()
                : typeof i.returnValue != "unknown" && (i.returnValue = !1),
              (this.isDefaultPrevented = Ml));
          },
          stopPropagation: function () {
            var i = this.nativeEvent;
            i &&
              (i.stopPropagation
                ? i.stopPropagation()
                : typeof i.cancelBubble != "unknown" && (i.cancelBubble = !0),
              (this.isPropagationStopped = Ml));
          },
          persist: function () {},
          isPersistent: Ml,
        }),
        r
      );
    }
    var ao = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (a) {
          return a.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      Xr = wt(ao),
      fr = V({}, ao, { view: 0, detail: 0 }),
      wn = wt(fr),
      Si,
      ki,
      Fr,
      Cl = V({}, fr, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: nc,
        button: 0,
        buttons: 0,
        relatedTarget: function (a) {
          return a.relatedTarget === void 0
            ? a.fromElement === a.srcElement
              ? a.toElement
              : a.fromElement
            : a.relatedTarget;
        },
        movementX: function (a) {
          return "movementX" in a
            ? a.movementX
            : (a !== Fr &&
                (Fr && a.type === "mousemove"
                  ? ((Si = a.screenX - Fr.screenX),
                    (ki = a.screenY - Fr.screenY))
                  : (ki = Si = 0),
                (Fr = a)),
              Si);
        },
        movementY: function (a) {
          return "movementY" in a ? a.movementY : ki;
        },
      }),
      Tn = wt(Cl),
      Sn = V({}, Cl, { dataTransfer: 0 }),
      Hr = wt(Sn),
      Mi = V({}, fr, { relatedTarget: 0 }),
      Pl = wt(Mi),
      kn = V({}, ao, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      d1 = wt(kn),
      u1 = V({}, ao, {
        clipboardData: function (a) {
          return "clipboardData" in a ? a.clipboardData : window.clipboardData;
        },
      }),
      f1 = wt(u1),
      m1 = V({}, ao, { data: 0 }),
      m0 = wt(m1),
      h1 = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified",
      },
      p1 = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta",
      },
      g1 = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey",
      };
    function b1(a) {
      var r = this.nativeEvent;
      return r.getModifierState
        ? r.getModifierState(a)
        : (a = g1[a])
          ? !!r[a]
          : !1;
    }
    function nc() {
      return b1;
    }
    var y1 = V({}, fr, {
        key: function (a) {
          if (a.key) {
            var r = h1[a.key] || a.key;
            if (r !== "Unidentified") return r;
          }
          return a.type === "keypress"
            ? ((a = kl(a)), a === 13 ? "Enter" : String.fromCharCode(a))
            : a.type === "keydown" || a.type === "keyup"
              ? p1[a.keyCode] || "Unidentified"
              : "";
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: nc,
        charCode: function (a) {
          return a.type === "keypress" ? kl(a) : 0;
        },
        keyCode: function (a) {
          return a.type === "keydown" || a.type === "keyup" ? a.keyCode : 0;
        },
        which: function (a) {
          return a.type === "keypress"
            ? kl(a)
            : a.type === "keydown" || a.type === "keyup"
              ? a.keyCode
              : 0;
        },
      }),
      v1 = wt(y1),
      w1 = V({}, Cl, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0,
      }),
      h0 = wt(w1),
      T1 = V({}, ao, { submitter: 0 }),
      S1 = wt(T1),
      k1 = V({}, fr, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: nc,
      }),
      M1 = wt(k1),
      C1 = V({}, ao, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
      P1 = wt(C1),
      _1 = V({}, Cl, {
        deltaX: function (a) {
          return "deltaX" in a
            ? a.deltaX
            : "wheelDeltaX" in a
              ? -a.wheelDeltaX
              : 0;
        },
        deltaY: function (a) {
          return "deltaY" in a
            ? a.deltaY
            : "wheelDeltaY" in a
              ? -a.wheelDeltaY
              : "wheelDelta" in a
                ? -a.wheelDelta
                : 0;
        },
        deltaZ: 0,
        deltaMode: 0,
      }),
      A1 = wt(_1),
      E1 = V({}, ao, { newState: 0, oldState: 0, source: 0 }),
      N1 = wt(E1),
      R1 = [9, 13, 27, 32],
      sc = ft && "CompositionEvent" in window,
      Ci = null;
    ft && "documentMode" in document && (Ci = document.documentMode);
    var j1 = ft && "TextEvent" in window && !Ci,
      p0 = ft && (!sc || (Ci && 8 < Ci && 11 >= Ci)),
      g0 = " ",
      b0 = !1;
    function y0(a, r) {
      switch (a) {
        case "keyup":
          return R1.indexOf(r.keyCode) !== -1;
        case "keydown":
          return r.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function v0(a) {
      return (
        (a = a.detail),
        typeof a == "object" && "data" in a ? a.data : null
      );
    }
    var _l = !1;
    function x1(a, r) {
      switch (a) {
        case "compositionend":
          return v0(r);
        case "keypress":
          return r.which !== 32 ? null : ((b0 = !0), g0);
        case "textInput":
          return ((a = r.data), a === g0 && b0 ? null : a);
        default:
          return null;
      }
    }
    function D1(a, r) {
      if (_l)
        return a === "compositionend" || (!sc && y0(a, r))
          ? ((a = yn()), ($o = It = za = null), (_l = !1), a)
          : null;
      switch (a) {
        case "paste":
          return null;
        case "keypress":
          if (
            !(r.ctrlKey || r.altKey || r.metaKey) ||
            (r.ctrlKey && r.altKey)
          ) {
            if (r.char && 1 < r.char.length) return r.char;
            if (r.which) return String.fromCharCode(r.which);
          }
          return null;
        case "compositionend":
          return p0 && r.locale !== "ko" ? null : r.data;
        default:
          return null;
      }
    }
    var I1 = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function w0(a) {
      var r = a && a.nodeName && a.nodeName.toLowerCase();
      return r === "input" ? !!I1[a.type] : r === "textarea";
    }
    function T0(a, r, i, n) {
      (ka ? (ht ? ht.push(n) : (ht = [n])) : (ka = n),
        (r = Ms(r, "onChange")),
        0 < r.length &&
          ((i = new Xr("onChange", "change", null, i, n)),
          a.push({ event: i, listeners: r })));
    }
    var Pi = null,
      _i = null;
    function z1(a) {
      ch(a, 0);
    }
    function Mn(a) {
      var r = ur(a);
      if (la(r)) return a;
    }
    function S0(a, r) {
      if (a === "change") return r;
    }
    var k0 = !1;
    if (ft) {
      var cc;
      if (ft) {
        var dc = "oninput" in document;
        if (!dc) {
          var M0 = document.createElement("div");
          (M0.setAttribute("oninput", "return;"),
            (dc = typeof M0.oninput == "function"));
        }
        cc = dc;
      } else cc = !1;
      k0 = cc && (!document.documentMode || 9 < document.documentMode);
    }
    function C0() {
      Pi && (Pi.detachEvent("onpropertychange", P0), (_i = Pi = null));
    }
    function P0(a) {
      if (a.propertyName === "value" && Mn(_i)) {
        var r = [];
        (T0(r, _i, a, rt(a)), eo(z1, r));
      }
    }
    function L1(a, r, i) {
      a === "focusin"
        ? (C0(), (Pi = r), (_i = i), Pi.attachEvent("onpropertychange", P0))
        : a === "focusout" && C0();
    }
    function O1(a) {
      if (a === "selectionchange" || a === "keyup" || a === "keydown")
        return Mn(_i);
    }
    function q1(a, r) {
      if (a === "click") return Mn(r);
    }
    function B1(a, r) {
      if (a === "input" || a === "change") return Mn(r);
    }
    function V1(a, r) {
      return (a === r && (a !== 0 || 1 / a === 1 / r)) || (a !== a && r !== r);
    }
    var $t = typeof Object.is == "function" ? Object.is : V1;
    function Ai(a, r) {
      if ($t(a, r)) return !0;
      if (
        typeof a != "object" ||
        a === null ||
        typeof r != "object" ||
        r === null
      )
        return !1;
      var i = Object.keys(a),
        n = Object.keys(r);
      if (i.length !== n.length) return !1;
      for (n = 0; n < i.length; n++) {
        var s = i[n];
        if (!Lo.call(r, s) || !$t(a[s], r[s])) return !1;
      }
      return !0;
    }
    function uc(a) {
      if (
        ((a = a || (typeof document < "u" ? document : void 0)), typeof a > "u")
      )
        return null;
      try {
        return a.activeElement || a.body;
      } catch {
        return a.body;
      }
    }
    function _0(a) {
      for (; a && a.firstChild; ) a = a.firstChild;
      return a;
    }
    function A0(a, r) {
      var i = _0(a);
      a = 0;
      for (var n; i; ) {
        if (i.nodeType === 3) {
          if (((n = a + i.textContent.length), a <= r && n >= r))
            return { node: i, offset: r - a };
          a = n;
        }
        e: {
          for (; i; ) {
            if (i.nextSibling) {
              i = i.nextSibling;
              break e;
            }
            i = i.parentNode;
          }
          i = void 0;
        }
        i = _0(i);
      }
    }
    function E0(a, r) {
      return a && r
        ? a === r
          ? !0
          : a && a.nodeType === 3
            ? !1
            : r && r.nodeType === 3
              ? E0(a, r.parentNode)
              : "contains" in a
                ? a.contains(r)
                : a.compareDocumentPosition
                  ? !!(a.compareDocumentPosition(r) & 16)
                  : !1
        : !1;
    }
    function N0(a) {
      a =
        a != null &&
        a.ownerDocument != null &&
        a.ownerDocument.defaultView != null
          ? a.ownerDocument.defaultView
          : window;
      for (var r = uc(a.document); r instanceof a.HTMLIFrameElement; ) {
        try {
          var i = typeof r.contentWindow.location.href == "string";
        } catch {
          i = !1;
        }
        if (i) a = r.contentWindow;
        else break;
        r = uc(a.document);
      }
      return r;
    }
    function fc(a) {
      var r = a && a.nodeName && a.nodeName.toLowerCase();
      return (
        r &&
        ((r === "input" &&
          (a.type === "text" ||
            a.type === "search" ||
            a.type === "tel" ||
            a.type === "url" ||
            a.type === "password")) ||
          r === "textarea" ||
          a.contentEditable === "true")
      );
    }
    var U1 = ft && "documentMode" in document && 11 >= document.documentMode,
      Al = null,
      mc = null,
      Ei = null,
      hc = !1;
    function R0(a, r, i) {
      var n =
        i.window === i ? i.document : i.nodeType === 9 ? i : i.ownerDocument;
      hc ||
        Al == null ||
        Al !== uc(n) ||
        ((n = Al),
        "selectionStart" in n && fc(n)
          ? (n = { start: n.selectionStart, end: n.selectionEnd })
          : ((n = (
              (n.ownerDocument && n.ownerDocument.defaultView) ||
              window
            ).getSelection()),
            (n = {
              anchorNode: n.anchorNode,
              anchorOffset: n.anchorOffset,
              focusNode: n.focusNode,
              focusOffset: n.focusOffset,
            })),
        (Ei && Ai(Ei, n)) ||
          ((Ei = n),
          (n = Ms(mc, "onSelect")),
          0 < n.length &&
            ((r = new Xr("onSelect", "select", null, r, i)),
            a.push({ event: r, listeners: n }),
            (r.target = Al))));
    }
    function Wr(a, r) {
      var i = {};
      return (
        (i[a.toLowerCase()] = r.toLowerCase()),
        (i["Webkit" + a] = "webkit" + r),
        (i["Moz" + a] = "moz" + r),
        i
      );
    }
    var El = {
        animationend: Wr("Animation", "AnimationEnd"),
        animationiteration: Wr("Animation", "AnimationIteration"),
        animationstart: Wr("Animation", "AnimationStart"),
        transitionrun: Wr("Transition", "TransitionRun"),
        transitionstart: Wr("Transition", "TransitionStart"),
        transitioncancel: Wr("Transition", "TransitionCancel"),
        transitionend: Wr("Transition", "TransitionEnd"),
      },
      pc = {},
      j0 = {};
    ft &&
      ((j0 = document.createElement("div").style),
      "AnimationEvent" in window ||
        (delete El.animationend.animation,
        delete El.animationiteration.animation,
        delete El.animationstart.animation),
      "TransitionEvent" in window || delete El.transitionend.transition);
    function Kr(a) {
      if (pc[a]) return pc[a];
      if (!El[a]) return a;
      var r = El[a],
        i;
      for (i in r) if (r.hasOwnProperty(i) && i in j0) return (pc[a] = r[i]);
      return a;
    }
    var x0 = Kr("animationend"),
      D0 = Kr("animationiteration"),
      I0 = Kr("animationstart"),
      $1 = Kr("transitionrun"),
      Y1 = Kr("transitionstart"),
      G1 = Kr("transitioncancel"),
      z0 = Kr("transitionend"),
      L0 = new Map(),
      gc =
        "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
          " ",
        );
    gc.push("scrollEnd");
    function po(a, r) {
      (L0.set(a, r), Co(r, [a]));
    }
    var X1 = 0;
    function Yo(a, r) {
      if (a.name != null && a.name !== "auto") return a.name;
      if (r.autoName !== null) return r.autoName;
      a = vo.identifierPrefix;
      var i = X1++;
      return ((a = "_" + a + "t_" + i.toString(32) + "_"), (r.autoName = a));
    }
    function O0(a) {
      if (a == null || typeof a == "string") return a;
      var r = null,
        i = Wl;
      if (i !== null)
        for (var n = 0; n < i.length; n++) {
          var s = a[i[n]];
          if (s != null) {
            if (s === "none") return "none";
            r = r == null ? s : r + (" " + s);
          }
        }
      return r ?? a.default;
    }
    function Go(a, r) {
      return (
        (a = O0(a)),
        (r = O0(r)),
        r == null ? (a === "auto" ? null : a) : r === "auto" ? null : r
      );
    }
    var Cn =
        typeof reportError == "function"
          ? reportError
          : function (a) {
              if (
                typeof window == "object" &&
                typeof window.ErrorEvent == "function"
              ) {
                var r = new window.ErrorEvent("error", {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof a == "object" &&
                    a !== null &&
                    typeof a.message == "string"
                      ? String(a.message)
                      : String(a),
                  error: a,
                });
                if (!window.dispatchEvent(r)) return;
              } else if (
                typeof process == "object" &&
                typeof process.emit == "function"
              ) {
                process.emit("uncaughtException", a);
                return;
              }
              console.error(a);
            },
      to = [],
      Nl = 0,
      bc = 0;
    function Pn() {
      for (var a = Nl, r = (bc = Nl = 0); r < a; ) {
        var i = to[r];
        to[r++] = null;
        var n = to[r];
        to[r++] = null;
        var s = to[r];
        to[r++] = null;
        var d = to[r];
        if (((to[r++] = null), n !== null && s !== null)) {
          var b = n.pending;
          (b === null ? (s.next = s) : ((s.next = b.next), (b.next = s)),
            (n.pending = s));
        }
        d !== 0 && q0(i, s, d);
      }
    }
    function _n(a, r, i, n) {
      ((to[Nl++] = a),
        (to[Nl++] = r),
        (to[Nl++] = i),
        (to[Nl++] = n),
        (bc |= n),
        (a.lanes |= n),
        (a = a.alternate),
        a !== null && (a.lanes |= n));
    }
    function yc(a, r, i, n) {
      return (_n(a, r, i, n), An(a));
    }
    function Zr(a, r) {
      return (_n(a, null, null, r), An(a));
    }
    function q0(a, r, i) {
      a.lanes |= i;
      var n = a.alternate;
      n !== null && (n.lanes |= i);
      for (var s = !1, d = a.return; d !== null; )
        ((d.childLanes |= i),
          (n = d.alternate),
          n !== null && (n.childLanes |= i),
          d.tag === 22 &&
            ((a = d.stateNode), a === null || a._visibility & 1 || (s = !0)),
          (a = d),
          (d = d.return));
      return a.tag === 3
        ? ((d = a.stateNode),
          s &&
            r !== null &&
            ((s = 31 - Ka(i)),
            (a = d.hiddenUpdates),
            (n = a[s]),
            n === null ? (a[s] = [r]) : n.push(r),
            (r.lane = i | 536870912)),
          d)
        : null;
    }
    function An(a) {
      if (50 < Zi) throw ((Zi = 0), (bs = null), Error(o(185)));
      for (var r = a.return; r !== null; ) ((a = r), (r = a.return));
      return a.tag === 3 ? a.stateNode : null;
    }
    var Rl = {};
    function F1(a, r, i, n) {
      ((this.tag = a),
        (this.key = i),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = r),
        (this.dependencies =
          this.memoizedState =
          this.updateQueue =
          this.memoizedProps =
            null),
        (this.mode = n),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function zt(a, r, i, n) {
      return new F1(a, r, i, n);
    }
    function vc(a) {
      return ((a = a.prototype), !(!a || !a.isReactComponent));
    }
    function Xo(a, r) {
      var i = a.alternate;
      return (
        i === null
          ? ((i = zt(a.tag, r, a.key, a.mode)),
            (i.elementType = a.elementType),
            (i.type = a.type),
            (i.stateNode = a.stateNode),
            (i.alternate = a),
            (a.alternate = i))
          : ((i.pendingProps = r),
            (i.type = a.type),
            (i.flags = 0),
            (i.subtreeFlags = 0),
            (i.deletions = null)),
        (i.flags = a.flags & 1206910976),
        (i.childLanes = a.childLanes),
        (i.lanes = a.lanes),
        (i.child = a.child),
        (i.memoizedProps = a.memoizedProps),
        (i.memoizedState = a.memoizedState),
        (i.updateQueue = a.updateQueue),
        (r = a.dependencies),
        (i.dependencies =
          r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }),
        (i.sibling = a.sibling),
        (i.index = a.index),
        (i.ref = a.ref),
        (i.refCleanup = a.refCleanup),
        i
      );
    }
    function B0(a, r) {
      a.flags &= 1206910978;
      var i = a.alternate;
      return (
        i === null
          ? ((a.childLanes = 0),
            (a.lanes = r),
            (a.child = null),
            (a.subtreeFlags = 0),
            (a.memoizedProps = null),
            (a.memoizedState = null),
            (a.updateQueue = null),
            (a.dependencies = null),
            (a.stateNode = null))
          : ((a.childLanes = i.childLanes),
            (a.lanes = i.lanes),
            (a.child = i.child),
            (a.subtreeFlags = 0),
            (a.deletions = null),
            (a.memoizedProps = i.memoizedProps),
            (a.memoizedState = i.memoizedState),
            (a.updateQueue = i.updateQueue),
            (a.type = i.type),
            (r = i.dependencies),
            (a.dependencies =
              r === null
                ? null
                : { lanes: r.lanes, firstContext: r.firstContext })),
        a
      );
    }
    function En(a, r, i, n, s, d) {
      var b = 0;
      if (((n = a), typeof n == "function")) vc(n) && (b = 1);
      else if (typeof n == "string")
        b = T5(a, i, ga.current)
          ? 26
          : a === "html" || a === "head" || a === "body"
            ? 27
            : 5;
      else
        e: switch (n) {
          case oe:
            return (
              (a = zt(31, i, r, s)),
              (a.elementType = oe),
              (a.lanes = d),
              a
            );
          case ue:
            return Qr(i.children, s, d, r);
          case N:
            ((b = 8), (s |= 24));
            break;
          case Ee:
            return (
              (a = zt(12, i, r, s | 2)),
              (a.elementType = Ee),
              (a.lanes = d),
              a
            );
          case de:
            return (
              (a = zt(13, i, r, s)),
              (a.elementType = de),
              (a.lanes = d),
              a
            );
          case W:
            return (
              (a = zt(19, i, r, s)),
              (a.elementType = W),
              (a.lanes = d),
              a
            );
          case Ne:
          case C:
            return (
              (a = s | 32),
              (a = zt(30, i, r, a)),
              (a.elementType = C),
              (a.lanes = d),
              (a.stateNode = {
                autoName: null,
                paired: null,
                clones: null,
                ref: null,
              }),
              a
            );
          default:
            if (typeof n == "object" && n !== null)
              switch (n.$$typeof) {
                case ke:
                  b = 10;
                  break e;
                case ne:
                  b = 9;
                  break e;
                case G:
                  b = 11;
                  break e;
                case le:
                  b = 14;
                  break e;
                case te:
                  ((b = 16), (n = null));
                  break e;
              }
            ((b = 29),
              (i = Error(o(130, a === null ? "null" : typeof a, ""))),
              (n = null));
        }
      return (
        (r = zt(b, i, r, s)),
        (r.elementType = a),
        (r.type = n),
        (r.lanes = d),
        r
      );
    }
    function Qr(a, r, i, n) {
      return ((a = zt(7, a, n, r)), (a.lanes = i), a);
    }
    function wc(a, r, i) {
      return ((a = zt(6, a, null, r)), (a.lanes = i), a);
    }
    function V0(a) {
      var r = zt(18, null, null, 0);
      return ((r.stateNode = a), r);
    }
    function Tc(a, r, i) {
      return (
        (r = zt(4, a.children !== null ? a.children : [], a.key, r)),
        (r.lanes = i),
        (r.stateNode = {
          containerInfo: a.containerInfo,
          pendingChildren: null,
          implementation: a.implementation,
        }),
        r
      );
    }
    var U0 = new WeakMap();
    function oo(a, r) {
      if (typeof a == "object" && a !== null) {
        var i = U0.get(a);
        return i !== void 0
          ? i
          : ((r = { value: a, source: r, stack: zo(r) }), U0.set(a, r), r);
      }
      return { value: a, source: r, stack: zo(r) };
    }
    var jl = [],
      xl = 0,
      Nn = null,
      Ni = 0,
      ro = [],
      lo = 0,
      mr = null,
      Po = 1,
      _o = "";
    function Fo(a, r) {
      ((jl[xl++] = Ni), (jl[xl++] = Nn), (Nn = a), (Ni = r));
    }
    function $0(a, r, i) {
      ((ro[lo++] = Po), (ro[lo++] = _o), (ro[lo++] = mr), (mr = a));
      var n = Po;
      a = _o;
      var s = 32 - Ka(n) - 1;
      ((n &= ~(1 << s)), (i += 1));
      var d = 32 - Ka(r) + s;
      if (30 < d) {
        var b = s - (s % 5);
        ((d = (n & ((1 << b) - 1)).toString(32)),
          (n >>= b),
          (s -= b),
          (Po = (1 << (32 - Ka(r) + s)) | (i << s) | n),
          (_o = d + a));
      } else ((Po = (1 << d) | (i << s) | n), (_o = a));
    }
    function Rn(a) {
      a.return !== null && (Fo(a, 1), $0(a, 1, 0));
    }
    function Sc(a) {
      for (; a === Nn; )
        ((Nn = jl[--xl]), (jl[xl] = null), (Ni = jl[--xl]), (jl[xl] = null));
      for (; a === mr; )
        ((mr = ro[--lo]),
          (ro[lo] = null),
          (_o = ro[--lo]),
          (ro[lo] = null),
          (Po = ro[--lo]),
          (ro[lo] = null));
    }
    function Y0(a, r) {
      ((ro[lo++] = Po),
        (ro[lo++] = _o),
        (ro[lo++] = mr),
        (Po = r.id),
        (_o = r.overflow),
        (mr = a));
    }
    var pt = null,
      Ba = null,
      ba = !1,
      hr = null,
      io = !1,
      kc = Error(o(519));
    function pr(a) {
      var r = Error(
        o(
          418,
          1 < arguments.length && arguments[1] !== void 0 && arguments[1]
            ? "text"
            : "HTML",
          "",
        ),
      );
      throw (Ri(oo(r, a)), kc);
    }
    function G0(a) {
      var r = a.stateNode,
        i = a.type,
        n = a.memoizedProps;
      switch (((r[dt] = a), (r[ut] = n), i)) {
        case "dialog":
          (Ta("cancel", r), Ta("close", r));
          break;
        case "iframe":
        case "object":
        case "embed":
          Ta("load", r);
          break;
        case "video":
        case "audio":
          for (i = 0; i < Ji.length; i++) Ta(Ji[i], r);
          break;
        case "source":
          Ta("error", r);
          break;
        case "img":
        case "image":
        case "link":
          (Ta("error", r), Ta("load", r));
          break;
        case "details":
          Ta("toggle", r);
          break;
        case "input":
          (Ta("invalid", r),
            he(
              r,
              n.value,
              n.defaultValue,
              n.checked,
              n.defaultChecked,
              n.type,
              n.name,
              !0,
            ));
          break;
        case "select":
          Ta("invalid", r);
          break;
        case "textarea":
          (Ta("invalid", r), Ge(r, n.value, n.defaultValue, n.children));
      }
      ((i = n.children),
        (typeof i != "string" &&
          typeof i != "number" &&
          typeof i != "bigint") ||
        r.textContent === "" + i ||
        n.suppressHydrationWarning === !0 ||
        mh(r.textContent, i)
          ? (n.popover != null && (Ta("beforetoggle", r), Ta("toggle", r)),
            n.onScroll != null && Ta("scroll", r),
            n.onScrollEnd != null && Ta("scrollend", r),
            n.onClick != null && (r.onclick = va),
            (r = !0))
          : (r = !1),
        r || pr(a, !0));
    }
    function jn(a) {
      for (pt = a.return; pt; )
        switch (pt.tag) {
          case 5:
          case 31:
          case 13:
            io = !1;
            return;
          case 27:
          case 3:
            io = !0;
            return;
          default:
            pt = pt.return;
        }
    }
    function Dl(a) {
      if (a !== pt) return !1;
      if (!ba) return (jn(a), (ba = !0), !1);
      var r = a.tag,
        i;
      if (
        ((i = r !== 3 && r !== 27) &&
          ((i = r === 5) &&
            ((i = a.type),
            (i =
              !(i !== "form" && i !== "button") ||
              Jd(a.type, a.memoizedProps))),
          (i = !i)),
        i && Ba && pr(a),
        jn(a),
        r === 13)
      ) {
        if (((a = a.memoizedState), (a = a !== null ? a.dehydrated : null), !a))
          throw Error(o(317));
        Ba = jh(a);
      } else if (r === 31) {
        if (((a = a.memoizedState), (a = a !== null ? a.dehydrated : null), !a))
          throw Error(o(317));
        Ba = jh(a);
      } else
        r === 27
          ? ((r = Ba),
            Rr(a.type) ? ((a = su), (su = null), (Ba = a)) : (Ba = r))
          : (Ba = pt ? so(a.stateNode.nextSibling) : null);
      return !0;
    }
    function Jr() {
      ((Ba = pt = null), (ba = !1));
    }
    function Mc() {
      var a = hr;
      return (
        a !== null &&
          (qt === null ? (qt = a) : qt.push.apply(qt, a), (hr = null)),
        a
      );
    }
    function Ri(a) {
      hr === null ? (hr = [a]) : hr.push(a);
    }
    var Cc = He(null),
      el = null,
      Ho = null;
    function gr(a, r, i) {
      (oa(Cc, r._currentValue), (r._currentValue = i));
    }
    function Wo(a) {
      ((a._currentValue = Cc.current), Sa(Cc));
    }
    function xn(a, r, i) {
      for (; a !== null; ) {
        var n = a.alternate;
        if (
          ((a.childLanes & r) !== r
            ? ((a.childLanes |= r), n !== null && (n.childLanes |= r))
            : n !== null && (n.childLanes & r) !== r && (n.childLanes |= r),
          a === i)
        )
          break;
        a = a.return;
      }
    }
    function Pc(a, r, i, n) {
      var s = a.child;
      for (s !== null && (s.return = a); s !== null; ) {
        var d = s.dependencies;
        if (d !== null) {
          var b = s.child;
          d = d.firstContext;
          e: for (; d !== null; ) {
            var k = d;
            d = s;
            for (var R = 0; R < r.length; R++)
              if (k.context === r[R]) {
                ((d.lanes |= i),
                  (k = d.alternate),
                  k !== null && (k.lanes |= i),
                  xn(d.return, i, a),
                  n || (b = null));
                break e;
              }
            d = k.next;
          }
        } else if (s.tag === 18) {
          if (((b = s.return), b === null)) throw Error(o(341));
          ((b.lanes |= i),
            (d = b.alternate),
            d !== null && (d.lanes |= i),
            xn(b, i, a),
            (b = null));
        } else
          s.tag === 13 &&
          s.memoizedState !== null &&
          s.memoizedState.dehydrated === null
            ? ((s.lanes |= i),
              (b = s.alternate),
              b !== null && (b.lanes |= i),
              xn(s.return, i, a),
              (b = s.child),
              (b = b !== null ? b.sibling : null))
            : (b = s.child);
        if (b !== null) b.return = s;
        else
          for (b = s; b !== null; ) {
            if (b === a) {
              b = null;
              break;
            }
            if (((s = b.sibling), s !== null)) {
              ((s.return = b.return), (b = s));
              break;
            }
            b = b.return;
          }
        s = b;
      }
    }
    function al(a, r, i, n) {
      a = null;
      for (var s = r, d = !1; s !== null; ) {
        if (!d) {
          if ((s.flags & 524288) !== 0) d = !0;
          else if ((s.flags & 262144) !== 0) break;
        }
        if (s.tag === 10) {
          var b = s.alternate;
          if (b === null) throw Error(o(387));
          if (((b = b.memoizedProps), b !== null)) {
            var k = s.type;
            $t(s.pendingProps.value, b.value) ||
              (a !== null ? a.push(k) : (a = [k]));
          }
        } else if (s === Be.current) {
          if (((b = s.alternate), b === null)) throw Error(o(387));
          b.memoizedState.memoizedState !== s.memoizedState.memoizedState &&
            (a !== null ? a.push(li) : (a = [li]));
        }
        s = s.return;
      }
      return (a !== null && Pc(r, a, i, n), (r.flags |= 262144), a !== null);
    }
    function Dn(a) {
      for (a = a.firstContext; a !== null; ) {
        if (!$t(a.context._currentValue, a.memoizedValue)) return !0;
        a = a.next;
      }
      return !1;
    }
    function tl(a) {
      ((el = a),
        (Ho = null),
        (a = a.dependencies),
        a !== null && (a.firstContext = null));
    }
    function Tt(a) {
      return X0(el, a);
    }
    function In(a, r) {
      return (el === null && tl(a), X0(a, r));
    }
    function X0(a, r) {
      var i = r._currentValue;
      if (((r = { context: r, memoizedValue: i, next: null }), Ho === null)) {
        if (a === null) throw Error(o(308));
        ((Ho = r),
          (a.dependencies = { lanes: 0, firstContext: r }),
          (a.flags |= 524288));
      } else Ho = Ho.next = r;
      return i;
    }
    var H1 =
        typeof AbortController < "u"
          ? AbortController
          : function () {
              var a = [],
                r = (this.signal = {
                  aborted: !1,
                  addEventListener: function (i, n) {
                    a.push(n);
                  },
                });
              this.abort = function () {
                ((r.aborted = !0),
                  a.forEach(function (i) {
                    return i();
                  }));
              };
            },
      W1 = e.unstable_scheduleCallback,
      K1 = e.unstable_NormalPriority,
      lt = {
        $$typeof: ke,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function _c() {
      return { controller: new H1(), data: new Map(), refCount: 0 };
    }
    function ji(a) {
      (a.refCount--,
        a.refCount === 0 &&
          W1(K1, function () {
            a.controller.abort();
          }));
    }
    function F0(a, r) {
      if ((a.pendingLanes & 4194048) !== 0) {
        var i = a.transitionTypes;
        for (
          i === null && (i = a.transitionTypes = []), a = 0;
          a < r.length;
          a++
        ) {
          var n = r[a];
          i.indexOf(n) === -1 && i.push(n);
        }
      }
    }
    var xi = null;
    function Z1(a) {
      var r = a.transitionTypes;
      return ((a.transitionTypes = null), r);
    }
    var Di = null,
      Ac = 0,
      ol = 0,
      Il = null;
    function Q1(a, r) {
      if (Di === null) {
        var i = (Di = []);
        ((Ac = 0),
          (ol = Yd()),
          (Il = {
            status: "pending",
            value: void 0,
            then: function (n) {
              i.push(n);
            },
          }));
      }
      return (Ac++, r.then(H0, H0), r);
    }
    function H0() {
      if (--Ac === 0 && ((xi = null), Di !== null)) {
        Il !== null && (Il.status = "fulfilled");
        var a = Di;
        ((Di = null), (ol = 0), (Il = null));
        for (var r = 0; r < a.length; r++) (0, a[r])();
      }
    }
    function J1(a, r) {
      var i = [],
        n = {
          status: "pending",
          value: null,
          reason: null,
          then: function (s) {
            i.push(s);
          },
        };
      return (
        a.then(
          function () {
            ((n.status = "fulfilled"), (n.value = r));
            for (var s = 0; s < i.length; s++) (0, i[s])(r);
          },
          function (s) {
            for (n.status = "rejected", n.reason = s, s = 0; s < i.length; s++)
              (0, i[s])(void 0);
          },
        ),
        n
      );
    }
    var W0 = xe.S;
    xe.S = function (a, r) {
      if (
        ((Um = ma()),
        typeof r == "object" &&
          r !== null &&
          typeof r.then == "function" &&
          Q1(a, r),
        xi !== null)
      )
        for (var i = Jl; i !== null; ) (F0(i, xi), (i = i.next));
      if (((i = a.types), i !== null)) {
        for (var n = Jl; n !== null; ) (F0(n, i), (n = n.next));
        if (ol !== 0) {
          ((n = xi), n === null && (n = xi = []));
          for (var s = 0; s < i.length; s++) {
            var d = i[s];
            n.indexOf(d) === -1 && n.push(d);
          }
        }
      }
      W0 !== null && W0(a, r);
    };
    var rl = He(null);
    function Ec() {
      var a = rl.current;
      return a !== null ? a : La.pooledCache;
    }
    function zn(a, r) {
      r === null ? oa(rl, rl.current) : oa(rl, r.pool);
    }
    function K0() {
      var a = Ec();
      return a === null ? null : { parent: lt._currentValue, pool: a };
    }
    var zl = Error(o(460)),
      Nc = Error(o(474)),
      Ln = Error(o(542)),
      On = { then: function () {} };
    function Z0(a) {
      return ((a = a.status), a === "fulfilled" || a === "rejected");
    }
    function Q0(a, r, i) {
      switch (
        ((i = a[i]),
        i === void 0 ? a.push(r) : i !== r && (r.then(va, va), (r = i)),
        r.status)
      ) {
        case "fulfilled":
          return r.value;
        case "rejected":
          throw (
            (a = r.reason),
            ef(a),
            a === void 0 && !("reason" in r) ? Error(o(600)) : a
          );
        default:
          if (typeof r.status == "string") r.then(va, va);
          else {
            if (((a = La), a !== null && 100 < a.shellSuspendCounter))
              throw Error(o(482));
            ((a = r),
              (a.status = "pending"),
              a.then(
                function (n) {
                  if (r.status === "pending") {
                    var s = r;
                    ((s.status = "fulfilled"), (s.value = n));
                  }
                },
                function (n) {
                  if (r.status === "pending") {
                    var s = r;
                    ((s.status = "rejected"), (s.reason = n));
                  }
                },
              ));
          }
          switch (r.status) {
            case "fulfilled":
              return r.value;
            case "rejected":
              throw ((a = r.reason), ef(a), a);
          }
          throw ((il = r), zl);
      }
    }
    function ll(a) {
      try {
        var r = a._init;
        return r(a._payload);
      } catch (i) {
        throw i !== null && typeof i == "object" && typeof i.then == "function"
          ? ((il = i), zl)
          : i;
      }
    }
    var il = null;
    function J0() {
      if (il === null) throw Error(o(459));
      var a = il;
      return ((il = null), a);
    }
    function ef(a) {
      if (a === zl || a === Ln) throw Error(o(483));
    }
    var Ll = null,
      Ii = 0;
    function qn(a) {
      var r = Ii;
      return ((Ii += 1), Ll === null && (Ll = []), Q0(Ll, a, r));
    }
    function br(a, r) {
      ((r = r.props.ref), (a.ref = r !== void 0 ? r : null));
    }
    function Bn(a, r) {
      throw r.$$typeof === O
        ? Error(o(525))
        : ((a = Object.prototype.toString.call(r)),
          Error(
            o(
              31,
              a === "[object Object]"
                ? "object with keys {" + Object.keys(r).join(", ") + "}"
                : a,
            ),
          ));
    }
    function af(a) {
      function r(U, L) {
        if (a) {
          var H = U.deletions;
          H === null ? ((U.deletions = [L]), (U.flags |= 16)) : H.push(L);
        }
      }
      function i(U, L) {
        if (!a) return null;
        for (; L !== null; ) (r(U, L), (L = L.sibling));
        return null;
      }
      function n(U) {
        for (var L = new Map(); U !== null; )
          (U.key === null ? L.set(U.index, U) : L.set(U.key, U),
            (U = U.sibling));
        return L;
      }
      function s(U, L) {
        return ((U = Xo(U, L)), (U.index = 0), (U.sibling = null), U);
      }
      function d(U, L, H) {
        return (
          (U.index = H),
          a
            ? ((H = U.alternate),
              H !== null
                ? ((H = H.index), H < L ? ((U.flags |= 2), L) : H)
                : ((U.flags |= 134217730), L))
            : ((U.flags |= 1048576), L)
        );
      }
      function b(U) {
        return (a && U.alternate === null && (U.flags |= 134217730), U);
      }
      function k(U, L, H, fe) {
        return L === null || L.tag !== 6
          ? ((L = wc(H, U.mode, fe)), (L.return = U), L)
          : ((L = s(L, H)), (L.return = U), L);
      }
      function R(U, L, H, fe) {
        var Xe = H.type;
        return Xe === ue
          ? ((U = ae(U, L, H.props.children, fe, H.key)), br(U, H), U)
          : L !== null &&
              (L.elementType === Xe ||
                (typeof Xe == "object" &&
                  Xe !== null &&
                  Xe.$$typeof === te &&
                  ll(Xe) === L.type))
            ? ((L = s(L, H.props)), br(L, H), (L.return = U), L)
            : ((L = En(H.type, H.key, H.props, null, U.mode, fe)),
              br(L, H),
              (L.return = U),
              L);
      }
      function Y(U, L, H, fe) {
        return L === null ||
          L.tag !== 4 ||
          L.stateNode.containerInfo !== H.containerInfo ||
          L.stateNode.implementation !== H.implementation
          ? ((L = Tc(H, U.mode, fe)), (L.return = U), L)
          : ((L = s(L, H.children || [])), (L.return = U), L);
      }
      function ae(U, L, H, fe, Xe) {
        return L === null || L.tag !== 7
          ? ((L = Qr(H, U.mode, fe, Xe)), (L.return = U), L)
          : ((L = s(L, H)), (L.return = U), L);
      }
      function pe(U, L, H) {
        if (
          (typeof L == "string" && L !== "") ||
          typeof L == "number" ||
          typeof L == "bigint"
        )
          return ((L = wc("" + L, U.mode, H)), (L.return = U), L);
        if (typeof L == "object" && L !== null) {
          switch (L.$$typeof) {
            case _:
              return (
                (H = En(L.type, L.key, L.props, null, U.mode, H)),
                br(H, L),
                (H.return = U),
                H
              );
            case se:
              return ((L = Tc(L, U.mode, H)), (L.return = U), L);
            case te:
              return ((L = ll(L)), pe(U, L, H));
          }
          if (_e(L) || Me(L))
            return ((L = Qr(L, U.mode, H, null)), (L.return = U), L);
          if (typeof L.then == "function") return pe(U, qn(L), H);
          if (L.$$typeof === ke) return pe(U, In(U, L), H);
          Bn(U, L);
        }
        return null;
      }
      function B(U, L, H, fe) {
        var Xe = L !== null ? L.key : null;
        if (
          (typeof H == "string" && H !== "") ||
          typeof H == "number" ||
          typeof H == "bigint"
        )
          return Xe !== null ? null : k(U, L, "" + H, fe);
        if (typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case _:
              return H.key === Xe ? R(U, L, H, fe) : null;
            case se:
              return H.key === Xe ? Y(U, L, H, fe) : null;
            case te:
              return ((H = ll(H)), B(U, L, H, fe));
          }
          if (_e(H) || Me(H)) return Xe !== null ? null : ae(U, L, H, fe, null);
          if (typeof H.then == "function") return B(U, L, qn(H), fe);
          if (H.$$typeof === ke) return B(U, L, In(U, H), fe);
          Bn(U, H);
        }
        return null;
      }
      function Z(U, L, H, fe, Xe) {
        if (
          (typeof fe == "string" && fe !== "") ||
          typeof fe == "number" ||
          typeof fe == "bigint"
        )
          return ((U = U.get(H) || null), k(L, U, "" + fe, Xe));
        if (typeof fe == "object" && fe !== null) {
          switch (fe.$$typeof) {
            case _:
              return (
                (U = U.get(fe.key === null ? H : fe.key) || null),
                R(L, U, fe, Xe)
              );
            case se:
              return (
                (U = U.get(fe.key === null ? H : fe.key) || null),
                Y(L, U, fe, Xe)
              );
            case te:
              return ((fe = ll(fe)), Z(U, L, H, fe, Xe));
          }
          if (_e(fe) || Me(fe))
            return ((U = U.get(H) || null), ae(L, U, fe, Xe, null));
          if (typeof fe.then == "function") return Z(U, L, H, qn(fe), Xe);
          if (fe.$$typeof === ke) return Z(U, L, H, In(L, fe), Xe);
          Bn(L, fe);
        }
        return null;
      }
      function Le(U, L, H, fe) {
        for (
          var Xe = null, Ca = null, ta = L, ca = (L = 0), st = null;
          ta !== null && ca < H.length;
          ca++
        ) {
          ta.index > ca ? ((st = ta), (ta = null)) : (st = ta.sibling);
          var _a = B(U, ta, H[ca], fe);
          if (_a === null) {
            ta === null && (ta = st);
            break;
          }
          (a && ta && _a.alternate === null && r(U, ta),
            (L = d(_a, L, ca)),
            Ca === null ? (Xe = _a) : (Ca.sibling = _a),
            (Ca = _a),
            (ta = st));
        }
        if (ca === H.length) return (i(U, ta), ba && Fo(U, ca), Xe);
        if (ta === null) {
          for (; ca < H.length; ca++)
            ((ta = pe(U, H[ca], fe)),
              ta !== null &&
                ((L = d(ta, L, ca)),
                Ca === null ? (Xe = ta) : (Ca.sibling = ta),
                (Ca = ta)));
          return (ba && Fo(U, ca), Xe);
        }
        for (ta = n(ta); ca < H.length; ca++)
          ((st = Z(ta, U, ca, H[ca], fe)),
            st !== null &&
              (a &&
                ((_a = st.alternate),
                _a !== null && ta.delete(_a.key === null ? ca : _a.key)),
              (L = d(st, L, ca)),
              Ca === null ? (Xe = st) : (Ca.sibling = st),
              (Ca = st)));
        return (
          a &&
            ta.forEach(function (zr) {
              return r(U, zr);
            }),
          ba && Fo(U, ca),
          Xe
        );
      }
      function Qe(U, L, H, fe) {
        if (H == null) throw Error(o(151));
        for (
          var Xe = null,
            Ca = null,
            ta = L,
            ca = (L = 0),
            st = null,
            _a = H.next();
          ta !== null && !_a.done;
          ca++, _a = H.next()
        ) {
          ta.index > ca ? ((st = ta), (ta = null)) : (st = ta.sibling);
          var zr = B(U, ta, _a.value, fe);
          if (zr === null) {
            ta === null && (ta = st);
            break;
          }
          (a && ta && zr.alternate === null && r(U, ta),
            (L = d(zr, L, ca)),
            Ca === null ? (Xe = zr) : (Ca.sibling = zr),
            (Ca = zr),
            (ta = st));
        }
        if (_a.done) return (i(U, ta), ba && Fo(U, ca), Xe);
        if (ta === null) {
          for (; !_a.done; ca++, _a = H.next())
            ((_a = pe(U, _a.value, fe)),
              _a !== null &&
                ((L = d(_a, L, ca)),
                Ca === null ? (Xe = _a) : (Ca.sibling = _a),
                (Ca = _a)));
          return (ba && Fo(U, ca), Xe);
        }
        for (ta = n(ta); !_a.done; ca++, _a = H.next())
          ((_a = Z(ta, U, ca, _a.value, fe)),
            _a !== null &&
              (a &&
                ((st = _a.alternate),
                st !== null && ta.delete(st.key === null ? ca : st.key)),
              (L = d(_a, L, ca)),
              Ca === null ? (Xe = _a) : (Ca.sibling = _a),
              (Ca = _a)));
        return (
          a &&
            ta.forEach(function (x5) {
              return r(U, x5);
            }),
          ba && Fo(U, ca),
          Xe
        );
      }
      function pa(U, L, H, fe) {
        if (
          (typeof H == "object" &&
            H !== null &&
            H.type === ue &&
            H.key === null &&
            H.props.ref === void 0 &&
            (H = H.props.children),
          typeof H == "object" && H !== null)
        ) {
          switch (H.$$typeof) {
            case _:
              e: {
                for (var Xe = H.key; L !== null; ) {
                  if (L.key === Xe) {
                    if (((Xe = H.type), Xe === ue)) {
                      if (L.tag === 7) {
                        (i(U, L.sibling),
                          (fe = s(L, H.props.children)),
                          br(fe, H),
                          (fe.return = U),
                          (U = fe));
                        break e;
                      }
                    } else if (
                      L.elementType === Xe ||
                      (typeof Xe == "object" &&
                        Xe !== null &&
                        Xe.$$typeof === te &&
                        ll(Xe) === L.type)
                    ) {
                      (i(U, L.sibling),
                        (fe = s(L, H.props)),
                        br(fe, H),
                        (fe.return = U),
                        (U = fe));
                      break e;
                    }
                    i(U, L);
                    break;
                  } else r(U, L);
                  L = L.sibling;
                }
                H.type === ue
                  ? ((fe = Qr(H.props.children, U.mode, fe, H.key)),
                    br(fe, H),
                    (fe.return = U),
                    (U = fe))
                  : ((fe = En(H.type, H.key, H.props, null, U.mode, fe)),
                    br(fe, H),
                    (fe.return = U),
                    (U = fe));
              }
              return b(U);
            case se:
              e: {
                for (Xe = H.key; L !== null; ) {
                  if (L.key === Xe)
                    if (
                      L.tag === 4 &&
                      L.stateNode.containerInfo === H.containerInfo &&
                      L.stateNode.implementation === H.implementation
                    ) {
                      (i(U, L.sibling),
                        (fe = s(L, H.children || [])),
                        (fe.return = U),
                        (U = fe));
                      break e;
                    } else {
                      i(U, L);
                      break;
                    }
                  else r(U, L);
                  L = L.sibling;
                }
                ((fe = Tc(H, U.mode, fe)), (fe.return = U), (U = fe));
              }
              return b(U);
            case te:
              return ((H = ll(H)), pa(U, L, H, fe));
          }
          if (_e(H)) return Le(U, L, H, fe);
          if (Me(H)) {
            if (((Xe = Me(H)), typeof Xe != "function")) throw Error(o(150));
            return ((H = Xe.call(H)), Qe(U, L, H, fe));
          }
          if (typeof H.then == "function") return pa(U, L, qn(H), fe);
          if (H.$$typeof === ke) return pa(U, L, In(U, H), fe);
          Bn(U, H);
        }
        return (typeof H == "string" && H !== "") ||
          typeof H == "number" ||
          typeof H == "bigint"
          ? ((H = "" + H),
            L !== null && L.tag === 6
              ? (i(U, L.sibling), (fe = s(L, H)), (fe.return = U), (U = fe))
              : (i(U, L), (fe = wc(H, U.mode, fe)), (fe.return = U), (U = fe)),
            b(U))
          : i(U, L);
      }
      return function (U, L, H, fe) {
        try {
          Ii = 0;
          var Xe = pa(U, L, H, fe);
          return ((Ll = null), Xe);
        } catch (ta) {
          if (ta === zl || ta === Ln) throw ta;
          var Ca = zt(29, ta, null, U.mode);
          return ((Ca.lanes = fe), (Ca.return = U), Ca);
        } finally {
        }
      };
    }
    var nl = af(!0),
      tf = af(!1),
      yr = !1;
    function Rc(a) {
      a.updateQueue = {
        baseState: a.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function jc(a, r) {
      ((a = a.updateQueue),
        r.updateQueue === a &&
          (r.updateQueue = {
            baseState: a.baseState,
            firstBaseUpdate: a.firstBaseUpdate,
            lastBaseUpdate: a.lastBaseUpdate,
            shared: a.shared,
            callbacks: null,
          }));
    }
    function vr(a) {
      return { lane: a, tag: 0, payload: null, callback: null, next: null };
    }
    function wr(a, r, i) {
      var n = a.updateQueue;
      if (n === null) return null;
      if (((n = n.shared), (Ea & 2) !== 0)) {
        var s = n.pending;
        return (
          s === null ? (r.next = r) : ((r.next = s.next), (s.next = r)),
          (n.pending = r),
          (r = An(a)),
          q0(a, null, i),
          r
        );
      }
      return (_n(a, n, r, i), An(a));
    }
    function zi(a, r, i) {
      if (
        ((r = r.updateQueue),
        r !== null && ((r = r.shared), (i & 4194048) !== 0))
      ) {
        var n = r.lanes;
        ((n &= a.pendingLanes), (i |= n), (r.lanes = i), Oo(a, i));
      }
    }
    function xc(a, r) {
      var i = a.updateQueue,
        n = a.alternate;
      if (n !== null && ((n = n.updateQueue), i === n)) {
        var s = null,
          d = null;
        if (((i = i.firstBaseUpdate), i !== null)) {
          do {
            var b = {
              lane: i.lane,
              tag: i.tag,
              payload: i.payload,
              callback: null,
              next: null,
            };
            (d === null ? (s = d = b) : (d = d.next = b), (i = i.next));
          } while (i !== null);
          d === null ? (s = d = r) : (d = d.next = r);
        } else s = d = r;
        ((i = {
          baseState: n.baseState,
          firstBaseUpdate: s,
          lastBaseUpdate: d,
          shared: n.shared,
          callbacks: n.callbacks,
        }),
          (a.updateQueue = i));
        return;
      }
      ((a = i.lastBaseUpdate),
        a === null ? (i.firstBaseUpdate = r) : (a.next = r),
        (i.lastBaseUpdate = r));
    }
    var Dc = !1;
    function Li() {
      if (Dc) {
        var a = Il;
        if (a !== null) throw a;
      }
    }
    function Oi(a, r, i, n) {
      Dc = !1;
      var s = a.updateQueue;
      yr = !1;
      var d = s.firstBaseUpdate,
        b = s.lastBaseUpdate,
        k = s.shared.pending;
      if (k !== null) {
        s.shared.pending = null;
        var R = k,
          Y = R.next;
        ((R.next = null), b === null ? (d = Y) : (b.next = Y), (b = R));
        var ae = a.alternate;
        ae !== null &&
          ((ae = ae.updateQueue),
          (k = ae.lastBaseUpdate),
          k !== b &&
            (k === null ? (ae.firstBaseUpdate = Y) : (k.next = Y),
            (ae.lastBaseUpdate = R)));
      }
      if (d !== null) {
        var pe = s.baseState;
        ((b = 0), (ae = Y = R = null), (k = d));
        do {
          var B = k.lane & -536870913,
            Z = B !== k.lane;
          if (Z ? (Ma & B) === B : (n & B) === B) {
            (B !== 0 && B === ol && (Dc = !0),
              ae !== null &&
                (ae = ae.next =
                  {
                    lane: 0,
                    tag: k.tag,
                    payload: k.payload,
                    callback: null,
                    next: null,
                  }));
            e: {
              var Le = a,
                Qe = k;
              B = r;
              var pa = i;
              switch (Qe.tag) {
                case 1:
                  if (((Le = Qe.payload), typeof Le == "function")) {
                    pe = Le.call(pa, pe, B);
                    break e;
                  }
                  pe = Le;
                  break e;
                case 3:
                  Le.flags = (Le.flags & -65537) | 128;
                case 0:
                  if (
                    ((Le = Qe.payload),
                    (B = typeof Le == "function" ? Le.call(pa, pe, B) : Le),
                    B == null)
                  )
                    break e;
                  pe = V({}, pe, B);
                  break e;
                case 2:
                  yr = !0;
              }
            }
            ((B = k.callback),
              B !== null &&
                ((a.flags |= 64),
                Z && (a.flags |= 8192),
                (Z = s.callbacks),
                Z === null ? (s.callbacks = [B]) : Z.push(B)));
          } else
            ((Z = {
              lane: B,
              tag: k.tag,
              payload: k.payload,
              callback: k.callback,
              next: null,
            }),
              ae === null ? ((Y = ae = Z), (R = pe)) : (ae = ae.next = Z),
              (b |= B));
          if (((k = k.next), k === null)) {
            if (((k = s.shared.pending), k === null)) break;
            ((Z = k),
              (k = Z.next),
              (Z.next = null),
              (s.lastBaseUpdate = Z),
              (s.shared.pending = null));
          }
        } while (!0);
        (ae === null && (R = pe),
          (s.baseState = R),
          (s.firstBaseUpdate = Y),
          (s.lastBaseUpdate = ae),
          d === null && (s.shared.lanes = 0),
          (_r |= b),
          (a.lanes = b),
          (a.memoizedState = pe));
      }
    }
    function of(a, r) {
      if (typeof a != "function") throw Error(o(191, a));
      a.call(r);
    }
    function rf(a, r) {
      var i = a.callbacks;
      if (i !== null)
        for (a.callbacks = null, a = 0; a < i.length; a++) of(i[a], r);
    }
    var Tr = He(null),
      Vn = He(0);
    function lf(a, r) {
      ((a = er), oa(Vn, a), oa(Tr, r), (er = a | r.baseLanes));
    }
    function Ic() {
      (oa(Vn, er), oa(Tr, Tr.current));
    }
    function zc() {
      ((er = Vn.current), Sa(Tr), Sa(Vn));
    }
    var St = He(null),
      Pt = null;
    function Sr(a) {
      var r = a.alternate;
      (oa(kt, kt.current & 1),
        oa(St, a),
        Pt === null &&
          (r === null || Tr.current !== null || r.memoizedState !== null) &&
          (Pt = a));
    }
    function Lc(a) {
      (oa(kt, kt.current), oa(St, a), Pt === null && (Pt = a));
    }
    function nf(a) {
      a.tag === 22
        ? (oa(kt, kt.current), oa(St, a), Pt === null && (Pt = a))
        : kr();
    }
    function kr() {
      (oa(kt, kt.current), oa(St, St.current));
    }
    function Yt(a) {
      (Sa(St), Pt === a && (Pt = null), Sa(kt));
    }
    var kt = He(0);
    function qi(a, r) {
      (oa(St, St.current), oa(kt, r));
    }
    function Oc(a) {
      (Sa(kt), Sa(St), Pt === a && (Pt = null));
    }
    function Un(a) {
      for (var r = a; r !== null; ) {
        if (r.tag === 13) {
          var i = r.memoizedState;
          if (i !== null && ((i = i.dehydrated), i === null || iu(i) || nu(i)))
            return r;
        } else if (
          r.tag === 19 &&
          r.memoizedProps.revealOrder !== "independent"
        ) {
          if ((r.flags & 128) !== 0) return r;
        } else if (r.child !== null) {
          ((r.child.return = r), (r = r.child));
          continue;
        }
        if (r === a) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === a) return null;
          r = r.return;
        }
        ((r.sibling.return = r.return), (r = r.sibling));
      }
      return null;
    }
    var Ko = 0,
      ha = null,
      Ia = null,
      it = null,
      $n = !1,
      Ol = !1,
      sl = !1,
      Yn = 0,
      Bi = 0,
      ql = null,
      e2 = 0;
    function Za() {
      throw Error(o(321));
    }
    function qc(a, r) {
      if (r === null) return !1;
      for (var i = 0; i < r.length && i < a.length; i++)
        if (!$t(a[i], r[i])) return !1;
      return !0;
    }
    function Bc(a, r, i, n, s, d) {
      return (
        (Ko = d),
        (ha = r),
        (r.memoizedState = null),
        (r.updateQueue = null),
        (r.lanes = 0),
        (xe.H = a === null || a.memoizedState === null ? Yf : Gf),
        (sl = !1),
        (d = i(n, s)),
        (sl = !1),
        Ol && (d = cf(r, i, n, s)),
        sf(a),
        d
      );
    }
    function sf(a) {
      xe.H = Zn;
      var r = Ia !== null && Ia.next !== null;
      if (
        ((Ko = 0), (it = Ia = ha = null), ($n = !1), (Bi = 0), (ql = null), r)
      )
        throw Error(o(300));
      a === null ||
        nt ||
        ((a = a.dependencies), a !== null && Dn(a) && (nt = !0));
    }
    function cf(a, r, i, n) {
      ha = a;
      var s = 0;
      do {
        if ((Ol && (ql = null), (Bi = 0), (Ol = !1), 25 <= s))
          throw Error(o(301));
        if (((s += 1), (it = Ia = null), a.updateQueue != null)) {
          var d = a.updateQueue;
          ((d.lastEffect = null),
            (d.events = null),
            (d.stores = null),
            d.memoCache != null && (d.memoCache.index = 0));
        }
        ((xe.H = s2), (d = r(i, n)));
      } while (Ol);
      return d;
    }
    function a2() {
      var a = xe.H,
        r = a.useState()[0];
      return (
        (r = typeof r.then == "function" ? Vi(r) : r),
        (a = a.useState()[0]),
        (Ia !== null ? Ia.memoizedState : null) !== a && (ha.flags |= 1024),
        r
      );
    }
    function Vc() {
      var a = Yn !== 0;
      return ((Yn = 0), a);
    }
    function Uc(a, r, i) {
      ((r.updateQueue = a.updateQueue), (r.flags &= -2053), (a.lanes &= ~i));
    }
    function $c(a) {
      if ($n) {
        for (a = a.memoizedState; a !== null; ) {
          var r = a.queue;
          (r !== null && (r.pending = null), (a = a.next));
        }
        $n = !1;
      }
      ((Ko = 0), (it = Ia = ha = null), (Ol = !1), (Bi = Yn = 0), (ql = null));
    }
    function jt() {
      var a = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
      };
      return (
        it === null ? (ha.memoizedState = it = a) : (it = it.next = a),
        it
      );
    }
    function tt() {
      if (Ia === null) {
        var a = ha.alternate;
        a = a !== null ? a.memoizedState : null;
      } else a = Ia.next;
      var r = it === null ? ha.memoizedState : it.next;
      if (r !== null) ((it = r), (Ia = a));
      else {
        if (a === null)
          throw ha.alternate === null ? Error(o(467)) : Error(o(310));
        ((Ia = a),
          (a = {
            memoizedState: Ia.memoizedState,
            baseState: Ia.baseState,
            baseQueue: Ia.baseQueue,
            queue: Ia.queue,
            next: null,
          }),
          it === null ? (ha.memoizedState = it = a) : (it = it.next = a));
      }
      return it;
    }
    function Gn() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function Vi(a) {
      var r = Bi;
      return (
        (Bi += 1),
        ql === null && (ql = []),
        (a = Q0(ql, a, r)),
        (r = ha),
        (it === null ? r.memoizedState : it.next) === null &&
          ((r = r.alternate),
          (xe.H = r === null || r.memoizedState === null ? Yf : Gf)),
        a
      );
    }
    function Xn(a) {
      if (a !== null && typeof a == "object") {
        if (typeof a.then == "function") return Vi(a);
        if (a.$$typeof === I) return;
        if (a.$$typeof === ke) return Tt(a);
      }
      throw Error(o(438, String(a)));
    }
    function Yc(a) {
      var r = null,
        i = ha.updateQueue;
      if ((i !== null && (r = i.memoCache), r == null)) {
        var n = ha.alternate;
        n !== null &&
          ((n = n.updateQueue),
          n !== null &&
            ((n = n.memoCache),
            n != null &&
              (r = {
                data: n.data.map(function (s) {
                  return s.slice();
                }),
                index: 0,
              })));
      }
      if (
        (r == null && (r = { data: [], index: 0 }),
        i === null && ((i = Gn()), (ha.updateQueue = i)),
        (i.memoCache = r),
        (i = r.data[r.index]),
        i === void 0)
      )
        for (i = r.data[r.index] = Array(a), n = 0; n < a; n++) i[n] = X;
      return (r.index++, i);
    }
    function Zo(a, r) {
      return typeof r == "function" ? r(a) : r;
    }
    function Fn(a) {
      var r = tt();
      return Gc(r, Ia, a);
    }
    function Gc(a, r, i) {
      var n = a.queue;
      if (n === null) throw Error(o(311));
      n.lastRenderedReducer = i;
      var s = a.baseQueue,
        d = n.pending;
      if (d !== null) {
        if (s !== null) {
          var b = s.next;
          ((s.next = d.next), (d.next = b));
        }
        ((r.baseQueue = s = d), (n.pending = null));
      }
      if (((d = a.baseState), s === null)) a.memoizedState = d;
      else {
        r = s.next;
        var k = (b = null),
          R = null,
          Y = r,
          ae = !1;
        do {
          var pe = Y.lane & -536870913;
          if (pe !== Y.lane ? (Ma & pe) === pe : (Ko & pe) === pe) {
            var B = Y.revertLane;
            if (B === 0)
              (R !== null &&
                (R = R.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: Y.action,
                    hasEagerState: Y.hasEagerState,
                    eagerState: Y.eagerState,
                    next: null,
                  }),
                pe === ol && (ae = !0));
            else if ((Ko & B) === B) {
              ((Y = Y.next), B === ol && (ae = !0));
              continue;
            } else
              ((pe = {
                lane: 0,
                revertLane: Y.revertLane,
                gesture: null,
                action: Y.action,
                hasEagerState: Y.hasEagerState,
                eagerState: Y.eagerState,
                next: null,
              }),
                R === null ? ((k = R = pe), (b = d)) : (R = R.next = pe),
                (ha.lanes |= B),
                (_r |= B));
            ((pe = Y.action),
              sl && i(d, pe),
              (d = Y.hasEagerState ? Y.eagerState : i(d, pe)));
          } else
            ((B = {
              lane: pe,
              revertLane: Y.revertLane,
              gesture: Y.gesture,
              action: Y.action,
              hasEagerState: Y.hasEagerState,
              eagerState: Y.eagerState,
              next: null,
            }),
              R === null ? ((k = R = B), (b = d)) : (R = R.next = B),
              (ha.lanes |= pe),
              (_r |= pe));
          Y = Y.next;
        } while (Y !== null && Y !== r);
        if (
          (R === null ? (b = d) : (R.next = k),
          !$t(d, a.memoizedState) && ((nt = !0), ae && ((i = Il), i !== null)))
        )
          throw i;
        ((a.memoizedState = d),
          (a.baseState = b),
          (a.baseQueue = R),
          (n.lastRenderedState = d));
      }
      return (s === null && (n.lanes = 0), [a.memoizedState, n.dispatch]);
    }
    function Xc(a) {
      var r = tt(),
        i = r.queue;
      if (i === null) throw Error(o(311));
      i.lastRenderedReducer = a;
      var n = i.dispatch,
        s = i.pending,
        d = r.memoizedState;
      if (s !== null) {
        i.pending = null;
        var b = (s = s.next);
        do ((d = a(d, b.action)), (b = b.next));
        while (b !== s);
        ($t(d, r.memoizedState) || (nt = !0),
          (r.memoizedState = d),
          r.baseQueue === null && (r.baseState = d),
          (i.lastRenderedState = d));
      }
      return [d, n];
    }
    function df(a, r, i) {
      var n = ha,
        s = tt(),
        d = ba;
      if (d) {
        if (i === void 0) throw Error(o(407));
        i = i();
      } else i = r();
      var b = !$t((Ia || s).memoizedState, i);
      if (
        (b && ((s.memoizedState = i), (nt = !0)),
        (s = s.queue),
        Wc(mf.bind(null, n, s, a), [a]),
        (a =
          s.getSnapshot !== r ||
          b ||
          (it !== null && (it.memoizedState.tag & 1) !== 0)),
        Bl(a ? 9 : 8, { destroy: void 0 }, ff.bind(null, n, s, i, r), null),
        a)
      ) {
        if (((n.flags |= 2048), La === null)) throw Error(o(349));
        d || (Ko & 127) !== 0 || uf(n, r, i);
      }
      return i;
    }
    function uf(a, r, i) {
      ((a.flags |= 16384),
        (a = { getSnapshot: r, value: i }),
        (r = ha.updateQueue),
        r === null
          ? ((r = Gn()), (ha.updateQueue = r), (r.stores = [a]))
          : ((i = r.stores), i === null ? (r.stores = [a]) : i.push(a)));
    }
    function ff(a, r, i, n) {
      ((r.value = i), (r.getSnapshot = n), hf(r) && pf(a));
    }
    function mf(a, r, i) {
      return i(function () {
        hf(r) && pf(a);
      });
    }
    function hf(a) {
      var r = a.getSnapshot;
      a = a.value;
      try {
        var i = r();
        return !$t(a, i);
      } catch {
        return !0;
      }
    }
    function pf(a) {
      var r = Zr(a, 2);
      r !== null && Bt(r, a, 2);
    }
    function Fc(a) {
      var r = jt();
      if (typeof a == "function") {
        var i = a;
        if (((a = i()), sl)) {
          Et(!0);
          try {
            i();
          } finally {
            Et(!1);
          }
        }
      }
      return (
        (r.memoizedState = r.baseState = a),
        (r.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Zo,
          lastRenderedState: a,
        }),
        r
      );
    }
    function gf(a, r, i, n) {
      return ((a.baseState = i), Gc(a, Ia, typeof n == "function" ? n : Zo));
    }
    function t2(a, r, i, n, s) {
      if (Kn(a)) throw Error(o(485));
      if (((a = r.action), a !== null)) {
        var d = {
          payload: s,
          action: a,
          next: null,
          isTransition: !0,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function (b) {
            d.listeners.push(b);
          },
        };
        (xe.T !== null ? i(!0) : (d.isTransition = !1),
          n(d),
          (i = r.pending),
          i === null
            ? ((d.next = r.pending = d), bf(r, d))
            : ((d.next = i.next), (r.pending = i.next = d)));
      }
    }
    function bf(a, r) {
      var i = r.action,
        n = r.payload,
        s = a.state;
      if (r.isTransition) {
        var d = xe.T,
          b = {};
        ((b.types = d !== null ? d.types : null), (xe.T = b));
        try {
          var k = i(s, n),
            R = xe.S;
          (R !== null && R(b, k), yf(a, r, k));
        } catch (Y) {
          Hc(a, r, Y);
        } finally {
          (d !== null && b.types !== null && (d.types = b.types), (xe.T = d));
        }
      } else
        try {
          ((d = i(s, n)), yf(a, r, d));
        } catch (Y) {
          Hc(a, r, Y);
        }
    }
    function yf(a, r, i) {
      i !== null && typeof i == "object" && typeof i.then == "function"
        ? i.then(
            function (n) {
              vf(a, r, n);
            },
            function (n) {
              return Hc(a, r, n);
            },
          )
        : vf(a, r, i);
    }
    function vf(a, r, i) {
      ((r.status = "fulfilled"),
        (r.value = i),
        wf(r),
        (a.state = i),
        (r = a.pending),
        r !== null &&
          ((i = r.next),
          i === r
            ? (a.pending = null)
            : ((i = i.next), (r.next = i), bf(a, i))));
    }
    function Hc(a, r, i) {
      var n = a.pending;
      if (((a.pending = null), n !== null)) {
        n = n.next;
        do ((r.status = "rejected"), (r.reason = i), wf(r), (r = r.next));
        while (r !== n);
      }
      a.action = null;
    }
    function wf(a) {
      a = a.listeners;
      for (var r = 0; r < a.length; r++) (0, a[r])();
    }
    function Tf(a, r) {
      return r;
    }
    function Sf(a, r) {
      if (ba) {
        var i = La.formState;
        if (i !== null) {
          e: {
            var n = ha;
            if (ba) {
              if (Ba) {
                a: {
                  for (var s = Ba, d = io; s.nodeType !== 8; ) {
                    if (!d) {
                      s = null;
                      break a;
                    }
                    if (((s = so(s.nextSibling)), s === null)) {
                      s = null;
                      break a;
                    }
                  }
                  ((d = s.data), (s = d === "F!" || d === "F" ? s : null));
                }
                if (s) {
                  ((Ba = so(s.nextSibling)), (n = s.data === "F!"));
                  break e;
                }
              }
              pr(n);
            }
            n = !1;
          }
          n && (r = i[0]);
        }
      }
      return (
        (i = jt()),
        (i.memoizedState = i.baseState = r),
        (n = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Tf,
          lastRenderedState: r,
        }),
        (i.queue = n),
        (i = Vf.bind(null, ha, n)),
        (n.dispatch = i),
        (n = Fc(!1)),
        (d = ed.bind(null, ha, !1, n.queue)),
        (n = jt()),
        (s = { state: r, dispatch: null, action: a, pending: null }),
        (n.queue = s),
        (i = t2.bind(null, ha, s, d, i)),
        (s.dispatch = i),
        (n.memoizedState = a),
        [r, i, !1]
      );
    }
    function kf(a) {
      var r = tt();
      return Mf(r, Ia, a);
    }
    function Mf(a, r, i) {
      if (
        ((r = Gc(a, r, Tf)[0]),
        (a = Fn(Zo)[0]),
        typeof r == "object" && r !== null && typeof r.then == "function")
      )
        try {
          var n = Vi(r);
        } catch (b) {
          throw b === zl ? Ln : b;
        }
      else n = r;
      r = tt();
      var s = r.queue,
        d = s.dispatch;
      return (
        i !== r.memoizedState &&
          ((ha.flags |= 2048),
          Bl(9, { destroy: void 0 }, o2.bind(null, s, i), null)),
        [n, d, a]
      );
    }
    function o2(a, r) {
      a.action = r;
    }
    function Cf(a) {
      var r = tt(),
        i = Ia;
      if (i !== null) return Mf(r, i, a);
      (tt(), (r = r.memoizedState), (i = tt()));
      var n = i.queue.dispatch;
      return ((i.memoizedState = a), [r, n, !1]);
    }
    function Bl(a, r, i, n) {
      return (
        (a = { tag: a, create: i, deps: n, inst: r, next: null }),
        (r = ha.updateQueue),
        r === null && ((r = Gn()), (ha.updateQueue = r)),
        (i = r.lastEffect),
        i === null
          ? (r.lastEffect = a.next = a)
          : ((n = i.next), (i.next = a), (a.next = n), (r.lastEffect = a)),
        a
      );
    }
    function Pf() {
      return tt().memoizedState;
    }
    function Hn(a, r, i, n) {
      var s = jt();
      ((ha.flags |= a),
        (s.memoizedState = Bl(
          1 | r,
          { destroy: void 0 },
          i,
          n === void 0 ? null : n,
        )));
    }
    function Wn(a, r, i, n) {
      var s = tt();
      n = n === void 0 ? null : n;
      var d = s.memoizedState.inst;
      Ia !== null && n !== null && qc(n, Ia.memoizedState.deps)
        ? (s.memoizedState = Bl(r, d, i, n))
        : ((ha.flags |= a), (s.memoizedState = Bl(1 | r, d, i, n)));
    }
    function _f(a, r) {
      Hn(8390656, 8, a, r);
    }
    function Wc(a, r) {
      Wn(2048, 8, a, r);
    }
    function r2(a) {
      ha.flags |= 4;
      var r = ha.updateQueue;
      if (r === null) ((r = Gn()), (ha.updateQueue = r), (r.events = [a]));
      else {
        var i = r.events;
        i === null ? (r.events = [a]) : i.push(a);
      }
    }
    function Af(a) {
      var r = tt().memoizedState;
      return (
        r2({ ref: r, nextImpl: a }),
        function () {
          if ((Ea & 2) !== 0) throw Error(o(440));
          return r.impl.apply(void 0, arguments);
        }
      );
    }
    function Ef(a, r) {
      return Wn(4, 2, a, r);
    }
    function Nf(a, r) {
      return Wn(4, 4, a, r);
    }
    function Rf(a, r) {
      if (typeof r == "function") {
        a = a();
        var i = r(a);
        return function () {
          typeof i == "function" ? i() : r(null);
        };
      }
      if (r != null)
        return (
          (a = a()),
          (r.current = a),
          function () {
            r.current = null;
          }
        );
    }
    function jf(a, r, i) {
      ((i = i != null ? i.concat([a]) : null),
        Wn(4, 4, Rf.bind(null, r, a), i));
    }
    function Kc() {}
    function xf(a, r) {
      var i = tt();
      r = r === void 0 ? null : r;
      var n = i.memoizedState;
      return r !== null && qc(r, n[1]) ? n[0] : ((i.memoizedState = [a, r]), a);
    }
    function Df(a, r) {
      var i = tt();
      r = r === void 0 ? null : r;
      var n = i.memoizedState;
      if (r !== null && qc(r, n[1])) return n[0];
      if (((n = a()), sl)) {
        Et(!0);
        try {
          a();
        } finally {
          Et(!1);
        }
      }
      return ((i.memoizedState = [n, r]), n);
    }
    function Zc(a, r, i) {
      return i === void 0 || ((Ko & 1073741824) !== 0 && (Ma & 261930) === 0)
        ? (a.memoizedState = r)
        : ((a.memoizedState = i), (a = Ym()), (ha.lanes |= a), (_r |= a), i);
    }
    function If(a, r, i, n) {
      return $t(i, r)
        ? i
        : Tr.current !== null
          ? ((a = Zc(a, i, n)), $t(a, r) || (nt = !0), a)
          : (Ko & 106) === 0 || ((Ko & 1073741824) !== 0 && (Ma & 261930) === 0)
            ? ((nt = !0), (a.memoizedState = i))
            : ((a = Ym()), (ha.lanes |= a), (_r |= a), r);
    }
    function zf(a, r, i, n, s) {
      var d = Ue.p;
      Ue.p = d !== 0 && 8 > d ? d : 8;
      var b = xe.T,
        k = {};
      ((k.types = b !== null ? b.types : null), (xe.T = k), ed(a, !1, r, i));
      try {
        var R = s(),
          Y = xe.S;
        if (
          (Y !== null && Y(k, R),
          R !== null && typeof R == "object" && typeof R.then == "function")
        ) {
          var ae = J1(R, n);
          Ui(a, r, ae, Ht(a));
        } else Ui(a, r, n, Ht(a));
      } catch (pe) {
        Ui(
          a,
          r,
          { then: function () {}, status: "rejected", reason: pe },
          Ht(),
        );
      } finally {
        ((Ue.p = d),
          b !== null && k.types !== null && (b.types = k.types),
          (xe.T = b));
      }
    }
    function l2() {}
    function Qc(a, r, i, n) {
      if (a.tag !== 5) throw Error(o(476));
      var s = Lf(a).queue;
      zf(
        a,
        s,
        r,
        $a,
        i === null
          ? l2
          : function () {
              return (Of(a), i(n));
            },
      );
    }
    function Lf(a) {
      var r = a.memoizedState;
      if (r !== null) return r;
      r = {
        memoizedState: $a,
        baseState: $a,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Zo,
          lastRenderedState: $a,
        },
        next: null,
      };
      var i = {};
      return (
        (r.next = {
          memoizedState: i,
          baseState: i,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Zo,
            lastRenderedState: i,
          },
          next: null,
        }),
        (a.memoizedState = r),
        (a = a.alternate),
        a !== null && (a.memoizedState = r),
        r
      );
    }
    function Of(a) {
      var r = Lf(a);
      (r.next === null && (r = a.alternate.memoizedState),
        Ui(a, r.next.queue, {}, Ht()));
    }
    function Jc() {
      return Tt(li);
    }
    function qf() {
      return tt().memoizedState;
    }
    function Bf() {
      return tt().memoizedState;
    }
    function i2(a) {
      for (var r = a.return; r !== null; ) {
        switch (r.tag) {
          case 24:
          case 3:
            var i = Ht();
            a = vr(i);
            var n = wr(r, a, i);
            (n !== null && (Bt(n, r, i), zi(n, r, i)),
              (r = { cache: _c() }),
              (a.payload = r));
            return;
        }
        r = r.return;
      }
    }
    function n2(a, r, i) {
      var n = Ht();
      ((i = {
        lane: n,
        revertLane: 0,
        gesture: null,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        Kn(a)
          ? Uf(r, i)
          : ((i = yc(a, r, i, n)), i !== null && (Bt(i, a, n), $f(i, r, n))));
    }
    function Vf(a, r, i) {
      var n = Ht();
      Ui(a, r, i, n);
    }
    function Ui(a, r, i, n) {
      var s = {
        lane: n,
        revertLane: 0,
        gesture: null,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (Kn(a)) Uf(r, s);
      else {
        var d = a.alternate;
        if (
          a.lanes === 0 &&
          (d === null || d.lanes === 0) &&
          ((d = r.lastRenderedReducer), d !== null)
        )
          try {
            var b = r.lastRenderedState,
              k = d(b, i);
            if (((s.hasEagerState = !0), (s.eagerState = k), $t(k, b)))
              return (_n(a, r, s, 0), La === null && Pn(), !1);
          } catch {
          } finally {
          }
        if (((i = yc(a, r, s, n)), i !== null))
          return (Bt(i, a, n), $f(i, r, n), !0);
      }
      return !1;
    }
    function ed(a, r, i, n) {
      if (
        ((n = {
          lane: 2,
          revertLane: Yd(),
          gesture: null,
          action: n,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        Kn(a))
      ) {
        if (r) throw Error(o(479));
      } else ((r = yc(a, i, n, 2)), r !== null && Bt(r, a, 2));
    }
    function Kn(a) {
      var r = a.alternate;
      return a === ha || (r !== null && r === ha);
    }
    function Uf(a, r) {
      Ol = $n = !0;
      var i = a.pending;
      (i === null ? (r.next = r) : ((r.next = i.next), (i.next = r)),
        (a.pending = r));
    }
    function $f(a, r, i) {
      if ((i & 4194048) !== 0) {
        var n = r.lanes;
        ((n &= a.pendingLanes), (i |= n), (r.lanes = i), Oo(a, i));
      }
    }
    var Zn = {
        readContext: Tt,
        use: Xn,
        useCallback: Za,
        useContext: Za,
        useEffect: Za,
        useImperativeHandle: Za,
        useLayoutEffect: Za,
        useInsertionEffect: Za,
        useMemo: Za,
        useReducer: Za,
        useRef: Za,
        useState: Za,
        useDebugValue: Za,
        useDeferredValue: Za,
        useTransition: Za,
        useSyncExternalStore: Za,
        useId: Za,
        useHostTransitionStatus: Za,
        useFormState: Za,
        useActionState: Za,
        useOptimistic: Za,
        useMemoCache: Za,
        useCacheRefresh: Za,
        useEffectEvent: Za,
      },
      Yf = {
        readContext: Tt,
        use: Xn,
        useCallback: function (a, r) {
          return ((jt().memoizedState = [a, r === void 0 ? null : r]), a);
        },
        useContext: Tt,
        useEffect: _f,
        useImperativeHandle: function (a, r, i) {
          ((i = i != null ? i.concat([a]) : null),
            Hn(4194308, 4, Rf.bind(null, r, a), i));
        },
        useLayoutEffect: function (a, r) {
          return Hn(4194308, 4, a, r);
        },
        useInsertionEffect: function (a, r) {
          Hn(4, 2, a, r);
        },
        useMemo: function (a, r) {
          var i = jt();
          r = r === void 0 ? null : r;
          var n = a();
          if (sl) {
            Et(!0);
            try {
              a();
            } finally {
              Et(!1);
            }
          }
          return ((i.memoizedState = [n, r]), n);
        },
        useReducer: function (a, r, i) {
          var n = jt();
          if (i !== void 0) {
            var s = i(r);
            if (sl) {
              Et(!0);
              try {
                i(r);
              } finally {
                Et(!1);
              }
            }
          } else s = r;
          return (
            (n.memoizedState = n.baseState = s),
            (a = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: a,
              lastRenderedState: s,
            }),
            (n.queue = a),
            (a = a.dispatch = n2.bind(null, ha, a)),
            [n.memoizedState, a]
          );
        },
        useRef: function (a) {
          var r = jt();
          return ((a = { current: a }), (r.memoizedState = a));
        },
        useState: function (a) {
          a = Fc(a);
          var r = a.queue,
            i = Vf.bind(null, ha, r);
          return ((r.dispatch = i), [a.memoizedState, i]);
        },
        useDebugValue: Kc,
        useDeferredValue: function (a, r) {
          var i = jt();
          return Zc(i, a, r);
        },
        useTransition: function () {
          var a = Fc(!1);
          return (
            (a = zf.bind(null, ha, a.queue, !0, !1)),
            (jt().memoizedState = a),
            [!1, a]
          );
        },
        useSyncExternalStore: function (a, r, i) {
          var n = ha,
            s = jt();
          if (ba) {
            if (i === void 0) throw Error(o(407));
            i = i();
          } else {
            if (((i = r()), La === null)) throw Error(o(349));
            (Ma & 127) !== 0 || uf(n, r, i);
          }
          s.memoizedState = i;
          var d = { value: i, getSnapshot: r };
          return (
            (s.queue = d),
            _f(mf.bind(null, n, d, a), [a]),
            (n.flags |= 2048),
            Bl(9, { destroy: void 0 }, ff.bind(null, n, d, i, r), null),
            i
          );
        },
        useId: function () {
          var a = jt(),
            r = La.identifierPrefix;
          if (ba) {
            var i = _o,
              n = Po;
            ((i = (n & ~(1 << (32 - Ka(n) - 1))).toString(32) + i),
              (r = "_" + r + "R_" + i),
              (i = Yn++),
              0 < i && (r += "H" + i.toString(32)),
              (r += "_"));
          } else ((i = e2++), (r = "_" + r + "r_" + i.toString(32) + "_"));
          return (a.memoizedState = r);
        },
        useHostTransitionStatus: Jc,
        useFormState: Sf,
        useActionState: Sf,
        useOptimistic: function (a) {
          var r = jt();
          r.memoizedState = r.baseState = a;
          var i = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return (
            (r.queue = i),
            (r = ed.bind(null, ha, !0, i)),
            (i.dispatch = r),
            [a, r]
          );
        },
        useMemoCache: Yc,
        useCacheRefresh: function () {
          return (jt().memoizedState = i2.bind(null, ha));
        },
        useEffectEvent: function (a) {
          var r = jt(),
            i = { impl: a };
          return (
            (r.memoizedState = i),
            function () {
              if ((Ea & 2) !== 0) throw Error(o(440));
              return i.impl.apply(void 0, arguments);
            }
          );
        },
      },
      Gf = {
        readContext: Tt,
        use: Xn,
        useCallback: xf,
        useContext: Tt,
        useEffect: Wc,
        useImperativeHandle: jf,
        useInsertionEffect: Ef,
        useLayoutEffect: Nf,
        useMemo: Df,
        useReducer: Fn,
        useRef: Pf,
        useState: function () {
          return Fn(Zo);
        },
        useDebugValue: Kc,
        useDeferredValue: function (a, r) {
          var i = tt();
          return If(i, Ia.memoizedState, a, r);
        },
        useTransition: function () {
          var a = Fn(Zo)[0],
            r = tt().memoizedState;
          return [typeof a == "boolean" ? a : Vi(a), r];
        },
        useSyncExternalStore: df,
        useId: qf,
        useHostTransitionStatus: Jc,
        useFormState: kf,
        useActionState: kf,
        useOptimistic: function (a, r) {
          var i = tt();
          return gf(i, Ia, a, r);
        },
        useMemoCache: Yc,
        useCacheRefresh: Bf,
        useEffectEvent: Af,
      },
      s2 = {
        readContext: Tt,
        use: Xn,
        useCallback: xf,
        useContext: Tt,
        useEffect: Wc,
        useImperativeHandle: jf,
        useInsertionEffect: Ef,
        useLayoutEffect: Nf,
        useMemo: Df,
        useReducer: Xc,
        useRef: Pf,
        useState: function () {
          return Xc(Zo);
        },
        useDebugValue: Kc,
        useDeferredValue: function (a, r) {
          var i = tt();
          return Ia === null ? Zc(i, a, r) : If(i, Ia.memoizedState, a, r);
        },
        useTransition: function () {
          var a = Xc(Zo)[0],
            r = tt().memoizedState;
          return [typeof a == "boolean" ? a : Vi(a), r];
        },
        useSyncExternalStore: df,
        useId: qf,
        useHostTransitionStatus: Jc,
        useFormState: Cf,
        useActionState: Cf,
        useOptimistic: function (a, r) {
          var i = tt();
          return Ia !== null
            ? gf(i, Ia, a, r)
            : ((i.baseState = a), [a, i.queue.dispatch]);
        },
        useMemoCache: Yc,
        useCacheRefresh: Bf,
        useEffectEvent: Af,
      };
    function ad(a, r, i, n) {
      ((r = a.memoizedState),
        (i = i(n, r)),
        (i = i == null ? r : V({}, r, i)),
        (a.memoizedState = i),
        a.lanes === 0 && (a.updateQueue.baseState = i));
    }
    var td = {
      enqueueSetState: function (a, r, i) {
        a = a._reactInternals;
        var n = Ht(),
          s = vr(n);
        ((s.payload = r),
          i != null && (s.callback = i),
          (r = wr(a, s, n)),
          r !== null && (Bt(r, a, n), zi(r, a, n)));
      },
      enqueueReplaceState: function (a, r, i) {
        a = a._reactInternals;
        var n = Ht(),
          s = vr(n);
        ((s.tag = 1),
          (s.payload = r),
          i != null && (s.callback = i),
          (r = wr(a, s, n)),
          r !== null && (Bt(r, a, n), zi(r, a, n)));
      },
      enqueueForceUpdate: function (a, r) {
        a = a._reactInternals;
        var i = Ht(),
          n = vr(i);
        ((n.tag = 2),
          r != null && (n.callback = r),
          (r = wr(a, n, i)),
          r !== null && (Bt(r, a, i), zi(r, a, i)));
      },
    };
    function Xf(a, r, i, n, s, d, b) {
      return (
        (a = a.stateNode),
        typeof a.shouldComponentUpdate == "function"
          ? a.shouldComponentUpdate(n, d, b)
          : r.prototype && r.prototype.isPureReactComponent
            ? !Ai(i, n) || !Ai(s, d)
            : !0
      );
    }
    function Ff(a, r, i, n) {
      ((a = r.state),
        typeof r.componentWillReceiveProps == "function" &&
          r.componentWillReceiveProps(i, n),
        typeof r.UNSAFE_componentWillReceiveProps == "function" &&
          r.UNSAFE_componentWillReceiveProps(i, n),
        r.state !== a && td.enqueueReplaceState(r, r.state, null));
    }
    function cl(a, r) {
      var i = r;
      if ("ref" in r) {
        i = {};
        for (var n in r) n !== "ref" && (i[n] = r[n]);
      }
      if ((a = a.defaultProps)) {
        i === r && (i = V({}, i));
        for (var s in a) i[s] === void 0 && (i[s] = a[s]);
      }
      return i;
    }
    function Hf(a) {
      Cn(a);
    }
    function Wf(a) {
      console.error(a);
    }
    function Kf(a) {
      Cn(a);
    }
    function Qn(a, r) {
      try {
        var i = a.onUncaughtError;
        i(r.value, { componentStack: r.stack });
      } catch (n) {
        setTimeout(function () {
          throw n;
        });
      }
    }
    function Zf(a, r, i) {
      try {
        var n = a.onCaughtError;
        n(i.value, {
          componentStack: i.stack,
          errorBoundary: r.tag === 1 ? r.stateNode : null,
        });
      } catch (s) {
        setTimeout(function () {
          throw s;
        });
      }
    }
    function od(a, r, i) {
      return (
        (i = vr(i)),
        (i.tag = 3),
        (i.payload = { element: null }),
        (i.callback = function () {
          Qn(a, r);
        }),
        i
      );
    }
    function Qf(a) {
      return ((a = vr(a)), (a.tag = 3), a);
    }
    function Jf(a, r, i, n) {
      var s = i.type.getDerivedStateFromError;
      if (typeof s == "function") {
        var d = n.value;
        ((a.payload = function () {
          return s(d);
        }),
          (a.callback = function () {
            Zf(r, i, n);
          }));
      }
      var b = i.stateNode;
      b !== null &&
        typeof b.componentDidCatch == "function" &&
        (a.callback = function () {
          (Zf(r, i, n),
            typeof s != "function" &&
              (Ar === null ? (Ar = new Set([this])) : Ar.add(this)));
          var k = n.stack;
          this.componentDidCatch(n.value, {
            componentStack: k !== null ? k : "",
          });
        });
    }
    function c2(a, r, i, n, s) {
      if (
        ((i.flags |= 32768),
        n !== null && typeof n == "object" && typeof n.then == "function")
      ) {
        if (
          ((r = i.alternate),
          r !== null && al(r, i, s, !0),
          (i = St.current),
          i !== null)
        ) {
          switch (i.tag) {
            case 31:
            case 13:
            case 19:
              return (
                Pt === null
                  ? vs()
                  : i.alternate === null && Qa === 0 && (Qa = 3),
                (i.flags &= -257),
                (i.flags |= 65536),
                (i.lanes = s),
                n === On
                  ? (i.flags |= 16384)
                  : ((r = i.updateQueue),
                    r === null ? (i.updateQueue = new Set([n])) : r.add(n),
                    Vd(a, n, s)),
                !1
              );
            case 22:
              return (
                (i.flags |= 65536),
                n === On
                  ? (i.flags |= 16384)
                  : ((r = i.updateQueue),
                    r === null
                      ? ((r = {
                          transitions: null,
                          markerInstances: null,
                          retryQueue: new Set([n]),
                        }),
                        (i.updateQueue = r))
                      : ((i = r.retryQueue),
                        i === null ? (r.retryQueue = new Set([n])) : i.add(n)),
                    Vd(a, n, s)),
                !1
              );
          }
          throw Error(o(435, i.tag));
        }
        return (Vd(a, n, s), vs(), !1);
      }
      if (ba)
        return (
          (r = St.current),
          r !== null
            ? ((r.flags & 65536) === 0 && (r.flags |= 256),
              (r.flags |= 65536),
              (r.lanes = s),
              n !== kc && ((a = Error(o(422), { cause: n })), Ri(oo(a, i))))
            : (n !== kc && ((r = Error(o(423), { cause: n })), Ri(oo(r, i))),
              (a = a.current.alternate),
              (a.flags |= 65536),
              (s &= -s),
              (a.lanes |= s),
              (n = oo(n, i)),
              (s = od(a.stateNode, n, s)),
              xc(a, s),
              Qa !== 4 && (Qa = 2)),
          !1
        );
      var d = Error(o(520), { cause: n });
      if (
        ((d = oo(d, i)),
        Ki === null ? (Ki = [d]) : Ki.push(d),
        Qa !== 4 && (Qa = 2),
        r === null)
      )
        return !0;
      ((n = oo(n, i)), (i = r));
      do {
        switch (i.tag) {
          case 3:
            return (
              (i.flags |= 65536),
              (a = s & -s),
              (i.lanes |= a),
              (a = od(i.stateNode, n, a)),
              xc(i, a),
              !1
            );
          case 1:
            if (
              ((r = i.type),
              (d = i.stateNode),
              (i.flags & 128) === 0 &&
                (typeof r.getDerivedStateFromError == "function" ||
                  (d !== null &&
                    typeof d.componentDidCatch == "function" &&
                    (Ar === null || !Ar.has(d)))))
            )
              return (
                (i.flags |= 65536),
                (s &= -s),
                (i.lanes |= s),
                (s = Qf(s)),
                Jf(s, a, i, n),
                xc(i, s),
                !1
              );
            break;
          case 22:
            if (i.memoizedState !== null) return ((i.flags |= 65536), !1);
        }
        i = i.return;
      } while (i !== null);
      return !1;
    }
    var rd = Error(o(461)),
      nt = !1;
    function mt(a, r, i, n) {
      r.child = a === null ? tf(r, null, i, n) : nl(r, a.child, i, n);
    }
    function em(a, r, i, n, s) {
      i = i.render;
      var d = r.ref;
      if ("ref" in n) {
        var b = {};
        for (var k in n) k !== "ref" && (b[k] = n[k]);
      } else b = n;
      return (
        tl(r),
        (n = Bc(a, r, i, b, d, s)),
        (k = Vc()),
        a !== null && !nt
          ? (Uc(a, r, s), Qo(a, r, s))
          : (ba && k && Rn(r), (r.flags |= 1), mt(a, r, n, s), r.child)
      );
    }
    function am(a, r, i, n, s) {
      if (a === null) {
        var d = i.type;
        return typeof d == "function" &&
          !vc(d) &&
          d.defaultProps === void 0 &&
          i.compare === null
          ? ((r.tag = 15), (r.type = d), tm(a, r, d, n, s))
          : ((a = En(i.type, null, n, r, r.mode, s)),
            (a.ref = r.ref),
            (a.return = r),
            (r.child = a));
      }
      if (((d = a.child), !fd(a, s))) {
        var b = d.memoizedProps;
        if (
          ((i = i.compare),
          (i = i !== null ? i : Ai),
          i(b, n) && a.ref === r.ref)
        )
          return Qo(a, r, s);
      }
      return (
        (r.flags |= 1),
        (a = Xo(d, n)),
        (a.ref = r.ref),
        (a.return = r),
        (r.child = a)
      );
    }
    function tm(a, r, i, n, s) {
      if (a !== null) {
        var d = a.memoizedProps;
        if (Ai(d, n) && a.ref === r.ref)
          if (((nt = !1), (r.pendingProps = n = d), fd(a, s)))
            (a.flags & 131072) !== 0 && (nt = !0);
          else return ((r.lanes = a.lanes), Qo(a, r, s));
      }
      return ld(a, r, i, n, s);
    }
    function om(a, r, i, n) {
      var s = n.children,
        d = a !== null ? a.memoizedState : null;
      if (
        (a === null &&
          r.stateNode === null &&
          (r.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        n.mode === "hidden")
      ) {
        if ((r.flags & 128) !== 0) {
          if (((d = d !== null ? d.baseLanes | i : i), a !== null)) {
            for (n = r.child = a.child, s = 0; n !== null; )
              ((s = s | n.lanes | n.childLanes), (n = n.sibling));
            n = s & ~d;
          } else ((n = 0), (r.child = null));
          return rm(a, r, d, i, n);
        }
        if ((i & 536870912) !== 0)
          ((r.memoizedState = { baseLanes: 0, cachePool: null }),
            a !== null && zn(r, d !== null ? d.cachePool : null),
            d !== null ? lf(r, d) : Ic(),
            nf(r));
        else
          return (
            (n = r.lanes = 536870912),
            rm(a, r, d !== null ? d.baseLanes | i : i, i, n)
          );
      } else
        d !== null
          ? (zn(r, d.cachePool), lf(r, d), kr(), (r.memoizedState = null))
          : (a !== null && zn(r, null), Ic(), kr());
      return (mt(a, r, s, i), r.child);
    }
    function $i(a, r) {
      return (
        (a !== null && a.tag === 22) ||
          r.stateNode !== null ||
          (r.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        r.sibling
      );
    }
    function rm(a, r, i, n, s) {
      var d = Ec();
      return (
        (d = d === null ? null : { parent: lt._currentValue, pool: d }),
        (r.memoizedState = { baseLanes: i, cachePool: d }),
        a !== null && zn(r, null),
        Ic(),
        nf(r),
        a !== null && al(a, r, n, !0),
        (r.childLanes = s),
        null
      );
    }
    function Jn(a, r) {
      return (
        (r = es({ mode: r.mode, children: r.children }, a.mode)),
        (r.ref = a.ref),
        (a.child = r),
        (r.return = a),
        r
      );
    }
    function lm(a, r, i) {
      return (
        nl(r, a.child, null, i),
        (a = Jn(r, r.pendingProps)),
        (a.flags |= 2),
        Yt(r),
        (r.memoizedState = null),
        a
      );
    }
    function d2(a, r, i) {
      var n = r.pendingProps,
        s = (r.flags & 128) !== 0;
      if (((r.flags &= -129), a === null)) {
        if (ba) {
          if (n.mode === "hidden")
            return (
              (a = Jn(r, n)),
              (r.lanes = 536870912),
              (a.memoizedState = { baseLanes: 0, cachePool: null }),
              $i(null, a)
            );
          if (
            (Lc(r),
            (a = Ba)
              ? ((a = Rh(a, io)),
                (a = a !== null && a.data === "&" ? a : null),
                a !== null &&
                  ((r.memoizedState = {
                    dehydrated: a,
                    treeContext: mr !== null ? { id: Po, overflow: _o } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (i = V0(a)),
                  (i.return = r),
                  (r.child = i),
                  (pt = r),
                  (Ba = null)))
              : (a = null),
            a === null)
          )
            throw pr(r);
          return ((r.lanes = 536870912), null);
        }
        return Jn(r, n);
      }
      var d = a.memoizedState;
      if (d !== null) {
        var b = d.dehydrated;
        if ((Lc(r), s))
          if (r.flags & 256) ((r.flags &= -257), (r = lm(a, r, i)));
          else if (r.memoizedState !== null)
            ((r.child = a.child), (r.flags |= 128), (r = null));
          else throw Error(o(558));
        else if (
          (nt || al(a, r, i, !1), (s = (i & a.childLanes) !== 0), nt || s)
        ) {
          if (Tr.current === null) {
            if (
              ((n = La),
              n !== null && ((b = nr(n, i)), b !== 0 && b !== d.retryLane))
            )
              throw ((d.retryLane = b), Zr(a, b), Bt(n, a, b), rd);
            vs();
          }
          r = lm(a, r, i);
        } else
          ((a = d.treeContext),
            (Ba = so(b.nextSibling)),
            (pt = r),
            (ba = !0),
            (hr = null),
            (io = !1),
            a !== null && Y0(r, a),
            (r = Jn(r, n)),
            (r.flags |= 134221824));
        return r;
      }
      return (
        (a = Xo(a.child, { mode: n.mode, children: n.children })),
        (a.ref = r.ref),
        (r.child = a),
        (a.return = r),
        a
      );
    }
    function Vl(a, r) {
      var i = r.ref;
      if (i === null) a !== null && a.ref !== null && (r.flags |= 4194816);
      else {
        if (typeof i != "function" && typeof i != "object") throw Error(o(284));
        (a === null || a.ref !== i) && (r.flags |= 4194816);
      }
    }
    function ld(a, r, i, n, s) {
      return (
        tl(r),
        (i = Bc(a, r, i, n, void 0, s)),
        (n = Vc()),
        a !== null && !nt
          ? (Uc(a, r, s), Qo(a, r, s))
          : (ba && n && Rn(r), (r.flags |= 1), mt(a, r, i, s), r.child)
      );
    }
    function im(a, r, i, n, s, d) {
      return (
        tl(r),
        (r.updateQueue = null),
        (i = cf(r, n, i, s)),
        sf(a),
        (n = Vc()),
        a !== null && !nt
          ? (Uc(a, r, d), Qo(a, r, d))
          : (ba && n && Rn(r), (r.flags |= 1), mt(a, r, i, d), r.child)
      );
    }
    function nm(a, r, i, n, s) {
      if ((tl(r), r.stateNode === null)) {
        var d = Rl,
          b = i.contextType;
        (typeof b == "object" && b !== null && (d = Tt(b)),
          (d = new i(n, d)),
          (r.memoizedState =
            d.state !== null && d.state !== void 0 ? d.state : null),
          (d.updater = td),
          (r.stateNode = d),
          (d._reactInternals = r),
          (d = r.stateNode),
          (d.props = n),
          (d.state = r.memoizedState),
          (d.refs = {}),
          Rc(r),
          (b = i.contextType),
          (d.context = typeof b == "object" && b !== null ? Tt(b) : Rl),
          (d.state = r.memoizedState),
          (b = i.getDerivedStateFromProps),
          typeof b == "function" &&
            (ad(r, i, b, n), (d.state = r.memoizedState)),
          typeof i.getDerivedStateFromProps == "function" ||
            typeof d.getSnapshotBeforeUpdate == "function" ||
            (typeof d.UNSAFE_componentWillMount != "function" &&
              typeof d.componentWillMount != "function") ||
            ((b = d.state),
            typeof d.componentWillMount == "function" && d.componentWillMount(),
            typeof d.UNSAFE_componentWillMount == "function" &&
              d.UNSAFE_componentWillMount(),
            b !== d.state && td.enqueueReplaceState(d, d.state, null),
            Oi(r, n, d, s),
            Li(),
            (d.state = r.memoizedState)),
          typeof d.componentDidMount == "function" && (r.flags |= 4194308),
          (n = !0));
      } else if (a === null) {
        d = r.stateNode;
        var k = r.memoizedProps,
          R = cl(i, k);
        d.props = R;
        var Y = d.context,
          ae = i.contextType;
        ((b = Rl), typeof ae == "object" && ae !== null && (b = Tt(ae)));
        var pe = i.getDerivedStateFromProps;
        ((ae =
          typeof pe == "function" ||
          typeof d.getSnapshotBeforeUpdate == "function"),
          (k = r.pendingProps !== k),
          ae ||
            (typeof d.UNSAFE_componentWillReceiveProps != "function" &&
              typeof d.componentWillReceiveProps != "function") ||
            ((k || Y !== b) && Ff(r, d, n, b)),
          (yr = !1));
        var B = r.memoizedState;
        ((d.state = B),
          Oi(r, n, d, s),
          Li(),
          (Y = r.memoizedState),
          k || B !== Y || yr
            ? (typeof pe == "function" &&
                (ad(r, i, pe, n), (Y = r.memoizedState)),
              (R = yr || Xf(r, i, R, n, B, Y, b))
                ? (ae ||
                    (typeof d.UNSAFE_componentWillMount != "function" &&
                      typeof d.componentWillMount != "function") ||
                    (typeof d.componentWillMount == "function" &&
                      d.componentWillMount(),
                    typeof d.UNSAFE_componentWillMount == "function" &&
                      d.UNSAFE_componentWillMount()),
                  typeof d.componentDidMount == "function" &&
                    (r.flags |= 4194308))
                : (typeof d.componentDidMount == "function" &&
                    (r.flags |= 4194308),
                  (r.memoizedProps = n),
                  (r.memoizedState = Y)),
              (d.props = n),
              (d.state = Y),
              (d.context = b),
              (n = R))
            : (typeof d.componentDidMount == "function" && (r.flags |= 4194308),
              (n = !1)));
      } else {
        ((d = r.stateNode),
          jc(a, r),
          (b = r.memoizedProps),
          (ae = cl(i, b)),
          (d.props = ae),
          (pe = r.pendingProps),
          (B = d.context),
          (Y = i.contextType),
          (R = Rl),
          typeof Y == "object" && Y !== null && (R = Tt(Y)),
          (k = i.getDerivedStateFromProps),
          (Y =
            typeof k == "function" ||
            typeof d.getSnapshotBeforeUpdate == "function") ||
            (typeof d.UNSAFE_componentWillReceiveProps != "function" &&
              typeof d.componentWillReceiveProps != "function") ||
            ((b !== pe || B !== R) && Ff(r, d, n, R)),
          (yr = !1),
          (B = r.memoizedState),
          (d.state = B),
          Oi(r, n, d, s),
          Li());
        var Z = r.memoizedState;
        b !== pe ||
        B !== Z ||
        yr ||
        (a !== null && a.dependencies !== null && Dn(a.dependencies))
          ? (typeof k == "function" && (ad(r, i, k, n), (Z = r.memoizedState)),
            (ae =
              yr ||
              Xf(r, i, ae, n, B, Z, R) ||
              (a !== null && a.dependencies !== null && Dn(a.dependencies)))
              ? (Y ||
                  (typeof d.UNSAFE_componentWillUpdate != "function" &&
                    typeof d.componentWillUpdate != "function") ||
                  (typeof d.componentWillUpdate == "function" &&
                    d.componentWillUpdate(n, Z, R),
                  typeof d.UNSAFE_componentWillUpdate == "function" &&
                    d.UNSAFE_componentWillUpdate(n, Z, R)),
                typeof d.componentDidUpdate == "function" && (r.flags |= 4),
                typeof d.getSnapshotBeforeUpdate == "function" &&
                  (r.flags |= 1024))
              : (typeof d.componentDidUpdate != "function" ||
                  (b === a.memoizedProps && B === a.memoizedState) ||
                  (r.flags |= 4),
                typeof d.getSnapshotBeforeUpdate != "function" ||
                  (b === a.memoizedProps && B === a.memoizedState) ||
                  (r.flags |= 1024),
                (r.memoizedProps = n),
                (r.memoizedState = Z)),
            (d.props = n),
            (d.state = Z),
            (d.context = R),
            (n = ae))
          : (typeof d.componentDidUpdate != "function" ||
              (b === a.memoizedProps && B === a.memoizedState) ||
              (r.flags |= 4),
            typeof d.getSnapshotBeforeUpdate != "function" ||
              (b === a.memoizedProps && B === a.memoizedState) ||
              (r.flags |= 1024),
            (n = !1));
      }
      return (
        (d = n),
        Vl(a, r),
        (n = (r.flags & 128) !== 0),
        d || n
          ? ((d = r.stateNode),
            (i =
              n && typeof i.getDerivedStateFromError != "function"
                ? null
                : d.render()),
            (r.flags |= 1),
            a !== null && n
              ? ((r.child = nl(r, a.child, null, s)),
                (r.child = nl(r, null, i, s)))
              : mt(a, r, i, s),
            (r.memoizedState = d.state),
            (a = r.child))
          : (a = Qo(a, r, s)),
        a
      );
    }
    function sm(a, r, i, n) {
      return (Jr(), (r.flags |= 256), mt(a, r, i, n), r.child);
    }
    var id = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null,
    };
    function nd(a) {
      return { baseLanes: a, cachePool: K0() };
    }
    function sd(a, r, i) {
      return ((a = a !== null ? a.childLanes & ~i : 0), r && (a |= Ft), a);
    }
    function cm(a, r, i) {
      var n = r.pendingProps,
        s = !1,
        d = (r.flags & 128) !== 0,
        b;
      if (
        ((b = d) ||
          (b =
            a !== null && a.memoizedState === null
              ? !1
              : (kt.current & 2) !== 0),
        b && ((s = !0), (r.flags &= -129)),
        (b = (r.flags & 32) !== 0),
        (r.flags &= -33),
        a === null)
      ) {
        if (ba) {
          if (
            (s ? Sr(r) : kr(),
            (a = Ba)
              ? ((a = Rh(a, io)),
                (a = a !== null && a.data !== "&" ? a : null),
                a !== null &&
                  ((r.memoizedState = {
                    dehydrated: a,
                    treeContext: mr !== null ? { id: Po, overflow: _o } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (i = V0(a)),
                  (i.return = r),
                  (r.child = i),
                  (pt = r),
                  (Ba = null)))
              : (a = null),
            a === null)
          )
            throw pr(r);
          return (nu(a) ? (r.lanes = 32) : (r.lanes = 536870912), null);
        }
        return (
          (d = n.children),
          (n = n.fallback),
          s
            ? (kr(),
              (s = r.mode),
              (d = es({ mode: "hidden", children: d }, s)),
              (n = Qr(n, s, i, null)),
              (d.return = r),
              (n.return = r),
              (d.sibling = n),
              (r.child = d),
              (n = r.child),
              (n.memoizedState = nd(i)),
              (n.childLanes = sd(a, b, i)),
              (r.memoizedState = id),
              $i(null, n))
            : (Sr(r), cd(r, d))
        );
      }
      var k = a.memoizedState;
      if (k !== null) {
        var R = k.dehydrated;
        if (R !== null) return u2(a, r, d, b, n, R, k, i);
      }
      return s
        ? (kr(),
          (s = n.fallback),
          (d = r.mode),
          (k = a.child),
          (R = k.sibling),
          (n = Xo(k, { mode: "hidden", children: n.children })),
          (n.subtreeFlags = k.subtreeFlags & 1206910976),
          R !== null
            ? (s = Xo(R, s))
            : ((s = Qr(s, d, i, null)), (s.flags |= 2)),
          (s.return = r),
          (n.return = r),
          (n.sibling = s),
          (r.child = n),
          $i(null, n),
          (n = r.child),
          (s = a.child.memoizedState),
          s === null
            ? (s = nd(i))
            : ((d = s.cachePool),
              d !== null
                ? ((k = lt._currentValue),
                  (d = d.parent !== k ? { parent: k, pool: k } : d))
                : (d = K0()),
              (s = { baseLanes: s.baseLanes | i, cachePool: d })),
          (n.memoizedState = s),
          (n.childLanes = sd(a, b, i)),
          (r.memoizedState = id),
          $i(a.child, n))
        : (Sr(r),
          (i = a.child),
          (a = i.sibling),
          (i = Xo(i, { mode: "visible", children: n.children })),
          (i.return = r),
          (i.sibling = null),
          a !== null &&
            ((b = r.deletions),
            b === null ? ((r.deletions = [a]), (r.flags |= 16)) : b.push(a)),
          (r.child = i),
          (r.memoizedState = null),
          i);
    }
    function cd(a, r) {
      return (
        (r = es({ mode: "visible", children: r }, a.mode)),
        (r.return = a),
        (a.child = r)
      );
    }
    function es(a, r) {
      return ((a = zt(22, a, null, r)), (a.lanes = 0), a);
    }
    function as(a, r, i) {
      return (
        nl(r, a.child, null, i),
        (a = cd(r, r.pendingProps.children)),
        (a.flags |= 2),
        (r.memoizedState = null),
        a
      );
    }
    function u2(a, r, i, n, s, d, b, k) {
      if (i)
        return r.flags & 256
          ? (Sr(r), (r.flags &= -257), as(a, r, k))
          : r.memoizedState !== null
            ? (kr(), (r.child = a.child), (r.flags |= 128), null)
            : (kr(),
              (d = s.fallback),
              (b = r.mode),
              (s = es({ mode: "visible", children: s.children }, b)),
              (d = Qr(d, b, k, null)),
              (d.flags |= 2),
              (s.return = r),
              (d.return = r),
              (s.sibling = d),
              (r.child = s),
              nl(r, a.child, null, k),
              (s = r.child),
              (s.memoizedState = nd(k)),
              (s.childLanes = sd(a, n, k)),
              (r.memoizedState = id),
              $i(null, s));
      if ((Sr(r), nu(d))) {
        if (((n = d.nextSibling && d.nextSibling.dataset), n)) var R = n.dgst;
        return (
          (n = R),
          n !== "" &&
            ((s = Error(o(419))),
            (s.stack = ""),
            (s.digest = n),
            Ri({ value: s, source: null, stack: null })),
          as(a, r, k)
        );
      }
      if ((nt || al(a, r, k, !1), (n = (k & a.childLanes) !== 0), nt || n)) {
        if (Tr.current !== null) return as(a, r, k);
        if (
          ((n = La),
          n !== null && ((s = nr(n, k)), s !== 0 && s !== b.retryLane))
        )
          throw ((b.retryLane = s), Zr(a, s), Bt(n, a, s), rd);
        return (iu(d) || vs(), as(a, r, k));
      }
      return iu(d)
        ? ((r.flags |= 192), (r.child = a.child), null)
        : ((a = b.treeContext),
          (Ba = so(d.nextSibling)),
          (pt = r),
          (ba = !0),
          (hr = null),
          (io = !1),
          a !== null && Y0(r, a),
          (r = cd(r, s.children)),
          (r.flags |= 134221824),
          r);
    }
    function dm(a, r, i) {
      a.lanes |= r;
      var n = a.alternate;
      (n !== null && (n.lanes |= r), xn(a.return, r, i));
    }
    function um(a) {
      for (var r = null; a !== null; ) {
        var i = a.alternate;
        (i !== null && Un(i) === null && (r = a), (a = a.sibling));
      }
      return r;
    }
    function ts(a, r, i, n, s, d) {
      var b = a.memoizedState;
      b === null
        ? (a.memoizedState = {
            isBackwards: r,
            rendering: null,
            renderingStartTime: 0,
            last: n,
            tail: i,
            tailMode: s,
            treeForkCount: d,
          })
        : ((b.isBackwards = r),
          (b.rendering = null),
          (b.renderingStartTime = 0),
          (b.last = n),
          (b.tail = i),
          (b.tailMode = s),
          (b.treeForkCount = d));
    }
    function dd(a) {
      var r = a.child;
      for (a.child = null; r !== null; ) {
        var i = r.sibling;
        ((r.sibling = a.child), (a.child = r), (r = i));
      }
    }
    function ud(a, r, i) {
      var n = r.pendingProps,
        s = n.revealOrder,
        d = n.tail;
      n = n.children;
      var b = kt.current;
      if (r.flags & 128) return (qi(r, b), null);
      var k = (b & 2) !== 0;
      if (
        (k ? ((b = (b & 1) | 2), (r.flags |= 128)) : (b &= 1),
        qi(r, b),
        s === "backwards" && a !== null
          ? (dd(a), mt(a, r, n, i), dd(a))
          : mt(a, r, n, i),
        (n = ba ? Ni : 0),
        !k && a !== null && (a.flags & 128) !== 0)
      )
        e: for (a = r.child; a !== null; ) {
          if (a.tag === 13) a.memoizedState !== null && dm(a, i, r);
          else if (a.tag === 19) dm(a, i, r);
          else if (a.child !== null) {
            ((a.child.return = a), (a = a.child));
            continue;
          }
          if (a === r) break e;
          for (; a.sibling === null; ) {
            if (a.return === null || a.return === r) break e;
            a = a.return;
          }
          ((a.sibling.return = a.return), (a = a.sibling));
        }
      switch (s) {
        case "backwards":
          ((i = um(r.child)),
            i === null
              ? ((s = r.child), (r.child = null))
              : ((s = i.sibling), (i.sibling = null), dd(r)),
            ts(r, !0, s, null, d, n));
          break;
        case "unstable_legacy-backwards":
          for (i = null, s = r.child, r.child = null; s !== null; ) {
            if (((a = s.alternate), a !== null && Un(a) === null)) {
              r.child = s;
              break;
            }
            ((a = s.sibling), (s.sibling = i), (i = s), (s = a));
          }
          ts(r, !0, i, null, d, n);
          break;
        case "together":
          ts(r, !1, null, null, void 0, n);
          break;
        case "independent":
          r.memoizedState = null;
          break;
        default:
          ((i = um(r.child)),
            i === null
              ? ((s = r.child), (r.child = null))
              : ((s = i.sibling), (i.sibling = null)),
            ts(r, !1, s, i, d, n));
      }
      return r.child;
    }
    function fm(a, r, i) {
      var n = r.pendingProps;
      return (gr(r, r.type, n.value), mt(a, r, n.children, i), r.child);
    }
    function Qo(a, r, i) {
      if (
        (a !== null && (r.dependencies = a.dependencies),
        (_r |= r.lanes),
        (i & r.childLanes) === 0)
      )
        if (a !== null) {
          if ((al(a, r, i, !1), (i & r.childLanes) === 0)) return null;
        } else return null;
      if (a !== null && r.child !== a.child) throw Error(o(153));
      if (r.child !== null) {
        for (
          a = r.child, i = Xo(a, a.pendingProps), r.child = i, i.return = r;
          a.sibling !== null;

        )
          ((a = a.sibling),
            (i = i.sibling = Xo(a, a.pendingProps)),
            (i.return = r));
        i.sibling = null;
      }
      return r.child;
    }
    function fd(a, r) {
      return (a.lanes & r) !== 0
        ? !0
        : ((a = a.dependencies), !!(a !== null && Dn(a)));
    }
    function f2(a, r, i) {
      switch (r.tag) {
        case 3:
          (Se(r, r.stateNode.containerInfo),
            gr(r, lt, a.memoizedState.cache),
            Jr());
          break;
        case 27:
        case 5:
          fa(r);
          break;
        case 4:
          Se(r, r.stateNode.containerInfo);
          break;
        case 10:
          gr(r, r.type, r.memoizedProps.value);
          break;
        case 31:
          if (r.memoizedState !== null) return ((r.flags |= 128), Lc(r), null);
          break;
        case 13:
          var n = r.memoizedState;
          if (n !== null) {
            if (n.dehydrated !== null) return (Sr(r), (r.flags |= 128), null);
            n = al(a, r, i, !1);
            var s = r.child.childLanes;
            return n || (i & s) !== 0
              ? cm(a, r, i)
              : (Sr(r), (a = Qo(a, r, i)), a !== null ? a.sibling : null);
          }
          Sr(r);
          break;
        case 19:
          if (r.flags & 128) return ud(a, r, i);
          if (
            ((s = (a.flags & 128) !== 0),
            (n = (i & r.childLanes) !== 0),
            n || (al(a, r, i, !1), (n = (i & r.childLanes) !== 0)),
            s)
          ) {
            if (n) return ud(a, r, i);
            r.flags |= 128;
          }
          if (
            ((s = r.memoizedState),
            s !== null &&
              ((s.rendering = null), (s.tail = null), (s.lastEffect = null)),
            qi(r, kt.current),
            n)
          )
            break;
          return null;
        case 22:
          return ((r.lanes = 0), om(a, r, i, r.pendingProps));
        case 24:
          gr(r, lt, a.memoizedState.cache);
      }
      return Qo(a, r, i);
    }
    function mm(a, r, i) {
      if (a !== null)
        if (a.memoizedProps !== r.pendingProps) nt = !0;
        else {
          if (!fd(a, i) && (r.flags & 128) === 0)
            return ((nt = !1), f2(a, r, i));
          nt = (a.flags & 131072) !== 0;
        }
      else ((nt = !1), ba && (r.flags & 1048576) !== 0 && $0(r, Ni, r.index));
      switch (((r.lanes = 0), r.tag)) {
        case 16:
          e: {
            var n = r.pendingProps;
            if (((a = ll(r.elementType)), (r.type = a), typeof a == "function"))
              vc(a)
                ? ((n = cl(a, n)), (r.tag = 1), (r = nm(null, r, a, n, i)))
                : ((r.tag = 0), (r = ld(null, r, a, n, i)));
            else {
              if (a != null) {
                var s = a.$$typeof;
                if (s === G) {
                  ((r.tag = 11), (r = em(null, r, a, n, i)));
                  break e;
                } else if (s === le) {
                  ((r.tag = 14), (r = am(null, r, a, n, i)));
                  break e;
                } else if (s === ke) {
                  ((r.tag = 10), (r.type = a), (r = fm(null, r, i)));
                  break e;
                }
              }
              throw ((r = Fe(a) || a), Error(o(306, r, "")));
            }
          }
          return r;
        case 0:
          return ld(a, r, r.type, r.pendingProps, i);
        case 1:
          return ((n = r.type), (s = cl(n, r.pendingProps)), nm(a, r, n, s, i));
        case 3:
          e: {
            if ((Se(r, r.stateNode.containerInfo), a === null))
              throw Error(o(387));
            n = r.pendingProps;
            var d = r.memoizedState;
            ((s = d.element), jc(a, r), Oi(r, n, null, i));
            var b = r.memoizedState;
            if (
              ((n = b.cache),
              gr(r, lt, n),
              n !== d.cache && Pc(r, [lt], i, !0),
              Li(),
              (n = b.element),
              d.isDehydrated)
            )
              if (
                ((d = { element: n, isDehydrated: !1, cache: b.cache }),
                (r.updateQueue.baseState = d),
                (r.memoizedState = d),
                r.flags & 256)
              ) {
                r = sm(a, r, n, i);
                break e;
              } else if (n !== s) {
                ((s = oo(Error(o(424)), r)), Ri(s), (r = sm(a, r, n, i)));
                break e;
              } else {
                switch (((a = r.stateNode.containerInfo), a.nodeType)) {
                  case 9:
                    a = a.body;
                    break;
                  default:
                    a = a.nodeName === "HTML" ? a.ownerDocument.body : a;
                }
                for (
                  Ba = so(a.firstChild),
                    pt = r,
                    ba = !0,
                    hr = null,
                    io = !0,
                    i = tf(r, null, n, i),
                    r.child = i;
                  i;

                )
                  ((i.flags = (i.flags & -3) | 134221824), (i = i.sibling));
              }
            else {
              if ((Jr(), n === s)) {
                r = Qo(a, r, i);
                break e;
              }
              mt(a, r, n, i);
            }
            r = r.child;
          }
          return r;
        case 26:
          return (
            Vl(a, r),
            a === null
              ? (i = Oh(r.type, null, r.pendingProps, null))
                ? (r.memoizedState = i)
                : ba ||
                  (r.stateNode = bh(r.type, r.pendingProps, je.current, r))
              : (r.memoizedState = Oh(
                  r.type,
                  a.memoizedProps,
                  r.pendingProps,
                  a.memoizedState,
                )),
            null
          );
        case 27:
          return (
            fa(r),
            a === null &&
              ba &&
              ((n = r.stateNode = Dh(r.type, r.pendingProps, je.current)),
              (pt = r),
              (io = !0),
              (s = Ba),
              Rr(r.type) ? ((su = s), (Ba = so(n.firstChild))) : (Ba = s)),
            mt(a, r, r.pendingProps.children, i),
            Vl(a, r),
            a === null && (r.flags |= 4194304),
            r.child
          );
        case 5:
          return (
            a === null &&
              ba &&
              ((s = n = Ba) &&
                ((n = i5(n, r.type, r.pendingProps, io)),
                n !== null
                  ? ((r.stateNode = n),
                    (pt = r),
                    (Ba = so(n.firstChild)),
                    (io = !1),
                    (s = !0))
                  : (s = !1)),
              s || pr(r)),
            fa(r),
            (s = r.type),
            (d = r.pendingProps),
            (b = a !== null ? a.memoizedProps : null),
            (n = d.children),
            Jd(s, d) ? (n = null) : b !== null && Jd(s, b) && (r.flags |= 32),
            r.memoizedState !== null &&
              ((s = Bc(a, r, a2, null, null, i)), (li._currentValue = s)),
            Vl(a, r),
            mt(a, r, n, i),
            r.child
          );
        case 6:
          return (
            a === null &&
              ba &&
              ((a = i = Ba) &&
                ((i = n5(i, r.pendingProps, io)),
                i !== null
                  ? ((r.stateNode = i), (pt = r), (Ba = null), (a = !0))
                  : (a = !1)),
              a || pr(r)),
            null
          );
        case 13:
          return cm(a, r, i);
        case 4:
          return (
            Se(r, r.stateNode.containerInfo),
            (n = r.pendingProps),
            a === null ? (r.child = nl(r, null, n, i)) : mt(a, r, n, i),
            r.child
          );
        case 11:
          return em(a, r, r.type, r.pendingProps, i);
        case 7:
          return ((n = r.pendingProps), Vl(a, r), mt(a, r, n, i), r.child);
        case 8:
          return (mt(a, r, r.pendingProps.children, i), r.child);
        case 12:
          return (mt(a, r, r.pendingProps.children, i), r.child);
        case 10:
          return fm(a, r, i);
        case 9:
          return (
            (s = r.type._context),
            (n = r.pendingProps.children),
            tl(r),
            (s = Tt(s)),
            (n = n(s)),
            (r.flags |= 1),
            mt(a, r, n, i),
            r.child
          );
        case 14:
          return am(a, r, r.type, r.pendingProps, i);
        case 15:
          return tm(a, r, r.type, r.pendingProps, i);
        case 19:
          return ud(a, r, i);
        case 31:
          return d2(a, r, i);
        case 22:
          return om(a, r, i, r.pendingProps);
        case 24:
          return (
            tl(r),
            (n = Tt(lt)),
            a === null
              ? ((s = Ec()),
                s === null &&
                  ((s = La),
                  (d = _c()),
                  (s.pooledCache = d),
                  d.refCount++,
                  d !== null && (s.pooledCacheLanes |= i),
                  (s = d)),
                (r.memoizedState = { parent: n, cache: s }),
                Rc(r),
                gr(r, lt, s))
              : ((a.lanes & i) !== 0 && (jc(a, r), Oi(r, null, null, i), Li()),
                (s = a.memoizedState),
                (d = r.memoizedState),
                s.parent !== n
                  ? ((s = { parent: n, cache: n }),
                    (r.memoizedState = s),
                    r.lanes === 0 &&
                      (r.memoizedState = r.updateQueue.baseState = s),
                    gr(r, lt, n))
                  : ((n = d.cache),
                    gr(r, lt, n),
                    n !== s.cache && Pc(r, [lt], i, !0))),
            mt(a, r, r.pendingProps.children, i),
            r.child
          );
        case 30:
          return (
            r.stateNode === null &&
              (r.stateNode = {
                autoName: null,
                paired: null,
                clones: null,
                ref: null,
              }),
            (n = r.pendingProps),
            n.name != null && n.name !== "auto"
              ? (r.flags |= a === null ? 18882560 : 18874368)
              : ba && Rn(r),
            a !== null && a.memoizedProps.name !== n.name
              ? (r.flags |= 4194816)
              : Vl(a, r),
            mt(a, r, n.children, i),
            r.child
          );
        case 29:
          throw r.pendingProps;
      }
      throw Error(o(156, r.tag));
    }
    function Jo(a) {
      a.flags |= 4;
    }
    function md(a, r, i, n, s) {
      var d;
      if (
        ((d = (a.mode & 32) !== 0) &&
          (d =
            i === null
              ? Uh(r, n)
              : Uh(r, n) && (n.src !== i.src || n.srcSet !== i.srcSet)),
        d)
      ) {
        if (((a.flags |= 16777216), (s & 335544128) === s))
          if (a.stateNode.complete) a.flags |= 8192;
          else if (Hm()) a.flags |= 8192;
          else throw ((il = On), Nc);
      } else a.flags &= -16777217;
    }
    function hm(a, r) {
      if (r.type !== "stylesheet" || (r.state.loading & 4) !== 0)
        a.flags &= -16777217;
      else if (((a.flags |= 16777216), !$h(r)))
        if (Hm()) a.flags |= 8192;
        else throw ((il = On), Nc);
    }
    function os(a, r) {
      (r !== null && (a.flags |= 4),
        a.flags & 16384 &&
          ((r = a.tag !== 22 ? bn() : 536870912), (a.lanes |= r), (Xl |= r)));
    }
    function Yi(a, r) {
      if (!ba)
        switch (a.tailMode) {
          case "visible":
            break;
          case "collapsed":
            for (var i = a.tail, n = null; i !== null; )
              (i.alternate !== null && (n = i), (i = i.sibling));
            n === null
              ? r || a.tail === null
                ? (a.tail = null)
                : (a.tail.sibling = null)
              : (n.sibling = null);
            break;
          default:
            for (r = a.tail, i = null; r !== null; )
              (r.alternate !== null && (i = r), (r = r.sibling));
            i === null ? (a.tail = null) : (i.sibling = null);
        }
    }
    function Va(a) {
      var r = a.alternate !== null && a.alternate.child === a.child,
        i = 0,
        n = 0;
      if (r)
        for (var s = a.child; s !== null; )
          ((i |= s.lanes | s.childLanes),
            (n |= s.subtreeFlags & 1206910976),
            (n |= s.flags & 1206910976),
            (s.return = a),
            (s = s.sibling));
      else
        for (s = a.child; s !== null; )
          ((i |= s.lanes | s.childLanes),
            (n |= s.subtreeFlags),
            (n |= s.flags),
            (s.return = a),
            (s = s.sibling));
      return ((a.subtreeFlags |= n), (a.childLanes = i), r);
    }
    function m2(a, r, i) {
      var n = r.pendingProps;
      switch ((Sc(r), r.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (Va(r), null);
        case 1:
          return (Va(r), null);
        case 3:
          return (
            (i = r.stateNode),
            (n = null),
            a !== null && (n = a.memoizedState.cache),
            r.memoizedState.cache !== n && (r.flags |= 2048),
            Wo(lt),
            Ae(),
            i.pendingContext &&
              ((i.context = i.pendingContext), (i.pendingContext = null)),
            (a === null || a.child === null) &&
              (Dl(r)
                ? Jo(r)
                : a === null ||
                  (a.memoizedState.isDehydrated && (r.flags & 256) === 0) ||
                  ((r.flags |= 1024), Mc())),
            Va(r),
            null
          );
        case 26:
          var s = r.type,
            d = r.memoizedState;
          return (
            a === null
              ? (Jo(r),
                d !== null ? (Va(r), hm(r, d)) : (Va(r), md(r, s, null, n, i)))
              : d
                ? d !== a.memoizedState
                  ? (Jo(r), Va(r), hm(r, d))
                  : (Va(r), (r.flags &= -16777217))
                : ((a = a.memoizedProps),
                  a !== n && Jo(r),
                  Va(r),
                  md(r, s, a, n, i)),
            null
          );
        case 27:
          if (
            (Oe(r),
            (i = je.current),
            (s = r.type),
            a !== null && r.stateNode != null)
          )
            a.memoizedProps !== n && Jo(r);
          else {
            if (!n) {
              if (r.stateNode === null) throw Error(o(166));
              return (Va(r), (r.subtreeFlags &= -33554433), null);
            }
            ((a = ga.current),
              Dl(r) ? G0(r) : ((a = Dh(s, n, i)), (r.stateNode = a), Jo(r)));
          }
          return (Va(r), (r.subtreeFlags &= -33554433), null);
        case 5:
          if ((Oe(r), (s = r.type), a !== null && r.stateNode != null))
            a.memoizedProps !== n && Jo(r);
          else {
            if (!n) {
              if (r.stateNode === null) throw Error(o(166));
              return (Va(r), (r.subtreeFlags &= -33554433), null);
            }
            if (((d = ga.current), Dl(r))) G0(r);
            else {
              var b = an(je.current);
              switch (d) {
                case 1:
                  d = b.createElementNS("http://www.w3.org/2000/svg", s);
                  break;
                case 2:
                  d = b.createElementNS(
                    "http://www.w3.org/1998/Math/MathML",
                    s,
                  );
                  break;
                default:
                  switch (s) {
                    case "svg":
                      d = b.createElementNS("http://www.w3.org/2000/svg", s);
                      break;
                    case "math":
                      d = b.createElementNS(
                        "http://www.w3.org/1998/Math/MathML",
                        s,
                      );
                      break;
                    case "script":
                      ((d = b.createElement("div")),
                        (d.innerHTML = "<script><\/script>"),
                        (d = d.removeChild(d.firstChild)));
                      break;
                    case "select":
                      ((d =
                        typeof n.is == "string"
                          ? b.createElement("select", { is: n.is })
                          : b.createElement("select")),
                        n.multiple
                          ? (d.multiple = !0)
                          : n.size && (d.size = n.size));
                      break;
                    default:
                      d =
                        typeof n.is == "string"
                          ? b.createElement(s, { is: n.is })
                          : b.createElement(s);
                  }
              }
              ((d[dt] = r), (d[ut] = n));
              e: for (b = r.child; b !== null; ) {
                if (b.tag === 5 || b.tag === 6) d.appendChild(b.stateNode);
                else if (b.tag !== 4 && b.tag !== 27 && b.child !== null) {
                  ((b.child.return = b), (b = b.child));
                  continue;
                }
                if (b === r) break e;
                for (; b.sibling === null; ) {
                  if (b.return === null || b.return === r) break e;
                  b = b.return;
                }
                ((b.sibling.return = b.return), (b = b.sibling));
              }
              r.stateNode = d;
              e: switch ((Ct(d, s, n), s)) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  n = !!n.autoFocus;
                  break e;
                case "img":
                  n = !0;
                  break e;
                default:
                  n = !1;
              }
              n && Jo(r);
            }
          }
          return (
            Va(r),
            (r.subtreeFlags &= -33554433),
            md(
              r,
              r.type,
              a === null ? null : a.memoizedProps,
              r.pendingProps,
              i,
            ),
            null
          );
        case 6:
          if (a && r.stateNode != null) a.memoizedProps !== n && Jo(r);
          else {
            if (typeof n != "string" && r.stateNode === null)
              throw Error(o(166));
            if (((a = je.current), Dl(r))) {
              if (
                ((a = r.stateNode),
                (i = r.memoizedProps),
                (n = null),
                (s = pt),
                s !== null)
              )
                switch (s.tag) {
                  case 27:
                  case 5:
                    n = s.memoizedProps;
                }
              ((a[dt] = r),
                (a = !!(
                  a.nodeValue === i ||
                  (n !== null && n.suppressHydrationWarning === !0) ||
                  mh(a.nodeValue, i)
                )),
                a || pr(r, !0));
            } else
              ((a = an(a).createTextNode(n)), (a[dt] = r), (r.stateNode = a));
          }
          return (Va(r), null);
        case 31:
          if (((i = r.memoizedState), a === null || a.memoizedState !== null)) {
            if (((n = Dl(r)), i !== null)) {
              if (a === null) {
                if (!n) throw Error(o(318));
                if (
                  ((a = r.memoizedState),
                  (a = a !== null ? a.dehydrated : null),
                  !a)
                )
                  throw Error(o(557));
                a[dt] = r;
              } else
                (Jr(),
                  (r.flags & 128) === 0 && (r.memoizedState = null),
                  (r.flags |= 4));
              (Va(r), (a = !1));
            } else
              ((i = Mc()),
                a !== null &&
                  a.memoizedState !== null &&
                  (a.memoizedState.hydrationErrors = i),
                (a = !0));
            if (!a) return r.flags & 256 ? (Yt(r), r) : (Yt(r), null);
            if ((r.flags & 128) !== 0) throw Error(o(558));
          }
          return (Va(r), null);
        case 13:
          if (
            ((n = r.memoizedState),
            a === null ||
              (a.memoizedState !== null && a.memoizedState.dehydrated !== null))
          ) {
            if (((s = Dl(r)), n !== null && n.dehydrated !== null)) {
              if (a === null) {
                if (!s) throw Error(o(318));
                if (
                  ((s = r.memoizedState),
                  (s = s !== null ? s.dehydrated : null),
                  !s)
                )
                  throw Error(o(317));
                s[dt] = r;
              } else
                (Jr(),
                  (r.flags & 128) === 0 && (r.memoizedState = null),
                  (r.flags |= 4));
              (Va(r), (s = !1));
            } else
              ((s = Mc()),
                a !== null &&
                  a.memoizedState !== null &&
                  (a.memoizedState.hydrationErrors = s),
                (s = !0));
            if (!s) return r.flags & 256 ? (Yt(r), r) : (Yt(r), null);
          }
          return (
            Yt(r),
            (r.flags & 128) !== 0
              ? ((r.lanes = i), r)
              : ((i = n !== null),
                (a = a !== null && a.memoizedState !== null),
                i &&
                  ((n = r.child),
                  (s = null),
                  n.alternate !== null &&
                    n.alternate.memoizedState !== null &&
                    n.alternate.memoizedState.cachePool !== null &&
                    (s = n.alternate.memoizedState.cachePool.pool),
                  (d = null),
                  n.memoizedState !== null &&
                    n.memoizedState.cachePool !== null &&
                    (d = n.memoizedState.cachePool.pool),
                  d !== s && (n.flags |= 2048)),
                i !== a && i && (r.child.flags |= 8192),
                os(r, r.updateQueue),
                Va(r),
                null)
          );
        case 4:
          return (
            Ae(),
            a === null && Hd(r.stateNode.containerInfo),
            (r.flags |= 67108864),
            Va(r),
            null
          );
        case 10:
          return (Wo(r.type), Va(r), null);
        case 19:
          if ((Oc(r), (n = r.memoizedState), n === null)) return (Va(r), null);
          if (((s = (r.flags & 128) !== 0), (d = n.rendering), d === null))
            if (s) Yi(n, !1);
            else {
              if (Qa !== 0 || (a !== null && (a.flags & 128) !== 0))
                for (a = r.child; a !== null; ) {
                  if (((d = Un(a)), d !== null)) {
                    for (
                      r.flags |= 128,
                        Yi(n, !1),
                        a = d.updateQueue,
                        r.updateQueue = a,
                        os(r, a),
                        r.subtreeFlags = 0,
                        a = i,
                        i = r.child;
                      i !== null;

                    )
                      (B0(i, a), (i = i.sibling));
                    return (
                      qi(r, (kt.current & 1) | 2),
                      ba && Fo(r, n.treeForkCount),
                      r.child
                    );
                  }
                  a = a.sibling;
                }
              n.tail !== null &&
                ma() > ps &&
                ((r.flags |= 128), (s = !0), Yi(n, !1), (r.lanes = 4194304));
            }
          else {
            if (!s)
              if (((a = Un(d)), a !== null)) {
                if (
                  ((r.flags |= 128),
                  (s = !0),
                  (a = a.updateQueue),
                  (r.updateQueue = a),
                  os(r, a),
                  Yi(n, !0),
                  n.tail === null &&
                    n.tailMode !== "collapsed" &&
                    n.tailMode !== "visible" &&
                    !d.alternate &&
                    !ba)
                )
                  return (Va(r), null);
              } else
                2 * ma() - n.renderingStartTime > ps &&
                  i !== 536870912 &&
                  ((r.flags |= 128), (s = !0), Yi(n, !1), (r.lanes = 4194304));
            n.isBackwards
              ? ((d.sibling = r.child), (r.child = d))
              : ((a = n.last),
                a !== null ? (a.sibling = d) : (r.child = d),
                (n.last = d));
          }
          if (n.tail !== null) {
            a = n.tail;
            e: {
              for (i = a; i !== null; ) {
                if (i.alternate !== null) {
                  i = !1;
                  break e;
                }
                i = i.sibling;
              }
              i = !0;
            }
            return (
              (n.rendering = a),
              (n.tail = a.sibling),
              (n.renderingStartTime = ma()),
              (a.sibling = null),
              (d = kt.current),
              (d = s ? (d & 1) | 2 : d & 1),
              n.tailMode === "visible" || n.tailMode === "collapsed" || !i || ba
                ? qi(r, d)
                : ((i = d), oa(St, r), oa(kt, i), Pt === null && (Pt = r)),
              ba && Fo(r, n.treeForkCount),
              a
            );
          }
          return (Va(r), null);
        case 22:
        case 23:
          return (
            Yt(r),
            zc(),
            (n = r.memoizedState !== null),
            a !== null
              ? (a.memoizedState !== null) !== n && (r.flags |= 8192)
              : n && (r.flags |= 8192),
            n
              ? (i & 536870912) !== 0 &&
                (r.flags & 128) === 0 &&
                (Va(r), r.subtreeFlags & 6 && (r.flags |= 8192))
              : Va(r),
            (i = r.updateQueue),
            i !== null && os(r, i.retryQueue),
            (i = null),
            a !== null &&
              a.memoizedState !== null &&
              a.memoizedState.cachePool !== null &&
              (i = a.memoizedState.cachePool.pool),
            (n = null),
            r.memoizedState !== null &&
              r.memoizedState.cachePool !== null &&
              (n = r.memoizedState.cachePool.pool),
            n !== i && (r.flags |= 2048),
            a !== null && Sa(rl),
            null
          );
        case 24:
          return (
            (i = null),
            a !== null && (i = a.memoizedState.cache),
            r.memoizedState.cache !== i && (r.flags |= 2048),
            Wo(lt),
            Va(r),
            null
          );
        case 25:
          return null;
        case 30:
          return ((r.flags |= 33554432), Va(r), null);
      }
      throw Error(o(156, r.tag));
    }
    function h2(a, r) {
      switch ((Sc(r), r.tag)) {
        case 1:
          return (
            (a = r.flags),
            a & 65536 ? ((r.flags = (a & -65537) | 128), r) : null
          );
        case 3:
          return (
            Wo(lt),
            Ae(),
            (a = r.flags),
            (a & 65536) !== 0 && (a & 128) === 0
              ? ((r.flags = (a & -65537) | 128), r)
              : null
          );
        case 26:
        case 27:
        case 5:
          return (Oe(r), null);
        case 31:
          if (r.memoizedState !== null) {
            if ((Yt(r), r.alternate === null)) throw Error(o(340));
            Jr();
          }
          return (
            (a = r.flags),
            a & 65536 ? ((r.flags = (a & -65537) | 128), r) : null
          );
        case 13:
          if (
            (Yt(r), (a = r.memoizedState), a !== null && a.dehydrated !== null)
          ) {
            if (r.alternate === null) throw Error(o(340));
            Jr();
          }
          return (
            (a = r.flags),
            a & 65536 ? ((r.flags = (a & -65537) | 128), r) : null
          );
        case 19:
          return (
            Oc(r),
            (a = r.flags),
            a & 65536
              ? ((r.flags = (a & -65537) | 128),
                (a = r.memoizedState),
                a !== null && ((a.rendering = null), (a.tail = null)),
                (r.flags |= 4),
                r)
              : null
          );
        case 4:
          return (Ae(), null);
        case 10:
          return (Wo(r.type), null);
        case 22:
        case 23:
          return (
            Yt(r),
            zc(),
            a !== null && Sa(rl),
            (a = r.flags),
            a & 65536 ? ((r.flags = (a & -65537) | 128), r) : null
          );
        case 24:
          return (Wo(lt), null);
        case 25:
          return null;
        default:
          return null;
      }
    }
    function pm(a, r) {
      switch ((Sc(r), r.tag)) {
        case 3:
          (Wo(lt), Ae());
          break;
        case 26:
        case 27:
        case 5:
          Oe(r);
          break;
        case 4:
          Ae();
          break;
        case 31:
          r.memoizedState !== null && Yt(r);
          break;
        case 13:
          Yt(r);
          break;
        case 19:
          Oc(r);
          break;
        case 10:
          Wo(r.type);
          break;
        case 22:
        case 23:
          (Yt(r), zc(), a !== null && Sa(rl));
          break;
        case 24:
          Wo(lt);
      }
    }
    function Gi(a, r) {
      try {
        var i = r.updateQueue,
          n = i !== null ? i.lastEffect : null;
        if (n !== null) {
          var s = n.next;
          i = s;
          do {
            if ((i.tag & a) === a) {
              n = void 0;
              var d = i.create,
                b = i.inst;
              ((n = d()), (b.destroy = n));
            }
            i = i.next;
          } while (i !== s);
        }
      } catch (k) {
        ja(r, r.return, k);
      }
    }
    function Mr(a, r, i) {
      try {
        var n = r.updateQueue,
          s = n !== null ? n.lastEffect : null;
        if (s !== null) {
          var d = s.next;
          n = d;
          do {
            if ((n.tag & a) === a) {
              var b = n.inst,
                k = b.destroy;
              if (k !== void 0) {
                ((b.destroy = void 0), (s = r));
                var R = i,
                  Y = k;
                try {
                  Y();
                } catch (ae) {
                  ja(s, R, ae);
                }
              }
            }
            n = n.next;
          } while (n !== d);
        }
      } catch (ae) {
        ja(r, r.return, ae);
      }
    }
    function gm(a) {
      var r = a.updateQueue;
      if (r !== null) {
        var i = a.stateNode;
        try {
          rf(r, i);
        } catch (n) {
          ja(a, a.return, n);
        }
      }
    }
    function bm(a, r, i) {
      ((i.props = cl(a.type, a.memoizedProps)), (i.state = a.memoizedState));
      try {
        i.componentWillUnmount();
      } catch (n) {
        ja(a, r, n);
      }
    }
    function Ao(a, r) {
      try {
        var i = a.ref;
        if (i !== null) {
          switch (a.tag) {
            case 26:
            case 27:
            case 5:
              var n = a.stateNode;
              break;
            case 30:
              var s = a.stateNode,
                d = Yo(a.memoizedProps, s);
              ((s.ref === null || s.ref.name !== d) && (s.ref = Mh(d)),
                (n = s.ref));
              break;
            case 7:
              if (a.stateNode === null) {
                var b = new Wt(a);
                (v(a.child, !1, r5, b, void 0, void 0), (a.stateNode = b));
              }
              n = a.stateNode;
              break;
            default:
              n = a.stateNode;
          }
          typeof i == "function" ? (a.refCleanup = i(n)) : (i.current = n);
        }
      } catch (k) {
        ja(a, r, k);
      }
    }
    function Mt(a, r) {
      var i = a.ref,
        n = a.refCleanup;
      if (i !== null)
        if (typeof n == "function")
          try {
            n();
          } catch (s) {
            ja(a, r, s);
          } finally {
            ((a.refCleanup = null),
              (a = a.alternate),
              a != null && (a.refCleanup = null));
          }
        else if (typeof i == "function")
          try {
            i(null);
          } catch (s) {
            ja(a, r, s);
          }
        else i.current = null;
    }
    function rs(a, r) {
      if (
        (a.tag === 5 || a.tag === 27 || a.tag === 6) &&
        a.alternate === null &&
        r !== null
      )
        for (var i = 0; i < r.length; i++) Nh(a.stateNode, r[i]);
    }
    function ym(a) {
      for (
        var r = a.return;
        r !== null && (pd(r) && Nh(a.stateNode, r.stateNode), !hd(r));

      )
        r = r.return;
    }
    function Xi(a) {
      for (
        var r = a.return;
        r !== null && (pd(r) && l5(a.stateNode, r.stateNode), !hd(r));

      )
        r = r.return;
    }
    function hd(a) {
      return a.tag === 5 || a.tag === 3 || a.tag === 27;
    }
    function pd(a) {
      return a && a.tag === 7 && a.stateNode !== null;
    }
    function gd(a) {
      var r = a.type,
        i = a.memoizedProps,
        n = a.stateNode;
      try {
        e: switch (r) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            i.autoFocus && n.focus();
            break e;
          case "img":
            i.src ? (n.src = i.src) : i.srcSet && (n.srcset = i.srcSet);
        }
      } catch (s) {
        ja(a, a.return, s);
      }
    }
    function bd(a, r, i) {
      try {
        var n = a.stateNode;
        (B2(n, a.type, i, r), (n[ut] = r));
      } catch (s) {
        ja(a, a.return, s);
      }
    }
    function vm(a) {
      return (
        a.tag === 5 ||
        a.tag === 3 ||
        a.tag === 26 ||
        (a.tag === 27 && Rr(a.type)) ||
        a.tag === 4
      );
    }
    function yd(a) {
      e: for (;;) {
        for (; a.sibling === null; ) {
          if (a.return === null || vm(a.return)) return null;
          a = a.return;
        }
        for (
          a.sibling.return = a.return, a = a.sibling;
          a.tag !== 5 && a.tag !== 6 && a.tag !== 18;

        ) {
          if (
            (a.tag === 27 && Rr(a.type)) ||
            a.flags & 2 ||
            a.child === null ||
            a.tag === 4
          )
            continue e;
          ((a.child.return = a), (a = a.child));
        }
        if (!(a.flags & 2)) return a.stateNode;
      }
    }
    function vd(a, r, i, n) {
      var s = a.tag;
      if (s === 5 || s === 6)
        ((s = a.stateNode),
          r
            ? (i.nodeType === 9
                ? i.body
                : i.nodeName === "HTML"
                  ? i.ownerDocument.body
                  : i
              ).insertBefore(s, r)
            : ((r =
                i.nodeType === 9
                  ? i.body
                  : i.nodeName === "HTML"
                    ? i.ownerDocument.body
                    : i),
              r.appendChild(s),
              (i = i._reactRootContainer),
              i != null || r.onclick !== null || (r.onclick = va)),
          rs(a, n),
          (F = !0));
      else if (
        s !== 4 &&
        (s === 27 &&
          (rs(a, n), (n = null), Rr(a.type) && ((i = a.stateNode), (r = null))),
        (a = a.child),
        a !== null)
      )
        for (vd(a, r, i, n), a = a.sibling; a !== null; )
          (vd(a, r, i, n), (a = a.sibling));
    }
    function ls(a, r, i, n) {
      var s = a.tag;
      if (s === 5 || s === 6)
        ((s = a.stateNode),
          r ? i.insertBefore(s, r) : i.appendChild(s),
          rs(a, n),
          (F = !0));
      else if (
        s !== 4 &&
        (s === 27 && (rs(a, n), (n = null), Rr(a.type) && (i = a.stateNode)),
        (a = a.child),
        a !== null)
      )
        for (ls(a, r, i, n), a = a.sibling; a !== null; )
          (ls(a, r, i, n), (a = a.sibling));
    }
    function wm(a) {
      var r = a.stateNode,
        i = a.memoizedProps;
      try {
        for (var n = a.type, s = r.attributes; s.length; )
          r.removeAttributeNode(s[0]);
        (Ct(r, n, i), (r[dt] = a), (r[ut] = i));
      } catch (d) {
        ja(a, a.return, d);
      }
    }
    var is = !1,
      Gt = null;
    function Tm(a) {
      (a.tag === 30 || (a.subtreeFlags & 33554432) !== 0) && (is = !0);
    }
    var Eo = null;
    function Sm() {
      var a = Eo;
      return ((Eo = null), a);
    }
    var Lt = 0;
    function Ul(a, r, i, n, s) {
      return ((Lt = 0), km(a.child, r, i, n, s));
    }
    function km(a, r, i, n, s) {
      for (var d = !1; a !== null; ) {
        if (a.tag === 5) {
          var b = a.stateNode;
          if (n !== null) {
            var k = tu(b);
            (n.push(k), k.view && (d = !0));
          } else d || (tu(b).view && (d = !0));
          ((is = !0), Sh(b, Lt === 0 ? r : r + "_" + Lt, i), Lt++);
        } else
          (a.tag !== 22 || a.memoizedState === null) &&
            ((a.tag === 30 && s) || (km(a.child, r, i, n, s) && (d = !0)));
        a = a.sibling;
      }
      return d;
    }
    function No(a, r) {
      for (; a !== null; )
        (a.tag === 5
          ? kh(a.stateNode, a.memoizedProps)
          : (a.tag !== 22 || a.memoizedState === null) &&
            ((a.tag === 30 && r) || No(a.child, r)),
          (a = a.sibling));
    }
    function ns(a) {
      if ((a.subtreeFlags & 18874368) !== 0)
        for (a = a.child; a !== null; ) {
          if (
            (a.tag !== 22 || a.memoizedState === null) &&
            (ns(a),
            a.tag === 30 && (a.flags & 18874368) !== 0 && a.stateNode.paired)
          ) {
            var r = a.memoizedProps;
            if (r.name == null || r.name === "auto") throw Error(o(544));
            var i = r.name;
            ((r = Go(r.default, r.share)),
              r !== "none" && (Ul(a, i, r, null, !1) || No(a.child, !1)));
          }
          a = a.sibling;
        }
    }
    function wd(a, r) {
      if (a.tag === 30) {
        var i = a.stateNode,
          n = a.memoizedProps,
          s = Yo(n, i),
          d = Go(n.default, i.paired ? n.share : n.enter);
        d !== "none"
          ? Ul(a, s, d, null, !1)
            ? (ns(a), i.paired || r || Kl(a, n.onEnter))
            : No(a.child, !1)
          : ns(a);
      } else if ((a.subtreeFlags & 33554432) !== 0)
        for (a = a.child; a !== null; ) (wd(a, r), (a = a.sibling));
      else ns(a);
    }
    function Td(a) {
      if (Gt !== null && Gt.size !== 0) {
        var r = Gt;
        if ((a.subtreeFlags & 18874368) !== 0)
          for (a = a.child; a !== null; ) {
            if (a.tag !== 22 || a.memoizedState === null) {
              if (a.tag === 30 && (a.flags & 18874368) !== 0) {
                var i = a.memoizedProps,
                  n = i.name;
                if (n != null && n !== "auto") {
                  var s = r.get(n);
                  if (s !== void 0) {
                    var d = Go(i.default, i.share);
                    if (
                      (d !== "none" &&
                        (Ul(a, n, d, null, !1)
                          ? ((d = a.stateNode),
                            (s.paired = d),
                            (d.paired = s),
                            Kl(a, i.onShare))
                          : No(a.child, !1)),
                      r.delete(n),
                      r.size === 0)
                    )
                      break;
                  }
                }
              }
              Td(a);
            }
            a = a.sibling;
          }
      }
    }
    function Sd(a) {
      if (a.tag === 30) {
        var r = a.memoizedProps,
          i = Yo(r, a.stateNode),
          n = Gt !== null ? Gt.get(i) : void 0,
          s = Go(r.default, n !== void 0 ? r.share : r.exit);
        (s !== "none" &&
          (Ul(a, i, s, null, !1)
            ? n !== void 0
              ? ((s = a.stateNode),
                (n.paired = s),
                (s.paired = n),
                Gt.delete(i),
                Kl(a, r.onShare))
              : Kl(a, r.onExit)
            : No(a.child, !1)),
          Gt !== null && Td(a));
      } else if ((a.subtreeFlags & 33554432) !== 0)
        for (a = a.child; a !== null; ) (Sd(a), (a = a.sibling));
      else Gt !== null && Td(a);
    }
    function Mm(a) {
      for (a = a.child; a !== null; ) {
        if (a.tag === 30) {
          var r = a.memoizedProps,
            i = Yo(r, a.stateNode);
          ((r = Go(r.default, r.update)),
            (a.flags &= -5),
            r !== "none" && Ul(a, i, r, (a.memoizedState = []), !1));
        } else (a.subtreeFlags & 33554432) !== 0 && Mm(a);
        a = a.sibling;
      }
    }
    function kd(a) {
      if ((a.subtreeFlags & 18874368) !== 0)
        for (a = a.child; a !== null; ) {
          if (a.tag !== 22 || a.memoizedState === null) {
            if (a.tag === 30 && (a.flags & 18874368) !== 0) {
              var r = a.stateNode;
              r.paired !== null && ((r.paired = null), No(a.child, !1));
            }
            kd(a);
          }
          a = a.sibling;
        }
    }
    function ss(a) {
      if (a.tag === 30) ((a.stateNode.paired = null), No(a.child, !1), kd(a));
      else if ((a.subtreeFlags & 33554432) !== 0)
        for (a = a.child; a !== null; ) (ss(a), (a = a.sibling));
      else kd(a);
    }
    function Cm(a) {
      for (a = a.child; a !== null; )
        (a.tag === 30
          ? No(a.child, !1)
          : (a.subtreeFlags & 33554432) !== 0 && Cm(a),
          (a = a.sibling));
    }
    function Md(a, r, i, n, s, d, b) {
      for (var k = !1; r !== null; ) {
        if (r.tag === 5) {
          var R = r.stateNode;
          if (d !== null && Lt < d.length) {
            var Y = d[Lt],
              ae = tu(R);
            (Y.view || ae.view) && (k = !0);
            var pe;
            if ((pe = (a.flags & 4) === 0))
              if (ae.clip) pe = !0;
              else {
                pe = Y.rect;
                var B = ae.rect;
                pe =
                  pe.y !== B.y ||
                  pe.x !== B.x ||
                  pe.height !== B.height ||
                  pe.width !== B.width;
              }
            (pe && (a.flags |= 4),
              ae.abs
                ? (ae = !Y.abs)
                : ((Y = Y.rect),
                  (ae = ae.rect),
                  (ae = Y.height !== ae.height || Y.width !== ae.width)),
              ae && (a.flags |= 32));
          } else a.flags |= 32;
          ((a.flags & 4) !== 0 && Sh(R, Lt === 0 ? i : i + "_" + Lt, s),
            (k && (a.flags & 4) !== 0) ||
              (Eo === null && (Eo = []),
              Eo.push(R, Lt === 0 ? n : n + "_" + Lt, r.memoizedProps)),
            Lt++);
        } else
          (r.tag !== 22 || r.memoizedState === null) &&
            (r.tag === 30 && b
              ? (a.flags |= r.flags & 32)
              : Md(a, r.child, i, n, s, d, b) && (k = !0));
        r = r.sibling;
      }
      return k;
    }
    function Pm(a, r) {
      for (a = a.child; a !== null; ) {
        if (a.tag === 30) {
          var i = a.memoizedProps,
            n = a.stateNode,
            s = Yo(i, n),
            d = Go(i.default, i.update),
            b;
          ((b = a.memoizedState), (a.memoizedState = null), (n = a));
          var k = a.child;
          ((Lt = 0),
            (s = Md(n, k, s, s, d, b, !1)),
            (a.flags & 4) !== 0 && s && Kl(a, i.onUpdate));
        } else (a.subtreeFlags & 33554432) !== 0 && Pm(a);
        a = a.sibling;
      }
    }
    var gt = !1,
      Na = !1,
      Ro = !1,
      Cd = !1,
      _m = typeof WeakSet == "function" ? WeakSet : Set,
      bt = null,
      jo = !1,
      Fi = !1,
      cs = !1,
      Pd = !1;
    function p2(a, r, i) {
      if (((a = a.containerInfo), (Zd = ii), (a = N0(a)), fc(a))) {
        if ("selectionStart" in a)
          var n = { start: a.selectionStart, end: a.selectionEnd };
        else
          e: {
            n = ((n = a.ownerDocument) && n.defaultView) || window;
            var s = n.getSelection && n.getSelection();
            if (s && s.rangeCount !== 0) {
              n = s.anchorNode;
              var d = s.anchorOffset,
                b = s.focusNode;
              s = s.focusOffset;
              try {
                (n.nodeType, b.nodeType);
              } catch {
                n = null;
                break e;
              }
              var k = 0,
                R = -1,
                Y = -1,
                ae = 0,
                pe = 0,
                B = a,
                Z = null;
              a: for (;;) {
                for (
                  var Le;
                  B !== n || (d !== 0 && B.nodeType !== 3) || (R = k + d),
                    B !== b || (s !== 0 && B.nodeType !== 3) || (Y = k + s),
                    B.nodeType === 3 && (k += B.nodeValue.length),
                    (Le = B.firstChild) !== null;

                )
                  ((Z = B), (B = Le));
                for (;;) {
                  if (B === a) break a;
                  if (
                    (Z === n && ++ae === d && (R = k),
                    Z === b && ++pe === s && (Y = k),
                    (Le = B.nextSibling) !== null)
                  )
                    break;
                  ((B = Z), (Z = B.parentNode));
                }
                B = Le;
              }
              n = R === -1 || Y === -1 ? null : { start: R, end: Y };
            } else n = null;
          }
        n = n || { start: 0, end: 0 };
      } else n = null;
      for (
        Qd = { focusedElem: a, selectionRange: n },
          ii = !1,
          i = (i & 335544064) === i,
          bt = r,
          r = i ? 9270 : 1024;
        bt !== null;

      ) {
        if (((a = bt), i && ((n = a.deletions), n !== null)))
          for (d = 0; d < n.length; d++) i && Sd(n[d]);
        if (a.alternate === null && (a.flags & 2) !== 0) (i && Tm(a), ds(i));
        else {
          if (a.tag === 22) {
            if (((n = a.alternate), a.memoizedState !== null)) {
              (n !== null && n.memoizedState === null && i && Sd(n), ds(i));
              continue;
            } else if (n !== null && n.memoizedState !== null) {
              (i && Tm(a), ds(i));
              continue;
            }
          }
          ((n = a.child),
            (a.subtreeFlags & r) !== 0 && n !== null
              ? ((n.return = a), (bt = n))
              : (i && Mm(a), ds(i)));
        }
      }
      Gt = null;
    }
    function ds(a) {
      for (; bt !== null; ) {
        var r = bt,
          i = a,
          n = r.alternate,
          s = r.flags;
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if ((s & 1024) !== 0 && n !== null) {
              ((i = void 0), (s = n.memoizedProps), (n = n.memoizedState));
              var d = r.stateNode;
              try {
                var b = cl(r.type, s);
                ((i = d.getSnapshotBeforeUpdate(b, n)),
                  (d.__reactInternalSnapshotBeforeUpdate = i));
              } catch (k) {
                ja(r, r.return, k);
              }
            }
            break;
          case 3:
            if ((s & 1024) !== 0) {
              if (((n = r.stateNode.containerInfo), (i = n.nodeType), i === 9))
                lu(n);
              else if (i === 1)
                switch (n.nodeName) {
                  case "HEAD":
                  case "HTML":
                  case "BODY":
                    lu(n);
                    break;
                  default:
                    n.textContent = "";
                }
            }
            break;
          case 5:
          case 26:
          case 27:
          case 6:
          case 4:
          case 17:
            break;
          case 30:
            i &&
              n !== null &&
              ((i = Yo(n.memoizedProps, n.stateNode)),
              (s = r.memoizedProps),
              (s = Go(s.default, s.update)),
              s !== "none" && Ul(n, i, s, (n.memoizedState = []), !0));
            break;
          default:
            if ((s & 1024) !== 0) throw Error(o(163));
        }
        if (((n = r.sibling), n !== null)) {
          ((n.return = r.return), (bt = n));
          break;
        }
        bt = r.return;
      }
    }
    function Am(a, r, i) {
      var n = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          (xo(a, i), n & 4 && Gi(5, i));
          break;
        case 1:
          if ((xo(a, i), n & 4))
            if (((a = i.stateNode), r === null))
              try {
                a.componentDidMount();
              } catch (b) {
                ja(i, i.return, b);
              }
            else {
              var s = cl(i.type, r.memoizedProps);
              r = r.memoizedState;
              try {
                a.componentDidUpdate(
                  s,
                  r,
                  a.__reactInternalSnapshotBeforeUpdate,
                );
              } catch (b) {
                ja(i, i.return, b);
              }
            }
          (n & 64 && gm(i), n & 512 && Ao(i, i.return));
          break;
        case 3:
          if ((xo(a, i), n & 64 && ((a = i.updateQueue), a !== null))) {
            if (((r = null), i.child !== null))
              switch (i.child.tag) {
                case 27:
                case 5:
                  r = i.child.stateNode;
                  break;
                case 1:
                  r = i.child.stateNode;
              }
            try {
              rf(a, r);
            } catch (b) {
              ja(i, i.return, b);
            }
          }
          break;
        case 27:
          r === null && n & 4 && wm(i);
        case 26:
        case 5:
          (xo(a, i), r === null && n & 4 && gd(i), n & 512 && Ao(i, i.return));
          break;
        case 12:
          xo(a, i);
          break;
        case 31:
          (xo(a, i), n & 4 && jm(a, i));
          break;
        case 13:
          (xo(a, i),
            n & 4 && xm(a, i),
            n & 64 &&
              ((a = i.memoizedState),
              a !== null &&
                ((a = a.dehydrated),
                a !== null && ((i = _2.bind(null, i)), s5(a, i)))));
          break;
        case 22:
          if (((n = i.memoizedState !== null || gt), !n)) {
            var d = (r !== null && r.memoizedState !== null) || Na;
            ((r = gt),
              (s = Na),
              (gt = n),
              (Na = d) && !s
                ? ((n = 2),
                  (i.subtreeFlags & 8772) !== 0 && (n |= 1),
                  yo(a, i, n))
                : xo(a, i),
              (gt = r),
              (Na = s));
          }
          break;
        case 30:
          (xo(a, i), n & 512 && Ao(i, i.return));
          break;
        case 7:
          n & 512 && Ao(i, i.return);
        default:
          xo(a, i);
      }
    }
    function _d(a, r) {
      for (a = a.child; a !== null; ) (Em(a, r), (a = a.sibling));
    }
    function Em(a, r) {
      switch (a.tag) {
        case 5:
        case 26:
          try {
            var i = a.stateNode;
            if (r) {
              var n = i.style;
              typeof n.setProperty == "function"
                ? n.setProperty("display", "none", "important")
                : (n.display = "none");
            } else {
              var s = a.stateNode,
                d = a.memoizedProps.style,
                b = d != null && d.hasOwnProperty("display") ? d.display : null;
              s.style.display =
                b == null || typeof b == "boolean" ? "" : ("" + b).trim();
            }
          } catch (R) {
            ja(a, a.return, R);
          }
          Ad(a, r);
          break;
        case 6:
          try {
            ((a.stateNode.nodeValue = r ? "" : a.memoizedProps), (F = !0));
          } catch (R) {
            ja(a, a.return, R);
          }
          break;
        case 18:
          try {
            var k = a.stateNode;
            r ? Th(k, !0) : Th(a.stateNode, !1);
          } catch (R) {
            ja(a, a.return, R);
          }
          break;
        case 22:
        case 23:
          a.memoizedState === null && _d(a, r);
          break;
        default:
          _d(a, r);
      }
    }
    function Ad(a, r) {
      if (a.subtreeFlags & 67108864)
        for (a = a.child; a !== null; ) {
          e: {
            var i = a,
              n = r;
            switch (i.tag) {
              case 4:
                Em(i, n);
                break e;
              case 22:
                i.memoizedState === null && Ad(i, n);
                break e;
              default:
                Ad(i, n);
            }
          }
          a = a.sibling;
        }
    }
    function Nm(a) {
      var r = a.alternate;
      (r !== null && ((a.alternate = null), Nm(r)),
        (a.child = null),
        (a.deletions = null),
        (a.sibling = null),
        a.tag === 5 && ((r = a.stateNode), r !== null && Gr(r)),
        (a.stateNode = null),
        (a.return = null),
        (a.dependencies = null),
        (a.memoizedProps = null),
        (a.memoizedState = null),
        (a.pendingProps = null),
        (a.stateNode = null),
        (a.updateQueue = null));
    }
    var Fa = null,
      Ot = !1;
    function go(a, r, i) {
      for (i = i.child; i !== null; ) (Rm(a, r, i), (i = i.sibling));
    }
    function Rm(a, r, i) {
      if (At && typeof At.onCommitFiberUnmount == "function")
        try {
          At.onCommitFiberUnmount(Oa, i);
        } catch {}
      switch (i.tag) {
        case 26:
          (Na || Mt(i, r),
            go(a, r, i),
            i.memoizedState
              ? i.memoizedState.count--
              : i.stateNode &&
                !Na &&
                ((i = i.stateNode), i.parentNode.removeChild(i)));
          break;
        case 27:
          (Na || Mt(i, r), Xi(i));
          var n = Fa,
            s = Ot;
          (Rr(i.type) && ((Fa = i.stateNode), (Ot = !1)),
            go(a, r, i),
            Ih(i.stateNode, i.type, i.memoizedProps),
            (Fa = n),
            (Ot = s));
          break;
        case 5:
          (Na || Mt(i, r), Xi(i));
        case 6:
          if (
            (i.tag === 6 && Xi(i),
            (n = Fa),
            (s = Ot),
            (Fa = null),
            go(a, r, i),
            (Fa = n),
            (Ot = s),
            Fa !== null)
          )
            if (Ot)
              try {
                ((Fa.nodeType === 9
                  ? Fa.body
                  : Fa.nodeName === "HTML"
                    ? Fa.ownerDocument.body
                    : Fa
                ).removeChild(i.stateNode),
                  (F = !0));
              } catch (d) {
                ja(i, r, d);
              }
            else
              try {
                (Fa.removeChild(i.stateNode), (F = !0));
              } catch (d) {
                ja(i, r, d);
              }
          break;
        case 18:
          Fa !== null &&
            (Ot
              ? ((a = Fa),
                wh(
                  a.nodeType === 9
                    ? a.body
                    : a.nodeName === "HTML"
                      ? a.ownerDocument.body
                      : a,
                  i.stateNode,
                ),
                ni(a))
              : wh(Fa, i.stateNode));
          break;
        case 4:
          ((n = Fa),
            (s = Ot),
            (Fa = i.stateNode.containerInfo),
            (Ot = !0),
            go(a, r, i),
            (Fa = n),
            (Ot = s));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (Mr(2, i, r), Na || Mr(4, i, r), go(a, r, i));
          break;
        case 1:
          (Na ||
            (Mt(i, r),
            (n = i.stateNode),
            typeof n.componentWillUnmount == "function" && bm(i, r, n)),
            go(a, r, i));
          break;
        case 21:
          go(a, r, i);
          break;
        case 22:
          ((Na = (n = Na) || i.memoizedState !== null), go(a, r, i), (Na = n));
          break;
        case 30:
          (Mt(i, r), go(a, r, i));
          break;
        case 7:
          (Na || Mt(i, r), go(a, r, i));
          break;
        default:
          go(a, r, i);
      }
    }
    function jm(a, r) {
      if (
        r.memoizedState === null &&
        ((a = r.alternate), a !== null && ((a = a.memoizedState), a !== null))
      ) {
        a = a.dehydrated;
        try {
          ni(a);
        } catch (i) {
          ja(r, r.return, i);
        }
      }
    }
    function xm(a, r) {
      if (
        r.memoizedState === null &&
        ((a = r.alternate),
        a !== null &&
          ((a = a.memoizedState),
          a !== null && ((a = a.dehydrated), a !== null)))
      )
        try {
          ni(a);
        } catch (i) {
          ja(r, r.return, i);
        }
    }
    function g2(a) {
      switch (a.tag) {
        case 31:
        case 13:
        case 19:
          var r = a.stateNode;
          return (r === null && (r = a.stateNode = new _m()), r);
        case 22:
          return (
            (a = a.stateNode),
            (r = a._retryCache),
            r === null && (r = a._retryCache = new _m()),
            r
          );
        default:
          throw Error(o(435, a.tag));
      }
    }
    function us(a, r) {
      var i = g2(a);
      r.forEach(function (n) {
        if (!i.has(n)) {
          i.add(n);
          var s = A2.bind(null, a, n);
          n.then(s, s);
        }
      });
    }
    function xt(a, r, i) {
      var n = r.deletions;
      if (n !== null)
        for (var s = 0; s < n.length; s++) {
          var d = n[s],
            b = a,
            k = r,
            R = k;
          e: for (; R !== null; ) {
            switch (R.tag) {
              case 27:
                if (Rr(R.type)) {
                  ((Fa = R.stateNode), (Ot = !1));
                  break e;
                }
                break;
              case 5:
                ((Fa = R.stateNode), (Ot = !1));
                break e;
              case 3:
              case 4:
                ((Fa = R.stateNode.containerInfo), (Ot = !0));
                break e;
            }
            R = R.return;
          }
          if (Fa === null) throw Error(o(160));
          (Rm(b, k, d),
            (Fa = null),
            (Ot = !1),
            (b = d.alternate),
            b !== null && (b.return = null),
            (d.return = null));
        }
      if (r.subtreeFlags & 13886)
        for (r = r.child; r !== null; ) (Dm(r, a, i), (r = r.sibling));
    }
    var bo = null;
    function Dm(a, r, i) {
      var n = a.alternate,
        s = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          if (
            s & 4 &&
            ((n = a.updateQueue),
            (n = n !== null ? n.events : null),
            n !== null)
          )
            for (var d = 0; d < n.length; d++) {
              var b = n[d];
              b.ref.impl = b.nextImpl;
            }
          (xt(r, a, i),
            Dt(a),
            s & 4 && (Mr(3, a, a.return), Gi(3, a), Mr(5, a, a.return)));
          break;
        case 1:
          (xt(r, a, i),
            Dt(a),
            s & 512 && (Na || n === null || Mt(n, n.return)),
            s & 64 &&
              gt &&
              ((a = a.updateQueue),
              a !== null &&
                ((r = a.callbacks),
                r !== null &&
                  ((i = a.shared.hiddenCallbacks),
                  (a.shared.hiddenCallbacks = i === null ? r : i.concat(r))))));
          break;
        case 26:
          if (
            ((d = bo),
            xt(r, a, i),
            Dt(a),
            s & 512 && (Na || n === null || Mt(n, n.return)),
            s & 4)
          )
            if (
              ((s = n !== null ? n.memoizedState : null),
              (i = a.memoizedState),
              n === null)
            )
              if (i === null)
                if (a.stateNode === null)
                  if (gt)
                    a.stateNode = bh(
                      a.type,
                      a.memoizedProps,
                      r.containerInfo,
                      a,
                    );
                  else {
                    e: {
                      ((r = a.type),
                        (i = a.memoizedProps),
                        (s = d.ownerDocument || d));
                      a: switch (r) {
                        case "title":
                          ((n = s.getElementsByTagName("title")[0]),
                            (!n ||
                              n[Mo] ||
                              n[dt] ||
                              n.namespaceURI === "http://www.w3.org/2000/svg" ||
                              n.hasAttribute("itemprop")) &&
                              ((n = s.createElement(r)),
                              s.head.insertBefore(
                                n,
                                s.querySelector("head > title"),
                              )),
                            Ct(n, r, i),
                            (n[dt] = a),
                            at(n),
                            (r = n));
                          break e;
                        case "link":
                          if (
                            (d = Vh("link", "href", s).get(r + (i.href || "")))
                          ) {
                            for (b = 0; b < d.length; b++)
                              if (
                                ((n = d[b]),
                                n.getAttribute("href") ===
                                  (i.href == null || i.href === ""
                                    ? null
                                    : i.href) &&
                                  n.getAttribute("rel") ===
                                    (i.rel == null ? null : i.rel) &&
                                  n.getAttribute("title") ===
                                    (i.title == null ? null : i.title) &&
                                  n.getAttribute("crossorigin") ===
                                    (i.crossOrigin == null
                                      ? null
                                      : i.crossOrigin))
                              ) {
                                d.splice(b, 1);
                                break a;
                              }
                          }
                          ((n = s.createElement(r)),
                            Ct(n, r, i),
                            s.head.appendChild(n));
                          break;
                        case "meta":
                          if (
                            (d = Vh("meta", "content", s).get(
                              r + (i.content || ""),
                            ))
                          ) {
                            for (b = 0; b < d.length; b++)
                              if (
                                ((n = d[b]),
                                n.getAttribute("content") ===
                                  (i.content == null ? null : "" + i.content) &&
                                  n.getAttribute("name") ===
                                    (i.name == null ? null : i.name) &&
                                  n.getAttribute("property") ===
                                    (i.property == null ? null : i.property) &&
                                  n.getAttribute("http-equiv") ===
                                    (i.httpEquiv == null
                                      ? null
                                      : i.httpEquiv) &&
                                  n.getAttribute("charset") ===
                                    (i.charSet == null ? null : i.charSet))
                              ) {
                                d.splice(b, 1);
                                break a;
                              }
                          }
                          ((n = s.createElement(r)),
                            Ct(n, r, i),
                            s.head.appendChild(n));
                          break;
                        default:
                          throw Error(o(468, r));
                      }
                      ((n[dt] = a), at(n), (r = n));
                    }
                    a.stateNode = r;
                  }
                else gt || fu(d, a.type, a.stateNode);
              else a.stateNode = Bh(d, i, a.memoizedProps);
            else
              s !== i
                ? (s === null
                    ? ((r = n.stateNode),
                      r === null || Na || r.parentNode.removeChild(r))
                    : s.count--,
                  i === null
                    ? gt || fu(d, a.type, a.stateNode)
                    : Bh(d, i, a.memoizedProps))
                : i === null &&
                  a.stateNode !== null &&
                  bd(a, a.memoizedProps, n.memoizedProps);
          break;
        case 27:
          (xt(r, a, i),
            Dt(a),
            s & 512 && (Na || n === null || Mt(n, n.return)),
            n !== null && s & 4 && bd(a, a.memoizedProps, n.memoizedProps));
          break;
        case 5:
          if (
            ((d = Ro),
            (Ro = !1),
            xt(r, a, i),
            (Ro = d),
            Dt(a),
            s & 512 && (Na || n === null || Mt(n, n.return)),
            a.flags & 32)
          ) {
            r = a.stateNode;
            try {
              (Pe(r, ""), (F = !0));
            } catch (ae) {
              ja(a, a.return, ae);
            }
          }
          (s & 4 &&
            a.stateNode != null &&
            ((r = a.memoizedProps), bd(a, r, n !== null ? n.memoizedProps : r)),
            s & 1024 && (Cd = !0));
          break;
        case 6:
          if ((xt(r, a, i), Dt(a), s & 4)) {
            if (a.stateNode === null) throw Error(o(162));
            ((r = a.memoizedProps), (i = a.stateNode));
            try {
              ((i.nodeValue = r), (F = !0));
            } catch (ae) {
              ja(a, a.return, ae);
            }
          }
          break;
        case 3:
          if (
            ((F = !1),
            (Ps = null),
            (d = bo),
            (bo = tn(r.containerInfo)),
            xt(r, a, i),
            (bo = d),
            Dt(a),
            s & 4 && n !== null && n.memoizedState.isDehydrated)
          )
            try {
              ni(r.containerInfo);
            } catch (ae) {
              ja(a, a.return, ae);
            }
          (Cd && ((Cd = !1), Im(a)), (F = !1));
          break;
        case 4:
          ((s = Ro),
            (Ro = gt),
            (n = ie()),
            (d = bo),
            (bo = tn(a.stateNode.containerInfo)),
            xt(r, a, i),
            Dt(a),
            (bo = d),
            F && Fi && (cs = !0),
            (F = n),
            (Ro = s));
          break;
        case 12:
          (xt(r, a, i), Dt(a));
          break;
        case 31:
          (xt(r, a, i),
            Dt(a),
            s & 4 &&
              ((r = a.updateQueue),
              r !== null && ((a.updateQueue = null), us(a, r))));
          break;
        case 13:
          (xt(r, a, i),
            Dt(a),
            a.child.flags & 8192 &&
              (a.memoizedState !== null) !=
                (n !== null && n.memoizedState !== null) &&
              (hs = ma()),
            s & 4 &&
              ((r = a.updateQueue),
              r !== null && ((a.updateQueue = null), us(a, r))));
          break;
        case 22:
          ((d = a.memoizedState !== null),
            (b = n !== null && n.memoizedState !== null));
          var k = gt,
            R = Na,
            Y = Ro;
          ((gt = k || d),
            (Ro = Y || d),
            (Na = R || b),
            xt(r, a, i),
            (Na = R),
            (Ro = Y),
            (gt = k),
            Dt(a),
            s & 8192 &&
              ((r = a.stateNode),
              (r._visibility = d ? r._visibility & -2 : r._visibility | 1),
              !d ||
                n === null ||
                b ||
                gt ||
                Na ||
                ((r = b || Na),
                (i = gt),
                (n = Na),
                (gt = d || gt),
                (Na = r),
                Cr(a, 2),
                (gt = i),
                (Na = n)),
              (!d && Ro) || _d(a, d)),
            s & 4 &&
              ((r = a.updateQueue),
              r !== null &&
                ((i = r.retryQueue),
                i !== null && ((r.retryQueue = null), us(a, i)))));
          break;
        case 19:
          (xt(r, a, i),
            Dt(a),
            s & 4 &&
              ((r = a.updateQueue),
              r !== null && ((a.updateQueue = null), us(a, r))));
          break;
        case 30:
          (s & 512 && (Na || n === null || Mt(n, n.return)),
            (s = ie()),
            (d = Fi),
            (b = (i & 335544064) === i),
            (k = a.memoizedProps),
            (Fi = b && Go(k.default, k.update) !== "none"),
            xt(r, a, i),
            Dt(a),
            b && n !== null && F && (a.flags |= 4),
            (Fi = d),
            (F = s));
          break;
        case 21:
          break;
        case 7:
          (s & 512 && (Na || n === null || Mt(n, n.return)),
            n && n.stateNode !== null && (n.stateNode._fragmentFiber = a));
        default:
          (xt(r, a, i), Dt(a));
      }
    }
    function Dt(a) {
      var r = a.flags;
      if (r & 2) {
        try {
          for (var i, n = a.return; n !== null; ) {
            if (vm(n)) {
              i = n;
              break;
            }
            n = n.return;
          }
          n = null;
          for (var s = a.return; s !== null; ) {
            if (pd(s)) {
              var d = s.stateNode;
              n === null ? (n = [d]) : n.push(d);
            }
            if (hd(s)) break;
            s = s.return;
          }
          var b = n;
          if (i == null) throw Error(o(160));
          switch (i.tag) {
            case 27:
              var k = i.stateNode,
                R = yd(a);
              ls(a, R, k, b);
              break;
            case 5:
              var Y = i.stateNode;
              i.flags & 32 && (Pe(Y, ""), (i.flags &= -33));
              var ae = yd(a);
              ls(a, ae, Y, b);
              break;
            case 3:
            case 4:
              var pe = i.stateNode.containerInfo,
                B = yd(a);
              vd(a, B, pe, b);
              break;
            default:
              throw Error(o(161));
          }
        } catch (Z) {
          ja(a, a.return, Z);
        }
        a.flags &= -3;
      }
      r & 4096 && (a.flags &= -4097);
    }
    function Im(a) {
      if (a.subtreeFlags & 1024)
        for (a = a.child; a !== null; ) {
          var r = a;
          (Im(r),
            r.tag === 5 &&
              r.flags & 1024 &&
              ((r = r.stateNode), (ii = !0), r.reset(), (ii = !1)),
            (a = a.sibling));
        }
    }
    function $l(a, r) {
      if (r.subtreeFlags & 9270)
        for (r = r.child; r !== null; ) (zm(r, a), (r = r.sibling));
      else Pm(r);
    }
    function zm(a, r) {
      var i = a.alternate;
      if (i === null) wd(a, !1);
      else
        switch (a.tag) {
          case 3:
            if (((Pd = jo = !1), Sm(), $l(r, a), !jo && !cs)) {
              if (((a = Eo), a !== null))
                for (var n = 0; n < a.length; n += 3) {
                  i = a[n];
                  var s = a[n + 1];
                  (kh(i, a[n + 2]),
                    (i = i.ownerDocument.documentElement),
                    i !== null &&
                      i.animate(
                        { opacity: [0, 0], pointerEvents: ["none", "none"] },
                        {
                          duration: 0,
                          fill: "forwards",
                          pseudoElement: "::view-transition-group(" + s + ")",
                        },
                      ));
                }
              ((a = r.containerInfo),
                (a =
                  a.nodeType === 9
                    ? a.documentElement
                    : a.ownerDocument.documentElement),
                a !== null &&
                  a.style.viewTransitionName === "" &&
                  ((a.style.viewTransitionName = "none"),
                  a.animate(
                    { opacity: [0, 0], pointerEvents: ["none", "none"] },
                    {
                      duration: 0,
                      fill: "forwards",
                      pseudoElement: "::view-transition-group(root)",
                    },
                  ),
                  a.animate(
                    { width: [0, 0], height: [0, 0] },
                    {
                      duration: 0,
                      fill: "forwards",
                      pseudoElement: "::view-transition",
                    },
                  )),
                (Pd = !0));
            }
            Eo = null;
            break;
          case 5:
            $l(r, a);
            break;
          case 4:
            ((n = jo), (jo = !1), $l(r, a), jo && (cs = !0), (jo = n));
            break;
          case 22:
            a.memoizedState === null &&
              (i.memoizedState !== null ? wd(a, !1) : $l(r, a));
            break;
          case 30:
            ((n = jo), (s = Sm()), (jo = !1), $l(r, a), jo && (a.flags |= 4));
            var d = a.memoizedProps,
              b = a.stateNode;
            ((r = Yo(d, b)), (b = Yo(i.memoizedProps, b)));
            var k = Go(d.default, d.update);
            (k === "none"
              ? (r = !1)
              : ((d = i.memoizedState),
                (i.memoizedState = null),
                (i = a.child),
                (Lt = 0),
                (r = Md(a, i, r, b, k, d, !0)),
                Lt !== (d === null ? 0 : d.length) && (a.flags |= 32)),
              (a.flags & 4) !== 0 && r
                ? (Kl(a, a.memoizedProps.onUpdate), (Eo = s))
                : s !== null && (s.push.apply(s, Eo), (Eo = s)),
              (jo = (a.flags & 32) !== 0 ? !0 : n));
            break;
          default:
            $l(r, a);
        }
    }
    function xo(a, r) {
      if (r.subtreeFlags & 8772)
        for (r = r.child; r !== null; )
          (Am(a, r.alternate, r), (r = r.sibling));
    }
    function Cr(a, r) {
      for (a = a.child; a !== null; ) {
        var i = a,
          n = r;
        switch (i.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (Mr(4, i, i.return), Cr(i, n));
            break;
          case 1:
            Mt(i, i.return);
            var s = i.stateNode;
            (typeof s.componentWillUnmount == "function" && bm(i, i.return, s),
              Cr(i, n));
            break;
          case 27:
            (n & 2) !== 0 && Ih(i.stateNode, i.type, i.memoizedProps);
          case 5:
            (Mt(i, i.return), (i.tag !== 5 && i.tag !== 27) || Xi(i), Cr(i, n));
            break;
          case 6:
            Xi(i);
            break;
          case 26:
            (Mt(i, i.return),
              (s = i.stateNode),
              i.memoizedState !== null ||
                s === null ||
                Na ||
                s.parentNode.removeChild(s),
              Cr(i, n));
            break;
          case 22:
            i.memoizedState === null && Cr(i, n);
            break;
          case 30:
            (Mt(i, i.return), Cr(i, n));
            break;
          case 7:
            Mt(i, i.return);
          default:
            Cr(i, n);
        }
        a = a.sibling;
      }
    }
    function yo(a, r, i) {
      for (
        i = (r.subtreeFlags & 8772) !== 0 ? i : i & -2, r = r.child;
        r !== null;

      ) {
        var n = r.alternate,
          s = a,
          d = r,
          b = d.flags,
          k = (i & 1) !== 0;
        switch (d.tag) {
          case 0:
          case 11:
          case 15:
            (yo(s, d, i), Gi(4, d));
            break;
          case 1:
            if (
              (yo(s, d, i),
              (n = d),
              (s = n.stateNode),
              typeof s.componentDidMount == "function")
            )
              try {
                s.componentDidMount();
              } catch (ae) {
                ja(n, n.return, ae);
              }
            if (((n = d), (s = n.updateQueue), s !== null)) {
              var R = n.stateNode;
              try {
                var Y = s.shared.hiddenCallbacks;
                if (Y !== null)
                  for (
                    s.shared.hiddenCallbacks = null, s = 0;
                    s < Y.length;
                    s++
                  )
                    of(Y[s], R);
              } catch (ae) {
                ja(n, n.return, ae);
              }
            }
            (k && b & 64 && gm(d), Ao(d, d.return));
            break;
          case 27:
            (i & 2) !== 0 && wm(d);
          case 5:
            ((d.tag !== 5 && d.tag !== 27) || ym(d),
              yo(s, d, i),
              k && n === null && b & 4 && gd(d),
              Ao(d, d.return));
            break;
          case 6:
            ym(d);
            break;
          case 26:
            ((R = d.stateNode),
              d.memoizedState !== null ||
                R === null ||
                gt ||
                fu(tn(R.ownerDocument), d.type, R),
              yo(s, d, i),
              k && n === null && b & 4 && gd(d),
              Ao(d, d.return));
            break;
          case 12:
            yo(s, d, i);
            break;
          case 31:
            (yo(s, d, i), k && b & 4 && jm(s, d));
            break;
          case 13:
            (yo(s, d, i), k && b & 4 && xm(s, d));
            break;
          case 22:
            (d.memoizedState === null && yo(s, d, i), Ao(d, d.return));
            break;
          case 30:
            (yo(s, d, i), Ao(d, d.return));
            break;
          case 7:
            Ao(d, d.return);
          default:
            yo(s, d, i);
        }
        r = r.sibling;
      }
    }
    function Ed(a, r) {
      var i = null;
      (a !== null &&
        a.memoizedState !== null &&
        a.memoizedState.cachePool !== null &&
        (i = a.memoizedState.cachePool.pool),
        (a = null),
        r.memoizedState !== null &&
          r.memoizedState.cachePool !== null &&
          (a = r.memoizedState.cachePool.pool),
        a !== i && (a != null && a.refCount++, i != null && ji(i)));
    }
    function Nd(a, r) {
      ((a = null),
        r.alternate !== null && (a = r.alternate.memoizedState.cache),
        (r = r.memoizedState.cache),
        r !== a && (r.refCount++, a != null && ji(a)));
    }
    function no(a, r, i, n) {
      var s = (i & 335544064) === i;
      if (r.subtreeFlags & (s ? 10262 : 10256))
        for (r = r.child; r !== null; ) (Lm(a, r, i, n), (r = r.sibling));
      else s && Cm(r);
    }
    function Lm(a, r, i, n) {
      var s = (i & 335544064) === i;
      s &&
        r.alternate === null &&
        r.return !== null &&
        r.return.alternate !== null &&
        ss(r);
      var d = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          (no(a, r, i, n), d & 2048 && Gi(9, r));
          break;
        case 1:
          no(a, r, i, n);
          break;
        case 3:
          (no(a, r, i, n),
            s &&
              Pd &&
              ((a = a.containerInfo),
              (a =
                a.nodeType === 9
                  ? a.body
                  : a.nodeName === "HTML"
                    ? a.ownerDocument.body
                    : a),
              a.style.viewTransitionName === "root" &&
                (a.style.viewTransitionName = ""),
              (a = a.ownerDocument.documentElement),
              a !== null &&
                a.style.viewTransitionName === "none" &&
                (a.style.viewTransitionName = "")),
            d & 2048 &&
              ((d = null),
              r.alternate !== null && (d = r.alternate.memoizedState.cache),
              (r = r.memoizedState.cache),
              r !== d && (r.refCount++, d != null && ji(d))));
          break;
        case 12:
          if (d & 2048) {
            (no(a, r, i, n), (d = r.stateNode));
            try {
              var b = r.memoizedProps,
                k = b.id,
                R = b.onPostCommit;
              typeof R == "function" &&
                R(
                  k,
                  r.alternate === null ? "mount" : "update",
                  d.passiveEffectDuration,
                  -0,
                );
            } catch (Y) {
              ja(r, r.return, Y);
            }
          } else no(a, r, i, n);
          break;
        case 31:
          no(a, r, i, n);
          break;
        case 13:
          no(a, r, i, n);
          break;
        case 23:
          break;
        case 22:
          ((b = r.stateNode),
            (k = r.alternate),
            r.memoizedState !== null
              ? (s && k !== null && k.memoizedState === null && ss(k),
                b._visibility & 2 ? no(a, r, i, n) : Hi(a, r))
              : (s && k !== null && k.memoizedState !== null && ss(r),
                b._visibility & 2
                  ? no(a, r, i, n)
                  : ((b._visibility |= 2),
                    Yl(a, r, i, n, (r.subtreeFlags & 10256) !== 0 || !1))),
            d & 2048 && Ed(k, r));
          break;
        case 24:
          (no(a, r, i, n), d & 2048 && Nd(r.alternate, r));
          break;
        case 30:
          (s &&
            ((d = r.alternate),
            d !== null && (No(d.child, !0), No(r.child, !0))),
            no(a, r, i, n));
          break;
        default:
          no(a, r, i, n);
      }
    }
    function Yl(a, r, i, n, s) {
      for (
        s = s && ((r.subtreeFlags & 10256) !== 0 || !1), r = r.child;
        r !== null;

      ) {
        var d = a,
          b = r,
          k = i,
          R = n,
          Y = b.flags;
        switch (b.tag) {
          case 0:
          case 11:
          case 15:
            (Yl(d, b, k, R, s), Gi(8, b));
            break;
          case 23:
            break;
          case 22:
            var ae = b.stateNode;
            (b.memoizedState !== null
              ? ae._visibility & 2
                ? Yl(d, b, k, R, s)
                : Hi(d, b)
              : ((ae._visibility |= 2), Yl(d, b, k, R, s)),
              s && Y & 2048 && Ed(b.alternate, b));
            break;
          case 24:
            (Yl(d, b, k, R, s), s && Y & 2048 && Nd(b.alternate, b));
            break;
          default:
            Yl(d, b, k, R, s);
        }
        r = r.sibling;
      }
    }
    function Hi(a, r) {
      if (r.subtreeFlags & 10256)
        for (r = r.child; r !== null; ) {
          var i = a,
            n = r,
            s = n.flags;
          switch (n.tag) {
            case 22:
              (Hi(i, n), s & 2048 && Ed(n.alternate, n));
              break;
            case 24:
              (Hi(i, n), s & 2048 && Nd(n.alternate, n));
              break;
            default:
              Hi(i, n);
          }
          r = r.sibling;
        }
    }
    var dl = 8192;
    function ul(a, r, i) {
      if (a.subtreeFlags & dl)
        for (a = a.child; a !== null; ) (Om(a, r, i), (a = a.sibling));
    }
    function Om(a, r, i) {
      switch (a.tag) {
        case 26:
          (ul(a, r, i),
            a.flags & dl &&
              (a.memoizedState !== null
                ? S5(i, bo, a.memoizedState, a.memoizedProps)
                : ((a = a.stateNode), (r & 335544128) === r && Gh(i, a))));
          break;
        case 5:
          (ul(a, r, i),
            a.flags & dl &&
              ((a = a.stateNode), (r & 335544128) === r && Gh(i, a)));
          break;
        case 3:
        case 4:
          var n = bo;
          ((bo = tn(a.stateNode.containerInfo)), ul(a, r, i), (bo = n));
          break;
        case 22:
          a.memoizedState === null &&
            ((n = a.alternate),
            n !== null && n.memoizedState !== null
              ? ((n = dl), (dl = 16777216), ul(a, r, i), (dl = n))
              : ul(a, r, i));
          break;
        case 30:
          if (
            (a.flags & dl) !== 0 &&
            ((n = a.memoizedProps.name), n != null && n !== "auto")
          ) {
            var s = a.stateNode;
            ((s.paired = null), Gt === null && (Gt = new Map()), Gt.set(n, s));
          }
          ul(a, r, i);
          break;
        default:
          ul(a, r, i);
      }
    }
    function qm(a) {
      var r = a.alternate;
      if (r !== null && ((a = r.child), a !== null)) {
        r.child = null;
        do ((r = a.sibling), (a.sibling = null), (a = r));
        while (a !== null);
      }
    }
    function Wi(a) {
      var r = a.deletions;
      if ((a.flags & 16) !== 0) {
        if (r !== null)
          for (var i = 0; i < r.length; i++) {
            var n = r[i];
            ((bt = n), Vm(n, a));
          }
        qm(a);
      }
      if (a.subtreeFlags & 10256)
        for (a = a.child; a !== null; ) (Bm(a), (a = a.sibling));
    }
    function Bm(a) {
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          (Wi(a), a.flags & 2048 && Mr(9, a, a.return));
          break;
        case 3:
          Wi(a);
          break;
        case 12:
          Wi(a);
          break;
        case 22:
          var r = a.stateNode;
          a.memoizedState !== null &&
          r._visibility & 2 &&
          (a.return === null || a.return.tag !== 13)
            ? ((r._visibility &= -3), fs(a))
            : Wi(a);
          break;
        default:
          Wi(a);
      }
    }
    function fs(a) {
      var r = a.deletions;
      if ((a.flags & 16) !== 0) {
        if (r !== null)
          for (var i = 0; i < r.length; i++) {
            var n = r[i];
            ((bt = n), Vm(n, a));
          }
        qm(a);
      }
      for (a = a.child; a !== null; ) {
        switch (((r = a), r.tag)) {
          case 0:
          case 11:
          case 15:
            (Mr(8, r, r.return), fs(r));
            break;
          case 22:
            ((i = r.stateNode),
              i._visibility & 2 && ((i._visibility &= -3), fs(r)));
            break;
          default:
            fs(r);
        }
        a = a.sibling;
      }
    }
    function Vm(a, r) {
      for (; bt !== null; ) {
        var i = bt;
        switch (i.tag) {
          case 0:
          case 11:
          case 15:
            Mr(8, i, r);
            break;
          case 23:
          case 22:
            if (
              i.memoizedState !== null &&
              i.memoizedState.cachePool !== null
            ) {
              var n = i.memoizedState.cachePool.pool;
              n != null && n.refCount++;
            }
            break;
          case 24:
            ji(i.memoizedState.cache);
        }
        if (((n = i.child), n !== null)) ((n.return = i), (bt = n));
        else
          e: for (i = a; bt !== null; ) {
            n = bt;
            var s = n.sibling,
              d = n.return;
            if ((Nm(n), n === i)) {
              bt = null;
              break e;
            }
            if (s !== null) {
              ((s.return = d), (bt = s));
              break e;
            }
            bt = d;
          }
      }
    }
    var b2 = {
        getCacheForType: function (a) {
          var r = Tt(lt),
            i = r.data.get(a);
          return (i === void 0 && ((i = a()), r.data.set(a, i)), i);
        },
        cacheSignal: function () {
          return Tt(lt).controller.signal;
        },
      },
      y2 = typeof WeakMap == "function" ? WeakMap : Map,
      Ea = 0,
      La = null,
      wa = null,
      Ma = 0,
      Ra = 0,
      Xt = null,
      Pr = !1,
      Gl = !1,
      Rd = !1,
      er = 0,
      Qa = 0,
      _r = 0,
      fl = 0,
      ms = 0,
      Ft = 0,
      Xl = 0,
      Ki = null,
      qt = null,
      jd = !1,
      hs = 0,
      Um = 0,
      ps = 1 / 0,
      gs = null,
      Ar = null,
      Ha = 0,
      vo = null,
      ml = null,
      Do = 0,
      xd = 0,
      Dd = null,
      $m = null,
      Fl = null,
      Hl = null,
      Wl = null,
      Zi = 0,
      bs = null;
    function Ht() {
      return (Ea & 2) !== 0 && Ma !== 0
        ? Ma & -Ma
        : xe.T !== null
          ? Yd()
          : sr();
    }
    function Ym() {
      if (Ft === 0)
        if ((Ma & 536870912) === 0 || ba) {
          var a = lr;
          ((lr <<= 1), (lr & 3932160) === 0 && (lr = 262144), (Ft = a));
        } else Ft = 536870912;
      return ((a = St.current), a !== null && (a.flags |= 32), Ft);
    }
    function Kl(a, r) {
      if (r != null) {
        var i = a.stateNode,
          n = i.ref;
        (n === null && (n = i.ref = Mh(Yo(a.memoizedProps, i))),
          Hl === null && (Hl = []),
          Hl.push(r.bind(null, n)));
      }
    }
    function Bt(a, r, i) {
      (((a === La && (Ra === 2 || Ra === 9)) ||
        a.cancelPendingCommit !== null) &&
        (Zl(a, 0), Er(a, Ma, Ft, !1)),
        Ut(a, i),
        ((Ea & 2) === 0 || a !== La) &&
          (a === La &&
            ((Ea & 2) === 0 && (fl |= i), Qa === 4 && Er(a, Ma, Ft, !1)),
          Io(a)));
    }
    function Gm(a, r, i) {
      if ((Ea & 6) !== 0) throw Error(o(327));
      var n = (!i && (r & 127) === 0 && (r & a.expiredLanes) === 0) || Vr(a, r),
        s = n ? T2(a, r) : zd(a, r, !0),
        d = n;
      do {
        if (s === 0) {
          Gl && !n && Er(a, r, 0, !1);
          break;
        } else {
          if (((i = a.current.alternate), d && !v2(i))) {
            ((s = zd(a, r, !1)), (d = !1));
            continue;
          }
          if (s === 2) {
            if (((d = r), a.errorRecoveryDisabledLanes & d)) var b = 0;
            else
              ((b = a.pendingLanes & -536870913),
                (b = b !== 0 ? b : b & 536870912 ? 536870912 : 0));
            if (b !== 0) {
              r = b;
              e: {
                var k = a;
                s = Ki;
                var R = k.current.memoizedState.isDehydrated;
                if (
                  (R && (Zl(k, b).flags |= 256),
                  (b = zd(k, b, !1)),
                  b !== 2 && b !== 6)
                ) {
                  if (Rd && !R) {
                    ((k.errorRecoveryDisabledLanes |= d), (fl |= d), (s = 4));
                    break e;
                  }
                  ((d = qt),
                    (qt = s),
                    d !== null &&
                      (qt === null ? (qt = d) : qt.push.apply(qt, d)));
                }
                s = b;
              }
              if (((d = !1), s !== 2)) continue;
            }
          }
          if (s === 1) {
            (Zl(a, 0), Er(a, r, 0, !0));
            break;
          }
          e: {
            switch (((n = a), (d = s), d)) {
              case 0:
              case 1:
                throw Error(o(345));
              case 4:
                if ((r & 4194048) !== r && (r & 62914560) !== r) break;
              case 6:
                Er(n, r, Ft, !Pr);
                break e;
              case 2:
                qt = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(o(329));
            }
            if ((r & 62914560) === r && ((s = hs + 300 - ma()), 10 < s)) {
              if ((Er(n, r, Ft, !Pr), ir(n, 0, !0) !== 0)) break e;
              ((Do = r),
                (n.timeoutHandle = au(
                  Xm.bind(
                    null,
                    n,
                    i,
                    qt,
                    gs,
                    jd,
                    r,
                    Ft,
                    fl,
                    Xl,
                    Pr,
                    d,
                    "Throttled",
                    -0,
                    0,
                  ),
                  s,
                )));
              break e;
            }
            Xm(n, i, qt, gs, jd, r, Ft, fl, Xl, Pr, d, null, -0, 0);
          }
        }
        break;
      } while (!0);
      Io(a);
    }
    function Xm(a, r, i, n, s, d, b, k, R, Y, ae, pe, B, Z) {
      a.timeoutHandle = -1;
      var Le = r.subtreeFlags,
        Qe = (d & 335544064) === d;
      if (
        ((pe = null),
        (Qe || Le & 8192 || (Le & 16785408) === 16785408) &&
          ((pe = {
            stylesheets: null,
            count: 0,
            imgCount: 0,
            imgBytes: 0,
            suspenseyImages: [],
            waitingForImages: !0,
            waitingForViewTransition: !1,
            unsuspend: va,
          }),
          (Gt = null),
          Om(r, d, pe),
          Qe &&
            ((Le = pe),
            (Qe = a.containerInfo),
            (Qe = (Qe.nodeType === 9 ? Qe : Qe.ownerDocument)
              .__reactViewTransition),
            Qe != null &&
              (Le.count++,
              (Le.waitingForViewTransition = !0),
              (Le = ln.bind(Le)),
              Qe.finished.then(Le, Le))),
          (Le =
            (d & 62914560) === d
              ? hs - ma()
              : (d & 4194048) === d
                ? Um - ma()
                : 0),
          (Le = k5(pe, Le)),
          Le !== null))
      ) {
        ((Do = d),
          (a.cancelPendingCommit = Le(
            eh.bind(null, a, r, d, i, n, s, b, k, R, Y, ae, pe, null, B, Z),
          )),
          Er(a, d, b, !Y));
        return;
      }
      eh(a, r, d, i, n, s, b, k, R, Y, ae, pe);
    }
    function v2(a) {
      for (var r = a; ; ) {
        var i = r.tag;
        if (
          (i === 0 || i === 11 || i === 15) &&
          r.flags & 16384 &&
          ((i = r.updateQueue), i !== null && ((i = i.stores), i !== null))
        )
          for (var n = 0; n < i.length; n++) {
            var s = i[n],
              d = s.getSnapshot;
            s = s.value;
            try {
              if (!$t(d(), s)) return !1;
            } catch {
              return !1;
            }
          }
        if (((i = r.child), r.subtreeFlags & 16384 && i !== null))
          ((i.return = r), (r = i));
        else {
          if (r === a) break;
          for (; r.sibling === null; ) {
            if (r.return === null || r.return === a) return !0;
            r = r.return;
          }
          ((r.sibling.return = r.return), (r = r.sibling));
        }
      }
      return !0;
    }
    function Er(a, r, i, n) {
      ((r = gn(a, r)),
        (r &= ~ms),
        (r &= ~fl),
        (a.suspendedLanes |= r),
        (a.pingedLanes &= ~r),
        n && (a.warmLanes |= r),
        (n = a.expirationTimes));
      for (var s = r; 0 < s; ) {
        var d = 31 - Ka(s),
          b = 1 << d;
        ((n[d] = -1), (s &= ~b));
      }
      i !== 0 && Ur(a, i, r);
    }
    function ys() {
      return (Ea & 6) === 0 ? (Qi(0), !1) : !0;
    }
    function Id() {
      if (wa !== null) {
        if (Ra === 0) var a = wa.return;
        else
          ((a = wa), (Ho = el = null), $c(a), (Ll = null), (Ii = 0), (a = wa));
        for (; a !== null; ) (pm(a.alternate, a), (a = a.return));
        wa = null;
      }
    }
    function Zl(a, r) {
      var i = a.timeoutHandle;
      return (
        i !== -1 && ((a.timeoutHandle = -1), $2(i)),
        (i = a.cancelPendingCommit),
        i !== null && ((a.cancelPendingCommit = null), i()),
        (Do = 0),
        Id(),
        (La = a),
        (wa = i = Xo(a.current, null)),
        (Ma = r),
        (Ra = 0),
        (Xt = null),
        (Pr = !1),
        (Gl = Vr(a, r)),
        (Rd = !1),
        (Xl = Ft = ms = fl = _r = Qa = 0),
        (qt = Ki = null),
        (jd = !1),
        (er = gn(a, r)),
        Pn(),
        i
      );
    }
    function Fm(a, r) {
      ((ha = null),
        (xe.H = Zn),
        r === zl || r === Ln
          ? ((r = J0()), (Ra = 3))
          : r === Nc
            ? ((r = J0()), (Ra = 4))
            : (Ra =
                r === rd
                  ? 8
                  : r !== null &&
                      typeof r == "object" &&
                      typeof r.then == "function"
                    ? 6
                    : 1),
        (Xt = r),
        wa === null && ((Qa = 1), Qn(a, oo(r, a.current))));
    }
    function Hm() {
      var a = St.current;
      return a === null
        ? !0
        : (Ma & 4194048) === Ma
          ? Pt === null
          : (Ma & 62914560) === Ma || (Ma & 536870912) !== 0
            ? a === Pt
            : !1;
    }
    function Wm() {
      var a = xe.H;
      return ((xe.H = Zn), a === null ? Zn : a);
    }
    function Km() {
      var a = xe.A;
      return ((xe.A = b2), a);
    }
    function vs() {
      ((Qa = 4),
        Pr || ((Ma & 4194048) !== Ma && St.current !== null) || (Gl = !0),
        ((_r & 134217727) === 0 && (fl & 134217727) === 0) ||
          La === null ||
          Er(La, Ma, Ft, !1));
    }
    function zd(a, r, i) {
      var n = Ea;
      Ea |= 2;
      var s = Wm(),
        d = Km();
      ((La !== a || Ma !== r) && ((gs = null), Zl(a, r)), (r = !1));
      var b = Qa;
      e: do
        try {
          if (Ra !== 0 && wa !== null) {
            var k = wa,
              R = Xt;
            switch (Ra) {
              case 8:
                (Id(), (b = 6));
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                St.current === null && (r = !0);
                var Y = Ra;
                if (((Ra = 0), (Xt = null), Ql(a, k, R, Y), i && Gl)) {
                  b = 0;
                  break e;
                }
                break;
              default:
                ((Y = Ra), (Ra = 0), (Xt = null), Ql(a, k, R, Y));
            }
          }
          (w2(), (b = Qa));
          break;
        } catch (ae) {
          Fm(a, ae);
        }
      while (!0);
      return (
        r && a.shellSuspendCounter++,
        (Ho = el = null),
        (Ea = n),
        (xe.H = s),
        (xe.A = d),
        wa === null && ((La = null), (Ma = 0), Pn()),
        b
      );
    }
    function w2() {
      for (; wa !== null; ) Zm(wa);
    }
    function T2(a, r) {
      var i = Ea;
      Ea |= 2;
      var n = Wm(),
        s = Km();
      La !== a || Ma !== r
        ? ((gs = null), (ps = ma() + 500), Zl(a, r))
        : (Gl = Vr(a, r));
      e: do
        try {
          if (Ra !== 0 && wa !== null) {
            r = wa;
            var d = Xt;
            a: switch (Ra) {
              case 1:
                ((Ra = 0), (Xt = null), Ql(a, r, d, 1));
                break;
              case 2:
              case 9:
                if (Z0(d)) {
                  ((Ra = 0), (Xt = null), Qm(r));
                  break;
                }
                ((r = function () {
                  ((Ra !== 2 && Ra !== 9) || La !== a || (Ra = 7), Io(a));
                }),
                  d.then(r, r));
                break e;
              case 3:
                Ra = 7;
                break e;
              case 4:
                Ra = 5;
                break e;
              case 7:
                Z0(d)
                  ? ((Ra = 0), (Xt = null), Qm(r))
                  : ((Ra = 0), (Xt = null), Ql(a, r, d, 7));
                break;
              case 5:
                var b = null;
                switch (wa.tag) {
                  case 26:
                    b = wa.memoizedState;
                  case 5:
                  case 27:
                    var k = wa;
                    if (b ? $h(b) : k.stateNode.complete) {
                      ((Ra = 0), (Xt = null));
                      var R = k.sibling;
                      if (R !== null) wa = R;
                      else {
                        var Y = k.return;
                        Y !== null ? ((wa = Y), ws(Y)) : (wa = null);
                      }
                      break a;
                    }
                }
                ((Ra = 0), (Xt = null), Ql(a, r, d, 5));
                break;
              case 6:
                ((Ra = 0), (Xt = null), Ql(a, r, d, 6));
                break;
              case 8:
                (Id(), (Qa = 6));
                break e;
              default:
                throw Error(o(462));
            }
          }
          S2();
          break;
        } catch (ae) {
          Fm(a, ae);
        }
      while (!0);
      return (
        (Ho = el = null),
        (xe.H = n),
        (xe.A = s),
        (Ea = i),
        wa !== null ? 0 : ((La = null), (Ma = 0), Pn(), Qa)
      );
    }
    function S2() {
      for (; wa !== null && !We(); ) Zm(wa);
    }
    function Zm(a) {
      var r = mm(a.alternate, a, er);
      ((a.memoizedProps = a.pendingProps), r === null ? ws(a) : (wa = r));
    }
    function Qm(a) {
      var r = a,
        i = r.alternate;
      switch (r.tag) {
        case 15:
        case 0:
          r = im(i, r, r.pendingProps, r.type, void 0, Ma);
          break;
        case 11:
          r = im(i, r, r.pendingProps, r.type.render, r.ref, Ma);
          break;
        case 5:
          $c(r);
          var n = r;
          n === pt &&
            (ba
              ? (jn(n),
                n.tag === 5 && n.stateNode != null && (Ba = n.stateNode))
              : (jn(n), (ba = !0)));
        default:
          (pm(i, r), (r = wa = B0(r, er)), (r = mm(i, r, er)));
      }
      ((a.memoizedProps = a.pendingProps), r === null ? ws(a) : (wa = r));
    }
    function Ql(a, r, i, n) {
      ((Ho = el = null), $c(r), (Ll = null), (Ii = 0));
      var s = r.return;
      try {
        if (c2(a, s, r, i, Ma)) {
          ((Qa = 1), Qn(a, oo(i, a.current)), (wa = null));
          return;
        }
      } catch (d) {
        if (s !== null) throw ((wa = s), d);
        ((Qa = 1), Qn(a, oo(i, a.current)), (wa = null));
        return;
      }
      r.flags & 32768
        ? (ba || n === 1
            ? (a = !0)
            : Gl || (Ma & 536870912) !== 0
              ? (a = !1)
              : ((Pr = a = !0),
                (n === 2 || n === 9 || n === 3 || n === 6) &&
                  ((n = St.current),
                  n !== null && n.tag === 13 && (n.flags |= 16384))),
          Jm(r, a))
        : ws(r);
    }
    function ws(a) {
      var r = a;
      do {
        if ((r.flags & 32768) !== 0) {
          Jm(r, Pr);
          return;
        }
        a = r.return;
        var i = m2(r.alternate, r, er);
        if (i !== null) {
          wa = i;
          return;
        }
        if (((r = r.sibling), r !== null)) {
          wa = r;
          return;
        }
        wa = r = a;
      } while (r !== null);
      Qa === 0 && (Qa = 5);
    }
    function Jm(a, r) {
      do {
        var i = h2(a.alternate, a);
        if (i !== null) {
          ((i.flags &= 32767), (wa = i));
          return;
        }
        if (
          ((i = a.return),
          i !== null &&
            ((i.flags |= 32768), (i.subtreeFlags = 0), (i.deletions = null)),
          !r && ((a = a.sibling), a !== null))
        ) {
          wa = a;
          return;
        }
        wa = a = i;
      } while (a !== null);
      ((Qa = 6), (wa = null));
    }
    function eh(a, r, i, n, s, d, b, k, R, Y, ae, pe) {
      a.cancelPendingCommit = null;
      do Ts();
      while (Ha !== 0);
      if ((Ea & 6) !== 0) throw Error(o(327));
      if (r !== null) {
        if (r === a.current) throw Error(o(177));
        (a === La && ((wa = La = null), (Ma = 0)),
          (ml = r),
          (vo = a),
          (Do = i),
          (Dd = s),
          ($m = n),
          k2(a, r, i, b, k, R, pe));
      }
    }
    function k2(a, r, i, n, s, d, b) {
      var k = r.lanes | r.childLanes;
      if (
        ((xd = k),
        (k |= bc),
        lc(a, i, k, n, s, d),
        (Hl = null),
        (i & 335544064) === i
          ? ((Wl = Z1(a)), (n = 10262))
          : ((Wl = null), (n = 10256)),
        (r.subtreeFlags & n) !== 0 || (r.flags & n) !== 0
          ? ((a.callbackNode = null),
            (a.callbackPriority = 0),
            E2(Br, function () {
              return (Bd(), null);
            }))
          : ((a.callbackNode = null), (a.callbackPriority = 0)),
        (is = !1),
        (n = (r.flags & 13878) !== 0),
        (r.subtreeFlags & 13878) !== 0 || n)
      ) {
        ((n = xe.T),
          (xe.T = null),
          (s = Ue.p),
          (Ue.p = 2),
          (d = Ea),
          (Ea |= 4));
        try {
          p2(a, r, i);
        } finally {
          ((Ea = d), (Ue.p = s), (xe.T = n));
        }
      }
      ((Ha = 1),
        is
          ? (Fl = W2(b, a.containerInfo, Wl, Ld, Od, C2, qd, Bd, M2))
          : (Ld(), Od(), qd()));
    }
    function M2(a) {
      if (Ha !== 0) {
        var r = vo.onRecoverableError;
        r(a, { componentStack: null });
      }
    }
    function C2() {
      Ha === 3 && ((Ha = 0), zm(ml, vo), (Ha = 4));
    }
    function Ld() {
      if (Ha === 1) {
        Ha = 0;
        var a = vo,
          r = ml,
          i = Do,
          n = (r.flags & 13878) !== 0;
        if ((r.subtreeFlags & 13878) !== 0 || n) {
          ((n = xe.T), (xe.T = null));
          var s = Ue.p;
          Ue.p = 2;
          var d = Ea;
          Ea |= 4;
          try {
            ((Fi = cs = !1), Dm(r, a, i), (i = Qd));
            var b = N0(a.containerInfo),
              k = i.focusedElem,
              R = i.selectionRange;
            if (
              b !== k &&
              k &&
              k.ownerDocument &&
              E0(k.ownerDocument.documentElement, k)
            ) {
              if (R !== null && fc(k)) {
                var Y = R.start,
                  ae = R.end;
                if ((ae === void 0 && (ae = Y), "selectionStart" in k))
                  ((k.selectionStart = Y),
                    (k.selectionEnd = Math.min(ae, k.value.length)));
                else {
                  var pe = k.ownerDocument || document,
                    B = (pe && pe.defaultView) || window;
                  if (B.getSelection) {
                    var Z = B.getSelection(),
                      Le = k.textContent.length,
                      Qe = Math.min(R.start, Le),
                      pa = R.end === void 0 ? Qe : Math.min(R.end, Le);
                    !Z.extend && Qe > pa && ((b = pa), (pa = Qe), (Qe = b));
                    var U = A0(k, Qe),
                      L = A0(k, pa);
                    if (
                      U &&
                      L &&
                      (Z.rangeCount !== 1 ||
                        Z.anchorNode !== U.node ||
                        Z.anchorOffset !== U.offset ||
                        Z.focusNode !== L.node ||
                        Z.focusOffset !== L.offset)
                    ) {
                      var H = pe.createRange();
                      (H.setStart(U.node, U.offset),
                        Z.removeAllRanges(),
                        Qe > pa
                          ? (Z.addRange(H), Z.extend(L.node, L.offset))
                          : (H.setEnd(L.node, L.offset), Z.addRange(H)));
                    }
                  }
                }
              }
              for (pe = [], Z = k; (Z = Z.parentNode); )
                Z.nodeType === 1 &&
                  pe.push({ element: Z, left: Z.scrollLeft, top: Z.scrollTop });
              for (
                typeof k.focus == "function" && k.focus(), k = 0;
                k < pe.length;
                k++
              ) {
                var fe = pe[k];
                ((fe.element.scrollLeft = fe.left),
                  (fe.element.scrollTop = fe.top));
              }
            }
            ((ii = !!Zd), (Qd = Zd = null));
          } finally {
            ((Ea = d), (Ue.p = s), (xe.T = n));
          }
        }
        ((a.current = r), (Ha = 2));
      }
    }
    function Od() {
      if (Ha === 2) {
        Ha = 0;
        var a = vo,
          r = ml,
          i = (r.flags & 8772) !== 0;
        if ((r.subtreeFlags & 8772) !== 0 || i) {
          ((i = xe.T), (xe.T = null));
          var n = Ue.p;
          Ue.p = 2;
          var s = Ea;
          Ea |= 4;
          try {
            Am(a, r.alternate, r);
          } finally {
            ((Ea = s), (Ue.p = n), (xe.T = i));
          }
        }
        Ha = 3;
      }
    }
    function qd() {
      if (Ha === 4 || Ha === 3) {
        Ha = 0;
        var a = Fl;
        ((Fl = null), Aa());
        var r = vo,
          i = ml,
          n = Do,
          s = $m,
          d = (n & 335544064) === n ? 10262 : 10256;
        if (
          ((i.subtreeFlags & d) !== 0 || (i.flags & d) !== 0
            ? (Ha = 5)
            : ((Ha = 0), (ml = vo = null), ah(r, r.pendingLanes)),
          (d = r.pendingLanes),
          d === 0 && (Ar = null),
          yi(n),
          (i = i.stateNode),
          At && typeof At.onCommitFiberRoot == "function")
        )
          try {
            At.onCommitFiberRoot(
              Oa,
              i,
              void 0,
              (i.current.flags & 128) === 128,
            );
          } catch {}
        if (s !== null) {
          ((i = xe.T), (d = Ue.p), (Ue.p = 2), (xe.T = null));
          try {
            for (var b = r.onRecoverableError, k = 0; k < s.length; k++) {
              var R = s[k];
              b(R.value, { componentStack: R.stack });
            }
          } finally {
            ((xe.T = i), (Ue.p = d));
          }
        }
        if (
          ((s = Hl),
          (b = Wl),
          (Wl = null),
          s !== null && ((Hl = null), b === null && (b = []), a !== null))
        )
          for (R = 0; R < s.length; R++)
            ((i = (0, s[R])(b)), i !== void 0 && a.finished.finally(i));
        ((Do & 3) !== 0 && Ts(),
          Io(r),
          (d = r.pendingLanes),
          (n & 261930) !== 0 && (d & 42) !== 0
            ? r === bs
              ? Zi++
              : ((Zi = 0), (bs = r))
            : ((Zi = 0), (bs = null)),
          Qi(0));
      }
    }
    function ah(a, r) {
      (a.pooledCacheLanes &= r) === 0 &&
        ((r = a.pooledCache), r != null && ((a.pooledCache = null), ji(r)));
    }
    function Ts() {
      return (
        Fl !== null && (Fl.skipTransition(), (Fl = null)),
        Ld(),
        Od(),
        qd(),
        Bd()
      );
    }
    function Bd() {
      if (Ha !== 5) return !1;
      var a = vo,
        r = xd;
      xd = 0;
      var i = yi(Do),
        n = xe.T,
        s = Ue.p;
      try {
        ((Ue.p = 32 > i ? 32 : i), (xe.T = null), (i = Dd), (Dd = null));
        var d = vo,
          b = Do;
        if (((Ha = 0), (ml = vo = null), (Do = 0), (Ea & 6) !== 0))
          throw Error(o(331));
        var k = Ea;
        if (
          ((Ea |= 4),
          Bm(d.current),
          Lm(d, d.current, b, i),
          (Ea = k),
          Qi(0, !1),
          At && typeof At.onPostCommitFiberRoot == "function")
        )
          try {
            At.onPostCommitFiberRoot(Oa, d);
          } catch {}
        return !0;
      } finally {
        ((Ue.p = s), (xe.T = n), ah(a, r));
      }
    }
    function th(a, r, i) {
      ((r = oo(i, r)),
        (r = od(a.stateNode, r, 2)),
        (a = wr(a, r, 2)),
        a !== null && (Ut(a, 2), Io(a)));
    }
    function ja(a, r, i) {
      if (a.tag === 3) th(a, a, i);
      else
        for (; r !== null; ) {
          if (r.tag === 3) {
            th(r, a, i);
            break;
          } else if (r.tag === 1) {
            var n = r.stateNode;
            if (
              typeof r.type.getDerivedStateFromError == "function" ||
              (typeof n.componentDidCatch == "function" &&
                (Ar === null || !Ar.has(n)))
            ) {
              ((a = oo(i, a)),
                (i = Qf(2)),
                (n = wr(r, i, 2)),
                n !== null && (Jf(i, n, r, a), Ut(n, 2), Io(n)));
              break;
            }
          }
          r = r.return;
        }
    }
    function Vd(a, r, i) {
      var n = a.pingCache;
      if (n === null) {
        n = a.pingCache = new y2();
        var s = new Set();
        n.set(r, s);
      } else ((s = n.get(r)), s === void 0 && ((s = new Set()), n.set(r, s)));
      s.has(i) ||
        ((Rd = !0), s.add(i), (a = P2.bind(null, a, r, i)), r.then(a, a));
    }
    function P2(a, r, i) {
      var n = a.pingCache;
      (n !== null && n.delete(r),
        (a.pingedLanes |= a.suspendedLanes & i),
        (a.warmLanes &= ~i),
        La === a &&
          (Ma & i) === i &&
          ((Qa === 4 ||
            (Qa === 3 && (Ma & 62914560) === Ma && 300 > ma() - hs)) &&
          (Ea & 2) === 0
            ? Zl(a, 0)
            : (ms |= i),
          Xl === Ma && (Xl = 0)),
        Io(a));
    }
    function oh(a, r) {
      (r === 0 && (r = bn()), (a = Zr(a, r)), a !== null && (Ut(a, r), Io(a)));
    }
    function _2(a) {
      var r = a.memoizedState,
        i = 0;
      (r !== null && (i = r.retryLane), oh(a, i));
    }
    function A2(a, r) {
      var i = 0;
      switch (a.tag) {
        case 31:
        case 13:
          var n = a.stateNode,
            s = a.memoizedState;
          s !== null && (i = s.retryLane);
          break;
        case 19:
          n = a.stateNode;
          break;
        case 22:
          n = a.stateNode._retryCache;
          break;
        default:
          throw Error(o(314));
      }
      (n !== null && n.delete(r), oh(a, i));
    }
    function E2(a, r) {
      return tr(a, r);
    }
    var Jl = null,
      ei = null,
      Ud = !1,
      Ss = !1,
      $d = !1,
      Nr = 0;
    function Io(a) {
      (a !== ei &&
        a.next === null &&
        (ei === null ? (Jl = ei = a) : (ei = ei.next = a)),
        (Ss = !0),
        Ud || ((Ud = !0), R2()));
    }
    function Qi(a, r) {
      if (!$d && Ss) {
        $d = !0;
        do
          for (var i = !1, n = Jl; n !== null; ) {
            if (a !== 0) {
              var s = n.pendingLanes;
              if (s === 0) var d = 0;
              else {
                var b = n.suspendedLanes,
                  k = n.pingedLanes;
                ((d = (1 << (31 - Ka(42 | a) + 1)) - 1),
                  (d &= s & ~(b & ~k)),
                  (d = d & 201326741 ? (d & 201326741) | 1 : d ? d | 2 : 0));
              }
              d !== 0 && ((i = !0), nh(n, d));
            } else
              ((d = Ma),
                (d = ir(
                  n,
                  n === La ? d : 0,
                  n.cancelPendingCommit !== null || n.timeoutHandle !== -1,
                )),
                (d & 3) === 0 || Vr(n, d) || ((i = !0), nh(n, d)));
            n = n.next;
          }
        while (i);
        $d = !1;
      }
    }
    function N2() {
      rh();
    }
    function rh() {
      Ss = Ud = !1;
      var a = 0;
      Nr !== 0 && U2() && (a = Nr);
      for (var r = ma(), i = null, n = Jl; n !== null; ) {
        var s = n.next,
          d = lh(n, r);
        (d === 0
          ? ((n.next = null),
            i === null ? (Jl = s) : (i.next = s),
            s === null && (ei = i))
          : ((i = n), (a !== 0 || (d & 3) !== 0) && (Ss = !0)),
          (n = s));
      }
      ((Ha !== 0 && Ha !== 5) || Qi(a), Nr !== 0 && (Nr = 0));
    }
    function lh(a, r) {
      for (
        var i = a.suspendedLanes,
          n = a.pingedLanes,
          s = a.expirationTimes,
          d = a.pendingLanes & -62914561;
        0 < d;

      ) {
        var b = 31 - Ka(d),
          k = 1 << b,
          R = s[b];
        (R === -1
          ? ((k & i) === 0 || (k & n) !== 0) && (s[b] = rc(k, r))
          : R <= r && (a.expiredLanes |= k),
          (d &= ~k));
      }
      if (
        ((r = La),
        (i = Ma),
        (i = ir(
          a,
          a === r ? i : 0,
          a.cancelPendingCommit !== null || a.timeoutHandle !== -1,
        )),
        (n = a.callbackNode),
        i === 0 ||
          (a === r && (Ra === 2 || Ra === 9)) ||
          a.cancelPendingCommit !== null)
      )
        return (
          n !== null && n !== null && So(n),
          (a.callbackNode = null),
          (a.callbackPriority = 0)
        );
      if ((i & 3) === 0 || Vr(a, i)) {
        if (((r = i & -i), r === a.callbackPriority)) return r;
        switch ((n !== null && So(n), yi(i))) {
          case 2:
          case 8:
            i = or;
            break;
          case 32:
            i = Br;
            break;
          case 268435456:
            i = Zt;
            break;
          default:
            i = Br;
        }
        return (
          (n = ih.bind(null, a)),
          (i = tr(i, n)),
          (a.callbackPriority = r),
          (a.callbackNode = i),
          r
        );
      }
      return (
        n !== null && n !== null && So(n),
        (a.callbackPriority = 2),
        (a.callbackNode = null),
        2
      );
    }
    function ih(a, r) {
      if (Ha !== 0 && Ha !== 5)
        return ((a.callbackNode = null), (a.callbackPriority = 0), null);
      var i = a.callbackNode;
      if (Ts() && a.callbackNode !== i) return null;
      var n = Ma;
      return (
        (n = ir(
          a,
          a === La ? n : 0,
          a.cancelPendingCommit !== null || a.timeoutHandle !== -1,
        )),
        n === 0
          ? null
          : (Gm(a, n, r),
            lh(a, ma()),
            a.callbackNode != null && a.callbackNode === i
              ? ih.bind(null, a)
              : null)
      );
    }
    function nh(a, r) {
      if (Ts()) return null;
      Gm(a, r, !0);
    }
    function R2() {
      Y2(function () {
        (Ea & 6) !== 0 ? tr(ko, N2) : rh();
      });
    }
    function Yd() {
      if (Nr === 0) {
        var a = ol;
        (a === 0 && ((a = rr), (rr <<= 1), (rr & 261888) === 0 && (rr = 256)),
          (Nr = a));
      }
      return Nr;
    }
    function sh(a) {
      return a == null || typeof a == "symbol" || typeof a == "boolean"
        ? null
        : typeof a == "function"
          ? a
          : Pa(a);
    }
    function j2(a, r, i, n, s) {
      if (r === "submit" && i && i.stateNode === s) {
        var d = sh((s[ut] || null).action),
          b = n.submitter;
        b &&
          ((r = (r = b[ut] || null)
            ? sh(r.formAction)
            : b.getAttribute("formAction")),
          r !== null && ((d = r), (b = null)));
        var k = new Xr("action", "action", null, n, s);
        a.push({
          event: k,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (n.defaultPrevented) {
                  if (Nr !== 0) {
                    var R = new FormData(s, b);
                    Qc(
                      i,
                      { pending: !0, data: R, method: s.method, action: d },
                      null,
                      R,
                    );
                  }
                } else
                  typeof d == "function" &&
                    (k.preventDefault(),
                    (R = new FormData(s, b)),
                    Qc(
                      i,
                      { pending: !0, data: R, method: s.method, action: d },
                      d,
                      R,
                    ));
              },
              currentTarget: s,
            },
          ],
        });
      }
    }
    for (var Gd = 0; Gd < gc.length; Gd++) {
      var Xd = gc[Gd],
        x2 = Xd.toLowerCase(),
        D2 = Xd[0].toUpperCase() + Xd.slice(1);
      po(x2, "on" + D2);
    }
    (po(x0, "onAnimationEnd"),
      po(D0, "onAnimationIteration"),
      po(I0, "onAnimationStart"),
      po("dblclick", "onDoubleClick"),
      po("focusin", "onFocus"),
      po("focusout", "onBlur"),
      po($1, "onTransitionRun"),
      po(Y1, "onTransitionStart"),
      po(G1, "onTransitionCancel"),
      po(z0, "onTransitionEnd"),
      Uo("onMouseEnter", ["mouseout", "mouseover"]),
      Uo("onMouseLeave", ["mouseout", "mouseover"]),
      Uo("onPointerEnter", ["pointerout", "pointerover"]),
      Uo("onPointerLeave", ["pointerout", "pointerover"]),
      Co(
        "onChange",
        "change click focusin focusout input keydown keyup selectionchange".split(
          " ",
        ),
      ),
      Co(
        "onSelect",
        "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
          " ",
        ),
      ),
      Co("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
      Co(
        "onCompositionEnd",
        "compositionend focusout keydown keypress keyup mousedown".split(" "),
      ),
      Co(
        "onCompositionStart",
        "compositionstart focusout keydown keypress keyup mousedown".split(" "),
      ),
      Co(
        "onCompositionUpdate",
        "compositionupdate focusout keydown keypress keyup mousedown".split(
          " ",
        ),
      ));
    var Ji =
        "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
          " ",
        ),
      I2 = new Set(
        "beforetoggle cancel close invalid load scroll scrollend toggle"
          .split(" ")
          .concat(Ji),
      );
    function ch(a, r) {
      r = (r & 4) !== 0;
      for (var i = 0; i < a.length; i++) {
        var n = a[i],
          s = n.event;
        n = n.listeners;
        e: {
          var d = void 0;
          if (r)
            for (var b = n.length - 1; 0 <= b; b--) {
              var k = n[b],
                R = k.instance,
                Y = k.currentTarget;
              if (((k = k.listener), R !== d && s.isPropagationStopped()))
                break e;
              ((d = k), (s.currentTarget = Y));
              try {
                d(s);
              } catch (ae) {
                Cn(ae);
              }
              ((s.currentTarget = null), (d = R));
            }
          else
            for (b = 0; b < n.length; b++) {
              if (
                ((k = n[b]),
                (R = k.instance),
                (Y = k.currentTarget),
                (k = k.listener),
                R !== d && s.isPropagationStopped())
              )
                break e;
              ((d = k), (s.currentTarget = Y));
              try {
                d(s);
              } catch (ae) {
                Cn(ae);
              }
              ((s.currentTarget = null), (d = R));
            }
        }
      }
    }
    function Ta(a, r) {
      var i = r[Sl];
      i === void 0 && (i = r[Sl] = new Set());
      var n = a + "__bubble";
      i.has(n) || (dh(r, a, 2, !1), i.add(n));
    }
    function Fd(a, r, i) {
      var n = 0;
      (r && (n |= 4), dh(i, a, n, r));
    }
    var ks = "_reactListening" + Math.random().toString(36).slice(2);
    function Hd(a) {
      if (!a[ks]) {
        ((a[ks] = !0),
          wi.forEach(function (i) {
            i !== "selectionchange" &&
              (I2.has(i) || Fd(i, !1, a), Fd(i, !0, a));
          }));
        var r = a.nodeType === 9 ? a : a.ownerDocument;
        r === null || r[ks] || ((r[ks] = !0), Fd("selectionchange", !1, r));
      }
    }
    function dh(a, r, i, n) {
      switch (Jh(r)) {
        case 2:
          var s = _5;
          break;
        case 8:
          s = A5;
          break;
        default:
          s = hu;
      }
      ((i = s.bind(null, r, i, a)),
        (s = void 0),
        !qa ||
          (r !== "touchstart" && r !== "touchmove" && r !== "wheel") ||
          (s = !0),
        n
          ? s !== void 0
            ? a.addEventListener(r, i, { capture: !0, passive: s })
            : a.addEventListener(r, i, !0)
          : s !== void 0
            ? a.addEventListener(r, i, { passive: s })
            : a.addEventListener(r, i, !1));
    }
    function Wd(a, r, i, n, s) {
      var d = n;
      if ((r & 1) === 0 && (r & 2) === 0 && n !== null)
        e: for (;;) {
          if (n === null) return;
          var b = n.tag;
          if (b === 3 || b === 4) {
            var k = n.stateNode.containerInfo;
            if (k === s) break;
            if (b === 4)
              for (b = n.return; b !== null; ) {
                var R = b.tag;
                if ((R === 3 || R === 4) && b.stateNode.containerInfo === s)
                  return;
                b = b.return;
              }
            for (; k !== null; ) {
              if (((b = Bo(k)), b === null)) return;
              if (((R = b.tag), R === 5 || R === 6 || R === 26 || R === 27)) {
                n = d = b;
                continue e;
              }
              k = k.parentNode;
            }
          }
          n = n.return;
        }
      eo(function () {
        var Y = d,
          ae = rt(i),
          pe = [];
        e: {
          var B = L0.get(a);
          if (B !== void 0) {
            var Z = Xr,
              Le = a;
            switch (a) {
              case "keypress":
                if (kl(i) === 0) break e;
              case "keydown":
              case "keyup":
                Z = v1;
                break;
              case "focusin":
                ((Le = "focus"), (Z = Pl));
                break;
              case "focusout":
                ((Le = "blur"), (Z = Pl));
                break;
              case "beforeblur":
              case "afterblur":
                Z = Pl;
                break;
              case "click":
                if (i.button === 2) break e;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                Z = Tn;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                Z = Hr;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                Z = M1;
                break;
              case x0:
              case D0:
              case I0:
                Z = d1;
                break;
              case z0:
                Z = P1;
                break;
              case "scroll":
              case "scrollend":
                Z = wn;
                break;
              case "wheel":
                Z = A1;
                break;
              case "copy":
              case "cut":
              case "paste":
                Z = f1;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                Z = h0;
                break;
              case "submit":
                Z = S1;
                break;
              case "toggle":
              case "beforetoggle":
                Z = N1;
            }
            var Qe = (r & 4) !== 0,
              pa = !Qe && (a === "scroll" || a === "scrollend"),
              U = Qe ? (B !== null ? B + "Capture" : null) : B;
            Qe = [];
            for (var L = Y, H; L !== null; ) {
              var fe = L;
              if (
                ((H = fe.stateNode),
                (fe = fe.tag),
                (fe !== 5 && fe !== 26 && fe !== 27) ||
                  H === null ||
                  U === null ||
                  ((fe = Rt(L, U)), fe != null && Qe.push(en(L, fe, H))),
                pa)
              )
                break;
              L = L.return;
            }
            0 < Qe.length &&
              ((B = new Z(B, Le, null, i, ae)),
              pe.push({ event: B, listeners: Qe }));
          }
        }
        if ((r & 7) === 0) {
          e: {
            if (
              ((Z = a === "mouseover" || a === "pointerover"),
              (B = a === "mouseout" || a === "pointerout"),
              Z &&
                i !== Nt &&
                (Le = i.relatedTarget || i.fromElement) &&
                (Bo(Le) || Le[cr]))
            )
              break e;
            (B || Z) &&
              ((Le =
                ae.window === ae
                  ? ae
                  : (Z = ae.ownerDocument)
                    ? Z.defaultView || Z.parentWindow
                    : window),
              B
                ? ((Z = i.relatedTarget || i.toElement),
                  (B = Y),
                  (Z = Z ? Bo(Z) : null),
                  Z !== null &&
                    ((pa = m(Z)),
                    (Qe = Z.tag),
                    Z !== pa || (Qe !== 5 && Qe !== 27 && Qe !== 6)) &&
                    (Z = null))
                : ((B = null), (Z = Y)),
              B !== Z &&
                ((Qe = Tn),
                (fe = "onMouseLeave"),
                (U = "onMouseEnter"),
                (L = "mouse"),
                (a === "pointerout" || a === "pointerover") &&
                  ((Qe = h0),
                  (fe = "onPointerLeave"),
                  (U = "onPointerEnter"),
                  (L = "pointer")),
                (pa = B == null ? Le : ur(B)),
                (H = Z == null ? Le : ur(Z)),
                (Le = new Qe(fe, L + "leave", B, i, ae)),
                (Le.target = pa),
                (Le.relatedTarget = H),
                (fe = null),
                Bo(ae) === Y &&
                  ((Qe = new Qe(U, L + "enter", Z, i, ae)),
                  (Qe.target = H),
                  (Qe.relatedTarget = pa),
                  (fe = Qe)),
                (pa = fe),
                (Qe = B && Z ? K(B, Z, z2) : null),
                B !== null && uh(pe, Le, B, Qe, !1),
                Z !== null && pa !== null && uh(pe, pa, Z, Qe, !0)));
          }
          e: {
            if (
              ((B = Y ? ur(Y) : window),
              (Z = B.nodeName && B.nodeName.toLowerCase()),
              Z === "select" || (Z === "input" && B.type === "file"))
            )
              var Xe = S0;
            else if (w0(B))
              if (k0) Xe = B1;
              else {
                Xe = O1;
                var Ca = L1;
              }
            else
              ((Z = B.nodeName),
                !Z ||
                Z.toLowerCase() !== "input" ||
                (B.type !== "checkbox" && B.type !== "radio")
                  ? Y && qe(Y.elementType) && (Xe = S0)
                  : (Xe = q1));
            if (Xe && (Xe = Xe(a, Y))) {
              T0(pe, Xe, i, ae);
              break e;
            }
            Ca && Ca(a, B, Y);
          }
          switch (((Ca = Y ? ur(Y) : window), a)) {
            case "focusin":
              (w0(Ca) || Ca.contentEditable === "true") &&
                ((Al = Ca), (mc = Y), (Ei = null));
              break;
            case "focusout":
              Ei = mc = Al = null;
              break;
            case "mousedown":
              hc = !0;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              ((hc = !1), R0(pe, i, ae));
              break;
            case "selectionchange":
              if (U1) break;
            case "keydown":
            case "keyup":
              R0(pe, i, ae);
          }
          var ta;
          if (sc)
            e: {
              switch (a) {
                case "compositionstart":
                  var ca = "onCompositionStart";
                  break e;
                case "compositionend":
                  ca = "onCompositionEnd";
                  break e;
                case "compositionupdate":
                  ca = "onCompositionUpdate";
                  break e;
              }
              ca = void 0;
            }
          else
            _l
              ? y0(a, i) && (ca = "onCompositionEnd")
              : a === "keydown" &&
                i.keyCode === 229 &&
                (ca = "onCompositionStart");
          (ca &&
            (p0 &&
              i.locale !== "ko" &&
              (_l || ca !== "onCompositionStart"
                ? ca === "onCompositionEnd" && _l && (ta = yn())
                : ((za = ae),
                  (It = "value" in za ? za.value : za.textContent),
                  (_l = !0))),
            (Ca = Ms(Y, ca)),
            0 < Ca.length &&
              ((ca = new m0(ca, a, null, i, ae)),
              pe.push({ event: ca, listeners: Ca }),
              ta
                ? (ca.data = ta)
                : ((ta = v0(i)), ta !== null && (ca.data = ta)))),
            (ta = j1 ? x1(a, i) : D1(a, i)) &&
              ((ca = Ms(Y, "onBeforeInput")),
              0 < ca.length &&
                ((Ca = new m0("onBeforeInput", "beforeinput", null, i, ae)),
                pe.push({ event: Ca, listeners: ca }),
                (Ca.data = ta))),
            j2(pe, a, Y, i, ae));
        }
        ch(pe, r);
      });
    }
    function en(a, r, i) {
      return { instance: a, listener: r, currentTarget: i };
    }
    function Ms(a, r) {
      for (var i = r + "Capture", n = []; a !== null; ) {
        var s = a,
          d = s.stateNode;
        if (
          ((s = s.tag),
          (s !== 5 && s !== 26 && s !== 27) ||
            d === null ||
            ((s = Rt(a, i)),
            s != null && n.unshift(en(a, s, d)),
            (s = Rt(a, r)),
            s != null && n.push(en(a, s, d))),
          a.tag === 3)
        )
          return n;
        a = a.return;
      }
      return [];
    }
    function z2(a) {
      if (a === null) return null;
      do a = a.return;
      while (a && a.tag !== 5 && a.tag !== 27);
      return a || null;
    }
    function uh(a, r, i, n, s) {
      for (var d = r._reactName, b = []; i !== null && i !== n; ) {
        var k = i,
          R = k.alternate,
          Y = k.stateNode;
        if (((k = k.tag), R !== null && R === n)) break;
        ((k !== 5 && k !== 26 && k !== 27) ||
          Y === null ||
          ((R = Y),
          s
            ? ((Y = Rt(i, d)), Y != null && b.unshift(en(i, Y, R)))
            : s || ((Y = Rt(i, d)), Y != null && b.push(en(i, Y, R)))),
          (i = i.return));
      }
      b.length !== 0 && a.push({ event: r, listeners: b });
    }
    var L2 = /\r\n?/g,
      O2 = /\u0000|\uFFFD/g;
    function fh(a) {
      return (typeof a == "string" ? a : "" + a)
        .replace(
          L2,
          `
`,
        )
        .replace(O2, "");
    }
    function mh(a, r) {
      return ((r = fh(r)), fh(a) === r);
    }
    function xa(a, r, i, n, s, d) {
      switch (i) {
        case "children":
          if (typeof n == "string")
            r === "body" || (r === "textarea" && n === "") || Pe(a, n);
          else if (typeof n == "number" || typeof n == "bigint")
            r !== "body" && Pe(a, "" + n);
          else return;
          break;
        case "className":
          re(a, "class", n);
          break;
        case "tabIndex":
          re(a, "tabindex", n);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          re(a, i, n);
          break;
        case "style":
          De(a, n, d);
          return;
        case "data":
          if (r !== "object") {
            re(a, "data", n);
            break;
          }
        case "src":
        case "href":
          if (n === "" && (r !== "a" || i !== "href")) {
            a.removeAttribute(i);
            break;
          }
          if (
            n == null ||
            typeof n == "function" ||
            typeof n == "symbol" ||
            typeof n == "boolean"
          ) {
            a.removeAttribute(i);
            break;
          }
          ((n = Pa(n)), a.setAttribute(i, n));
          break;
        case "action":
        case "formAction":
          if (typeof n == "function") {
            a.setAttribute(
              i,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
            );
            break;
          } else
            typeof d == "function" &&
              (i === "formAction"
                ? (r !== "input" && xa(a, r, "name", s.name, s, null),
                  xa(a, r, "formEncType", s.formEncType, s, null),
                  xa(a, r, "formMethod", s.formMethod, s, null),
                  xa(a, r, "formTarget", s.formTarget, s, null))
                : (xa(a, r, "encType", s.encType, s, null),
                  xa(a, r, "method", s.method, s, null),
                  xa(a, r, "target", s.target, s, null)));
          if (n == null || typeof n == "symbol" || typeof n == "boolean") {
            a.removeAttribute(i);
            break;
          }
          ((n = Pa(n)), a.setAttribute(i, n));
          break;
        case "onClick":
          n != null && (a.onclick = va);
          return;
        case "onScroll":
          n != null && Ta("scroll", a);
          return;
        case "onScrollEnd":
          n != null && Ta("scrollend", a);
          return;
        case "dangerouslySetInnerHTML":
          if (n != null) {
            if (typeof n != "object" || !("__html" in n)) throw Error(o(61));
            if (((i = n.__html), i != null)) {
              if (s.children != null) throw Error(o(60));
              (d != null ? d.__html : void 0) !== i && (a.innerHTML = i);
            }
          }
          break;
        case "multiple":
          a.multiple = n && typeof n != "function" && typeof n != "symbol";
          break;
        case "muted":
          a.muted = n && typeof n != "function" && typeof n != "symbol";
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (
            n == null ||
            typeof n == "function" ||
            typeof n == "boolean" ||
            typeof n == "symbol"
          ) {
            a.removeAttribute("xlink:href");
            break;
          }
          ((i = Pa(n)),
            a.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", i));
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          n != null && typeof n != "function" && typeof n != "symbol"
            ? a.setAttribute(i, n)
            : a.removeAttribute(i);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "credentialless":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          n && typeof n != "function" && typeof n != "symbol"
            ? a.setAttribute(i, "")
            : a.removeAttribute(i);
          break;
        case "capture":
        case "download":
          n === !0
            ? a.setAttribute(i, "")
            : n !== !1 &&
                n != null &&
                typeof n != "function" &&
                typeof n != "symbol"
              ? a.setAttribute(i, n)
              : a.removeAttribute(i);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          n != null &&
          typeof n != "function" &&
          typeof n != "symbol" &&
          !isNaN(n) &&
          1 <= n
            ? a.setAttribute(i, n)
            : a.removeAttribute(i);
          break;
        case "rowSpan":
        case "start":
          n == null ||
          typeof n == "function" ||
          typeof n == "symbol" ||
          isNaN(n)
            ? a.removeAttribute(i)
            : a.setAttribute(i, n);
          break;
        case "popover":
          (Ta("beforetoggle", a), Ta("toggle", a), ge(a, "popover", n));
          break;
        case "xlinkActuate":
          me(a, "http://www.w3.org/1999/xlink", "xlink:actuate", n);
          break;
        case "xlinkArcrole":
          me(a, "http://www.w3.org/1999/xlink", "xlink:arcrole", n);
          break;
        case "xlinkRole":
          me(a, "http://www.w3.org/1999/xlink", "xlink:role", n);
          break;
        case "xlinkShow":
          me(a, "http://www.w3.org/1999/xlink", "xlink:show", n);
          break;
        case "xlinkTitle":
          me(a, "http://www.w3.org/1999/xlink", "xlink:title", n);
          break;
        case "xlinkType":
          me(a, "http://www.w3.org/1999/xlink", "xlink:type", n);
          break;
        case "xmlBase":
          me(a, "http://www.w3.org/XML/1998/namespace", "xml:base", n);
          break;
        case "xmlLang":
          me(a, "http://www.w3.org/XML/1998/namespace", "xml:lang", n);
          break;
        case "xmlSpace":
          me(a, "http://www.w3.org/XML/1998/namespace", "xml:space", n);
          break;
        case "is":
          ge(a, "is", n);
          break;
        case "innerText":
        case "textContent":
          return;
        default:
          if (
            !(2 < i.length) ||
            (i[0] !== "o" && i[0] !== "O") ||
            (i[1] !== "n" && i[1] !== "N")
          )
            ((i = Ze.get(i) || i), ge(a, i, n));
          else return;
      }
      F = !0;
    }
    function Kd(a, r, i, n, s, d) {
      switch (i) {
        case "style":
          De(a, n, d);
          return;
        case "dangerouslySetInnerHTML":
          if (n != null) {
            if (typeof n != "object" || !("__html" in n)) throw Error(o(61));
            if (((i = n.__html), i != null)) {
              if (s.children != null) throw Error(o(60));
              (d != null ? d.__html : void 0) !== i && (a.innerHTML = i);
            }
          }
          break;
        case "children":
          if (typeof n == "string") Pe(a, n);
          else if (typeof n == "number" || typeof n == "bigint") Pe(a, "" + n);
          else return;
          break;
        case "onScroll":
          n != null && Ta("scroll", a);
          return;
        case "onScrollEnd":
          n != null && Ta("scrollend", a);
          return;
        case "onClick":
          n != null && (a.onclick = va);
          return;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          return;
        case "innerText":
        case "textContent":
          return;
        default:
          if (!Ti.hasOwnProperty(i))
            e: {
              if (
                i[0] === "o" &&
                i[1] === "n" &&
                ((s = i.endsWith("Capture")),
                (d = i.slice(2, s ? i.length - 7 : void 0)),
                (r = a[ut] || null),
                (r = r != null ? r[i] : null),
                typeof r == "function" && a.removeEventListener(d, r, s),
                typeof n == "function")
              ) {
                (typeof r != "function" &&
                  r !== null &&
                  (i in a
                    ? (a[i] = null)
                    : a.hasAttribute(i) && a.removeAttribute(i)),
                  a.addEventListener(d, n, s));
                break e;
              }
              ((F = !0),
                i in a
                  ? (a[i] = n)
                  : n === !0
                    ? a.setAttribute(i, "")
                    : ge(a, i, n));
            }
          return;
      }
      F = !0;
    }
    function Ct(a, r, i) {
      switch (r) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          (Ta("error", a), Ta("load", a));
          var n = !1,
            s = !1,
            d;
          for (d in i)
            if (i.hasOwnProperty(d)) {
              var b = i[d];
              if (b != null)
                switch (d) {
                  case "src":
                    n = !0;
                    break;
                  case "srcSet":
                    s = !0;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(o(137, r));
                  default:
                    xa(a, r, d, b, i, null);
                }
            }
          (s && xa(a, r, "srcSet", i.srcSet, i, null),
            n && xa(a, r, "src", i.src, i, null));
          return;
        case "input":
          Ta("invalid", a);
          var k = (d = b = s = null),
            R = null,
            Y = null;
          for (n in i)
            if (i.hasOwnProperty(n)) {
              var ae = i[n];
              if (ae != null)
                switch (n) {
                  case "name":
                    s = ae;
                    break;
                  case "type":
                    b = ae;
                    break;
                  case "checked":
                    R = ae;
                    break;
                  case "defaultChecked":
                    Y = ae;
                    break;
                  case "value":
                    d = ae;
                    break;
                  case "defaultValue":
                    k = ae;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (ae != null) throw Error(o(137, r));
                    break;
                  default:
                    xa(a, r, n, ae, i, null);
                }
            }
          he(a, d, k, R, Y, b, s, !1);
          return;
        case "select":
          (Ta("invalid", a), (n = b = d = null));
          for (s in i)
            if (i.hasOwnProperty(s) && ((k = i[s]), k != null))
              switch (s) {
                case "value":
                  d = k;
                  break;
                case "defaultValue":
                  b = k;
                  break;
                case "multiple":
                  n = k;
                default:
                  xa(a, r, s, k, i, null);
              }
          ((r = d),
            (i = b),
            (a.multiple = !!n),
            r != null ? da(a, !!n, r, !1) : i != null && da(a, !!n, i, !0));
          return;
        case "textarea":
          (Ta("invalid", a), (d = s = n = null));
          for (b in i)
            if (i.hasOwnProperty(b) && ((k = i[b]), k != null))
              switch (b) {
                case "value":
                  n = k;
                  break;
                case "defaultValue":
                  s = k;
                  break;
                case "children":
                  d = k;
                  break;
                case "dangerouslySetInnerHTML":
                  if (k != null) throw Error(o(91));
                  break;
                default:
                  xa(a, r, b, k, i, null);
              }
          Ge(a, n, s, d);
          return;
        case "option":
          for (R in i)
            if (i.hasOwnProperty(R) && ((n = i[R]), n != null))
              switch (R) {
                case "selected":
                  a.selected =
                    n && typeof n != "function" && typeof n != "symbol";
                  break;
                default:
                  xa(a, r, R, n, i, null);
              }
          return;
        case "dialog":
          (Ta("beforetoggle", a),
            Ta("toggle", a),
            Ta("cancel", a),
            Ta("close", a));
          break;
        case "iframe":
        case "object":
          Ta("load", a);
          break;
        case "video":
        case "audio":
          for (n = 0; n < Ji.length; n++) Ta(Ji[n], a);
          break;
        case "image":
          (Ta("error", a), Ta("load", a));
          break;
        case "details":
          Ta("toggle", a);
          break;
        case "embed":
        case "source":
        case "link":
          (Ta("error", a), Ta("load", a));
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (Y in i)
            if (i.hasOwnProperty(Y) && ((n = i[Y]), n != null))
              switch (Y) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, r));
                default:
                  xa(a, r, Y, n, i, null);
              }
          return;
        default:
          if (qe(r)) {
            for (ae in i)
              i.hasOwnProperty(ae) &&
                ((n = i[ae]), n !== void 0 && Kd(a, r, ae, n, i, void 0));
            return;
          }
      }
      for (k in i)
        i.hasOwnProperty(k) &&
          ((n = i[k]), n != null && xa(a, r, k, n, i, null));
    }
    var q2 = {};
    function B2(a, r, i, n) {
      switch (r) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var s = null,
            d = null,
            b = null,
            k = null,
            R = null,
            Y = null,
            ae = null;
          for (Z in i) {
            var pe = i[Z];
            if (i.hasOwnProperty(Z) && pe != null)
              switch (Z) {
                case "checked":
                  break;
                case "value":
                  break;
                case "defaultValue":
                  R = pe;
                default:
                  n.hasOwnProperty(Z) || xa(a, r, Z, null, n, pe);
              }
          }
          for (var B in n) {
            var Z = n[B];
            if (((pe = i[B]), n.hasOwnProperty(B) && (Z != null || pe != null)))
              switch (B) {
                case "type":
                  (Z !== pe && (F = !0), (d = Z));
                  break;
                case "name":
                  (Z !== pe && (F = !0), (s = Z));
                  break;
                case "checked":
                  (Z !== pe && (F = !0), (Y = Z));
                  break;
                case "defaultChecked":
                  (Z !== pe && (F = !0), (ae = Z));
                  break;
                case "value":
                  (Z !== pe && (F = !0), (b = Z));
                  break;
                case "defaultValue":
                  (Z !== pe && (F = !0), (k = Z));
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (Z != null) throw Error(o(137, r));
                  break;
                default:
                  Z !== pe && xa(a, r, B, Z, n, pe);
              }
          }
          Je(a, b, k, R, Y, ae, d, s);
          return;
        case "select":
          Z = b = k = B = null;
          for (d in i)
            if (((R = i[d]), i.hasOwnProperty(d) && R != null))
              switch (d) {
                case "value":
                  break;
                case "multiple":
                  Z = R;
                default:
                  n.hasOwnProperty(d) || xa(a, r, d, null, n, R);
              }
          for (s in n)
            if (
              ((d = n[s]),
              (R = i[s]),
              n.hasOwnProperty(s) && (d != null || R != null))
            )
              switch (s) {
                case "value":
                  (d !== R && (F = !0), (B = d));
                  break;
                case "defaultValue":
                  (d !== R && (F = !0), (k = d));
                  break;
                case "multiple":
                  (d !== R && (F = !0), (b = d));
                default:
                  d !== R && xa(a, r, s, d, n, R);
              }
          ((r = k),
            (i = b),
            (n = Z),
            B != null
              ? da(a, !!i, B, !1)
              : !!n != !!i &&
                (r != null ? da(a, !!i, r, !0) : da(a, !!i, i ? [] : "", !1)));
          return;
        case "textarea":
          Z = B = null;
          for (k in i)
            if (
              ((s = i[k]),
              i.hasOwnProperty(k) && s != null && !n.hasOwnProperty(k))
            )
              switch (k) {
                case "value":
                  break;
                case "children":
                  break;
                default:
                  xa(a, r, k, null, n, s);
              }
          for (b in n)
            if (
              ((s = n[b]),
              (d = i[b]),
              n.hasOwnProperty(b) && (s != null || d != null))
            )
              switch (b) {
                case "value":
                  (s !== d && (F = !0), (B = s));
                  break;
                case "defaultValue":
                  (s !== d && (F = !0), (Z = s));
                  break;
                case "children":
                  break;
                case "dangerouslySetInnerHTML":
                  if (s != null) throw Error(o(91));
                  break;
                default:
                  s !== d && xa(a, r, b, s, n, d);
              }
          Ye(a, B, Z);
          return;
        case "option":
          for (var Le in i)
            if (
              ((B = i[Le]),
              i.hasOwnProperty(Le) && B != null && !n.hasOwnProperty(Le))
            )
              switch (Le) {
                case "selected":
                  a.selected = !1;
                  break;
                default:
                  xa(a, r, Le, null, n, B);
              }
          for (R in n)
            if (
              ((B = n[R]),
              (Z = i[R]),
              n.hasOwnProperty(R) && B !== Z && (B != null || Z != null))
            )
              switch (R) {
                case "selected":
                  (B !== Z && (F = !0),
                    (a.selected =
                      B && typeof B != "function" && typeof B != "symbol"));
                  break;
                default:
                  xa(a, r, R, B, n, Z);
              }
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var Qe in i)
            ((B = i[Qe]),
              i.hasOwnProperty(Qe) &&
                B != null &&
                !n.hasOwnProperty(Qe) &&
                xa(a, r, Qe, null, n, B));
          for (Y in n)
            if (
              ((B = n[Y]),
              (Z = i[Y]),
              n.hasOwnProperty(Y) && B !== Z && (B != null || Z != null))
            )
              switch (Y) {
                case "children":
                case "dangerouslySetInnerHTML":
                  if (B != null) throw Error(o(137, r));
                  break;
                default:
                  xa(a, r, Y, B, n, Z);
              }
          return;
        default:
          if (qe(r)) {
            for (var pa in i)
              ((B = i[pa]),
                i.hasOwnProperty(pa) &&
                  B !== void 0 &&
                  !n.hasOwnProperty(pa) &&
                  Kd(a, r, pa, void 0, n, B));
            for (ae in n)
              ((B = n[ae]),
                (Z = i[ae]),
                !n.hasOwnProperty(ae) ||
                  B === Z ||
                  (B === void 0 && Z === void 0) ||
                  Kd(a, r, ae, B, n, Z));
            return;
          }
      }
      for (var U in i)
        ((B = i[U]),
          i.hasOwnProperty(U) &&
            B != null &&
            !n.hasOwnProperty(U) &&
            xa(a, r, U, null, n, B));
      for (pe in n)
        ((B = n[pe]),
          (Z = i[pe]),
          !n.hasOwnProperty(pe) ||
            B === Z ||
            (B == null && Z == null) ||
            xa(a, r, pe, B, n, Z));
    }
    function hh(a) {
      switch (a) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return !0;
        default:
          return !1;
      }
    }
    function V2() {
      if (typeof performance.getEntriesByType == "function") {
        for (
          var a = 0, r = 0, i = performance.getEntriesByType("resource"), n = 0;
          n < i.length;
          n++
        ) {
          var s = i[n],
            d = s.transferSize,
            b = s.initiatorType,
            k = s.duration;
          if (d && k && hh(b)) {
            for (b = 0, k = s.responseEnd, n += 1; n < i.length; n++) {
              var R = i[n],
                Y = R.startTime;
              if (Y > k) break;
              var ae = R.transferSize,
                pe = R.initiatorType;
              ae &&
                hh(pe) &&
                ((R = R.responseEnd),
                (b += ae * (R < k ? 1 : (k - Y) / (R - Y))));
            }
            if ((--n, (r += (8 * (d + b)) / (s.duration / 1e3)), a++, 10 < a))
              break;
          }
        }
        if (0 < a) return r / a / 1e6;
      }
      return navigator.connection &&
        ((a = navigator.connection.downlink), typeof a == "number")
        ? a
        : 5;
    }
    var Zd = null,
      Qd = null;
    function an(a) {
      return a.nodeType === 9 ? a : a.ownerDocument;
    }
    function ph(a) {
      switch (a) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function gh(a, r) {
      if (a === 0)
        switch (r) {
          case "svg":
            return 1;
          case "math":
            return 2;
          default:
            return 0;
        }
      return a === 1 && r === "foreignObject" ? 0 : a;
    }
    function bh(a, r, i, n) {
      return (
        (i = an(i).createElement(a)),
        (i[dt] = n),
        (i[ut] = r),
        Ct(i, a, r),
        at(i),
        i
      );
    }
    function Jd(a, r) {
      return (
        a === "textarea" ||
        a === "noscript" ||
        typeof r.children == "string" ||
        typeof r.children == "number" ||
        typeof r.children == "bigint" ||
        (typeof r.dangerouslySetInnerHTML == "object" &&
          r.dangerouslySetInnerHTML !== null &&
          r.dangerouslySetInnerHTML.__html != null)
      );
    }
    var eu = null;
    function U2() {
      var a = window.event;
      return a && a.type === "popstate"
        ? a === eu
          ? !1
          : ((eu = a), !0)
        : ((eu = null), !1);
    }
    var au = typeof setTimeout == "function" ? setTimeout : void 0,
      $2 = typeof clearTimeout == "function" ? clearTimeout : void 0,
      yh = typeof Promise == "function" ? Promise : void 0,
      vh =
        typeof requestAnimationFrame == "function" ? requestAnimationFrame : au,
      Y2 =
        typeof queueMicrotask == "function"
          ? queueMicrotask
          : typeof yh < "u"
            ? function (a) {
                return yh.resolve(null).then(a).catch(G2);
              }
            : au;
    function G2(a) {
      setTimeout(function () {
        throw a;
      });
    }
    function Rr(a) {
      return a === "head";
    }
    function wh(a, r) {
      var i = r,
        n = 0;
      do {
        var s = i.nextSibling;
        if ((a.removeChild(i), s && s.nodeType === 8))
          if (((i = s.data), i === "/$" || i === "/&")) {
            if (n === 0) {
              (a.removeChild(s), ni(r));
              return;
            }
            n--;
          } else if (
            i === "$" ||
            i === "$?" ||
            i === "$~" ||
            i === "$!" ||
            i === "&"
          )
            n++;
          else if (i === "html") cu(a.ownerDocument.documentElement);
          else if (i === "head") {
            ((i = a.ownerDocument.head), cu(i));
            for (var d = i.firstChild; d; ) {
              var b = d.nextSibling,
                k = d.nodeName;
              (d[Mo] ||
                k === "SCRIPT" ||
                k === "STYLE" ||
                (k === "LINK" && d.rel.toLowerCase() === "stylesheet") ||
                i.removeChild(d),
                (d = b));
            }
          } else i === "body" && cu(a.ownerDocument.body);
        i = s;
      } while (i);
      ni(r);
    }
    function Th(a, r) {
      var i = a;
      a = 0;
      do {
        var n = i.nextSibling;
        if (
          (i.nodeType === 1
            ? r
              ? ((i._stashedDisplay = i.style.display),
                (i.style.display = "none"))
              : ((i.style.display = i._stashedDisplay || ""),
                i.getAttribute("style") === "" && i.removeAttribute("style"))
            : i.nodeType === 3 &&
              (r
                ? ((i._stashedText = i.nodeValue), (i.nodeValue = ""))
                : (i.nodeValue = i._stashedText || "")),
          n && n.nodeType === 8)
        )
          if (((i = n.data), i === "/$")) {
            if (a === 0) break;
            a--;
          } else (i !== "$" && i !== "$?" && i !== "$~" && i !== "$!") || a++;
        i = n;
      } while (i);
    }
    function Sh(a, r, i) {
      if (
        ((r = CSS.escape(r) !== r ? "r-" + btoa(r).replace(/=/g, "") : r),
        (a.style.viewTransitionName = r),
        i != null && (a.style.viewTransitionClass = i),
        (i = getComputedStyle(a)),
        i.display === "inline")
      ) {
        if (((r = a.getClientRects()), r.length === 1)) var n = 1;
        else
          for (var s = (n = 0); s < r.length; s++) {
            var d = r[s];
            0 < d.width && 0 < d.height && n++;
          }
        n === 1 &&
          ((a = a.style),
          (a.display = r.length === 1 ? "inline-block" : "block"),
          (a.marginTop = "-" + i.paddingTop),
          (a.marginBottom = "-" + i.paddingBottom));
      }
    }
    function kh(a, r) {
      ((a = a.style), (r = r.style));
      var i =
        r != null
          ? r.hasOwnProperty("viewTransitionName")
            ? r.viewTransitionName
            : r.hasOwnProperty("view-transition-name")
              ? r["view-transition-name"]
              : null
          : null;
      ((a.viewTransitionName =
        i == null || typeof i == "boolean" ? "" : ("" + i).trim()),
        (i =
          r != null
            ? r.hasOwnProperty("viewTransitionClass")
              ? r.viewTransitionClass
              : r.hasOwnProperty("view-transition-class")
                ? r["view-transition-class"]
                : null
            : null),
        (a.viewTransitionClass =
          i == null || typeof i == "boolean" ? "" : ("" + i).trim()),
        a.display === "inline-block" &&
          (r == null
            ? (a.display = a.margin = "")
            : ((i = r.display),
              (a.display = i == null || typeof i == "boolean" ? "" : i),
              (i = r.margin),
              i != null
                ? (a.margin = i)
                : ((i = r.hasOwnProperty("marginTop")
                    ? r.marginTop
                    : r["margin-top"]),
                  (a.marginTop = i == null || typeof i == "boolean" ? "" : i),
                  (r = r.hasOwnProperty("marginBottom")
                    ? r.marginBottom
                    : r["margin-bottom"]),
                  (a.marginBottom =
                    r == null || typeof r == "boolean" ? "" : r)))));
    }
    function X2(a, r, i) {
      return (
        (i = i.ownerDocument.defaultView),
        {
          rect: a,
          abs: r.position === "absolute" || r.position === "fixed",
          clip:
            r.clipPath !== "none" ||
            r.overflow !== "visible" ||
            r.filter !== "none" ||
            r.mask !== "none" ||
            r.mask !== "none" ||
            r.borderRadius !== "0px",
          view:
            0 <= a.bottom &&
            0 <= a.right &&
            a.top <= i.innerHeight &&
            a.left <= i.innerWidth,
        }
      );
    }
    function tu(a) {
      var r = a.getBoundingClientRect(),
        i = getComputedStyle(a);
      return X2(r, i, a);
    }
    function F2(a) {
      return a.documentElement.clientHeight;
    }
    function H2(a) {
      (this.addEventListener("load", a), this.addEventListener("error", a));
    }
    function W2(a, r, i, n, s, d, b, k, R) {
      var Y = r.nodeType === 9 ? r : r.ownerDocument;
      try {
        var ae = Y.startViewTransition({
          update: function () {
            var B = Y.defaultView,
              Z = B.navigation && B.navigation.transition,
              Le = Y.fonts.status;
            n();
            var Qe = [];
            if (
              (Le === "loaded" &&
                (F2(Y), Y.fonts.status === "loading" && Qe.push(Y.fonts.ready)),
              (Le = Qe.length),
              a !== null)
            )
              for (
                var pa = a.suspenseyImages, U = 0, L = 0;
                L < pa.length;
                L++
              ) {
                var H = pa[L];
                if (!H.complete) {
                  var fe = H.getBoundingClientRect();
                  if (
                    0 < fe.bottom &&
                    0 < fe.right &&
                    fe.top < B.innerHeight &&
                    fe.left < B.innerWidth
                  ) {
                    if (((U += Yh(H)), U > _s)) {
                      Qe.length = Le;
                      break;
                    }
                    ((H = new Promise(H2.bind(H))), Qe.push(H));
                  }
                }
              }
            if (0 < Qe.length)
              return (
                (B = Promise.race([
                  Promise.all(Qe),
                  new Promise(function (Xe) {
                    return setTimeout(Xe, 500);
                  }),
                ]).then(s, s)),
                (Z ? Promise.allSettled([Z.finished, B]) : B).then(d, d)
              );
            if ((s(), Z)) return Z.finished.then(d, d);
            d();
          },
          types: i,
        });
        Y.__reactViewTransition = ae;
        var pe = [];
        return (
          ae.ready.then(
            function () {
              for (
                var B = Y.documentElement.getAnimations({ subtree: !0 }), Z = 0;
                Z < B.length;
                Z++
              ) {
                var Le = B[Z],
                  Qe = Le.effect,
                  pa = Qe.pseudoElement;
                if (pa != null && pa.startsWith("::view-transition")) {
                  (pe.push(Le), (Le = Qe.getKeyframes()));
                  for (
                    var U = (pa = void 0), L = !0, H = 0;
                    H < Le.length;
                    H++
                  ) {
                    var fe = Le[H],
                      Xe = fe.width;
                    if (pa === void 0) pa = Xe;
                    else if (pa !== Xe) {
                      L = !1;
                      break;
                    }
                    if (((Xe = fe.height), U === void 0)) U = Xe;
                    else if (U !== Xe) {
                      L = !1;
                      break;
                    }
                    (delete fe.width,
                      delete fe.height,
                      fe.transform === "none" && delete fe.transform);
                  }
                  L &&
                    pa !== void 0 &&
                    U !== void 0 &&
                    (Qe.setKeyframes(Le),
                    (L = getComputedStyle(Qe.target, Qe.pseudoElement)),
                    L.width !== pa || L.height !== U) &&
                    ((L = Le[0]),
                    (L.width = pa),
                    (L.height = U),
                    (L = Le[Le.length - 1]),
                    (L.width = pa),
                    (L.height = U),
                    Qe.setKeyframes(Le));
                }
              }
              b();
            },
            function (B) {
              Y.__reactViewTransition === ae &&
                (Y.__reactViewTransition = null);
              try {
                if (typeof B == "object" && B !== null)
                  switch (B.name) {
                    case "InvalidStateError":
                      (B.message ===
                        "View transition was skipped because document visibility state is hidden." ||
                        B.message ===
                          "Skipping view transition because document visibility state has become hidden." ||
                        B.message ===
                          "Skipping view transition because viewport size changed." ||
                        B.message ===
                          "Transition was aborted because of invalid state") &&
                        (B = null);
                  }
                B !== null && R(B);
              } finally {
                (n(), s(), b());
              }
            },
          ),
          ae.finished.finally(function () {
            for (var B = 0; B < pe.length; B++) pe[B].cancel();
            (Y.__reactViewTransition === ae && (Y.__reactViewTransition = null),
              k());
          }),
          ae
        );
      } catch {
        return (n(), s(), b(), null);
      }
    }
    function hl(a, r) {
      ((this._scope = document.documentElement),
        (this._selector = "::view-transition-" + a + "(" + r + ")"));
    }
    ((hl.prototype.animate = function (a, r) {
      return (
        (r = typeof r == "number" ? { duration: r } : V({}, r)),
        (r.pseudoElement = this._selector),
        this._scope.animate(a, r)
      );
    }),
      (hl.prototype.getAnimations = function () {
        for (
          var a = this._scope,
            r = this._selector,
            i = a.getAnimations({ subtree: !0 }),
            n = [],
            s = 0;
          s < i.length;
          s++
        ) {
          var d = i[s].effect;
          d !== null && d.target === a && d.pseudoElement === r && n.push(i[s]);
        }
        return n;
      }),
      (hl.prototype.getComputedStyle = function () {
        return getComputedStyle(this._scope, this._selector);
      }));
    function Mh(a) {
      return {
        name: a,
        group: new hl("group", a),
        imagePair: new hl("image-pair", a),
        old: new hl("old", a),
        new: new hl("new", a),
      };
    }
    function Wt(a) {
      ((this._fragmentFiber = a),
        (this._observers = this._eventListeners = null));
    }
    Wt.prototype.addEventListener = function (a, r, i) {
      var n = null,
        s = null;
      if (
        !(
          i != null &&
          typeof i != "boolean" &&
          ((n = i.signal || null), n !== null && n.aborted)
        )
      ) {
        this._eventListeners === null && (this._eventListeners = []);
        var d = this._eventListeners;
        if (Ph(d, a, r, i) === -1) {
          var b = this,
            k = r;
          (i != null &&
            typeof i != "boolean" &&
            i.once === !0 &&
            (k = function (R) {
              (b.removeEventListener(a, r, i),
                typeof r == "function" ? r.call(this, R) : r.handleEvent(R));
            }),
            n !== null &&
              ((s = b.removeEventListener.bind(b, a, r, i)),
              n.addEventListener("abort", s, { once: !0 }),
              (s = n.removeEventListener.bind(n, "abort", s))),
            (n = ai(i)),
            d.push({
              type: a,
              listener: r,
              optionsOrUseCapture: i,
              attachedListener: k,
              cleanup: s,
            }),
            v(this._fragmentFiber.child, !1, K2, a, k, n));
        }
        this._eventListeners = d;
      }
    };
    function K2(a, r, i, n) {
      return (P(a).addEventListener(r, i, n), !1);
    }
    Wt.prototype.removeEventListener = function (a, r, i) {
      var n = this._eventListeners;
      if (n !== null && ((r = Ph(n, a, r, i)), r !== -1)) {
        var s = n[r];
        i = s.attachedListener;
        var d = s.cleanup;
        ((s = ai(s.optionsOrUseCapture)),
          v(this._fragmentFiber.child, !1, Z2, a, i, s),
          n.splice(r, 1),
          d !== null && d());
      }
    };
    function Z2(a, r, i, n) {
      return (P(a).removeEventListener(r, i, n), !1);
    }
    function ai(a) {
      return a != null &&
        typeof a != "boolean" &&
        (a.once === !0 || a.signal instanceof AbortSignal)
        ? { capture: a.capture, passive: a.passive }
        : a;
    }
    function Ch(a) {
      return a == null
        ? "c=0"
        : typeof a == "boolean"
          ? "c=" + (a ? "1" : "0")
          : "c=" + (a.capture ? "1" : "0");
    }
    function Ph(a, r, i, n) {
      if (a.length === 0) return -1;
      n = Ch(n);
      for (var s = 0; s < a.length; s++) {
        var d = a[s];
        if (d.type === r && d.listener === i && Ch(d.optionsOrUseCapture) === n)
          return s;
      }
      return -1;
    }
    ((Wt.prototype.dispatchEvent = function (a) {
      var r = T(this._fragmentFiber);
      if (r === null) return !0;
      r = P(r);
      var i = this._eventListeners;
      if ((i !== null && 0 < i.length) || !a.bubbles) {
        var n =
          r.nodeType === 9 ? r.createComment("") : document.createTextNode("");
        if (i)
          for (var s = 0; s < i.length; s++) {
            var d = i[s];
            n.addEventListener(
              d.type,
              d.attachedListener,
              ai(d.optionsOrUseCapture),
            );
          }
        if ((r.appendChild(n), (a = n.dispatchEvent(a)), i))
          for (s = 0; s < i.length; s++)
            ((d = i[s]),
              n.removeEventListener(
                d.type,
                d.attachedListener,
                ai(d.optionsOrUseCapture),
              ));
        return (r.removeChild(n), a);
      }
      return r.dispatchEvent(a);
    }),
      (Wt.prototype.focus = function (a) {
        v(this._fragmentFiber.child, !0, _h, a, void 0, void 0);
      }));
    function _h(a, r) {
      return a.tag === 6 ? !1 : ((a = P(a)), c5(a, r));
    }
    Wt.prototype.focusLast = function (a) {
      var r = [];
      v(this._fragmentFiber.child, !0, ou, r, void 0, void 0);
      for (var i = r.length - 1; 0 <= i && !_h(r[i], a); i--);
    };
    function ou(a, r) {
      return (r.push(a), !1);
    }
    Wt.prototype.blur = function () {
      var a = T(this._fragmentFiber);
      a !== null &&
        ((a = P(a)),
        (a = an(a).activeElement),
        a !== null && v(this._fragmentFiber.child, !1, Q2, a, void 0, void 0));
    };
    function Q2(a, r) {
      return a.tag === 6
        ? !1
        : ((a = P(a)), a === r || a.contains(r) ? (r.blur(), !0) : !1);
    }
    Wt.prototype.observeUsing = function (a) {
      (this._observers === null && (this._observers = new Set()),
        this._observers.add(a),
        v(this._fragmentFiber.child, !1, J2, a, void 0, void 0));
    };
    function J2(a, r) {
      return (a.tag === 6 || ((a = P(a)), r.observe(a)), !1);
    }
    Wt.prototype.unobserveUsing = function (a) {
      var r = this._observers;
      if (r !== null && r.has(a)) {
        (r.delete(a), v(this._fragmentFiber.child, !1, e5, a, void 0, void 0));
        for (var i = (r = 0); i < wo.length; i++) {
          var n = wo[i];
          n.fragmentInstance === this && n.observer === a
            ? a.unobserve(n.instance)
            : (wo[r++] = n);
        }
        wo.length = r;
      }
    };
    function e5(a, r) {
      return (a.tag === 6 || ((a = P(a)), r.unobserve(a)), !1);
    }
    var wo = [],
      ru = !1;
    function a5(a, r, i) {
      (wo.push({ fragmentInstance: a, observer: r, instance: i }),
        ru ||
          ((ru = !0),
          d5(function () {
            ru = !1;
            var n = wo;
            wo = [];
            for (var s = 0; s < n.length; s++) {
              var d = n[s];
              d.observer.unobserve(d.instance);
            }
          })));
    }
    Wt.prototype.getClientRects = function () {
      var a = [];
      return (v(this._fragmentFiber.child, !1, t5, a, void 0, void 0), a);
    };
    function t5(a, r) {
      if (a.tag === 6) {
        a = a.stateNode;
        var i = a.ownerDocument.createRange();
        (i.selectNodeContents(a), r.push.apply(r, i.getClientRects()));
      } else ((a = P(a)), r.push.apply(r, a.getClientRects()));
      return !1;
    }
    ((Wt.prototype.getRootNode = function (a) {
      var r = T(this._fragmentFiber);
      return r === null ? this : P(r).getRootNode(a);
    }),
      (Wt.prototype.compareDocumentPosition = function (a) {
        var r = T(this._fragmentFiber);
        if (r === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
        var i = [];
        v(this._fragmentFiber.child, !1, ou, i, void 0, void 0);
        var n = P(r);
        if (i.length === 0) {
          if (((i = n), S(this._fragmentFiber))) {
            e: {
              for (r = this._fragmentFiber.return; r !== null; ) {
                if (r.tag === 4) {
                  r = r.stateNode.containerInfo;
                  break e;
                }
                if (r.tag === 3 || r.tag === 5 || r.tag === 27) break;
                r = r.return;
              }
              r = null;
            }
            r != null && (i = r);
          }
          r = this._fragmentFiber;
          var s = (n = i.compareDocumentPosition(a));
          return (
            i === a
              ? (s = Node.DOCUMENT_POSITION_CONTAINS)
              : n & Node.DOCUMENT_POSITION_CONTAINED_BY &&
                ((i = p(r)[1]),
                i === null
                  ? (s = Node.DOCUMENT_POSITION_PRECEDING)
                  : ((a = P(i).compareDocumentPosition(a)),
                    (s =
                      a === 0 || a & Node.DOCUMENT_POSITION_FOLLOWING
                        ? Node.DOCUMENT_POSITION_FOLLOWING
                        : Node.DOCUMENT_POSITION_PRECEDING))),
            (s |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC)
          );
        }
        ((r = P(i[0])), (s = P(i[i.length - 1])));
        var d = S(this._fragmentFiber) ? r.parentElement : n;
        if (d == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
        ((n =
          d.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_CONTAINED_BY),
          (d =
            d.compareDocumentPosition(s) &
            Node.DOCUMENT_POSITION_CONTAINED_BY));
        var b = r.compareDocumentPosition(a),
          k = s.compareDocumentPosition(a),
          R =
            b & Node.DOCUMENT_POSITION_CONTAINED_BY ||
            k & Node.DOCUMENT_POSITION_CONTAINED_BY;
        return (
          (k =
            n &&
            d &&
            b & Node.DOCUMENT_POSITION_FOLLOWING &&
            k & Node.DOCUMENT_POSITION_PRECEDING),
          (r =
            (n && r === a) || (d && s === a) || R || k
              ? Node.DOCUMENT_POSITION_CONTAINED_BY
              : (!n && r === a) || (!d && s === a)
                ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                : b),
          r & Node.DOCUMENT_POSITION_DISCONNECTED ||
          r & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC ||
          o5(r, this._fragmentFiber, i[0], i[i.length - 1], a)
            ? r
            : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
        );
      }));
    function o5(a, r, i, n, s) {
      var d = Bo(s);
      if (a & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        if ((i = !!d))
          e: {
            for (; d !== null; ) {
              if (d.tag === 7 && (d === r || d.alternate === r)) {
                i = !0;
                break e;
              }
              d = d.return;
            }
            i = !1;
          }
        return i;
      }
      if (a & Node.DOCUMENT_POSITION_CONTAINS) {
        if (d === null)
          return (
            (d = s.ownerDocument),
            s === d || s === d.documentElement || s === d.body
          );
        e: {
          for (d = r, r = T(r); d !== null; ) {
            if (
              !(
                (d.tag !== 5 && d.tag !== 3 && d.tag !== 27) ||
                (d !== r && d.alternate !== r)
              )
            ) {
              d = !0;
              break e;
            }
            d = d.return;
          }
          d = !1;
        }
        return d;
      }
      return a & Node.DOCUMENT_POSITION_PRECEDING
        ? ((r = !!d) &&
            !(r = d === i) &&
            ((r = K(i, d, z)),
            r === null
              ? (r = !1)
              : (v(r, !0, M, d, i), (d = A), (A = null), (r = d !== null))),
          r)
        : a & Node.DOCUMENT_POSITION_FOLLOWING
          ? ((r = !!d) &&
              !(r = d === n) &&
              ((r = K(n, d, z)),
              r === null
                ? (r = !1)
                : (v(r, !0, $, d, n),
                  (d = A),
                  (x = A = null),
                  (r = d !== null))),
            r)
          : !1;
    }
    function Ah(a, r) {
      var i = a.ownerDocument.createRange();
      (i.selectNodeContents(a),
        (a = i.getBoundingClientRect()),
        window.scrollTo(
          window.scrollX + a.left,
          r
            ? window.scrollY + a.top
            : window.scrollY + a.bottom - window.innerHeight,
        ));
    }
    Wt.prototype.scrollIntoView = function (a) {
      if (typeof a == "object") throw Error(o(566));
      var r = [];
      v(this._fragmentFiber.child, !1, ou, r, void 0, void 0);
      var i = a !== !1;
      if (r.length === 0) {
        var n = p(this._fragmentFiber);
        if (
          ((n = i ? n[1] || n[0] || T(this._fragmentFiber) : n[0] || n[1]),
          n === null)
        )
          return;
        if (n.tag === 6) {
          ((a = P(n)), Ah(a, i));
          return;
        }
        if (((n = P(n)), n.nodeType !== 9)) {
          if (n.nodeType === 11) {
            ((i = "host" in n ? n.host : null),
              i !== null && i.scrollIntoView(a));
            return;
          }
          n.scrollIntoView(a);
        }
      }
      for (n = i ? r.length - 1 : 0; n !== (i ? -1 : r.length); ) {
        var s = r[n];
        (s.tag === 6 ? ((s = P(s)), Ah(s, i)) : P(s).scrollIntoView(a),
          (n += i ? -1 : 1));
      }
    };
    function r5(a, r) {
      return ((a = P(a)), Eh(a, r), !1);
    }
    function Eh(a, r) {
      (a.reactFragments == null && (a.reactFragments = new Set()),
        a.reactFragments.add(r));
    }
    function Nh(a, r) {
      var i = r._eventListeners;
      if (i !== null)
        for (var n = 0; n < i.length; n++) {
          var s = i[n];
          a.addEventListener(
            s.type,
            s.attachedListener,
            ai(s.optionsOrUseCapture),
          );
        }
      a.nodeType !== 3 &&
        ((i = r._observers),
        i !== null &&
          i.forEach(function (d) {
            for (var b = 0, k = 0; k < wo.length; k++) {
              var R = wo[k];
              (R.fragmentInstance !== r ||
                R.observer !== d ||
                R.instance !== a) &&
                (wo[b++] = R);
            }
            ((wo.length = b), d.observe(a));
          }),
        Eh(a, r));
    }
    function l5(a, r) {
      var i = r._eventListeners;
      if (i !== null)
        for (var n = 0; n < i.length; n++) {
          var s = i[n];
          a.removeEventListener(
            s.type,
            s.attachedListener,
            ai(s.optionsOrUseCapture),
          );
        }
      a.nodeType !== 3 &&
        ((i = r._observers),
        i !== null &&
          i.forEach(function (d) {
            typeof d.rootMargin == "string" ? a5(r, d, a) : d.unobserve(a);
          }),
        a.reactFragments != null && a.reactFragments.delete(r));
    }
    function lu(a) {
      var r = a.firstChild;
      for (r && r.nodeType === 10 && (r = r.nextSibling); r; ) {
        var i = r;
        switch (((r = r.nextSibling), i.nodeName)) {
          case "HTML":
          case "HEAD":
          case "BODY":
            (lu(i), Gr(i));
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if (i.rel.toLowerCase() === "stylesheet") continue;
        }
        a.removeChild(i);
      }
    }
    function i5(a, r, i, n) {
      for (; a.nodeType === 1; ) {
        var s = i;
        if (a.nodeName.toLowerCase() !== r.toLowerCase()) {
          if (!n && (a.nodeName !== "INPUT" || a.type !== "hidden")) break;
        } else if (n) {
          if (!a[Mo])
            switch (r) {
              case "meta":
                if (!a.hasAttribute("itemprop")) break;
                return a;
              case "link":
                if (
                  ((d = a.getAttribute("rel")),
                  d === "stylesheet" && a.hasAttribute("data-precedence"))
                )
                  break;
                if (
                  d !== s.rel ||
                  a.getAttribute("href") !==
                    (s.href == null || s.href === "" ? null : s.href) ||
                  a.getAttribute("crossorigin") !==
                    (s.crossOrigin == null ? null : s.crossOrigin) ||
                  a.getAttribute("title") !== (s.title == null ? null : s.title)
                )
                  break;
                return a;
              case "style":
                if (a.hasAttribute("data-precedence")) break;
                return a;
              case "script":
                if (
                  ((d = a.getAttribute("src")),
                  (d !== (s.src == null ? null : s.src) ||
                    a.getAttribute("type") !==
                      (s.type == null ? null : s.type) ||
                    a.getAttribute("crossorigin") !==
                      (s.crossOrigin == null ? null : s.crossOrigin)) &&
                    d &&
                    a.hasAttribute("async") &&
                    !a.hasAttribute("itemprop"))
                )
                  break;
                return a;
              default:
                return a;
            }
        } else if (r === "input" && a.type === "hidden") {
          var d = s.name == null ? null : "" + s.name;
          if (s.type === "hidden" && a.getAttribute("name") === d) return a;
        } else return a;
        if (((a = so(a.nextSibling)), a === null)) break;
      }
      return null;
    }
    function n5(a, r, i) {
      if (r === "") return null;
      for (; a.nodeType !== 3; )
        if (
          ((a.nodeType !== 1 ||
            a.nodeName !== "INPUT" ||
            a.type !== "hidden") &&
            !i) ||
          ((a = so(a.nextSibling)), a === null)
        )
          return null;
      return a;
    }
    function Rh(a, r) {
      for (; a.nodeType !== 8; )
        if (
          ((a.nodeType !== 1 ||
            a.nodeName !== "INPUT" ||
            a.type !== "hidden") &&
            !r) ||
          ((a = so(a.nextSibling)), a === null)
        )
          return null;
      return a;
    }
    function iu(a) {
      return a.data === "$?" || a.data === "$~";
    }
    function nu(a) {
      return (
        a.data === "$!" ||
        (a.data === "$?" && a.ownerDocument.readyState !== "loading")
      );
    }
    function s5(a, r) {
      var i = a.ownerDocument;
      if (a.data === "$~") a._reactRetry = r;
      else if (a.data !== "$?" || i.readyState !== "loading") r();
      else {
        var n = function () {
          (r(), i.removeEventListener("DOMContentLoaded", n));
        };
        (i.addEventListener("DOMContentLoaded", n), (a._reactRetry = n));
      }
    }
    function so(a) {
      for (; a != null; a = a.nextSibling) {
        var r = a.nodeType;
        if (r === 1 || r === 3) break;
        if (r === 8) {
          if (
            ((r = a.data),
            r === "$" ||
              r === "$!" ||
              r === "$?" ||
              r === "$~" ||
              r === "&" ||
              r === "F!" ||
              r === "F")
          )
            break;
          if (r === "/$" || r === "/&") return null;
        }
      }
      return a;
    }
    var su = null;
    function jh(a) {
      a = a.nextSibling;
      for (var r = 0; a; ) {
        if (a.nodeType === 8) {
          var i = a.data;
          if (i === "/$" || i === "/&") {
            if (r === 0) return so(a.nextSibling);
            r--;
          } else
            (i !== "$" &&
              i !== "$!" &&
              i !== "$?" &&
              i !== "$~" &&
              i !== "&") ||
              r++;
        }
        a = a.nextSibling;
      }
      return null;
    }
    function xh(a) {
      a = a.previousSibling;
      for (var r = 0; a; ) {
        if (a.nodeType === 8) {
          var i = a.data;
          if (
            i === "$" ||
            i === "$!" ||
            i === "$?" ||
            i === "$~" ||
            i === "&"
          ) {
            if (r === 0) return a;
            r--;
          } else (i !== "/$" && i !== "/&") || r++;
        }
        a = a.previousSibling;
      }
      return null;
    }
    function c5(a, r) {
      function i() {
        n = !0;
      }
      if (a.ownerDocument.activeElement === a) return !0;
      var n = !1;
      try {
        (a.ownerDocument.addEventListener("focus", i, !0),
          (a.focus || HTMLElement.prototype.focus).call(a, r));
      } finally {
        a.ownerDocument.removeEventListener("focus", i, !0);
      }
      return n;
    }
    function d5(a) {
      vh(function () {
        vh(function (r) {
          return a(r);
        });
      });
    }
    function Dh(a, r, i) {
      switch (((r = an(i)), a)) {
        case "html":
          if (((a = r.documentElement), !a)) throw Error(o(452));
          return a;
        case "head":
          if (((a = r.head), !a)) throw Error(o(453));
          return a;
        case "body":
          if (((a = r.body), !a)) throw Error(o(454));
          return a;
        default:
          throw Error(o(451));
      }
    }
    function Ih(a, r, i) {
      for (var n in i) {
        var s = i[n];
        i.hasOwnProperty(n) && s != null && xa(a, r, n, null, q2, s);
      }
      (i.dangerouslySetInnerHTML != null && (a.textContent = ""),
        a.onclick === va && (a.onclick = null),
        Gr(a));
    }
    function cu(a) {
      for (var r = a.attributes; r.length; ) a.removeAttributeNode(r[0]);
      Gr(a);
    }
    var co = new Map(),
      zh = new Set();
    function tn(a) {
      if (typeof a.getRootNode == "function") {
        var r = a.getRootNode();
        if (r.nodeType === 9 || r.nodeType === 11) return r;
      }
      return a.nodeType === 9 ? a : a.ownerDocument;
    }
    var ar = Ue.d;
    Ue.d = { f: u5, r: f5, D: m5, C: h5, L: p5, m: g5, X: y5, S: b5, M: v5 };
    function u5() {
      var a = ar.f(),
        r = ys();
      return a || r;
    }
    function f5(a) {
      var r = Ga(a);
      r !== null && r.tag === 5 && r.type === "form" ? Of(r) : ar.r(a);
    }
    var ti = typeof document > "u" ? null : document;
    function Lh(a, r, i) {
      var n = ti;
      if (n && typeof r == "string" && r) {
        var s = ia(r);
        ((s = 'link[rel="' + a + '"][href="' + s + '"]'),
          typeof i == "string" && (s += '[crossorigin="' + i + '"]'),
          zh.has(s) ||
            (zh.add(s),
            (a = { rel: a, crossOrigin: i, href: r }),
            n.querySelector(s) === null &&
              ((r = n.createElement("link")),
              Ct(r, "link", a),
              at(r),
              n.head.appendChild(r))));
      }
    }
    function m5(a) {
      (ar.D(a), Lh("dns-prefetch", a, null));
    }
    function h5(a, r) {
      (ar.C(a, r), Lh("preconnect", a, r));
    }
    function p5(a, r, i) {
      ar.L(a, r, i);
      var n = ti;
      if (n && a && r) {
        var s = 'link[rel="preload"][as="' + ia(r) + '"]';
        r === "image" && i && i.imageSrcSet
          ? ((s += '[imagesrcset="' + ia(i.imageSrcSet) + '"]'),
            typeof i.imageSizes == "string" &&
              (s += '[imagesizes="' + ia(i.imageSizes) + '"]'))
          : (s += '[href="' + ia(a) + '"]');
        var d = s;
        switch (r) {
          case "style":
            d = oi(a);
            break;
          case "script":
            d = ri(a);
        }
        if (
          !(
            co.has(d) ||
            ((a = V(
              {
                rel: "preload",
                href: r === "image" && i && i.imageSrcSet ? void 0 : a,
                as: r,
              },
              i,
            )),
            co.set(d, a),
            n.querySelector(s) !== null ||
              (r === "style" && n.querySelector(on(d))) ||
              (r === "script" && n.querySelector(rn(d))))
          )
        ) {
          var b = n.createElement("link");
          (Ct(b, "link", a),
            r === "style" &&
              ((b[dr] = !0),
              (b.onload = b.onerror =
                function () {
                  vi(b);
                })),
            at(b),
            n.head.appendChild(b));
        }
      }
    }
    function g5(a, r) {
      ar.m(a, r);
      var i = ti;
      if (i && a) {
        var n = r && typeof r.as == "string" ? r.as : "script",
          s =
            'link[rel="modulepreload"][as="' +
            ia(n) +
            '"][href="' +
            ia(a) +
            '"]',
          d = s;
        switch (n) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            d = ri(a);
        }
        if (
          !co.has(d) &&
          ((a = V({ rel: "modulepreload", href: a }, r)),
          co.set(d, a),
          i.querySelector(s) === null)
        ) {
          switch (n) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (i.querySelector(rn(d))) return;
          }
          ((n = i.createElement("link")),
            Ct(n, "link", a),
            at(n),
            i.head.appendChild(n));
        }
      }
    }
    function b5(a, r, i) {
      ar.S(a, r, i);
      var n = ti;
      if (n && a) {
        var s = Vo(n).hoistableStyles,
          d = oi(a);
        r = r || "default";
        var b = s.get(d);
        if (!b) {
          var k = { loading: 0, preload: null };
          if ((b = n.querySelector(on(d)))) k.loading = 5;
          else {
            ((a = V({ rel: "stylesheet", href: a, "data-precedence": r }, i)),
              (i = co.get(d)) && du(a, i));
            var R = (b = n.createElement("link"));
            (at(R),
              Ct(R, "link", a),
              (R._p = new Promise(function (Y, ae) {
                ((R.onload = Y), (R.onerror = ae));
              })),
              R.addEventListener("load", function () {
                k.loading |= 1;
              }),
              R.addEventListener("error", function () {
                k.loading |= 2;
              }),
              (k.loading |= 4),
              Cs(b, r, n));
          }
          ((b = { type: "stylesheet", instance: b, count: 1, state: k }),
            s.set(d, b));
        }
      }
    }
    function y5(a, r) {
      ar.X(a, r);
      var i = ti;
      if (i && a) {
        var n = Vo(i).hoistableScripts,
          s = ri(a),
          d = n.get(s);
        d ||
          ((d = i.querySelector(rn(s))),
          d ||
            ((a = V({ src: a, async: !0 }, r)),
            (r = co.get(s)) && uu(a, r),
            (d = i.createElement("script")),
            at(d),
            Ct(d, "link", a),
            i.head.appendChild(d)),
          (d = { type: "script", instance: d, count: 1, state: null }),
          n.set(s, d));
      }
    }
    function v5(a, r) {
      ar.M(a, r);
      var i = ti;
      if (i && a) {
        var n = Vo(i).hoistableScripts,
          s = ri(a),
          d = n.get(s);
        d ||
          ((d = i.querySelector(rn(s))),
          d ||
            ((a = V({ src: a, async: !0, type: "module" }, r)),
            (r = co.get(s)) && uu(a, r),
            (d = i.createElement("script")),
            at(d),
            Ct(d, "link", a),
            i.head.appendChild(d)),
          (d = { type: "script", instance: d, count: 1, state: null }),
          n.set(s, d));
      }
    }
    function Oh(a, r, i, n) {
      var s = (s = je.current) ? tn(s) : null;
      if (!s) throw Error(o(446));
      switch (a) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof i.precedence == "string" && typeof i.href == "string"
            ? ((i = oi(i.href)),
              (r = Vo(s).hoistableStyles),
              (n = r.get(i)),
              n ||
                ((n = { type: "style", instance: null, count: 0, state: null }),
                r.set(i, n)),
              n)
            : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if (
            i.rel === "stylesheet" &&
            typeof i.href == "string" &&
            typeof i.precedence == "string"
          ) {
            a = oi(i.href);
            var d = Vo(s).hoistableStyles,
              b = d.get(a);
            if (
              (b ||
                ((s = s.ownerDocument || s),
                (b = {
                  type: "stylesheet",
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                d.set(a, b),
                (d = s.querySelector(on(a)))
                  ? d._p || ((b.instance = d), (b.state.loading = 5))
                  : ((d = co.get(a)),
                    d ||
                      ((d = {
                        rel: "preload",
                        as: "style",
                        href: i.href,
                        crossOrigin: i.crossOrigin,
                        integrity: i.integrity,
                        media: i.media,
                        hrefLang: i.hrefLang,
                        referrerPolicy: i.referrerPolicy,
                      }),
                      co.set(a, d)),
                    w5(s, a, d, b.state))),
              r && n === null)
            )
              throw Error(o(528, ""));
            return b;
          }
          if (r && n !== null) throw Error(o(529, ""));
          return null;
        case "script":
          return (
            (r = i.async),
            (i = i.src),
            typeof i == "string" &&
            r &&
            typeof r != "function" &&
            typeof r != "symbol"
              ? ((i = ri(i)),
                (r = Vo(s).hoistableScripts),
                (n = r.get(i)),
                n ||
                  ((n = {
                    type: "script",
                    instance: null,
                    count: 0,
                    state: null,
                  }),
                  r.set(i, n)),
                n)
              : { type: "void", instance: null, count: 0, state: null }
          );
        default:
          throw Error(o(444, a));
      }
    }
    function oi(a) {
      return 'href="' + ia(a) + '"';
    }
    function on(a) {
      return 'link[rel="stylesheet"][' + a + "]";
    }
    function qh(a) {
      return V({}, a, { "data-precedence": a.precedence, precedence: null });
    }
    function w5(a, r, i, n) {
      if ((r = a.querySelector('link[rel="preload"][as="style"][' + r + "]"))) {
        if (r[dr] !== !0) {
          n.loading = 1;
          return;
        }
      } else
        ((r = a.createElement("link")),
          (r[dr] = !0),
          (r.onload = r.onerror = vi.bind(null, r)),
          Ct(r, "link", i),
          at(r),
          a.head.appendChild(r));
      ((n.preload = r),
        r.addEventListener("load", function () {
          return (n.loading |= 1);
        }),
        r.addEventListener("error", function () {
          return (n.loading |= 2);
        }));
    }
    function ri(a) {
      return '[src="' + ia(a) + '"]';
    }
    function rn(a) {
      return "script[async]" + a;
    }
    function Bh(a, r, i) {
      if ((r.count++, r.instance === null))
        switch (r.type) {
          case "style":
            var n = a.querySelector('style[data-href~="' + ia(i.href) + '"]');
            if (n) return ((r.instance = n), at(n), n);
            var s = V({}, i, {
              "data-href": i.href,
              "data-precedence": i.precedence,
              href: null,
              precedence: null,
            });
            return (
              (n = (a.ownerDocument || a).createElement("style")),
              at(n),
              Ct(n, "style", s),
              Cs(n, i.precedence, a),
              (r.instance = n)
            );
          case "stylesheet":
            s = oi(i.href);
            var d = a.querySelector(on(s));
            if (d) return ((r.state.loading |= 4), (r.instance = d), at(d), d);
            ((n = qh(i)),
              (s = co.get(s)) && du(n, s),
              (d = (a.ownerDocument || a).createElement("link")),
              at(d));
            var b = d;
            return (
              (b._p = new Promise(function (k, R) {
                ((b.onload = k), (b.onerror = R));
              })),
              Ct(d, "link", n),
              (r.state.loading |= 4),
              Cs(d, i.precedence, a),
              (r.instance = d)
            );
          case "script":
            return (
              (d = ri(i.src)),
              (s = a.querySelector(rn(d)))
                ? ((r.instance = s), at(s), s)
                : ((n = i),
                  (s = co.get(d)) && ((n = V({}, i)), uu(n, s)),
                  (a = a.ownerDocument || a),
                  (s = a.createElement("script")),
                  at(s),
                  Ct(s, "link", n),
                  a.head.appendChild(s),
                  (r.instance = s))
            );
          case "void":
            return null;
          default:
            throw Error(o(443, r.type));
        }
      else
        r.type === "stylesheet" &&
          (r.state.loading & 4) === 0 &&
          ((n = r.instance), (r.state.loading |= 4), Cs(n, i.precedence, a));
      return r.instance;
    }
    function Cs(a, r, i) {
      for (
        var n = i.querySelectorAll(
            'link[rel="stylesheet"][data-precedence],style[data-precedence]',
          ),
          s = n.length ? n[n.length - 1] : null,
          d = s,
          b = 0;
        b < n.length;
        b++
      ) {
        var k = n[b];
        if (k.dataset.precedence === r) d = k;
        else if (d !== s) break;
      }
      d
        ? d.parentNode.insertBefore(a, d.nextSibling)
        : ((r = i.nodeType === 9 ? i.head : i),
          r.insertBefore(a, r.firstChild));
    }
    function du(a, r) {
      (a.crossOrigin == null && (a.crossOrigin = r.crossOrigin),
        a.referrerPolicy == null && (a.referrerPolicy = r.referrerPolicy),
        a.title == null && (a.title = r.title));
    }
    function uu(a, r) {
      (a.crossOrigin == null && (a.crossOrigin = r.crossOrigin),
        a.referrerPolicy == null && (a.referrerPolicy = r.referrerPolicy),
        a.integrity == null && (a.integrity = r.integrity));
    }
    var Ps = null;
    function Vh(a, r, i) {
      if (Ps === null) {
        var n = new Map(),
          s = (Ps = new Map());
        s.set(i, n);
      } else ((s = Ps), (n = s.get(i)), n || ((n = new Map()), s.set(i, n)));
      if (n.has(a)) return n;
      for (
        n.set(a, null), i = i.getElementsByTagName(a), s = 0;
        s < i.length;
        s++
      ) {
        var d = i[s];
        if (
          !(
            d[Mo] ||
            d[dt] ||
            (a === "link" && d.getAttribute("rel") === "stylesheet")
          ) &&
          d.namespaceURI !== "http://www.w3.org/2000/svg"
        ) {
          var b = d.getAttribute(r) || "";
          b = a + b;
          var k = n.get(b);
          k ? k.push(d) : n.set(b, [d]);
        }
      }
      return n;
    }
    function fu(a, r, i) {
      ((a = a.ownerDocument || a),
        a.head.insertBefore(
          i,
          r === "title" ? a.querySelector("head > title") : null,
        ));
    }
    function T5(a, r, i) {
      if (i === 1 || r.itemProp != null) return !1;
      switch (a) {
        case "meta":
        case "title":
          return !0;
        case "style":
          if (
            typeof r.precedence != "string" ||
            typeof r.href != "string" ||
            r.href === ""
          )
            break;
          return !0;
        case "link":
          if (
            typeof r.rel != "string" ||
            typeof r.href != "string" ||
            r.href === "" ||
            r.onLoad ||
            r.onError
          )
            break;
          switch (r.rel) {
            case "stylesheet":
              return (
                (a = r.disabled),
                typeof r.precedence == "string" && a == null
              );
            default:
              return !0;
          }
        case "script":
          if (
            r.async &&
            typeof r.async != "function" &&
            typeof r.async != "symbol" &&
            !r.onLoad &&
            !r.onError &&
            r.src &&
            typeof r.src == "string"
          )
            return !0;
      }
      return !1;
    }
    function Uh(a, r) {
      return (
        a === "img" &&
        r.src != null &&
        r.src !== "" &&
        r.onLoad == null &&
        r.loading !== "lazy"
      );
    }
    function $h(a) {
      return !(a.type === "stylesheet" && (a.state.loading & 3) === 0);
    }
    function Yh(a) {
      return (
        (a.width || 100) *
        (a.height || 100) *
        (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) *
        0.25
      );
    }
    function Gh(a, r) {
      typeof r.decode == "function" &&
        (a.imgCount++,
        r.complete || ((a.imgBytes += Yh(r)), a.suspenseyImages.push(r)),
        (a = M5.bind(a)),
        r.decode().then(a, a));
    }
    function S5(a, r, i, n) {
      if (
        i.type === "stylesheet" &&
        (typeof n.media != "string" || matchMedia(n.media).matches !== !1) &&
        (i.state.loading & 4) === 0
      ) {
        if (i.instance === null) {
          var s = oi(n.href),
            d = r.querySelector(on(s));
          if (d) {
            ((r = d._p),
              r !== null &&
                typeof r == "object" &&
                typeof r.then == "function" &&
                (a.count++, (a = ln.bind(a)), r.then(a, a)),
              (i.state.loading |= 4),
              (i.instance = d),
              at(d));
            return;
          }
          ((d = r.ownerDocument || r),
            (n = qh(n)),
            (s = co.get(s)) && du(n, s),
            (d = d.createElement("link")),
            at(d));
          var b = d;
          ((b._p = new Promise(function (k, R) {
            ((b.onload = k), (b.onerror = R));
          })),
            Ct(d, "link", n),
            (i.instance = d));
        }
        (a.stylesheets === null && (a.stylesheets = new Map()),
          a.stylesheets.set(i, r),
          (r = i.state.preload) &&
            (i.state.loading & 3) === 0 &&
            (a.count++,
            (i = ln.bind(a)),
            r.addEventListener("load", i),
            r.addEventListener("error", i)));
      }
    }
    var _s = 0;
    function k5(a, r) {
      return (
        a.stylesheets && a.count === 0 && Es(a, a.stylesheets),
        0 < a.count || 0 < a.imgCount
          ? function (i) {
              var n = setTimeout(function () {
                if ((a.stylesheets && Es(a, a.stylesheets), a.unsuspend)) {
                  var d = a.unsuspend;
                  ((a.unsuspend = null), d());
                }
              }, 6e4 + r);
              0 < a.imgBytes && _s === 0 && (_s = 62500 * V2());
              var s = setTimeout(
                function () {
                  if (
                    ((a.waitingForImages = !1),
                    a.count === 0 &&
                      (a.stylesheets && Es(a, a.stylesheets), a.unsuspend))
                  ) {
                    var d = a.unsuspend;
                    ((a.unsuspend = null), d());
                  }
                },
                (a.imgBytes > _s ? 50 : 800) + r,
              );
              return (
                (a.unsuspend = i),
                function () {
                  ((a.unsuspend = null), clearTimeout(n), clearTimeout(s));
                }
              );
            }
          : null
      );
    }
    function Xh(a) {
      if (a.count === 0 && (a.imgCount === 0 || !a.waitingForImages)) {
        if (a.stylesheets) Es(a, a.stylesheets);
        else if (a.unsuspend) {
          var r = a.unsuspend;
          ((a.unsuspend = null), r());
        }
      }
    }
    function ln() {
      (this.count--, Xh(this));
    }
    function M5() {
      (this.imgCount--, Xh(this));
    }
    var As = null;
    function Es(a, r) {
      ((a.stylesheets = null),
        a.unsuspend !== null &&
          (a.count++,
          (As = new Map()),
          r.forEach(C5, a),
          (As = null),
          ln.call(a)));
    }
    function C5(a, r) {
      if (!(r.state.loading & 4)) {
        var i = As.get(a);
        if (i) var n = i.get(null);
        else {
          ((i = new Map()), As.set(a, i));
          for (
            var s = a.querySelectorAll(
                "link[data-precedence],style[data-precedence]",
              ),
              d = 0;
            d < s.length;
            d++
          ) {
            var b = s[d];
            (b.nodeName === "LINK" || b.getAttribute("media") !== "not all") &&
              (i.set(b.dataset.precedence, b), (n = b));
          }
          n && i.set(null, n);
        }
        ((s = r.instance),
          (b = s.getAttribute("data-precedence")),
          (d = i.get(b) || n),
          d === n && i.set(null, s),
          i.set(b, s),
          this.count++,
          (n = ln.bind(this)),
          s.addEventListener("load", n),
          s.addEventListener("error", n),
          d
            ? d.parentNode.insertBefore(s, d.nextSibling)
            : ((a = a.nodeType === 9 ? a.head : a),
              a.insertBefore(s, a.firstChild)),
          (r.state.loading |= 4));
      }
    }
    var li = {
      $$typeof: ke,
      Provider: null,
      Consumer: null,
      _currentValue: $a,
      _currentValue2: $a,
      _threadCount: 0,
    };
    function P5(a, r, i, n, s, d, b, k, R) {
      ((this.tag = 1),
        (this.containerInfo = a),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = bi(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = bi(0)),
        (this.hiddenUpdates = bi(null)),
        (this.identifierPrefix = n),
        (this.onUncaughtError = s),
        (this.onCaughtError = d),
        (this.onRecoverableError = b),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = R),
        (this.transitionTypes = null),
        (this.incompleteTransitions = new Map()));
    }
    function Fh(a, r, i, n, s, d, b, k, R, Y, ae, pe) {
      return (
        (a = new P5(a, r, i, b, R, Y, ae, pe, k)),
        (r = 1),
        d === !0 && (r |= 24),
        (d = zt(3, null, null, r)),
        (a.current = d),
        (d.stateNode = a),
        (r = _c()),
        r.refCount++,
        (a.pooledCache = r),
        r.refCount++,
        (d.memoizedState = { element: n, isDehydrated: i, cache: r }),
        Rc(d),
        a
      );
    }
    function Hh(a) {
      return a ? ((a = Rl), a) : Rl;
    }
    function Wh(a, r, i, n, s, d) {
      ((s = Hh(s)),
        n.context === null ? (n.context = s) : (n.pendingContext = s),
        (n = vr(r)),
        (n.payload = { element: i }),
        (d = d === void 0 ? null : d),
        d !== null && (n.callback = d),
        (i = wr(a, n, r)),
        i !== null && (Bt(i, a, r), zi(i, a, r)));
    }
    function Kh(a, r) {
      if (((a = a.memoizedState), a !== null && a.dehydrated !== null)) {
        var i = a.retryLane;
        a.retryLane = i !== 0 && i < r ? i : r;
      }
    }
    function mu(a, r) {
      (Kh(a, r), (a = a.alternate) && Kh(a, r));
    }
    function Zh(a) {
      if (a.tag === 13 || a.tag === 31) {
        var r = Zr(a, 67108864);
        (r !== null && Bt(r, a, 67108864), mu(a, 67108864));
      }
    }
    function Qh(a) {
      if (a.tag === 13 || a.tag === 31) {
        var r = Ht();
        r = $r(r);
        var i = Zr(a, r);
        (i !== null && Bt(i, a, r), mu(a, r));
      }
    }
    var ii = !0;
    function _5(a, r, i, n) {
      var s = xe.T;
      xe.T = null;
      var d = Ue.p;
      try {
        ((Ue.p = 2), hu(a, r, i, n));
      } finally {
        ((Ue.p = d), (xe.T = s));
      }
    }
    function A5(a, r, i, n) {
      var s = xe.T;
      xe.T = null;
      var d = Ue.p;
      try {
        ((Ue.p = 8), hu(a, r, i, n));
      } finally {
        ((Ue.p = d), (xe.T = s));
      }
    }
    function hu(a, r, i, n) {
      if (ii) {
        var s = pu(n);
        if (s === null) (Wd(a, r, n, Ns, i), ep(a, n));
        else if (N5(s, a, r, i, n)) n.stopPropagation();
        else if ((ep(a, n), r & 4 && -1 < E5.indexOf(a))) {
          for (; s !== null; ) {
            var d = Ga(s);
            if (d !== null)
              switch (d.tag) {
                case 3:
                  if (
                    ((d = d.stateNode), d.current.memoizedState.isDehydrated)
                  ) {
                    var b = Qt(d.pendingLanes);
                    if (b !== 0) {
                      var k = d;
                      for (k.pendingLanes |= 2, k.entangledLanes |= 2; b; ) {
                        var R = 1 << (31 - Ka(b));
                        ((k.entanglements[1] |= R), (b &= ~R));
                      }
                      (Io(d), (Ea & 6) === 0 && ((ps = ma() + 500), Qi(0)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  ((k = Zr(d, 2)), k !== null && Bt(k, d, 2), ys(), mu(d, 2));
              }
            if (((d = pu(n)), d === null && Wd(a, r, n, Ns, i), d === s)) break;
            s = d;
          }
          s !== null && n.stopPropagation();
        } else Wd(a, r, n, null, i);
      }
    }
    function pu(a) {
      return ((a = rt(a)), gu(a));
    }
    var Ns = null;
    function gu(a) {
      if (((Ns = null), (a = Bo(a)), a !== null)) {
        var r = m(a);
        if (r === null) a = null;
        else {
          var i = r.tag;
          if (i === 13) {
            if (((a = c(r)), a !== null)) return a;
            a = null;
          } else if (i === 31) {
            if (((a = f(r)), a !== null)) return a;
            a = null;
          } else if (i === 3) {
            if (r.stateNode.current.memoizedState.isDehydrated)
              return r.tag === 3 ? r.stateNode.containerInfo : null;
            a = null;
          } else r !== a && (a = null);
        }
      }
      return ((Ns = a), null);
    }
    function Jh(a) {
      switch (a) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "fullscreenerror":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "resize":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (Ya()) {
            case ko:
              return 2;
            case or:
              return 8;
            case Br:
            case Da:
              return 32;
            case Zt:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var bu = !1,
      jr = null,
      xr = null,
      Dr = null,
      nn = new Map(),
      sn = new Map(),
      Ir = [],
      E5 =
        "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
          " ",
        );
    function ep(a, r) {
      switch (a) {
        case "focusin":
        case "focusout":
          jr = null;
          break;
        case "dragenter":
        case "dragleave":
          xr = null;
          break;
        case "mouseover":
        case "mouseout":
          Dr = null;
          break;
        case "pointerover":
        case "pointerout":
          nn.delete(r.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          sn.delete(r.pointerId);
      }
    }
    function cn(a, r, i, n, s, d) {
      return a === null || a.nativeEvent !== d
        ? ((a = {
            blockedOn: r,
            domEventName: i,
            eventSystemFlags: n,
            nativeEvent: d,
            targetContainers: [s],
          }),
          r !== null && ((r = Ga(r)), r !== null && Zh(r)),
          a)
        : ((a.eventSystemFlags |= n),
          (r = a.targetContainers),
          s !== null && r.indexOf(s) === -1 && r.push(s),
          a);
    }
    function N5(a, r, i, n, s) {
      switch (r) {
        case "focusin":
          return ((jr = cn(jr, a, r, i, n, s)), !0);
        case "dragenter":
          return ((xr = cn(xr, a, r, i, n, s)), !0);
        case "mouseover":
          return ((Dr = cn(Dr, a, r, i, n, s)), !0);
        case "pointerover":
          var d = s.pointerId;
          return (nn.set(d, cn(nn.get(d) || null, a, r, i, n, s)), !0);
        case "gotpointercapture":
          return (
            (d = s.pointerId),
            sn.set(d, cn(sn.get(d) || null, a, r, i, n, s)),
            !0
          );
      }
      return !1;
    }
    function ap(a) {
      var r = Bo(a.target);
      if (r !== null) {
        var i = m(r);
        if (i !== null) {
          if (((r = i.tag), r === 13)) {
            if (((r = c(i)), r !== null)) {
              ((a.blockedOn = r),
                Tl(a.priority, function () {
                  Qh(i);
                }));
              return;
            }
          } else if (r === 31) {
            if (((r = f(i)), r !== null)) {
              ((a.blockedOn = r),
                Tl(a.priority, function () {
                  Qh(i);
                }));
              return;
            }
          } else if (
            r === 3 &&
            i.stateNode.current.memoizedState.isDehydrated
          ) {
            a.blockedOn = i.tag === 3 ? i.stateNode.containerInfo : null;
            return;
          }
        }
      }
      a.blockedOn = null;
    }
    function Rs(a) {
      if (a.blockedOn !== null) return !1;
      for (var r = a.targetContainers; 0 < r.length; ) {
        var i = pu(a.nativeEvent);
        if (i === null) {
          i = a.nativeEvent;
          var n = new i.constructor(i.type, i);
          ((Nt = n), i.target.dispatchEvent(n), (Nt = null));
        } else return ((r = Ga(i)), r !== null && Zh(r), (a.blockedOn = i), !1);
        r.shift();
      }
      return !0;
    }
    function tp(a, r, i) {
      Rs(a) && i.delete(r);
    }
    function R5() {
      ((bu = !1),
        jr !== null && Rs(jr) && (jr = null),
        xr !== null && Rs(xr) && (xr = null),
        Dr !== null && Rs(Dr) && (Dr = null),
        nn.forEach(tp),
        sn.forEach(tp));
    }
    function js(a, r) {
      a.blockedOn === r &&
        ((a.blockedOn = null),
        bu ||
          ((bu = !0),
          e.unstable_scheduleCallback(e.unstable_NormalPriority, R5)));
    }
    var xs = null;
    function op(a) {
      xs !== a &&
        ((xs = a),
        e.unstable_scheduleCallback(e.unstable_NormalPriority, function () {
          xs === a && (xs = null);
          for (var r = 0; r < a.length; r += 3) {
            var i = a[r],
              n = a[r + 1],
              s = a[r + 2];
            if (typeof n != "function") {
              if (gu(n || i) === null) continue;
              break;
            }
            var d = Ga(i);
            d !== null &&
              (a.splice(r, 3),
              (r -= 3),
              Qc(
                d,
                { pending: !0, data: s, method: i.method, action: n },
                n,
                s,
              ));
          }
        }));
    }
    function ni(a) {
      function r(R) {
        return js(R, a);
      }
      (jr !== null && js(jr, a),
        xr !== null && js(xr, a),
        Dr !== null && js(Dr, a),
        nn.forEach(r),
        sn.forEach(r));
      for (var i = 0; i < Ir.length; i++) {
        var n = Ir[i];
        n.blockedOn === a && (n.blockedOn = null);
      }
      for (; 0 < Ir.length && ((i = Ir[0]), i.blockedOn === null); )
        (ap(i), i.blockedOn === null && Ir.shift());
      if (((i = (a.ownerDocument || a).$$reactFormReplay), i != null))
        for (n = 0; n < i.length; n += 3) {
          var s = i[n],
            d = i[n + 1],
            b = s[ut] || null;
          if (typeof d == "function") b || op(i);
          else if (b) {
            var k = null;
            if (d && d.hasAttribute("formAction")) {
              if (((s = d), (b = d[ut] || null))) k = b.formAction;
              else if (gu(s) !== null) continue;
            } else k = b.action;
            (typeof k == "function"
              ? (i[n + 1] = k)
              : (i.splice(n, 3), (n -= 3)),
              op(i));
          }
        }
    }
    function rp() {
      function a(d) {
        d.canIntercept &&
          d.info === "react-transition" &&
          d.intercept({
            handler: function () {
              return new Promise(function (b) {
                return (s = b);
              });
            },
            focusReset: "manual",
            scroll: "manual",
          });
      }
      function r() {
        (s !== null && (s(), (s = null)), n || setTimeout(i, 20));
      }
      function i() {
        if (!n && !navigation.transition) {
          var d = navigation.currentEntry;
          d &&
            d.url != null &&
            navigation.navigate(d.url, {
              state: d.getState(),
              info: "react-transition",
              history: "replace",
            });
        }
      }
      if (typeof navigation == "object") {
        var n = !1,
          s = null;
        return (
          navigation.addEventListener("navigate", a),
          navigation.addEventListener("navigatesuccess", r),
          navigation.addEventListener("navigateerror", r),
          setTimeout(i, 100),
          function () {
            ((n = !0),
              navigation.removeEventListener("navigate", a),
              navigation.removeEventListener("navigatesuccess", r),
              navigation.removeEventListener("navigateerror", r),
              s !== null && (s(), (s = null)));
          }
        );
      }
    }
    function yu(a) {
      this._internalRoot = a;
    }
    ((Ds.prototype.render = yu.prototype.render =
      function (a) {
        var r = this._internalRoot;
        if (r === null) throw Error(o(409));
        var i = r.current,
          n = Ht();
        Wh(i, n, a, r, null, null);
      }),
      (Ds.prototype.unmount = yu.prototype.unmount =
        function () {
          var a = this._internalRoot;
          if (a !== null) {
            this._internalRoot = null;
            var r = a.containerInfo;
            (Wh(a.current, 2, null, a, null, null), ys(), (r[cr] = null));
          }
        }));
    function Ds(a) {
      this._internalRoot = a;
    }
    Ds.prototype.unstable_scheduleHydration = function (a) {
      if (a) {
        var r = sr();
        a = { blockedOn: null, target: a, priority: r };
        for (var i = 0; i < Ir.length && r !== 0 && r < Ir[i].priority; i++);
        (Ir.splice(i, 0, a), i === 0 && ap(a));
      }
    };
    var lp = t.version;
    if (lp !== "19.3.0") throw Error(o(527, lp, "19.3.0"));
    Ue.findDOMNode = function (a) {
      var r = a._reactInternals;
      if (r === void 0)
        throw typeof a.render == "function"
          ? Error(o(188))
          : ((a = Object.keys(a).join(",")), Error(o(268, a)));
      return (
        (a = y(r)),
        (a = a !== null ? w(a) : null),
        (a = a === null ? null : a.stateNode),
        a
      );
    };
    var j5 = {
      bundleType: 0,
      version: "19.3.0",
      rendererPackageName: "react-dom",
      currentDispatcherRef: xe,
      reconcilerVersion: "19.3.0",
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
      var Is = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Is.isDisabled && Is.supportsFiber)
        try {
          ((Oa = Is.inject(j5)), (At = Is));
        } catch {}
    }
    return (
      (ci.createRoot = function (a, r) {
        if (!u(a)) throw Error(o(299));
        var i = !1,
          n = "",
          s = Hf,
          d = Wf,
          b = Kf;
        return (
          r != null &&
            (r.unstable_strictMode === !0 && (i = !0),
            r.identifierPrefix !== void 0 && (n = r.identifierPrefix),
            r.onUncaughtError !== void 0 && (s = r.onUncaughtError),
            r.onCaughtError !== void 0 && (d = r.onCaughtError),
            r.onRecoverableError !== void 0 && (b = r.onRecoverableError)),
          (r = Fh(a, 1, !1, null, null, i, n, null, s, d, b, rp)),
          (a[cr] = r.current),
          Hd(a),
          new yu(r)
        );
      }),
      (ci.hydrateRoot = function (a, r, i) {
        if (!u(a)) throw Error(o(299));
        var n = !1,
          s = "",
          d = Hf,
          b = Wf,
          k = Kf,
          R = null;
        return (
          i != null &&
            (i.unstable_strictMode === !0 && (n = !0),
            i.identifierPrefix !== void 0 && (s = i.identifierPrefix),
            i.onUncaughtError !== void 0 && (d = i.onUncaughtError),
            i.onCaughtError !== void 0 && (b = i.onCaughtError),
            i.onRecoverableError !== void 0 && (k = i.onRecoverableError),
            i.formState !== void 0 && (R = i.formState)),
          (r = Fh(a, 1, !0, r, i ?? null, n, s, R, d, b, k, rp)),
          (r.context = Hh(null)),
          (i = r.current),
          (n = Ht()),
          (n = $r(n)),
          (s = vr(n)),
          (s.callback = null),
          wr(i, s, n),
          (i = n),
          (r.current.lanes = i),
          Ut(r, i),
          Io(r),
          (a[cr] = r.current),
          Hd(a),
          new Ds(r)
        );
      }),
      (ci.version = "19.3.0"),
      ci
    );
  }
  var Eu;
  function hp() {
    if (Eu) return qs.exports;
    Eu = 1;
    function e() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
        } catch (t) {
          console.error(t);
        }
    }
    return (e(), (qs.exports = mp()), qs.exports);
  }
  var pp = hp();
