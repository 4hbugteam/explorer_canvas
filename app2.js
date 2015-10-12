var gInsectCardJson;
var gOrderJson;

$.getJSON( "data/insectCards.json", function( json ) {
  console.log( "JSON Data: " + json[0].cardType );
 });
 
 $.getJSON( "data/orderData.json", function( json ) {
  console.log( "JSON Data: " + json[0].cardType );
 });


$( document ).ready(function() {
  //var audio = new Audio();
  //audio.src = "audio/beep.wav";
  var buttonx = 85;
  var buttonw = 125;
  var buttonh = 30;
  var canvas = $('#my_canvas');
  // hashtable class stolen from http://www.mojavelinux.com/articles/javascript_hashes.html
  function HashTable(obj)
  {
      this.length = 0;
      this.items = {};
      for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
              this.items[p] = obj[p];
              this.length++;
          }
      }
  
      this.setItem = function(key, value)
      {
          var previous = undefined;
          if (this.hasItem(key)) {
              previous = this.items[key];
          }
          else {
              this.length++;
          }
          this.items[key] = value;
          return previous;
      };
  
      this.getItem = function(key) {
          return this.hasItem(key) ? this.items[key] : undefined;
      };
  
      this.hasItem = function(key)
      {
          return this.items.hasOwnProperty(key);
      };
     
      this.removeItem = function(key)
      {
          if (this.hasItem(key)) {
              previous = this.items[key];
              this.length--;
              delete this.items[key];
              return previous;
          }
          else {
              return undefined;
          }
      };
  
      this.keys = function()
      {
          var keys = [];
          for (var k in this.items) {
              if (this.hasItem(k)) {
                  keys.push(k);
              }
          }
          return keys;
      };
  
      this.values = function()
      {
          var values = [];
          for (var k in this.items) {
              if (this.hasItem(k)) {
                  values.push(this.items[k]);
              }
          }
          return values;
      };
  
      this.each = function(fn) {
          for (var k in this.items) {
              if (this.hasItem(k)) {
                  fn(k, this.items[k]);
              }
          }
      };
  
      this.clear = function()
      {
          this.items = {};
          this.length = 0;
      };
  }
  
  // function to create canvas layers based on key:value parameters
  var create_layer = function (hashOptions) {
    // first parse the hash options
    var canvas = hashOptions.getItem('canvas');
    var layerName = hashOptions.getItem('layerName');
    var layerType = hashOptions.getItem('layerType');
    var startX = hashOptions.getItem('startX');
    var startY = hashOptions.getItem('startY');
    var layerText = hashOptions.getItem('layerText');
    var imageSrc = '';
    if ( hashOptions.hasItem('imageSrc')) { 
      imageSrc = hashOptions.getItem('imageSrc');
    } else {
      imageSrc = '';
    }
    if (layerType === 'text') {
        canvas.addLayer({
          type: layerType,
          name: layerName,
          index: 7,
          fillStyle: '#000',
          strokeStyle: '#000',
          strokeWidth: 0.4,
          x: startX, y: startY,
          fontSize: '20pt',
          fontFamily: 'Arial',
          text: layerText,
          maxWidth: 300,
        });
    } else if (layerType === 'image'){
      canvas.addLayer({
          type: layerType,
          index: 2,
          name: layerName,
          source: imageSrc,
          x: startX, y: startY,
        });
    }
  };
   

  var draw_button = function (hashOptions) {
    var canvas = hashOptions.getItem('canvas');
    var buttonName = hashOptions.getItem('buttonName');
    var buttonText = hashOptions.getItem('buttonText');
    var buttonSlideText = hashOptions.getItem('buttonSlideText');
    var buttonX = hashOptions.getItem('buttonX');
    var buttonY = hashOptions.getItem('buttonY');
    var layers = hashOptions.getItem('layers');
    // process the layers, create them and make a list of 'to animate' layers

    for (var i = 0, v = layers.values(), len = v.length; i < len; i++) {
      var layer = v[i];
      create_layer(layer);
    }
    var imageLayerName = layerOptions_image.getItem('layerName');
    var slideTextLayerName = layerOptions_text.getItem('layerName');
    canvas.drawRect({
      layer: true,
      index: 2,
      name: buttonName,
      strokeStyle: '#00cc00',
      strokeWidth: 2,
      fillStyle: '#FF0000',
      x: buttonX, y: buttonY,
      width: buttonw , height: buttonh,
      cornerRadius: 10,
  
      //----------------- mouseover-----------------------------
      mouseover: function(layer) {
          $(this).animateLayer(layer, {
            fillStyle: '#008500', 
            }, 300);
        document.getElementById('status').innerHTML = "Hover text"; 
        canvas.css('cursor','pointer');
      },
      /* -----------------------------------------------------------------------------------------------------------------
      -------btn1 slide in--------------------------------------------------------------------------------------------------*/
    
      mousedown: function(layer) {

        //canvas.removeLayer("marsimg").drawLayers();
        //canvas.removeLayer("marstext").drawLayers();

      // loop through the created layers and animate them
        for (var i = 0, v = layers.values(), len = v.length; i < len; i++) {
          var layer_animate = v[i];
          var layerName = layer_animate.getItem('layerName');
          var layerEndX = layer_animate.getItem('endX');
          var layerEndY = layer_animate.getItem('endY');
          
          // animate the layer
          canvas.animateLayer(layerName, {
             x: layerEndX, y: layerEndY, // move to
             scale: 1.5,
            }, 500);// in this many mS
        }

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
    canvas.drawText({
      layer: true,
      index: 3,
      fillStyle: '#000',
      x: buttonX, y: buttonY,
      fontSize: 22,
      fontFamily: 'Verdana, sans-serif',
      text: buttonText,
    });

                                
  };

  var layerOptions_image = new HashTable({
                              canvas:     canvas,
                              layerName:  'layer1_image',
                              layerType:  'image',
                              startX:     1500,
                              startY:     1500,
                              endX:       250,
                              endY:       700,
                              imageSrc:   './bedbug_small.png'
  });
  var layerOptions_text = new HashTable({
                              canvas:     canvas,
                              layerName:  'layer1_text',
                              layerType:  'text',
                              startX:     1500,
                              startY:     1500,
                              endX:       250,
                              endY:       500,
                              layerText:  "I'm a func generated layer",
  });
  
  var layers = new HashTable({
                      layer1: layerOptions_image,
                      layer2: layerOptions_text
  });
  
  var buttonOptions = new HashTable({
                              canvas:     canvas,
                              buttonName: 'button1',
                              buttonText: 'Button1',
                              buttonX:    buttonx,
                              buttonY:    90,
                              layers:     layers
  });
  
  
  draw_button(  buttonOptions );
  


});// end document ready

