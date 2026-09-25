/* MiSAD website behaviour.
   You normally do NOT need to edit this file. All content lives in content.js. */
(function () {
  "use strict";
  var D = window.MISAD || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var programmes = D.programmes || [];
  var gallery = (D.gallery || []).filter(function (g) { return g && g.src; });
  var progById = {}; programmes.forEach(function (p) { progById[p.id] = p; });

  /* ---------- Small facts ---------- */
  var now = new Date().getFullYear();
  var est = (D.site && D.site.established) || 2002;
  $("#yearsCount").textContent = (now - est) + " years";
  $("#tenureNow").textContent = (D.site && D.site.currentTenure) || (D.executive && D.executive[0] && D.executive[0].tenure) || "—";
  $("#yearNow").textContent = now;

  /* ---------- Header: scroll state, mobile menu, active link ---------- */
  var topbar = $(".topbar"), menuBtn = $("#menuBtn"), nav = $("#nav");
  var onScroll = function () { topbar.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  menuBtn.addEventListener("click", function () {
    var open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!open)); nav.classList.toggle("open", !open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menuBtn.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); }
  });
  if ("IntersectionObserver" in window) {
    var links = {}; nav.querySelectorAll("a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
          links[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Programmes explorer ---------- */
  var progList = $("#progList"), progPanel = $("#progPanel");
  function photosFor(id) { return gallery.filter(function (g) { return g.programme === id; }); }
  var currentProg = null;
  function showProgramme(id, focus) {
    var p = progById[id]; if (!p) return; currentProg = id;
    progList.querySelectorAll(".prog-tab").forEach(function (t) {
      var on = t.dataset.id === id;
      t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    var pics = photosFor(id);
    var strip = pics.slice(0, 3).map(function (g) {
      return '<button data-src="' + esc(g.src) + '" aria-label="Open photo: ' + esc(g.caption || p.name) + '"><img src="' + esc(g.src) + '" alt="' + esc(g.caption || p.name) + '" loading="lazy"></button>';
    }).join("");
    progPanel.innerHTML =
      '<p class="pp-gloss">' + esc(p.gloss) + '</p>' +
      '<h3>' + esc(p.name) + '</h3>' +
      '<p class="pp-desc">' + esc(p.description) + '</p>' +
      (pics.length ? '<div class="pp-strip">' + strip + '</div>' : '<div class="pp-empty">Photos from ' + esc(p.name) + ' will appear here once they are added to the gallery.</div>') +
      '<div class="pp-foot"><span class="pp-count">' + pics.length + (pics.length === 1 ? " photo" : " photos") + '</span>' +
      (pics.length ? '<button class="link-btn" data-goto="' + esc(id) + '">See all in the gallery</button>' : "") + '</div>';
  }
  programmes.forEach(function (p, i) {
    var b = el("button", { class: "prog-tab", role: "tab", "data-id": p.id, "aria-selected": "false", tabindex: "-1" },
      '<span class="p-name">' + esc(p.name) + '</span><span class="p-gloss">' + esc(p.gloss) + '</span><span class="p-arrow" aria-hidden="true">→</span>');
    progList.appendChild(b);
  });
  progList.addEventListener("click", function (e) { var t = e.target.closest(".prog-tab"); if (t) showProgramme(t.dataset.id); });
  progList.addEventListener("keydown", function (e) {
    var tabs = Array.prototype.slice.call(progList.querySelectorAll(".prog-tab"));
    var i = tabs.indexOf(document.activeElement); if (i < 0) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); showProgramme(tabs[(i + 1) % tabs.length].dataset.id, true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); showProgramme(tabs[(i - 1 + tabs.length) % tabs.length].dataset.id, true); }
  });
  progPanel.addEventListener("click", function (e) {
    var go = e.target.closest("[data-goto]");
    if (go) { setFilter(go.dataset.goto); $("#gallery").scrollIntoView({ behavior: "smooth" }); return; }
    var ph = e.target.closest("[data-src]");
    if (ph) { var list = photosFor(currentProg); openLightbox(list, list.findIndex(function (g) { return g.src === ph.dataset.src; })); }
  });
  if (programmes.length) showProgramme(programmes[0].id);

  /* ---------- Gallery ---------- */
  var galGrid = $("#galGrid"), galFilters = $("#galFilters"), galMore = $("#galMore"), galEmpty = $("#galEmpty");
  var PAGE = 12, shown = PAGE, current = "all", view = [];
  function chip(id, label, n) {
    return '<button class="chip" data-f="' + esc(id) + '" aria-pressed="false">' + esc(label) + '<span class="n">' + n + '</span></button>';
  }
  galFilters.innerHTML = chip("all", "All", gallery.length) + programmes.filter(function (p) { return photosFor(p.id).length; }).map(function (p) { return chip(p.id, p.name, photosFor(p.id).length); }).join("");
  galFilters.addEventListener("click", function (e) { var c = e.target.closest(".chip"); if (c) setFilter(c.dataset.f); });
  function setFilter(f) {
    current = f; shown = PAGE;
    galFilters.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.f === f)); });
    renderGallery();
  }
  function renderGallery() {
    view = current === "all" ? gallery : photosFor(current);
    galGrid.innerHTML = view.slice(0, shown).map(function (g, i) {
      var label = g.caption || (progById[g.programme] && progById[g.programme].name) || "Photo";
      return '<button class="tile" data-i="' + i + '" aria-label="Open photo: ' + esc(label) + '">' +
        '<img src="' + esc(g.src) + '" alt="' + esc(label) + '" loading="lazy">' +
        (g.sample ? '<span class="badge">Sample</span>' : "") +
        '<span class="cap">' + esc(label) + (g.year ? " · " + esc(g.year) : "") + '</span></button>';
    }).join("");
    galEmpty.hidden = view.length > 0;
    galMore.hidden = view.length <= shown;
  }
  galGrid.addEventListener("click", function (e) { var t = e.target.closest(".tile"); if (t) openLightbox(view, +t.dataset.i); });
  galMore.addEventListener("click", function () { shown += PAGE; renderGallery(); });
  setFilter("all");

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbCount = $("#lbCount"), lbList = [], lbI = 0, lastFocus = null;
  function openLightbox(list, i) {
    if (!list.length) return;
    lbList = list; lbI = Math.max(0, i); lastFocus = document.activeElement;
    lb.hidden = false; document.body.style.overflow = "hidden"; drawLb(); $("#lbClose").focus();
  }
  function drawLb() {
    var g = lbList[lbI]; var label = g.caption || (progById[g.programme] && progById[g.programme].name) || "Photo";
    lbImg.src = g.src; lbImg.alt = label;
    lbCap.textContent = label + (g.year ? " · " + g.year : "") + (g.sample ? " (sample image)" : "");
    lbCount.textContent = (lbI + 1) + " / " + lbList.length;
  }
  function stepLb(d) { lbI = (lbI + d + lbList.length) % lbList.length; drawLb(); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  $("#lbPrev").addEventListener("click", function () { stepLb(-1); });
  $("#lbNext").addEventListener("click", function () { stepLb(1); });
  $("#lbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-fig")) closeLb(); });
  var tx = null;
  lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) { if (tx == null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1); tx = null; });

  /* ---------- Lolad shelf ---------- */
  var shelf = $("#shelf"), issues = (D.lolad || []).filter(function (x) { return x && x.pdf; });
  shelf.innerHTML = issues.map(function (x, i) {
    var cover = x.cover
      ? '<div class="cover"><img src="' + esc(x.cover) + '" alt="Cover of Lolad ' + esc(x.edition) + '" loading="lazy"></div>'
      : '<div class="cover auto" aria-hidden="true"><span class="cv-top">MiSAD · Annual souvenir</span><span class="cv-title">Lolad</span><span class="cv-ed">' + esc(x.edition) + '</span></div>';
    return '<button class="issue" data-i="' + i + '" aria-label="Read Lolad ' + esc(x.edition) + '">' + cover +
      '<span class="issue-meta"><strong>Lolad ' + esc(x.edition) + '</strong><span>' + esc(x.note || "Read online") + '</span></span></button>';
  }).join("") || '<p style="color:var(--lolad-mute)">The first edition will appear here soon.</p>';
  shelf.addEventListener("click", function (e) { var b = e.target.closest(".issue"); if (b) openReader(issues[+b.dataset.i]); });

  /* ---------- Lolad reader (PDF.js) ---------- */
  var rd = $("#reader"), rdCanvas = $("#rdCanvas"), rdMsg = $("#rdMsg"), rdStage = $("#rdStage");
  var pdf = null, pageNo = 1, zoom = false, rendering = false, rdLast = null;
  if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  function toBytes(dataUrl) {
    var b = atob(dataUrl.split(",")[1]), u = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u;
  }
  function openReader(issue) {
    rdLast = document.activeElement;
    rd.hidden = false; document.body.style.overflow = "hidden";
    $("#rdTitle").textContent = "Lolad " + issue.edition;
    var openLink = $("#rdOpen");
    if (/^data:/.test(issue.pdf)) openLink.hidden = true; else { openLink.hidden = false; openLink.href = issue.pdf; }
    rdCanvas.hidden = true; rdMsg.hidden = false; rdMsg.textContent = "Opening Lolad " + issue.edition + "…";
    $("#rdClose").focus();
    if (!window.pdfjsLib) { rdMsg.textContent = "The reader could not load. Use “Open PDF” to read this edition."; return; }
    var src = /^data:/.test(issue.pdf) ? { data: toBytes(issue.pdf) } : { url: issue.pdf };
    window.pdfjsLib.getDocument(src).promise.then(function (doc) {
      pdf = doc; pageNo = 1; zoom = false; rdStage.classList.remove("zoomed"); renderPage();
    }).catch(function () { rdMsg.textContent = "This edition could not be opened here. Use “Open PDF” to read it."; });
  }
  function renderPage() {
    if (!pdf || rendering) return; rendering = true;
    pdf.getPage(pageNo).then(function (page) {
      var base = page.getViewport({ scale: 1 });
      var avail = Math.max(280, rdStage.clientWidth - 32), availH = Math.max(300, rdStage.clientHeight - 48);
      var fit = Math.min(avail / base.width, availH / base.height);
      var scale = zoom ? Math.max(fit * 2, avail / base.width) : fit;
      var dpr = window.devicePixelRatio || 1, vp = page.getViewport({ scale: scale * dpr });
      rdCanvas.width = vp.width; rdCanvas.height = vp.height;
      rdCanvas.style.width = (vp.width / dpr) + "px"; rdCanvas.style.height = (vp.height / dpr) + "px";
      return page.render({ canvasContext: rdCanvas.getContext("2d"), viewport: vp }).promise;
    }).then(function () {
      rendering = false; rdMsg.hidden = true; rdCanvas.hidden = false;
      $("#rdPage").textContent = pageNo + " / " + pdf.numPages;
      $("#rdPrev").disabled = pageNo <= 1; $("#rdNext").disabled = pageNo >= pdf.numPages;
    }).catch(function () { rendering = false; });
  }
  function turn(d) { if (!pdf) return; var n = pageNo + d; if (n < 1 || n > pdf.numPages) return; pageNo = n; rdStage.scrollTop = 0; renderPage(); }
  function closeReader() { rd.hidden = true; document.body.style.overflow = ""; if (pdf) { pdf.destroy(); pdf = null; } if (rdLast) rdLast.focus(); }
  $("#rdPrev").addEventListener("click", function () { turn(-1); });
  $("#rdNext").addEventListener("click", function () { turn(1); });
  $("#rdZoom").addEventListener("click", function () { zoom = !zoom; rdStage.classList.toggle("zoomed", zoom); $("#rdZoom").textContent = zoom ? "Fit" : "Zoom"; renderPage(); });
  $("#rdClose").addEventListener("click", closeReader);
  var rt; window.addEventListener("resize", function () { if (!rd.hidden) { clearTimeout(rt); rt = setTimeout(renderPage, 150); } });

  /* ---------- Keyboard for overlays ---------- */
  document.addEventListener("keydown", function (e) {
    if (!lb.hidden) {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") stepLb(1);
      if (e.key === "ArrowLeft") stepLb(-1);
    } else if (!rd.hidden) {
      if (e.key === "Escape") closeReader();
      if (e.key === "ArrowRight" || e.key === "PageDown") turn(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") turn(-1);
    }
  });

  /* ---------- Executive body ---------- */
  var terms = (D.executive || []).filter(function (t) { return t && t.tenure; });
  var sel = $("#tenureSel"), grid = $("#execGrid");
  function initials(n) { return n.split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase(); }
  function renderExec(tenure) {
    var t = terms.filter(function (x) { return x.tenure === tenure; })[0]; if (!t) return;
    grid.innerHTML = (t.members || []).map(function (m, i) {
      var named = m.name && m.name.trim();
      var av = m.photo ? '<img src="' + esc(m.photo) + '" alt="" loading="lazy">' : (named ? esc(initials(m.name)) : "·");
      return '<li class="person' + (i === 0 ? " lead" : "") + '"><span class="avatar" aria-hidden="true">' + av + '</span><div>' +
        '<p class="role">' + esc(m.role) + '</p>' +
        '<p class="pname' + (named ? "" : " tbd") + '">' + (named ? esc(m.name) : "Name to be added") + '</p></div></li>';
    }).join("");
  }
  sel.innerHTML = terms.map(function (t) { return '<option value="' + esc(t.tenure) + '">' + esc(t.tenure) + '</option>'; }).join("");
  if (terms.length < 2) $("#tenureWrap").style.visibility = terms.length ? "visible" : "hidden";
  sel.addEventListener("change", function () { renderExec(sel.value); });
  if (terms.length) renderExec(terms[0].tenure);

  /* ---------- Contact (footer) ---------- */
  var c = D.contact || {}, items = [];
  if (c.email) items.push('<span>' + esc(c.email) + '</span>');
  if (c.phone) items.push('<span>' + esc(c.phone) + '</span>');
  if (c.instagram) items.push('<a href="' + esc(c.instagram) + '" target="_blank" rel="noopener">Instagram</a>');
  if (c.facebook) items.push('<a href="' + esc(c.facebook) + '" target="_blank" rel="noopener">Facebook</a>');
  if (c.youtube) items.push('<a href="' + esc(c.youtube) + '" target="_blank" rel="noopener">YouTube</a>');
  if (c.joinForm) items.push('<a href="' + esc(c.joinForm) + '" target="_blank" rel="noopener">Join MiSAD</a>');
  if (items.length) { $("#contactList").innerHTML = items.join(""); $("#contactCol").hidden = false; }

  /* ---------- Gentle reveal (content stays visible without it) ---------- */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var targets = document.querySelectorAll(".sec-head, .about-grid, .prog, .masonry, .lolad-in, .exec");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) {
      var r = t.getBoundingClientRect();
      if (r.top > window.innerHeight) { t.classList.add("reveal", "pre"); io.observe(t); }
    });
  }
})();
