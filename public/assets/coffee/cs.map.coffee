@cs ?= {}

@cs.map =

  defaultLat: 33.7811643

  defaultLng: -84.38362970000003

  markers: []

  init: (container, lat, lng, marker = null, zoom = 12) ->
    @container = $ container
    options = 
      center: cs.map.makeLatLng lat, lng
      zoom: zoom
    @googlemap = new google.maps.Map @container[0], options
    if marker
      cs.map.addMarker lat, lng, marker.label, marker.infoHtml
  
  setBoundsUpdate: (callback) ->
    google.maps.event.addListener @googlemap, 'bounds_changed', callback

  drawMap: (lat, lng, marker = null) ->
    if cs.map.markers.length
      cs.map.removeMarker m for m in cs.map.markers
      cs.map.markers.length = 0
    cs.map.googlemap.setCenter cs.map.makeLatLng lat, lng
    cs.map.googlemap.setZoom 15
    if marker
      cs.map.addMarker lat, lng, marker.label, marker.infoHtml
      

  getLocalityFromComponents: (components) ->
    locality = cs.map.getLocality component for component in components when component.types[0] is 'locality'
    locality

  getLocality: (component) ->
    component.long_name

  getGeo: (address, callback) ->
    geocoder = cs.map.geocoder || new google.maps.Geocoder()
    geocoder.geocode {address:address}, (results, status) ->
      if status is google.maps.GeocoderStatus.OK
        loc = results[0].geometry.location;
        data = {
          lat: loc.k,
          lng: loc.A
          locality: cs.map.getLocalityFromComponents results[0].address_components
        }
        if results[0].partial_match
          data.partial_match = true
        callback null, data
      else
        callback status, null

  makeLatLng: (lat, lng) ->
    new google.maps.LatLng(lat, lng)

  makeMarkerOptions: (lat, lng, label) ->
    options = 
      position: @makeLatLng lat, lng
      map: @googlemap
      title: label

  initInfoWindow: ->
    if !cs.map.infoWindow
      cs.map.infoWindow = new google.maps.InfoWindow {content:'default'}

  addMarker: (lat, lng, label = 'unlabeled marker', infoHtml) ->
    cs.map.initInfoWindow()
    options = @makeMarkerOptions lat, lng, label
    marker = new google.maps.Marker options
    cs.map.markers.push marker
    google.maps.event.addListener marker, 'click', ->
      cs.map.infoWindow.setContent infoHtml
      cs.map.infoWindow.open cs.map.googlemap, marker

  addSpaceMarker: (space) ->
    cs.map.initInfoWindow()
    info = '<div class="mapInfoWindow">'
    info += '<p><a href="/space/view/' + space._id + '">'
    info += space.address + '</a><br>' + space.city + ', ' + space.zip + '</p>'
    options = cs.map.makeMarkerOptions space.geo.lat, space.geo.lng, space.address
    marker = new google.maps.Marker options
    cs.map.markers.push marker
    google.maps.event.addListener marker, 'click', ->
      cs.map.infoWindow.setContent info
      cs.map.infoWindow.open cs.map.googlemap, marker

  removeMarker: (marker) ->
    marker.setMap null
    marker = null

  getBounds: ->
    @googlemap.getBounds()
