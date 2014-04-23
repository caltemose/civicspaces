@cs ?= {}

@cs.page =
  init: ->
    console.log 'cs.page.init'
    @cs.map.init '#googlemap', 33.7811643, -84.38362970000003
    @cs.map.addMarker 33.7811643, -84.38362970000003

google.maps.event.addDomListener window, 'load', cs.page.init
