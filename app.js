document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ---------- АНИМАЦИЯ ПОЯВЛЕНИЯ ----------
  const animatedItems = document.querySelectorAll('.glass-card, .glass-panel, .section-title, .hero-title, .gallery-item');
  animatedItems.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      }
    );
  });

  // ---------- ПАРАЛЛАКС (только десктоп) ----------
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');

  if (!isTouch && glow1 && glow2) {
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 12;
          const y = (e.clientY / window.innerHeight - 0.5) * 12;
          glow1.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          glow2.style.transform = `translate3d(${-x * 0.6}px, ${-y * 0.6}px, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---------- FAQ АККОРДЕОН ----------
  document.querySelectorAll('.faq-item h3').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ---------- ЛАЙТБОКС ГАЛЕРЕИ ----------
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      });
    });

    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  // ---------- СЧЁТЧИК ----------
  const counterEl = document.getElementById('counterBonus');
  if (counterEl) {
    const target = 2800000;
    const duration = 1500;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      counterEl.textContent = 'до ' + current.toLocaleString('ru-RU') + ' ₽';
      if (progress < 1) requestAnimationFrame(step);
      else counterEl.textContent = 'до 2 800 000 ₽';
    };
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(step);
        obs.unobserve(counterEl);
      }
    }, { threshold: 0.5 });
    obs.observe(counterEl);
  }
});
