var cs = cs || {};
cs.space = cs.space || {};
cs.space.lookupGeo = function() {
  var lat = $('[name="lat"]'),
      lng = $('[name="lng"]'),
      address = $('[name="address"]'),
      zip = $('[name="zip"]');

  if (lat.length && lng.length) console.log('geo coords exist');
  else if (address.length <1 || zip.length<1) {
    console.log('no address or zip provided.');
  } else {
    console.log('geo coords DO NOT exist');
    var searchAddress = address.val() + ',' + zip.val();
    //console.log('searchAddress: ' + searchAddress);
    var geocoder = new google.maps.Geocoder(),
        options = {address: searchAddress};

    geocoder.geocode(options, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var loc = results[0].geometry.location;
        //console.log(loc);
        console.log('add these coords: ' + loc.A + ',' + loc.k);
        // @TODO add AJAX call to save geo coords for this space /space/geo/:id
      } else {
        console.log('There was a problem with the Google Maps Geocode Request:', status);
      }
    });
  }
}
google.maps.event.addDomListener(window, 'load', cs.space.lookupGeo);