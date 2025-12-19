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

  /**
   * Функция выпадашки при наведении на dropout айтемы
   */
  (function dropoutFunc() {
    const dropoutParents = document.querySelectorAll('.dropout-parent');
    if (!dropoutParents) return;

    dropoutParents.forEach(dropoutParent => {
      dropoutParent.addEventListener('mouseenter', function () {
        dropoutParent.querySelector('.dropout').classList.add('dropout-show');
      })
      dropoutParent.addEventListener('mouseleave', function () {
        dropoutParent.querySelector('.dropout').classList.remove('dropout-show');
      })
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
   * Код для раскрытия меню кталога и бургер меню
   * Смена мегаменю и бургер-меню внутри раскрытой обертки
   */
  (function unifiedMenu() {
    const html = document.documentElement;
    const catalogBtn = document.getElementById('headerCatalogBtn');
    const burgerBtn = document.getElementById('burger-btn');

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

        removeMegaItemActive(); // УДАЛЕНИЕ ТОЛЬКО ПРИ ОТКРЫТИИ БУРГЕРА
      }

      lenis.stop();
    };

    const closeMenu = () => {
      html.classList.remove(
        'menu-wrapper--open',
        'megamenu--active',
        'burger--active',
        'menu--switching'
      );

      lenis.start();
    };

    const toggleMenu = (type) => {
      const isOpen = html.classList.contains('menu-wrapper--open');
      const isSameType =
        (type === 'mega' && html.classList.contains('megamenu--active')) ||
        (type === 'burger' && html.classList.contains('burger--active'));

      // Переключение типа меню
      if (isOpen && !isSameType) {
        html.classList.add('menu--switching');
        openMenu(type, true);
        return;
      }

      // Закрытие по повторному клику
      if (isOpen && isSameType) {
        closeMenu();
        return;
      }

      // Обычное открытие
      openMenu(type);
    };

    catalogBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu('mega');
    });

    burgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu('burger');
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
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
    const swiperSliders = document.querySelector('.swiper');
    if (!swiperSliders) return;

    const categorySlider = new Swiper('.category__slider', {
      slidesPerGroup: 1,
      slidesPerView: 'auto',
      spaceBetween: 10,
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
      navigation: { prevEl: ".category-button-prev", nextEl: ".category-button-next" },
    });
    const popularSlider = new Swiper('.popular__slider', {
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
        835: { slidesPerView: 4, spaceBetween: 20 }
      },
      navigation: { prevEl: ".popular-button-prev", nextEl: ".popular-button-next" },
      pagination: { el: ".swiper-pagination", clickable: true },
    });
    const pressCenterSlider = new Swiper('.press-center__slider', {
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
        835: { slidesPerView: 4, spaceBetween: 20 }
      },
      navigation: { prevEl: ".press-center-button-prev", nextEl: ".press-center-button-next" },
      pagination: { el: ".swiper-pagination", clickable: true },
    });
    const reviewsSlider = new Swiper('.reviews__slider', {
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
        835: { slidesPerView: 3, spaceBetween: 20 }
      },
      navigation: { prevEl: ".reviews-button-prev", nextEl: ".reviews-button-next" },
      pagination: { el: ".swiper-pagination", clickable: true },
    });
    const productSliderMin = new Swiper('.product__slider-min', {
      slidesPerGroup: 1,
      slidesPerView: 4,
      spaceBetween: 10,
      loop: false,
      speed: 500,
      simulateTouch: true,
      watchOverflow: true,
      watchSlidesProgress: true,
      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
        releaseOnEdges: true
      },
    });
    const productSliderBig = new Swiper('.product__slider-big', {
      slidesPerGroup: 1,
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      speed: 500,
      simulateTouch: true,
      watchOverflow: true,
      watchSlidesProgress: true,
      grabCursor: true,
      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
        releaseOnEdges: true
      },
      pagination: { el: ".swiper-pagination", clickable: true },
      thumbs: {
        swiper: productSliderMin,
      },
    });
    // productSliderMin.controller.control = productSliderBig;
    // productSliderBig.controller.control = productSliderMin;
  })();

  /**
   * Анимация текста
   */
  function scrollTriggerPlayer(triggerElement, timeline, onEnterStart = "top 95%") {
    ScrollTrigger.create({ trigger: triggerElement, start: "top bottom", onLeaveBack: () => { timeline.progress(1); timeline.pause(); } });
    ScrollTrigger.create({ trigger: triggerElement, start: onEnterStart, scrub: true, onEnter: () => timeline.play() });
  }

  gsap.utils.toArray('[data-split="lines"]').forEach(dataSplitLines => {
    const textSplits = dataSplitLines.querySelectorAll('h1, h2, h3, h4, h5, h6, a');
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
   * Инициализация Fabcybox
   */
  Fancybox.bind('[data-fancybox]', {
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

  /**
   * Инициализация формы набора символов
   */
  const form = document.querySelector('form');
  if (form) {
    const inputElements = document.querySelectorAll('.form-input');
    const textareaElements = document.querySelectorAll('.form-textarea');
    const className = 'filled';

    inputElements.forEach(element => {
      element.addEventListener('input', function () {
        if (this.value.trim() !== '') {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }
      });
    });

    textareaElements.forEach(element => {
      element.addEventListener('input', function () {
        if (this.value.trim() !== '') {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }
      });
    });
  }

  // const checkInputs = document.querySelectorAll('.check-label');

  // if (!checkInputs.lenght) return;

  // checkInputs.forEach(checkInput => {
  //   checkInput.addEventListener('click', function () {
  //     checkInput.parentNode.classList.add('check-active');
  //   });
  // });

  // const checkBlocks = document.querySelectorAll('.check-block');

  // if (!checkBlocks.length) return;

  // checkBlocks.forEach(checkBlock => {
  //   const checkInput = checkBlock.querySelector('.check-input');

  //   checkBlock.addEventListener('click', () => {
  //     checkInput.checked = true;
  //     checkInput.dispatchEvent(new Event('change')); // если нужно отслеживать событие

  //     checkBlocks.forEach(b => b.classList.remove('check-active'));

  //     checkBlock.classList.add('check-active');
  //   });
  // });

  /**
   * Смена отзывов через фильтр
   */
  const ajaxPage = document.querySelector('.ajax-page');
  if (ajaxPage) {
    const ajaxBtns = ajaxPage.querySelector('.ajax-btns');
    const ajaxBtn = $(ajaxBtns).find('.ajax-btn');
    ajaxBtn.on('click', function filterFunc() {
      ajaxBtn.removeClass('ajax-btn-active')
      $(this).addClass('ajax-btn-active')
      const attr = $(this).data('cabinet');
      $.get('./ajax/cabinet-' + attr + '.html', function (data) {
        $('.cabinet__body').html(data)
      })
    })
  }

  (function quantityFunc() {

    const quantities = document.querySelectorAll('.quantity');

    if(!quantities.length) return;

    quantities.forEach(quantity => {
      const input = quantity.querySelector('input');
      const btnMinus = quantity.querySelector('.quantity__btn--minus');
      const btnPlus = quantity.querySelector('.quantity__btn--plus');

      const min = Number(quantity.dataset.min) || 1;
      const max = Number(quantity.dataset.max) || 100;
      const suffix = ' шт';

      function getValue() {
        const number = parseInt(input.value.replace(/\D/g, ''), 10);
        return isNaN(number) ? min : number;
      }

      function setValue(value) {
        value = Math.max(min, Math.min(max, value));
        input.value = value + suffix;
      }

      btnMinus.addEventListener('click', () => {
        setValue(getValue() - 1);
      });

      btnPlus.addEventListener('click', () => {
        setValue(getValue() + 1);
      });

      input.addEventListener('input', () => {
        const value = getValue();
        input.value = value + suffix;
      });

      input.addEventListener('blur', () => {
        setValue(getValue());
      });
    });
  })();

});