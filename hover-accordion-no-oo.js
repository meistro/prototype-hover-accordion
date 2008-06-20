function hoverAccordion(list) {
  var elem           = list;
  var isSliding      = false;
  var overElement    = undefined;
  var currentElement = undefined;
  
  var options = Object.extend({
	  activeClass: 'active', // Class assigned to active dt/dd
		wait:        350,      // Wait time in milliseconds
		duration:    350       // Sliding time in milliseconds
	}, arguments[1] || {});
  
  var effect = {
    toggle: function (showElem, hideElem, afterCallback) {
      hideElem.hide();
      showElem.show();
      afterCallback();
    },
    
    slide: function (showElem, hideElem, afterCallback) {
      var parallel = new Effect.Parallel([
        Effect.BlindDown(showElem),
        Effect.BlindUp(hideElem)
      ], { 
        duration: options.duration / 1000,
        afterFinish: afterCallback
      });
    }
  };
  
	// Reference action method when given an alias
	if (!options.effect) {
    options.effect = (options.duration <= 0) ? effect.toggle : effect.slide;
  }
  
  function beginSlide(clickedElement) {
    if (isSliding || (overElement === currentElement) || (overElement !== clickedElement)) {
      return;
    }

    isSliding = true;
    currentElement.removeClassName(options.activeClass);
    clickedElement.addClassName(options.activeClass);
    
    options.effect(clickedElement.next('dd'), currentElement.next('dd'), function (clickedElement) {
      isSliding      = false;
      currentElement = clickedElement;
    }.curry(clickedElement));
  }
  
  function setup() {
    elem = $(elem);
    elem.select('dt + dd').each(function (e) {
      var header = e.previous('dt');
      header.setAttribute('hascontent', 'true');
      if (header.hasClassName(options.activeClass)) {
        currentElement = header;
      } else {
        e.hide();
      }
    });

    document.observe('mousemove', function (event) {
      if (isSliding) {
        return;
      }

      overElement = event.findElement('dt');

      if (!overElement || (overElement.getAttribute('hascontent') !== 'true') || (overElement.up('dl') !== elem)) {
        return;
      }

      // wait a few seconds, if still over elem, start slide
      setTimeout(beginSlide.curry(overElement), options.wait);
    });
  }
  
  // Wait until the DOM is loaded
  if (document.loaded) {
    setup(elem);
  } else {
    document.observe('dom:loaded', setup);
  }
}