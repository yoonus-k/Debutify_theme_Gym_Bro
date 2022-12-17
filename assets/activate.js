 !(async function () {
  document.dispatchEvent(new CustomEvent("dbtfy:loading"));
  try {
    var n;
    let t = {},
      e = [];
    const a = await fetch("/search?view=addons");
    a.ok &&
      ((n = await a.json().then((t) => t.addons)),
      (e = Object.keys(n).reduce(
        (t, e) =>
          !0 === n[e]
            ? [...t, { name: e, class: e.replace("dbtfy_", "dbtfy-") }]
            : t,
        []
      )),
      (t = { ...t, enabledAddons: e }));
    const d = [...document.querySelectorAll(".dbtfy")],
      c = e.map((t) => t.class);
    c.length &&
      d.length &&
      d
        .filter((e) => !c.some((t) => e.classList.contains(t)))
        .forEach((t) => {
          t.remove();
        }),
      document.dispatchEvent(new CustomEvent("dbtfy:loaded", { detail: t }));
      console.log("fitched");
      
  } catch (t) {
    document.dispatchEvent(new CustomEvent("dbtfy:failed"));
    console.log(t);
  }
})();