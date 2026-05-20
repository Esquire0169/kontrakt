document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ========== 1. АНИМАЦИЯ ПОЯВЛЕНИЯ ==========
  const animatedItems = document.querySelectorAll('.glass-card, .glass-panel, .section-title, .hero-title, .gallery-item');
  animatedItems.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
      }
    );
  });

  // ========== 2. ПАРАЛЛАКС (только десктоп) ==========
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

  // ========== 3. БУРГЕР-МЕНЮ ==========
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

  // ========== 4. FAQ АККОРДЕОН ==========
  document.querySelectorAll('.faq-item h3').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ========== 5. ЛАЙТБОКС ГАЛЕРЕИ ==========
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
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });
  }

  // ========== 6. СЧЁТЧИК ВЫПЛАТ ==========
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
      if (entries[0].isIntersecting) { requestAnimationFrame(step); obs.unobserve(counterEl); }
    }, { threshold: 0.5 });
    obs.observe(counterEl);
  }

  // ========== 7. ФОРМА ЗАЯВКИ ==========
  const form = document.getElementById('contractForm');
  if (form) {
    const errorEl = document.getElementById('formError');
    const successEl = document.getElementById('formSuccess');
    const whatsappLink = document.getElementById('whatsappLink');

    const updateWhatsappLink = () => {
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const age = document.getElementById('age').value;
      const city = document.getElementById('city').value;
      const text = `Заявка на контракт:%0AФИО: ${name}%0AВозраст: ${age}%0AТелефон: ${phone}%0AГород: ${city}`;
      whatsappLink.href = `https://wa.me/79161234567?text=${text}`; // ← замените на ваш номер
    };

    document.querySelectorAll('#contractForm input').forEach(input => {
      input.addEventListener('input', updateWhatsappLink);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.style.display = 'none';
      successEl.style.display = 'none';

      if (!form.checkValidity()) {
        if (!document.getElementById('consent').checked) {
          errorEl.textContent = 'Необходимо дать согласие на обработку персональных данных.';
          errorEl.style.display = 'block';
        } else {
          form.reportValidity();
        }
        return;
      }

      const name = document.getElementById('name').value.trim();
      const age = document.getElementById('age').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const city = document.getElementById('city').value.trim();

      const message = `📩 Новая заявка с сайта КОНТРАКТ:%0AИмя: ${name}%0AВозраст: ${age}%0AТелефон: ${phone}%0AГород: ${city}`;

      const BOT_TOKEN = 'YOUR_BOT_TOKEN';   // ← замените
      const CHAT_ID = 'YOUR_CHAT_ID';       // ← замените

      try {
        errorEl.style.display = 'none';
        successEl.style.display = 'block';
        successEl.textContent = 'Отправка...';

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
          successEl.textContent = 'Заявка успешно отправлена! Мы свяжемся с вами.';
          form.reset();
        } else {
          throw new Error('Ошибка отправки');
        }
      } catch (error) {
        successEl.style.display = 'none';
        errorEl.textContent = 'Не удалось отправить. Попробуйте позже или напишите в WhatsApp.';
        errorEl.style.display = 'block';
      }
    });
  }

  // ========== 8. COOKIE БАННЕР ==========
  function createCookieBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookieConsent';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-labelledby', 'cookieTitle');
    banner.hidden = true;
    banner.innerHTML = `
      <div class="cookie-content">
        <p id="cookieTitle">Мы используем cookie</p>
        <p>Продолжая использовать сайт, вы соглашаетесь на обработку файлов cookie в целях аналитики и улучшения работы. Подробнее — в нашей <a href="./privacy.html" target="_blank">Политике конфиденциальности</a>.</p>
        <div class="cookie-buttons">
          <button id="cookieAcceptAll" class="btn btn-primary" aria-label="Принять все cookie">Принять все</button>
          <button id="cookieSettingsBtn" class="btn btn-ghost" aria-label="Настроить cookie">Настроить</button>
        </div>
        <div id="cookieSettings" class="cookie-settings" hidden>
          <div class="settings-options">
            <label><input type="checkbox" id="cookieNecessary" checked disabled> Необходимые (обязательно)</label>
            <label><input type="checkbox" id="cookieAnalytics"> Аналитические (Яндекс.Метрика, Google Analytics)</label>
          </div>
          <button id="cookieSaveSettings" class="btn btn-primary">Сохранить настройки</button>
        </div>
      </div>
    `;
    document.body.prepend(banner);
    return banner;
  }

  const cookieBanner = document.getElementById('cookieConsent') || createCookieBanner();

  function hideBanner() { cookieBanner.setAttribute('hidden', ''); }
  function showBanner() { cookieBanner.removeAttribute('hidden'); }

  function setConsent(analytics) {
    localStorage.setItem('cookieConsent', analytics ? 'all' : 'necessary');
    localStorage.setItem('cookieConsentDate', Date.now());
    hideBanner();
    if (analytics && typeof gtag === 'function') {
      gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }
  }

  const consent = localStorage.getItem('cookieConsent');
  const consentDate = parseInt(localStorage.getItem('cookieConsentDate') || '0', 10);
  if (!consent || (Date.now() - consentDate > 30*24*60*60*1000)) {
    showBanner();
  }

  document.getElementById('cookieAcceptAll')?.addEventListener('click', () => setConsent(true));
  document.getElementById('cookieSettingsBtn')?.addEventListener('click', () => {
    const settings = document.getElementById('cookieSettings');
    settings.hidden = !settings.hidden;
    const analyticsCheck = document.getElementById('cookieAnalytics');
    analyticsCheck.checked = consent === 'all';
  });
  document.getElementById('cookieSaveSettings')?.addEventListener('click', () => {
    const analyticsCheck = document.getElementById('cookieAnalytics');
    setConsent(analyticsCheck.checked);
  });

  // ========== 9. ДИСКЛЕЙМЕР ПОСЛЕ ФУТЕРА ==========
  function createDisclaimer() {
    const bar = document.createElement('div');
    bar.className = 'disclaimer-bar';
    bar.setAttribute('role', 'contentinfo');
    bar.innerHTML = `
      <div class="container">
        ⚠️ Сайт не является государственным органом. Информация носит справочный характер. Официальный сайт Минобороны России: <a href="https://mil.ru" target="_blank" rel="noopener noreferrer">mil.ru</a>. Перед подачей заявки ознакомьтесь с <a href="./privacy.html">Политикой конфиденциальности</a> и <a href="./terms.html">Пользовательским соглашением</a>.
      </div>
    `;
    const footer = document.querySelector('footer');
    if (footer) {
      // Вставляем сразу после футера (на самый низ)
      footer.parentNode.insertBefore(bar, footer.nextSibling);
    } else {
      document.body.appendChild(bar);
    }
  }
  if (!document.querySelector('.disclaimer-bar')) {
    createDisclaimer();
  }
});
