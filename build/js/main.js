"use strict";

(function ($) {
  $.fn.inputFilter = function (inputFilter) {
    return this.on('input keydown keyup mousedown mouseup select contextmenu drop', function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty('oldValue')) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = '';
      }
    });
  };
})(jQuery);

$('body').on('submit', 'form', function (e) {
  e.preventDefault();
});
var features = new Swiper('.features .swiper-container', {
  slidesPerView: 1.3,
  slidesPerGroup: 1,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  navigation: {
    nextEl: '.features .swiper-button-next',
    prevEl: '.features .swiper-button-prev'
  },
  pagination: {
    el: '.features .swiper-pagination'
  },
  breakpoints: {
    768: {
      slidesPerView: 2.3,
      slidesPerGroup: 1
    },
    1024: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      centeredSlides: false,
      loop: false
    }
  }
});
var reviews = new Swiper('.reviews .swiper-container', {
  slidesPerView: 1.2,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.reviews .swiper-pagination'
  },
  breakpoints: {
    768: {
      slidesPerView: 'auto',
      spaceBetween: 20
    }
  }
});
var portfolioMain = new Swiper('.portfolio .main', {
  slidesPerView: 1,
  allowTouchMove: false,
  spaceBetween: 10,
  thumbs: {
    swiper: portfolioNavigation
  },
  navigation: {
    nextEl: '.portfolio .swiper-button-next',
    prevEl: '.portfolio .swiper-button-prev'
  }
});
var portfolioNavigation = new Swiper('.portfolio .nav', {
  slidesPerView: 1.2,
  spaceBetween: 10,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  navigation: {
    nextEl: '.portfolio .swiper-button-next',
    prevEl: '.portfolio .swiper-button-prev'
  },
  pagination: {
    el: '.portfolio .swiper-pagination'
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      centeredSlides: false
    },
    1024: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      centeredSlides: false
    }
  },
  on: {
    click: function click() {
      portfolioNavigation.slideTo(portfolioNavigation.clickedIndex);
      portfolioMain.slideTo(portfolioNavigation.clickedIndex);
      portfolioNavigation.autoplay.start();
    },
    slideChange: function slideChange() {
      portfolioMain.slideTo(portfolioNavigation.activeIndex);
    }
  }
});
var masks = document.querySelectorAll('.phone-mask');
masks.forEach(function (el) {
  IMask(el, {
    mask: '+{7} (000) 000 00 00'
  });
}); // calculator

var stepsCount = $('.calculator__step').length;

for (var i = 0; i <= stepsCount; i++) {
  $(".calculator__step:nth-child(".concat(i, ")")).attr('data-step', i);
  $(".calculator__progress-step:nth-child(".concat(i, ")")).attr('data-step', i);
}

var updateProgressbar = function updateProgressbar() {
  var currentProgress = Math.round(100 / (stepsCount - 1) * (parseInt($('.calculator__step.active').attr('data-step')) - 1));
  $('.calculator__percent').text(currentProgress);
  $('.calculator__line').animate({
    width: "".concat(currentProgress, "%")
  });
}; // go to next step


