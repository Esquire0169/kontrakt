document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ========== 1. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ==========
  const animatedItems = document.querySelectorAll('.glass-card, .glass-panel, .section-title, .hero-title');
  
  animatedItems.forEach((el, index) => {
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
          // Добавьте микро-задержку для волны (по желанию):
          // delay: index * 0.03
        }
      }
    );
  });

  // ========== 2. ПАРАЛЛАКС ФОНА (только десктоп, без GSAP) ==========
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
  } else if (glow1 && glow2) {
    // На тач-устройствах сбрасываем трансформации
    glow1.style.transform = '';
    glow2.style.transform = '';
  }

  // ========== 3. FAQ АККОРДЕОН ==========
  document.querySelectorAll('.faq-item h3').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      // Закрываем все
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      // Открываем текущий, если был закрыт
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ========== 4. АНИМИРОВАННЫЙ СЧЁТЧИК ВЫПЛАТ ==========
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
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counterEl.textContent = 'до 2 800 000 ₽';
      }
    };

    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(step);
        counterObserver.unobserve(counterEl);
      }
    }, { threshold: 0.5 });

    counterObserver.observe(counterEl);
  }
});
