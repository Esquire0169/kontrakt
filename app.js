document.addEventListener('DOMContentLoaded', () => {
  // Регистрируем плагин ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Анимация появления при скролле ----------
  const animatedItems = document.querySelectorAll('.glass-card, .glass-panel, .section-title, .hero-title');
  animatedItems.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      }
    );
  });

  // ---------- Параллакс фоновых градиентов (только десктоп) ----------
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');

  if (!isTouch && glow1 && glow2) {
    let ticking = false;

    const updateGlow = (x, y) => {
      // Используем GSAP для плавного движения
      gsap.to(glow1, {
        x: x * 6,
        y: y * 6,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto"
      });
      gsap.to(glow2, {
        x: -x * 4,
        y: -y * 4,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    document.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5);
          const y = (e.clientY / window.innerHeight - 0.5);
          updateGlow(x, y);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---------- FAQ: аккордеон ----------
  document.querySelectorAll('.faq-item h3').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      // Закрываем все
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      // Если кликнутый не был активен — открываем
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
