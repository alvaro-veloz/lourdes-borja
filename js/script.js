(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = navMenu ? navMenu.querySelectorAll("a[href^='#']") : [];
  const sections = document.querySelectorAll("main section[id]");
  const fab = document.getElementById("fab");

  (function heroMediaFallback() {
    var wrap = document.querySelector(".hero__video-wrap");
    if (!wrap) return;
    var media = wrap.querySelector("img.hero__video");
    var ph = wrap.querySelector(".hero__video-placeholder");
    if (!media || !ph) return;
    media.addEventListener("error", function () {
      ph.removeAttribute("hidden");
      media.style.display = "none";
    });
  })();

  function getNavOffset() {
    if (!nav) return 80;
    return Math.round(nav.getBoundingClientRect().height) + 8;
  }

  function setNavHeightVar() {
    if (!nav) return;
    const h = Math.ceil(nav.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--nav-h", `${h}px`);
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("nav--open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add("nav--open");
    document.body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  function toggleNav() {
    if (!nav || !navToggle) return;
    if (nav.classList.contains("nav--open")) closeNav();
    else openNav();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleNav();
    });
    navLinks.forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) closeNav();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    // Cerrar al tocar cualquier parte fuera del nav
    document.addEventListener("click", function (e) {
      if (!nav || !nav.classList.contains("nav--open")) return;
      if (!nav.contains(e.target)) closeNav();
    });
    // Cerrar al hacer scroll (comportamiento natural en móvil)
    window.addEventListener("scroll", function () {
      if (nav && nav.classList.contains("nav--open")) closeNav();
    }, { passive: true, once: false });
  }

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 901px)").matches) closeNav();
    setNavHeightVar();
  });

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 24);
    if (fab) fab.classList.toggle("shown", y > 500);

    var current = "inicio";
    var offset = getNavOffset();
    sections.forEach(function (s) {
      if (s.offsetTop <= y + offset) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - getNavOffset();
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("shown");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  const processObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          setTimeout(function () {
            e.target.classList.add("shown");
          }, i * 100);
          processObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".process__item").forEach(function (el) {
    processObserver.observe(el);
  });

  document.querySelectorAll(".palette-dot").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const palette = btn.dataset.palette;
      if (!palette) return;
      document.body.setAttribute("data-palette", palette);
      document.querySelectorAll(".palette-dot").forEach(function (b) {
        b.classList.toggle("active", b.dataset.palette === palette);
      });
    });
  });

  document.querySelectorAll(".faq__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq__item");
      if (!item) return;
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq__item").forEach(function (i) {
        i.classList.remove("open");
        var q = i.querySelector(".faq__q");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  setNavHeightVar();
  onScroll();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setNavHeightVar();
      onScroll();
    });
  }

  // ── HERO ANIMACIONES DE ENTRADA ──
  var heroEl = document.querySelector(".hero");
  if (heroEl) {
    // Pequeño delay para que el navegador pinte primero
    requestAnimationFrame(function () {
      setTimeout(function () {
        heroEl.classList.add("hero--loaded");
      }, 80);
    });
  }

  // ── PARALLAX SUTIL EN SCROLL ──
  var heroWrap = document.querySelector(".hero__video-wrap");
  if (heroWrap) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      // Solo cuando el hero es visible
      if (y < window.innerHeight) {
        heroWrap.style.transform = "translateY(" + (y * 0.28) + "px)";
      }
    }, { passive: true });
  }
})();
