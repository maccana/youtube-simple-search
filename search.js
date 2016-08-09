/* 
 * tplawesome is a light and easy to use template engine.
 * The only thing it does is replacing {{keys}} from an HTML template with formatted JSON data.
 * https://github.com/FriesFlorian/tplawesome
 */
function tplawesome(e, t) {
  res = e;
  for (var n = 0; n < t.length; n++) {
    res = res.replace(/\{\{(.*?)\}\}/g, function(e, r) {
      return t[n][r]
    })
  }
  return res
}

// Function called on form submit.
$(function() {
  $("form").on("submit", function(e) {
    e.preventDefault();
    search($("#search").val().replace(/%20/g, "+"));
  });
});

// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms
// Helper function to display JavaScript value on HTML page.
function showResponse(response) {
    // var responseString = JSON.stringify(response, '', 2);
    // document.getElementById('response').innerHTML += responseString;

    // Clear previous results
    $("#results").html("");

    // Loop over new results and append to results element.
    $.each(response.items, function(index, item) {
  	// Get the template and use tplawesome to bind key/values. 
    $.get("videoItem.html", function(data) {

      // Debugging template load.
      // console.log("temp", data);

      $("#results").append(tplawesome(data, [{
        "title": item.snippet.title,
        "videoid": item.id.videoId
      }]));
    });
  });
}
  
// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
  }
  
// Called automatically when YouTube API interface is loaded.
function onYouTubeApiLoad() {
	// Keeping personal YouTube client key in external file.
	$.get("clientKey.js");
  // Enter your personal YouTube client key here and delete line above.
  // gapi.client.setApiKey('AIzaSyDuuQukG5cmzhvbNroEprYtofMQhWl7Ud8');
  // See https://goo.gl/PdPA1 to get a key for your own applications.
  //search();
}

function search(query) {

	// Keeping personal YouTube client key in external file.
	$.get("clientKey.js");

	// Insert your own client key here and delete line above.
  // gapi.client.setApiKey('xxxxxxxxxxxxxxxxxxxxxxxxxx');

  console.log("User typed: ", query);
  // Use the JavaScript client library to create a search.list() API call.
  var request = gapi.client.youtube.search.list({
    part: 'snippet',
    q: query,
    order: 'viewCount',
    publishedAfter: '2016-01-01T00:00:00Z'
  });
  // Send the request to the API server,
  // and invoke onSearchRepsonse() with the response.
  request.execute(onSearchResponse);
  autoResizeVideo();
}

// Auto-resize video element when window size changes.
$(window).on("resize", autoResizeVideo);

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
  showResponse(response);
}

// Make video iframe element responsive. 
function autoResizeVideo() {
  // var r = $("#results").width() * 9 / 16;
  // console.log("Resizing...", r);
  $(".video").css("height", $("#results").width() * 9 / 16);
}