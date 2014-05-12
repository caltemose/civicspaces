@cs ?= {}

@cs.page = 

  selections: {}

  init: ->
    cs.page.selections.results = $('#mapresults');
    cs.sharedMethods.initMap('#googlemap');
    cs.sharedMethods.setBoundsUpdate(cs.page.handleBoundsUpdate);
    cs.sharedMethods.cloudinaryConfig()
  
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
      return console.log err
    
    if data.spaces and data.spaces.length > 0
      cs.page.selections.results.html ''
      cs.page.displaySpace space for space in data.spaces
      $('.cloudinary-image').cloudinary()

    else 
      console.log 'no Spaces found in given boundaries'
  
  displaySpace: (space) ->
    cs.map.addMarkerBySpace space
    html =  '<div class="col-sm-6"><div class="well result clearfix">'
    if space.images.length
      html += '<a href="/space/view' + space._id + '">'
      html += '<img class="cloudinary-image" data-src="'
      html += space.images[0].cloudinary_id + '" data-width="100" data-height="100" data-crop="thumb" /></a>'
    html += '<h4><a href="/space/view/' + space._id + '">' + space.address + '</a></h4>'
    html += '</div></div>'
    cs.page.selections.results.append html
  
$(document).ready ->
  google.maps.event.addDomListener(window, 'load', cs.page.init);
