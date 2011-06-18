(function (context, L, $, jQuery, keypath, document, window) {
  var GOOGLE_GEOCODE_URI = 'http://www.google.com/uds/GlocalSearch',
      THE_WERKS_LAT_LNG = new L.LatLng(50.82719221187368, -0.16513824462890625),
      map;
      
  // Console logging
  window.O = function(){
    if (window.console){
      window.console.log.apply(window.console, arguments);
    }
  };
       
  // http://groups.google.com/group/brightonnewmedia/browse_thread/thread/6356b002dac72c16/9083739868112b05?#9083739868112b05
  // NOTE: officially deprecated by Google and should be modified here
  function getLocation(address, callback) {
    var params = '?v=1.0&q=' + address + '&callback=?';
    $.getJSON(GOOGLE_GEOCODE_URI + params, function(json) {
      var location = keypath(json, 'responseData.results.0');
      
      if (location) {
        callback(location.lat, location.lng);
      }
      else {
        callback(false);
      }
    });
  }
  
  function createMap(){
    var map = new L.Map('map'),
      cloudemadeApiKey = 'f1d499e4ec7f4fe099a25b07306432c5',
      cloudmadeUrl = 'http://{s}.tile.cloudmade.com/' + cloudemadeApiKey + '/997/256/{z}/{x}/{y}.png',
      cloudmadeAttrib = 'Map data: <a href="http://www.openstreetmap.org">OpenStreetMap</a>',
      cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib});
      
      map.addLayer(cloudmade);
      return map;
  }
  
  function setupAddressLookup(map) {
    var addressForm  = $('#form-address'),
        addressField = $('#field-address'),
        report = $('#form-address-report');

    addressForm.submit(function (event) {
      var adr = addressField.val();
      
      report.text();
      
      if (adr){
        getLocation(adr, function(lat, lng){
          var latLng;
          
          if (lat !== false){
            latLng = new L.LatLng(parseFloat(lat), parseFloat(lng));
            map.setView(latLng, 14);
          }
          else {
            report.text("Sorry, we couldn't find that.");
          }
        });
      }
      
      else {
        report.text("Please enter a location.");
      }
      
      event.preventDefault();
    });
  }
  
  /////

  window.map = map = createMap();
  setupAddressLookup(map);
  map.setView(THE_WERKS_LAT_LNG, 14);
  

})(this, this.L, this.$, this.jQuery, this.keypath, this.document, this);