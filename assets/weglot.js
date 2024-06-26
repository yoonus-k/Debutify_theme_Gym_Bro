var Weglot = (function () {
  "use strict";
  var e = {
    v1: [],
    v2: [
      "ABBR",
      "ACRONYM",
      "B",
      "BDO",
      "BIG",
      "CITE",
      "EM",
      "I",
      "KBD",
      "Q",
      "SMALL",
      "STRONG",
      "SUB",
      "SUP",
      "U",
    ],
    v3: ["A", "BDI", "BR", "DEL", "DFN", "INS", "S", "SPAN"],
  };
  e.v2.unshift("#text");
  var t = e,
    n = {
      excluded_blocks: [],
      media_enabled: !1,
      external_enabled: !1,
      extra_definitions: [],
      translation_engine: 2,
      noTranslateAttribute: "data-wg-notranslate",
      mergeNodes: [],
    },
    r = {
      clientToken: "pub4efaec96ce2494088ba70a2049d58dc3",
      site: "datadoghq.com",
      forwardErrorsToLogs: !1,
      sampleRate: 100,
      env: "prod",
      service: "js-default",
      silentMultipleInit: !0,
    },
    a = !1,
    o = !0,
    i = {},
    s = [],
    c = null;
  function l(e) {
    !a &&
      o &&
      (e
        ? new Promise(function (e) {
            var t, n, r, a, o;
            (t = window),
              (n = document),
              (r = "script"),
              (a =
                "https://www.datadoghq-browser-agent.com/datadog-logs-v4.js"),
              (t = t[(o = "DD_LOGS")] =
                t[o] || {
                  q: [],
                  onReady: function (e) {
                    t.q.push(e);
                  },
                }),
              ((o = n.createElement(r)).async = 1),
              (o.src = a),
              (a = n.getElementsByTagName(r)[0]).parentNode.insertBefore(o, a),
              window.DD_LOGS.onReady(function () {
                e(window.DD_LOGS);
              });
          }).then(function (e) {
            (a = !0),
              (c = e).init(r),
              c.logger.removeContext("clientToken"),
              s.length &&
                (s.map(function (e) {
                  return u(e.service, e.logs, e.method);
                }),
                (s = []));
          })
        : ((s = []), (o = !1)));
  }
  function u(e, t, n) {
    var l = "log" === n ? "info" : n;
    if (a) {
      var u = (function (e) {
        return (
          i[e] ||
            (c.createLogger("wg-logger-" + e, {
              context: Object.assign({}, r, { service: e }),
            }),
            (i[e] = c.getLogger("wg-logger-" + e))),
          i[e]
        );
      })(e);
      "string" == typeof t
        ? u[l](t)
        : u[l](t.message, Object.assign({}, t.stack && { stack: t.stack }, t));
    } else o && s.push({ service: e, logs: t, method: n });
  }
  function d(e) {
    var t = e.service;
    var n = function (e) {
      return function (n, r) {
        return (
          void 0 === r && (r = {}),
          (function (e, n, r) {
            var a = r.sendToConsole;
            void 0 === a && (a = !0);
            var i = r.consoleOverride,
              s = r.sendToDatadog;
            if ((void 0 === s && (s = !0), s && o && u(t, e, n), a)) {
              var c = i || e;
              console[n]("[Weglot]", c);
            }
          })(n, e, r)
        );
      };
    };
    return {
      log: n("log"),
      warn: n("warn"),
      error: n("error"),
      deactivateDatadog: function () {
        o = !1;
      },
      initialize: l,
    };
  }
  var f = d({ service: "html-parser-engine" });
  function g(e, t, n) {
    var r = t && t[e];
    if (r && r.textContent === t.textContent) return r.result;
    var a = n(t);
    return t ? ((t[e] = { result: a, textContent: t.textContent }), a) : a;
  }
  function m(e) {
    return g("__validMergeNodes", e, function (e) {
      return (
        e &&
        v(e) &&
        p(e) &&
        !(function (e) {
          return g("__containsNoTranslateNodes", e, function (e) {
            return (
              1 === e.nodeType &&
              !!e.querySelector("[" + n.noTranslateAttribute + "]")
            );
          });
        })(e)
      );
    });
  }
  function p(e, t) {
    return (
      void 0 === t && (t = !0),
      g("__validTextNodes", e, function (e) {
        return !(
          !e.textContent ||
          (t && !e.textContent.trim()) ||
          -1 !== e.textContent.indexOf("BESbswy") ||
          (e.parentNode &&
            e.parentNode.nodeName &&
            -1 !==
              ["script", "style", "noscript"].indexOf(
                e.parentNode.nodeName.toLowerCase()
              )) ||
          (function (e) {
            if (!(e = e.trim())) return !1;
            var t = e.charAt(0);
            if ("[" !== t && "{" !== t) return !1;
            var n = e[e.length - 1];
            if ("]" !== n && "}" !== n) return !1;
            return (
              (e = e
                .replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                .replace(
                  /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                  "]"
                )
                .replace(/(?:^|:|,)(?:\s*\[)+/g, "")),
              /^[\],:{}\s]*$/.test(e)
            );
          })(e.textContent)
        );
      })
    );
  }
  function h(e) {
    try {
      if (
        n.mergedSelectorRemove &&
        e.closest &&
        e.closest(n.mergedSelectorRemove)
      )
        return !1;
    } catch (e) {}
    return (
      !(!n.mergeNodes || -1 === n.mergeNodes.indexOf(e.nodeName)) ||
      (e.dataset && e.dataset.wgMerge) ||
      (n.selectorMerging && e.matches && e.matches(n.selectorMerging))
    );
  }
  function v(e) {
    return g("__onlyInlineChildsNodes", e, function (e) {
      if (!e.childNodes) return !0;
      for (var t = 0, n = e.childNodes; t < n.length; t += 1) {
        var r = n[t];
        if (r.weglot || !h(r) || !v(r)) return !1;
      }
      return !0;
    });
  }
  var w = function (e, t) {
      return function (n, r) {
        try {
          return n[e] ? n[e](r) : t;
        } catch (e) {
          f.warn(e, { consoleOverride: "Your CSS rules are incorrect: " + r });
        }
        return t;
      };
    },
    y = w("querySelectorAll", []),
    _ = w("matches", !1);
  var b = new WeakMap();
  function k(e) {
    if (!e) return [];
    var t = e.querySelectorAll ? e : e.parentNode;
    if (!t) return [];
    if (
      ((function (e) {
        var t = n.excluded_blocks,
          r = n.noTranslateAttribute;
        if (t && t.length) {
          var a = t
            .map(function (e) {
              return e.value;
            })
            .join(",");
          if (_(e, a)) return void e.setAttribute(r, "manual");
          var o = y(e, a);
          if (o)
            for (var i = 0, s = o; i < s.length; i += 1) {
              s[i].setAttribute(r, "manual");
            }
        }
      })(t),
      !n.whitelist || !n.whitelist.length)
    )
      return [].concat(
        (function (e) {
          var t = document.getElementsByTagName("title")[0];
          if (e !== document.documentElement || !document.title || !t || L(t))
            return [];
          return [
            {
              element: t.firstChild,
              type: 9,
              words: t.textContent,
              properties: {},
            },
          ];
        })(t),
        C(t)
      );
    var r = n.whitelist
      .map(function (e) {
        return e.value;
      })
      .join(",");
    if (t.closest && t.closest(r)) return C(t);
    for (var a = [], o = 0, i = y(t, r); o < i.length; o += 1) {
      var s = i[o];
      [].push.apply(a, C(s));
    }
    return a;
  }
  function C(e) {
    return [].concat(
      (function (e) {
        var t = [];
        return (
          q.forEach(function (n) {
            for (
              var r,
                a,
                o = n.attribute,
                i = n.type,
                s = n.selectors,
                c = 0,
                l =
                  ((r = e),
                  (a = s.join(",")),
                  r.childElementCount > 0
                    ? r.querySelectorAll(a)
                    : r.matches && r.matches(a)
                    ? [r]
                    : []);
              c < l.length;
              c += 1
            ) {
              var u = l[c];
              if (!L(u)) {
                var d = o.get(u);
                N(d) ||
                  t.push({
                    element: u,
                    words: d,
                    type: i,
                    attrSetter: o.set,
                    attrName: o.name,
                  });
              }
            }
          }),
          t
        );
      })(e),
      (function (e) {
        var t,
          r = [],
          a = n.translation_engine >= 2,
          o = document.createTreeWalker(e, 4, E, !1);
        for (; (t = o.nextNode()); ) {
          var i = (
            a && (h(t.parentNode) || t.parentNode.childNodes.length > 1) ? x : S
          )(t, o);
          i && r.push(i);
        }
        return r;
      })(e)
    );
  }
  function E(e) {
    return !p(e) || L(e) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  }
  function x(e, t) {
    var r = (function (e) {
      if (e.wgResolved) return !1;
      var t = e;
      do {
        if (t.wgResolved) return t;
        t = t.parentElement || t.parentNode;
      } while (null !== t && 1 === t.nodeType);
      return !1;
    })(e);
    if (r && b.has(r)) {
      var a = b.get(r);
      return { element: a[0], words: a[1], type: 1, properties: a[2] };
    }
    var o = (function (e, t) {
      var r = [],
        a = e;
      for (; m(e.parentNode); )
        (e = e.parentNode),
          a.textContent.trim() !== e.textContent.trim() && (a = e);
      a.textContent.trim() === e.textContent.trim() && (e = a);
      for (; t.nextNode(); )
        if (!e.contains || !e.contains(t.currentNode)) {
          t.previousNode();
          break;
        }
      var o = e.cloneNode(!0);
      if (n.translation_engine > 2) {
        A(e, function (e) {
          if (1 === e.nodeType) {
            var t = (function (e) {
              for (var t = [], n = 0, r = e.attributes; n < r.length; n += 1) {
                var a = r[n];
                t.push(a);
              }
              return t;
            })(e);
            r.push({ attributes: t, child: e });
          }
        });
        var i = 1;
        A(o, function (e) {
          1 === e.nodeType &&
            (!(function (e) {
              if (!e.attributes) return e;
              for (; e.attributes.length > 0; )
                e.removeAttribute(e.attributes[0].name);
            })(e),
            e.setAttribute("wg-" + i++, ""));
        });
      }
      if (e) {
        return (
          (e.wgResolved = !0),
          [
            e,
            (o.innerHTML || o.textContent || "").replace(/<!--[^>]*-->/g, ""),
            r,
          ]
        );
      }
    })(e, t);
    if (o) {
      var i = o[0],
        s = o[1],
        c = o[2];
      if (!N(s))
        return b.set(i, o), { element: i, words: s, type: 1, properties: c };
    }
  }
  function S(e) {
    var t = e.textContent;
    if (!N(t)) return { element: e, words: t, type: 1, properties: {} };
  }
  function L(e) {
    return (
      e.closest || (e = e.parentNode),
      e.closest && e.closest("[" + n.noTranslateAttribute + "]")
    );
  }
  function A(e, t) {
    if (e.childNodes)
      for (var n = 0, r = e.childNodes; n < r.length; n += 1) {
        var a = r[n];
        if (!a) return;
        t(a), A(a, t);
      }
  }
  function N(e) {
    return !e || !e.trim() || !isNaN(e) || "​" === e;
  }
  function O(e, t) {
    for (var n = 0, r = e; n < r.length; n += 1) {
      var a = r[n],
        o = a.weglot.content;
      if (o && a.isConnected) {
        for (var i = 0, s = o; i < s.length; i += 1) {
          var c = s[i],
            l = c.original,
            u = c.properties,
            d = c.attrSetter,
            f = c.translations[t] || l;
          u && ((a.weglot.setted = !0), T(a, f, u, e)),
            d && ((a.weglot.setted = !0), d(a, f, l));
        }
        a.wgResolved = !1;
      }
    }
  }
  function T(e, t, n, r) {
    if (1 === e.nodeType) {
      var a = (function (e, t, n) {
        var r = document.createElement("div");
        return (r.innerHTML = e), j(t, r, n);
      })(t, e, n);
      return (e.innerHTML = ""), void e.appendChild(a);
    }
    if (-1 !== t.indexOf("<") && -1 !== t.indexOf(">")) {
      if (!e.parentNode)
        return (
          f.warn(
            "Unable to translate some words, please contact support@weglot.com."
          ),
          void f.warn(e, { sendToDatadog: !1 })
        );
      if (1 === e.parentNode.childNodes.length)
        return (
          (e.parentNode.weglot = e.weglot),
          void (r ? r.push(e.parentNode) : T(e.parentNode, t, n))
        );
      var o =
        (e.closest && e.closest("[data-wg-translation-wrapper]")) ||
        e.parentNode.closest("[data-wg-translation-wrapper]");
      if (!o || o.innerHTML !== t) {
        var i = document.createElement("span");
        (i.dataset.wgTranslationWrapper = ""),
          (i.weglot = e.weglot),
          e.parentNode.replaceChild(i, e),
          r ? r.push(i) : T(e.parentNode, t, n);
      }
    } else e.textContent = t;
  }
  function j(e, t, n) {
    var r = document.createDocumentFragment();
    if (1 !== e.nodeType) return r.appendChild(t), r;
    for (var a = t.childNodes.length, o = 0; o < a; o++) {
      var i,
        s = t.firstChild;
      if ((i = I(s))) {
        var c = n[i - 1];
        if (!c) continue;
        var l = c.used ? c.child.cloneNode(!0) : c.child,
          u = j(l, s, n);
        if (u.contains(l))
          return (
            f.error(
              "There is an HTML error in the translation of: " + e.innerHTML
            ),
            r
          );
        (l.innerHTML = ""),
          l.appendChild(u),
          r.appendChild(l),
          document.createDocumentFragment().appendChild(s),
          (c.used = !0);
      } else r.appendChild(s);
    }
    return r;
  }
  function I(e) {
    if (e && 1 === e.nodeType && e.attributes && e.attributes[0]) {
      var t = parseInt(e.attributes[0].name.split("wg-")[1]);
      return isNaN(t) ? void 0 : t;
    }
  }
  function D(e) {
    return {
      name: e,
      get: function (t) {
        return t.getAttribute(e);
      },
      set: function (t, n) {
        return t.setAttribute(e, n);
      },
    };
  }
  function R(e, t) {
    if (e.parentNode && "PICTURE" === e.parentNode.tagName)
      for (var n = 0, r = e.parentNode.children; n < r.length; n += 1) {
        var a = r[n];
        "SOURCE" === a.tagName &&
          a.getAttribute("srcset") &&
          a.setAttribute("srcset", t);
      }
  }
  function P(e) {
    return (e && e.split && e.split("www.")[1]) || e;
  }
  function M(e) {
    var t = [
      { type: 1, selectors: ["[title]"], attribute: D("title") },
      {
        type: 2,
        selectors: ["input[type='submit']", "input[type='button']", "button"],
        attribute: D("value"),
      },
      {
        type: 3,
        selectors: ["input[placeholder]", "textarea[placeholder]"],
        attribute: D("placeholder"),
      },
      {
        type: 4,
        selectors: [
          "meta[name='description']",
          "meta[property='og:description']",
          "meta[property='og:site_name']",
          "meta[property='og:image:alt']",
          "meta[name='twitter:description']",
          "meta[itemprop='description']",
          "meta[itemprop='name']",
        ],
        attribute: D("content"),
      },
      { type: 7, selectors: ["img"], attribute: D("alt") },
      {
        type: 8,
        selectors: ["[href$='.pdf']", "[href$='.docx']", "[href$='.doc']"],
        attribute: D("href"),
      },
      {
        type: 9,
        selectors: ["meta[property='og:title']", "meta[name='twitter:title']"],
        attribute: D("content"),
      },
    ];
    if (!e) return t;
    if (
      (e.media_enabled &&
        t.push(
          {
            type: 5,
            selectors: [
              "youtube.com",
              "youtu.be",
              "vimeo.com",
              "dailymotion.com",
            ].map(function (e) {
              return "iframe[src*='" + e + "']";
            }),
            attribute: D("src"),
          },
          {
            type: 6,
            selectors: ["img", "source"],
            attribute: {
              name: "src",
              get: function (e) {
                var t = e.getAttribute("src");
                if (!t || !t.split) return "";
                if (0 === t.indexOf("data:image")) return "";
                var n = t.split("?");
                return n[1] && (e.queryString = n[1]), n[0];
              },
              set: function (e, t, n) {
                var r = e.getAttribute("src"),
                  a = e.getAttribute("srcset");
                if (t === n) {
                  if ((e.removeAttribute("data-wgtranslated"), e.isChanged)) {
                    var o = "" + t + (e.queryString ? "?" + e.queryString : "");
                    e.setAttribute("src", o),
                      R(e, o),
                      e.hasAttribute("wgsrcset") &&
                        (e.setAttribute(
                          "srcset",
                          e.getAttribute("wgsrcset") || e.dataset.srcset
                        ),
                        e.removeAttribute("wgsrcset"));
                  }
                } else
                  r.split("?")[0] !== t &&
                    n !== t &&
                    (e.setAttribute("src", t),
                    R(e, t),
                    e.hasAttribute("srcset") &&
                      (e.setAttribute("wgsrcset", a),
                      e.setAttribute("srcset", "")),
                    (e.dataset.wgtranslated = !0),
                    (e.isChanged = !0));
              },
            },
          },
          {
            type: 6,
            selectors: [
              "meta[property='og:image']",
              "meta[property='og:logo']",
            ],
            attribute: D("content"),
          },
          { type: 6, selectors: ["img"], attribute: D("srcset") }
        ),
      e.translate_aria &&
        t.push({
          type: 1,
          selectors: ["[aria-label]"],
          attribute: D("aria-label"),
        }),
      e.external_enabled)
    ) {
      var n = P(
        (function () {
          var e = window.location,
            t = e.hostname,
            n = e.search;
          if ("ve-weglot.com" !== t || !n) return t;
          var r = decodeURIComponent(n).match(/url=https?:\/\/([^/]+)/);
          return r
            ? r[1]
            : (f.warn("[Weglot] Unable to get current hostname"), t);
        })()
      );
      t.push(
        { type: 10, selectors: ["iframe"], attribute: D("src") },
        { type: 10, selectors: ["a[rel=external]"], attribute: D("href") },
        { type: 10, selectors: ['[href^="mailto"]'], attribute: D("href") },
        {
          type: 10,
          selectors: ["http:", "https:", "//"].map(function (e) {
            return '[href^="' + e + '"]:not(link)';
          }),
          attribute: {
            name: "href",
            get: function (e) {
              if (!e.href || !e.href.split) return "";
              var t = e.href.split("/")[2];
              return t && P(t) !== n ? e.getAttribute("href") : "";
            },
            set: function (e, t) {
              return e.setAttribute("href", t);
            },
          },
        }
      );
    }
    if (e.extra_definitions && e.extra_definitions.length)
      for (
        var r = function () {
            var e = o[a],
              n = e.type,
              r = e.selector,
              i = e.attribute;
            i && r
              ? t.push({
                  type: n,
                  selectors: [r],
                  attribute: {
                    name: i,
                    get: function (e) {
                      return e.getAttribute(i);
                    },
                    set: function (e, t) {
                      return e.setAttribute(i, t);
                    },
                  },
                })
              : f.warn(
                  "Each extra definition option needs at least {attribute,selector} https://bit.ly/2yDsLxy",
                  { sendToDatadog: !1 }
                );
          },
          a = 0,
          o = e.extra_definitions;
        a < o.length;
        a += 1
      )
        r();
    return t;
  }
  E.acceptNode = E;
  var q = [];
  function W(e, r) {
    if (!r || !r.translation_engine) throw "translation_engine is required";
    var a;
    return (
      Object.assign(n, r),
      (n.document = e),
      (n.mergeNodes =
        ((a = r.translation_engine),
        t.v2.unshift("#text", "#comment"),
        Object.keys(t).reduce(function (e, n, r) {
          return a >= r + 1 && [].push.apply(e, t[n]), e;
        }, []))),
      Array.isArray(n.extra_merged_selectors) &&
        (n.selectorMerging = r.extra_merged_selectors
          .filter(function (e) {
            return e && "string" == typeof e;
          })
          .join(",")),
      r.merged_selectors_remove &&
        (n.mergedSelectorRemove = r.merged_selectors_remove
          .map(function (e) {
            return e.value;
          })
          .join(",")),
      { getTextNodes: k, setTextNodes: O, definitions: (q = M(n)) }
    );
  }
  var z = d({ service: "js-library" }),
    B = "https://cdn.weglot.com/projects-settings/",
    U = "wglang",
    F = "wg-style-trans",
    H = "data-wg-notranslate",
    $ = "ve-weglot.com",
    G = "api.weglot.com",
    J = "wg-translations",
    Y = "wg-slugs",
    V = "Shopify",
    K = "BigCommerce",
    Q = "Jimdo",
    X = "Squarespace",
    Z = "Wix",
    ee = "Webflow",
    te = "Square Online",
    ne = "Bubble",
    re = "Salesforce",
    ae = [
      "excluded_blocks",
      "excluded_blocks_remove",
      "dynamics",
      "excluded_paths",
      "dangerously_force_dynamic",
      "extra_definitions",
      "translate_event",
    ],
    oe = [
      "polyfillReady",
      "languageChanged",
      "initialized",
      "start",
      "switchersReady",
    ],
    ie = {
      button_style: {
        full_name: !0,
        with_name: !0,
        is_dropdown: !0,
        with_flags: !1,
        flag_type: "",
      },
      switchers: [],
      auto_switch: !1,
      auto_switch_fallback: "",
      excluded_blocks: [],
      excluded_blocks_remove: [],
      whitelist: [],
      translate_event: [
        { selector: "[data-wg-translate-event]", eventName: null },
      ],
      customer_tag: !1,
      order_tag: !0,
      dynamics: [],
      excluded_paths: [],
      wait_transition: !0,
      hide_switcher: !1,
      translate_search: !1,
      media_enabled: !1,
      search_forms: "",
      cache: !1,
      live: !0,
      loading_bar: !0,
      search_parameter: "",
      translation_engine: 2,
      override_hreflang: !0,
    },
    se = ["none", "shiny", "square", "circle", "rectangle_mat"],
    ce = [
      /weglot.min.js\?api_key=(?<api_key>.*)/,
      /weglot-switcher-editor.js\?api_key=(?<api_key>.*)/,
      /weglot_squarespace-[0-9]+.min.js\?api_key=(?<api_key>.*)/,
    ],
    le = function (e, t) {
      return function (n, r) {
        if (!n || !n[e] || !r) return t;
        try {
          return n[e](r);
        } catch (e) {
          z.error(e, {
            consoleOverride:
              "The CSS selectors that you provided are incorrect: " + r,
            sendToDatadog: !1,
          });
        }
        return t;
      };
    },
    ue = le("querySelectorAll", []),
    de = le("querySelector", null),
    fe = le("closest", null),
    ge = function (e) {
      return document.getElementById(e);
    };
  function me(e) {
    e && e.parentNode && e.parentNode.removeChild(e);
  }
  function pe(e) {
    e = "" + e;
    return ["&nbsp;", "&amp;", "&quot;", "&lt;", "&gt;"].some(function (t) {
      return -1 !== e.indexOf(t);
    })
      ? e
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
      : e;
  }
  function he(e) {
    var t = window.location.search
      .slice(1)
      .split("&")
      .map(function (e) {
        return e && e.split("=");
      })
      .find(function (t) {
        return t[0] === e;
      });
    return t && t[1];
  }
  function ve(e, t) {
    var n = document.createElement("style");
    me(ge(t)),
      (n.id = t),
      (n.type = "text/css"),
      n.styleSheet
        ? (n.styleSheet.cssText = e)
        : n.appendChild(document.createTextNode(e)),
      document.head.appendChild(n);
  }
  var we = function () {
    return /google|facebook|bing|yahoo|baidu|yandex|lighthouse/i.test(
      navigator.userAgent
    );
  };
  function ye(e) {
    try {
      document.createDocumentFragment().querySelector(e);
    } catch (e) {
      return !1;
    }
    return !0;
  }
  var _e = function (e, t, n) {
      var r = new URL(e, location.href);
      return r.searchParams.set(t, n), "" + r.pathname + r.search;
    },
    be = function (e, t) {
      var n;
      return (
        void 0 === t && (t = 1e3),
        function () {
          for (var r = this, a = [], o = arguments.length; o--; )
            a[o] = arguments[o];
          clearTimeout(n),
            (n = setTimeout(function () {
              e.apply(r, a);
            }, t));
        }
      );
    },
    ke = function (e) {
      var t = new Date().getTime().toString();
      try {
        var n = e.contentWindow;
        return (n[t] = "asd"), "asd" === n[t];
      } catch (e) {
        return !1;
      }
    };
  var Ce = {},
    Ee = function (e, t) {
      Ce[e] = t;
    },
    xe = function (e, t) {
      if (Ce[e]) return Ce[e](t);
    };
  var Se,
    Le = {};
  try {
    document.cookie, (Se = !0);
  } catch (e) {
    Se = !1;
  }
  (Le.set = function (e, t, n, r, a) {
    Se &&
      ((e = e
        .replace(/[^+#$&^`|]/g, encodeURIComponent)
        .replace("(", "%28")
        .replace(")", "%29")),
      (t = t.toString().replace(/[^+#$&/:<-[\]-}]/g, encodeURIComponent)),
      !n && gt.is_connect && gt.subdomain && (n = gt.host.split("www.").pop()),
      (n = n ? ";domain=" + n : ""),
      (a = a ? ";expires=" + a : ""),
      (r = r || ""),
      (document.cookie =
        e + "=" + t + n + ";path=/" + r + a + ";SameSite=None;Secure"));
  }),
    (Le.get = function (e) {
      if (!Se) return null;
      for (var t = document.cookie.split(";"); t.length; ) {
        var n = t.pop(),
          r = n.indexOf("=");
        if (
          ((r = r < 0 ? n.length : r),
          decodeURIComponent(n.slice(0, r).replace(/^\s+/, "")) === e)
        )
          return decodeURIComponent(n.slice(r + 1));
      }
      return null;
    }),
    (Le.erase = function (e, t, n) {
      Le.set(e, "", t, n, "Thu, 01 Jan 1970 00:00:00 GMT");
    });
  var Ae = [];
  function Ne(e, t, n) {
    if (e) return n();
    Oe(t, n, !0);
  }
  function Oe(e, t, n) {
    return "function" != typeof t
      ? (z.error("You should provide a callback function as second argument", {
          sendToDatadog: n,
        }),
        !1)
      : !n && oe.indexOf(e) < 0
      ? (z.error("No Weglot event is named " + e, { sendToDatadog: !1 }), !1)
      : (Ae.push({ name: e, callback: t, internal: n }), !0);
  }
  function Te(e) {
    for (var t = [], n = arguments.length - 1; n-- > 0; )
      t[n] = arguments[n + 1];
    for (
      var r = Ae.filter(function (t) {
          return t.name === e;
        }),
        a = 0,
        o = r;
      a < o.length;
      a += 1
    ) {
      var i = o[a];
      try {
        i.callback.apply(i, t);
      } catch (e) {
        if (i.internal) throw e;
        z.error("Error triggering callback function: " + e, {
          sendToDatadog: !1,
        });
      }
    }
  }
  function je() {
    if (window.location.hostname !== $ || !document.baseURI) {
      var e = window.location;
      return {
        url: e.href,
        hostname: e.hostname,
        pathname: e.pathname,
        search: e.search,
      };
    }
    var t = new URL(document.baseURI),
      n = t.hostname,
      r = t.pathname,
      a = t.search;
    return { url: document.baseURI, hostname: n, pathname: r, search: a };
  }
  var Ie = je();
  Ne(gt && Object.keys(gt).length > 0, "onOptionsReady", function () {
    if (gt.dynamicPushState) {
      var e = history.pushState;
      history.pushState = function () {
        for (var t = [], n = arguments.length; n--; ) t[n] = arguments[n];
        e.apply(history, t);
        var r = je();
        (Ie.hostname = r.hostname),
          (Ie.pathname = r.pathname),
          Te("onCurrentLocationChanged");
      };
    }
  });
  var De,
    Re = {};
  function Pe(e) {
    var t = 1;
    return e.replace(/\((.*?)\)/g, function () {
      return "$" + t++;
    });
  }
  function Me() {
    var e = Ie.pathname,
      t = gt.localeRules;
    void 0 === t && (t = []);
    var n = gt.languages,
      r = {
        position: 0,
        translatedFormat: "CODE",
        originalFormat: "",
        addedByDefault: !0,
      },
      a = gt.language_from;
    if (t.length) {
      var o = [];
      t.map(function (e) {
        var t = e.position,
          n = e.translatedFormat;
        n && "CODE" !== n && o.push(t || 0);
      });
      var i = o
        .filter(function (e, t, n) {
          return n.indexOf(e) === t;
        })
        .map(function (e) {
          return Object.assign({}, r, { position: e });
        });
      t.unshift.apply(t, i);
    } else t.push(r);
    var s = null,
      c = null,
      l =
        t.find(function (t) {
          var r = t.position;
          void 0 === r && (r = 0);
          var o = t.translatedFormat;
          void 0 === o && (o = "CODE");
          var i = t.originalFormat;
          void 0 === i && (i = "");
          var l = t.addedByDefault;
          if (!o.includes("CODE")) return !1;
          var u = e.split("/");
          if (u.length <= r) return !1;
          var d = u[r + 1],
            f = n.find(function (e) {
              var t = e.custom_code || e.language_to,
                n = o.replace("CODE", t),
                r = new RegExp("^" + n + "$", "g");
              return !!r.test(d) && ((c = r), !0);
            });
          if (f) return (s = f.custom_code || f.language_to), !0;
          if (i) {
            var g = i.replace("CODE", a);
            return new RegExp("^" + g + "$", "g").test(d);
          }
          return !l;
        }) || r;
    return (
      (Re.convertLocale = function (t, n, r, o) {
        if (
          (void 0 === n && (n = e),
          void 0 === r && (r = s || a),
          void 0 === o && (o = null),
          r === t)
        )
          return n;
        var i = l.position;
        void 0 === i && (i = 0);
        var u = l.originalFormat;
        void 0 === u && (u = "");
        var d = l.translatedFormat;
        void 0 === d && (d = "CODE");
        var f = n.split("/");
        if (f.length <= i) return n;
        var g = f[i + 1];
        if (r === a) {
          var m = d.replace(/CODE/g, t),
            p = !1;
          if (u) {
            var h = u.replace(/CODE/g, a),
              v = new RegExp("^" + h + "$", "g"),
              w = Pe(m);
            (m = g.replace(v, w)),
              o && !v.test(g) && ((p = !0), (m = o.split("/")[i + 1]));
          }
          var y = u && !p ? 2 : 1;
          return f
            .slice(0, i + 1)
            .concat([m], f.slice(i + y))
            .join("/");
        }
        if (t === a && !u)
          return f
            .slice(0, i + 1)
            .concat(f.slice(i + 2))
            .join("/");
        var _ = Pe((t === a ? u : d).replace(/CODE/g, t)),
          b = g.replace(c, _);
        return f
          .slice(0, i + 1)
          .concat([b], f.slice(i + 2))
          .join("/");
      }),
      (Re.language = s || a),
      Re
    );
  }
  function qe() {
    var e = Ie.hostname,
      t = gt.languages.find(function (t) {
        return (
          t.connect_host_destination && t.connect_host_destination.host === e
        );
      });
    return t ? t.custom_code || t.language_to : gt.language_from;
  }
  function We() {
    return Me().language;
  }
  function ze() {
    if (De) return De;
    if (gt.is_connect) {
      var e = document.documentElement.dataset.wgTranslated;
      return e ? ((De = e), e) : (De = gt.subdirectory ? We() : qe());
    }
    return (De = gt.language_from);
  }
  function Be(e, t) {
    var n = t;
    n || (n = ze());
    for (var r = 0, a = e; r < a.length; r += 1) {
      var o = a[r];
      if (!o || !o.dataset || !o.dataset.wgOnlyDisplay) return;
      o.hidden = o.dataset.wgOnlyDisplay !== n;
    }
  }
  Oe(
    "onCurrentLocationChanged",
    function () {
      Re = {};
    },
    !0
  );
  var Ue = {
      getItem: function (e) {
        return Le.get(e);
      },
      setItem: function (e, t, n) {
        void 0 === n && (n = {});
        var r = n.domain,
          a = n.path,
          o = n.expires;
        Le.set(e, t, r, a, o);
      },
      removeItem: function (e) {
        return Le.erase(e);
      },
    },
    Fe = {
      getItem: function () {},
      setItem: function () {},
      removeItem: function () {},
    };
  function He(e) {
    void 0 === e && (e = {});
    var t = e.type || "local";
    try {
      return "cookie" === t ? Ue : window.localStorage;
    } catch (e) {}
    return e.type ? Fe : He({ type: "local" === t ? "cookie" : "local" });
  }
  function $e() {
    -1 !== location.search.indexOf("weglot-private=0") &&
      He().removeItem("wg-private-mode");
    var e =
      document.getElementById("admin-bar-iframe") ||
      document.getElementById("preview-bar-iframe") ||
      !0 === gt.switcher_editor ||
      -1 !== location.search.indexOf("weglot-private=1") ||
      "1" === He().getItem("wg-private-mode") ||
      window.location.hostname === $;
    return e && He().setItem("wg-private-mode", "1"), e;
  }
  var Ge = { slugs: {}, version: 0, network: void 0 };
  function Je() {
    return new Promise(function (e) {
      for (
        var t = gt.languages,
          n = {},
          r = function () {
            var r = o[a],
              i = r.custom_code,
              s = r.language_to;
            (function (e) {
              var t = gt.api_key,
                n = gt.versions;
              if (!n || !n.slugTranslation) return Promise.resolve({});
              var r =
                "https://cdn-api-weglot.com/translations/slugs?api_key=" +
                t +
                "&language_to=" +
                e +
                "&v=" +
                n.slugTranslation;
              return fetch(r)
                .then(function (e) {
                  return e.json();
                })
                .then(function (e) {
                  return Array.isArray(e) ? {} : e;
                })
                .catch(function (e) {
                  return z.error(e);
                });
            })(s).then(function (r) {
              (n[i || s] = r), Object.keys(n).length === t.length && e(n);
            });
          },
          a = 0,
          o = t;
        a < o.length;
        a += 1
      )
        r();
    });
  }
  function Ye(e) {
    return e
      ? Object.keys(e).reduce(function (t, n) {
          return (
            (t[n] = (function (e) {
              return Object.keys(e).reduce(
                function (t, n) {
                  return (
                    e[n] && ((t.original[n] = e[n]), (t.translated[e[n]] = n)),
                    t
                  );
                },
                { original: {}, translated: {} }
              );
            })(e[n])),
            t
          );
        }, {})
      : {};
  }
  function Ve(e) {
    var t = gt.versions;
    if (t && t.slugTranslation) {
      var n = t.slugTranslation;
      Ge.version < n &&
        (Ge.network
          ? Ge.network.resolved ||
            Ge.network.then(function (t) {
              return e(Ye(t));
            })
          : (Ge.network = Je().then(function (t) {
              return (
                (Ge.network.resolved = !0),
                (function (e) {
                  var t = gt.versions,
                    n = { version: t ? t.slugTranslation : 1, slugs: e };
                  try {
                    var r = He({ type: "local" });
                    r && r.setItem(Y, JSON.stringify(n));
                  } catch (e) {
                    z.warn(e);
                  }
                  Ge = Object.assign({}, Ge, n);
                })(t),
                e(Ye(t)),
                t
              );
            }))),
        e(Ye(Ge.slugs));
    } else e({});
  }
  !(function () {
    if (Object.keys(Ge.slugs).length) return Ge.slugs;
    try {
      var e = He({ type: "local" });
      if (!e) return {};
      var t = e.getItem(Y);
      t && (Object.assign(Ge, JSON.parse(t)), Ge.slugs);
    } catch (e) {
      return {};
    }
  })();
  var Ke = {};
  function Qe(e, t) {
    return e
      .split("/")
      .map(function (e) {
        return t[decodeURIComponent(e)] || e;
      })
      .join("/");
  }
  function Xe(e, t) {
    var n = ze(),
      r = new URL(Ie.url);
    r.searchParams.has("lang") && r.searchParams.delete("lang"),
      gt.auto_switch &&
        gt.is_connect &&
        gt.is_tld &&
        (e === gt.language_from
          ? r.searchParams.set("no_redirect", "true")
          : r.searchParams.delete("no_redirect"));
    var a = (function (e) {
      if (gt.subdirectory) return !1;
      var t = gt.language_from,
        n = gt.host,
        r = gt.languages;
      if (e === t) return n;
      var a = (
        r.find(function (t) {
          return t.custom_code === e || t.language_to === e;
        }) || {}
      ).connect_host_destination;
      return a && a.host;
    })(e);
    return (
      a && (r.hostname = a),
      (r.pathname = (function (e, t, n, r) {
        if (!Object.keys(e).length) return t;
        if (!Ke.originalPath)
          if (n !== gt.language_from && e[n]) {
            var a = e[n].translated;
            Ke.originalPath = Qe(t, a);
          } else Ke.originalPath = t;
        return r === gt.language_from
          ? Ke.originalPath
          : e[r] && e[r].original
          ? Qe(Ke.originalPath, e[r].original)
          : t;
      })(t, r.pathname, n, e)),
      gt.subdirectory &&
        e &&
        (r.pathname = (function (e, t) {
          return Me().convertLocale(e, t);
        })(e, r.pathname)),
      r.toString()
    );
  }
  function Ze(e, t) {
    if (!gt.is_connect || !e) return t("#");
    Ve(function (n) {
      return t(Xe(e, n));
    });
  }
  Oe(
    "onCurrentLocationChanged",
    function () {
      Ke = {};
    },
    !0
  );
  var et = {};
  function tt(e, t) {
    return gt.is_connect && e !== gt.language_from
      ? et[t]
        ? et[t]
        : (Ve(function (r) {
            var a = r && r[e] ? Qe(t, r[e].original) : t;
            n = gt.subdirectory
              ? Me().convertLocale(e, a, gt.language_from)
              : a;
          }),
          (et[t] = n),
          n)
      : t;
    var n;
  }
  Oe(
    "onCurrentLocationChanged",
    function () {
      et = {};
    },
    !0
  );
  var nt = {};
  function rt(e) {
    return e
      ? "string" != typeof e
        ? e
        : e.split(",").map(function (e) {
            return { value: e };
          })
      : [];
  }
  function at(e, t) {
    if ((void 0 === t && (t = ""), !e)) return ie.button_style;
    var n = e.classF || "",
      r = n.match(/flag-(\d)/),
      a = {
        with_name: e.withname,
        full_name: !!e.fullname,
        is_dropdown: !!e.is_dropdown,
        with_flags: -1 !== n.indexOf("wg-flags"),
        flag_type: r && r[1] ? se[r[1]] : "",
        invert_flags: !0,
      };
    return t && (a.custom_css = t), a;
  }
  function ot(e) {
    var t = e.styleOpt,
      n = e.containerCss,
      r = e.target,
      a = e.sibling;
    return { style: at(t, n), location: { target: r, sibling: a } };
  }
  (nt[V] = function () {
    var e = function (e) {
        void 0 === e && (e = ze());
        for (
          var t = function (t) {
              return tt(e, t);
            },
            r = n(e),
            a = 0,
            o = document.querySelectorAll(
              [
                'form[method="post"][action^="' + t("/cart") + '"]',
                'form[method="post"][action^="' + t("/checkout") + '"]',
              ].join(",")
            );
          a < o.length;
          a += 1
        ) {
          var i = o[a],
            s = i.getAttribute("action");
          (0 === s.indexOf(t("/cart")) && s.split("?")[0] !== t("/cart")) ||
            i.setAttribute("action", _e(s, "locale", r));
        }
        for (
          var c = 0,
            l = document.querySelectorAll(
              'a[href^="' +
                t("/checkout") +
                '"],a[href^="' +
                t("/cart/checkout") +
                '"]'
            );
          c < l.length;
          c += 1
        ) {
          var u = l[c];
          u.setAttribute("href", _e(u.getAttribute("href"), "locale", r));
        }
      },
      t = function (e) {
        void 0 === e && (e = ze());
        var t =
          document.getElementById("create_customer") ||
          document.querySelector('form[action="' + tt(e, "/account") + '"]') ||
          ("string" == typeof gt.customer_tag && de(document, gt.customer_tag));
        if (t) {
          var n = document.getElementById("weglot-lang-form");
          n && n.parentNode.removeChild(n);
          var r = document.createElement("input");
          Object.assign(r, {
            type: "hidden",
            id: "weglot-lang-form",
            name: "customer[tags]",
            value: "#wg" + e + "#wg",
          }),
            t.appendChild(r);
        }
      };
    function n(e) {
      return "pt" === e
        ? "pt-PT"
        : "ro" === e
        ? "ro-RO"
        : "fl" === e
        ? "fil"
        : "zh" === e
        ? "zh-CN"
        : "tw" === e
        ? "zh-TW"
        : e.substr(0, 2);
    }
    var r = function () {
        var e = document.getElementById("shopify-features");
        if (!e) return null;
        var t = e.textContent.match(/"shopId":(\d*)/);
        return t ? t[1] : null;
      },
      a = function (e) {
        if (
          (void 0 === e && (e = ze()),
          window.location.hostname !== $ && window.top === window.self)
        ) {
          var t = gt.cart_attributes
            .map(function (t) {
              return "attributes[" + t + "]=" + n(e);
            })
            .join("&");
          fetch("/cart/update.js", {
            method: "POST",
            body: t,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            credentials: "same-origin",
          });
          for (
            var r = document.querySelectorAll('a[href*="/cart/"]'),
              a = "attributes[lang]=" + e,
              o = 0,
              i = r;
            o < i.length;
            o += 1
          ) {
            var s = i[o],
              c = s.getAttribute("href");
            if (c) {
              var l = c.match(/\/cart\/\d+:\d+(\?)?/);
              l &&
                ((c = c.replace(/&?attributes\[lang\]=([a-zA-Z-]+)/g, "")),
                s.setAttribute("href", c + (l[1] ? "&" : "?") + a));
            }
          }
        }
      };
    function o(o) {
      if (gt.language_from !== o) {
        var i, s;
        window.Shopify && (window.Shopify.locale = o),
          !we() && gt.order_tag && a(o),
          e(o),
          (i = o),
          (s = r()) && Le.set("checkout_locale", n(i), null, s);
        var c = document.querySelectorAll("[data-wg-only-display]");
        c.length && Be(c, o), gt.customer_tag && t(o);
      }
    }
    Oe(
      "initialized",
      function () {
        window.langify &&
          z.log("%c Please, uninstall langify to properly use Weglot", {
            sendToDatadog: !1,
          }),
          !we() && gt.order_tag && a(),
          e();
        var r,
          o = document.querySelectorAll("[data-wg-only-display]");
        o.length && Be(o),
          gt.customer_tag && t(),
          document.getElementsByClassName("shopify-payment-button").length &&
            ((r = window.fetch),
            (window.fetch = function () {
              if ("/wallets/checkouts.json" === arguments[0])
                try {
                  var e = JSON.parse(arguments[1].body),
                    t = n(ze());
                  (e.checkout.attributes = {}),
                    gt.cart_attributes.forEach(function (n) {
                      return (e.checkout.attributes[n] = t);
                    }),
                    (arguments[1].body = JSON.stringify(e));
                } catch (e) {}
              return r.apply(window, arguments);
            }));
      },
      !0
    ),
      Ee("onConnectPageLoad", function (e) {
        return o(e);
      }),
      Ee("onPageLanguageSet", function (e) {
        return o(e);
      }),
      Ee("onDynamicDetected", function () {
        e(ze());
      }),
      Ee("startWhen", function () {
        return (
          ge("admin-bar-iframe") ||
          ge("preview-bar-iframe") ||
          $e() ||
          (function () {
            for (var e = 0, t = document.scripts; e < t.length; e += 1)
              if (-1 !== t[e].src.indexOf("preview_bar_injector")) return !0;
            return !1;
          })()
        );
      });
    var i = [
        "#isp_search_result_page_container",
        ".snize-ac-results",
        "#snize_results",
        ".snize-recommendation",
        ".snize-modal",
        ".snize-search-results-header",
        "div>span.cc-message",
        ".hc-widget",
        ".jdgm-rev-widg__header",
        ".jdgm-rev__body",
        ".jdgm-rev-title",
        ".yotpo-main-widget",
        "#swell-popup",
        ".swell-tab",
        ".yotpo-widget-override-css",
        "#saso-notifications",
        ".saso-cross-sell-popup",
        ".saso-cart-item-discount-notes",
        ".saso-cart-item-upsell-notes",
        ".saso-volume-discount-tiers",
        ".opw-leading-normal",
        ".opw-my-2.opw-leading-normal.opw-text-lg.opw-text-left",
        ".opinew-navbar.opw-flex.opw-items-center.opw-justify-between.opw-flex-wrap.opw-py-4.opw-px-6",
        ".main-content-container.opw--mx-1",
        ".opw-text-center.opw-text-sm.opw-border-solid.opw-border-0.opw-mt-3",
        ".summary-card-container.opw-mx-1",
        ".opw-reviews-container.opw-mt-3.opw--mx-1",
        ".opinew-reviews-title.opw-flex.opw-items-center.opw-flex-no-shrink.opw-mr-6",
        ".opw-flex.opw-flex-row-reverse",
        "#opinew-app-container",
        ".gem_dynamic-content",
        ".pp_tracking_content",
        ".pp_all_form_div",
        ".pp_tracking_result_title",
        ".progress-bar-style",
        ".pp_tracking_left",
        ".pp_num_status_show",
        ".pp_tracking_status_tips",
        ".pp_page_map_div",
        ".pp_tracking_result_parent",
        ".pp_tracking_right",
        ".pp_recommend_product_parent",
        ".currency-converter-cart-note",
        ".cbb-shipping-rates-calculator",
        ".cbb-frequently-bought-container",
        ".cbb-frequently-bought-discount-applied-message",
        ".cbb-also-bought-container",
        "#zonos",
        ".buddha-menu-item",
        ".R-GlobalModal",
        ".ruk-rating-snippet-count",
        ".R-ContentList-container",
        ".R-ReviewsList-container",
        ".R-SliderIndicator-group",
        ".R-TextBody",
        ".widgetId-reviewsio-carousel-widget",
        ".REVIEWSIO-FloatingMinimised",
        ".REVIEWSIO-FloatingMinimised__Container",
        ".reviewsio-carousel-widget",
        ".reviews-io-floating-widget",
        ".reviews_container",
        ".site-nav.style--sidebar .site-nav-container .subtitle",
        ".search-more",
        ".variant-quantity",
        ".lion-claimed-rewards-list",
        ".lion-header",
        ".lion-header__join-buttons",
        ".lion-header__join-today",
        ".lion-history-table",
        ".lion-integrated-page-section__heading-text",
        ".lion-loyalty-panel",
        ".lion-loyalty-splash",
        ".lion-loyalty-widget",
        ".lion-modal__content",
        ".lion-modal__header",
        ".lion-referral-widget",
        ".lion-rewards-list",
        ".lion-rules-list",
        ".lion-tier-overview",
        ".ccpops-popup__content__bottom-text",
        ".ccpops-popup__content__top-text",
        ".ccpops-trigger__text",
        ".ks-table-row",
        ".klaviyo-form",
      ],
      s = gt.is_connect
        ? i
        : [
            "form.cart.ajaxcart",
            "form.cart-drawer",
            "#cross-sell",
            ".wheelio_holder",
            ".mini-cart",
            "#shopify-product-reviews",
            "#esc-oos-form",
            ".product__add-to-cart-button",
            "select.product-variants>option:not([value])",
            ".ui-autocomplete",
            ".shopify-payment-button__button",
            "#shopify-section-static-recently-viewed-products",
            "#recently-viewed-products",
            "#shopify-section-product-recommendations",
            ".action_button.add_to_cart",
          ].concat(i);
    return {
      cart_attributes: ["lang", "Invoice Language"],
      excluded_blocks: [
        "input[type='radio']",
        "span.money",
        ".price",
        ".product__prices",
        "#admin-bar-iframe",
        ".notranslate",
        ".skiptranslate",
        "#isp_refine_nevigation",
        "#isp_header_subtitle",
        ".isp_sorting_and_result_view_wrapper",
        "#isp_results_did_you_mean > span",
        ".isp_facet_show_hide_values",
        "#isp_main_search_box",
        ".snize-filter-variant-count",
        ".snize-search-results-header a",
        ".snize-search-results-header b",
        ".hc-author__text",
        ".hc-avatar__initials",
        ".hc-rating-chart__count",
        ".hc-rating-chart__percentage-value",
        ".yotpo-review-date",
        ".yotpo-user-name",
        ".yotpo-user-letter",
        ".yotpo .avg-score",
        ".yotpo .sr-only",
        ".yotpo-mandatory-mark",
      ].map(function (e) {
        return { value: e };
      }),
      search_forms:
        "form[action='/pages/search-results'],form[action='/search']",
      search_parameter: "q",
      dangerously_force_dynamic: ".shopify-payment-button button",
      dynamics: s.map(function (e) {
        return { value: e };
      }),
      extra_definitions: [
        {
          type: 1,
          selector: ".snize-color-swatch",
          attribute: "data-sntooltip",
        },
        {
          type: 1,
          selector: "button[data-pf-type=ProductATC]",
          attribute: "data-soldout",
        },
        {
          type: 1,
          selector: "button[data-pf-type=ProductATC]",
          attribute: "data-adding",
        },
        {
          type: 1,
          selector: "button[data-pf-type=ProductATC]",
          attribute: "data-added",
        },
      ],
    };
  }),
    (nt[K] = function () {
      return (
        Ee("onPageLanguageSet", function (e) {
          !(function (e) {
            for (
              var t = 0,
                n = document.querySelectorAll(
                  '[href*="/checkout.php"],[href*="/cart.php"]'
                );
              t < n.length;
              t += 1
            ) {
              var r = n[t];
              r.setAttribute("href", _e(r.getAttribute("href"), "lang", e));
            }
          })(e);
        }),
        {
          dynamics: [
            ".quick-shop-details",
            "#QuickViewProductDetails",
            ".QuickViewModal",
            ".modalContainer",
            ".ng-checkout-container",
            ".previewCartAction",
            "#checkout-app",
          ].map(function (e) {
            return { value: e };
          }),
          search_forms: "form[action='/search.php']",
          search_parameter: "search_query",
        }
      );
    }),
    (nt[ne] = function () {
      return gt.is_connect ? {} : { dynamics: [{ value: ".content" }] };
    }),
    (nt[Q] = function () {
      return {
        excluded_blocks: [
          '[data-display="cms-only"]',
          ".j-admin-links",
          ".cc-m-status-empty",
        ].map(function (e) {
          return { value: e };
        }),
      };
    }),
    (nt[X] = function () {
      var e = [],
        t = [];
      document.getElementById("sqs-cart-root") &&
        (e.push("#sqs-cart-container"),
        t.push(
          "#sqs-cart-container [class*=subtotalPrice]",
          "#sqs-cart-container .cart-container .item-price"
        )),
        document.getElementById("sqs-standard-checkout") &&
          (e.push("#checkout"),
          t.push(
            "#checkout span.money",
            "#checkout [data-test*=incomplete] [class^=PaymentCard-container]",
            "#checkout [data-test*=incomplete] [class^=CustomerAddress-container]",
            "#checkout [class^=CustomerInfoSection-email]",
            "#checkout [class^=GoogleResultsList]"
          ));
      var n = window.location.host.endsWith("squarespace.com");
      if (
        (Oe("initialized", function () {
          try {
            var e = window.ExtensionScriptsSDK;
            if (!e) return;
            e["1.0"].page.events.dispatchScriptLoadEvent("Weglot");
          } catch (e) {}
        }),
        !gt.is_connect)
      )
        try {
          for (
            var r = 0,
              a = Array.from(
                document.querySelectorAll(".animation-segment-wrapper")
              );
            r < a.length;
            r += 1
          ) {
            a[r].parentNode.dataset.dynamicStrings = "";
          }
          for (
            var o = 0,
              i = Array.from(
                document.querySelectorAll(".animation-segment-parent-hidden")
              );
            o < i.length;
            o += 1
          ) {
            i[o].dataset.dynamicStrings = "";
          }
          t.push(".animation-segment-wrapper"),
            t.push(".animation-segment-parent-hidden > *");
        } catch (e) {}
      return {
        force_translation: e.join(","),
        dynamics: [
          "#sqs-cart-container",
          "#checkout",
          ".sqs-widgets-confirmation",
          ".video-player",
          ".jdgm-widget",
        ]
          .map(function (e) {
            return { value: e };
          })
          .concat(
            gt.is_connect
              ? []
              : [
                  { value: "[data-dynamic-strings]" },
                  { value: ".sqs-add-to-cart-button" },
                ]
          ),
        excluded_blocks: t.map(function (e) {
          return { value: e };
        }),
        forceDisableConnect: n,
        merged_selectors_remove: [
          { value: ".plyr__menu__container" },
          { value: ".product-price .original-price" },
        ],
      };
    }),
    (nt[Z] = function () {
      var e = {
        dynamics: document.documentElement.getAttribute("data-wg-translated")
          ? []
          : [{ value: "#SITE_CONTAINER" }],
        dynamicPushState: !0,
      };
      if (
        (window.wixBiSession &&
          "bolt" !== window.wixBiSession.renderType &&
          location.hostname !== $ &&
          (document.addEventListener("DOMContentLoaded", function () {
            new MutationObserver(function (e) {
              for (var t = 0; t < e.length; t++) {
                "SUCCESS" ===
                  e[t].target.getAttribute("data-santa-render-status") &&
                  (this.disconnect(), Te("start"));
              }
            }).observe(document.getElementById("SITE_CONTAINER"), {
              attributes: !0,
              attributeFilter: ["data-santa-render-status"],
            });
          }),
          (e.delayStart = !0),
          (e.wait_transition = !1)),
        window.wixBiSession && "bolt" === window.wixBiSession.renderType)
      ) {
        var t = 0,
          n = setInterval(function () {
            ((document.body && window.sssr) || 40 === t) &&
              (Te("start"), clearInterval(n)),
              t++;
          }, 100);
        (e.delayStart = !0), (e.wait_transition = !1);
      }
      return e;
    }),
    (nt[ee] = function () {
      return (
        Oe("switchersReady", function () {
          var e = document.querySelector(".weglot-container");
          e && e.classList.add("weglot-container--left");
        }),
        {
          forceDisableConnect: window.Webflow && !!window.Webflow.env("editor"),
          excluded_blocks: [".wg-element-wrapper"].map(function (e) {
            return { value: e };
          }),
        }
      );
    }),
    (nt[te] = function () {
      return {
        dynamics: [
          ".w-container",
          ".w-wrapper",
          ".product-header",
          ".product-messages",
          ".error",
          "button",
        ].map(function (e) {
          return { value: e };
        }),
      };
    }),
    (nt[re] = function () {
      return {
        ignoreDynamicFragments: !0,
        dynamicPushState: !0,
        forceAllDynamics: !0,
        merged_selectors_remove: [{ value: ".themeProfileMenu" }],
      };
    });
  var it = [
    { from: "originalLanguage", to: "language_from" },
    { from: "autoSwitch", to: "auto_switch" },
    { from: "autoSwitchFallback", to: "auto_switch_fallback" },
    { from: "waitTransition", to: "wait_transition" },
    { from: "subDomain", to: "subdomain" },
    { from: "translateSearch", to: "translate_search" },
    { from: "searchsForms", to: "search_forms" },
    { from: "searchParameter", to: "search_parameter" },
    { from: "hideSwitcher", to: "hide_switcher" },
    { from: "dangerouslyForceDynamic", to: "dangerously_force_dynamic" },
    { from: "loadingBar", to: "loading_bar" },
    { from: "customerTag", to: "customer_tag" },
    { from: "orderTag", to: "order_tag" },
    { from: "translateImages", to: "media_enabled" },
    { from: "extraDefinitions", to: "extra_definitions" },
    {
      from: "excludePaths",
      to: "excluded_paths",
      func: function (e) {
        return e
          ? "string" != typeof e
            ? e
            : e
                .split(",")
                .filter(function (e) {
                  return !!e;
                })
                .map(function (e) {
                  return { value: e, type: "CONTAIN" };
                })
          : [];
      },
    },
    { from: "exceptions", to: "excluded_blocks", func: rt },
    { from: "whiteList", to: "whitelist", func: rt },
    { from: "styleOpt", to: "button_style", func: at },
    {
      from: "destinationLanguages",
      to: "languages",
      func: function (e) {
        return "string" != typeof e
          ? e
          : e.split(",").map(function (e) {
              return {
                language_to: e,
                provider: null,
                automatic_translation_enabled: !0,
              };
            });
      },
    },
  ];
  function st(e) {
    var t = Object.assign({}, e);
    return (
      t.switchers &&
        ("string" == typeof t.switchers &&
          (t.switchers = JSON.parse(t.switchers)),
        t.switchers.length &&
          t.switchers[0].styleOpt &&
          (t.switchers = t.switchers.map(ot))),
      Array.isArray(t.dynamic) && (t.dynamic = t.dynamic.join(",")),
      Array.isArray(t.translate_iframes) &&
        (t.translate_iframes = t.translate_iframes.join(",")),
      t.translate_images && (t.media_enabled = !0),
      it.forEach(function (e) {
        var n = e.from,
          r = e.to,
          a = e.func;
        void 0 !== t[n] && ((t[r] = a ? a(t[n]) : t[n]), delete t[n]);
      }),
      t
    );
  }
  function ct(e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        -1 === t.indexOf(r) &&
        (n[r] = e[r]);
    return n;
  }
  var lt = {};
  function ut(e) {
    if (!e || !e.api_key) throw Error("You have to provide at least a key");
    var t = e.api_key.split("wg_").pop(),
      n = st(e);
    return (function (e) {
      if (window.location.hostname === $)
        return fetch(
          "https://api.weglot.com/projects/settings?api_key=wg_" + e
        ).then(function (e) {
          return e.json();
        });
      var t = ge("weglot-data");
      if (t)
        try {
          var n = JSON.parse(t.innerHTML),
            r = n.settings,
            a = ct(n, ["settings"]);
          if (r) return (r.injectedData = a), Promise.resolve(r);
        } catch (e) {}
      return fetch("" + B + e + ".json").then(function (e) {
        return e.json();
      });
    })(t)
      .then(function (e) {
        var t = e.custom_settings,
          r = ct(e, ["custom_settings"]);
        n.button_style = Object.assign(t ? t.button_style : {}, n.button_style);
        var a = r.language_from,
          o = r.languages;
        a && (n.language_from = a),
          o && (n.languages = o),
          t && t.localeRules && (n.localeRules = t.localeRules);
        var i = ft(Object.assign({}, r, t, n));
        return Te("onOptionsReady"), i;
      })
      .catch(function (e) {
        z.error(e, {
          consoleOverride:
            (e && e.wgErrMsg) ||
            "Cannot fetch Weglot options. Is your key correct?",
          sendToDatadog: !1,
        }),
          z.deactivateDatadog();
      });
  }
  function dt() {
    var e = ge("weglot-data");
    if (e)
      try {
        var t = JSON.parse(e.innerHTML);
        delete t.settings, t && (lt.injectedData = t);
      } catch (e) {}
  }
  function ft(e) {
    if (e.deleted_at)
      throw {
        wgErrMsg: "Cannot load Weglot because the project has been deleted",
      };
    e.injectedData ||
      ("loading" === document.readyState
        ? document.addEventListener("DOMContentLoaded", function () {
            dt();
          })
        : dt()),
      "SUBDIRECTORY" === e.url_type && e.is_dns_set && (e.subdirectory = !0),
      e.languages.length || (e.languages = []),
      (lt.is_connect =
        e.subdirectory ||
        e.languages.some(function (e) {
          return (
            e.connect_host_destination &&
            e.connect_host_destination.is_dns_set &&
            e.connect_host_destination.created_on_aws
          );
        })),
      (e.subdomain = !e.subdirectory && (e.subdomain || lt.is_connect)),
      e.dynamic &&
        (e.dynamics ||
          (e.dynamics = e.dynamic.split(",").map(function (e) {
            return { value: e.trim() };
          })),
        delete e.dynamic);
    var t,
      n,
      r,
      a = e.technology_name || lt.technology_name,
      o = (t = a) && nt[t] ? nt[t]() : {},
      i = Object.assign({}, ie, o);
    if (
      (Object.assign(lt, i, e),
      ae.forEach(function (e) {
        lt[e] !== i[e] &&
          (lt[e] = (function (e, t) {
            if (!t) return e;
            if (Array.isArray(e)) return [].concat(e, t);
            if ("object" == typeof e) return Object.assign({}, e, t);
            return (e = (function (e) {
              return e
                .split(",")
                .filter(function (e) {
                  return e;
                })
                .join(",");
            })(e)) &&
              e.length > 0 &&
              e !== t
              ? (e += "," + t)
              : (e = t);
          })(lt[e], i[e]));
      }),
      (n = "https://cdn.weglot.com/weglot.min.css?v=4"),
      ((r = document.createElement("link")).rel = "stylesheet"),
      (r.type = "text/css"),
      (r.href = n),
      document.head.appendChild(r),
      lt.button_style &&
        lt.button_style.custom_css &&
        ve(lt.button_style.custom_css, "weglot-custom-style"),
      lt.switchers && 0 !== lt.switchers.length
        ? (lt.switchers = lt.switchers.map(function (e) {
            var t = e.button_style,
              n = ct(e, ["button_style"]);
            return Object.assign({}, { style: n.style || t }, n);
          }))
        : (lt.switchers = [
            { style: lt.button_style, location: {}, default: !0 },
          ]),
      lt.cache && location.hostname === $ && (lt.cache = !1),
      lt.api_key.length < 36 && (lt.translation_engine = 1),
      lt.excluded_blocks_remove &&
        (lt.excluded_blocks = lt.excluded_blocks.filter(function (e) {
          return !lt.excluded_blocks_remove.includes(e.value);
        })),
      lt.dangerously_force_dynamic &&
        (lt.dynamics = lt.dynamics.concat(
          lt.dangerously_force_dynamic.split(",").map(function (e) {
            return { value: e.trim() };
          })
        )),
      (lt.excluded_blocks = lt.excluded_blocks.filter(function (e) {
        return ye(e.value);
      })),
      (lt.dynamics = lt.dynamics.filter(function (e) {
        return ye(e.value);
      })),
      (lt.is_tld = !1),
      o.forceDisableConnect && (lt.is_connect = !1),
      lt.is_connect)
    ) {
      var s = lt.host.split("www.").pop();
      lt.is_tld = lt.languages.some(function (e) {
        if (e.connect_host_destination && e.connect_host_destination.host)
          return -1 === e.connect_host_destination.host.indexOf(s);
      });
    }
    return lt;
  }
  var gt = lt;
  var mt = {
      "Node.prototype.contains": document.contains,
      "Element.prototype.cloneNode":
        "document" in self && "cloneNode" in document.documentElement,
      "location.origin": "location" in self && "origin" in self.location,
      MutationObserver: "MutationObserver" in self,
      Promise: "Promise" in self && "resolve" in Promise,
      "Element.prototype.matches":
        "document" in self && "matches" in document.documentElement,
      "Element.prototype.closest":
        "document" in self && "closest" in document.documentElement,
      "Element.prototype.classList":
        "document" in self &&
        "classList" in document.documentElement &&
        (function () {
          var e = document.createElement("div");
          if (
            !(
              e.classList &&
              e.classList.add &&
              e.classList.remove &&
              e.classList.contains &&
              e.classList.toggle
            )
          )
            return !1;
          var t = !0;
          e.classList.add("add1", "add2"),
            (t =
              t &&
              e.className.indexOf("add1") >= 0 &&
              e.className.indexOf("add2") >= 0),
            (e.className = "remove1 remove2 remove3"),
            e.classList.remove("remove1", "remove3"),
            (t =
              t &&
              -1 === e.className.indexOf("remove1") &&
              e.className.indexOf("remove2") >= 0 &&
              -1 === e.className.indexOf("remove3"));
          try {
            e.remove();
          } catch (t) {
            e = null;
          }
          return t;
        })(),
      "String.prototype.includes": "includes" in String.prototype,
      fetch: "fetch" in self,
      "Array.prototype.find": "find" in Array.prototype,
      "Array.prototype.findIndex": "findIndex" in Array.prototype,
      "Object.assign": "assign" in Object,
      "Array.prototype.includes": "includes" in Array.prototype,
      URL: (function (e) {
        try {
          var t = new e.URL("http://weglot.com");
          if ("href" in t && "searchParams" in t) {
            var n = new URL("http://weglot.com");
            if (
              ((n.search = "a=1&b=2"),
              "http://weglot.com/?a=1&b=2" === n.href &&
                ((n.search = ""), "http://weglot.com/" === n.href))
            ) {
              var r = new e.URLSearchParams("a=1"),
                a = new e.URLSearchParams(r);
              if ("a=1" === String(a)) return !0;
            }
          }
          return !1;
        } catch (e) {
          return !1;
        }
      })(self),
    },
    pt = !1;
  function ht() {
    (pt = !0), Te("polyfillReady");
  }
  function vt() {
    return pt;
  }
  function wt(e) {
    if (e && e.toLowerCase) {
      var t = e.toLowerCase(),
        n = gt.languages.find(function (e) {
          var n = e.language_to,
            r = e.custom_code;
          return n === t || (r ? r.toLowerCase() === t : void 0);
        });
      return n ? n.language_to : e;
    }
  }
  !(function (e) {
    window.Prototype &&
      (delete Object.prototype.toJSON, delete Array.prototype.toJSON);
    var t = Object.keys(mt).filter(function (e) {
      return !mt[e];
    });
    if (t.length) {
      !(function (e, t, n) {
        var r = !1;
        function a() {
          r ||
            ((r = !0),
            setTimeout(function () {
              return t(n);
            }, 20));
        }
        var o =
            document.getElementsByTagName("head")[0] ||
            document.documentElement,
          i = document.createElement("script");
        (i.type = "text/javascript"),
          (i.src = e),
          i.addEventListener
            ? (i.addEventListener("load", a, !1),
              i.addEventListener("error", a, !1))
            : i.readyState && (i.onreadystatechange = a),
          o.insertBefore(i, o.firstChild);
      })(
        "https://cdn.polyfill.io/v2/polyfill.min.js?callback=Weglot.polyReady&features=" +
          t.join(","),
        function () {}
      );
    } else e();
  })(ht);
  var yt,
    _t = {};
  function bt(e) {
    var t = gt.excluded_paths,
      n = Ie.pathname,
      r = Ie.search;
    if (
      ((n = n.toLowerCase()),
      "shopify.weglot.com" === window.location.host || !t || !t.length)
    )
      return !1;
    if (
      "string" == typeof t &&
      t.split(",").some(function (e) {
        return new RegExp(e, "i").test(n);
      })
    )
      return { allExcluded: !0, language_button_displayed: !0 };
    var a = e || wt(ze());
    if (void 0 !== _t[a] && _t.currentLang === a) return _t[a];
    var o = decodeURI("" + n + r);
    return (
      (_t.currentLang = a),
      gt.injectedData &&
        gt.injectedData.originalPath &&
        (o = n = gt.injectedData.originalPath.toLowerCase()),
      t.some(function (e) {
        var t = e.type,
          r = e.value,
          i = e.excluded_languages,
          s = e.language_button_displayed;
        r = r.toLowerCase();
        var c = {
          language_button_displayed: s,
          allExcluded: !(
            !i || !(0 === i.length || i.length >= gt.languages.length)
          ),
        };
        if (i && i.length && !i.includes(a)) return !1;
        switch (t) {
          case "START_WITH":
            return 0 === o.indexOf(r) && ((_t[a] = c), !0);
          case "END_WITH":
            return (
              -1 !== n.indexOf(r, n.length - r.length) && ((_t[a] = c), !0)
            );
          case "CONTAIN":
            return -1 !== o.indexOf(r) && ((_t[a] = c), !0);
          case "IS_EXACTLY":
            return n === r && ((_t[a] = c), !0);
          case "MATCH_REGEX":
            try {
              return !!RegExp(r).test(o) && ((_t[a] = c), !0);
            } catch (e) {
              return (
                z.warn(e, {
                  consoleOverride: r + " is an invalid regex",
                  sendToDatadog: !1,
                }),
                !1
              );
            }
          default:
            return !1;
        }
      }),
      _t[a]
    );
  }
  function kt() {
    if (yt) return yt;
    if (!gt.api_key)
      return (
        z.warn("Weglot must be initialized to use it.", { sendToDatadog: !1 }),
        []
      );
    var e = (gt.languages || [])
        .filter(function (e) {
          var t = bt(e.language_to),
            n = !t || t.language_button_displayed;
          return (
            (!1 !== e.enabled || $e()) &&
            n &&
            (gt.subdirectory ||
              !e.connect_host_destination ||
              e.connect_host_destination.created_on_aws)
          );
        })
        .map(function (e) {
          return e.custom_code || e.language_to;
        }),
      t = [gt.language_from].concat(e);
    return (
      (yt = t.filter(function (e, n) {
        return t.indexOf(e) == n;
      })),
      e.length || z.log("No public language available.", { sendToDatadog: !1 }),
      yt
    );
  }
  Oe(
    "onCurrentLocationChanged",
    function () {
      _t = {};
    },
    !0
  ),
    Oe(
      "onCurrentLocationChanged",
      function () {
        yt = null;
      },
      !0
    );
  var Ct = [
    { codes: ["no"], pattern: /^(nn|nb)(-[a-z]+)?$/i },
    { codes: ["zh"], pattern: /^zh(-hans(-\w{2})?)?(-(cn|sg))?$/i },
    { codes: ["tw", "zh-TW"], pattern: /^zh-(hant)?-?(tw|hk|mo)?$/i },
    { codes: ["br"], pattern: /^pt-br$/i },
    { codes: ["fl"], pattern: /^fil$/i },
  ];
  function Et(e) {
    void 0 === e && (e = kt());
    for (var t = {}, n = {}, r = 0, a = e; r < a.length; r += 1) {
      var o = a[r],
        i = o.toLowerCase(),
        s = i.substring(0, 2);
      t[s] || (t[s] = []), t[s].push(i), (n[i] = o);
    }
    for (
      var c = 0, l = navigator.languages || [navigator.language];
      c < l.length;
      c += 1
    ) {
      var u = l[c],
        d = u.toLowerCase(),
        f = d.substring(0, 2);
      if (n[d]) return n[d];
      for (var g = 0, m = Ct; g < m.length; g += 1) {
        var p = m[g],
          h = p.codes,
          v = p.pattern,
          w = h.find(function (t) {
            return e.includes(t);
          });
        if (w && v.test(u)) return w;
      }
      if (t[f]) {
        if ("zh" === f) continue;
        var y = t[f].indexOf(f);
        return y >= 0 ? n[t[f][y]] : n[t[f].shift()];
      }
    }
  }
  var xt = {
    af: { name: "Afrikaans", flag: "za" },
    am: { name: "አማርኛ", flag: "et" },
    ar: { name: "العربية‏", flag: "sa" },
    az: { name: "Azərbaycan dili", flag: "az" },
    ba: { name: "башҡорт теле", flag: "ru" },
    be: { name: "Беларуская", flag: "by" },
    bg: { name: "Български", flag: "bg" },
    bn: { name: "বাংলা", flag: "bd" },
    br: { name: "Português Brasileiro", flag: "br" },
    bs: { name: "Bosanski", flag: "ba" },
    ca: { name: "Català", flag: "es-ca" },
    co: { name: "Corsu", flag: "fr-co" },
    cs: { name: "Čeština", flag: "cz" },
    cy: { name: "Cymraeg", flag: "gb-wls" },
    da: { name: "Dansk", flag: "dk" },
    de: { name: "Deutsch", flag: "de" },
    el: { name: "Ελληνικά", flag: "gr" },
    en: { name: "English", flag: "gb" },
    eo: { name: "Esperanto", flag: "eo" },
    es: { name: "Español", flag: "es" },
    et: { name: "Eesti", flag: "ee" },
    eu: { name: "Euskara", flag: "eus" },
    fa: { name: "فارسی", flag: "ir" },
    fi: { name: "Suomi", flag: "fi" },
    fj: { name: "Vosa Vakaviti", flag: "fj" },
    fl: { name: "Filipino", flag: "ph" },
    fr: { name: "Français", flag: "fr" },
    fy: { name: "frysk", flag: "nl" },
    ga: { name: "Gaeilge", flag: "ie" },
    gd: { name: "Gàidhlig", flag: "gb-sct" },
    gl: { name: "Galego", flag: "es-ga" },
    gu: { name: "ગુજરાતી", flag: "in" },
    ha: { name: "هَوُسَ", flag: "ne" },
    he: { name: "עברית", flag: "il" },
    hi: { name: "हिंदी", flag: "in" },
    hr: { name: "Hrvatski", flag: "hr" },
    ht: { name: "Kreyòl ayisyen", flag: "ht" },
    hu: { name: "Magyar", flag: "hu" },
    hw: { name: "‘Ōlelo Hawai‘i", flag: "hw" },
    hy: { name: "հայերեն", flag: "am" },
    id: { name: "Bahasa Indonesia", flag: "id" },
    ig: { name: "Igbo", flag: "ne" },
    is: { name: "Íslenska", flag: "is" },
    it: { name: "Italiano", flag: "it" },
    ja: { name: "日本語", flag: "jp" },
    jv: { name: "Wong Jawa", flag: "id" },
    ka: { name: "ქართული", flag: "ge" },
    kk: { name: "Қазақша", flag: "kz" },
    km: { name: "ភាសាខ្មែរ", flag: "kh" },
    kn: { name: "ಕನ್ನಡ", flag: "in" },
    ko: { name: "한국어", flag: "kr" },
    ku: { name: "كوردی", flag: "iq" },
    ky: { name: "кыргызча", flag: "kg" },
    la: { name: "Latine", flag: "it" },
    lb: { name: "Lëtzebuergesch", flag: "lu" },
    lo: { name: "ພາສາລາວ", flag: "la" },
    lt: { name: "Lietuvių", flag: "lt" },
    lv: { name: "Latviešu", flag: "lv" },
    lg: { name: "Oluganda", flag: "ug" },
    mg: { name: "Malagasy", flag: "mg" },
    mi: { name: "te reo Māori", flag: "nz" },
    mk: { name: "Македонски", flag: "mk" },
    ml: { name: "മലയാളം", flag: "in" },
    mn: { name: "Монгол", flag: "mn" },
    mr: { name: "मराठी", flag: "in" },
    ms: { name: "Bahasa Melayu", flag: "my" },
    mt: { name: "Malti", flag: "mt" },
    my: { name: "မျန္မာစာ", flag: "mm" },
    ne: { name: "नेपाली", flag: "np" },
    nl: { name: "Nederlands", flag: "nl" },
    no: { name: "Norsk", flag: "no" },
    ny: { name: "chiCheŵa", flag: "mw" },
    pa: { name: "ਪੰਜਾਬੀ", flag: "in" },
    pl: { name: "Polski", flag: "pl" },
    ps: { name: "پښت", flag: "af" },
    pt: { name: "Português", flag: "pt" },
    ro: { name: "Română", flag: "ro" },
    ru: { name: "Русский", flag: "ru" },
    sd: { name: '"سنڌي، سندھی, सिन्धी"', flag: "pk" },
    si: { name: "සිංහල", flag: "lk" },
    sk: { name: "Slovenčina", flag: "sk" },
    sl: { name: "Slovenščina", flag: "si" },
    sm: { name: '"gagana fa\'a Samoa"', flag: "ws" },
    sn: { name: "chiShona", flag: "zw" },
    so: { name: "Soomaaliga", flag: "so" },
    sq: { name: "Shqip", flag: "al" },
    sr: { name: "Српски", flag: "rs" },
    st: { name: "seSotho", flag: "ng" },
    su: { name: "Sundanese", flag: "sd" },
    sv: { name: "Svenska", flag: "se" },
    sw: { name: "Kiswahili", flag: "ke" },
    ta: { name: "தமிழ்", flag: "in" },
    te: { name: "తెలుగు", flag: "in" },
    tg: { name: "Тоҷикӣ", flag: "tj" },
    th: { name: "ภาษาไทย", flag: "th" },
    tl: { name: "Tagalog", flag: "ph" },
    to: { name: "faka-Tonga", flag: "to" },
    tr: { name: "Türkçe", flag: "tr" },
    tt: { name: "Tatar", flag: "tr" },
    tw: { name: "中文 (繁體)", flag: "tw" },
    ty: { name: '"te reo Tahiti, te reo Māʼohi"', flag: "pf" },
    uk: { name: "Українська", flag: "ua" },
    ur: { name: "اردو", flag: "pk" },
    uz: { name: '"O\'zbek"', flag: "uz" },
    vi: { name: "Tiếng Việt", flag: "vn" },
    xh: { name: "isiXhosa", flag: "za" },
    yi: { name: "ייִדיש", flag: "il" },
    yo: { name: "Yorùbá", flag: "ng" },
    zh: { name: "中文 (简体)", flag: "cn" },
    zu: { name: "isiZulu", flag: "za" },
    hm: { name: "Hmoob", flag: "hmn" },
    cb: { name: "Sugbuanon", flag: "ph" },
    or: { name: "ଓଡ଼ିଆ", flag: "in" },
    tk: { name: "Türkmen", flag: "tr" },
    ug: { name: "ئۇيغۇر", flag: "uig" },
    fc: { name: "Français (Canada)", flag: "ca" },
    as: { name: "অসমীয়া", flag: "in" },
    sa: { name: "Srpski", flag: "rs" },
  };
  function St(e) {
    if (!e || !e.toLowerCase) return "Unknown";
    var t = e.toLowerCase(),
      n = gt.languages.find(function (e) {
        var n = e.language_to,
          r = e.custom_code;
        return n === t || (r ? r.toLowerCase() === t : void 0);
      });
    return n && n.custom_local_name
      ? n.custom_local_name
      : n && n.custom_name
      ? n.custom_name
      : t === gt.language_from && gt.language_from_custom_name
      ? gt.language_from_custom_name
      : xt[t].name;
  }
  function Lt() {
    var e = He().getItem(U);
    if (e && kt().includes(e)) return e;
  }
  var At = function (e) {
      return e && He().setItem(U, e);
    },
    Nt = [
      {
        condition: [{ type: "TECHNOLOGY_ID", payload: 2 }],
        value: [
          {
            original: "^/checkouts/(?:[\\w]{32})(/.*)?$",
            formatted: "/checkouts$1",
          },
          {
            original: "^/account/(orders|activate)/(?:[\\w]{32})$",
            formatted: "/account/$1/",
          },
          { original: "^/orders/(?:[\\w]{32})$", formatted: "/orders/" },
          {
            original: "^/wallets/checkouts/(?:.*)$",
            formatted: "/wallets/checkouts/",
          },
          { original: "^/(.+)\\.(json|xml)$", formatted: "/$1" },
        ],
      },
    ],
    Ot = !1,
    Tt = {},
    jt = {},
    It = He({ type: "local" });
  if (It.getItem(J))
    try {
      (Tt = JSON.parse(It.getItem(J))),
        Object.keys(Tt).forEach(function (e) {
          Object.keys(Tt[e]).forEach(function (t) {
            if (2 === t.length) {
              jt[t] || (jt[t] = {});
              var n = Tt[e][t];
              jt[t][n] = e;
            }
          });
        }),
        (Ot = !0);
    } catch (e) {
      Ot = !0;
    }
  function Dt(e) {
    return Tt[e];
  }
  function Rt(e, t, n, r) {
    var a,
      o = Dt(e);
    o
      ? ((o[r] = n), (o.createdTime = new Date().getTime()), (o.t = t))
      : (Tt[e] =
          (((a = {})[r] = n),
          (a.createdTime = new Date().getTime()),
          (a.t = t),
          a)),
      jt[r] || (jt[r] = {}),
      (jt[r][n] = e),
      gt.cache && be(Pt)();
  }
  var Pt = function () {
    return Tt && It.setItem(J, JSON.stringify(Tt));
  };
  var Mt,
    qt,
    Wt,
    zt = [];
  function Bt(e, t) {
    void 0 === e && (e = document.documentElement);
    var n = ze();
    return k(e)
      .filter(function (e) {
        return (t || Ut)(e);
      })
      .map(
        (function (e) {
          return function (t) {
            var n = t.element,
              r = t.words,
              a = t.type,
              o = t.properties,
              i = t.attrSetter;
            n.weglot || (n.weglot = { content: [] });
            var s,
              c,
              l = n.weglot,
              u = {},
              d = ((s = r), !!jt[(c = e)] && jt[c][s]);
            if ((d && ((u[e] = r), (r = d)), o)) {
              var f = l.content.find(function (e) {
                return e.html;
              });
              f
                ? Object.assign(f, {
                    original: r,
                    properties: o,
                    translations: u,
                  })
                : l.content.push({
                    html: !0,
                    original: r,
                    type: a,
                    properties: o,
                    translations: u,
                  });
            }
            if (i) {
              var g = l.content.find(function (e) {
                  return e.attrSetter === i;
                }),
                m = { attrSetter: i, original: r, type: a, translations: u };
              g ? Object.assign(g, m) : l.content.push(m);
            }
            return n;
          };
        })(n)
      );
  }
  function Ut(e) {
    var t = e.element,
      n = e.words;
    return (
      !t.weglot ||
      !t.weglot.content ||
      !t.weglot.content.some(function (e) {
        var t = e.original,
          r = e.translations;
        return t === n || Yn(r).includes(pe(n));
      })
    );
  }
  function Ft(e) {
    for (var t = [], n = 0, r = e; n < r.length; n += 1) {
      var a = r[n];
      -1 === zt.indexOf(a) && t.push(a);
    }
    return [].push.apply(zt, t), t;
  }
  function Ht(e) {
    void 0 === e && (e = zt);
    for (var t = [], n = {}, r = 0, a = e; r < a.length; r += 1)
      for (var o = 0, i = a[r].weglot.content; o < i.length; o += 1) {
        var s = i[o],
          c = s.original,
          l = s.type;
        n[c] || ((n[c] = !0), t.push({ t: l, w: c }));
      }
    return t;
  }
  function $t(e, t, n) {
    if (
      (void 0 === t && (t = ze()),
      void 0 === n && (n = zt),
      e && e.to_words && e.to_words.length)
    )
      for (
        var r = e.from_words, a = e.to_words, o = 0, i = n;
        o < i.length;
        o += 1
      )
        for (var s = 0, c = i[o].weglot.content || {}; s < c.length; s += 1) {
          var l = c[s],
            u = l.original,
            d = l.translations,
            f = r.indexOf(pe(u));
          -1 !== f &&
            (d[t] ||
              (d[t] =
                (g = a[f]) &&
                g.replace &&
                g.replace(/wg-(\d+)=""(\s*)\/(\s*)>/g, 'wg-$1="">')));
        }
    var g;
    try {
      O(n, t);
    } catch (e) {
      z.error(e);
    }
  }
  function Gt(e, t) {
    var n;
    void 0 === t && (t = { cdn: !1, search: !1 });
    var r = e.l_to,
      a = e.words;
    e.l_to = wt(r);
    var o,
      i = a;
    if (location.hostname !== $) {
      if (
        ((n = (function (e, t) {
          var n = [],
            r = [],
            a = [];
          return (
            e.forEach(function (e) {
              var o = Dt(e.w);
              o && o[t] ? (n.push(o[t]), r.push(pe(e.w))) : a.push(e);
            }),
            { cachedWords: { to_words: n, from_words: r }, newWords: a }
          );
        })(a, r)),
        (i = n.newWords),
        (o = n.cachedWords).to_words.length && !t.search)
      ) {
        if (!i.length) return Promise.resolve(o);
        $t(o, r, t.nodes);
      }
      Ot &&
        [].push.apply(
          i,
          (function () {
            Ot = !1;
            var e = new Date().getTime();
            return Object.keys(Tt)
              .filter(function (t) {
                return Tt[t].createdTime + 216e5 < e;
              })
              .map(function (e) {
                return { t: Tt[e].t, w: e };
              });
          })()
        );
    }
    return i.length
      ? ((e.words = i),
        (e.request_url = (function () {
          var e = (function () {
            if (window.location.hostname === $) return new URL(Ie.url);
            var e = gt.technology_name,
              t = gt.injectedData;
            if (e === Z) return new URL(window.location.href);
            if (t && t.originalCanonicalUrl)
              try {
                return new URL(t.originalCanonicalUrl);
              } catch (e) {}
            var n = document.querySelector("link[rel='canonical'][href]");
            if (n)
              try {
                return new URL(n.href);
              } catch (e) {}
            return new URL(window.location.href);
          })();
          e.pathname =
            ((t = e.pathname),
            t
              .split("/")
              .filter(function (e) {
                return !e || isNaN(Number(e));
              })
              .join("/"));
          var t;
          for (
            var n = 0,
              r = Nt.filter(function (e) {
                return e.condition.some(function (e) {
                  var t = e.type,
                    n = e.payload;
                  return "TECHNOLOGY_ID" === t && n === gt.technology_id;
                });
              });
            n < r.length;
            n += 1
          ) {
            var a = r[n].value;
            try {
              for (var o = 0, i = a; o < i.length; o += 1) {
                var s = i[o],
                  c = s.original,
                  l = s.formatted,
                  u = e.pathname.replace(new RegExp(c), l);
                if (u !== e.pathname) return (e.pathname = u), e.toString();
              }
            } catch (e) {
              z.warn(e, { consoleOverride: "Invalid URL regex, " + e.stack });
            }
          }
          return e.toString();
        })()),
        (function (e) {
          var t = (gt.versions && gt.versions.translation) || 1,
            n = ["api_key=" + gt.api_key, "v=" + t],
            r =
              "https://" +
              (gt.bypass_cdn_api ? G : "cdn-api-weglot.com") +
              "/translate?" +
              n.join("&");
          return fetch(r, { method: "POST", body: Jt(JSON.stringify(e)) })
            .then(Yt)
            .then(function (e) {
              return e.json();
            })
            .then(function (e) {
              if (!e || !e.to_words)
                throw (
                  (z.warn(e),
                  Error("An error occurred, please try again later"))
                );
              return e;
            });
        })(e).then(function (e) {
          return (
            i.forEach(function (t, n) {
              var a = e.to_words[n];
              Rt(t.w, t.t, a, r);
            }),
            e
          );
        }))
      : t.search && o
      ? Promise.resolve(o)
      : Promise.resolve({ to_words: [], from_words: [] });
  }
  function Jt(e) {
    return e.replace(/[\u007F-\uFFFF]/g, function (e) {
      return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).substr(-4);
    });
  }
  function Yt(e) {
    if (400 === e.status) {
      console.log(e);
      throw Error("You Weglot limitation. Please upgrade your plan.");
    }

    if (401 === e.status) throw Error("Your Weglot API key seems wrong.");
    if (e.status >= 402) throw Error(e.statusText);
    return e;
  }
  function Vt(e, t, n) {
    void 0 === n && (n = {});
    n = Object.assign({}, { title: !0, cdn: !1, search: !1 }, n);
    var r = { l_from: gt.language_from, l_to: t, words: e };
    return n.title && (r.title = document.title), Gt(r, n);
  }
  function Kt(e, t) {
    if ("string" != typeof e || "function" != typeof t) return !1;
    var n = ze();
    return n === gt.language_from
      ? (t(e), !1)
      : (Gt(
          { l_from: n, l_to: gt.language_from, words: [{ t: 2, w: e }] },
          { cdn: !0, search: !0 }
        )
          .then(function (e) {
            return e.to_words[0].toLowerCase().trim();
          })
          .then(t),
        !0);
  }
  function Qt(e) {
    return (
      "a[href='#Weglot-" +
      e +
      "'],a[href*='change-language.weglot.com/" +
      e +
      "']"
    );
  }
  var Xt = 0,
    Zt = [];
  function en(e, t) {
    if ((void 0 === t && (t = document.documentElement), e && !e.ready)) {
      var n = e.style || e.button_style,
        r = Fn(!1, n);
      if (
        ((r.weglotSwitcher = e), Zt.push(r), !e.location || !e.location.target)
      )
        return (
          r.classList.add("wg-default"),
          document.body.appendChild(r),
          (e.ready = !0),
          r
        );
      var a = de(t, e.location.target);
      if (a) {
        if (
          (r.setAttribute("data-switcher-id", String(++Xt)),
          (r.id = "weglot-switcher-" + Xt),
          r.setAttribute("data-switcher-style-opt", JSON.stringify(n)),
          e.location.sibling)
        ) {
          var o = de(t, e.location.sibling);
          try {
            a.insertBefore(r, o);
          } catch (e) {
            a.contains(o) ||
              z.warn(
                "Switcher could not be added. The provided sibling is not a child of the target element.",
                { sendToDatadog: !1 }
              );
          }
        } else a.insertBefore(r, null);
        e.ready = !0;
        for (
          var i = 0, s = t.querySelectorAll(".weglot-container:empty");
          i < s.length;
          i += 1
        ) {
          me(s[i]);
        }
        return r;
      }
    }
  }
  function tn() {
    Mt || Te("switchersReady", ze()),
      (Mt = !0),
      clearTimeout(Wt),
      qt && qt.parentNode.removeChild(qt);
  }
  function nn(e) {
    if (
      (void 0 === e && (e = document), !(kt().length < 2 || gt.hide_switcher))
    ) {
      var t = e.isConnected ? e : document;
      (function (e) {
        if (
          (void 0 === e && (e = document.body),
          0 !==
            ue(e, 'a[href^="#Weglot-"],a[href*="change-language.weglot.com/"]')
              .length)
        ) {
          for (
            var t = kt(),
              n = ze(),
              r = !1,
              a = [],
              o = function () {
                var t = s[i],
                  o = ue(e, Qt(t));
                if (0 !== o.length) {
                  r = !0;
                  for (
                    var c = function () {
                        var e = u[l];
                        e.setAttribute(H, ""),
                          e.classList.add("weglot-link", "weglot-link-" + t),
                          t === n && e.classList.add("weglot-link--active"),
                          Ze(t, function (t) {
                            return e.setAttribute("href", t);
                          }),
                          e.addEventListener("click", function (e) {
                            e.preventDefault(), e.stopPropagation(), Tn(t);
                          });
                      },
                      l = 0,
                      u = o;
                    l < u.length;
                    l += 1
                  )
                    c();
                  a.push({ language: t, links: o });
                }
              },
              i = 0,
              s = t;
            i < s.length;
            i += 1
          )
            o();
          return (
            Oe(
              "languageChanged",
              function (e) {
                for (var t = 0, n = a; t < n.length; t += 1) {
                  var r = n[t],
                    o = r.language,
                    i = r.links;
                  if (o === e)
                    for (var s = 0, c = i; s < c.length; s += 1)
                      c[s].classList.add("weglot-link--active");
                  else
                    for (var l = 0, u = i; l < u.length; l += 1)
                      u[l].classList.remove("weglot-link--active");
                }
              },
              !0
            ),
            r
          );
        }
      })(t) && tn();
      var n = t.querySelectorAll(
        "#weglot_here:not(.weglot-container),.weglot_here:not(.weglot-container)"
      );
      if (n.length) {
        for (var r = 0, a = n; r < a.length; r += 1) {
          var o = a[r];
          o.parentNode.insertBefore(Fn(!1, gt.button_style, !0), o), me(o);
        }
        tn();
      }
      if (
        (gt.switchers &&
          gt.switchers.filter(function (e) {
            return !e.default && en(e, t);
          }).length &&
          tn(),
        !Mt && !qt)
      ) {
        var i =
          gt.switchers.find(function (e) {
            return e.default;
          }) || gt.button_style;
        Wt = setTimeout(function () {
          (qt = en(i)), Te("switchersReady", ze());
        });
      }
    }
  }
  Oe(
    "onCurrentLocationChanged",
    function () {
      Zt.forEach(function (e) {
        return e.parentNode && e.parentNode.removeChild(e);
      }),
        Zt.splice(0),
        (Mt = null),
        (qt = null),
        (Xt = 0),
        (gt.button_style.ready = !1),
        gt.switchers.map(function (e) {
          return (e.ready = !1);
        }),
        nn();
    },
    !0
  );
  var rn = 0;
  function an() {
    var e = ["name", "value"];
    gt.translate_event.forEach(function (t) {
      for (
        var n = ue(document.body, t.selector),
          r = function () {
            var n = o[a];
            if (n.alreadyListeningEventInput)
              return (
                !n.alreadyListeningEventInput.isConnected &&
                  rn < 10 &&
                  (rn++,
                  n.parentNode.insertBefore(
                    n.alreadyListeningEventInput,
                    n.nextSibling
                  )),
                {}
              );
            var r = n.cloneNode(!0);
            if (!r) return {};
            (r.name = ""),
              (n.alreadyListeningEventInput = r),
              n.parentNode.insertBefore(r, n.nextSibling),
              (n.style.display = "none"),
              new MutationObserver(function (t) {
                for (var a = 0, o = t; a < o.length; a += 1) {
                  var i = o[a],
                    s = n.getAttribute(i.attributeName);
                  e.includes(i.attributeName) &&
                    r.setAttribute(i.attributeName, s);
                }
              }).observe(n, { attributes: !0 });
            var i = be(function (e) {
              13 === e.keyCode && e.target.form
                ? e.target.form.dispatchEvent(new Event("submit"))
                : Kt(e.target.value, function (e) {
                    Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      "value"
                    ).set.call(n, e);
                    var r =
                        t.eventName ||
                        n.getAttribute("data-wg-translate-event"),
                      a = document.createEvent("HTMLEvents");
                    a.initEvent("focus", !0, !1),
                      n.dispatchEvent(a),
                      a.initEvent(r, !0, !1),
                      n.dispatchEvent(a);
                  });
            }, 400);
            r.addEventListener("keydown", i);
          },
          a = 0,
          o = n;
        a < o.length;
        a += 1
      ) {
        var i = r();
        if (i) return i.v;
      }
    });
  }
  try {
    var on = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (e) {
      var t = on.call(this, e);
      return sn([this]), t;
    };
  } catch (e) {}
  function sn(e) {
    e ||
      (e = ue(
        document,
        gt.dynamics
          .map(function (e) {
            return e.value;
          })
          .join(",")
      ));
    for (var t = 0, n = e; t < n.length; t += 1) {
      var r = n[t];
      if (r.shadowRoot && !r.shadowRoot.wgTranslated) {
        (r.shadowRoot.wgTranslated = !0), wn(r.shadowRoot);
        var a = Bt(r.shadowRoot);
        a.length && (Ft(a), bn(a));
      }
    }
  }
  var cn,
    ln = null,
    un = [],
    dn = [],
    fn = [H, "class", "id"],
    gn = [],
    mn = [];
  function pn(e, t) {
    cn && clearTimeout(cn);
    for (var n = 0, r = t; n < r.length; n += 1) {
      var a = r[n];
      1 === a.nodeType && un.push(a);
    }
    un.length &&
      (cn = setTimeout(function () {
        nn(e),
          an(),
          gt.subdomain &&
            (function (e) {
              var t = window.location.hostname;
              if (t === gt.host) return;
              for (var n = 0, r = e; n < r.length; n += 1)
                for (
                  var a = r[n], o = 0, i = ue(a, "[href]");
                  o < i.length;
                  o += 1
                ) {
                  var s = i[o];
                  if (!fe(s, "[data-wg-notranslate]")) {
                    var c = s.getAttribute("href");
                    c &&
                      c.includes("//" + gt.host) &&
                      s.setAttribute("href", c.replace(gt.host, t));
                  }
                }
            })(un),
          sn(un),
          xe("onDynamicDetected"),
          (un = []);
      }, 100));
  }
  function hn(e, t) {
    var n = gt.dynamics,
      r = yn;
    t !== document
      ? (r = function () {
          return !0;
        })
      : (n && 0 !== n.length) ||
        (r = function () {
          return !1;
        });
    try {
      if (bt()) return;
      if (
        ((e = (function (e, t) {
          var n = [],
            r = e.filter(function (e) {
              var r = e.addedNodes,
                a = e.type,
                o = e.target;
              "attributes" === a &&
                (function (e) {
                  "IMG" === e.nodeName &&
                    e.srcset &&
                    e.dataset.wgtranslated &&
                    (e.setAttribute("wgsrcset", e.srcset), (e.srcset = ""));
                })(o);
              var i = (function (e) {
                do {
                  if (e.weglot && e.weglot.setted) return e;
                  e = e.parentElement || e.parentNode;
                } while (e);
              })(o);
              return i
                ? (n.push(i), !1)
                : r.length
                ? (setTimeout(function () {
                    return pn(o, r);
                  }),
                  !ln || !o || !fe(o, ln))
                : !fn.includes(e.attributeName) &&
                  t(o) &&
                  ("characterData" === a || "attributes" === a);
            });
          if (n.length)
            for (var a = 0, o = n; a < o.length; a += 1) {
              o[a].weglot.setted = !1;
            }
          return r;
        })(e, r)),
        !n || 0 === n.length)
      )
        return;
      if (e.length)
        try {
          !(function (e, t, n) {
            void 0 === n && (n = !0);
            for (
              var r = [],
                a = function (e) {
                  var n = e.outerHTML || e.textContent;
                  if (e.wgParsed !== n) {
                    e.wgParsed = n;
                    for (
                      var a = Bt(e, function (e) {
                          var n = e.element;
                          return (
                            !(function (e) {
                              if (
                                gt.forceAllDynamics ||
                                (function (e) {
                                  var t = gt.dangerously_force_dynamic;
                                  if (!e || !t) return !1;
                                  if (e.closest) return fe(e, t);
                                  return fe(e.parentNode, t);
                                })(e)
                              )
                                return _n(e);
                              return -1 !== dn.indexOf(e) || _n(e);
                            })(n) && t(n)
                          );
                        }),
                        o = 0,
                        i = a;
                      o < i.length;
                      o += 1
                    ) {
                      var s = i[o];
                      (gt.ignoreDynamicFragments &&
                        !document.body.contains(s)) ||
                        (s.weglot.dynamic || (s.weglot.dynamic = 0),
                        s.weglot.dynamic++,
                        dn.push(s),
                        r.push(s));
                    }
                  }
                },
                o = [],
                i = 0,
                s = e;
              i < s.length;
              i += 1
            ) {
              var c = s[i],
                l = c.type,
                u = c.target,
                d = c.addedNodes;
              switch (l) {
                case "attributes":
                case "characterData":
                  if (o.includes(u)) break;
                  o.push(u), a(u);
                  break;
                case "childList":
                  var f = d.length > 1 ? u : d[0];
                  if (o.includes(f)) break;
                  if ((a(f), o.push(f), !n)) break;
                  for (var g = 0, m = d; g < m.length; g += 1) {
                    var p = m[g],
                      h = [];
                    "IFRAME" === p.tagName
                      ? (h = [p])
                      : p.querySelectorAll &&
                        (h = p.querySelectorAll("iframe"));
                    for (var v = 0; v < h.length; v++) {
                      var w = h[v];
                      t(w) &&
                        ke(w) &&
                        (a(w.contentWindow.document),
                        wn(w.contentWindow.document));
                    }
                  }
              }
            }
            r.length && (Ft(r), bn(r));
          })(e, r);
        } catch (e) {
          z.warn(e);
        }
    } catch (e) {
      z.warn(e, { consoleOverride: "Error in MutationObserver" });
    }
  }
  var vn = !1;
  function wn(e) {
    var t = e !== document ? e : e.body || e,
      n = new MutationObserver(function (t) {
        var n;
        if (vn) hn(t, e);
        else {
          var r = gn.find(function (t) {
            return t.documentElement === e;
          });
          r
            ? (n = r.mutations).push.apply(n, t)
            : gn.push({ documentElement: e, mutations: [].concat(t) });
        }
      });
    n.observe(t, {
      childList: !0,
      subtree: !0,
      characterData: !0,
      attributes: !0,
    }),
      mn.push(n);
  }
  function yn(e) {
    return (
      !(!gt.dynamics || 0 === gt.dynamics.length) &&
      ((e && e.closest) || (e = e.parentNode),
      e &&
        e.closest &&
        fe(
          e,
          gt.dynamics
            .map(function (e) {
              return e.value;
            })
            .join(", ")
        ))
    );
  }
  function _n(e) {
    return e.weglot && e.weglot.dynamic > 1e3;
  }
  function bn(e) {
    var t = ze();
    if (t !== gt.language_from)
      return Vt(Ht(e), t, { title: !1, cdn: !0, nodes: e }).then(function (n) {
        return $t(n, t, e);
      });
  }
  function kn(e) {
    var t,
      n,
      r = e.parentNode;
    if (r.previousSibling && r.previousSibling.firstChild) {
      var a = r.previousSibling.getAttribute("data-l"),
        o = r.previousSibling.firstChild.innerHTML,
        i = Array.from(r.previousSibling.classList).filter(function (e) {
          return e && ![a, "wgcurrent", "wg-li"].includes(e);
        });
      r.previousSibling.setAttribute("data-l", e.getAttribute("data-l")),
        (r.previousSibling.className = "wgcurrent wg-li"),
        (t = r.previousSibling.classList).add.apply(
          t,
          i.concat([e.getAttribute("data-l")])
        ),
        (r.previousSibling.firstChild.innerHTML = e.firstChild.innerHTML),
        e.setAttribute("data-l", a),
        (e.className = "wg-li"),
        (n = e.classList).add.apply(n, i.concat([a])),
        e.setAttribute("id", "wg-" + a),
        (e.firstChild.innerHTML = o),
        e.firstChild.setAttribute("id", "weglot-language-" + a),
        e.firstChild.hasAttribute("aria-label") &&
          e.firstChild.setAttribute("aria-label", o);
    }
  }
  function Cn() {
    me(ge(F));
  }
  function En() {
    var e = ge("wg_progress").firstElementChild,
      t = e.getAttribute("aria-valuenow"),
      n = parseInt(t) + (4 * Math.random() + 2);
    n <= 100 &&
      (e.setAttribute("aria-valuenow", n.toString()),
      (e.style.width = n + "%"));
  }
  function xn(e) {
    clearInterval(e), me(ge("wg_progress"));
  }
  var Sn = [];
  function Ln(e) {
    if (e.data) {
      var t = e.data,
        n = t.message,
        r = t.payload;
      if (n) {
        if ("Weglot.iframe" === n) {
          var a = { message: "Weglot.setLanguage", payload: ze() };
          return e.source.postMessage(a, e.origin), void Sn.push(e.source);
        }
        "Weglot.setLanguage" !== n || Tn(r);
      }
    }
  }
  function An(e) {
    void 0 === e && (e = ze());
    for (
      var t = { message: "Weglot.setLanguage", payload: e }, n = 0, r = Sn;
      n < r.length;
      n += 1
    ) {
      var a = r[n];
      try {
        a.postMessage(t, "*");
      } catch (e) {
        console.warn(e);
      }
    }
  }
  function Nn() {
    try {
      if (window.frameElement || window.self !== window.top)
        return "with-window-top";
    } catch (e) {
      return "no-window-top";
    }
  }
  function On(e, t, n) {
    if (n || !e || window.top !== window || !In(e)) {
      var r = [];
      try {
        Ft((r = Bt()));
      } catch (e) {
        z.warn(e);
      }
      var a = bt();
      if (
        (e && t && !a && At(e),
        !gt.is_connect || gt.dynamicPushState || (!a && e !== gt.language_from)
          ? (function (e) {
              void 0 === e && (e = !0);
              var t = gt.excluded_blocks,
                n = gt.is_connect;
              if ((vn = e))
                if (
                  ((ln =
                    t &&
                    t.length &&
                    t
                      .map(function (e) {
                        return e.value;
                      })
                      .join(",")),
                  n && gn.length > 0)
                )
                  for (
                    var r = function () {
                        var e = o[a],
                          t = e.mutations,
                          n = e.documentElement,
                          r = function () {
                            var e = t.splice(0, 100);
                            e.length > 0 && (hn(e, n), setTimeout(r, 0));
                          };
                        r();
                      },
                      a = 0,
                      o = gn;
                    a < o.length;
                    a += 1
                  )
                    r();
                else gn = [];
            })()
          : (function () {
              if (0 !== mn.length) {
                for (var e = 0, t = mn; e < t.length; e += 1) t[e].disconnect();
                gn = [];
              }
            })(),
        n || a)
      )
        jn(e);
      else if (
        (gt.is_connect && !a && xe("onConnectPageLoad", e),
        gt.force_translation)
      ) {
        for (var o = [], i = 0, s = r; i < s.length; i += 1) {
          var c = s[i];
          ((c.closest && c.closest(gt.force_translation)) ||
            (!c.closest &&
              c.parentNode &&
              c.parentNode.closest &&
              c.parentNode.closest(gt.force_translation))) &&
            o.push(c);
        }
        bn(o);
      }
      (a && !a.language_button_displayed && a.allExcluded) || nn(),
        a ||
          (gt.remove_unused_link_hooks &&
            (function () {
              var e = kt(),
                t = gt.languages
                  .map(function (e) {
                    return e.custom_code || e.language_to;
                  })
                  .filter(function (t) {
                    return !e.includes(t);
                  });
              1 === e.length && t.push(gt.language_from);
              for (
                var n = t
                    .map(function (e) {
                      return Qt(e);
                    })
                    .join(","),
                  r = 0,
                  a = ue(document, n);
                r < a.length;
                r += 1
              )
                me(a[r]);
            })(),
          sn(),
          an(),
          (function () {
            window.addEventListener("message", Ln, !1);
            var e = gt.translate_iframes;
            if (e)
              for (var t = 0, n = ue(document.body, e); t < n.length; t += 1) {
                var r = n[t];
                r.contentWindow && Sn.push(r.contentWindow);
              }
            Ee("onPageLanguageSet", An),
              "with-window-top" === Nn() &&
                window.top.postMessage({ message: "Weglot.iframe" }, "*");
          })(),
          ["alert"].forEach(function (e) {
            var t = window[e];
            window[e] = function () {
              var e = arguments;
              if ("string" == typeof arguments[0]) {
                var n = ze();
                return gt.language_from === n
                  ? t.apply(window, arguments)
                  : Vt([{ t: 2, w: arguments[0] }], n, {
                      title: !1,
                      cdn: !0,
                    }).then(function (n) {
                      return (e[0] = n.to_words[0]), t.apply(window, e);
                    });
              }
            };
          })),
        Te("initialized", e);
    }
  }
  function Tn(e) {
    var t = ze();
    e !== t &&
      (window.location.host !== $
        ? jn(e, t)
        : Ze(e, function (n) {
            if ("#" === n) return jn(e, t);
            window.dispatchEvent(
              new CustomEvent("veLanguageChangeUrl", {
                detail: { targetUrl: n },
              })
            );
          }));
  }
  function jn(e, t) {
    if (!kt().includes(e))
      return (
        Cn(),
        void z.warn(e + " isn't a language you have added", {
          sendToDatadog: !1,
        })
      );
    gt.auto_switch && Un(e);
    var n = bt();
    if ((gt.is_connect || n || At(e), !In(e))) {
      if (gt.loading_bar)
        var r = (function () {
          try {
            var e = document.createElement("div");
            return (
              (e.className = "wg-progress"),
              (e.id = "wg_progress"),
              (e.innerHTML =
                '<div class="wg-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0"></div>'),
              document.body.appendChild(e),
              setInterval(En, 100)
            );
          } catch (e) {}
        })();
      if (
        ((function (e) {
          var t = he("lang");
          if (t && t !== e) {
            var n = window.location.search.replace("lang=" + t, "lang=" + e);
            try {
              window.history.replaceState(
                null,
                "",
                window.location.pathname + n
              );
            } catch (e) {}
          }
          De = e;
        })(e),
        (function (e) {
          for (
            var t = 0, n = document.getElementsByClassName("wg-li " + e);
            t < n.length;
            t += 1
          )
            kn(n[t]);
        })(e),
        bt())
      )
        return Cn(), void xn(r);
      if (e === gt.language_from)
        return (
          xe("onPageLanguageSet", e),
          Cn(),
          $t(null, e),
          gt.loading_bar && xn(r),
          document.documentElement.setAttribute("lang", e),
          void Te("languageChanged", e, t || "")
        );
      Vt(Ht(), e)
        .then(function (n) {
          Cn(),
            $t(n, e),
            document.documentElement.setAttribute("lang", e),
            Te("languageChanged", e, t || ""),
            gt.loading_bar && xn(r);
        })
        .catch(function (e) {
          throw (gt.loading_bar && xn(r), Cn(), He().removeItem(U), e);
        }),
        xe("onPageLanguageSet", e);
    }
  }
  function In(e) {
    return (
      !(!gt.is_connect || ze() === e) &&
      (gt.host &&
      !(function () {
        if (gt.subdirectory) return [gt.host, $];
        return gt.languages
          .map(function (e) {
            return (
              e.connect_host_destination && e.connect_host_destination.host
            );
          })
          .concat([gt.host, $]);
      })().includes(window.location.hostname)
        ? (Nn() ||
            z.warn(
              '"' +
                window.location.hostname +
                '" is not configured with Weglot. Please contact support@weglot.com',
              { sendToDatadog: !1 }
            ),
          !1)
        : (Ze(e, function (e) {
            return window.location.replace(e);
          }),
          !0))
    );
  }
  function Dn(e, t) {
    return t[e] ? t[e].flag : "";
  }
  function Rn(e) {
    return (function (e, t, n) {
      if (!e || !e.toLowerCase) return "";
      if (t.language_from === e) return t.language_from_custom_flag || Dn(e, n);
      var r = e.toLowerCase(),
        a = t.languages.find(function (e) {
          var t = e.language_to,
            n = e.custom_code;
          return t === r || (n && n.toLowerCase() === r);
        });
      return a ? a.custom_flag || Dn(a.language_to, n) : "";
    })(e, gt, xt);
  }
  Oe(
    "initialized",
    function () {
      gt.translate_search &&
        !gt.switcher_editor &&
        (function () {
          for (
            var e = gt.search_forms,
              t = gt.search_parameter,
              n = 0,
              r = ue(document, e);
            n < r.length;
            n += 1
          ) {
            var a = r[n];
            a.addEventListener("submit", function (e) {
              e.preventDefault();
              var n = e.target.elements[t].value;
              Kt(n, function (e) {
                Le.set("wg-search-form", n),
                  (a.elements[t].value = e),
                  a.submit();
              });
            });
            var o = void 0;
            -1 !== window.location.search.indexOf(t + "=") &&
              a.elements &&
              a.elements[t] &&
              (o = Le.get("wg-search-form")) &&
              (a.elements[t].value = o);
          }
          Le.erase("wg-search-form");
        })();
    },
    !0
  );
  var Pn = 13,
    Mn = 27,
    qn = 38,
    Wn = 40,
    zn = {
      rectangle_mat: { width: 30, height: 20 },
      shiny: { width: 30, height: 20 },
      circle: { width: 24, height: 24 },
      square: { width: 24, height: 24 },
    },
    Bn = function (e) {
      return !e.className.includes("closed");
    };
  function Un(e) {
    if (e === gt.language_from) {
      var t = new Date();
      t.setTime(t.getTime() + 2592e6),
        He({ type: "cookie" }).setItem("WG_CHOOSE_ORIGINAL", "1", {
          expires: t.toUTCString(),
        });
    } else He({ type: "cookie" }).removeItem("WG_CHOOSE_ORIGINAL");
  }
  function Fn(e, t, n) {
    var r;
    void 0 === e && (e = !1),
      void 0 === t && (t = gt.button_style),
      void 0 === n && (n = !1);
    var a = t.full_name;
    void 0 === a && (a = !0);
    var o = t.with_name;
    void 0 === o && (o = !0);
    var i = t.is_dropdown;
    void 0 === i && (i = !0);
    var s = t.flag_type;
    void 0 === s && (s = "shiny");
    var c = t.invert_flags;
    void 0 === c && (c = !0);
    var l = t.with_flags;
    void 0 === l && (l = !1);
    var u =
        /background-position/i.test(gt.button_style.custom_css) &&
        !gt.languages.some(function (e) {
          return e.custom_flag;
        }),
      d = s || "rectangle_mat",
      f = u ? ["flag-" + se.indexOf(d), "legacy"] : [],
      g = l ? ["wg-flags"].concat(f) : [],
      m = document.createElement("div");
    m.classList.add("weglot-container"),
      n && m.classList.add("weglot_here"),
      e && m.classList.add("weglot-default");
    var p = document.createElement("aside");
    p.setAttribute("data-wg-notranslate", ""),
      p.setAttribute("tabindex", "0"),
      p.setAttribute("aria-expanded", "false"),
      p.setAttribute("role", "listbox");
    var h = i ? "wg-drop" : "wg-list";
    (p.className = "weglot_switcher " + h + " country-selector closed"),
      gt.switcher_editor && (p.className += " wg-editor");
    var v,
      w = function () {
        var e = p.getBoundingClientRect().bottom;
        return void 0 === e && (e = 0), e > window.innerHeight / 2;
      },
      y = function () {
        var e;
        p.classList.remove("closed"),
          p.setAttribute("aria-expanded", "true"),
          w() &&
            !p.classList.contains("weg-openup") &&
            p.classList.add("weg-openup"),
          void 0 === (e = p.getBoundingClientRect().left) && (e = 0),
          e > window.innerWidth / 2 &&
            !p.classList.contains("weg-openleft") &&
            p.classList.add("weg-openleft");
      },
      _ = function () {
        p.classList.add("closed"),
          p.classList.remove("weg-openup", "weg-openleft"),
          p.setAttribute("aria-expanded", "false"),
          v && (v.classList.remove("focus"), (v = null));
      },
      b = function () {
        p.classList.contains("closed") ? y() : _(),
          L.focus(),
          v && v.classList.remove("focus"),
          (v = null);
      },
      k = function (e) {
        var t = St(e);
        p.setAttribute("aria-activedescendant", "weglot-language-" + e),
          p.setAttribute("aria-label", "Language selected: " + t);
      };
    p.addEventListener("click", function (e) {
      e.stopPropagation(), p.classList.add("wg-mouse-click"), b();
    }),
      p.addEventListener("keydown", function (e) {
        if (e.keyCode !== Pn) {
          if (e.keyCode === Wn || e.keyCode === qn)
            return e.preventDefault(), void N(e.keyCode);
          e.keyCode === Mn && Bn(p) && (e.preventDefault(), _(), p.focus());
        } else {
          if ((e.preventDefault(), v)) {
            var t = v.getAttribute("data-l");
            Tn(t), k(t), p.focus();
          }
          b();
        }
      });
    var C = ze(),
      E = document.createElement("a");
    if (
      (E.setAttribute("tabindex", -1),
      E.setAttribute("href", "#"),
      E.setAttribute("target", "_self"),
      E.setAttribute("role", "none"),
      E.setAttribute("id", "weglot-language-" + C),
      k(C),
      E.addEventListener("click", function (e) {
        e.preventDefault();
      }),
      Oe("languageChanged", function (e) {
        E.setAttribute("id", "weglot-language-" + e), k(e);
      }),
      l && !u)
    ) {
      var x = Hn(C, d);
      x && E.insertBefore(x, E.firstChild);
    }
    if (o) {
      var S = a ? St(C) : C.toUpperCase();
      E.appendChild(document.createTextNode(S));
    } else E.setAttribute("aria-label", St(C));
    var L = document.createElement("div");
    (i || (!i && c)) &&
      (L.setAttribute("data-l", C),
      (r = L.classList).add.apply(r, ["wgcurrent", "wg-li"].concat(g, [C])),
      L.appendChild(E));
    var A = document.createElement("ul");
    A.setAttribute("role", "none"),
      kt().forEach(function (e) {
        var t;
        if (e !== C || (!i && !c)) {
          var n = document.createElement("a");
          if (
            (n.setAttribute("id", "weglot-language-" + e),
            n.setAttribute("role", "option"),
            Ze(e, function (e) {
              return n.setAttribute("href", e);
            }),
            Oe(
              "onCurrentLocationChanged",
              function () {
                Ze(e, function (e) {
                  return n.setAttribute("href", e);
                });
              },
              !0
            ),
            (n.onclick = function (e) {
              e.preventDefault(),
                e.stopPropagation(),
                Tn(m.getAttribute("data-l")),
                b();
            }),
            l && !u)
          ) {
            var r = Hn(e, d);
            r && n.insertBefore(r, n.firstChild);
          }
          var s = St(e);
          if (o) {
            var f = a ? s : e.toUpperCase();
            n.appendChild(document.createTextNode(f));
          } else n.setAttribute("aria-label", St(C));
          var m = document.createElement("li");
          (t = m.classList).add.apply(t, ["wg-li", e].concat(g)),
            m.appendChild(n),
            m.setAttribute("data-l", e),
            m.setAttribute("role", "none"),
            (m.id = "wg-" + e),
            A.appendChild(m);
        }
      });
    var N = function (e) {
      var t = e === Wn ? "nextSibling" : "previousSibling",
        n = w();
      if (v && Bn(p))
        v[t]
          ? (v.classList.remove("focus"),
            (v = v[t]).classList.add("focus"),
            v.childNodes[0].focus(),
            v.scrollIntoView({ block: "center" }))
          : ((e === qn && !n) || (e === Wn && n)) && (_(), p.focus());
      else {
        var r = n ? "ul li.wg-li:last-child" : "ul li.wg-li";
        if (!(v = L.parentNode.querySelector(r))) return;
        v.classList.add("focus"),
          v.childNodes[0].focus(),
          v.scrollIntoView({ block: "center" });
        var a = (e === qn && n) || (e === Wn && !n);
        !Bn(p) && a && y();
      }
    };
    return p.appendChild(L), p.appendChild(A), m.appendChild(p), m;
  }
  function Hn(e, t) {
    var n = Rn(e);
    if (n) {
      var r = zn[t] || {},
        a = r.width,
        o = r.height,
        i = new Image(a, o);
      (i.onerror = function () {
        return i.parentNode.removeChild(i);
      }),
        0 === n.indexOf("http")
          ? (i.src = n)
          : (i.src = "https://cdn.weglot.com/flags/" + t + "/" + n + ".svg");
      var s = St(e);
      return (
        i.setAttribute("alt", s + " flag"),
        i.setAttribute("role", "none"),
        i.classList.add("wg-flag"),
        i
      );
    }
  }
  var $n,
    Gn,
    Jn,
    Yn = function (e) {
      return Object.keys(e).map(function (t) {
        return e[t];
      });
    },
    Vn = function () {
      var e = window.location,
        t = e.hostname,
        n = e.search.indexOf("no_redirect=true") > -1;
      if (
        !(
          !gt.auto_switch ||
          gt.subdirectory ||
          n ||
          He({ type: "cookie" }).getItem("WG_CHOOSE_ORIGINAL") ||
          we() ||
          t === $
        )
      ) {
        var r = Et();
        return r && !bt(r)
          ? r
          : gt.auto_switch_fallback && !bt(gt.auto_switch_fallback)
          ? gt.auto_switch_fallback
          : void 0;
      }
      n && Un(ze());
    },
    Kn = function (e) {
      var t = gt.api_key;
      return fetch("https://cdn-api.weglot.com/pageviews?api_key=" + t, {
        method: "POST",
        body: JSON.stringify({
          url: e || Ie.url,
          language: ze(),
          browser_language: navigator.language,
        }),
      });
    },
    Qn = !1;
  function Xn() {
    window.addEventListener("message", tr, !1);
    var e = document.createElement("meta");
    (e.name = "google"),
      (e.content = "notranslate"),
      document.head && document.head.appendChild(e);
    document.documentElement &&
      -1 ===
        ["cms.e.jimdo.com", "proxy.weglot.com"].indexOf(window.location.host) &&
      document.documentElement.setAttribute("translate", "no");
    var t = document.head.querySelector("link[href*=weglot_shopify]");
    t && document.head.removeChild(t);
  }
  function Zn() {
    if (gt.api_key) {
      z.initialize(!gt.remove_logging),
        Oe(
          "initialized",
          function () {
            gt.page_views_enabled &&
              (gt.is_connect
                ? Ze(gt.language_from, function (e) {
                    return Kn(e);
                  })
                : Kn());
          },
          !0
        );
      try {
        W(document, gt);
      } catch (e) {
        z.error(e);
      }
      if ((xe("onWeglotSetup"), !nr.initialized || window.Turbolinks)) {
        (Gn = (function () {
          var e = kt();
          if (gt.is_connect) {
            var t =
              document.documentElement.dataset.wgTranslated ||
              (gt.subdirectory ? We() : qe());
            if (t !== gt.language_from) return t;
            var n = Vn();
            return t === gt.language_from && n && e.includes(n)
              ? n
              : gt.language_from;
          }
          var r = he("lang");
          if (r && e.includes(r)) return (Qn = !0), r;
          var a = Lt();
          if (a && e.includes(a)) return a;
          var o = Vn();
          if (o && e.includes(o)) return (Qn = !0), o;
          return gt.language_from;
        })()),
          ze();
        var e = bt();
        if (
          ((Jn =
            Gn &&
            Gn !== gt.language_from &&
            document.documentElement.dataset.wgTranslated !== Gn &&
            !e &&
            !document.documentElement.dataset.wgExcludedUrl &&
            !gt.switcher_editor) && gt.wait_transition
            ? ve(
                "@keyframes wg{from{color:transparent;}to{color:transparent;}}body *{color:transparent!important;animation:1s linear infinite wg!important;}",
                F
              )
            : Cn(),
          gt.delayStart)
        )
          return Oe(
            "start",
            function () {
              return er();
            },
            !0
          );
        "loading" === document.readyState
          ? document.addEventListener("DOMContentLoaded", function () {
              return er();
            })
          : er();
      }
    }
  }
  function er() {
    if (
      !document.querySelector("#has-script-tags") ||
      (document.querySelector("#has-script-tags") &&
        (document.head.innerHTML.indexOf("weglot_script_tag") > 0 ||
          document.documentElement.innerHTML.indexOf("weglot_script_tag") > 0))
    )
      try {
        On(Gn, Qn, Jn);
      } catch (e) {
        Cn(),
          z.error(e, {
            consoleOverride: "There has been an error initializing, " + e.stack,
          });
      }
    else Cn();
    ($n = !1), (nr.initialized = !0);
  }
  function tr(e) {
    if (e.data)
      try {
        var t = JSON.parse(e.data);
        switch (t.message) {
          case "Weglot.detect":
            e.source.postMessage(
              JSON.stringify({
                message: "Weglot.ready",
                data: { initialized: nr.initialized, options: gt },
              }),
              e.origin
            );
            break;
          case "Weglot.switchTo":
            Tn(t.language);
        }
      } catch (e) {}
  }
  var nr = window.Weglot || {
    initialized: !1,
    options: gt,
    dynamic: "",
    switchTo: Tn,
    setup: function (e) {
      Xn(),
        $n ||
          (($n = !0),
          Ne(vt(), "polyfillReady", function () {
            ut(e)
              .then(function () {
                return Zn();
              })
              .catch(function () {
                z.warn(
                  "Your setup is deprecated, please save settings in your dashboard to hide this message."
                );
                var t = e.api_key;
                (e.translation_engine = t && t.length >= 36 ? 2 : 1),
                  (function (e) {
                    try {
                      var t = [
                        "api_key",
                        "originalLanguage",
                        "destinationLanguages",
                      ];
                      if (
                        !e ||
                        t.some(function (t) {
                          return !e[t];
                        })
                      )
                        throw {
                          wgErrMsg:
                            "You have to provide at least: " + t.join(", "),
                        };
                      ft(st(e));
                    } catch (e) {
                      throw new Error(
                        (e && e.wgErrMsg) ||
                          "Error while reading Weglot options"
                      );
                    }
                  })(e),
                  Zn();
              });
          }));
    },
    initialize: function (e) {
      Xn(),
        $n ||
          (($n = !0),
          Ne(vt(), "polyfillReady", function () {
            ut(e).then(function () {
              return Zn();
            });
          }));
    },
    on: function (e, t) {
      return Oe(e, t, !1);
    },
    off: function (e, t) {
      var n,
        r = !1,
        a = function (t) {
          return Ae[t].name === e && !Ae[t].internal;
        };
      n =
        "function" == typeof t
          ? function (e) {
              return a(e) && Ae[e].callback === t;
            }
          : function (e) {
              return a(e);
            };
      for (var o = Ae.length - 1; o >= 0; o--)
        n(o) && (Ae.splice(o, 1), (r = !0));
      return r;
    },
    getStoredLang: Lt,
    getLanguageName: St,
    getCurrentLang: ze,
    polyReady: ht,
    getCache: function () {
      return Tt;
    },
    addNodes: function (e) {
      var t = Bt(e);
      return Ft(t), bn(t);
    },
    search: Kt,
    translate: function (e, t) {
      void 0 === e && (e = {});
      var n = e.words,
        r = e.languageTo;
      if (
        (void 0 === r && (r = ze()),
        !Array.isArray(n) || "object" != typeof n[0])
      ) {
        var a = "Weglot.translate: 1st arg must be an array of objects";
        return (
          z.error(a, { sendToDatadog: !1 }), t && t(null, a), Promise.reject()
        );
      }
      return r === gt.language_from
        ? (t &&
            t(
              n.map(function (e) {
                return e.w;
              })
            ),
          Promise.resolve(
            n.map(function (e) {
              return e.w;
            })
          ))
        : new Promise(function (e, a) {
            Vt(n, r, { title: !1, cdn: !0 })
              .then(function (n) {
                if (!n || !n.to_words) throw n;
                t && t(n.to_words), e(n.to_words);
              })
              .catch(function (e) {
                a(e), t && t(null, e);
              });
          });
    },
    getBestAvailableLanguage: Et,
  };
  return (
    Ne(vt(), "polyfillReady", function () {
      wn(document);
      var e = function (e) {
          return (
            e &&
            e.src &&
            ce.find(function (t) {
              return t.test(e.src);
            })
          );
        },
        t =
          document.currentScript ||
          [].concat(document.scripts).find(function (t) {
            return e(t);
          }),
        n = t && e(t);
      if (n) {
        var r = n.exec(t.src).groups.api_key;
        r && 0 === r.indexOf("wg_") && nr.initialize({ api_key: r });
      }
    }),
    nr
  );
})();
