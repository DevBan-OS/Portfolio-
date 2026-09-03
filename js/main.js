/**
 * Next-Gen Execution: Precision UI Interactions & Telemetry
 * Syed Akbar Haider Zaidi - Portfolio
 */

(function () {
  'use strict';

  // --- Global Toast Notification Helper ---
  const toast = document.getElementById('toast-notification');
  let toastTimeout = null;

  window.showToast = function (message) {
    if (!toast) return;
    const msgElement = toast.querySelector('.toast-message');
    if (msgElement) msgElement.textContent = message;

    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // --- Copy to Clipboard Chips ---
  const copyButtons = document.querySelectorAll('.btn-copy-chip');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Item';

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<span style="color: var(--primary);">✓ COPIED</span>`;
        window.showToast(`[CLIPBOARD] Copied ${label}: ${textToCopy}`);

        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 2500);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        window.showToast(`[CLIPBOARD] Copied ${label}: ${textToCopy}`);
      }
    });
  });

  // --- Contact Form Interaction ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('sender-name').value;
      const email = document.getElementById('sender-email').value;
      const message = document.getElementById('sender-message').value;

      if (!name || !email || !message) {
        window.showToast('[ERR] All payload fields are required.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>DISPATCHING PAYLOAD...</span>`;

      setTimeout(() => {
        submitBtn.innerHTML = `<span>✓ DISPATCHED TO SYED AKBAR</span>`;
        window.showToast(`[SENT] Message dispatched successfully from ${name}`);

        const mailtoLink = `mailto:akbarhaider897@gmail.com?subject=Company Inquiry from ${encodeURIComponent(
          name
        )}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          window.location.href = mailtoLink;
        }, 1500);
      }, 900);
    });
  }

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // --- Smooth Scroll for In-Page Anchors ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // --- Staggered Entrance & Reveal ---
  const revealElements = document.querySelectorAll('.bento-panel, .section-header-compact');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

})();
