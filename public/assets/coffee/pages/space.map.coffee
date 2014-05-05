@cs ?= {}

@cs.page = 

  selections: {}

  init: ->
    cs.page.selections.results = $('#mapresults');
    cs.sharedMethods.initMap('#googlemap');
    cs.sharedMethods.setBoundsUpdate(cs.page.handleBoundsUpdate);
  
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
    else 
      console.log 'no Spaces found in given boundaries'
  
  displaySpace: (space) ->
    cs.map.addMarkerBySpace space
    # img.pull-right(src='' alt='') // insert before H4 below
    html =  """
            <div class="col-sm-6"><div class="well result clearfix">
            <h4><a href="/space/view/#{space._id}">#{space.address}</a></h4>
            <ul>
            """
    if space.type
      html += '<li>' + space.type + '</li>'
    if space.leaseLength
      html += '<li>' + space.leaseLength + '</li>'
    html += '</ul></div></div>'
    cs.page.selections.results.append html
  
$(document).ready ->
  google.maps.event.addDomListener(window, 'load', cs.page.init);
