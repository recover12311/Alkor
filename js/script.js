document.addEventListener('DOMContentLoaded', () => {
  // ─── Логотип з анімованим відео ───
  const modal       = document.getElementById('logoModal');
  const video       = document.getElementById('logoFullVideo');
  const trigger     = document.getElementById('logoTrigger');
  const closeBtn    = document.getElementById('closeModal');

  function playAndFly() {
    modal.classList.remove('flying');
    modal.classList.add('active');
    video.currentTime = 0;
    video.playbackRate = 1.35;          // швидкість video
    video.play().catch(() => {});

    video.onended = () => {
      // Розрахунок позиції логотипа для точного "прильоту"
      const logoRect = trigger.getBoundingClientRect();
      const videoWrapper = document.querySelector('.logo-video-wrapper');
      
      const startX = (window.innerWidth - videoWrapper.offsetWidth) / 2;
      const startY = (window.innerHeight - videoWrapper.offsetHeight) / 2;
      
      const endX = logoRect.left + logoRect.width / 2 - startX;
      const endY = logoRect.top + logoRect.height / 2 - startY;
      
      const finalScale = 0.08;

      videoWrapper.style.setProperty('--fly-x', `${endX}px`);
      videoWrapper.style.setProperty('--fly-y', `${endY}px`);
      videoWrapper.style.setProperty('--final-scale', finalScale);

      modal.classList.add('flying');
      
      setTimeout(() => {
        modal.classList.remove('active', 'flying');
        videoWrapper.style.removeProperty('--fly-x');
        videoWrapper.style.removeProperty('--fly-y');
        videoWrapper.style.removeProperty('--final-scale');
      }, 1400); // трохи більше, ніж тривалість transition 1.3s
    };
  }

  // Автозапуск один раз
  playAndFly();

  // Повтор по кліку на логотип
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    playAndFly();
  });

  // Закриття по хрестику
  closeBtn.addEventListener('click', () => {
    video.pause();
    modal.classList.remove('active', 'flying');
  });

  // Закриття по кліку на фон
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      video.pause();
      modal.classList.remove('active', 'flying');
    }
  });

  // ─── Lightbox для галереї-каруселі ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  // Прив'язуємо кліки до всіх фото в каруселі
  const carouselImages = document.querySelectorAll('.carousel-track img');
  carouselImages.forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src);
    });
  });

  // Закриття lightbox
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      closeLightbox();
    }
  });

  // Закриття по клавіші Escape (зручно)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
});