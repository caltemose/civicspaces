(function() {
  if (this.cs == null) {
    this.cs = {};
  }

  this.cs.page = {
    selections: {},
    init: function() {
      cs.page.selections.results = $('#mapresults');
      cs.sharedMethods.initMap('#googlemap');
      return cs.sharedMethods.setBoundsUpdate(cs.page.handleBoundsUpdate);
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
      var space, _i, _len, _ref, _results;
      if (data.err) {
        return console.log(err);
      }
      if (data.spaces && data.spaces.length > 0) {
        cs.page.selections.results.html('');
        _ref = data.spaces;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          space = _ref[_i];
          _results.push(cs.page.displaySpace(space));
        }
        return _results;
      } else {
        return console.log('no Spaces found in given boundaries');
      }
    },
    displaySpace: function(space) {
      var html;
      cs.map.addMarkerBySpace(space);
      html = "<div class=\"col-sm-6\"><div class=\"well result clearfix\">\n<h4><a href=\"/space/view/" + space._id + "\">" + space.address + "</a></h4>\n<ul>";
      if (space.type) {
        html += '<li>' + space.type + '</li>';
      }
      if (space.leaseLength) {
        html += '<li>' + space.leaseLength + '</li>';
      }
      html += '</ul></div></div>';
      return cs.page.selections.results.append(html);
    }
  };

  $(document).ready(function() {
    return google.maps.event.addDomListener(window, 'load', cs.page.init);
  });

}).call(this);
