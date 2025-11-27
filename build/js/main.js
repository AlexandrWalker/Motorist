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

  /**
 * Header Scroll
 */
  function headerFunc() {
    const header = document.getElementById('header');
    if (!header) return;

    const marker = 10;
    let lastScrollTop = 0;
    let ticking = false;
    let isOut = false;

    const scrollHandler = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      const scrollingDown = scrollPos > lastScrollTop && scrollPos > marker;
      const scrollingUp = scrollPos < lastScrollTop;

      if (scrollingDown && !isOut) {
        document.documentElement.classList.add('header-fixed');
        isOut = true;
      }

      if (scrollingUp && isOut) {
        document.documentElement.classList.remove('header-fixed');
        isOut = false;
      }

      lastScrollTop = scrollPos <= 0 ? 0 : scrollPos;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(scrollHandler);
        ticking = true;
      }
    });
  }

  headerFunc();

  const headerCatalog = document.getElementById('headerCatalog');

  headerCatalog.addEventListener('click', function () {
    document.documentElement.classList.toggle('header-catalog-open');

    if (document.documentElement.classList.contains('header-catalog-open')) {
      lenis.stop();
    } else {
      lenis.start();
    }
  })

  const dropoutParents = document.querySelectorAll('.dropout-parent');

  dropoutParents.forEach(dropoutParent => {
    dropoutParent.addEventListener('mouseenter', function () {
      dropoutParent.querySelector('.dropout').classList.add('dropout-show');
    })
    dropoutParent.addEventListener('mouseleave', function () {
      dropoutParent.querySelector('.dropout').classList.remove('dropout-show');
    })
  });

});