// Generated by CoffeeScript 1.6.3
(function() {
  if (this.cs == null) {
    this.cs = {};
  }

  this.cs.page = {
    init: function() {
      cs.page.getSelections();
      cs.page.initLocationFields();
      return cs.page.initMap();
    },
    getSelections: function() {
      if (!cs.page.selections) {
        return cs.page.selections = {
          id: $('[name="_id"]'),
          lat: $('[name="lat"]'),
          lng: $('[name="lng"]'),
          address: $('[name="address"]'),
          city: $('[name="city"]'),
          zip: $('[name="zip"]')
        };
      }
    },
    initLocationFields: function() {
      cs.page.selections.address.blur(function(e) {
        return cs.page.saveLocation(this);
      });
      return cs.page.selections.zip.blur(function(e) {
        return cs.page.saveLocation(this);
      });
    },
    initMap: function() {
      var address, marker;
      if (cs.page.selections.lat.val().length && cs.page.selections.lng.val().length) {
        address = cs.page.selections.address.val();
        marker = {
          label: address,
          infoHtml: address
        };
        return cs.map.init('#googlemap', cs.page.selections.lat.val(), cs.page.selections.lng.val(), marker);
      } else {
        cs.map.init('#googlemap', cs.map.defaultLat, cs.map.defaultLng);
        if (!(cs.page.selections.address.length < 1 || cs.page.selections.zip.length < 1)) {
          return cs.map.getGeo(cs.page.getCombinedAddress, cs.page.updateGeo);
        }
      }
    },
    getCombinedAddress: function() {
      return cs.page.selections.address.val() + ',' + cs.page.selections.zip.val();
    },
    saveLocation: function(field) {
      var $field;
      $field = $(field);
      if ($field.val() !== $field.attr('data-orig')) {
        if ($field.attr('name') === 'city') {
          return console.log('save city field value - no geo lookup');
        } else {
          return cs.map.getGeo(cs.page.getCombinedAddress(), cs.page.updateGeoAndLocation);
        }
      }
    },
    updateGeoAndLocation: function(err, geo) {
      var city, postData;
      if (err) {
        console.log(err);
        return;
      }
      if (geo.partial_match) {
        console.log('the google geocode request return sketchy results');
      }
      if (geo.locality) {
        city = geo.locality;
      } else {
        city = cs.page.selections.city.val();
      }
      postData = {
        id: cs.page.selections.id.val(),
        lat: geo.lat,
        lng: geo.lng,
        address: cs.page.selections.address.val(),
        city: city,
        zip: cs.page.selections.zip.val()
      };
      return $.post('/api/update/location', postData, (function(results) {
        var marker;
        if (results.err) {
          console.log(results.err);
        } else {
          console.log('success: /api/update/location');
          cs.page.selections.lat.val(geo.lat);
          cs.page.selections.lng.val(geo.lng);
          cs.page.selections.city.val(city).attr('data-orig', city);
          marker = {
            label: cs.page.selections.address.val()
          };
          marker.infoHtml = marker.label;
          cs.map.drawMap(geo.lat, geo.lng, marker);
        }
      }), "json");
    },
    updateGeo: function(err, geo) {
      var postData;
      if (err) {
        console.log(err);
        return;
      }
      if (geo.partial_match) {
        return console.log('the google geocode request return sketchy results');
      } else {
        postData = {
          id: cs.page.selections.id.val(),
          lat: geo.lat,
          lng: geo.lng
        };
        return $.post('/api/add-geo', postData, (function(results) {
          var marker;
          if (results.err) {
            console.log(results.err);
          }
          if (results.success) {
            console.log('success adding lat/lng to space in database');
            cs.page.selections.lat.val(geo.lat);
            cs.page.selections.lng.val(geo.lng);
            marker = {
              label: cs.page.selections.address.val()
            };
            marker.infoHtml = marker.label;
            cs.map.drawMap(geo.lat, geo.lng, marker);
          }
        }), "json");
      }
    },
    updateLocation: function() {
      var address, zip;
      address = cs.page.selections.address.val();
      zip = cs.page.selections.zip.val();
      if (!(!address || !zip)) {
        return cs.map.getGeo(address + ',' + zip, cs.page.updateGeo);
      }
    }
  };

  $(document).ready(function() {
    return google.maps.event.addDomListener(window, 'load', cs.page.init);
  });

}).call(this);