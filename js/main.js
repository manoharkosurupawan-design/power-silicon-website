/**
 * Power Silicon Technologies — Main Interactions & Logic
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

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

  // Close mobile drawer when clicking any link
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
      // If within dropdown, highlight parent nav-link too
      const parentItem = link.closest('.nav-item');
      if (parentItem) {
        parentItem.querySelector('.nav-link')?.classList.add('active');
      }
    }
  });

  // 4. Animated Number Counters
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
          // Ease-out cubic
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

  // 5. Interactive Tabs
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

  // 6. Interactive FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      // Close sibling accordions if needed
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

  // 7. Modals (Careers & RFQ)
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('.modal-close, [data-modal-close]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        // If job title is passed
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

  // 8. Contact & RFQ Form Submissions
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

        // Show success modal or alert
        if (successModal) {
          successModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        } else {
          alert('Thank you for contacting Power Silicon Technologies! Our engineering team will review your inquiry and respond within 24 business hours.');
        }
      }, 900);
    });
  }

  // 9. Job Application Form Submission
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

  // 10. Newsletter Form
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you for subscribing to Silicon Insights! You will receive our latest VLSI & engineering updates.');
      form.reset();
    });
  });

});
