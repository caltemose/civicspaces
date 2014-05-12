@cs ?= {}

@cs.page =

  init: ->
    cs.page.initOptionsForm()
    cs.page.initDescriptionForm()
    cs.page.initLocationForm()
    cs.page.initMap()
    cs.page.initImageUpload()
    $('.cloudinary_image').cloudinary()

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

  initImageUpload: ->
    cs.sharedMethods.cloudinaryConfig()
    
    field = $ '.cloudinary-fileupload'
    if !field
      console.log 'cloudinary upload field missing'
      return
    
    field.bind 'fileuploadstart', @handleImageUploadStart
    field.bind 'fileuploadfail', @handleImageUploadFail
    field.bind 'fileuploadprogress', @handleImageUploadProgress
    field.bind 'cloudinarydone', @handleImageUploadDone
    
    # listen for clicks on the list of photos bubbling up
    # from the individual photo delete <button>s which may
    # be added to the dom after this page inits
    $('.edit-photos').on 'click', 'button', cs.page.deleteImage


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

  getSpaceId: ->
    $('[name="_id"]', '.form-location').val()

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

  handleImageUploadStart: (e) ->
    console.log 'cloudinary upload started'

  handleImageUploadFail: (e, data) ->
    console.log 'file upload failed: ', data
  
  handleImageUploadProgress: (e, data) ->
    console.log 'progress: ' + Math.round((data.loaded * 100.0) / data.total) + '%'
  
  handleImageUploadDone: (e, data) ->
    console.log 'handleImageUploadDone'
    # @TODO display new image AFTER it's been added to db
    options =
      format: data.result.format
      version: data.result.version
      crop: 'fill'
      width: 150
      height: 150
    $('.edit-photos').append cs.page.makeImageLi data.result.public_id, options

    postData = 
      cloudinary_id: data.result.public_id
      space_id: cs.page.getSpaceId()
    $.post '/api/space/add-image', postData, cs.page.handleImageAdded, "json"
    return true;

  handleImageAdded: (results) ->
    if results.err
      console.log results.err
      return


  handleImageDeleted: (results) ->
    console.log results
    if results.err
      console.log results.err
      return

    if results.success
      $('[data-src="' + results.image_id + '"]', '.edit-photos').parent().remove()

    unless results.result.result is 'ok'
      console.log 'image deleted from DB but NOT deleted from cloudinary'

  deleteImage: (e) ->
    postData =
      image_id: $(this).data('image-id')
      space_id: cs.page.getSpaceId()
    $.post '/api/space/delete-image', postData, cs.page.handleImageDeleted, "json"


  makeImageLi: (id, options) ->
    html  = '<li>'
    html += '<img src="' + $.cloudinary.url(id, options) + '" alt="photo thumbnail" >'
    html += '<button class="btn btn-danger btn-xs delete-photo" data-image-id="' + id + '">Delete</button>'
    html += '</li>'
    # console.log html
    html
    

  
$(document).ready ->
  google.maps.event.addDomListener window, 'load', cs.page.init
  
