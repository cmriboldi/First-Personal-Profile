var defaultLocation = "Provo, UT";

window.onload = function() {

  // Set the size of the rendered Emojis
  // This can be set to 16x16, 36x36, or 72x72
  twemoji.size = '16x16';

  // Parse the document body and
  // insert <img> tags in place of Unicode Emojis
  twemoji.parse(document.body);

}


$(document).ready(function() {
  var city = queryString['city'];
  var state = queryString['state'];
  var location = setLocation(city, state);
  getSimpleWeather(location);
});

function getWeather(){
  var city = $("input[name=city]").val();
  var state = $("select[name=state] option:selected").val();
  var location = setLocation(city, state);
  getSimpleWeather(location);
}

function getSimpleWeather(location) {
  $.simpleWeather({
    location: location,
    unit: 'f',
    success: function(weather) {
      printWeather(weather);
    },
    error: function(error) {
      $("#weather").html('<p>'+error.message+'</p>');
    }
  });
}

function printWeather(weather) {
  html = '<h2 class="temp-display">'+weather.temp+'&deg;'+weather.units.temp+'</h2>';
  html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
  html += '<li class="currently">'+weather.currently+'</li></ul>';
  
  for(var i=0;i<weather.forecast.length;i++) {
    html += '<p>'+weather.forecast[i].day+': '+weather.forecast[i].high+'</p>';
  }

  $("#weather").html(html);
}

function setLocation(city, state) {
  return (city && state) ? city + ', ' + state : defaultLocation;
}


var queryString = (function(query) {
    if (query == "") {
      return {};
    }
    var queryParam = {};
    for (var i = 0; i < query.length; ++i) {
        var param = query[i].split('=', 2);
        if (param.length == 1) {
          queryParam[param[0]] = "";
        } else {
          queryParam[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
        }
    }
    return queryParam;
})(window.location.search.substr(1).split('&'));