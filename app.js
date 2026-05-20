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

  // ---------- БУРГЕР-МЕНЮ ----------
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      burgerBtn.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        burgerBtn.classList.remove('active');
      });
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

  // ---------- СЧЁТЧИК ВЫПЛАТ ----------
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

  // ---------- ОТПРАВКА ФОРМЫ В TELEGRAM ----------
  const form = document.getElementById('applyForm');
  if (form) {
    const statusEl = document.getElementById('formStatus');
    const whatsappLink = document.getElementById('whatsappLink');

    const updateWhatsappLink = () => {
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const age = document.getElementById('age').value;
      const city = document.getElementById('city').value;
      const text = `Заявка на контракт:%0AФИО: ${name}%0AВозраст: ${age}%0AТелефон: ${phone}%0AГород: ${city}`;
      whatsappLink.href = `https://wa.me/79161234567?text=${text}`; // ← замените на свой номер
    };

    document.querySelectorAll('#applyForm input').forEach(input => {
      input.addEventListener('input', updateWhatsappLink);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const age = document.getElementById('age').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const city = document.getElementById('city').value.trim();

      if (!name || !age || !phone || !city) {
        statusEl.textContent = 'Пожалуйста, заполните все поля.';
        statusEl.style.display = 'block';
        return;
      }

      const message = `📩 Новая заявка с сайта КОНТРАКТ:%0AИмя: ${name}%0AВозраст: ${age}%0AТелефон: ${phone}%0AГород: ${city}`;

      const BOT_TOKEN = 'YOUR_BOT_TOKEN';   // ← замените на токен бота
      const CHAT_ID = 'YOUR_CHAT_ID';       // ← замените на ID чата

      try {
        statusEl.textContent = 'Отправка...';
        statusEl.style.display = 'block';
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
          })
        });
        const data = await response.json();
        if (data.ok) {
          statusEl.textContent = 'Заявка успешно отправлена! Мы свяжемся с вами.';
          form.reset();
        } else {
          throw new Error('Ошибка отправки');
        }
      } catch (error) {
        statusEl.textContent = 'Не удалось отправить. Попробуйте позже или напишите в WhatsApp.';
      }
    });
  }
});
