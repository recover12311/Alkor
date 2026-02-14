document.addEventListener('DOMContentLoaded', () => {
  // Елементи
  const modal       = document.getElementById('logoModal');
  const video       = document.getElementById('logoFullVideo');
  const audio       = document.getElementById('logoAudio');
  const trigger     = document.getElementById('logoTrigger');
  const closeBtn    = document.getElementById('closeModal');
  const wrapper     = document.querySelector('.logo-video-wrapper');

  let userHasInteracted = false;

  // Ловимо першу взаємодію (для розблокування в майбутньому)
  document.addEventListener('click', () => {
    if (!userHasInteracted) {
      userHasInteracted = true;
      console.log('Користувач взаємодіяв → аудіо розблоковано для подальших дій');
      // Спроба "розбудити" аудіо після першої взаємодії
      if (audio && audio.paused) {
        audio.muted = false;
        audio.play().catch(e => {
          console.warn('Розблокування аудіо після взаємодії не вдалося:', e.name, e.message);
        });
      }
    }
  }, { once: true });

  function resetMedia() {
    video.currentTime = 0;
    if (audio) {
      audio.currentTime = 0;
      audio.muted = false; // на всяк випадок
    }
  }

  function playAndFly() {
    modal.classList.remove('flying');
    modal.classList.add('active');

    resetMedia();
    video.playbackRate = 1.35;

    // Відео — завжди (muted дозволено)
    video.play().catch(err => {
      console.warn('Помилка відео:', err.message);
    });

    // Аудіо — намагаємось завжди, коли модалка відкрита
    if (audio) {
      audio.play()
        .then(() => {
          console.log('Аудіо запущено успішно');
        })
        .catch(err => {
          console.warn('Помилка запуску аудіо:', err.name, err.message);
          console.warn('Найчастіше: NotAllowedError → потрібно більше взаємодії або файл не завантажився');
          // Якщо помилка — можна додати кнопку "Увімкнути звук" (нижче приклад)
        });
    }

    video.onended = () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      const logoRect   = trigger.getBoundingClientRect();
      const modalRect  = wrapper.getBoundingClientRect();

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const endX = logoRect.left + logoRect.width / 2 - centerX;
      const endY = logoRect.top + logoRect.height / 2 - centerY;

      const finalScale = Math.min(logoRect.width, logoRect.height) /
                         Math.min(modalRect.width, modalRect.height) * 0.9;

      wrapper.style.setProperty('--fly-x', `${endX}px`);
      wrapper.style.setProperty('--fly-y', `${endY}px`);
      wrapper.style.setProperty('--final-scale', finalScale);

      modal.classList.add('flying');

      setTimeout(() => {
        modal.classList.remove('active', 'flying');
        wrapper.style.removeProperty('--fly-x');
        wrapper.style.removeProperty('--fly-y');
        wrapper.style.removeProperty('--final-scale');
      }, 1500);
    };
  }

  // Автозапуск модалки (відео + спроба звуку)
  setTimeout(() => {
    playAndFly();
  }, 800);

  // Клік по логотипу — повторно намагаємось звук
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    userHasInteracted = true;
    playAndFly();
  });

  // Закриття
  closeBtn.addEventListener('click', () => {
    video.pause();
    if (audio) audio.pause();
    modal.classList.remove('active', 'flying');
    wrapper.style.removeProperty('--fly-x');
    wrapper.style.removeProperty('--fly-y');
    wrapper.style.removeProperty('--final-scale');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      video.pause();
      if (audio) audio.pause();
      modal.classList.remove('active', 'flying');
      wrapper.style.removeProperty('--fly-x');
      wrapper.style.removeProperty('--fly-y');
      wrapper.style.removeProperty('--final-scale');
    }
  });
});