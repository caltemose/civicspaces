@cs ?= {}

@cs.page = 

  selections: {}
  
  init: ->
    # '#googlemap', '#mapresults', cs.map.defaultLat, cs.map.defaultLng
    cs.page.selections.results = $ '#mapresults'
    
    # cs.map.init map, lat, lng 
    # cs.map.setBoundsUpdate cs.page.handleBoundsUpdate

  handleBoundsUpdate: ->
    bounds = cs.map.getBounds()
    geo =
      ne_lat: bounds.getNorthEast().lat()
      ne_lng: bounds.getNorthEast().lng()
      sw_lat: bounds.getSouthWest().lat()
      sw_lng: bounds.getSouthWest().lng()
    
    $.getJSON '/api/properties/bounded', geo, cs.page.displaySpaces

  displaySpaces: (data) ->
    if data.err
      console.log err
      return
    
    if data.spaces and data.spaces.length > 0
      cs.page.selections.results.html ''
      cs.page.displaySpace space for space in data.spaces
    else
      console.log 'no Spaces found in given boundaries'

  displaySpace: (space) ->
    cs.map.addSpaceMarker space
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
    cs.page.selections.results ?= $ '#mapresults'
    cs.page.selections.results.append html



$(document).ready ->
  cs.page.init()

