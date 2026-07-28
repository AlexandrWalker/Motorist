document.addEventListener('DOMContentLoaded', () => {

  const checkEditMode = document.querySelector('.bx-panel-toggle-on') ?? null;

  /**
   * Подключение ScrollTrigger
   * Подключение SplitText
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
   * Функция поведения шапки сайта при скролле
   */
  (function headerFunc() {
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
  })();

  // const dropoutParents = document.querySelectorAll('.dropout-parent');
  // if (!dropoutParents) return;

  // dropoutParents.forEach(dropoutParent => {
  //   dropoutParent.addEventListener('mouseenter', function () {
  //     dropoutParent.querySelector('.dropout').classList.add('dropout-show');
  //   })
  //   dropoutParent.addEventListener('mouseleave', function () {
  //     dropoutParent.querySelector('.dropout').classList.remove('dropout-show');
  //   })
  // });

  /**
   * Функция выпадашки при наведении на dropout айтемы
   */
  (function dropoutFunc() {
    const isTouch = window.matchMedia('(hover: none)').matches;
    let activeDrop = null;
    let hoverTimer = null;

    function closeAll() {
      document.querySelectorAll('.dropout.is-active')
        .forEach(d => d.classList.remove('is-active'));
      activeDrop = null;
    }

    function openDrop(drop) {
      if (!drop) return;
      closeAll();
      drop.classList.add('is-active');
      activeDrop = drop;
    }

    // === hover/click на ссылках с data-dropout ===
    document.querySelectorAll('[data-dropout]').forEach(link => {
      const dropId = link.dataset.dropout;
      const drop = document.getElementById(dropId);
      if (!drop) return;

      if (!isTouch) {
        // DESKTOP hover с задержкой
        link.addEventListener('mouseenter', () => {
          hoverTimer = setTimeout(() => openDrop(drop), 180); // 180ms задержка
        });

        link.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimer); // отменяем открытие если ушли быстро
          hoverTimer = null;
          setTimeout(() => {
            if (!drop.matches(':hover')) {
              drop.classList.remove('is-active');
              if (activeDrop === drop) activeDrop = null;
            }
          }, 50);
        });

        drop.addEventListener('mouseleave', () => {
          drop.classList.remove('is-active');
          if (activeDrop === drop) activeDrop = null;
        });

      } else {
        // MOBILE click
        link.addEventListener('click', e => {
          e.preventDefault();
          if (drop.classList.contains('is-active')) {
            drop.classList.remove('is-active');
            activeDrop = null;
          } else {
            openDrop(drop);
          }
        });

        document.addEventListener('click', e => {
          if (!drop.contains(e.target) && e.target !== link) closeAll();
        });
      }
    });

    // === hover/leave для всех dropdown ===
    document.querySelectorAll('.dropout').forEach(drop => {
      if (!isTouch) {
        drop.addEventListener('mouseleave', () => {
          drop.classList.remove('is-active');
          if (activeDrop === drop) activeDrop = null;
        });
      }
    });

    // === кнопки открытия других dropdown через data-dropout-target ===
    document.querySelectorAll('[data-dropout-target]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const targetId = btn.dataset.dropoutTarget;
        const targetDrop = document.getElementById(targetId);
        if (!targetDrop) return;
        openDrop(targetDrop);
      });
    });

    // === кнопки закрытия текущего dropdown через data-dropout-close ===
    document.querySelectorAll('[data-dropout-close]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        if (activeDrop) {
          activeDrop.classList.remove('is-active');
          activeDrop = null;
        }
      });
    });

  })();

  /**
   * Добавление активного класса при клике на айтем megamenu__item
   */
  (function megamenuAddActive() {
    const megamenuItems = document.querySelectorAll('.megamenu__item');
    if (!megamenuItems.length) return;

    megamenuItems.forEach(item => {
      item.addEventListener('click', function () {

        const isMobile = window.innerWidth < 835;
        const isActive = item.classList.contains('megamenu__item-active');

        if (isMobile) {
          // Мобильная логика
          if (isActive) {
            // Повторный клик - снять активный класс
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
  })();

  /**
   * Аккордеон
   */
  (function accordionFunc() {
    var accordionParents = document.querySelectorAll('.accordion-parent');
    if (!accordionParents.length) return;
    // Закрытие при клике вне активного блока
    document.addEventListener('click', function (e) {
      var active = document.querySelector('.accordion.accordion-active');
      if (!active) return;

      var parent = active.closest('.accordion-parent');
      if (parent && parent.classList.contains('accordion-multiple')) return;

      var body = active.querySelector('.accordion-body');
      if (!body) return;

      if (
        !body.contains(e.target) &&
        !active.querySelector('.accordion-head').contains(e.target)
      ) {
        active.classList.remove('accordion-active');
      }
    });
    // Закрытие по Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        var active = document.querySelector('.accordion.accordion-active');
        if (!active) return;

        var parent = active.closest('.accordion-parent');
        if (parent && parent.classList.contains('accordion-multiple')) return;

        active.classList.remove('accordion-active');
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

              var isMultiple = accordionContainer.classList.contains('accordion-multiple');

              if (!isMultiple) {
                var active = accordionContainer.querySelector('.accordion.accordion-active');
                if (active && active !== accordion) {
                  active.classList.remove('accordion-active');
                }
              }

              accordion.classList.toggle('accordion-active');
            });
          })(accordions[j]);
        }
      })(accordionParents[i]);
    }
  })();

  /**
   * Инициализация раскрытия фильтра
   */
  // Универсальная функция для фильтра
  function initFilter(container) {
    container.forEach(element => {
      element.addEventListener('click', e => {
        // Клик по заголовку первого уровня
        if (e.target.classList.contains('filter__item-head')) {
          e.target.classList.toggle('active'); // добавляем/удаляем класс
          const subgroup = e.target.nextElementSibling;
          subgroup.classList.toggle('active'); // добавляем/удаляем класс
        }
        // Клик по чекбоксу второго уровня
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
          const nested = e.target.parentElement.nextElementSibling;
          const nestedParent = e.target.parentElement;
          if (nested && nested.classList.contains('filter__nested')) {
            nested.classList.toggle('active', e.target.checked);
            nestedParent.classList.toggle('active', e.target.checked);
          }
        }
      });
    });
  }
  // Инициализация
  initFilter(document.querySelectorAll('.filter'));

  /**
   * Всплывашка у фильтра
   */
  (function () {
    const catalogBody = document.querySelector('.catalog__body');
    if (!catalogBody) return;

    const filter = catalogBody.querySelector('.filter');
    const filterInner = filter.querySelector('.filter__inner');
    const filterDrop = filter.querySelector('.filter__drop');

    if (!filterDrop) return;

    const checkedOrder = [];
    const DESKTOP_BREAKPOINT = 834;

    let currentTop = 0;
    let targetTop = 0;
    let isAnimating = false;
    let isScrollPending = false; // Флаг для оптимизации скролла

    function isDesktop() {
      return window.innerWidth > DESKTOP_BREAKPOINT;
    }

    function getLastCheckedItem() {
      if (!checkedOrder.length) return null;
      return checkedOrder[checkedOrder.length - 1];
    }

    // Основная тяжелая функция расчетов
    function calculateTargetPosition() {
      const lastChecked = getLastCheckedItem();

      if (!lastChecked || !isDesktop()) {
        filterDrop.classList.remove('active');
        isAnimating = false;
        return;
      }

      const labelEl = lastChecked.closest('.filter__item');
      if (!labelEl || labelEl.offsetParent === null) {
        filterDrop.classList.remove('active');
        isAnimating = false;
        return;
      }

      const filterRect = filter.getBoundingClientRect();
      const bodyRect = catalogBody.getBoundingClientRect();
      const labelRect = labelEl.getBoundingClientRect();
      const dropHeight = filterDrop.offsetHeight;

      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const stickyTopOffset = 18 * rem;
      const stickyBottomOffset = 1 * rem;

      if (bodyRect.bottom < stickyTopOffset || bodyRect.top > window.innerHeight) {
        filterDrop.classList.remove('active');
        isAnimating = false;
        return;
      }

      filterDrop.classList.add('active');

      const absoluteMinTop = bodyRect.top - filterRect.top;
      const absoluteMaxTop = bodyRect.bottom - filterRect.top - dropHeight;

      const windowMinTop = Math.max(absoluteMinTop, stickyTopOffset - filterRect.top);
      const windowMaxTop = Math.min(absoluteMaxTop, window.innerHeight - filterRect.top - dropHeight - stickyBottomOffset);

      const labelCenterY = (labelRect.top - filterRect.top) + (labelRect.height / 2);
      const dropHalfHeight = dropHeight / 2;
      let calculatedTop = labelCenterY - dropHalfHeight;

      if (calculatedTop < windowMinTop) {
        targetTop = windowMinTop;
      } else if (calculatedTop > windowMaxTop) {
        targetTop = windowMaxTop;
      } else {
        targetTop = calculatedTop;
      }

      if (!isAnimating) {
        isAnimating = true;
        smoothTick();
      }
    }

    // Оптимизированный триггер для событий скролла (Защита от микролагов)
    function requestPositionUpdate() {
      if (!isScrollPending) {
        isScrollPending = true;
        requestAnimationFrame(() => {
          calculateTargetPosition();
          isScrollPending = false;
        });
      }
    }

    function smoothTick() {
      if (!isAnimating) return;

      currentTop = currentTop + (targetTop - currentTop) * 0.15;
      filterDrop.style.top = `${currentTop}px`;

      if (Math.abs(targetTop - currentTop) < 0.1) {
        currentTop = targetTop;
        filterDrop.style.top = `${currentTop}px`;
        isAnimating = false;
        return;
      }

      requestAnimationFrame(smoothTick);
    }

    filterInner.addEventListener('change', (e) => {
      if (e.target.type !== 'checkbox') return;
      if (e.target.closest('.filter__nested')) return;

      const input = e.target;
      if (input.checked) {
        checkedOrder.push(input);
      } else {
        const idx = checkedOrder.indexOf(input);
        if (idx !== -1) checkedOrder.splice(idx, 1);
      }

      calculateTargetPosition();
    });

    filterInner.addEventListener('click', (e) => {
      if (e.target.closest('.filter__item-head')) {
        const interval = setInterval(calculateTargetPosition, 16);
        setTimeout(() => clearInterval(interval), 400);
      }
    });

    // Заменяем прямой вызов тяжелой функции на легкий requestPositionUpdate
    window.addEventListener('scroll', requestPositionUpdate, { passive: true });
    filterInner.addEventListener('scroll', requestPositionUpdate, { passive: true });

    window.addEventListener('resize', () => calculateTargetPosition());

    const resizeObserver = new ResizeObserver(() => {
      // ResizeObserver тоже может спамить при анимациях раскрытия — оптимизируем его
      requestPositionUpdate();
    });
    resizeObserver.observe(filterInner);
  })();

  /**
   * Код для раскрытия меню кталога и бургер меню
   * Смена мегаменю и бургер-меню внутри раскрытой обертки
   */
  (function unifiedMenu() {
    const html = document.documentElement;
    const catalogBtn = document.getElementById('headerCatalogBtn');
    const burgerBtn = document.getElementById('burger-btn');
    const megaMenuContainer = document.querySelector('.megamenu__wrapper');

    // Безопасная проверка существования главных кнопок управления
    if (!catalogBtn && !burgerBtn) return;

    const isMobile = () => window.innerWidth <= 834;

    const OPEN_DELAY = 200;
    const CLOSE_DELAY = 100;

    let openTimeout = null;
    let closeTimeout = null;
    let isClickNavigation = false;

    // Безопасный вызов Lenis
    const toggleLenis = (action) => {
      if (typeof lenis !== 'undefined' && typeof lenis[action] === 'function') {
        lenis[action]();
      }
    };

    const removeMegaItemActive = () => {
      document
        .querySelectorAll('.megamenu__item-active')
        .forEach(el => el.classList.remove('megamenu__item-active'));
    };

    const openMenu = (type, isSwitching = false) => {
      html.classList.add('menu-wrapper--open');

      if (!isSwitching) {
        html.classList.remove('menu--switching');
      }

      if (type === 'mega') {
        html.classList.add('megamenu--active');
        html.classList.remove('burger--active');
      }

      if (type === 'burger') {
        html.classList.add('burger--active');
        html.classList.remove('megamenu--active');
        removeMegaItemActive();
      }

      toggleLenis('stop');
    };

    const closeMenu = () => {
      clearTimeout(openTimeout);
      clearTimeout(closeTimeout);

      html.classList.remove(
        'menu-wrapper--open',
        'megamenu--active',
        'burger--active',
        'menu--switching'
      );

      toggleLenis('start');
    };

    const toggleMenu = (type) => {
      const isOpen = html.classList.contains('menu-wrapper--open');
      const isSameType =
        (type === 'mega' && html.classList.contains('megamenu--active')) ||
        (type === 'burger' && html.classList.contains('burger--active'));

      if (isOpen && !isSameType) {
        html.classList.add('menu--switching');
        openMenu(type, true);
        return;
      }

      if (isOpen && isSameType) {
        closeMenu();
        return;
      }

      openMenu(type);
    };

    /* HOVER ЛОГИКА */
    const scheduleOpen = () => {
      if (isMobile() || isClickNavigation) return;
      if (html.classList.contains('megamenu--active')) return;

      clearTimeout(closeTimeout);

      openTimeout = setTimeout(() => {
        if (!isClickNavigation) {
          openMenu('mega');
        }
      }, OPEN_DELAY);
    };

    const scheduleClose = (e) => {
      const related = e.relatedTarget;

      if (
        related &&
        (catalogBtn.contains(related) ||
          (megaMenuContainer && megaMenuContainer.contains(related)))
      ) {
        return;
      }

      clearTimeout(openTimeout);

      closeTimeout = setTimeout(() => {
        if (html.classList.contains('megamenu--active')) {
          closeMenu();
        }
      }, CLOSE_DELAY);
    };

    // Привязываем события только если элементы существуют
    if (catalogBtn) {
      catalogBtn.addEventListener('mouseenter', scheduleOpen);
      catalogBtn.addEventListener('mouseleave', scheduleClose);

      // Единая функция для переключения меню на мобильном разрешении
      const handleMobileAction = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Полностью очищаем десктопные hover-таймауты
        clearTimeout(openTimeout);
        clearTimeout(closeTimeout);
        openTimeout = null;
        closeTimeout = null;

        const isActive = html.classList.contains('megamenu--active');

        if (isActive) {
          closeMenu();
        } else {
          openMenu('mega');
        }
      };

      // 1. ДЛЯ РЕАЛЬНЫХ СМАРТФОНОВ: Срабатывает мгновенно от тача
      catalogBtn.addEventListener('touchstart', (e) => {
        if (isMobile()) {
          handleMobileAction(e);
        }
      }, { passive: false });

      // 2. ДЛЯ УМЕНЬШЕННОГО ОКНА НА ПК: Срабатывает от клика мыши
      catalogBtn.addEventListener('click', (e) => {
        if (isMobile()) {
          // Защита: если это реальный тач-скрин, событие touchstart уже запустило handleMobileAction
          // и вызвало preventDefault(), поэтому этот click сработает ТОЛЬКО от мышки на ПК
          handleMobileAction(e);
          return;
        }

        // Стандартная десктопная логика (широкий экран) — разрешаем переход по ссылке
        isClickNavigation = true;
        clearTimeout(openTimeout);
      });

      // Отключаем системное контекстное меню при зажатии
      catalogBtn.addEventListener('contextmenu', (e) => {
        if (isMobile()) e.preventDefault();
      });
    }

    if (megaMenuContainer) {
      megaMenuContainer.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
      });
      megaMenuContainer.addEventListener('mouseleave', scheduleClose);
    }

    if (burgerBtn) {
      burgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu('burger');
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });

    window.addEventListener('pageshow', () => {
      isClickNavigation = false;
    });

    /* Клик вне контейнера */
    document.addEventListener('click', (e) => {
      const isMegaOpen = html.classList.contains('megamenu--active');
      if (!isMegaOpen) return;

      const clickInsideContainer = megaMenuContainer && megaMenuContainer.contains(e.target);
      const clickOnCatalogBtn = catalogBtn && catalogBtn.contains(e.target);

      if (!clickInsideContainer && !clickOnCatalogBtn) {
        closeMenu();
      }
    });

    // Экспортируем функцию закрытия наружу для интеграции с другими скриптами (например, поиском)
    window.unifiedMenu = { close: closeMenu };
  })();

  /**
   * Добавление активного класса для кнопки "В избранное"
   */
  (function favoriteBtnFunc() {
    const productCardFavorites = document.querySelectorAll('.favorite-btn');
    if (!productCardFavorites.length) return;

    productCardFavorites.forEach(productCardFavorite => {
      productCardFavorite.addEventListener('click', function () {
        productCardFavorite.classList.toggle('favorite-active');
      })
    });
  })();

  /**
   * Инициализация слайдера
   */
  (function swiperWrapper() {

    if (!document.querySelector('.swiper')) return;

    const globalImpulseOptions = {
      // Максимальный интервал между кликами в мс который считается быстрым
      fastClickDelay: 200,

      // Насколько сильно каждый быстрый клик увеличивает импульс
      // Формула: impulse += (fastClickDelay - delta) * accelerationFactor
      accelerationFactor: 0.23,

      // Коэффициент затухания импульса (0-1), теряет 15% каждые 40мс
      friction: 0.85,

      // Верхняя граница импульса, итоговый шаг = 1 + round(impulse)
      maxExtraSteps: 2,

      // Как часто пересчитывается затухание в мс, ~2-3 кадра при 60fps
      decayInterval: 40,
    };

    const slidersConfig = [
      {
        sliderSelector: '.category__slider',
        prevSelector: '.category-button-prev',
        nextSelector: '.category-button-next',
        highlight: false,
        edgeTracker: false,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 1,
          spaceBetween: 10,
          speed: 500,
          grabCursor: true,
          loop: false,
          touchRatio: 1.6,
          resistance: true,
          resistanceRatio: 0.4,
          centeredSlides: false,
          centeredSlidesBounds: true,
          simulateTouch: true,
          direction: 'horizontal',
          touchStartPreventDefault: true,
          touchMoveStopPropagation: true,
          threshold: 8,
          touchAngle: 25,
          watchOverflow: true,
          freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.85,
            momentumVelocityRatio: 1,
            momentumBounce: false,
            sticky: true,
          },
          mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          },
          navigation: false,
          breakpoints: {
            0: {
              slidesPerGroup: 1,
              slidesPerView: 'auto',
              spaceBetween: 10,
            },
            601: {
              slidesPerGroup: 1,
              slidesPerView: 4,
              spaceBetween: 20,
            },
            835: {
              slidesPerGroup: 1,
              slidesPerView: 5,
              spaceBetween: 20,
            },
          },
        },
      },
      {
        sliderSelector: '.category-mini__slider',
        prevSelector: '.category-mini-button-prev',
        nextSelector: '.category-mini-button-next',
        highlight: false,
        edgeTracker: false,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 1,
          spaceBetween: 10,
          speed: 500,
          grabCursor: true,
          loop: false,
          touchRatio: 1.6,
          resistance: true,
          resistanceRatio: 0.4,
          centeredSlides: false,
          centeredSlidesBounds: true,
          simulateTouch: true,
          direction: 'horizontal',
          touchStartPreventDefault: true,
          touchMoveStopPropagation: true,
          threshold: 8,
          touchAngle: 25,
          watchOverflow: true,
          freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.85,
            momentumVelocityRatio: 1,
            momentumBounce: false,
            sticky: true,
          },
          mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          },
          navigation: false,
          breakpoints: {
            0: {
              slidesPerGroup: 1,
              slidesPerView: 'auto',
              spaceBetween: 10,
            },
            601: {
              slidesPerGroup: 1,
              slidesPerView: 4,
              spaceBetween: 10,
            },
            835: {
              slidesPerGroup: 1,
              slidesPerView: 5,
              spaceBetween: 10,
            },
          },
        },
      },
      {
        sliderSelector: '.popular__slider',
        prevSelector: '.popular-button-prev',
        nextSelector: '.popular-button-next',
        highlight: false,
        edgeTracker: false,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 'auto',
          spaceBetween: 10,
          speed: 500,
          grabCursor: true,
          loop: false,
          touchRatio: 1.6,
          resistance: true,
          resistanceRatio: 0.4,
          centeredSlides: false,
          centeredSlidesBounds: true,
          simulateTouch: true,
          direction: 'horizontal',
          touchStartPreventDefault: true,
          touchMoveStopPropagation: true,
          threshold: 8,
          touchAngle: 25,
          watchOverflow: true,
          freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.85,
            momentumVelocityRatio: 1,
            momentumBounce: false,
            sticky: true,
          },
          mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          },
          navigation: false,
          pagination: {
            el: '.popular__slider .swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            0: {
              slidesPerGroup: 1,
              slidesPerView: 'auto',
              spaceBetween: 10,
            },
            601: {
              slidesPerGroup: 1,
              slidesPerView: 'auto',
              spaceBetween: 10,
            },
            835: {
              slidesPerGroup: 1,
              slidesPerView: 4,
              spaceBetween: 20,
            },
          },
        },
      },
      {
        sliderSelector: '.press-center__slider',
        prevSelector: '.press-center-button-prev',
        nextSelector: '.press-center-button-next',
        highlight: false,
        edgeTracker: false,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 1,
          spaceBetween: 10,
          speed: 500,
          grabCursor: true,
          loop: false,
          touchRatio: 1.6,
          resistance: true,
          resistanceRatio: 0.4,
          centeredSlides: false,
          centeredSlidesBounds: true,
          simulateTouch: true,
          direction: 'horizontal',
          touchStartPreventDefault: true,
          touchMoveStopPropagation: true,
          threshold: 8,
          touchAngle: 25,
          watchOverflow: true,
          freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.85,
            momentumVelocityRatio: 1,
            momentumBounce: false,
            sticky: true,
          },
          mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          },
          navigation: false,
          pagination: {
            el: '.press-center__slider .swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            0: {
              slidesPerGroup: 1,
              slidesPerView: 'auto',
              spaceBetween: 10,
            },
            601: {
              slidesPerGroup: 1,
              slidesPerView: 2,
              spaceBetween: 20,
            },
            835: {
              slidesPerGroup: 1,
              slidesPerView: 4,
              spaceBetween: 20,
            },
          },
        },
      },
      {
        sliderSelector: '.reviews__slider',
        prevSelector: '.reviews-button-prev',
        nextSelector: '.reviews-button-next',
        highlight: false,
        edgeTracker: false,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 1,
          spaceBetween: 10,
          speed: 500,
          grabCursor: true,
          loop: false,
          touchRatio: 1.6,
          resistance: true,
          resistanceRatio: 0.4,
          centeredSlides: false,
          centeredSlidesBounds: true,
          simulateTouch: true,
          direction: 'horizontal',
          touchStartPreventDefault: true,
          touchMoveStopPropagation: true,
          threshold: 8,
          touchAngle: 25,
          watchOverflow: true,
          freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.85,
            momentumVelocityRatio: 1,
            momentumBounce: false,
            sticky: true,
          },
          mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          },
          navigation: false,
          pagination: {
            el: '.reviews__slider .swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            0: {
              slidesPerGroup: 1,
              slidesPerView: 'auto',
              spaceBetween: 10,
            },
            601: {
              slidesPerGroup: 1,
              slidesPerView: 2,
              spaceBetween: 20,
            },
            835: {
              slidesPerGroup: 1,
              slidesPerView: 3,
              spaceBetween: 20,
            },
          },
        },
      },
      {
        sliderSelector: '.product__slider-big',
        prevSelector: '.product-button-prev',
        nextSelector: '.product-button-next',
        highlight: false,
        edgeTracker: false,
        thumbs: {
          sliderSelector: '.product__slider-min',
          swiperOptions: {
            slidesPerGroup: 1,
            slidesPerView: 4,
            spaceBetween: 10,
            speed: 500,
            grabCursor: true,
            loop: false,
            touchRatio: 1.6,
            resistance: true,
            resistanceRatio: 0.4,
            centeredSlides: false,
            centeredSlidesBounds: true,
            simulateTouch: true,
            direction: 'horizontal',
            touchStartPreventDefault: true,
            touchMoveStopPropagation: true,
            threshold: 8,
            touchAngle: 25,
            watchOverflow: true,
            watchSlidesProgress: true,
            freeMode: {
              enabled: true,
              momentum: true,
              momentumRatio: 0.85,
              momentumVelocityRatio: 1,
              momentumBounce: false,
              sticky: true,
            },
            mousewheel: {
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: true,
            },
          },
        },
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 500,
          grabCursor: true,
          loop: true,
          touchRatio: 1.6,
          resistance: true,
          resistanceRatio: 0.4,
          centeredSlides: false,
          centeredSlidesBounds: true,
          simulateTouch: true,
          direction: 'horizontal',
          touchStartPreventDefault: true,
          touchMoveStopPropagation: true,
          threshold: 8,
          touchAngle: 25,
          watchOverflow: true,
          watchSlidesProgress: true,
          // freeMode: {
          //   enabled: true,
          //   momentum: true,
          //   momentumRatio: 0.85,
          //   momentumVelocityRatio: 1,
          //   momentumBounce: false,
          //   sticky: true,
          // },
          freemode: false,
          mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          },
          navigation: false,
          pagination: {
            el: '.product__slider-big .swiper-pagination',
            clickable: true,
          },
        },
      },
    ];

    slidersConfig.forEach(({ sliderSelector, prevSelector, nextSelector, highlight, thumbs, autoSlidesView, edgeTracker: useEdgeTracker, swiperOptions }) => {

      if (!document.querySelector(sliderSelector)) return;

      if (autoSlidesView) {
        applyAutoSlidesView(swiperOptions);
      }

      const prevEl = prevSelector ? document.querySelector(prevSelector) : null;
      const nextEl = nextSelector ? document.querySelector(nextSelector) : null;

      const fromEl = highlight ? document.querySelector(`${sliderSelector} .slider-highlight--from`) : null;
      const toEl = highlight ? document.querySelector(`${sliderSelector} .slider-highlight--to`) : null;

      if (thumbs) {
        const thumbsEl = document.querySelector(thumbs.sliderSelector);

        if (!thumbsEl) {
          console.warn(`Swiper thumbs: элемент "${thumbs.sliderSelector}" не найден.`);
        } else {
          const thumbsSwiper = new Swiper(thumbs.sliderSelector, thumbs.swiperOptions);

          swiperOptions.thumbs = { swiper: thumbsSwiper };
        }
      }

      const swiper = new Swiper(sliderSelector, swiperOptions);

      initPaginationBreakpoint(swiper);

      const highlightInstance = createHighlight(swiper, fromEl, toEl);

      const edgeTracker = useEdgeTracker === true
        ? createEdgeTracker(swiper, highlightInstance)
        : createEdgeTrackerStub();

      if (prevEl && nextEl) {
        createNavigation(swiper, prevEl, nextEl, highlightInstance, edgeTracker);
      }
    });

    function applyAutoSlidesView(swiperOptions) {

      swiperOptions.centeredSlidesBounds = false;

      if (swiperOptions.freeMode) {
        swiperOptions.freeMode.sticky = false;
      }

      const breakpoints = swiperOptions.breakpoints ?? {};
      Object.values(breakpoints).forEach(bp => {
        if (bp.slidesPerView === 'auto') {
          bp.centeredSlidesBounds = false;
          if (bp.sticky !== undefined) bp.sticky = false;
        }
      });
    }

    function createEdgeTrackerStub() {
      return {
        handleEdgeNext: () => false,
        handleEdgePrev: () => false,
        clearVirtual: () => { },
        getVirtualIndex: () => null,
      };
    }

    function initPaginationBreakpoint(swiper) {
      const paginationEl = swiper.pagination?.el;
      if (!paginationEl) return;

      function applyVisibility() {
        const params = swiper.currentBreakpointParams ?? {};
        paginationEl.style.display = params.hidePagination === true ? 'none' : '';
      }

      swiper.on('breakpoint', applyVisibility);

      applyVisibility();
    }

    function createHighlight(swiper, fromEl, toEl) {

      if (!fromEl || !toEl) {
        return {
          animateTo: () => { },
          snapInstant: () => { },
          getGeometry: (index) => {
            const slide = swiper.slides[index];
            if (!slide) return null;
            return {
              x: slide.offsetLeft + (swiper.translate ?? 0),
              width: slide.offsetWidth,
            };
          },
          getCurrentX: () => 0,
          getCurrentW: () => 0,
        };
      }

      const DURATION = 320;
      const EASE_OUT = 'cubic-bezier(0.4, 0, 0.2, 1)';
      const EASE_SNAP = 'cubic-bezier(0.34, 1.4, 0.64, 1)';

      let currentX = 0;
      let currentWidth = 0;
      let rafId = null;

      function getGeometry(index) {
        const slide = swiper.slides[index];
        if (!slide) return null;
        return {
          x: slide.offsetLeft + (swiper.translate ?? 0),
          width: slide.offsetWidth,
        };
      }

      function setInstant(el, x, width, visible) {
        el.style.transition = 'none';
        el.style.transform = `translateX(${x}px)`;
        el.style.width = `${width}px`;
        el.classList.toggle('is-visible', visible);
      }

      function setAnimated(el, x, width, duration, easing, visible) {
        el.style.transition = [
          `transform ${duration}ms ${easing}`,
          `width ${duration}ms ${easing}`,
          `opacity ${duration * 0.6}ms ease`,
        ].join(', ');
        el.style.transform = `translateX(${x}px)`;
        el.style.width = `${width}px`;
        el.classList.toggle('is-visible', visible);
      }

      function animateTo(toX, toWidth, dir) {
        if (rafId) cancelAnimationFrame(rafId);

        const fromX = currentX;
        const fromWidth = currentWidth;
        const collapseX = dir === 'next' ? fromX + fromWidth : fromX;
        const startX = dir === 'next' ? toX : toX + toWidth;

        setInstant(fromEl, fromX, fromWidth, true);
        setInstant(toEl, startX, 0, true);

        rafId = requestAnimationFrame(() => {
          rafId = requestAnimationFrame(() => {
            rafId = null;
            setAnimated(fromEl, collapseX, 0, DURATION, EASE_OUT, false);
            setAnimated(toEl, toX, toWidth, DURATION, EASE_SNAP, true);
          });
        });

        currentX = toX;
        currentWidth = toWidth;
      }

      function snapInstant(index) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        const geo = getGeometry(index);
        if (!geo) return;
        setInstant(fromEl, geo.x, geo.width, true);
        setInstant(toEl, geo.x, 0, false);
        currentX = geo.x;
        currentWidth = geo.width;
      }

      swiper.on('slideChange', () => {
        const curr = swiper.activeIndex;
        const prev = swiper.previousIndex ?? curr;
        const dir = curr >= prev ? 'next' : 'prev';
        const geo = getGeometry(curr);
        if (geo) animateTo(geo.x, geo.width, dir);
      });

      swiper.on('transitionEnd', () => {
        setInstant(fromEl, currentX, currentWidth, true);
        setInstant(toEl, currentX, 0, false);
      });

      swiper.on('setTranslate', () => {
        if (swiper.animating) return;
        const geo = getGeometry(swiper.activeIndex);
        if (!geo) return;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        setInstant(fromEl, geo.x, geo.width, true);
        setInstant(toEl, geo.x, 0, false);
        currentX = geo.x;
        currentWidth = geo.width;
      });

      swiper.on('resize', () => snapInstant(swiper.activeIndex));

      snapInstant(swiper.activeIndex ?? 0);

      return {
        animateTo,
        snapInstant,
        getGeometry,
        getCurrentX: () => currentX,
        getCurrentW: () => currentWidth,
      };
    }

    function createEdgeTracker(swiper, highlight) {

      const VIRTUAL_CLASS = 'is-virtual-active';
      const BEFORE_EDGE_CLASS = 'is-before-edge';

      let virtualIndex = null;

      function getVisibleIndices() {
        const containerWidth = swiper.width;
        const offset = Math.abs(swiper.translate ?? 0);
        const visible = [];
        swiper.slides.forEach((slide, i) => {
          const left = slide.offsetLeft;
          const right = left + slide.offsetWidth;
          if (right > offset && left < offset + containerWidth) visible.push(i);
        });
        return visible;
      }

      function clearBeforeEdge() {
        swiper.slides.forEach(s => s.classList.remove(BEFORE_EDGE_CLASS));
      }

      function markBeforeEdge() {
        clearBeforeEdge();
        swiper.slides.forEach(s => {
          if (s.classList.contains('swiper-slide-active')) {
            s.classList.add(BEFORE_EDGE_CLASS);
          }
        });
      }

      function clearVirtual() {
        swiper.slides.forEach(s => s.classList.remove(VIRTUAL_CLASS));
        clearBeforeEdge();
        virtualIndex = null;
      }

      function setVirtualActive(index, dir) {
        if (virtualIndex === null) markBeforeEdge();
        swiper.slides.forEach(s => s.classList.remove(VIRTUAL_CLASS));
        virtualIndex = index;
        swiper.slides[index]?.classList.add(VIRTUAL_CLASS);

        const geo = highlight.getGeometry(index);
        if (geo) highlight.animateTo(geo.x, geo.width, dir);
      }

      function handleEdgeNext() {
        if (!swiper.isEnd) return false;
        const visible = getVisibleIndices();
        if (!visible.length) return false;
        const lastVisible = visible[visible.length - 1];
        const current = virtualIndex ?? swiper.activeIndex;
        if (current >= lastVisible) return true;
        setVirtualActive(current + 1, 'next');
        return true;
      }

      function handleEdgePrev() {
        if (virtualIndex === null) return false;
        const current = virtualIndex;
        const realActive = swiper.activeIndex;
        if (current <= realActive) {
          clearVirtual();
          highlight.snapInstant(realActive);
          return false;
        }
        setVirtualActive(current - 1, 'prev');
        return true;
      }

      swiper.on('slideChange', () => {
        if (virtualIndex !== null) clearVirtual();
      });

      swiper.on('fromEdge', () => {
        clearVirtual();
      });

      return {
        handleEdgeNext,
        handleEdgePrev,
        clearVirtual,
        getVirtualIndex: () => virtualIndex,
      };
    }

    function createNavigation(swiper, prevEl, nextEl, highlight, edgeTracker) {

      const {
        fastClickDelay = 200,
        accelerationFactor = 0.23,
        friction = 0.85,
        maxExtraSteps = 2,
        decayInterval = 40,
      } = globalImpulseOptions;

      let lastClickTime = 0;
      let lastDirection = null;
      let extraImpulse = 0;
      let decayTimer = null;

      function resetImpulse() {
        extraImpulse = 0;
        lastDirection = null;
        if (decayTimer) clearInterval(decayTimer);
        decayTimer = null;
      }

      function accumulateImpulse(direction) {
        const now = Date.now();
        const delta = now - lastClickTime;

        if (lastDirection !== null && lastDirection !== direction) {
          extraImpulse = 0;
        }

        extraImpulse = delta < fastClickDelay
          ? Math.min(extraImpulse + (fastClickDelay - delta) * accelerationFactor, maxExtraSteps)
          : 0;

        lastClickTime = now;
        lastDirection = direction;

        if (decayTimer) clearInterval(decayTimer);
        decayTimer = setInterval(() => {
          extraImpulse *= friction;
          if (extraImpulse < 0.2) {
            extraImpulse = 0;
            clearInterval(decayTimer);
            decayTimer = null;
          }
        }, decayInterval);
      }

      function getVisibleIndicesForNav() {
        const containerWidth = swiper.width;
        const offset = Math.abs(swiper.translate ?? 0);
        const visible = [];
        swiper.slides.forEach((slide, i) => {
          const left = slide.offsetLeft;
          const right = left + slide.offsetWidth;
          if (right > offset && left < offset + containerWidth) visible.push(i);
        });
        return visible;
      }

      function updateDisabled() {
        if (swiper.params.loop) return;

        const isStart = swiper.isBeginning && edgeTracker.getVirtualIndex() === null;

        let nextBlocked = false;
        if (swiper.isEnd) {
          const virtualIndex = edgeTracker.getVirtualIndex();
          if (virtualIndex === null) {
            nextBlocked = true;
          } else {
            const visible = getVisibleIndicesForNav();
            const lastVisible = visible[visible.length - 1] ?? swiper.activeIndex;
            nextBlocked = virtualIndex >= lastVisible;
          }
        }

        prevEl.classList.toggle('swiper-button-disabled', isStart);
        nextEl.classList.toggle('swiper-button-disabled', nextBlocked);

        prevEl.disabled = isStart;
        nextEl.disabled = nextBlocked;
      }

      function handle(direction) {
        if (direction === 'next' && edgeTracker.handleEdgeNext()) {
          updateDisabled();
          return;
        }
        if (direction === 'prev' && edgeTracker.handleEdgePrev()) {
          updateDisabled();
          return;
        }

        accumulateImpulse(direction);
        const steps = 1 + Math.round(extraImpulse);

        if (swiper.params.loop) {
          const total = swiper.slides.length - (swiper.loopedSlides ?? 0) * 2;
          const curr = swiper.realIndex;
          const target = direction === 'next'
            ? (curr + steps) % total
            : (curr - steps + total) % total;
          swiper.slideToLoop(target);
        } else {
          const base = swiper.activeIndex;
          const target = direction === 'next'
            ? Math.min(base + steps, swiper.slides.length - 1)
            : Math.max(base - steps, 0);
          swiper.slideTo(target);
        }

        updateDisabled();
      }

      // Привязываем обработчики кликов
      nextEl.addEventListener('click', (e) => { e.preventDefault(); handle('next'); });
      prevEl.addEventListener('click', (e) => { e.preventDefault(); handle('prev'); });

      // Сброс импульса при таче
      swiper.on('touchStart', resetImpulse);

      // Массив событий для мгновенного обновления состояния кнопок
      const updateEvents = [
        'slideChange',
        'resize',
        'setTranslate',   // Важно для тачпадов и скролла мыши в реальном времени
        'transitionEnd',  // Важно для фиксации состояния после инерции (momentum)
        'reachBeginning', // Гарантия срабатывания на левом краю
        'reachEnd'        // Гарантия срабатывания на правом краю
      ];

      // Подписываемся на все события сразу
      updateEvents.forEach(event => {
        swiper.on(event, updateDisabled);
      });

      // Очистка при уничтожении слайдера
      swiper.on('destroy', () => {
        if (decayTimer) clearInterval(decayTimer);
        updateEvents.forEach(event => {
          swiper.off(event, updateDisabled);
        });
      });

      // Первоначальный вызов при инициализации
      updateDisabled();


      swiper.on('destroy', () => {
        if (decayTimer) clearInterval(decayTimer);
        decayTimer = null;
      });

      updateDisabled();
    }

  })();

  /**
   * Анимация текста
   */
  function scrollTriggerPlayer(triggerElement, timeline, onEnterStart = "top 95%") {
    ScrollTrigger.create({ trigger: triggerElement, start: "top bottom", onLeaveBack: () => { timeline.progress(1); timeline.pause(); } });
    ScrollTrigger.create({ trigger: triggerElement, start: onEnterStart, scrub: true, onEnter: () => timeline.play() });
  }

  gsap.utils.toArray('[data-split="lines"]').forEach(dataSplitLines => {
    // const textSplits = dataSplitLines.querySelectorAll('h1, h2, h3, h4, h5, h6, a');
    const textSplits = dataSplitLines.querySelectorAll('*');
    textSplits.forEach(textSplit => {
      if (textSplit) SplitText.create(textSplit, {
        type: "words,lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: inst => gsap.from(inst.lines, {
          yPercent: 120,
          stagger: 0.1,
          duration: 1,
          scrollTrigger: {
            trigger: dataSplitLines,
            start: "top 90%",
            end: "bottom top"
          }
        })
      });
    });
  });

  gsap.utils.toArray('[data-split="text"]').forEach(dataSplitText => {
    const textSplit = dataSplitText.querySelectorAll('p');
    if (textSplit) SplitText.create(textSplit, {
      type: "words",
      aria: "hidden",
      onSplit: split => gsap.from(split.words, {
        opacity: 0,
        duration: 1,
        ease: "sine.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: dataSplitText,
          start: "top 90%",
          end: "bottom top"
        }
      })
    });
  });

  document.querySelectorAll(`[data-transform="fade"]`).forEach(el => {
    const tl = gsap.timeline({ paused: true });
    tl.from(el, {
      autoAlpha: 0,
      y: 50,
      duration: 0.5,
      ease: "power1.out",
    });
    scrollTriggerPlayer(el, tl);
  });

  document.querySelectorAll('[data-animation="parallax-img"]').forEach(dataAnimationParallaxImg => {
    const img = dataAnimationParallaxImg.querySelector('img');
    if (img) gsap.fromTo(img, { y: '-10%', scale: 1 }, { y: '10%', scale: 1.1, scrollTrigger: { trigger: dataAnimationParallaxImg, start: 'top 90%', end: 'bottom top', scrub: true } });
  });

  document.querySelectorAll('[data-animation="parallax-img-1"]').forEach(container => {
    const img = container.querySelector('img');
    if (img) gsap.fromTo(img,
      {
        y: '15%',
      },
      {
        y: '-20%',
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          end: 'bottom top',
          scrub: true
        }
      });
  });

  document.querySelectorAll('[data-animation="parallax-img-2"]').forEach(container => {
    const img = container.querySelector('img');
    if (img) gsap.fromTo(img,
      {
        y: '-30%',
      },
      {
        y: '30%',
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          end: 'bottom top',
          scrub: true
        }
      });
  });

  document.querySelectorAll('[data-animation="parallax-img-3"]').forEach(container => {
    const img = container.querySelector('img');
    if (img) gsap.fromTo(img,
      {
        y: '-10%',
      },
      {
        y: '10%',
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          end: 'bottom top',
          scrub: true
        }
      });
  });

  document.querySelectorAll('[data-animation="parallax-img-4"]').forEach(container => {
    const img = container.querySelector('img');
    if (img) gsap.fromTo(img,
      {
        y: '10%',
      },
      {
        y: '-10%',
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          end: 'bottom top',
          scrub: true
        }
      });
  });

  $(window).on('resize load', function () {

    if (window.innerWidth > 834 && document.getElementById('img1')) {
      const imgs = [
        { el: document.getElementById("img1"), power: 30 },
        { el: document.getElementById("img2"), power: 50 },
        { el: document.getElementById("img3"), power: 100 }
      ];

      document.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;

        imgs.forEach(({ el, power }) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = (centerX - x) / power;
          const dy = (centerY - y) / power;

          gsap.to(el, {
            x: dx,
            y: dy,
            duration: 0.4,
            ease: "power2.out"
          });
        });
      });
    }

  });

  const social = document.querySelector('.social');
  const btn = document.querySelector('.social__item-btn');

  btn.addEventListener('click', () => {
    social.classList.toggle('active');
  });

  /**
   * ВЫПАДАЮЩИЙ СПИСОК (dropdown--js)
   *    
   * Кастомный select на основе radio-инпутов.
   * Открывается кликом, закрывается кликом вне или выбором опции.
   */
  (function () {
    const html = document.documentElement;

    const dropdowns = document.querySelectorAll('.dropdown--js');
    if (!dropdowns.length) return;

    dropdowns.forEach(dropdown => {
      const isCityDropdown = dropdown.classList.contains('js-city-dropdown');

      const selectedJs = dropdown.querySelector('.dropdown__selected--js');
      const selectedInputJs = dropdown.querySelector('.dropdown__selected-input--js');
      const selectedLabelJs = dropdown.querySelector('.dropdown__selected-label--js');
      const dropdownRadios = dropdown.querySelectorAll('.dropdown__radio');
      const dropdownValue = dropdown.querySelector('.dropdown__value');

      if (!selectedJs) return;

      selectedJs.addEventListener('click', e => {
        e.stopPropagation();
        dropdown.classList.toggle('is-active');
      });

      document.addEventListener('click', e => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('is-active');
        }
      });

      dropdownRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (!radio.checked) return;

          const dataValue = radio.dataset.city;
          const value = radio.value;

          // Обновляем UI в текущем dropdown
          if (selectedLabelJs) selectedLabelJs.textContent = value;
          if (selectedInputJs) selectedInputJs.value = value;
          if (dropdownValue) dropdownValue.value = value;

          // Только для dropdown с городами
          if (isCityDropdown) {
            // 1) Синхронизируем ВСЕ js-city-dropdown:
            // меняем текст и input, а также отмечаем нужную радиокнопку в каждом dropdown
            const allCityDropdowns = document.querySelectorAll('.dropdown--js.js-city-dropdown');

            allCityDropdowns.forEach(cityDropdown => {
              const label = cityDropdown.querySelector('.dropdown__selected-label--js');
              const input = cityDropdown.querySelector('.dropdown__selected-input--js');
              const hiddenValue = cityDropdown.querySelector('.dropdown__value');

              if (label) label.textContent = value;
              if (input) input.value = value;
              if (hiddenValue) hiddenValue.value = value;

              // Отмечаем нужную радиокнопку в каждом dropdown по data-city
              const cityRadios = cityDropdown.querySelectorAll('.dropdown__radio');
              cityRadios.forEach(r => {
                // dataset.city хранит код города, который мы и используем для синхронизации
                if (r.dataset.city === dataValue) {
                  r.checked = true;
                }
              });
            });

            // 2) Обновляем лэйауты по data-city
            const dataDropdowns = document.querySelectorAll('[data-dropdown]');
            dataDropdowns.forEach(dataDropdown => {
              const layoutBody = dataDropdown.querySelector('.layout__body');
              if (!layoutBody) return;

              // Находим все блоки внутри layoutBody
              const allBlocks = layoutBody.querySelectorAll('.layout__block');

              // Скрываем все блоки
              allBlocks.forEach(block => {
                block.style.display = 'none';
              });

              // Находим нужный блок по data-city
              const thisLayoutBlock = layoutBody.querySelector(`[data-city="${dataValue}"]`);

              if (thisLayoutBlock) {
                layoutBody.classList.add('checked');
                thisLayoutBlock.style.display = 'flex';
              }
            });
          }

          dropdown.classList.remove('is-active');
          dropdown.classList.add('filled');
        });
      });
    });
  })();

  /**
   * Инициализация Fabcybox
   */
  Fancybox.bind('[data-fancybox]', {
    closeExisting: true,
    Html: {
      autoSize: false,
    },
    on: {
      'Carousel.ready': () => {
        lenis.stop();
      },
      destroy: () => {
        lenis.start();
      }
    }
  });

  const slides = document.querySelectorAll('.swiper-slide');

  slides.forEach(slide => {
    slide.addEventListener('mouseenter', () => {
      // удаляем класс со всех слайдов
      slides.forEach(s => s.classList.remove('active'));
      // добавляем текущему
      slide.classList.add('active');
    });

    slide.addEventListener('mouseleave', () => {
      // убираем активный класс, чтобы полоса сворачивалась
      slide.classList.remove('active');
    });
  });

  const control = document.querySelector('.control');

  if (control) {
    const buttons = control.querySelectorAll('.control__btn');
    const html = document.documentElement;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;

        html.classList.remove('list', 'block');
        html.classList.add(view);

        buttons.forEach(b => b.classList.remove('control__btn--active'));
        btn.classList.add('control__btn--active');
      });
    });
  }

  // (function () {
  //   const passwordFields = document.querySelectorAll('.form-password');

  //   passwordFields.forEach(field => {
  //     const passwordInput = field.querySelector('input[type="password"]');
  //     const toggleIcon = field.querySelector('.form-password-toggle');
  //     let isPasswordVisible = false;

  //     toggleIcon.addEventListener('click', function () {
  //       if (isPasswordVisible) {
  //         passwordInput.type = 'password';
  //         toggleIcon.textContent = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><path d="M12 4C4.86536 4 0.256791 11.3689 0.173438 11.5031C0.0612427 11.6445 0.000121298 11.8196 0 12C0.000141923 12.1548 0.045192 12.3062 0.129688 12.4359C0.130724 12.4375 0.131765 12.4391 0.132813 12.4406C0.146567 12.469 4.01507 20 12 20C19.9511 20 23.8139 12.543 23.8609 12.4516C23.8641 12.4464 23.8672 12.4412 23.8703 12.4359C23.9548 12.3062 23.9999 12.1548 24 12C24 11.8203 23.9394 11.6458 23.8281 11.5047C23.8276 11.5042 23.8271 11.5036 23.8266 11.5031C23.7432 11.3689 19.1346 4 12 4ZM12 6.4C15.0928 6.4 17.6 8.9072 17.6 12C17.6 15.0928 15.0928 17.6 12 17.6C8.9072 17.6 6.4 15.0928 6.4 12C6.4 8.9072 8.9072 6.4 12 6.4ZM12 9.6C11.3635 9.6 10.753 9.85286 10.3029 10.3029C9.85286 10.753 9.6 11.3635 9.6 12C9.6 12.6365 9.85286 13.247 10.3029 13.6971C10.753 14.1471 11.3635 14.4 12 14.4C12.6365 14.4 13.247 14.1471 13.6971 13.6971C14.1471 13.247 14.4 12.6365 14.4 12C14.4 11.3635 14.1471 10.753 13.6971 10.3029C13.247 9.85286 12.6365 9.6 12 9.6Z"fill="#718595" /></g></svg>'; // Иконка закрытого глаза
  //         isPasswordVisible = false;
  //       } else {
  //         // Показываем пароль
  //         passwordInput.type = 'text';
  //         toggleIcon.textContent = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><path d="M12 4C4.86536 4 0.256791 11.3689 0.173438 11.5031C0.0612427 11.6445 0.000121298 11.8196 0 12C0.000141923 12.1548 0.045192 12.3062 0.129688 12.4359C0.130724 12.4375 0.131765 12.4391 0.132813 12.4406C0.146567 12.469 4.01507 20 12 20C19.9511 20 23.8139 12.543 23.8609 12.4516C23.8641 12.4464 23.8672 12.4412 23.8703 12.4359C23.9548 12.3062 23.9999 12.1548 24 12C24 11.8203 23.9394 11.6458 23.8281 11.5047C23.8276 11.5042 23.8271 11.5036 23.8266 11.5031C23.7432 11.3689 19.1346 4 12 4ZM12 6.4C15.0928 6.4 17.6 8.9072 17.6 12C17.6 15.0928 15.0928 17.6 12 17.6C8.9072 17.6 6.4 15.0928 6.4 12C6.4 8.9072 8.9072 6.4 12 6.4ZM12 9.6C11.3635 9.6 10.753 9.85286 10.3029 10.3029C9.85286 10.753 9.6 11.3635 9.6 12C9.6 12.6365 9.85286 13.247 10.3029 13.6971C10.753 14.1471 11.3635 14.4 12 14.4C12.6365 14.4 13.247 14.1471 13.6971 13.6971C14.1471 13.247 14.4 12.6365 14.4 12C14.4 11.3635 14.1471 10.753 13.6971 10.3029C13.247 9.85286 12.6365 9.6 12 9.6Z"fill="#35AFDA" /></g></svg>'; // Иконка открытого глаза
  //         isPasswordVisible = true;
  //       }

  //       // Фокусируем поле после смены типа для корректного отображения курсора
  //       passwordInput.focus();
  //     });
  //   });
  // })();


  /**
   * Инициализация filled-класса для полей формы
   */
  function initFormInputs() {
    const elements = document.querySelectorAll('.form-input, .form-textarea');

    elements.forEach(element => {
      if (!element._filledInit) {
        element._filledInit = true;

        element.addEventListener('input', function () {
          this.classList.toggle('filled', this.value.trim() !== '');
        });
      }

      element.classList.toggle('filled', element.value.trim() !== '');
    });
  }

  /**
   * Инициализация показа/скрытия пароля
   */
  function passwordToggles() {
    const passwordFields = document.querySelectorAll('.form-password');

    passwordFields.forEach(field => {
      if (field._passwordInit) return;
      field._passwordInit = true;

      const passwordInput = field.querySelector('input[type="password"], input[type="text"]');
      const toggleButton = field.querySelector('.form-password-toggle');

      if (!passwordInput || !toggleButton) return;

      toggleButton.addEventListener('click', function () {
        const isPassword = passwordInput.getAttribute('type') === 'password';

        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        toggleButton.classList.toggle('visible', isPassword);
        toggleButton.setAttribute('aria-label', isPassword ? 'Скрыть пароль' : 'Показать пароль');

        passwordInput.focus();
      });
    });
  }

  /**
   * Конфиги для каждого типа ajax-page
   */
  const ajaxConfigs = [
    {
      containerSelector: '.page__cabinet',
      btnSelector: '.ajax-btn',
      dataAttr: 'cabinet',
      targetSelector: '.cabinet__body'
    },
    {
      containerSelector: '.page__reg',
      btnSelector: '.ajax-btn',
      dataAttr: 'reg',
      targetSelector: '.registration__inner'
    },
    {
      containerSelector: '.popup__auth',
      btnSelector: '.ajax-btn',
      dataAttr: 'popup',
      targetSelector: '.popup__content'
    }
  ];

  /**
   * Инициализация Ajax вкладок для конкретного контейнера
   */
  function initAjaxTabs(container, config) {
    // Пропускаем уже инициализированные
    if (container._ajaxInit) return;
    container._ajaxInit = true;

    const $container = $(container);
    const ajaxBtns = $container.find(config.btnSelector);

    ajaxBtns.on('click', function () {
      $container.find(config.btnSelector).removeClass('ajax-btn-active');
      $(this).addClass('ajax-btn-active');

      const attr = $(this).data(config.dataAttr);
      console.log(attr);
      if (!attr) return;

      $.get('./ajax/' + config.dataAttr + '-' + attr + '.html', function (data) {
        $container.find(config.targetSelector).html(data);
        initFormInputs();
        passwordToggles();
        // Переинициализируем вложенные ajax-page если они появились в новом контенте
        initAllAjaxPages();
      }).fail(function () {
        console.warn('Не удалось загрузить: ./ajax/' + config.dataAttr + '-' + attr + '.html');
      });
    });
  }

  /**
   * Инициализация всех ajax-page на странице (включая вложенные)
   */
  function initAllAjaxPages() {
    ajaxConfigs.forEach(config => {
      const containers = document.querySelectorAll(config.containerSelector);

      containers.forEach(container => {
        initAjaxTabs(container, config);
      });
    });
  }

  // Запуск
  initFormInputs();
  passwordToggles();
  initAllAjaxPages();

  (function quantityFunc() {

    const quantities = document.querySelectorAll('.quantity');
    if (!quantities.length) return;

    quantities.forEach(quantity => {

      const input = quantity.querySelector('input');
      const btnMinus = quantity.querySelector('.quantity__btn--minus');
      const btnPlus = quantity.querySelector('.quantity__btn--plus');

      const min = Number(quantity.dataset.min) || 1;
      const max = Number(quantity.dataset.max) || 1000;
      // const suffix = ' шт';
      const suffix = ' пог. м';

      function parse(value) {
        const number = parseInt(value, 10);
        return isNaN(number) ? min : number;
      }

      function clamp(value) {
        return Math.max(min, Math.min(max, value));
      }

      function format(value) {
        return clamp(value) + suffix;
      }

      function setFormatted(value) {
        input.value = format(value);
      }

      function setRaw(value) {
        input.value = value;
      }

      // Кнопки
      btnMinus.addEventListener('click', () => {
        const value = parse(input.value.replace(/\D/g, ''));
        setFormatted(value - 1);
      });

      btnPlus.addEventListener('click', () => {
        const value = parse(input.value.replace(/\D/g, ''));
        setFormatted(value + 1);
      });

      // Фокус - убираем суффикс
      input.addEventListener('focus', () => {
        setRaw(parse(input.value.replace(/\D/g, '')));
      });

      // Ввод - только цифры
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '');
      });

      // Blur - нормализуем и добавляем суффикс
      input.addEventListener('blur', () => {
        const value = clamp(parse(input.value));
        setFormatted(value);
      });

      // Инициализация
      const initial = parse(input.value.replace(/\D/g, ''));
      setFormatted(initial);

    });

  })();

  (function checkBlockFunc() {

    const groups = document.querySelectorAll('.placing__block');
    if (!groups.length) return;

    groups.forEach(group => {

      // Делегирование внутри конкретной группы
      group.addEventListener('change', (e) => {

        const target = e.target;
        if (!target.matches('.check-input[type="radio"]')) return;

        const name = target.name;
        if (!name) return;

        // Снимаем активность только у радио с тем же name внутри группы
        group.querySelectorAll(`.check-input[name="${name}"]`)
          .forEach(input => {
            const block = input.closest('.check-block');
            if (block) block.classList.remove('activity');
          });

        // Добавляем активность выбранному
        const activeBlock = target.closest('.check-block');
        if (activeBlock) activeBlock.classList.add('activity');

      });

      // Инициализация при загрузке
      const checkedInputs = group.querySelectorAll('.check-input[type="radio"]:checked');

      checkedInputs.forEach(input => {
        const block = input.closest('.check-block');
        if (block) block.classList.add('activity');
      });

    });

  })();

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.product__foot-btn');
    if (!btn) return;

    const group = btn.closest('.product__foot-btns');
    if (!group) return;

    const activeClass = 'product__foot-btn--active';

    group.querySelectorAll('.product__foot-btn').forEach(el => {
      el.classList.toggle(activeClass, el === btn);
    });
  });

  (function () {
    const copyButtons = document.querySelectorAll('.article--js');

    copyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const spanText = button.querySelector('span');
        if (!spanText) return;

        const textToCopy = spanText.innerText;

        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            // Создаем элемент для всплывающего текста
            const toast = document.createElement('div');
            toast.className = 'copy-toast';
            toast.textContent = 'Скопировано!';

            // Добавляем его внутрь кнопки
            button.appendChild(toast);

            // Удаляем элемент из DOM после завершения анимации (через 800 мс)
            setTimeout(() => {
              toast.remove();
            }, 800);
          })
          .catch(err => {
            console.error('Ошибка копирования: ', err);
          });
      });
    });
  })();

  (function () {
    const cartButtons = document.querySelectorAll('.cart-btn');
    const notification = document.querySelector('.notif');

    if (!cartButtons.length || !notification) return;

    const notifCloseBtn = notification.querySelector('.notif__btn');

    let notifTimeoutId = null;

    function hideNotification() {
      notification.classList.remove('notif--show');
      if (notifTimeoutId) {
        clearTimeout(notifTimeoutId);
        notifTimeoutId = null;
      }
    }

    cartButtons.forEach(button => {
      button.addEventListener('click', () => {
        notification.classList.add('notif--show');

        if (notifTimeoutId) {
          clearTimeout(notifTimeoutId);
        }

        notifTimeoutId = setTimeout(() => {
          notification.classList.remove('notif--show');
          notifTimeoutId = null;
        }, 5000);
      });
    });

    if (notifCloseBtn) {
      notifCloseBtn.addEventListener('click', () => {
        hideNotification();
      });
    }
  })();

  (function () {
    const openButton = document.querySelector('.searchMobile__btn-open');
    const closeButton = document.querySelector('.searchMobile__btn-close');
    const htmlElement = document.documentElement;

    // Проверяем наличие кнопки открытия, чтобы избежать ошибок
    if (openButton) {
      openButton.addEventListener('click', () => {
        // Удаляем ненужные классы (дубликат menu-wrapper--open убран)
        htmlElement.classList.remove(
          'menu-wrapper--open',
          'megamenu--active',
          'menu--switching',
          'burger--active'
        );

        // Добавляем класс мобильного поиска
        htmlElement.classList.add('searchMobile--open');

        // Останавливаем скролл, если lenis доступен
        if (typeof lenis !== 'undefined') lenis.stop();
      });
    }

    // Проверяем наличие кнопки закрытия
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        htmlElement.classList.remove('searchMobile--open');
        if (typeof lenis !== 'undefined') lenis.start();
      });
    }
  })();

  // (function () {
  //   const categorySlides = document.querySelectorAll('.category__slide');
  //   const categoryItems = document.querySelectorAll('.catalog__item');

  //   let hideTimeout = null;

  //   categorySlides.forEach(slide => {
  //     slide.addEventListener('mouseenter', () => {
  //       clearTimeout(hideTimeout);

  //       categoryItems.forEach(item => {
  //         item.classList.remove('active');
  //         if (item.dataset.slide === slide.dataset.slide) {
  //           item.classList.add('active');
  //         }
  //       });
  //     });

  //     slide.addEventListener('mouseleave', () => {
  //       hideTimeout = setTimeout(() => {
  //         categoryItems.forEach(item => item.classList.remove('active'));
  //       }, 150);
  //     });
  //   });

  //   categoryItems.forEach(item => {
  //     item.addEventListener('mouseenter', () => {
  //       clearTimeout(hideTimeout);
  //     });

  //     item.addEventListener('mouseleave', () => {
  //       hideTimeout = setTimeout(() => {
  //         categoryItems.forEach(i => i.classList.remove('active'));
  //       }, 150);
  //     });
  //   });
  // })();

});