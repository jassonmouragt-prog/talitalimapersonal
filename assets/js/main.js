/* ============================================================
   TALITA LIMA PERSONAL — main.js
   Scroll suave (Lenis) + reveals com reversão (GSAP ScrollTrigger).
   ============================================================ */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  /* ----- Header: fundo sutil ao rolar ----- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----- Reveal: entra descendo, "reveal inverso" subindo ----- */
  var gsapReady = window.gsap && window.ScrollTrigger;

  if (!prefersReduced && gsapReady && revealEls.length) {
    gsap.registerPlugin(ScrollTrigger);

    revealEls.forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: function () { el.classList.add('is-in'); },
        onLeaveBack: function () { el.classList.remove('is-in'); }
      });
    });
  } else if (revealEls.length) {
    // Fallback: sem GSAP ou reduced motion → exibe tudo.
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ----- Scroll suave (Lenis integrado ao ticker do GSAP) ----- */
  var lenis = null;
  if (!prefersReduced && gsapReady && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ----- Âncoras internas acompanham o scroll suave ----- */
  if (lenis) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -20 });
        }
      });
    });
  }

  /* ----- Links de WhatsApp (segurança + janela nova) ----- */
  document.querySelectorAll('.wa-link').forEach(function (link) {
    var waUrl = link.getAttribute('href');
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(waUrl, '_blank', 'noopener');
    });
  });

  /* ----- Ano do rodapé ----- */
  var yearEl = document.getElementById('ano');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();