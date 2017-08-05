/*
An app to check for users currently streaming on Twitch.tv
Add/remove display names of users to the global users array to customize the queries

info about the Twitch API: https://www.twitch.tv/p/about/

From Free Code Camp's intermediate front-end projects:
https://www.freecodecamp.org/challenges/use-the-twitchtv-json-api

by Kirk Richardson
https://github.com/kirkdrichardson/twitchTV_app
*/

// list of users who regularly stream
users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];


$(function() {


  function urlQuery(type, user) {
    return "https://wind-bow.glitch.me/twitch-api/" + type + "/" + user;
  }

// assign default image if user doesn't have a logo
function logoCheck(logo) {
  if (logo)
    return logo;
  else
    return logo = "http://www.quickanddirtytips.com/sites/default/files/images/7733/anonymous.jpg";
}

// adds streaming user row and data elements
function addStreamingUsers(data) {
  var userInfo = data.stream.channel;
  $('#container').append(
    "<a target='_blank' href='" + userInfo.url + "'>" +
    "<div class=' results online row'>" +
    "<div class='col-sm-2 col-xs-2'><img src='" + logoCheck(userInfo.logo) + "' class='logo' alt='logo'></div>" +
    "<div class='user col-sm-4 col-xs-4'>" + userInfo.display_name + "</div>" +
    "<div class='description col-sm-6 col-xs-6 text-center'>" + userInfo.status + "</div>" +
    "</div></a>"
  );
}

// if user !streaming, GET data from channel obj and create offline user row
function addOfflineUsers(value) {
  $.getJSON(urlQuery("channels", value), function(data) {
    $("#container").append(
      "<a target='_blank' href='" + data.url + "'>" +
      "<div class='results offline row'>" +
      "<div class='col-sm-2 col-xs-2'><img src='" + logoCheck(data.logo) + "' class='logo' alt='logo'></div>" +
      "<div class='user col-sm-4 col-xs-4'>" + data.display_name + "</div>" +
      "<div class='statusOffline col-sm-6 col-xs-6 text-center'>Offline</div>" +
      "</div></a>"
    );
  });
}

// for user in users, check if streaming. If true, pass streaming data to addStreamingUsers Fx
// else, pass the offline user's display_name to the addOfflineUsers Fx
function isStreaming() {
  $.each(users, function(index, value) {
    $.getJSON(urlQuery("streams", value), function(data) {
      if (data.stream)
        addStreamingUsers(data);
      else
        addOfflineUsers(value);
    });
  })
}

// make All, Online, Off buttons
function makeButtons() {
  var type = ['All', 'Online', 'Offline'];
  var divStr = "<div class='btn-group btn-group-justified'>";
  for (var i = 0; i < 3; i++) {
    divStr += "<div class='btn-group'><button type='button' class='btn btn-warning tabs' id=" +
              type[i] +">" + type[i] + "</button></div>";
  }
  divStr += "</div>";
  $("body #container").append(divStr);
}


// BUTTON EVENTS
$("#container").on("click", "#All", function(){
  $(".results").show();
});

$("#container").on("click", "#Online", function(){
  $(".online").show();
  $(".offline").hide();
});

$("#container").on("click", "#Offline", function(){
  $(".offline").show();
  $(".online").hide();
});


// add title, buttons row, and begin checking for streaming users
function generateDocument() {
  $("#container").prepend("<h1>Twitch.tv</h1>");
  makeButtons();
  isStreaming(users);
}


generateDocument();
}); // doc ready close
