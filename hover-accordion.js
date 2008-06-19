/**
 * Usage:
 * new HoverAccordion('YourUnorderedListID');
 */
var HoverAccordion = Class.create({
  initialize: function(elem) {
    this.elem    = elem;
  	this.options = Object.extend({
  	  activeClass: 'active', // Class assigned to active dt/dd
  		wait:        350,      // Wait time in milliseconds
  		duration:    350       // Sliding time in milliseconds
  	}, arguments[1] || {});
  	
  	// Reference action method when given an alias
  	if (!this.options.effect)
      this.options.effect = (this.options.duration <= 0) ? this.effect.toggle : this.effect.slide;
	
	  // Wait until the DOM is loaded
    if (document.loaded)
      this.setup(elem);
    else
      document.observe('dom:loaded', this.setup.bind(this));
  },
  
  setup: function(elem) {
    this.elem       = $(this.elem);
    this.isSliding = false;

    this.elem.select('dt + dd').each(function(e) {
      var header = e.previous('dt');
      header.setAttribute('hascontent', 'true');
      if (header.hasClassName(this.options.activeClass))
        this.currentElement = header;
      else
        e.hide();
    }, this);
    
    document.observe('mousemove', function(event) {
      if (this.isSliding)
        return;

      this.overElement = event.findElement('dt');
      
      if (!this.overElement || (this.overElement.getAttribute('hascontent') != 'true') || (this.overElement.up('dl') != this.elem))
        return;
        
      // wait a few seconds, if still over elem, start slide
      setTimeout(this.beginSlide.curry(this.overElement).bind(this), this.options.wait);
    }.bindAsEventListener(this));
  },
  
  beginSlide: function(clickedElement) {
    if (this.isSliding || (this.overElement == this.currentElement) || (this.overElement != clickedElement))
      return;

    this.isSliding = true;
    this.options.effect.bind(this)(clickedElement.next('dd'), 
                        this.currentElement.next('dd'),
                        this.afterSlide.curry(clickedElement).bind(this));
  },
  
  afterSlide: function(clickedElement) {
    this.isSliding = false;
    this.currentElement.removeClassName(this.options.activeClass);
    this.currentElement = clickedElement;
    this.currentElement.addClassName(this.options.activeClass);
  },
  
  effect: {
    toggle: function(showElem, hideElem, afterCallback) {
      hideElem.hide();
      showElem.show();
      afterCallback();
    },
    
    slide: function(showElem, hideElem, afterCallback) {
      new Effect.Parallel([
        Effect.SlideDown(showElem),
        Effect.BlindUp(hideElem)
      ], { 
        duration: this.options.duration / 1000,
        afterFinish: afterCallback
      });
    }
  }
});