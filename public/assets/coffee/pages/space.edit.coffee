@cs ?= {}

@cs.page =

  init: ->
    cs.page.initOptionsForm()
    cs.page.initDescriptionForm()
    cs.page.initLocationForm()
    cs.page.initMap()

  initOptionsForm: ->
    form = $ '.form-options'
    cs.sharedMethods.initForm form

  initDescriptionForm: ->
    form = $ '.form-description'
    cs.sharedMethods.initForm form

  initLocationForm: ->
    cs.page.getSelections()
    form = $ '.form-location'
    cs.sharedMethods.initForm form
    form.bind cs.events.FORM_FAILURE, cs.page.handleFormFailure
    form.bind cs.events.FORM_SUCCESS, cs.page.handleFormSuccess

  initMap: ->
    latEl = $ '[name="lat"]', '.form-location'
    lngEl = $ '[name="lng"]', '.form-location'
    addyEl = $ '[name="address"]', '.form-location'
      
    marker = 
      label: addyEl.val()
      infoHtml: addyEl.val()

    lat = latEl.val()
    lng = lngEl.val()

    cs.sharedMethods.initMap('#googlemap', lat, lng, marker);

  getSelections: ->
    unless cs.page.selections
      context = '.form-location'
      cs.page.selections = 
        id: $ '[name="_id"]', context
        lat: $ '[name="lat"]', context
        lng: $ '[name="lng"]', context
        address: $ '[name="address"]', context
        city: $ '[name="city"]', context
        zip: $ '[name="zip"]', context

  handleFormFailure: (event) ->
    console.log 'form failure', event.target

  handleFormSuccess: (event) ->
    # console.log 'form success', event.target
    cs.page.geocode()

  geocode: ->
    geocoder = cs.page.geocoder || new google.maps.Geocoder()
    callback = cs.page.handleGeocode
    address = cs.page.getCombinedAddress()
    geocoder.geocode {address:address}, (results, status) ->
      if status is google.maps.GeocoderStatus.OK
        loc = results[0].geometry.location
        data = 
          lat: loc.k
          lng: loc.A
          locality: cs.page.getLocalityFromComponents results[0].address_components
        if results[0].partial_match
          data.partial_match = true
        callback null, data
      else
        callback status, null

  handleGeocode: (err, results) ->
    if err
      return console.log err

    if results.partial_match
      console.log 'the geocoding returned sketchy results'

    else
      postData = 
        id: cs.page.selections.id.val()
        lat: results.lat
        lng: results.lng

      $.post '/api/add-geo', postData, cs.page.handleGeoUpdate, "json"

  handleGeoUpdate: (results) ->
    if results.err 
      return console.log results.err
    if results.success
      cs.page.selections.lat.val results.lat
      cs.page.selections.lng.val results.lng
      cs.sharedMethods.drawMap results.lat, results.lng, cs.page.selections.address.val()
    return

  getCombinedAddress: ->
    cs.page.selections.address.val() + ',' + cs.page.selections.zip.val()

  getLocalityFromComponents: (components) ->
    locality = cs.page.getLocality component for component in components when component.types[0] is 'locality'
    locality

  getLocality: (component) ->
    component.long_name

  
$(document).ready ->
  google.maps.event.addDomListener(window, 'load', cs.page.init);
