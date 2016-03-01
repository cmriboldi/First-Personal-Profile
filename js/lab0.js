$(document).ready(function() {
  
  $( "#cityfield" ).keyup(function() {
    var url = "https://students.cs.byu.edu/~clement/CS360/ajax/getcity.cgi?q="+$("#cityfield").val();
      $.getJSON(url,function(data) {
        var everything;
        everything = "<ul>";
        $.each(data, function(i,item) {
          everything += "<li> "+data[i].city;
        });
          
        everything += "</ul>";
        $("#txtHint").html(everything);
    })
    .fail(function(jqXHR, textStatus, errorThrown) { 
      console.log('getJSON request failed! ' + textStatus); 
      console.log("incoming "+jqXHR.responseText);
    });
    $("#txtHint").text("Keyup "+$("#cityfield").val());
  });
  
  $("#button").click(function(e){
    var city = $("#cityfield").val();
    $("#dispcity").text(city);
    var state = $("select[name=state] option:selected").val();
    e.preventDefault();
    
    getWeather(state, city);
    
    getPolitics(state, city);
    
  });
  
});

function getWeather(state, city){
  
  var myurl= "https://api.wunderground.com/api/2ede690f26f6358d/geolookup/conditions/q/";
  myurl += state;
  myurl += "/";
  myurl += city;
  myurl += ".json";
  $.ajax({
    url : myurl,
    dataType : "jsonp",
    success : function(parsed_json) {
      if(parsed_json['response']['error'] != null) {
        console.log("There was an error.");
        $("#weather").html(parsed_json['response']['error']['description']);
      } else {
        var location = parsed_json['location']['city'];
        var temp_string = parsed_json['current_observation']['temperature_string'];
        var current_weather = parsed_json['current_observation']['weather'];
        everything = "<ul>";
        everything += "<li><h4>Location: "+location;
        everything += "<li><h4>Temperature: "+temp_string;
        everything += "<li><h4>Weather: "+current_weather;
        everything += "</ul>";
        $("#weather").html(everything);
      }
    }
  });
  
}

function getPolitics(state, city){
  var key = "AIzaSyAksDK60VqXaVOIHyyUtuDwQq4jmVcpTqw";
  var myurl= "https://www.googleapis.com/civicinfo/v2/representatives?address=";
  myurl += city;
  myurl += "=";
  myurl += state;
  myurl += "&key="
  myurl += key;
  console.log(myurl);
  $.ajax({
    url : myurl,
    success : function(response) {
      console.log("response is:" , response);
      createPoliticalTree(response);
    }
  });
  
}

function createPoliticalTree(response) {
  var divisions = response['divisions'];
  var offices = response['offices'];
  var officials = response['officials'];
  var poliList = "<h1>Political Officers</h1><ul>";
  for (var key in divisions) {
    if (divisions.hasOwnProperty(key) && divisions[key].officeIndices) {
      poliList += "<h2>"+divisions[key].name+"</h2>";
      for(var i = 0; i < divisions[key].officeIndices.length; i++) {
        var oIndex = divisions[key].officeIndices[i];
          poliList += "<h3>"+offices[oIndex].name+"</h3>";
          for(var j = 0; j < offices[oIndex].officialIndices.length; j++) {
            var ofrIndex = offices[oIndex].officialIndices[j];
            console.log("officers[ofrIndex] index: ", officials[ofrIndex]);
            poliList += "<li><h4>"+officials[ofrIndex].name+"</h4></li>";
            poliList += officials[ofrIndex].photoUrl ? "<img class='photo' src="+officials[ofrIndex].photoUrl+">" : "";
            poliList += "<ul><li><h4>Party: "+officials[ofrIndex].party+"</h4></li>";
            poliList += "<li><h4>Contact Info:<ul>"
            poliList += officials[ofrIndex].phones ? "<li><h4>Phone: "+officials[ofrIndex].phones[0]+"</h4></li>" : "";
            poliList += officials[ofrIndex].urls ? "<li><h4>Website: <a class='web-ref' href='"+officials[ofrIndex].urls[0]+"'>"+officials[ofrIndex].urls[0]+"</a></h4></li>" : "";
            if(officials[ofrIndex].address) {
              poliList += "<li><h4>Mailing Address: </br>"+officials[ofrIndex].name+"</br>"
              poliList += toTitleCase(officials[ofrIndex].address[0].line1)+"</br>";
              poliList += officials[ofrIndex].address[0].line2 ? toTitleCase(officials[ofrIndex].address[0].line2)+"</br>" : "";
              poliList += toTitleCase(officials[ofrIndex].address[0].city)+", "+officials[ofrIndex].address[0].state+" "+officials[ofrIndex].address[0].zip+"</br>";
            }
            poliList += "</h4></li>";
            poliList += "</ul></h4></li>";
            if(officials[ofrIndex].channels) {
              poliList += "<li><h4>Channels:<ul>";
              
              for(var k = 0; k < officials[ofrIndex].channels.length; k++) {
                if(officials[ofrIndex].channels[k].type == "Facebook") {
                  poliList += "<li><a class='web-ref' href='https://www.facebook.com/"+officials[ofrIndex].channels[k].id+"'>facebook.com/"+officials[ofrIndex].channels[k].id+"</a></li>";
                } else if (officials[ofrIndex].channels[k].type == "Twitter") {
                  poliList += "<li><a class='web-ref' href='https://twitter.com/"+officials[ofrIndex].channels[k].id+"'>twitter.com/"+officials[ofrIndex].channels[k].id+"</a></li>";
                } else if (officials[ofrIndex].channels[k].type == "YouTube") {
                  poliList += "<li><a class='web-ref' href='https://www.youtube.com/user/"+officials[ofrIndex].channels[k].id+"'>youtube.com/"+officials[ofrIndex].channels[k].id+"</a></li>";
                } else if (officials[ofrIndex].channels[k].type == "GooglePlus") {
                  poliList += "<li><a class='web-ref' href='https://plus.google.com/"+officials[ofrIndex].channels[k].id+"'>google+.com/"+officials[ofrIndex].channels[k].id+"</a></li>";
                }
              }
              
              poliList += "</ul></h4></li>";
            }
            poliList += "</ul>";
            
          }
          
          console.log("offices[oIndex].officialIndices.length" , offices[oIndex].officialIndices.length);
        
      }
      console.log(key + " -> " , divisions[key]);
    }
  }
  poliList += "</ul>";
  $("#politics").html(poliList);
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
