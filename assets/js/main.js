/**
* Template Name: Personal - v4.9.1
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  const header = select('#header')
  const navbar = select('#navbar')
  const navlinks = select('#navbar .nav-link', true)
  const sections = select('section', true)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scrollBehavior = reduceMotion ? 'auto' : 'smooth'

  /**
   * Layout: the header is the full-screen hero, then a fixed top bar once the
   * user scrolls past it (or clicks a nav link). body.has-hero reserves the
   * hero height so the content never jumps.
   */
  let forceCompact = false

  const setActive = (hash) => {
    navlinks.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === hash)
    })
  }

  if (header) {
    document.body.classList.add('has-hero')
  }

  const updateHeader = () => {
    if (!header) return
    const bar = window.innerWidth <= 768 ? 60 : 80
    const hero = parseFloat(getComputedStyle(document.body).paddingTop)
    const past = window.scrollY >= hero - bar
    if (past) forceCompact = false
    const compact = past || forceCompact
    header.classList.toggle('header-top', compact)
    if (!compact) setActive('#header')
    else updateActive()
  }

  /**
   * Active nav link follows the visible section: the last section whose top
   * has crossed the reading line (45 % of the viewport)
   */
  const updateActive = () => {
    const last = sections[sections.length - 1]
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      // bottom of the page: the last section may be too short to reach the line
      if (last && last.id) setActive('#' + last.id)
      return
    }
    const line = window.innerHeight * 0.45
    let current = null
    sections.forEach((sec) => {
      if (sec.id && sec.getBoundingClientRect().top <= line) current = sec
    })
    if (current) setActive('#' + current.id)
  }

  const scrollToTarget = (hash) => {
    if (hash === '#header') {
      forceCompact = false
      window.scrollTo({ top: 0, behavior: scrollBehavior })
      return
    }
    const target = select(hash)
    if (!target) return
    const bar = window.innerWidth <= 768 ? 60 : 80
    forceCompact = true
    header.classList.add('header-top')
    const top = target.getBoundingClientRect().top + window.scrollY - bar
    window.scrollTo({ top: Math.max(top, 0), behavior: scrollBehavior })
  }

  window.addEventListener('scroll', updateHeader, { passive: true })
  window.addEventListener('resize', updateHeader)

  /**
   * Mobile nav toggle
   */
  const closeMobileNav = () => {
    if (navbar.classList.contains('navbar-mobile')) {
      navbar.classList.remove('navbar-mobile')
      const toggle = select('.mobile-nav-toggle')
      toggle.classList.add('bi-list')
      toggle.classList.remove('bi-x')
    }
  }

  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Smooth scroll on every in-page link (nav and content links such as
   * href="#contact"). The hash is never written to the URL, so a reload or a
   * back navigation can no longer jump to the last clicked anchor.
   */
  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('a[href^="#"]')
    if (!link || e.defaultPrevented || link.target === '_blank') return
    const hash = link.getAttribute('href')
    if (hash.length < 2 || !header || (hash !== '#header' && !select(hash))) return
    e.preventDefault()
    if (link.closest('#navbar')) setActive(hash)
    closeMobileNav()
    scrollToTarget(hash)
  })

  /**
   * A hash in the URL (shared link) is honoured once on load, only when the
   * browser did not restore a scroll position, then dropped from the URL.
   */
  window.addEventListener('load', () => {
    updateHeader()
    const hash = window.location.hash
    if (hash && hash !== '#header' && header && select(hash) && window.scrollY < 10) {
      scrollToTarget(hash)
    }
    if (hash) history.replaceState(null, '', window.location.pathname + window.location.search)
  })
  updateHeader()

  /**
   * Testimonials slider
   */
  if (select('.testimonials-slider')) new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      // Images are lazy-loaded: relayout whenever one finishes loading
      let relayoutTimer
      const relayout = () => {
        clearTimeout(relayoutTimer)
        relayoutTimer = setTimeout(() => portfolioIsotope.layout(), 50)
      }
      select('.portfolio-container img', true).forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', relayout)
          img.addEventListener('error', relayout)
        }
      })
      window.addEventListener('resize', relayout)

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio detail modal: the whole card (not only the link icon) opens the
   * detail page in a dark iframe modal. Own code instead of GLightbox
   * "external" (white flash / blank frame while the page loads).
   */
  if (select('.portfolio-details-lightbox')) {
    const modal = document.createElement('div')
    modal.className = 'pd-modal'
    modal.hidden = true
    modal.setAttribute('role', 'dialog')
    modal.setAttribute('aria-modal', 'true')
    modal.setAttribute('aria-label', 'Détail du projet')
    modal.innerHTML = '<button type="button" class="pd-modal-close" aria-label="Fermer">&times;</button>' +
      '<div class="pd-modal-frame"><div class="pd-modal-loader" aria-hidden="true"></div>' +
      '<iframe title="Détail du projet"></iframe></div>'
    document.body.appendChild(modal)
    const frame = modal.querySelector('iframe')
    let lastFocus = null

    const closeModal = () => {
      modal.hidden = true
      modal.classList.remove('is-ready')
      document.documentElement.classList.remove('pd-modal-open')
      frame.removeAttribute('src')
      if (lastFocus) lastFocus.focus()
    }
    const openModal = (href, opener) => {
      lastFocus = opener || document.activeElement
      modal.classList.remove('is-ready')
      frame.onload = () => modal.classList.add('is-ready')
      frame.src = href
      modal.hidden = false
      document.documentElement.classList.add('pd-modal-open')
      modal.querySelector('.pd-modal-close').focus()
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.pd-modal-close')) closeModal()
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal()
    })

    // Boutons « Voir le projet » de la section CV : même modale (le lien reste valable sans JS)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.resume-btn')
      if (!btn) return
      e.preventDefault()
      openModal(btn.href, btn)
    })

    // Whole thumbnail is clickable (also on touch); the link icon stays keyboard accessible
    select('.portfolio-container', true).forEach((container) => {
      container.addEventListener('click', (e) => {
        const wrap = e.target.closest('.portfolio-wrap')
        const link = wrap && wrap.querySelector('.portfolio-details-lightbox')
        if (!link) return
        e.preventDefault()
        openModal(link.href, link)
      })
    })
  }

  /**
   * Portfolio details slider
   */
  if (select('.portfolio-details-slider')) new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoHeight: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Initiate Pure Counter
   */
  const startCounters = () => new PureCounter()
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startCounters)
  else startCounters()

})()
