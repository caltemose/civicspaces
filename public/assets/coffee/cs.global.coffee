@cs ?= {}

@cs.sharedMethods =

  initForm: (formId) ->
    new Form $ formId

  initMap: (mapId, lat, lng, marker = null, zoom = 12) ->
    cs.map = new Map $(mapId), lat, lng, marker, zoom


@cs.events = 
  
  VALIDATION_ERROR: 'validation_error'
  FORM_SUCCESS: 'form_success'
  FORM_FAILURE: 'form_failure'