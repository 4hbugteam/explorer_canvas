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
  -------Mercury slide in--------------------------------------------------------------------------------------------------*/  
    mousedown: function(layer) {
  $('#my_canvas').addLayer({
    type: 'image',
    index: 2,
    name: 'mercuryimg',
    source: './doge.jpg',
    x: 1100, y: 10,
   });
   $("#my_canvas").removeLayer("marsimg").drawLayers();
   $("#my_canvas").removeLayer("marstext").drawLayers();
    audio.play();
  $('#my_canvas').addLayer({
    type: 'text',
    name: 'mercurytext',
     index: 7,
     fillStyle: '#fff',
    strokeStyle: '#fff',
    strokeWidth: 0.4,
    x: 1100, y: 125,
    fontSize: '20pt',
    fontFamily: 'Arial',
    text: 'Mercury, has no moons and no atmosphere',
    maxWidth: 300
  });
    
  // Animate Mercury image
  $('#my_canvas')
   .animateLayer('mercuryimg', {
       x: 600, y: 105, // move to
       scale: 1.5,
      }, 2500);// in this many mS
    
    $('#my_canvas')
   .animateLayer('mercurytext', {
      x: 600, y: 125 // move to
      }, 2500);// in this many mS

  }, // end click function 
   
    //-----------------------------Mercury mouseout--------------------------------
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
    fillStyle: '#9cf',
    x: 85, y: 35,
    fontSize: 22,
    fontFamily: 'Verdana, sans-serif',
    text: 'Mercury',
  });


  //-----------------button 2------------------------------------------------------------------------------------------------
  $('#my_canvas').drawRect({
    layer: true,
    name: 'button2',
     strokeStyle: '#00cc00',
    strokeWidth: 2,
     fillStyle: '#FF0000',
    x: buttonx, y: 75,
    width: buttonw, height: buttonh,
     cornerRadius: 10,
    
    //------mouseover button 2----------------------------------
    mouseover: function(layer) {
      $(this).animateLayer(layer, {
      fillStyle: '#008500', 
      }, 300);
    document.getElementById('status').innerHTML = "Hover text"; 
    $('#my_canvas').css('cursor','pointer');
    },
  /* -----------------------------------------------------------------------------------------------------------------
  -------Mars slide in--------------------------------------------------------------------------------------------------*/  
    mousedown: function(layer) {
  $('#my_canvas').addLayer({
    type: 'image',
     index: 2,
    name: 'marsimg',
   source: './doge.jpg',
    x: 1100, y: 10,
   });
   $("#my_canvas").removeLayer("mercuryimg").drawLayers();
   $("#my_canvas").removeLayer("mercurytext").drawLayers();
    audio.play();
  $('#my_canvas').addLayer({
    type: 'text',
    name: 'marstext',
     index: 7,
     fillStyle: '#fff',
    strokeStyle: '#fff',
    strokeWidth: 0.4,
    x: 1100, y: 125,
    fontSize: '20pt',
    fontFamily: 'Arial',
    text: 'Mars the red planet, has two moons and a thin atmosphere',
    maxWidth: 300
  });
    
  // Animate Mars image
  $('#my_canvas')
   .animateLayer('marsimg', {
       x: 600, y: 105, // move to
       scale: 1.5,
     
      }, 2500);// in this many mS
    
    $('#my_canvas')
   .animateLayer('marstext', {
      x: 600, y: 125 // move to
      }, 2500);// in this many mS

  }, // end click function 

    //---------------------mouseout for mars button---------------------------------
    mouseout: function(layer) {
      $(this).animateLayer(layer, {
      fillStyle: '#FF0000',   
      }, 500);
  document.getElementById('status').innerHTML = "Normal text";  
    $("#my_canvas").removeLayer("rect").drawLayers();
    $("#my_canvas").removeLayer("text").drawLayers();
    },
  });//end Mars button

    $('#my_canvas').drawText({
    layer: true,
    index: 3,
    fillStyle: '#9cf',
    x: 85, y: 75,
    fontSize: 22,
    fontFamily: 'Verdana, sans-serif',
    text: 'Mars',
  });// end Mars text

  // -------------intro text----------------------------------------
    $('#my_canvas').drawText({
    layer: true,
    index: 3,
    fillStyle: '#9cf',
    x: 300, y: 55,
    fontSize: 22,
    fontFamily: 'Verdana, sans-serif',
    text: 'The inner planets are rocky and three have atmospheres',
    maxWidth: 300
  });// end Mars text

  // -------------data display text----------------------------------------
    $('#my_canvas').drawText({
    layer: true,
    index: 3,
    fillStyle: '#FFFF00',
    x: 225, y: 200,
    fontSize: 18,
    fontFamily: 'Verdana, sans-serif',
    text: 'Canvas element info-graphic demo by G whittaker',
    maxWidth: 300
  });// end Mars text

  // -----sun ellipse------------------------------
  $('#my_canvas').drawEllipse({
    layer: true,
    index: 3,
    fillStyle: '#FFFF00',
    x: 500, y: 295,
    width: 900, height: 120
  });
  //------------animate light---------------------------------------
 

  });// end document ready

  //------------animate light---------------------------------------

