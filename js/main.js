/**
 * Power Silicon Technologies — Main Interactions, 3D Soft Tilts & Logic
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 0. Futuristic Silicon Preloader Logic (Initial Visit & Page Reload)
  const preloader = document.getElementById('site-preloader');

  if (preloader) {
    let isReload = false;
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        isReload = true;
      } else if (performance.navigation && performance.navigation.type === 1) {
        isReload = true;
      }
    } catch (e) {}

    if (sessionStorage.getItem('pst_preloader_seen') && !isReload) {
      // Standard internal link navigation -> skip preloader
      preloader.remove();
    } else {
      // Initial visit or Explicit Reload -> show majestic startup screen
      sessionStorage.setItem('pst_preloader_seen', 'true');

      setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 700);
      }, 950);

      window.addEventListener('load', () => {
        setTimeout(() => {
          if (preloader && !preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            setTimeout(() => {
              if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
            }, 700);
          }
        }, 700);
      });
    }
  }

  // 1. Sticky Navigation Bar & Scroll Effect
  const header = document.querySelector('.site-header');
  function handleScroll() {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // 2. Mobile Navigation Drawer Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');

  function toggleMenu() {
    const isOpen = mobileDrawer?.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    mobileToggle?.classList.add('active');
    mobileDrawer?.classList.add('open');
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileToggle?.classList.remove('active');
    mobileDrawer?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', toggleMenu);
  mobileOverlay?.addEventListener('click', closeMenu);

  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // 3. Highlight Active Navigation Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link, .dropdown-item');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      const parentItem = link.closest('.nav-item');
      if (parentItem) {
        parentItem.querySelector('.nav-link')?.classList.add('active');
      }
    }
  });

  // 4. Interactive Movable & Spring-Back Physics Cards ("Sit in Position")
  const movableCards = document.querySelectorAll('.card, .workflow-step, .stat-block, .hero-image-card');

  movableCards.forEach(card => {
    card.classList.add('movable-card', 'tilt-card');

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let hasMoved = false;
    let isTouch = false;

    // Helper to get client coordinates
    function getEventPos(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    // Pointer Start (MouseDown / TouchStart)
    function onStart(e) {
      // Ignore clicks on buttons, inputs, links unless dragging intent
      if (e.target.closest('button, input, textarea, select, .btn, a:not(.card)')) return;

      isTouch = e.type === 'touchstart';
      const pos = getEventPos(e);
      isDragging = true;
      hasMoved = false;
      startX = pos.x;
      startY = pos.y;
      currentX = 0;
      currentY = 0;

      card.classList.remove('is-settling');
      card.classList.add('is-dragging');

      window.addEventListener(isTouch ? 'touchmove' : 'mousemove', onMove, { passive: false });
      window.addEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
      window.addEventListener(isTouch ? 'touchcancel' : 'blur', onEnd);
    }

    let dragRaf = null;
    let hoverRaf = null;

    // Pointer Move (Real-time movement with 3D inertia & soft resistance)
    function onMove(e) {
      if (!isDragging) return;

      const pos = getEventPos(e);
      const rawDeltaX = pos.x - startX;
      const rawDeltaY = pos.y - startY;

      // Check threshold for drag initiation
      if (Math.hypot(rawDeltaX, rawDeltaY) > 5) {
        hasMoved = true;
        if (isTouch && e.cancelable) {
          e.preventDefault(); // Prevent page scrolling while actively dragging card
        }
      }

      if (!hasMoved) return;

      // Soft damping curve for organic rubber-band resistance
      const damp = 0.85;
      currentX = rawDeltaX * damp;
      currentY = rawDeltaY * damp;

      if (dragRaf) cancelAnimationFrame(dragRaf);
      dragRaf = requestAnimationFrame(() => {
        const rotZ = Math.max(-10, Math.min(10, currentX * 0.06));
        const rotX = Math.max(-14, Math.min(14, -currentY * 0.07));
        const rotY = Math.max(-14, Math.min(14, currentX * 0.07));

        card.style.transform = `perspective(1000px) translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 35px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) rotateZ(${rotZ.toFixed(1)}deg) scale(1.03)`;
      });
    }

    // Pointer End (Release -> Spring back and gracefully sit in position)
    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      if (dragRaf) cancelAnimationFrame(dragRaf);

      window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
      window.removeEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
      window.removeEventListener(isTouch ? 'touchcancel' : 'blur', onEnd);

      card.classList.remove('is-dragging');

      if (hasMoved) {
        // Trigger smooth spring settling back to resting position
        card.classList.add('is-settling');
        card.style.transform = 'perspective(1000px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';

        setTimeout(() => {
          card.classList.remove('is-settling');
          hasMoved = false;
        }, 650);
      } else {
        card.style.transform = 'perspective(1000px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
      }
    }

    card.addEventListener('mousedown', onStart);
    card.addEventListener('touchstart', onStart, { passive: true });

    // Prevent accidental link clicking after dragging card
    card.addEventListener('click', function (e) {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Hover 3D Tilt when hovering and not dragging
    card.addEventListener('mousemove', function (e) {
      if (isDragging || hasMoved) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6.5;
      const rotateY = ((x - centerX) / centerX) * 6.5;

      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      hoverRaf = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) translate3d(0px, -6px, 12px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });
    });

    card.addEventListener('mouseleave', function () {
      if (isDragging || hasMoved) return;
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      card.style.transform = 'perspective(1000px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
    });
  });

  // 5. Dynamic Left-to-Position Slide & Sit Intersection Observer
  const scrollElements = document.querySelectorAll(
    '.card, .workflow-step, .section-title, .section-subtitle, .cta-banner, .stat-block, .section-header, .value-card, .table-container, .contact-card, .accordion-item, .rnd-card, .timeline-item'
  );

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('visible');

          // Once seated into position, enable full floating & tilt physics
          setTimeout(() => {
            el.classList.add('seated-in-position');
          }, 1800);

          scrollObserver.unobserve(el);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    scrollElements.forEach(el => {
      el.classList.add('slide-from-left');

      // Auto calculate staggered left-glide delay for cards inside grid containers
      const parentGrid = el.parentElement;
      if (parentGrid) {
        const isGrid = parentGrid.classList.contains('card-grid') ||
                       parentGrid.classList.contains('grid-3') ||
                       parentGrid.classList.contains('grid-4') ||
                       parentGrid.classList.contains('grid-2') ||
                       parentGrid.classList.contains('hero-stats-row') ||
                       parentGrid.classList.contains('workflow-grid');
        if (isGrid) {
          const siblings = Array.from(parentGrid.children);
          const idx = siblings.indexOf(el);
          if (idx >= 0) {
            el.style.transitionDelay = `${(idx * 0.35).toFixed(2)}s`;
          }
        }
      }

      scrollObserver.observe(el);
    });
  }

  // 6. Animated Number Counters
  const counters = document.querySelectorAll('.stat-count');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated || counters.length === 0) return;

    const firstCounter = counters[0];
    const rect = firstCounter.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.9) {
      countersAnimated = true;
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        const duration = 1800; // ms
        const startTime = performance.now();
        const suffix = counter.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = easeProgress * target;

          counter.innerText = isDecimal ? currentVal.toFixed(1) + suffix : Math.floor(currentVal) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = (isDecimal ? target.toFixed(1) : target) + suffix;
          }
        }

        requestAnimationFrame(updateCount);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  // 7. Interactive Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const parentContainer = btn.closest('.tabs-wrapper') || document;
      const targetId = btn.getAttribute('data-tab');

      parentContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parentContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = parentContainer.querySelector(`#${targetId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // 8. Interactive FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      const parentAccordion = item.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const sibBody = sibling.querySelector('.accordion-body');
            if (sibBody) sibBody.style.maxHeight = null;
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        if (body) body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // 9. Modals (Careers & RFQ)
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('.modal-close, [data-modal-close]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        const jobTitle = trigger.getAttribute('data-job-title');
        const roleInput = modal.querySelector('#modal-job-role');
        if (roleInput && jobTitle) {
          roleInput.value = jobTitle;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', function () {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // 10. Contact & RFQ Form Submissions
  const rfqForm = document.getElementById('rfq-form') || document.querySelector('.contact-form');
  const successModal = document.getElementById('success-modal');

  if (rfqForm) {
    rfqForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const submitBtn = rfqForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing RFQ...</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        rfqForm.reset();

        if (successModal) {
          successModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        } else {
          alert('Thank you for contacting Power Silicon Technologies! Our engineering team will review your inquiry and respond within 24 business hours.');
        }
      }, 900);
    });
  }

  // 11. Job Application Form Submission
  const careerForm = document.getElementById('career-form');
  if (careerForm) {
    careerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const modal = careerForm.closest('.modal-overlay');
      alert('Thank you for applying to Power Silicon Technologies! Our talent acquisition team will review your profile.');
      careerForm.reset();
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 12. Newsletter Form
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you for subscribing to Silicon Insights! You will receive our latest VLSI & engineering updates.');
      form.reset();
    });
  });

});
