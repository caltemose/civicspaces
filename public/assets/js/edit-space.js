var cs = cs || {};
cs.space = cs.space || {};
cs.space.initMap = function(ll) {
  var mapOptions = { center: ll, zoom: 15 };
  cs.space.googlemap = new google.maps.Map(document.getElementById('googlemap'), mapOptions);
  cs.space.makeMarker(ll);
}
cs.space.drawMap = function(ll) {
  if (!cs.space.googlemap) cs.space.initMap(ll);
  else {
    cs.space.googlemap.setCenter(ll);
    cs.space.googlemap.setZoom(15);
    cs.space.makeMarker(ll);
  }
}
cs.space.getLatLng = function(lat, lng) {
  return new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
}
cs.space.makeMarker = function(ll) {
  if (cs.space.marker) {
    cs.space.marker.setMap(null);
    cs.space.marker = null;
  }
  cs.space.marker = new google.maps.Marker({
    position: ll,
    map: cs.space.googlemap,
    title: 'Your space'
  });
}
cs.space.initSelections = function(){
  if (cs.space.selections) return false;
  cs.space.selections = {};
  cs.space.selections.id = $('[name="_id"]');
  cs.space.selections.lat = $('[name="lat"]');
  cs.space.selections.lng = $('[name="lng"]');
  cs.space.selections.address = $('[name="address"]');
  cs.space.selections.city = $('[name="city"]');
  cs.space.selections.zip = $('[name="zip"]');
}
cs.space.lookupGeo = function() {
  cs.space.initSelections();

  if (cs.space.selections.lat.val().length && cs.space.selections.lng.val().length) {
    console.log('geo coords exist - draw map');
    cs.space.drawMap( cs.space.getLatLng(cs.space.selections.lat.val(), cs.space.selections.lng.val()) );

  } else if (cs.space.selections.address.length <1 || cs.space.selections.zip.length<1) {
    console.log('no address or zip provided.');

  } else {
    console.log('geo coords do not exist');
    var searchAddress = cs.space.selections.address.val() + ',' + cs.space.selections.zip.val();
    var geocoder = new google.maps.Geocoder(),
        options = {address: searchAddress};
    geocoder.geocode(options, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var loc = results[0].geometry.location;
        var postData = {id: cs.space.selections.id.val(), lat: loc.k, lng: loc.A};
        $.post('/api/add-geo', postData, function(results) {
          if (results.err) console.log(results.err);
          if (results.success) {
            console.log('success adding lat/lng to space in database');
            cs.space.selections.lat.val(loc.k);
            cs.space.selections.lng.val(loc.A);
            cs.space.drawMap(cs.space.getLatLng(loc.k, loc.A));
          }
        }, "json");

      } else {
        console.log('There was a problem with the Google Maps Geocode Request:', status);
      }
    });
  }
}
cs.space.updateAddress = function(){
  var options = {address: cs.space.selections.address.val() + ',' + cs.space.selections.zip.val()};
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode(options, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var loc = results[0].geometry.location;
      var postData = {
        id: cs.space.selections.id.val(), 
        lat: loc.k, lng: loc.A,
        address: cs.space.selections.address.val(),
        city: cs.space.selections.city.val(),
        zip: cs.space.selections.zip.val()
      };
      $.post('/api/update-geo-address', postData, function(results) {
        if (results.err) console.log(results.err);
        if (results.success) {
          console.log('success adding lat/lng to space in database');
          cs.space.selections.lat.val(loc.k);
          cs.space.selections.lng.val(loc.A);
          cs.space.drawMap(cs.space.getLatLng(loc.k, loc.A));
        }
      }, "json");

    } else {
      console.log('There was a problem with the Google Maps Geocode Request:', status);
    }
  })
}
cs.space.activateUploader = function() {
  // var form = $('#uploader');
  // form.submit(function(e) {
  //   e.preventDefault();
  // });
  // $('[type="file"]', form).change(function(){
  //   //form.submit()
  // });
}
google.maps.event.addDomListener(window, 'load', cs.space.lookupGeo);

$(document).ready(function(){
  $('#updatemap').click(function(e){
    e.preventDefault();
    cs.space.updateAddress();
  });
  cs.space.activateUploader();
});
