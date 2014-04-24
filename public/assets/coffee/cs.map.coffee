@cs ?= {}

@cs.map =

  markers: []

  init: (container, lat, lng, zoom = 12) ->
    console.log 'cs.map.init'
    @container = $ container
    options = 
      center: cs.map.makeLatLng lat, lng
      zoom: zoom
    @googlemap = new google.maps.Map @container[0], options

  initMultiple: (container) ->
    @resultsContainer = $ container
    google.maps.event.addListener @googlemap, 'bounds_changed', @handleBoundsUpdate

  makeLatLng: (lat, lng) ->
    new google.maps.LatLng(lat, lng)

  makeMarkerOptions: (lat, lng, label) ->
    options = 
      position: @makeLatLng lat, lng
      map: @googlemap
      title: label

  addMarker: (lat, lng, label = 'unlabeled marker', infoHtml) ->
    options = @makeMarkerOptions lat, lng, label
    marker = new google.maps.Marker options
    @markers.push marker
    google.maps.event.addListener marker, 'click', ->
      cs.map.infoWindow.setContent infoHtml
      cs.map.infoWindow.open cs.map.googlemap, marker

  getBounds: ->
    @googlemap.getBounds()

  handleBoundsUpdate: ->
    bounds = @getBounds()
    cs.map.requestSpaces bounds.getNorthEast(), bounds.getSouthWest()

  requestSpaces: (ne, sw) ->
    console.log 'requestSpaces'
    bounds =
      ne_lat: ne.lat()
      ne_lng: ne.lng()
      sw_lat: sw.lat()
      sw_lng: sw.lng()
    
    @request = $.getJSON '/api/properties/bounded', bounds, @displaySpaces

  displaySpace: (space) ->
    info = '<div class="mapInfoWindow">'
    info += '<p><a href="/space/view/' + space._id + '">'
    info += space.address + '</a><br>' + space.city + ', ' + space.zip + '</p>'
    @addMarker space.geo.lat, space.geo.lng, space.address, info
    @displaySpaceHtml space

  displaySpaces: (data) ->
    if data.err
      console.log err
      return
    
    if !cs.map.infoWindow
      options = 
        content: 'default'
      cs.map.infoWindow = new google.maps.InfoWindow options

    cs.map.resultsContainer.html('')

    if data.spaces and data.spaces.length > 0
      cs.map.displaySpace space for space in data.spaces
    else
      console.log 'no Spaces found in given boundaries'
    
  displaySpaceHtml: (space) ->
    html = '<div class="col-sm-6"><div class="well result clearfix">'
    # img.pull-right(src='' alt='')
    html += '<h4><a href="/space/view/' + space._id + '">'
    html += space.address + '</a></h4>'
    html += '<ul>'
    if space.type 
      html += '<li>' + space.type + '</li>'
    if space.leaseLength
      html += '<li>' + space.leaseLength + '</li>'
    html += '</ul></div></div>'
    @resultsContainer.append html
