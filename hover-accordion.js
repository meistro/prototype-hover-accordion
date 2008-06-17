/**
 * Usage:
 * new HoverAccordion('YourUnorderedListID');
 */
var HoverAccordion = Class.create({
  initialize: function(elem) {
    elem                 = $(elem);
    this.active_section  = $$('.active').first();
    this.is_sliding      = false;
    this.over_elem       = null;
    
    elem.select('.section').each(function(section) {
      var header = section.down("h5");
      header.observe('mousemove', function(event) {
        if (this.is_sliding)
          return;
        
        // wait 2 seconds, if still over elem, start slide
        this.over_elem = event.element();
        
        setTimeout(function(old_elem) {
          if (this.over_elem == old_elem)
            this.slide_section(this.over_elem);
        }.curry(this.over_elem), 350);
      });
    });
  },
  
  slide_section: function(clicked_elem) {
    var clicked_section = clicked_elem.up('.section');
    var clicked_content = clicked_section.down(".content");

    if (clicked_section.hasClassName('active') || !clicked_content) 
      return;
  
    var active_content = this.active_section.down(".content");
    this.is_sliding = true;

    new Effect.Parallel([
      Effect.BlindDown(clicked_content),
      Effect.SlideUp(active_content)
    ], { 
      duration: 0.35,
      afterFinish: function() { 
        this.is_sliding = false;
      }.bind(this)
    });

    this.active_section.removeClassName('active');
    clicked_section.addClassName('active');
    this.active_section = clicked_section;
  }
}); 