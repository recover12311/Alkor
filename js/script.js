document.addEventListener('DOMContentLoaded', () => {
  const modal       = document.getElementById('logoModal');
  const video       = document.getElementById('logoFullVideo');
  const trigger     = document.getElementById('logoTrigger');
  const closeBtn    = document.getElementById('closeModal');
  const wrapper     = document.querySelector('.logo-video-wrapper');

  function playAndFly() {
    modal.classList.remove('flying');
    modal.classList.add('active');
    video.currentTime = 0;
    video.playbackRate = 1.35;
    video.play().catch(() => {});

    video.onended = () => {
      const logoRect = trigger.getBoundingClientRect();
      const modalRect = wrapper.getBoundingClientRect();

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const endX = logoRect.left + logoRect.width / 2 - centerX;
      const endY = logoRect.top + logoRect.height / 2 - centerY;

      const finalScale = Math.min(logoRect.width, logoRect.height) / Math.min(modalRect.width, modalRect.height) * 0.9;

      wrapper.style.setProperty('--fly-x', `${endX}px`);
      wrapper.style.setProperty('--fly-y', `${endY}px`);
      wrapper.style.setProperty('--final-scale', finalScale);

      modal.classList.add('flying');

      setTimeout(() => {
        modal.classList.remove('active', 'flying');
        wrapper.style.removeProperty('--fly-x');
        wrapper.style.removeProperty('--fly-y');
        wrapper.style.removeProperty('--final-scale');
      }, 1500); // трохи довше, щоб анімація завершилася
    };
  }

  // Автозапуск при першому завантаженні
  setTimeout(playAndFly, 800); // невелика затримка, щоб не лякало одразу

  // Повтор при кліку
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    playAndFly();
  });

  // Закриття
  closeBtn.addEventListener('click', () => {
    video.pause();
    modal.classList.remove('active', 'flying');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      video.pause();
      modal.classList.remove('active', 'flying');
    }
  });
});