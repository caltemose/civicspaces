(function() {
  if (this.cs == null) {
    this.cs = {};
  }

  this.cs.page = {
    selections: {},
    init: function() {
      cs.page.selections.results = $('#mapresults');
      cs.sharedMethods.initMap('#googlemap');
      cs.sharedMethods.setBoundsUpdate(cs.page.handleBoundsUpdate);
      return cs.sharedMethods.cloudinaryConfig();
    },
    handleBoundsUpdate: function() {
      var bounds, geo;
      bounds = cs.map.getBounds();
      geo = {
        ne_lat: bounds.getNorthEast().lat(),
        ne_lng: bounds.getNorthEast().lng(),
        sw_lat: bounds.getSouthWest().lat(),
        sw_lng: bounds.getSouthWest().lng()
      };
      return $.getJSON('/api/properties/bounded', geo, cs.page.displaySpaces);
    },
    displaySpaces: function(data) {
      var space, _i, _len, _ref;
      if (data.err) {
        return console.log(err);
      }
      if (data.spaces && data.spaces.length > 0) {
        cs.page.selections.results.html('');
        _ref = data.spaces;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          space = _ref[_i];
          cs.page.displaySpace(space);
        }
        return $('.cloudinary-image').cloudinary();
      } else {
        return console.log('no Spaces found in given boundaries');
      }
    },
    displaySpace: function(space) {
      var html;
      cs.map.addMarkerBySpace(space);
      html = '<div class="col-sm-6"><div class="well result clearfix">';
      if (space.images.length) {
        html += '<a href="/space/view/' + space._id + '">';
        html += '<img class="cloudinary-image" data-src="';
        html += space.images[0].cloudinary_id + '" data-width="100" data-height="100" data-crop="thumb" /></a>';
      }
      html += '<h4><a href="/space/view/' + space._id + '">' + space.address + '</a><small>';
      if (space.type && space.type.length) {
        html += space.type + '<br>';
      }
      if (space.leaseLength && space.leaseLength.length) {
        html += space.leaseLength;
      }
      html += '</small></h4></div>';
      return cs.page.selections.results.append(html);
    }
  };

  $(document).ready(function() {
    return google.maps.event.addDomListener(window, 'load', cs.page.init);
  });

}).call(this);
