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
    document.addEventListener("click", function (e) {
      if (!nav || !nav.classList.contains("nav--open")) return;
      if (!nav.contains(e.target)) closeNav();
    });
    window.addEventListener("scroll", function () {
      if (nav && nav.classList.contains("nav--open")) closeNav();
    }, { passive: true, once: false });
  }

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 901px)").matches) closeNav();
    setNavHeightVar();
  });

  const heroScroll = document.querySelector(".hero__scroll");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 24);
    if (fab) fab.classList.toggle("shown", y > 500);
    if (heroScroll) heroScroll.classList.toggle("is-hidden", y > 80);
  }

  var mainScrollTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!mainScrollTicking) {
        mainScrollTicking = true;
        requestAnimationFrame(function () {
          onScroll();
          mainScrollTicking = false;
        });
      }
    },
    { passive: true }
  );

  // Sección activa del nav: IntersectionObserver en vez de leer posiciones en cada scroll
  (function activeSectionObserver() {
    if (!sections.length || !navLinks.length) return;
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      sectionObserver.observe(s);
    });
  })();

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

  // Línea de tiempo del proceso: se dibuja una vez al entrar en pantalla
  (function processTimelineDraw() {
    var wrap = document.querySelector(".process__list-wrap");
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.classList.add("timeline-drawn");
      return;
    }
    var lineObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            wrap.classList.add("timeline-drawn");
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    lineObserver.observe(wrap);
  })();

  // Círculo dibujado a mano alrededor del "+50" del badge de About
  (function aboutBadgeCircle() {
    var badge = document.querySelector(".about__badge");
    if (!badge) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      badge.classList.add("is-circled");
      return;
    }
    var badgeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            badge.classList.add("is-circled");
            badgeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    badgeObserver.observe(badge);
  })();

  // Trazo dibujado a mano bajo "camino" en Contacto
  (function contactUnderlineDraw() {
    var contact = document.getElementById("contacto");
    if (!contact) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      contact.classList.add("is-drawn");
      return;
    }
    var contactObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            contact.classList.add("is-drawn");
            contactObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    contactObserver.observe(contact);
  })();

  document.querySelectorAll(".palette-dot").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const palette = btn.dataset.palette;
      if (!palette) return;
      document.body.setAttribute("data-palette", palette);
      document.querySelectorAll(".palette-dot").forEach(function (b) {
        b.classList.toggle("active", b.dataset.palette === palette);
      });
      closePaletteBar();
    });
  });

  // Selector de paletas: entrada suave + globo de invitación una sola vez
  (function paletteSwitcherIntro() {
    var switcher = document.getElementById("palette-switcher");
    if (!switcher) return;

    setTimeout(function () {
      switcher.classList.add("is-visible");
    }, 400);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var nudgeTimer = setTimeout(function () {
      switcher.classList.add("show-nudge");
      setTimeout(function () {
        switcher.classList.remove("show-nudge");
      }, 4200);
    }, 2600);

    switcher.addEventListener(
      "click",
      function () {
        clearTimeout(nudgeTimer);
        switcher.classList.remove("show-nudge");
      },
      { once: true }
    );
  })();

  // Botón flotante de paleta (móvil)
  const paletteBar = document.getElementById("palette-bar");
  const paletteToggle = document.getElementById("palette-toggle");

  function closePaletteBar() {
    if (!paletteBar || !paletteToggle) return;
    paletteBar.classList.remove("open");
    paletteToggle.setAttribute("aria-expanded", "false");
  }

  if (paletteBar && paletteToggle) {
    paletteToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = paletteBar.classList.toggle("open");
      paletteToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!paletteBar.classList.contains("open")) return;
      if (!paletteBar.contains(e.target)) closePaletteBar();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePaletteBar();
    });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var barNudgeTimer = setTimeout(function () {
        paletteBar.classList.add("show-nudge");
        setTimeout(function () {
          paletteBar.classList.remove("show-nudge");
        }, 4200);
      }, 2600);
      paletteBar.addEventListener(
        "click",
        function () {
          clearTimeout(barNudgeTimer);
          paletteBar.classList.remove("show-nudge");
        },
        { once: true }
      );
    }
  }

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

  // Animación de entrada del hero
  var heroEl = document.querySelector(".hero");
  if (heroEl) {
    requestAnimationFrame(function () {
      setTimeout(function () {
        heroEl.classList.add("hero--loaded");
      }, 80);
    });
  }

  // Botones magnéticos: siguen levemente el cursor al pasar cerca
  (function magneticButtons() {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !hasFinePointer) return;
    var strength = 14;
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
        var y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
        btn.style.setProperty("--mx", x.toFixed(1) + "px");
        btn.style.setProperty("--my", y.toFixed(1) + "px");
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.setProperty("--mx", "0px");
        btn.style.setProperty("--my", "0px");
      });
    });
  })();

  // Tilt 3D sutil en la foto de About
  (function aboutImgTilt() {
    var wrap = document.querySelector(".about__img-wrap");
    if (!wrap) return;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !hasFinePointer) return;
    wrap.addEventListener("mousemove", function (e) {
      var rect = wrap.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      wrap.style.transform =
        "perspective(900px) rotateX(" + (py * -6).toFixed(2) + "deg) rotateY(" + (px * 8).toFixed(2) + "deg)";
    });
    wrap.addEventListener("mouseleave", function () {
      wrap.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  })();

  // Testimonios: detectar cuál está más cerca del centro y sincronizar con los dots
  (function testimonialsTrack() {
    var track = document.getElementById("testimonials-track");
    var dotsWrap = document.getElementById("testimonials-dots");
    var prevBtn = document.getElementById("testimonials-prev");
    var nextBtn = document.getElementById("testimonials-next");
    if (!track || !dotsWrap) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll(".testimonial"));
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll(".testimonials__dot"));
    if (!cards.length) return;

    var activeIndex = -1;
    var ticking = false;

    function goTo(index) {
      var target = cards[index];
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    function setActive(index) {
      if (index === activeIndex) return;
      activeIndex = index;
      cards.forEach(function (c, i) {
        c.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
      });
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === cards.length - 1;
    }

    function updateActiveFromScroll() {
      ticking = false;
      var trackRect = track.getBoundingClientRect();
      var trackCenter = trackRect.left + trackRect.width / 2;
      var closestIndex = 0;
      var closestDist = Infinity;
      cards.forEach(function (c, i) {
        var r = c.getBoundingClientRect();
        var cardCenter = r.left + r.width / 2;
        var dist = Math.abs(cardCenter - trackCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      setActive(closestIndex);
    }

    track.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateActiveFromScroll);
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", updateActiveFromScroll);

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(Math.max(0, activeIndex - 1));
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(Math.min(cards.length - 1, activeIndex + 1));
      });
    }

    updateActiveFromScroll();
  })();

  // Doodles del hero: parallax por profundidad (mouse) o scroll (touch)
  (function heroDoodleParallax() {
    var wrap = document.getElementById("hero-doodles");
    var heroEl2 = document.querySelector(".hero");
    if (!wrap || !heroEl2) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;

    function tick() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      wrap.style.setProperty("--px", (curX * 26).toFixed(2) + "px");
      wrap.style.setProperty("--py", (curY * 18).toFixed(2) + "px");
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    if (hasFinePointer) {
      heroEl2.addEventListener("mousemove", function (e) {
        var rect = heroEl2.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        targetX = (e.clientX - cx) / (rect.width / 2);
        targetY = (e.clientY - cy) / (rect.height / 2);
        if (!raf) raf = requestAnimationFrame(tick);
      });
      heroEl2.addEventListener("mouseleave", function () {
        targetX = 0;
        targetY = 0;
        if (!raf) raf = requestAnimationFrame(tick);
      });
    }
  })();

  // Agenda demo: flujo visual en tres pasos, sin enviar datos.
  (function bookingExperience() {
    var booking = document.getElementById("booking");
    var form = document.getElementById("booking-form");
    if (!booking || !form) return;

    var isEmbedded = booking.classList.contains("booking--embedded");
    var contactSection = document.getElementById("contacto");
    if (isEmbedded && contactSection && contactSection.parentNode) {
      contactSection.parentNode.insertBefore(booking, contactSection);
    }

    var openers = document.querySelectorAll(".js-booking-open");
    var closers = booking.querySelectorAll("[data-booking-close]");
    var steps = booking.querySelectorAll(".booking__step");
    var progress = booking.querySelectorAll("[data-progress]");
    var progressBar = booking.querySelector(".booking__progress");
    var success = booking.querySelector(".booking__success");
    var selectedDate = "";
    var selectedTime = "";
    var currentStep = 1;
    var lastFocus = null;

    function populateWorkWeek() {
      var dayButtons = Array.prototype.slice.call(form.querySelectorAll(".booking-day"));
      if (!dayButtons.length) return;
      var today = new Date();
      today.setHours(12, 0, 0, 0);
      var weekday = today.getDay();
      var monday = new Date(today);
      if (weekday === 0) monday.setDate(today.getDate() + 1);
      else if (weekday === 6) monday.setDate(today.getDate() + 2);
      else monday.setDate(today.getDate() - (weekday - 1));

      var fullDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
      var shortDays = ["Lun", "Mar", "Mié", "Jue", "Vie"];
      dayButtons.forEach(function (button, index) {
        var date = new Date(monday);
        date.setDate(monday.getDate() + index);
        var month = new Intl.DateTimeFormat("es-EC", { month: "short" }).format(date).replace(".", "");
        var dateNumber = button.querySelector("strong");
        var dayName = button.querySelector("small");
        var monthName = button.querySelector(":scope > span");
        if (dayName) dayName.textContent = shortDays[index];
        if (dateNumber) dateNumber.textContent = String(date.getDate());
        if (monthName) monthName.textContent = month;
        button.dataset.date = fullDays[index] + " " + date.getDate() + " de " + month;
        button.disabled = true;
        button.classList.remove("is-selected");
        button.setAttribute("aria-label", button.dataset.date + ", reservado");
      });
      selectedDate = "";
    }

    populateWorkWeek();

    function selectService(value) {
      var option = form.querySelector('input[name="service"][value="' + value + '"]');
      if (option) option.checked = true;
    }

    function showStep(number) {
      currentStep = number;
      steps.forEach(function (step) {
        step.classList.toggle("is-active", Number(step.dataset.step) === number);
      });
      progress.forEach(function (item) {
        var n = Number(item.dataset.progress);
        item.classList.toggle("is-active", n === number);
        item.classList.toggle("is-done", n < number);
      });
      var active = booking.querySelector('.booking__step[data-step="' + number + '"]');
      if (active) active.scrollIntoView({ block: "start" });
    }

    function openBooking(service) {
      lastFocus = document.activeElement;
      if (service) selectService(service);
      if (isEmbedded) {
        success.classList.remove("is-active");
        if (progressBar) progressBar.style.display = "flex";
        showStep(1);
        booking.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      booking.classList.add("is-open");
      booking.setAttribute("aria-hidden", "false");
      document.body.classList.add("booking-open");
      setTimeout(function () {
        var close = booking.querySelector(".booking__close");
        if (close) close.focus();
      }, 80);
    }

    function closeBooking() {
      if (isEmbedded) {
        success.classList.remove("is-active");
        if (progressBar) progressBar.style.display = "flex";
        showStep(1);
        booking.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      booking.classList.remove("is-open");
      booking.setAttribute("aria-hidden", "true");
      document.body.classList.remove("booking-open");
      if (lastFocus) lastFocus.focus();
      setTimeout(function () {
        success.classList.remove("is-active");
        form.classList.remove("is-complete");
        if (progressBar) progressBar.style.display = "flex";
        showStep(1);
      }, 450);
    }

    function updateSummary() {
      var service = form.querySelector('input[name="service"]:checked');
      var mode = form.querySelector('input[name="mode"]:checked');
      var main = document.getElementById("booking-summary");
      var time = document.getElementById("booking-summary-time");
      if (main) main.textContent = (service ? service.value : "Consulta inicial") + " · " + (mode ? mode.value : "Online");
      if (time) time.textContent = selectedDate + ", " + (selectedTime || "09:00");
    }

    openers.forEach(function (opener) {
      opener.addEventListener("click", function (event) {
        event.preventDefault();
        openBooking(opener.dataset.service);
      });
    });
    closers.forEach(function (closer) { closer.addEventListener("click", closeBooking); });

    form.querySelectorAll("[data-next]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (button.disabled) return;
        if (currentStep < 3) {
          if (currentStep === 2) updateSummary();
          showStep(currentStep + 1);
        }
      });
    });
    form.querySelectorAll("[data-back]").forEach(function (button) {
      button.addEventListener("click", function () { showStep(Math.max(1, currentStep - 1)); });
    });
    form.querySelectorAll(".booking-day").forEach(function (day) {
      day.addEventListener("click", function () {
        form.querySelectorAll(".booking-day").forEach(function (d) { d.classList.remove("is-selected"); });
        day.classList.add("is-selected");
        selectedDate = day.dataset.date;
      });
    });
    form.querySelectorAll("[data-time]").forEach(function (slot) {
      slot.addEventListener("click", function () {
        form.querySelectorAll("[data-time]").forEach(function (s) { s.classList.remove("is-selected"); });
        slot.classList.add("is-selected");
        selectedTime = slot.dataset.time;
        var continueButton = form.querySelector('.booking__step[data-step="2"] [data-next]');
        if (continueButton) continueButton.disabled = false;
      });
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      steps.forEach(function (step) { step.classList.remove("is-active"); });
      if (progressBar) progressBar.style.display = "none";
      success.classList.add("is-active");
    });

    document.addEventListener("keydown", function (event) {
      if (!booking.classList.contains("is-open")) return;
      if (event.key === "Escape") closeBooking();
      if (event.key !== "Tab") return;
      var focusable = Array.prototype.slice.call(booking.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href]')).filter(function (el) { return el.offsetParent !== null; });
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  })();

})();
