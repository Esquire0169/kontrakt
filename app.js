document.addEventListener('DOMContentLoaded', () => {
  // Регистрируем плагин ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Анимируем появление всех элементов с классом .glass-card, .glass-panel и заголовков
  const animateElements = document.querySelectorAll('.glass-card, .glass-panel, .section-title, .hero-title');
  
  animateElements.forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 60 }, // Начальное состояние: прозрачность 0, сдвиг вниз на 60px
      {
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // Анимация запустится, когда верх элемента достигнет 85% высоты окна
          toggleActions: "play none none none", // Проиграть один раз
        }
      }
    );
  });

  // Эффект параллакса для фоновых градиентов при движении мыши
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    
    const glow1 = document.querySelector('.glow-1');
    const glow2 = document.querySelector('.glow-2');
    
    if (glow1) gsap.to(glow1, { x: x, y: y, duration: 1.5, ease: "power2.out" });
    if (glow2) gsap.to(glow2, { x: -x * 0.7, y: -y * 0.7, duration: 1.5, ease: "power2.out" });
  });

  // Плавная прокрутка для всех якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('⚡ КОНТРАКТ: Все системы запущены.');
});
