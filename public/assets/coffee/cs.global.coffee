@cs ?= {}

@cs.sharedMethods =

  initForm: (formId) ->
    new Form $ formId

  initMap: (mapId, lat = Map.defaultLat, lng = Map.defaultLng, marker = null, zoom = 12) ->
    cs.map = new Map $(mapId), lat, lng, marker, zoom

  setBoundsUpdate: (callback) ->
    google.maps.event.addListener cs.map.googlemap, 'bounds_changed', callback


@cs.events = 
  
  VALIDATION_ERROR: 'validation_error'
  FORM_SUCCESS: 'form_success'
  FORM_FAILURE: 'form_failure'