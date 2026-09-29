/**
 * Mohammed Akther S — Portfolio Web Application
 * Interactivity: Custom Cursor, IntersectionObserver Animations, Counters, Proof Filter Tabs, Lightbox & Script Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavigation();
  initScrollAnimations();
  initStatCounters();
  initProofFilterTabs();
  initModals();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. CUSTOM CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.cursor-dot');
  
  if (!cursor || !dot) return;

  // Touch-only devices with no mouse
  if (window.matchMedia('(pointer: coarse) and (hover: none)').matches) {
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let isVisible = false;

  function showCursor() {
    if (!isVisible) {
      isVisible = true;
      document.documentElement.classList.add('has-custom-cursor');
      cursor.style.opacity = '1';
      dot.style.opacity = '1';
    }
  }

  window.addEventListener('mousemove', (e) => {
    showCursor();
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    dot.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    showCursor();
  });

  window.addEventListener('mousedown', () => {
    cursor.classList.add('cursor-clicking');
  });

  window.addEventListener('mouseup', () => {
    cursor.classList.remove('cursor-clicking');
  });

  function render() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Hover states
  const attachHoverListeners = () => {
    const interactives = document.querySelectorAll('a, button, input, textarea, select, .skill-card, .process-card, .service-card, .navbar-brand, .proof-tab-btn, .floating-ball-btn, .filter-btn, [role="button"]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    const viewables = document.querySelectorAll('.proof-card, .client-logo-card, .case-study-card, .client-logo-badge');
    viewables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-view'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-view'));
    });
  };

  attachHoverListeners();
}

/* --------------------------------------------------------------------------
   2. NAVIGATION & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu a');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.innerHTML = '☰';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section scrollspy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.client-row-entry, .case-study-card, .skill-card, .process-card, .service-card, .timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   4. ANIMATED COUNTERS
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statsSection = document.getElementById('results');
  if (!statsSection) return;

  const statItems = statsSection.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statItems.forEach(item => {
          const target = parseInt(item.getAttribute('data-target'), 10);
          animateNumber(item, target, 1800);
        });
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);

  function animateNumber(element, target, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * target);
      element.innerHTML = `${current}<span class="plus">+</span>`;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.innerHTML = `${target}<span class="plus">+</span>`;
      }
    }
    requestAnimationFrame(update);
  }
}

/* --------------------------------------------------------------------------
   5. PROOF & SKILLS ECOSYSTEM FILTER TABS
   -------------------------------------------------------------------------- */
