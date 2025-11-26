document.addEventListener('DOMContentLoaded', () => {

  const checkEditMode = document.querySelector('.bx-panel-toggle-on') ?? null;

  /**
   * Подключение ScrollTrigger
   */
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /**
   * Инициализация Lenis
   */
  const lenis = new Lenis({
    anchors: {
      offset: -60,
    },
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

});