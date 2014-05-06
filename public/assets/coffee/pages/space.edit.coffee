@cs ?= {}

@cs.page =

  init: ->
    cs.page.initOptionsForm()
    cs.page.initDescriptionForm()
    # cs.page.getSelections()
    # cs.page.initLocationFields()
    # cs.page.initOptionalForm()
    # cs.page.initMap()   

  initOptionsForm: ->
    form = $ '.form-options'
    cs.sharedMethods.initForm form

  initDescriptionForm: ->
    form = $ '.form-description'
    cs.sharedMethods.initForm form


   
  # getSelections: ->
  #   unless cs.page.selections
  #     cs.page.selections = 
  #       id: $ '[name="_id"]'
  #       lat: $ '[name="lat"]'
  #       lng: $ '[name="lng"]'
  #       address: $ '[name="address"]'
  #       city: $ '[name="city"]'
  #       zip: $ '[name="zip"]'

  # initLocationFields: ->
  #   cs.page.selections.address.blur (e) ->
  #     cs.page.saveLocation @
  #   cs.page.selections.zip.blur (e) ->
  #     cs.page.saveLocation @

  # initOptionalForm: ->
  #   form = $ '.form-options'
  #   labels = $ 'label', form
  #   # initField label for label in labels
    
  # initMap: ->
  #   # geo coords exist - draw map
  #   if cs.page.selections.lat.val().length && cs.page.selections.lng.val().length
  #     address = cs.page.selections.address.val()
  #     marker = 
  #       label: address
  #       infoHtml: address
  #     cs.map.init '#googlemap', cs.page.selections.lat.val(), cs.page.selections.lng.val(), marker
  #   else 
  #     cs.map.init '#googlemap', cs.map.defaultLat, cs.map.defaultLng
  #     unless cs.page.selections.address.length <1 || cs.page.selections.zip.length<1
  #       cs.map.getGeo cs.page.getCombinedAddress, cs.page.updateGeo

  # getCombinedAddress: ->
  #   cs.page.selections.address.val() + ',' + cs.page.selections.zip.val()

  # saveLocation: (field) ->
  #   $field = $ field
  #   unless $field.val() is $field.attr('data-orig')
  #     if $field.attr('name') is 'city'
  #       console.log 'save city field value - no geo lookup'
  #     else
  #       cs.map.getGeo cs.page.getCombinedAddress(), cs.page.updateGeoAndLocation
      # postData = 
      #   id: cs.page.selections.id.val()
      #   property: $field.attr('name')
      #   value: $field.val()
      # $.post '/api/location/update', postData, ((results) ->
      #   if results.err
      #     console.log results.err
      #   if results.success


      # ), "json"

  # updateGeoAndLocation: (err, geo) ->
  #   if err
  #     console.log err
  #     return

  #   if geo.partial_match
  #     console.log 'the google geocode request return sketchy results'
  
  #   if geo.locality
  #     city = geo.locality
  #   else
  #     city = cs.page.selections.city.val()

  #   postData = 
  #     id: cs.page.selections.id.val()
  #     lat: geo.lat
  #     lng: geo.lng
  #     address: cs.page.selections.address.val()
  #     city: city
  #     zip: cs.page.selections.zip.val()

  #   $.post '/api/update/location', postData, ((results) ->
  #     if results.err
  #       console.log results.err
  #     else
  #       console.log 'success: /api/update/location'
  #       cs.page.selections.lat.val geo.lat
  #       cs.page.selections.lng.val geo.lng
  #       cs.page.selections.city.val(city).attr 'data-orig', city
  #       marker = 
  #         label: cs.page.selections.address.val()
  #       marker.infoHtml = marker.label
  #       cs.map.drawMap geo.lat, geo.lng, marker
  #     return
  #   ), "json"

    
  # updateGeo: (err, geo) ->
  #   if err
  #     console.log err
  #     return

  #   if geo.partial_match
  #     console.log 'the google geocode request return sketchy results'
    
  #   else
  #     postData = 
  #       id: cs.page.selections.id.val()
  #       lat: geo.lat
  #       lng: geo.lng

  #     $.post '/api/add-geo', postData, ((results) ->
  #       if results.err 
  #         console.log results.err
  #       if results.success
  #         console.log 'success adding lat/lng to space in database'
  #         cs.page.selections.lat.val geo.lat
  #         cs.page.selections.lng.val geo.lng
  #         marker = 
  #           label: cs.page.selections.address.val()
  #         marker.infoHtml = marker.label
  #         cs.map.drawMap geo.lat, geo.lng, marker
  #       return
  #     ), "json"

  # updateLocation: ->
  #   address = cs.page.selections.address.val()
  #   zip = cs.page.selections.zip.val()
  #   unless !address || !zip
  #     cs.map.getGeo address + ',' + zip, cs.page.updateGeo

    # cs.map.getGeo '#googlemap', cs.page.selections.address.val() + ',' + cs.page.selections.zip.val(), cs.page.updateGeo
    # # var geocoder = new google.maps.Geocoder();
    # geocoder.geocode(options, function(results, status) {
    #   if (status === google.maps.GeocoderStatus.OK) {
    #     var loc = results[0].geometry.location;
    #     var postData = {
    #       id: cs.space.selections.id.val(), 
    #       lat: loc.k, lng: loc.A,
    #       address: cs.space.selections.address.val(),
    #       city: cs.space.selections.city.val(),
    #       zip: cs.space.selections.zip.val()
    #     };
    #     $.post('/api/update-geo-address', postData, function(results) {
    #       if (results.err) console.log(results.err);
    #       if (results.success) {
    #         console.log('success adding lat/lng to space in database');
    #         cs.space.selections.lat.val(loc.k);
    #         cs.space.selections.lng.val(loc.A);
    #         cs.space.drawMap(cs.space.getLatLng(loc.k, loc.A));
    #       }
    #     }, "json");

    #   } else {
    #     console.log('There was a problem with the Google Maps Geocode Request:', status);
    #   }


$(document).ready ->
  google.maps.event.addDomListener window, 'load', cs.page.init
