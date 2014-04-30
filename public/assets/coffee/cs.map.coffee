@cs ?= {}

@cs.map =

  defaultLat: 33.7811643

  defaultLng: -84.38362970000003

  markers: []

  init: (container, lat, lng, marker = null, zoom = 12) ->
    @container = $ container
    options = 
      center: cs.map.makeLatLng lat, lng
      zoom: zoom
    @googlemap = new google.maps.Map @container[0], options
    if marker
      cs.map.addMarker lat, lng, marker.label, marker.infoHtml
  
  initMultiple: (container) ->
    # @TODO store initMultiple callback function for handling bounds update
    @resultsContainer = $ container
    google.maps.event.addListener @googlemap, 'bounds_changed', @handleBoundsUpdate

  drawMap: (lat, lng, marker = null) ->
    # if !cs.map.googlemap 
    #   cs.map.init mapId, lat, lng
    # else
    if cs.map.markers.length
      cs.map.removeMarker m for m in cs.map.markers
      cs.map.markers.length = 0
    cs.map.googlemap.setCenter cs.map.makeLatLng lat, lng
    cs.map.googlemap.setZoom 15
    if marker
      cs.map.addMarker lat, lng, marker.label, marker.infoHtml
      

  getLocalityFromComponents: (components) ->
    locality = cs.map.getLocality component for component in components when component.types[0] is 'locality'
    locality

  getLocality: (component) ->
    component.long_name

  getGeo: (address, callback) ->
    geocoder = cs.map.geocoder || new google.maps.Geocoder()
    geocoder.geocode {address:address}, (results, status) ->
      if status is google.maps.GeocoderStatus.OK
        loc = results[0].geometry.location;
        data = {
          lat: loc.k,
          lng: loc.A
          locality: cs.map.getLocalityFromComponents results[0].address_components
        }
        if results[0].partial_match
          data.partial_match = true
        callback null, data
      else
        callback status, null

  makeLatLng: (lat, lng) ->
    new google.maps.LatLng(lat, lng)

  makeMarkerOptions: (lat, lng, label) ->
    options = 
      position: @makeLatLng lat, lng
      map: @googlemap
      title: label

  addMarker: (lat, lng, label = 'unlabeled marker', infoHtml) ->
    if !cs.map.infoWindow
      cs.map.infoWindow = new google.maps.InfoWindow {content:'default'}
    options = @makeMarkerOptions lat, lng, label
    marker = new google.maps.Marker options
    cs.map.markers.push marker
    google.maps.event.addListener marker, 'click', ->
      console.log 'click'
      cs.map.infoWindow.setContent infoHtml
      cs.map.infoWindow.open cs.map.googlemap, marker

  removeMarker: (marker) ->
    marker.setMap null
    marker = null

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
    # @TODO remove this, space HTML results should be handled externally
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
      # @TODO map update callback(data.spaces)
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