$('body').on('click', '.calculator__next', function (e) {
  var activeStep = parseInt($('.calculator__step.active').attr('data-step'));

  if (activeStep < stepsCount) {
    $('.calculator__step').removeClass('visible');
    getUserInfo(activeStep);

    if (!stepValidate(activeStep + 1)) {
      $('.calculator__next').addClass('disable');
    }

    setTimeout(function () {
      activeStep + 1 === 3 || activeStep + 1 === 4 ? $('.calculator__body').addClass('padding') : $('.calculator__body').removeClass('padding');
      activeStep + 1 === 5 ? $('.calculator__controls').addClass('hide') : $('.calculator__controls').removeClass('hide');
      $('.calculator__step').removeClass('active');
      $(".calculator__step[data-step=\"".concat(activeStep + 1, "\"]")).addClass('active').addClass('visible');
      updateProgressbar();

      if (activeStep + 1 === 5) {
        var full = new Odometer({
          el: $('.full')[0],
          format: '( ddd) dd',
          theme: 'minimal',
          duration: 1000
        });
        full.render();
        $('.full').text(cost());
        var result = new Odometer({
          el: $('.calculator__result .price')[0],
          format: '( ddd) dd',
          theme: 'minimal',
          duration: 1000
        });
        result.render();
        $('.calculator__result .price').text(cost() / user.area);
      }

      setTimeout(function () {
        $(".calculator__progress-step[data-step=\"".concat(activeStep + 1, "\"]")).addClass('active');
      }, 300);
    }, 200);
  }

  if (activeStep + 1 === stepsCount) $('.calculator__next').addClass('disable');
  if (activeStep > 0) $('.calculator__prev').removeClass('disable');
  $(".calculator__step[data-step=\"".concat(activeStep + 1, "\"]")).hasClass('bg') ? $('.calculator__content').addClass('bg') : $('.calculator__content').removeClass('bg');
  if ($(window).width() <= 767) $('html, body').stop().animate({
    scrollTop: $('.calculator').offset().top + 50
  });
}); // go to prev step

$('body').on('click', '.calculator__prev', function (e) {
  var activeStep = parseInt($('.calculator__step.active').attr('data-step'));

  if (activeStep > 1) {
    $('.calculator__step').removeClass('visible');
    activeStep - 1 === 3 || activeStep - 1 === 4 ? $('.calculator__body').addClass('padding') : $('.calculator__body').removeClass('padding');
    setTimeout(function () {
      $('.calculator__step').removeClass('active');
      $(".calculator__step[data-step=\"".concat(activeStep - 1, "\"]")).addClass('active').addClass('visible');
      $(".calculator__progress-step[data-step=\"".concat(activeStep, "\"]")).removeClass('active');
      setTimeout(function () {
        updateProgressbar();
      }, 300);
    }, 200);
  }

  if ($('.calculator__next').is('.disable')) $('.calculator__next').removeClass('disable');
  if (activeStep === 2) $('.calculator__prev').addClass('disable');
  $(".calculator__step[data-step=\"".concat(activeStep - 1, "\"]")).hasClass('bg') ? $('.calculator__content').addClass('bg') : $('.calculator__content').removeClass('bg');
});
$('body').on('click', '.calculator__step[data-step="1"] input[type="radio"]', function (e) {
  $('.calculator__next').removeClass('disable');
});
$('body').on('click', '.calculator__step[data-step="2"] input[type="radio"]', function (e) {
  if ($('.calculator__step[data-step="2"] input[type="radio"]:checked').length === 3) {
    $('.calculator__next').removeClass('disable');
  }
});
$('body').on('click', '.calculator__step[data-step="3"] input[type="radio"]', function (e) {
  $('.calculator__next').removeClass('disable');
});
$('body').on('click', '.calculator__step[data-step="4"] input[type="radio"]', function (e) {
  $('.calculator__next').removeClass('disable');
});

var stepValidate = function stepValidate(step) {
  if (step === 1 && $('.calculator__step[data-step="1"] input[type="radio"]:checked').length === 1) {
    return true;
  } else if (step === 2 && $('.calculator__step[data-step="2"] input[type="radio"]:checked').length === 3) {
    return true;
  } else if (step === 3 && $('.calculator__step[data-step="3"] input[type="radio"]:checked').length === 1) {
    return true;
  } else if (step === 4 && $('.calculator__step[data-step="4"] input[type="radio"]:checked').length === 1) {
    return true;
  } else {
    return false;
  }
};

var user = {
  area: 0,
  rooms: 0,
  type: null,
  floor: null,
  roof: null,
  walls: null,
  toilet: false,
  heatFloow: false,
  smartHouse: false,
  defend: false,
  other: false,
  comment: null,
  project: null,
  time: null
};

var string = function string(num) {
  return ".calculator__step[data-step=\"".concat(num, "\"]");
};

