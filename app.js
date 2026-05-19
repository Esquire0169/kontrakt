(function() {
  // ----- BURGER MENU -----
  const burger = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // ----- 3D TILT ДЛЯ КАРТОЧЕК -----
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(5px)`;
      card.style.boxShadow = '0 35px 55px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(100,150,220,0.5)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.boxShadow = '';
    });
  });

  // ----- SCROLL REVEAL (Intersection Observer) -----
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });

  revealElements.forEach(el => observer.observe(el));

  // ----- ANIMATED COUNTER -----
  const counterEl = document.getElementById('counterUsers');
  if (counterEl) {
    const target = 24583;
    const duration = 2000;
    let startTime = null;
    let animationId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      counterEl.textContent = current.toLocaleString('ru-RU');
      if (progress < 1) {
        animationId = requestAnimationFrame(step);
      } else {
        counterEl.textContent = target.toLocaleString('ru-RU');
      }
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTime = null;
          requestAnimationFrame(step);
          counterObserver.unobserve(counterEl);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(counterEl);
  }

  // ----- MOUSE PARALLAX ДЛЯ ФОНОВЫХ ГРАДИЕНТОВ -----
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    const glow1 = document.querySelector('.glow-1');
    const glow2 = document.querySelector('.glow-2');
    if (glow1) glow1.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
    if (glow2) glow2.style.transform = `translate(${-x * 0.7}px, ${-y * 0.7}px) scale(1.05)`;
  });

  // ----- SMOOTH SCROLL ДЛЯ ЯКОРЕЙ (если будут) -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
