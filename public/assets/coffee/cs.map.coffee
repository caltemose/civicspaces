@cs ?= {}

@cs.map =

  init: (container, lat, lng, zoom = 12) ->
    cs.map.container = $ container
    options = 
      center: cs.map.makeLatLng lat, lng
      zoom: zoom
    cs.map.googlemap = new google.maps.Map cs.map.container[0], options

  makeLatLng: (lat, lng) ->
    new google.maps.LatLng(lat, lng)