// Generated by CoffeeScript 1.6.3
(function() {
  if (this.cs == null) {
    this.cs = {};
  }

  this.cs.page = {
    init: function() {
      console.log('cs.page.init');
      this.cs.map.init('#googlemap', 33.7811643, -84.38362970000003);
      return this.cs.map.addMarker(33.7811643, -84.38362970000003);
    }
  };

  google.maps.event.addDomListener(window, 'load', cs.page.init);

}).call(this);
