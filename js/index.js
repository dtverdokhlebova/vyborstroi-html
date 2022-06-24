document.addEventListener('DOMContentLoaded', function () {
  headerHeight()
  loader()
  uiSelects()
  uiRange()
  popupScripts()
  bannerSlider()
  filter()
  testForm()
})

window.addEventListener('resize', function () {
  headerHeight()
}, true)

function headerHeight() {
  document.documentElement.style.setProperty('--header-height', `${document.querySelector('.header').offsetHeight}px`)
}

function uiSelects() {
  if ($('.ui-select').length > 0) {
    const selects = document.querySelectorAll('.ui-select select')
    for (const select of selects) {
      const selectParent = select.parentElement
      $(select).select2({
        minimumResultsForSearch: Number.POSITIVE_INFINITY,
        width: 'auto',
        dropdownAutoWidth: true,
        dropdownParent: selectParent,
        placeholder: function () {
          $(this).data('placeholder')
        }
      })
    }
  }
}

function uiRange() {
  if ($('.ui-range').length > 0) {
    const ranges = document.querySelectorAll('.ui-range')

    for (const range of ranges) {
      const itemRange = range.querySelector('.ui-range-body')
      const minInp = Number.parseInt(range.dataset.min, 10)
      const maxInp = Number.parseInt(range.dataset.max, 10)
      const inputRange = range.querySelector('.ui-range__inp input')

      noUiSlider.create(itemRange, {
        start: minInp,
        connect: 'lower',
        range: {
          min: minInp,
          max: maxInp
        }
      })

      itemRange.noUiSlider.on('update', function (values, handle) {
        inputRange.value = Math.round(values[handle]).toLocaleString()
        const event = new CustomEvent('rangeChange', {
          detail: {
            value: Math.round(values[handle])
          }
        })
        inputRange.dispatchEvent(event)
      })

      inputRange.addEventListener('change', function () {
        itemRange.noUiSlider.set(+(this.value).replace(/\s/g, ''))
      })
    }
  }
}

function bannerSlider() {
  if ($('.banner').length > 0) {
    const bannerSwiper = new Swiper('.banner .swiper', {
      slidesPerView: 'auto',
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      breakpoints: {
        767: {
          slidesPerView: 1
        }
      }
    })
  }
}

function flatBannerSlider() {
  if ($('.flat-banner__slider').length > 0) {
    const flatBannerSwiper = new Swiper('.flat-banner__slider .swiper', {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true
      }
    })
  }
}

function flatOtherSlider() {
  if ($('.flat-other__slider').length > 0) {
    const flatOtherSwiper = new Swiper('.flat-other__slider .swiper', {
      slidesPerView: 2,
      spaceBetween: 0,
      watchSlidesProgress: true,
      rewind: true,
      navigation: {
        nextEl: '.flat-other__btn'
      },
      breakpoints: {
        767: {
          spaceBetween: 25
        }
      }
    })
  }
}

function flatInfo() {
  $('.flat-info__btn--deskt span').on('click', function () {
    $(this).toggleClass('active')
    $(this).parents('.flat-info__item').find('.flat-info__line--hidden').slideToggle()
  })

  $('.flat-info__btn--mob span').on('click', function () {
    $(this).toggleClass('active')
    $('.flat-info__item--mob-hidden').toggleClass('open')
    $('.flat-info__line--hidden').slideToggle()
  })
}

function filter() {
  $('.filter__more').on('click', function () {
    $(this).toggleClass('active')
    $(this).parents('.filter').find('.filter__hidden').slideToggle()
  })
  $('.filter-open').on('click', function () {
    $('.filter').fadeIn()
    $('html').addClass('ov-hidden')
  })
  $('.filter__close').on('click', function () {
    $('.filter').fadeOut()
    $('html').removeClass('ov-hidden')
  })
}

function testForm() {
  $('.js-test-request-call').on('submit', function (event) {
    event.preventDefault()
    $(this).parents('.request-call').addClass('request-call--success')
  })

  $('.js-test-request-call .ui-input input').on('keyup', function () {
    if ($(this).val().length > 0) {
      $(this).parents('.ui-input').removeClass('ui-input--error')
    } else {
      $(this).parents('.ui-input').addClass('ui-input--error')
    }
  })
}

function loader() {
  $('html').addClass('ov-hidden')

  $(window).on('load', function () {
    $('.loader').fadeOut(400)
    $('html').removeClass('ov-hidden')
  })
}

function popupScripts() {
  const closePopupButton = document.querySelector('.js-close-popup')
  if (closePopupButton) {
    closePopupButton.addEventListener('click', function () {
      Fancybox.close(true)
    })
  }
}


function getPopup(popup) {
  const popupSrc = popup.data('type')
  const popupClass = popupSrc.slice(0, -6)
  const popupCloseButton = popup.data('close-popup')

  Fancybox.show(
    [
      {
        src: `#${popupSrc}`,
        preload: false,
      },
    ],
    {
      mainClass: `popup popup--${popupClass}`,
      parentEl: document.querySelector('.wrapper'),
      showClass: 'fancybox-fadeIn',
      hideClass: 'fancybox-fadeOut',
      hideScrollbar: true,
      touch: false,
      autoFocus: true,
      trapFocus: true,
      dragToClose: false,
      closeButton: popupCloseButton,
      
      on: {
        done: (fancybox, slide) => {
          if (popupSrc === 'flat-inner-popup') {
            flatOtherSlider()
            flatBannerSlider()
            flatInfo()
            locationMap()
          }
        }
      }
    }
  );

  
  Fancybox.defaults.ScrollLock = false

  return false
}

function locationMap() {
  if ($('#locationMap').length > 0) {
    let myMap
    const mapBlock = document.querySelector('#locationMap')

    const coordsLat = Number.parseFloat(mapBlock.dataset.coordsLat)
    const coordsLng = Number.parseFloat(mapBlock.dataset.coordsLng)

    ymaps.ready(init)
    function init() {
      myMap = new ymaps.Map('locationMap', {
        center: [coordsLat, coordsLng],
        zoom: 13,
        controls: []
      }, {
        suppressMapOpenBlock: true
      })
      const placemark = new ymaps.Placemark([coordsLat, coordsLng], {}, {
        preset: 'islands#icon',
        iconColor: '#E44B53'
      })

      myMap.geoObjects.add(placemark)
      myMap.behaviors.disable('scrollZoom')
      if (window.innerWidth < 1025) {
        myMap.behaviors.disable('drag')
      }
    }
  }
}
