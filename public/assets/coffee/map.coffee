class Map

  @defaultLat = 33.7811643
  @defaultLng = -84.38362970000003

  constructor: (container, lat, lng, marker, zoom) ->
    @container = $ container
    @markers = []
    options =
      center: @makeLatLng lat, lng
      zoom: zoom
    @googlemap = new google.maps.Map @container[0], options
    if marker
      @addMarker lat, lng, marker.label, marker.infoHtml

  defaults: ->
    @defaultLat = 33.7811643
    @defaultLng = -84.38362970000003
    @markers = []

  initInfoWindow: ->
    unless @infoWindow
      @infoWindow = new google.maps.InfoWindow {content:'default'}

  addMarker: (lat, lng, label = 'unlabeled marker', infoHtml) ->
    @initInfoWindow()
    options = @makeMarkerOptions lat, lng, label
    marker = new google.maps.Marker options
    @markers.push marker
    iw = @infoWindow
    map = @googlemap
    google.maps.event.addListener marker, 'click', ->
      iw.setContent infoHtml
      iw.open map, marker

  addMarkerBySpace: (space) ->
    info =  """
            <p><a href="/space/view/#{space._id}">#{space.address}</a><br>
            #{space.city}, #{space.zip}</p>
            """
    @addMarker space.geo.lat, space.geo.lng, space.address, info

  removeMarker: (marker) ->
    marker.setMap null
    marker = null

  makeMarkerOptions: (lat, lng, label) ->
    options = 
      position: @makeLatLng lat, lng
      map: @googlemap
      title: label

  makeLatLng: (lat, lng) ->
    new google.maps.LatLng(lat, lng)

  getBounds: ->
    @googlemap.getBounds()


