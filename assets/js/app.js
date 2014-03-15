/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }

  socket.on('connect', function socketConnected() {

    // Listen for Comet messages from Sails
    socket.on('message', function messageReceived(message) {

      ///////////////////////////////////////////////////////////
      // Replace the following with your own custom logic
      // to run when a new message arrives from the Sails.js
      // server.
      ///////////////////////////////////////////////////////////
      log('New comet message received :: ', message);
      //////////////////////////////////////////////////////

    });


    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to 
    // the Sails.js server.
    ///////////////////////////////////////////////////////////
    log(
        'Socket is now connected and globally accessible as `socket`.\n' + 
        'e.g. to send a GET request to Sails, try \n' + 
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
    );
    ///////////////////////////////////////////////////////////


  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);

$(document).ready(function() {
  
  getAll("recipes");
  


  $(".menuBtn").on("click", function() {
    var model = $(this).attr("data-model");

    $(".menuBtn").removeClass("active");
    $(this).addClass("active");
    $(".sub-header").html(model.charAt(0).toUpperCase() + model.slice(1));
    $(".searchBox").val("");
    getAll(model)

  });


  $(".searchBox").keyup(function(e) {
    var query = $(this).val();
    if(e.keyCode === 13) {
      e.preventDefault();
    }

    if(query == '') {
      getAll($('.active').attr('data-model'));
    } else {
      searchByName(query);
    }
  });

  //functions
  function searchByName(query) {
    var model = $(".active").attr("data-model");
    socket.get("/json/"+model+"/search?"+query, function (response) { 
      displayResults(model, response);
    });
  }

  function getAll(model) {
    socket.get("/json/"+model, function (response) { 
      displayResults(model, response); 
    });
  }

  function displayResults(model, response) {
    if(model == "recipes") var headerTemplate = "<tr><th>Name</th><th>Ingredients</th><th>Time</th><th>Yield</th><th>Area/Tool</th></tr>";
    if(model == "ingredients") var headerTemplate = "<tr><th>Name</th><th>used in</th>";
    $(".tableBody").html("");
    $(".tableHead").html(headerTemplate);
    $(response).each(function() {  
      var area = typeof(this.craft_area)==='object' ? "none" : this.craft_area;
      var tool = typeof(this.craft_tool)==='object' ? "none" : this.craft_tool; 
      if(model == "recipes") var bodyTemplate = "<tr><td>"+this.name+"</td><td>"+getIngredientsForRecipes(this.ingredients)+"</td><td>"+this.craft_time+"</td><td>"+this.count+"</td><td>"+area+"/"+tool+"</td></tr>";
      if(model == "ingredients") var bodyTemplate = "<tr><td>"+this.name+"</td><td>"+getUsedInForIngredients(this.usedIn)+"</td></tr>";
      $(".tableBody").append(bodyTemplate);
    });
  }

  function getIngredientsForRecipes(ingredientsArray) {
    var html = "";
    $(ingredientsArray).each(function() {
      var grid = typeof(this.grid.x) != "undefined" ? " ("+this.grid.x+", "+this.grid.y+")" : "";
      html += "<span>"+this.name +" "+ grid +"</span><br>"
    });
    return html;
  }

  function getUsedInForIngredients(usedInArray) {
    var html = "";
    $(usedInArray).each(function() {
      html += "<span>"+this+"</span><br>"
    });
    return html;
  }


});
