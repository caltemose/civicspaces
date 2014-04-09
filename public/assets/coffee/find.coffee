@cs ?= {}

@cs.find =

  initialize: (map, lat, lng) ->
    cs.find.lat = lat
    cs.find.lng = lng
    cs.find.mapId = map

    $('input[type="submit"]', '#mapsearch').click (e) ->
      location = $ 'input[name="location"]'
      geocoder = new google.maps.Geocoder()
      options = {address: location.val()}
      geocoder.geocode options, (results, status) ->
        if status is google.maps.GeocoderStatus.OK
          console.log results[0].geometry.location
          cs.find.googlemap.setCenter results[0].geometry.location
        else
          console.log 'There was a problem with the Google Maps Geocode Request:'
          console.log status
      
      e.preventDefault()
      false

  loadMaps: =>
    mapOptions = 
      center: new google.maps.LatLng(cs.find.lat, cs.find.lng)
      zoom: 12

    cs.find.googlemap = new google.maps.Map document.getElementById(cs.find.mapId), mapOptions

