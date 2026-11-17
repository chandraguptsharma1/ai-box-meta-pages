/* AI Box — minimal progressive enhancement. Every page works without this file. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) setOpen(false);
    });
  }

  /* ---- Lucide icons (loaded from CDN; icons are decorative so failure is harmless) ---- */
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true", focusable: "false" } });
  }

  /* ---- Footer year ---- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Placeholder highlighting ----
     Any text of the form {{TOKEN}} is unfinished operator information.
     Once every token has been replaced in the HTML, nothing here has any effect. */
  var TOKEN = /\{\{[A-Z0-9_]+\}\}/g;
  var count = 0;

  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      if (!n.nodeValue || n.nodeValue.indexOf("{{") === -1) return NodeFilter.FILTER_REJECT;
      var p = n.parentNode && n.parentNode.nodeName;
      if (p === "SCRIPT" || p === "STYLE") return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(function (node) {
    var text = node.nodeValue;
    var frag = document.createDocumentFragment();
    var last = 0;
    text.replace(TOKEN, function (match, offset) {
      if (offset > last) frag.appendChild(document.createTextNode(text.slice(last, offset)));
      var mark = document.createElement("mark");
      mark.className = "ph";
      mark.title = "Placeholder — operator must replace before publishing";
      mark.textContent = match;
      frag.appendChild(mark);
      last = offset + match.length;
      count++;
      return match;
    });
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });

  /* mailto links still pointing at a placeholder must not open a mail client */
  Array.prototype.forEach.call(document.querySelectorAll('a[href*="{{"], a[href*="%7B%7B"]'), function (a) {
    count++;
    a.setAttribute("aria-disabled", "true");
    a.title = "Contact address not yet configured";
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* Review-required notes and launch blockers also mean the page is still a draft */
  count += document.querySelectorAll(".callout-legal, [data-launch-blocker]").length;

  if (count > 0) {
    var dismissed = false;
    try { dismissed = sessionStorage.getItem("aibox-draft-dismissed") === "1"; } catch (e) { /* storage unavailable */ }
    if (!dismissed) {
      var box = document.createElement("div");
      box.className = "draft-notice";
      box.setAttribute("role", "status");
      box.innerHTML =
        '<div><strong>Draft — operator details incomplete</strong>' +
        "This page contains highlighted placeholders that must be replaced before it is used for Meta App Settings.</div>" +
        '<button type="button" aria-label="Dismiss notice">&times;</button>';
      box.querySelector("button").addEventListener("click", function () {
        box.remove();
        try { sessionStorage.setItem("aibox-draft-dismissed", "1"); } catch (e) { /* ignore */ }
      });
      document.body.appendChild(box);
    }
  }

  /* ---- Table of contents: highlight the section in view ---- */
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    Array.prototype.forEach.call(tocLinks, function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          Array.prototype.forEach.call(tocLinks, function (a) { a.classList.remove("active"); });
          map[entry.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();
