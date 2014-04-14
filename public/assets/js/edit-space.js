$(document).ready(function(){
  var lat = $('input[name="lat"]'),
      lng = $('input[name="lng"]');

  if (lat.length && lng.length) console.log('geo coords exist');
  else console.log('geo coords DO NOT exist');

  
})