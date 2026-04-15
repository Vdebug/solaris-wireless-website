/**
 * Solaris Wireless - Main JavaScript
 * Shared interactive functionality for all pages.
 * Vanilla JS, no frameworks. Each feature checks for required DOM
 * elements before running so the file is safe to load on any page.
 */
(function () {
  'use strict';

  /* ==========================================================================
     1. CLIENT TICKER
     Scrolling marquee of client names. Only runs when #ctrack is on the page.
     ========================================================================== */
  function initClientTicker() {
    var track = document.getElementById('ctrack');
    if (!track) return;

    var clients = [
      'Google',
      'Ritual.co',
      'Republic Wireless',
      'T-Mobile',
      'Vodafone',
      'Orange',
      'Bluesky Cook Islands',
      'Cook Islands Telecom',
      'Parallel Wireless',
      'Vox Supply Chain',
      'Amazon Sellers'
    ];

    // Duplicate the list several times so the CSS scroll animation loops seamlessly
    var items = clients.concat(clients, clients, clients);
    track.innerHTML = items
      .map(function (name) {
        return '<span class="c-item">' + name + '</span>';
      })
      .join('');
  }

  /* ==========================================================================
     2. CASE STUDY MODAL SYSTEM
     Data for all five case studies and open/close/ESC handlers.
     Only initialises when the modal overlay element exists.
     ========================================================================== */
  var cases = {
    mvno: {
      cat: 'Telecom Operators',
      title: 'MVNO & Network Operator Sourcing',
      sub: 'Republic Wireless \u00b7 Pacific Island MVNOs \u00b7 Multiple Operators',
      body:
        '<p>Multiple MVNOs \u2014 spanning from the continental United States to Pacific island operators including those serving the Cook Islands \u2014 have trusted Solaris Wireless as their primary sourcing partner for mobile handsets.</p>' +
        '<p>These carriers operate in diverse environments with unforgiving device specifications. Regional frequencies, carrier branding requirements, OS customisation, and locked firmware profiles must all be matched precisely. An off-spec unit causes downstream failures across the operator\u2019s entire network onboarding process.</p>' +
        '<p>Solaris not only sourced the exact models to spec, but also handled full provisioning: custom OS loads, carrier splash (start-up) banners, SIM lock configuration, MMS parameter setup, and carrier wake-up integration. Every unit arrived at the operator\u2019s warehouse ready for immediate activation and distribution.</p>',
      tags: [
        'MVNO', 'Network Operators', 'OS Flashing', 'SIM Lock',
        'MMS Parameters', 'Carrier Banners', 'Pacific Islands'
      ]
    },
    ritual: {
      cat: 'Restaurant Technology',
      title: '10,000-Unit Global Kiosk Deployment',
      sub: 'Ritual.co \u2014 Canada, USA, Europe, Australia',
      body:
        '<p>Ritual.co, a leading restaurant solutions provider headquartered in Canada, operates across multiple continents. Their self-ordering kiosk product required a specific, stripped-down mobile hardware platform \u2014 Android One \u2014 chosen for its lightweight, bloat-free OS profile and consistency across markets.</p>' +
        '<p>Solaris was engaged to source close to ten thousand units to Ritual\u2019s exact specifications. Each device required provisioning with Ritual\u2019s proprietary operating environment, physical mounting on branded stands, retail-ready packaging, and individual preparation as a complete deployable kiosk unit.</p>' +
        '<p>The resulting product \u2014 fully assembled, provisioned, and packaged \u2014 was shipped directly to individual restaurant locations across North America, Europe, and Australia. Solaris managed the entire programme from component sourcing through to last-mile fulfilment.</p>',
      tags: [
        'Android One', '10,000 Units', 'Custom OS', 'Kitting',
        'Retail Packaging', 'Direct Fulfilment', 'North America', 'Europe', 'Australia'
      ]
    },
    bodycam: {
      cat: 'Specialist Hardware',
      title: 'Component Sourcing for Specialist Devices',
      sub: 'Confidential Client \u2014 Hardware Manufacturer',
      body:
        '<p>The smartphone, as a platform, contains some of the world\u2019s most miniaturised and capable sensor technology \u2014 high-resolution cameras, precision accelerometers, thermal modules, and powerful edge compute chipsets. A subset of sophisticated manufacturers source smartphones not as end-use devices, but as precision component platforms.</p>' +
        '<p>Solaris Wireless serves several such clients \u2014 identities kept confidential \u2014 who procure mobile phones with the specific intent of disassembling them for particular hardware components. These find their way into professional body camera systems, portable medical diagnostic equipment, and other specialist industrial devices.</p>' +
        '<p>This requires Solaris to source at scale, to a specific hardware revision, in a consistent and traceable supply line \u2014 among the most technically exacting procurement programmes we operate.</p>',
      tags: [
        'Component Sourcing', 'Body Cameras', 'Medical Devices',
        'Confidential', 'Hardware Disassembly', 'Specialist Procurement'
      ]
    },
    google: {
      cat: 'Fortune 500 Technology',
      title: 'Mission-Critical Procurement & Internal Deployment',
      sub: 'Google \u2014 Approved Vendor since 2016 \u00b7 Multiple Fortune 500 Clients',
      body:
        '<p>In 2016, Solaris Wireless was first introduced to Google\u2019s approved vendor ecosystem after successfully sourcing a mission-critical, end-of-life feature phone that no other supplier could locate at scale. The device was required for an internal testing programme where an exact hardware profile \u2014 no longer in production \u2014 was non-negotiable.</p>' +
        '<p>That engagement established Solaris as a trusted resource for situations where standard procurement channels fail: obsolete hardware, niche specifications, rapid-turnaround sourcing, and devices needed for non-standard deployments such as internal R&D, controlled testing environments, or special-use provisioning.</p>' +
        '<p>Since then, Solaris has been discovered by numerous other Fortune 500 technology, media, and industrial companies as a reliable source for smartphones, consumer electronics, and IoT devices for similar mission-critical programmes.</p>',
      tags: [
        'Google', 'Fortune 500', 'Vendor since 2016', 'End-of-Life Hardware',
        'Internal Testing', 'R&D Sourcing', 'Special Deployment'
      ]
    },
    gov: {
      cat: 'Government & Public Sector',
      title: 'Rugged Devices for Military & Remote Education',
      sub: 'Government Agencies \u2014 Multiple Jurisdictions',
      body:
        '<p>Government and public sector procurement carries a distinct set of requirements that most technology distributors are simply not positioned to fulfil: rugged hardware certifications, non-standard form factors, security-cleared supply chains, and devices that must operate in environments where failure is genuinely not an option.</p>' +
        '<p>Solaris Wireless has supplied mission-critical rugged mobile devices and hardware to military clients, where devices must meet stringent durability standards, operate across extreme environmental conditions, and support customised or hardened firmware environments.</p>' +
        '<p>Separately, Solaris has been engaged on programmes to supply technology hardware \u2014 tablets, mobile devices, and connectivity equipment \u2014 to remote schools in developing countries, where supply chain reach, cost efficiency, and reliability are all simultaneously essential.</p>',
      tags: [
        'Government', 'Military', 'Rugged Devices', 'Education',
        'Developing Countries', 'Remote Deployment', 'Public Sector'
      ]
    }
  };

  function initModalSystem() {
    var overlay = document.getElementById('modal-overlay');
    var modal   = document.getElementById('modal');
    var inner   = document.getElementById('modal-inner');
    if (!overlay || !modal || !inner) return;

    // Expose openModal globally so onclick attributes in HTML still work
    window.openModal = function (key) {
      var c = cases[key];
      if (!c) return;
      inner.innerHTML =
        '<div class="modal-cat">' + c.cat + '</div>' +
        '<div class="modal-title">' + c.title + '</div>' +
        '<div class="modal-sub">' + c.sub + '</div>' +
        '<div class="modal-body">' + c.body + '</div>' +
        '<div class="modal-tags">' +
          c.tags.map(function (t) { return '<span class="modal-tag">' + t + '</span>'; }).join('') +
        '</div>';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    // Close when clicking the overlay background (not the modal itself)
    window.closeModal = function (e) {
      if (e.target === overlay) closeModalDirect();
    };

    // Direct close (called by the close button and ESC)
    window.closeModalDirect = function () {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    // ESC key closes modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModalDirect();
    });
  }

  /* ==========================================================================
     3. SCROLL REVEAL ANIMATION
     Uses IntersectionObserver to add the .in class to .reveal elements
     as they scroll into view.
     ========================================================================== */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -20px 0px' }
    );

    reveals.forEach(function (el) {
      // If already in viewport at load time, reveal immediately
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in');
      } else {
        observer.observe(el);
      }
    });
  }

  /* ==========================================================================
     4. PROMO BANNER
     Session-based dismiss. If the user has already dismissed the banner
     in this session the banner stays hidden and the hero offset is removed.
     ========================================================================== */
  function initPromoBanner() {
    var banner = document.getElementById('promo-banner');
    var hero   = document.querySelector('.hero');
    if (!banner) return;

    // Expose dismiss function globally for onclick in HTML
    window.dismissBanner = function () {
      banner.classList.add('hidden');
      if (hero) hero.classList.remove('banner-offset');
      sessionStorage.setItem('promo-dismissed', '1');
    };

    if (!sessionStorage.getItem('promo-dismissed')) {
      if (hero) hero.classList.add('banner-offset');
    } else {
      banner.classList.add('hidden');
    }
  }

  /* ==========================================================================
     5. MOBILE NAVIGATION
     Creates a slide-out mobile menu from the existing .nav-links list.
     Toggles on hamburger tap; closes on link click or outside click.
     ========================================================================== */
  function initMobileNav() {
    var nav      = document.querySelector('nav');
    var navInner = document.querySelector('.nav-inner');
    if (!nav || !navInner) return;

    // Only build the hamburger if it does not already exist
    if (document.querySelector('.nav-hamburger')) return;

    // --- Create hamburger button ---
    var hamburger = document.createElement('button');
    hamburger.className = 'nav-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';

    // Insert hamburger into .nav-inner (after logo, before links)
    var navRight = document.querySelector('.nav-right');
    if (navRight) {
      navInner.insertBefore(hamburger, navRight);
    } else {
      navInner.appendChild(hamburger);
    }

    // --- Create mobile menu ---
    var mobileMenu = document.createElement('div');
    mobileMenu.className = 'nav-mobile-menu';

    // Clone existing nav links into the mobile menu
    var desktopLinks = document.querySelector('.nav-links');
    if (desktopLinks) {
      var clone = desktopLinks.cloneNode(true);
      mobileMenu.appendChild(clone);
    }

    // Clone CTA button if it exists
    var ctaBtn = document.querySelector('.nav-cta');
    if (ctaBtn) {
      var ctaClone = ctaBtn.cloneNode(true);
      ctaClone.className = 'nav-cta nav-mobile-cta';
      mobileMenu.appendChild(ctaClone);
    }

    nav.appendChild(mobileMenu);

    // --- Toggle ---
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    });

    // Close on link click inside mobile menu
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!mobileMenu.classList.contains('open')) return;
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }

  /* ==========================================================================
     6. CONTACT FORM HANDLER
     Client-side validation, POST to /api/contact, loading state,
     and success/error messaging.
     ========================================================================== */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Gather field values
      var fields = {
        firstName:    (form.querySelector('[name="firstName"]')    || {}).value || '',
        lastName:     (form.querySelector('[name="lastName"]')     || {}).value || '',
        organisation: (form.querySelector('[name="organisation"]') || {}).value || '',
        email:        (form.querySelector('[name="email"]')        || {}).value || '',
        interest:     (form.querySelector('[name="interest"]')     || {}).value || '',
        message:      (form.querySelector('[name="message"]')      || {}).value || ''
      };

      // --- Client-side validation ---
      var errors = [];
      if (!fields.firstName.trim()) errors.push('First name is required.');
      if (!fields.lastName.trim())  errors.push('Last name is required.');
      if (!fields.email.trim()) {
        errors.push('Email is required.');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
        errors.push('Please enter a valid email address.');
      }
      if (!fields.message.trim()) errors.push('Message is required.');

      // Show validation errors
      var msgEl = form.querySelector('.form-message');
      if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.className = 'form-message';
        form.appendChild(msgEl);
      }

      if (errors.length) {
        msgEl.className = 'form-message form-message--error';
        msgEl.textContent = errors.join(' ');
        return;
      }

      // --- Submit ---
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending\u2026';
      }
      msgEl.className = 'form-message';
      msgEl.textContent = '';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Server responded with ' + res.status);
          return res.json();
        })
        .then(function () {
          msgEl.className = 'form-message form-message--success';
          msgEl.textContent = 'Thank you! Your message has been sent.';
          form.reset();
        })
        .catch(function () {
          msgEl.className = 'form-message form-message--error';
          msgEl.textContent = 'Something went wrong. Please try again or email us directly.';
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
        });
    });
  }

  /* ==========================================================================
     7. SMOOTH SCROLL
     Intercepts clicks on anchor links (href="#section") and scrolls
     smoothly. Also handles arriving from another page with a hash.
     ========================================================================== */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="#"]');
      if (!link) return;

      var href = link.getAttribute('href');

      // Only handle same-page anchors or hash-only links
      var hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      var path = href.substring(0, hashIndex);
      var hash = href.substring(hashIndex);

      // If the link points to a different page, let the browser navigate normally
      if (path && path !== '' && !location.pathname.endsWith(path)) return;

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });

      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, null, hash);
      }
    });

    // On page load, scroll to hash if present (e.g. arriving from another page)
    if (window.location.hash) {
      var target = document.querySelector(window.location.hash);
      if (target) {
        // Small delay so the browser finishes layout first
        setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }

  /* ==========================================================================
     8. ACTIVE NAV HIGHLIGHTING
     Adds an .active class to the nav link that matches the current page URL.
     ========================================================================== */
  function initActiveNav() {
    var links = document.querySelectorAll('.nav-links a');
    if (!links.length) return;

    // For multi-page sites (blog, case-studies, legal pages) just match by path
    var currentPath = window.location.pathname;
    var isSinglePage = currentPath === '/' || currentPath === '/index.html';

    if (!isSinglePage) {
      links.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        var hrefPath = href.split('#')[0];
        // Normalise both paths
        var norm = function(p) { return p.replace(/^.*\//, '').replace(/\.html$/, '').replace(/\/$/, '') || 'index'; };
        var linkPage = norm(hrefPath);
        var curPage = norm(currentPath);
        if (linkPage && linkPage === curPage) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      return;
    }

    // Single-page scroll spy — highlight whichever section is most in view
    // Find the "Products & Cases" link so we can map #case-studies to it too
    var productsCasesLink = null;
    links.forEach(function (link) {
      if ((link.getAttribute('href') || '').indexOf('#products') !== -1) {
        productsCasesLink = link;
      }
    });

    var sections = [];
    links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var hash = href.indexOf('#') !== -1 ? href.split('#')[1] : null;
      if (hash) {
        var el = document.getElementById(hash);
        if (el) sections.push({ link: link, el: el });
      }
    });

    // Also watch #case-studies and map it to the Products & Cases nav link
    if (productsCasesLink) {
      var caseEl = document.getElementById('case-studies');
      if (caseEl) sections.push({ link: productsCasesLink, el: caseEl });
    }

    function updateActive() {
      var scrollY = window.scrollY || window.pageYOffset;
      var winH = window.innerHeight;
      var best = null;
      var bestRatio = -1;

      sections.forEach(function (s) {
        var rect = s.el.getBoundingClientRect();
        // How much of the section is visible
        var visible = Math.min(rect.bottom, winH) - Math.max(rect.top, 0);
        var ratio = visible / Math.max(s.el.offsetHeight, 1);
        if (ratio > bestRatio) { bestRatio = ratio; best = s; }
      });

      links.forEach(function (link) { link.classList.remove('active'); });
      if (best && bestRatio > 0.05) best.link.classList.add('active');
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ==========================================================================
     BOOT
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initClientTicker();
    initModalSystem();
    initScrollReveal();
    initPromoBanner();
    initMobileNav();
    initContactForm();
    initSmoothScroll();
    initActiveNav();
  });

})();
