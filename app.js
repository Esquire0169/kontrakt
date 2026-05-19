// app.js — общие скрипты для всех страниц
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Анимация появления элементов при скролле
  const animateElements = document.querySelectorAll('.glass-card, .glass-panel, .section-title, .hero-title');
  animateElements.forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
    });
  });

  // Параллакс для фоновых градиентов
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    gsap.to('.glow-1', { x, y, duration: 1.5, ease: "power2.out" });
    gsap.to('.glow-2', { x: -x * 0.7, y: -y * 0.7, duration: 1.5, ease: "power2.out" });
  });

  // FAQ toggle
  document.querySelectorAll('.faq-item h3').forEach(item => {
    item.addEventListener('click', () => {
      item.parentElement.classList.toggle('active');
    });
  });

  // Счётчик выплат (анимация)
  const counterEl = document.getElementById('counterUsers');
  if (counterEl) {
    const target = 2800000;
    const duration = 2000;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      counterEl.textContent = current.toLocaleString('ru-RU') + ' ₽';
      if (progress < 1) requestAnimationFrame(step);
    };
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { requestAnimationFrame(step); }
    }, { threshold: 0.5 }).observe(counterEl);
  }
});
