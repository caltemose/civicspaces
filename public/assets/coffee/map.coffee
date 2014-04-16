@cs ?= {}

@cs.map =

  initialize: (map, lat, lng) ->
    cs.map.lat = lat
    cs.map.lng = lng
    cs.map.mapId = map

    $('input[type="submit"]', '#mapsearch').click (e) ->
      location = $ 'input[name="location"]'
      geocoder = new google.maps.Geocoder()
      options = {address: location.val()}
      geocoder.geocode options, (results, status) ->
        if status is google.maps.GeocoderStatus.OK
          console.log results[0].geometry.location
          cs.map.googlemap.setCenter results[0].geometry.location
        else
          console.log 'There was a problem with the Google Maps Geocode Request:'
          console.log status
      
      e.preventDefault()
      false

  loadMaps: =>
    mapOptions = 
      center: new google.maps.LatLng(cs.map.lat, cs.map.lng)
      zoom: 12

    cs.map.googlemap = new google.maps.Map document.getElementById(cs.map.mapId), mapOptions

