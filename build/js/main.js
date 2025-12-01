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

  const megamenuItems = document.querySelectorAll('.megamenu__item');

  megamenuItems.forEach(item => {
    item.addEventListener('click', function () {

      const isMobile = window.innerWidth < 834;
      const isActive = item.classList.contains('megamenu__item-active');

      if (isMobile) {
        // Мобильная логика
        if (isActive) {
          // Повторный клик — снять активный класс
          item.classList.remove('megamenu__item-active');
        } else {
          // Назначить активный, снять у остальных
          megamenuItems.forEach(el => el.classList.remove('megamenu__item-active'));
          item.classList.add('megamenu__item-active');
        }
      } else {
        // Десктопная логика (всегда только один активный)
        megamenuItems.forEach(el => el.classList.remove('megamenu__item-active'));
        item.classList.add('megamenu__item-active');
      }

    });
  });

  /**
 * Аккордеон
 */
  function accordionFunc() {
    var accordionParents = document.querySelectorAll('.accordion-parent');
    if (!accordionParents.length) return;

    // Закрытие при клике вне активного блока
    document.addEventListener('click', function (e) {
      var active = document.querySelector('.accordion.accordion-active');
      if (!active) return;

      var body = active.querySelector('.accordion-body');
      if (!body) return;

      if (!body.contains(e.target) && !active.querySelector('.accordion-head').contains(e.target)) {
        active.classList.remove('accordion-active');
      }
    });

    // Закрытие по Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        var active = document.querySelector('.accordion.accordion-active');
        if (active) active.classList.remove('accordion-active');
      }
    });

    // Перебор всех аккордеонов
    for (var i = 0; i < accordionParents.length; i++) {
      (function (accordionContainer) {
        var accordions = accordionContainer.querySelectorAll('.accordion');

        for (var j = 0; j < accordions.length; j++) {
          (function (accordion) {
            var head = accordion.querySelector('.accordion-head');
            if (!head) return;

            head.addEventListener('click', function (e) {
              e.stopPropagation();

              var active = accordionContainer.querySelector('.accordion.accordion-active');
              if (active && active !== accordion) {
                active.classList.remove('accordion-active');
              }

              accordion.classList.toggle('accordion-active');
            });
          })(accordions[j]);
        }
      })(accordionParents[i]);
    }
  }
  accordionFunc();

  /**
 * Управляет поведением меню-бургера.
 */
  function burgerNav() {
    const burgerBtn = document.getElementById('burger-btn');

    const openMenu = () => {
      burgerBtn.classList.add('burger--open');
      document.documentElement.classList.add('menu--open');
      lenis.stop();
    };

    const closeMenu = () => {
      burgerBtn.classList.remove('burger--open');
      document.documentElement.classList.remove('menu--open');
      lenis.start();
    };

    const toggleMenu = (e) => {
      e.preventDefault();
      const isOpen = document.documentElement.classList.contains('menu--open');
      isOpen ? closeMenu() : openMenu();
    };

    burgerBtn.addEventListener('click', toggleMenu);

    window.addEventListener('keydown', (e) => {
      if (e.key === "Escape" && document.documentElement.classList.contains('menu--open')) {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      const isMenuOpen = document.documentElement.classList.contains('menu--open');
      const clickOnButton = burgerBtn.contains(event.target);

      if (isMenuOpen && !clickOnButton) {
        closeMenu();
      }
    });
  }
  burgerNav();

  const categorySlider = new Swiper('.category__slider', {
    slidesPerGroup: 1,
    slidesPerView: 'auto',
    spaceBetween: 10,
    loop: true,
    speed: 500,
    simulateTouch: true,
    watchOverflow: true,
    watchSlidesProgress: true,
    mousewheel: {
      forceToAxis: true,
      sensitivity: 1,
      releaseOnEdges: true
    },
    breakpoints: {
      835: { slidesPerView: 6, spaceBetween: 20 }
    },
    navigation: { nextEl: ".category-button-next" },
  });

});