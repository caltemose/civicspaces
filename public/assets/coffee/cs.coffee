@cs ?= {}

@cs.sharedMethods =

  initForm: (formId) ->
    new Form $ formId

  initMap: (mapId, lat = Map.defaultLat, lng = Map.defaultLng, marker = null, zoom = null) ->
    cs.map = new Map $(mapId), lat, lng, marker, zoom

  drawMap: (lat, lng, marker) ->
    unless !cs.map
      cs.map.redraw lat, lng, marker

  setBoundsUpdate: (callback) ->
    google.maps.event.addListener cs.map.googlemap, 'bounds_changed', callback

  cloudinaryConfig: ->
    unless cs.cloudinary.config
      console.log 'cs.cloudinary.config is missing'
      return
    
    $.cloudinary.config cs.cloudinary.config


@cs.events = 
  
  VALIDATION_ERROR: 'validation_error'
  FORM_SUCCESS: 'form_success'
  FORM_FAILURE: 'form_failure'
  SAVE_FIELD: 'save_field'