var getUserInfo = function getUserInfo(step) {
  if (step === 1) {
    user.area = $('.area-value').val();
    user.rooms = $('.rooms-value').val();
    user.type = $("".concat(string(1), " input[type=\"radio\"]:checked")).val();
  }

  if (step === 2) {
    user.floor = $("".concat(string(2), " input[name=\"floor\"]:checked")).val();
    user.roof = $("".concat(string(2), " input[name=\"roof\"]:checked")).val();
    user.walls = $("".concat(string(2), " input[name=\"walls\"]:checked")).val();
    user.toilet = $("".concat(string(2), " input[name=\"toilet\"]")).is(':checked') ? true : false;
    user.heatFloow = $("".concat(string(2), " input[name=\"heatFloow\"]")).is(':checked') ? true : false;
    user.smartHouse = $("".concat(string(2), " input[name=\"smartHouse\"]")).is(':checked') ? true : false;
    user.defend = $("".concat(string(2), " input[name=\"defend\"]")).is(':checked') ? true : false;
    user.other = $("".concat(string(2), " input[name=\"other\"]")).is(':checked') ? true : false;
    user.comment = $("".concat(string(2), " textarea")).val();
  }

  if (step === 3) {
    user.project = $("".concat(string(3), " input[name=\"project\"]:checked")).val();
  }

  if (step === 4) {
    user.time = $("".concat(string(4), " input[name=\"time\"]:checked")).val();
  } else {
    return false;
  }
};

var cost = function cost() {
  var type = 0;

  switch (user.type) {
    case 'Стандарт':
      type = 12000;
      break;

    case 'Комфорт':
      type = 14000;
      break;

    case 'Индивидуальный':
      type = 16000;
      break;
  }

  var floor = 0;

  switch (user.floor) {
    case 'Ламинат':
      floor = 0;
      break;

    case 'Паркет':
      floor = 2500;
      break;

    case 'Премиум ламинат':
      floor = 820;
      break;
  }

  var roof = 0;

  switch (user.roof) {
    case 'Натяжной':
      roof = 0;
      break;

    case 'Штукатурка':
      roof = 1540;
      break;

    case 'Гипсокартон':
      roof = 2120;
      break;
  }

  var walls = 0;

  switch (user.walls) {
    case 'Обои под покраску':
      walls = 0;
      break;

    case 'Покраска':
      walls = 500;
      break;

    case 'Штукатурка':
      walls = 1500;
      break;
  }

  var toilet = user.toilet ? 20000 : 0;
  var heatFloow = user.heatFloow ? 1000 : 0;
  var smartHouse = user.smartHouse ? 100000 : 0;
  var defend = user.defend ? 31000 : 0;
  var sum = user.area * type + user.area * floor + user.area * roof + user.area * walls + toilet + user.area * heatFloow + smartHouse + defend;
  return sum;
};

var areaSlider = document.getElementById('slider-area');
noUiSlider.create(areaSlider, {
  start: [40],
  connect: 'lower',
  range: {
    min: 30,
    max: 70
  },
  format: wNumb({
    decimals: 0
  })
});
var areaSliderSteps = [];

for (var _i = 1; _i <= $('#slider-area').next().find('span').length; _i++) {
  $('#slider-area').next().find("span:nth-child(".concat(_i, ")")).attr('data-num', parseInt($('#slider-area').next().find("span:nth-child(".concat(_i, ")")).text()));
  areaSliderSteps.push(parseInt($('#slider-area').next().find("span:nth-child(".concat(_i, ")")).text()));
}

var positionArea = 0;
areaSlider.noUiSlider.on('update', function (values, handle) {
  for (var _i2 = 1; _i2 <= areaSliderSteps.length; _i2++) {
    $('#slider-area').prev().find('input').val(values[0]);

    if (values[0] >= areaSliderSteps[_i2] && values[0] > positionArea) {
      $('#slider-area').next().find("span[data-num=\"".concat(areaSliderSteps[_i2], "\"]")).addClass('active');
    }

    if (values[0] <= areaSliderSteps[_i2] && values[0] < positionArea) {
      $('#slider-area').next().find("span[data-num=\"".concat(areaSliderSteps[_i2], "\"]")).removeClass('active');
    }
  }

  positionArea = values[0];
});
$('body').on('blur', '.area-value', function (e) {
  areaSlider.noUiSlider.set([e.target.value]);
});
var roomsSlider = document.getElementById('slider-rooms');
noUiSlider.create(roomsSlider, {
  start: [2],
  connect: 'lower',
  step: 1,
  range: {
    min: 0,
    max: 9
  },
  format: wNumb({
    decimals: 0
  })
});
var roomsSliderSteps = [];

