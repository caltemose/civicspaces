@cs ?= {}

@cs.map =

  markers: []

  init: (container, lat, lng, zoom = 12) ->
    console.log 'cs.map.init'
    cs.map.container = $ container
    options = 
      center: cs.map.makeLatLng lat, lng
      zoom: zoom
    cs.map.googlemap = new google.maps.Map cs.map.container[0], options

  initMultiple: () ->
    google.maps.event.addListener cs.map.googlemap, 'bounds_changed', cs.map.handleBoundsUpdate

  makeLatLng: (lat, lng) ->
    new google.maps.LatLng(lat, lng)

  makeMarkerOptions: (lat, lng, label) ->
    options = 
      position: cs.map.makeLatLng lat, lng
      map: cs.map.googlemap
      title: label

  addMarker: (lat, lng, label = 'unlabeled marker') ->
    options = cs.map.makeMarkerOptions lat, lng, label
    cs.map.markers.push new google.maps.Marker options

  getBounds: ->
    cs.map.googlemap.getBounds()

  handleBoundsUpdate: ->
    bounds = cs.map.getBounds()
    cs.map.requestSpaces bounds.getNorthEast(), bounds.getSouthWest()

  requestSpaces: (ne, sw) ->
    console.log 'requestSpaces'
    bounds =
      ne_lat: ne.lat()
      ne_lng: ne.lng()
      sw_lat: sw.lat()
      sw_lng: sw.lng()
    
    cs.map.request = $.getJSON '/api/properties/bounded', bounds, cs.map.displaySpaces

  displaySpace: (space) ->
    console.log space.address
    # need to pass: address, lat/lng, photourl, space type, length of lease

  displaySpaces: (data) ->
    console.log 'displaySpaces'
    if data.err
      console.log err
      return
    
    if data.spaces and data.spaces.length > 0
      cs.map.displaySpace space for space in data.spaces
    else
      console.log 'no Spaces found in given boundaries'
    
