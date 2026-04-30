// Typing animation
(function() {
  const words = ['completa', 'inteligente', 'integrada', 'moderna', 'segura'];
  const el = document.getElementById('typingText');
  if (!el) return;
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseMs = 0;

  function tick() {
    const word = words[wordIdx];
    if (deleting) {
      el.textContent = word.substring(0, charIdx--);
      if (charIdx < 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        pauseMs = 400;
      }
    } else {
      el.textContent = word.substring(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        pauseMs = 2000;
      }
    }
    setTimeout(tick, pauseMs || (deleting ? 40 : 80));
    pauseMs = 0;
  }
  setTimeout(tick, 600);
})();

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
  // Escape closes mobile menu
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      document.getElementById('navMobileBtn')?.focus();
    }
    // Close open FAQ items
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  }
});

// Make FAQ keyboard accessible (Enter/Space)
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('role', 'button');
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// Skip navigation link (accessibility)
const skipLink = document.createElement('a');
skipLink.href = '#contato';
skipLink.className = 'skip-nav';
skipLink.textContent = 'Pular para o conteudo';
document.body.insertBefore(skipLink, document.body.firstChild);

// Focus visible styles for all interactive elements
document.querySelectorAll('a, button, input, textarea, [tabindex]').forEach(el => {
  el.addEventListener('focus', () => el.classList.add('focus-visible'));
  el.addEventListener('blur', () => el.classList.remove('focus-visible'));
});

// Navbar scroll effect + Progress bar + Back to top
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  navbar.classList.toggle('scrolled', scrollTop > 20);
  scrollProgress.style.width = scrollPercent + '%';
  backToTop.classList.toggle('visible', scrollTop > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile menu
const mobileBtn = document.getElementById('navMobileBtn');
const navLinks = document.getElementById('navLinks');
mobileBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Animated counter
function animateCounter(el, target, suffix) {
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString('pt-BR') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Scroll animations + counter trigger
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      if (entry.target.classList.contains('stat-item')) {
        const numEl = entry.target.querySelector('.stat-number');
        if (numEl && !numEl.dataset.animated) {
          numEl.dataset.animated = 'true';
          const text = numEl.textContent.trim();
          const num = parseInt(text.replace(/[^\d]/g, ''));
          const suffix = text.includes('+') ? '+' : '';
          animateCounter(numEl, num, suffix);
        }
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up, .stat-item').forEach(el => observer.observe(el));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Phone mask (XX) XXXXX-XXXX
const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
  telefoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 6) v = '(' + v.substring(0,2) + ') ' + v.substring(2,7) + '-' + v.substring(7);
    else if (v.length > 2) v = '(' + v.substring(0,2) + ') ' + v.substring(2);
    else if (v.length > 0) v = '(' + v;
    e.target.value = v;
  });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    // Honeypot: se o campo invisível "website" foi preenchido, é bot
    const hp = contactForm.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== '') {
      // Finge sucesso para o bot não tentar de novo
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    const data = Object.fromEntries(new FormData(contactForm));
    delete data.website;
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        if (typeof gtag === 'function') gtag('event', 'form_submit', { event_category: 'contato' });
      } else {
        const err = await res.json().catch(() => ({}));
        btn.textContent = err.error || 'Erro. Tente novamente.';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Erro de conexão. Tente novamente.';
      btn.disabled = false;
    }
  });
}

// Track CTA clicks (GA4)
document.querySelectorAll('[data-event]').forEach(el => {
  el.addEventListener('click', () => {
    const event = el.getAttribute('data-event');
    if (typeof gtag === 'function') gtag('event', event, { event_category: 'cta' });
  });
});

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector('.nav-links a[href="#' + id + '"]');
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        link.classList.add('nav-active');
      } else {
        link.classList.remove('nav-active');
      }
    }
  });
});
