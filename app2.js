var gInsectCardJson;
var gOrderJson;

$.getJSON( "data/insectCards.json", function( json ) {
  console.log( "JSON Data: " + json[0].cardType );
 });
 
 $.getJSON( "data/orderData.json", function( json ) {
  console.log( "JSON Data: " + json[0].cardType );
 });


$( document ).ready(function() {
 var audio = new Audio();
 audio.src = "audio/beep.wav";
   var buttonx = 85;
   var buttonw = 125;
   var buttonh = 30;
   
   
   
  // -----------------------------button 1-----------------------------------------
  $('#my_canvas').drawRect({
    layer: true,
    index: 2,
    name: 'button1',
    strokeStyle: '#00cc00',
    strokeWidth: 2,
    fillStyle: '#FF0000',
    x: buttonx, y: 35,
    width: buttonw , height: buttonh,
    cornerRadius: 10,
    
      //----------------- mouseover-----------------------------
    mouseover: function(layer) {
        $(this).animateLayer(layer, {
          fillStyle: '#008500', 
          }, 300);
      document.getElementById('status').innerHTML = "Hover text"; 
      $('#my_canvas').css('cursor','pointer');
      },
    /* -----------------------------------------------------------------------------------------------------------------
  -------btn1 slide in--------------------------------------------------------------------------------------------------*/  
    mousedown: function(layer) {
      $('#my_canvas').addLayer({
        type: 'image',
        index: 2,
        name: 'btn1img',
        source: './bedbug_small.png',
        x: 1100, y: 10,
      });
      $("#my_canvas").removeLayer("marsimg").drawLayers();
      $("#my_canvas").removeLayer("marstext").drawLayers();
  
      $('#my_canvas').addLayer({
        type: 'text',
        name: 'btn1txt',
        index: 7,
        fillStyle: '#000',
        strokeStyle: '#000',
        strokeWidth: 0.4,
        x: 1100, y: 125,
        fontSize: '20pt',
        fontFamily: 'Arial',
        text: 'Button1 SLIDETEXT',
        maxWidth: 300
      });
    
    // Animate Button1 image
    $('#my_canvas')
     .animateLayer('btn1img', {
         x: 250, y: 500, // move to
         scale: 1.5,
        }, 500);// in this many mS
      
      $('#my_canvas')
     .animateLayer('btn1txt', {
        x: 250, y: 400 // move to
        }, 500);// in this many mS

    }, // end click function 
   
    //-----------------------------Button1 mouseout--------------------------------
    mouseout: function(layer) {
      $(this).animateLayer(layer, {
        fillStyle: '#FF0000',   
        }, 500);
      document.getElementById('status').innerHTML = "Normal text"; 
    },
  });
  // button text
  $('#my_canvas').drawText({
    layer: true,
    index: 3,
    fillStyle: '#000',
    x: 85, y: 35,
    fontSize: 22,
    fontFamily: 'Verdana, sans-serif',
    text: 'Button1',
  });


  });// end document ready

  //------------animate light---------------------------------------