for (var _i3 = 1; _i3 <= $('#slider-rooms').next().find('span').length; _i3++) {
  $('#slider-rooms').next().find("span:nth-child(".concat(_i3, ")")).attr('data-num', parseInt($('#slider-rooms').next().find("span:nth-child(".concat(_i3, ")")).text()));
  roomsSliderSteps.push(parseInt($('#slider-rooms').next().find("span:nth-child(".concat(_i3, ")")).text()));
}

var positionRooms = 0;
roomsSlider.noUiSlider.on('update', function (values, handle) {
  for (var _i4 = 1; _i4 <= roomsSliderSteps.length; _i4++) {
    if (values[0] === '0') {
      $('#slider-rooms').prev().find('input').val('студия');
    } else {
      $('#slider-rooms').prev().find('input').val(values[0]);
    }

    if (values[0] >= roomsSliderSteps[_i4] && values[0] > positionRooms) {
      $('#slider-rooms').next().find("span[data-num=\"".concat(roomsSliderSteps[_i4], "\"]")).addClass('active');
    }

    if (values[0] <= roomsSliderSteps[_i4] && values[0] < positionRooms) {
      $('#slider-rooms').next().find("span[data-num=\"".concat(roomsSliderSteps[_i4], "\"]")).removeClass('active');
    }
  }

  positionRooms = values[0];
});
$('.rooms-value').inputFilter(function (value) {
  return /^-?\d*$/.test(value);
});
$('body').on('blur', '.rooms-value', function (e) {
  roomsSlider.noUiSlider.set([e.target.value]);
}); // textarea counter

function countChar(val) {
  var len = val.value.length;

  if (len > 250) {
    val.value = val.value.substring(0, 250);
  } else {
    $('.textarea__count span').text(len);
  }
} // modals
// show modal


$('body').on('click', '[data-modal]:not(.modal)', function (e) {
  if (!$('.backdrop').hasClass('active')) $('.backdrop').addClass('active');
  $('.modal.active').removeClass('active');
  $(".modal[data-modal=\"".concat($(e.currentTarget).attr('data-modal'), "\"]")).addClass('active');

  if ($(e.currentTarget).attr('data-modal') === 'thanks') {
    setTimeout(function () {
      $('.modal.active').find('svg').addClass('animate');
    }, 100);
  }
}); // close modal events

var closeModal = function closeModal() {
  $('.backdrop').removeClass('active');
  $('.modal').removeClass('active');
  $('.modal').find('svg').removeClass('animate');
};

$('body').on('click', '.modal__close, .modal .close', closeModal);
$('body').on('click', '.backdrop', function (e) {
  if ($(e.target)[0].className === 'backdrop active') closeModal();
}); // close modal on press ESC

$(document).keyup(function (e) {
  if (e.keyCode === 27 && $('.backdrop').hasClass('active')) closeModal();
}); // form validation

$('body').on('blur', 'input[type="text"]', function (e) {
  if ($(e.currentTarget).val() !== '') {
    $(e.currentTarget).removeClass('error');
  }
});
$('body').on('click', 'form button', function (e) {
  if ($(e.currentTarget).parent().find('input').val() === '' || $(e.currentTarget).parent().find('input').val().length !== 18) {
    $(e.currentTarget).parent().find('input').addClass('error');
  } else {
    sendForm(user, $(e.currentTarget).parent().find('input').val());
    if (!$('.backdrop').hasClass('active')) $('.backdrop').addClass('active');
    $('.modal.active').removeClass('active');
    $(".modal[data-modal=\"thanks\"]").addClass('active');
    setTimeout(function () {
      $('.modal.active').find('svg').addClass('animate');
    }, 100);
  }
});

var sendForm = function sendForm(user, tel) {
  return false;
};