// From https://developer.mozilla.org/en-US/docs/Web/Events/wheel
// creates a global cross browser "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
!function(a,e){var o,r,d="";function n(e,t,l,n){e[o](d+t,"wheel"==r?l:function(e){!e&&(e=a.event);var t={originalEvent:e,target:e.target||e.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"==e.type?0:1,deltaX:0,deltaY:0,deltaZ:0,preventDefault:function(){e.preventDefault?e.preventDefault():e.returnValue=!1}};return"mousewheel"==r?(t.deltaY=-.025*e.wheelDelta,e.wheelDeltaX&&(t.deltaX=-.025*e.wheelDeltaX)):t.deltaY=e.deltaY||e.detail,l(t)},n||!1)}a.addEventListener?o="addEventListener":(o="attachEvent",d="on"),r="onwheel"in e.createElement("div")?"wheel":void 0!==e.onmousewheel?"mousewheel":"DOMMouseScroll",a.addWheelListener=function(e,t,l){n(e,r,t,l),"DOMMouseScroll"==r&&n(e,"MozMousePixelScroll",t,l)}}(window,document);

(function() {
  'use strict';
  var indexIsOpen = false;
  var mobileSlideAnimationCompleted = false;
  var touchStartY;

  function $(selector) {
    return document.querySelectorAll(selector);
  }

  function getPseudoContent(el, contentIdentifier) {
    var val = window.getComputedStyle(el, contentIdentifier).getPropertyValue('content');
    return val.replace(/["']/g, "");
  }

  function mobileSlideAnimation() {
    if (mobileSlideAnimationCompleted) {
      return;
    }

    if (getPseudoContent($('.mobile-slider')[0], '::after') !== 'mobile-slider-active') {
      mobileSlideAnimationCompleted = true;
    }

    setTimeout(function() {
      document.body.classList.add('slide-in');

      setTimeout(function() {
        mobileSlideAnimationCompleted = true;
      }, 1250);
    }, 2000);
  }
  window.addEventListener('load', mobileSlideAnimation);

  function toggleOpen() {
    document.body.classList.add('index-toggled');
    indexIsOpen = true;
  }
  $('.open-list')[0].addEventListener('click', toggleOpen);

  if (window.location.hash && window.location.hash === '#index') {
    document.body.classList.add('no-clip-transition');
    document.body.classList.add('slide-in');
    mobileSlideAnimationCompleted = true;
    toggleOpen();
    history.pushState('', document.title, window.location.pathname + window.location.search);
    document.body.offsetLeft;
    document.body.classList.remove('no-clip-transition');
  }

  function toggleClose() {
    document.body.classList.remove('index-toggled');
    indexIsOpen = false;
  }
  $('.close-list')[0].addEventListener('click', toggleClose);

  function wheelToggle(e) {
    e.preventDefault();

    if (e.deltaY > 0) {
      if (! indexIsOpen && mobileSlideAnimationCompleted) {
        toggleOpen();
      }
    } else if (e.deltaY < 0) {
      if (indexIsOpen) {
        toggleClose();
      }
    }
  }
  addWheelListener(document, wheelToggle);

  function recordTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }
  document.addEventListener('touchstart', recordTouchStart);

  function triggerSwipeToggle(e) {
    var touchEndY = e.changedTouches[0].clientY;

    // In case browser doesn't support passive option
    try {
      e.preventDefault();
    } catch (e) {}

    if (touchStartY > touchEndY + 5) {
      if (! indexIsOpen && mobileSlideAnimationCompleted) {
        toggleOpen();
      }
    } else if (touchStartY < touchEndY - 5) {
      if (indexIsOpen) {
        toggleClose();
      }
    }
  }

  // Not all browsers support the passive option
  try {
    // https://stackoverflow.com/a/49582193/940252
    document.addEventListener('touchmove', triggerSwipeToggle, { passive: false });
  } catch (e) {
    document.addEventListener('touchmove', triggerSwipeToggle);
  }

  function triggerKeyToggle(e) {
    if (! e.key) {
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'PageUp':
        if (indexIsOpen) {
          toggleClose();
        }
      break;

      case 'ArrowDown':
      case 'PageDown':
        if (! indexIsOpen && mobileSlideAnimationCompleted) {
          toggleOpen();
        }
      break;
    }
  }
  document.addEventListener('keyup', triggerKeyToggle);

  function clickLinkInsideLi(e) {
    if (e.target.tagName === 'LI') {
      var location = this.querySelector('a').getAttribute('href');
      window.location = location;
    }
  }
  var indexLis = $('.index li');
  for (var i = 0; i < indexLis.length; i++) {
    indexLis[i].addEventListener('click', clickLinkInsideLi);
  }

}());
