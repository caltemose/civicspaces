@cs ?= {}

@cs.page =

  init: ->
    marker = null
    lat = 33.7811643
    lng = -84.38362970000003

    if cs.page_space
      marker = 
        label: cs.page_space.address
        infoHtml: cs.page_space.address
      if cs.page_space.lat and cs.page_space.lng
        lat = cs.page_space.lat
        lng = cs.page_space.lng
    
    cs.map.init '#googlemap', lat, lng, marker

google.maps.event.addDomListener window, 'load', cs.page.init
