document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Анимация появления (оставляем)
  const animateElements = document.querySelectorAll('.glass-card, .glass-panel, .section-title, .hero-title');
  animateElements.forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
    });
  });

  // ====== ОПТИМИЗИРОВАННЫЙ ПАРАЛЛАКС ======
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');
  
  if (!isTouchDevice && glow1 && glow2) {
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 6; // уменьшили амплитуду
          const y = (e.clientY / window.innerHeight - 0.5) * 6;
          gsap.to(glow1, { x, y, duration: 2.2, ease: "power2.out", overwrite: "auto" });
          gsap.to(glow2, { x: -x * 0.6, y: -y * 0.6, duration: 2.2, ease: "power2.out", overwrite: "auto" });
          ticking = false;
        });
        ticking = true;
      }
    });
  } else {
    // На тач-устройствах просто отключаем параллакс
    if (glow1) glow1.style.transform = 'translate(0,0) scale(1)';
    if (glow2) glow2.style.transform = 'translate(0,0) scale(1)';
  }

  // FAQ toggle (оставляем)
  document.querySelectorAll('.faq-item h3').forEach(item => {
    item.addEventListener('click', () => {
      item.parentElement.classList.toggle('active');
    });
  });

  // Счётчик (оставляем)
  const counterEl = document.getElementById('counterUsers');
  if (counterEl) {
    const target = 2800000;
    const duration = 1500;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      counterEl.textContent = current.toLocaleString('ru-RU') + ' ₽';
      if (progress < 1) requestAnimationFrame(step);
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
