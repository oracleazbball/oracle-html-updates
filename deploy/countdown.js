// Season tip-off countdown. Usage: <div data-countdown></div> (add data-size="sm" for compact).
// First game: Nov 18, 2026, 5:30 PM Arizona time (MST, UTC-7, no DST).
(function () {
  var TARGET = new Date("2026-11-18T17:30:00-07:00").getTime();
  var UNITS = [["Days", 86400], ["Hrs", 3600], ["Min", 60], ["Sec", 1]];

  function build(el) {
    var sm = el.getAttribute("data-size") === "sm";
    var label = el.getAttribute("data-label") || "Season tips off in";
    el.innerHTML = "";
    el.style.cssText += ";display:flex;flex-direction:column;align-items:" + (el.getAttribute("data-align") === "left" ? "flex-start" : "center") + ";gap:" + (sm ? "8px" : "12px") + ";";
    var lbl = document.createElement("div");
    lbl.textContent = label;
    lbl.style.cssText = "font-family:var(--font-condensed,'Barlow Condensed',sans-serif);font-size:" + (sm ? "12px" : "14px") + ";letter-spacing:3px;text-transform:uppercase;color:var(--purple-bright,#8b2fff);";
    var row = document.createElement("div");
    row.style.cssText = "display:flex;gap:" + (sm ? "6px" : "10px") + ";";
    var cells = UNITS.map(function (u) {
      var box = document.createElement("div");
      box.style.cssText = "display:flex;flex-direction:column;align-items:center;min-width:" + (sm ? "52px" : "72px") + ";padding:" + (sm ? "8px 6px" : "12px 8px") + ";background:var(--black-card,#111);border:1px solid rgba(106,15,214,0.35);";
      var num = document.createElement("div");
      num.style.cssText = "font-family:var(--font-display,'Cinzel',serif);font-weight:800;font-size:" + (sm ? "22px" : "34px") + ";line-height:1;color:var(--white,#fff);font-variant-numeric:tabular-nums;";
      var cap = document.createElement("div");
      cap.textContent = u[0];
      cap.style.cssText = "margin-top:6px;font-family:var(--font-condensed,'Barlow Condensed',sans-serif);font-size:" + (sm ? "10px" : "12px") + ";letter-spacing:2px;text-transform:uppercase;color:var(--text-muted,#999);";
      box.appendChild(num); box.appendChild(cap); row.appendChild(box);
      return num;
    });
    var sub = document.createElement("div");
    sub.textContent = el.getAttribute("data-sub") || "Nov 18 · 5:30 PM AZ";
    sub.style.cssText = "font-size:" + (sm ? "12px" : "13px") + ";color:var(--text-muted,#999);letter-spacing:1px;";
    el.appendChild(lbl); el.appendChild(row); el.appendChild(sub);
    return { el: el, lbl: lbl, row: row, sub: sub, cells: cells };
  }

  function tick(c) {
    var s = Math.max(0, Math.floor((TARGET - Date.now()) / 1000));
    if (s === 0) {
      c.lbl.textContent = "The season is live";
      c.row.style.display = "none";
      c.sub.style.display = "none";
      return false;
    }
    UNITS.forEach(function (u, i) {
      var v = Math.floor(s / u[1]); s -= v * u[1];
      c.cells[i].textContent = i === 0 ? String(v) : String(v).padStart(2, "0");
    });
    return true;
  }

  function init(root) {
    (root || document).querySelectorAll("[data-countdown]:not([data-cd-ready])").forEach(function (el) {
      el.setAttribute("data-cd-ready", "1");
      var c = build(el);
      if (tick(c)) { var id = setInterval(function () { if (!tick(c)) clearInterval(id); }, 1000); }
    });
  }
  window.initCountdowns = init;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})();