function initProofFilterTabs() {
  const tabs = document.querySelectorAll('.proof-tab-btn');
  const cards = document.querySelectorAll('.proof-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. MODALS (LIGHTBOX & SCRIPT TELEPROMPTER)
   -------------------------------------------------------------------------- */
const scriptData = {
  edutechx: {
    title: "EduTechX — Career Transition Video Script",
    language: "Tanglish (Tamil + English) • Reel / Short Format",
    content: `EduTechX – Non-IT-la Irundhu IT-ku Move Aaganuma?

Neenga Non-IT field-la work pannitu irukeenga...
Aana IT-ku shift aaganum-nu romba naala yosichitu irukeengala?

Enakku IT background illa... naan eppadi start panradhunu doubt irukka?

First oru vishayam understand pannunga... IT-ku move aaganumna, unga previous field-a completely forget panna thevai illa.

Unga existing skills-oda, right IT domain-a choose panni, step-by-step-a new technical skills develop pannina podhum.

Aana inga dhaan neraya per mistake panraanga...
Random-ah oru course join pannitu, enna learn panradhu-nu theriyama confuse aagidraanga.

Adhanala first unga goal enna, endha IT role unga profile-ku suit aagum, adhukku enna skills venum-nu identify pannunga.

Oru proper roadmap irundha... Non-IT-la irundhu IT-ku transition aaguradhu definitely more achievable.

Neengalum IT-ku switch aaganum-na, EduTechX page-a follow pannunga.
Unga career transition-ku useful-aana guidance innum neraya varum!`
  },
  kastrategist: {
    title: "KA Strategist — Strategic Marketing Reel Script",
    language: "Tanglish (Tamil + English) • Agency Growth & Conversion",
    content: `Reel Script – KA Strategist

Post podreenga... Ads run panreenga... Instagram-la active-ah irukeenga... Aana business grow aagala?

Oru naal offer post... next day oru reel... apram random-ah oru ad...
Marketing panreenga... aana strategy illa.

Actually, problem Facebook-um illa... Instagram-um illa...
Problem... random marketing.

Marketing start panradhukku munnaadi,
unga target audience yaaru, avanga problem enna, avanga enga irukaanga-nu first understand pannanum.

Adhukku apram dhaan... right content, right platform, right ads, right strategy ellame.

Marketing-na just post podradhu illa...
Ads run panradhu mattum illa.
Every action-kum oru purpose irukkanum.

Budget spend panradhukku munnaadi... strategy-la invest pannunga.
Because random marketing gets attention...
Strategic marketing gets business.`
  },
  zonesuite: {
    title: "Zone Business Suite — B2B SaaS CRM Video Script",
    language: "English • B2B Lead Generation & Automation",
    content: `Reel Script – Zone Business Suite

"Still managing your business with Excel sheets, WhatsApp and endless follow-ups?"

"Missed leads, forgotten follow-ups, scattered customer data... it's costing you business."

"Bring everything together with Zone Business Suite."

"Manage leads, customer data, sales follow-ups, team activities and business insights—all from one place."

"Less manual work. Better follow-ups. More control over your business."

"Simplify your business with Zone Business Suite. Book your demo today."`
  }
};

function initModals() {
  const modal = document.getElementById('global-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('open');
    modalBody.innerHTML = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Image lightbox triggers
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = el.getAttribute('data-lightbox');
      const title = el.getAttribute('data-title') || 'Visual Asset Proof';

      modalTitle.textContent = title;
      modalBody.innerHTML = `<img src="${imgSrc}" class="modal-media-img" alt="${title}" />`;
      modal.classList.add('open');
    });
  });

  // Script teleprompter modal triggers
  document.querySelectorAll('[data-script]').forEach(btn => {
    btn.addEventListener('click', () => {
      const scriptId = btn.getAttribute('data-script');
      const data = scriptData[scriptId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalBody.innerHTML = `
        <div style="margin-bottom: 16px;">
          <span class="section-tag" style="font-size: 0.75rem; margin-bottom: 8px;">${data.language}</span>
        </div>
        <div class="script-teleprompter">${escapeHtml(data.content)}</div>
      `;
      modal.classList.add('open');
    });
  });

  // Video preview triggers with real Instagram Reel URLs
  const videoLinks = {
    edutechx: 'https://www.instagram.com/reel/DcoGbLOFaZp/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
    kastrategist: 'https://www.instagram.com/reel/DbdYEMODcAq/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
    zonesuite: 'https://www.instagram.com/reel/DctXWozPGbO/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA=='
  };

  document.querySelectorAll('[data-video]').forEach(btn => {
    btn.addEventListener('click', () => {
      const videoId = btn.getAttribute('data-video');
      const videoTitle = btn.getAttribute('data-video-title') || 'Video Script & Production Sample';
      const client = btn.getAttribute('data-video-client') || 'Featured Brand';
      const reelUrl = videoLinks[videoId] || 'https://www.instagram.com/';
      
      modalTitle.textContent = `${videoTitle} — ${client}`;
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px;">▶</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 10px; color: #FFFFFF;">${videoTitle}</h3>
          <p style="color: #94A3B8; max-width: 480px; margin: 0 auto 24px;">This video was written and strategized by Mohammed Akther S for ${client}. Watch the live published reel on Instagram below.</p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a href="${reelUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Watch Reel on Instagram ↗</a>
            <a href="https://wa.me/917598659030?text=Hi%20Mohammed,%20I'd%20like%20to%20discuss%20video%20scripts%20like%20${encodeURIComponent(videoTitle)}" target="_blank" class="btn btn-whatsapp">Chat on WhatsApp 💬</a>
          </div>
        </div>
      `;
      modal.classList.add('open');
    });
  });
}

function escapeHtml(string) {
  return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#contact-name').value.trim();
    const email = form.querySelector('#contact-email').value.trim();
    const service = form.querySelector('#contact-service').value;
    const message = form.querySelector('#contact-message').value.trim();

    if (!name || !message) {
      alert('Please provide your name and a brief description of your project.');
      return;
    }

    const waText = `Hi Mohammed! My name is ${name} (${email || 'no email provided'}). I am reaching out regarding ${service}: "${message}"`;
    const waUrl = `https://wa.me/917598659030?text=${encodeURIComponent(waText)}`;

    window.open(waUrl, '_blank');
    form.reset();
  });
}
