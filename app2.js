var gInsectCardJson;
var gOrderJson;

/*
$.getJSON( "data/insectCards.json", function( json ) {
  alert( "JSON Data: " + json[0].cardType );
 });
 
 $.getJSON( "data/orderData.json", function( json ) {
  alert( "JSON Data: " + json[0].cardType );
 });
*/

$( document ).ready(function() {
  //var audio = new Audio();
  //audio.src = "audio/beep.wav";
  var buttonx = 85;
  var buttonw = 125;
  var buttonh = 60;
  var canvas = $('#my_canvas');
  var activeLayers = [];

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
  
  // takes the message string and writes to the div specified
  
  
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
          index: 1,
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
          index: 0,
          name: layerName,
          source: imageSrc,
          x: startX, y: startY,
        });
    }
  };
   

  var draw_button = function (hashOptions) {
    write_console("console","I'm inside draw_button()");
    var canvas = hashOptions.getItem('canvas');
    var buttonName = hashOptions.getItem('buttonName');
    var buttonText = hashOptions.getItem('buttonText');
    var buttonSlideText = hashOptions.getItem('buttonSlideText');
    var buttonX = hashOptions.getItem('buttonX');
    var buttonY = hashOptions.getItem('buttonY');
    var layers = hashOptions.getItem('layers');

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
      /*
      mouseover: function(layer) {
          $(this).animateLayer(layer, {
            fillStyle: '#008500', 
            }, 300);
        document.getElementById('status').innerHTML = "Hover text"; 
        canvas.css('cursor','pointer');
      },
      */
      /* -----------------------------------------------------------------------------------------------------------------
      -------btn1 slide in--------------------------------------------------------------------------------------------------*/
    
      click: function(layer) {
          // clear out the previous active layers
          do { 
            j = activeLayers.splice(0,1); 
            layer = j.toString();
              canvas.removeLayer(layer).drawLayers();
            } while (activeLayers.length !== 0);

      // loop through the created layers and animate them
        for (var i = 0, v = layers.values(), len = v.length; i < len; i++) {
          write_console("console","Creating and Animating: " + v[i]);
          var layer_animate = v[i];
          create_layer(layer_animate);
          var layerName = layer_animate.getItem('layerName');
          var layerEndX = layer_animate.getItem('endX');
          var layerEndY = layer_animate.getItem('endY');
          
          // animate the layer
          canvas.animateLayer(layerName, {
             x: layerEndX, y: layerEndY, // move to
             scale: 1,
             rotate: '+=720',
            }, 500
            );// in this many mS
          // keep track of all the layers we activate
          activeLayers.push(layerName);

        }
        // show contents of activeLayers in console
        if (activeLayers.length > 0) {
          for (var k = 0; k < activeLayers.length; k++) {
            write_console("console","Active Layers: " + activeLayers[k]);
          }
          write_console("console","------");
        }

      }, // end click function 
   /*
    //-----------------------------Button1 mouseout--------------------------------
      mouseout: function(layer) {
        $(this).animateLayer(layer, {
          fillStyle: '#FF0000',   
          }, 500);
        document.getElementById('status').innerHTML = "Normal text"; 
      },
    */
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
  
  
  var option1_image = new HashTable({
                              canvas:     canvas,
                              layerName:  'option1_image',
                              layerType:  'image',
                              startX:     1500,
                              startY:     1500,
                              endX:       150,
                              endY:       200,
                              imageSrc:   './doge.jpg'
  });
  var option1_text = new HashTable({
                              canvas:     canvas,
                              layerName:  'option1_text',
                              layerType:  'text',
                              startX:     1500,
                              startY:     1500,
                              endX:       150,
                              endY:       300,
                              layerText:  "This is option one.",
  });
  var option1_button = new HashTable({
                              canvas:     canvas,
                              buttonName: 'option1',
                              buttonText: 'Option 1',
                              buttonX:    buttonx,
                              buttonY:    160,
                              layers:     new HashTable({
                                            layer1: option1_image,
                                            layer2: option1_text
                                          })
  });
  
  var option2_image = new HashTable({
                              canvas:     canvas,
                              layerName:  'option2_image',
                              layerType:  'image',
                              startX:     1500,
                              startY:     1500,
                              endX:       150,
                              endY:       200,
                              imageSrc:   './doge.jpg'
  });
  var option2_text = new HashTable({
                              canvas:     canvas,
                              layerName:  'option2_text',
                              layerType:  'text',
                              startX:     1500,
                              startY:     1500,
                              endX:       150,
                              endY:       300,
                              layerText:  "This is option two.",
  });
  var option2_button = new HashTable({
                              canvas:     canvas,
                              buttonName: 'option2',
                              buttonText: 'Option 2',
                              buttonX:    buttonx,
                              buttonY:    230,
                              layers:     new HashTable({
                                            layer1: option2_image,
                                            layer2: option2_text
                                          })
  });
  
  
  var layerOptions_image = new HashTable({
                              canvas:     canvas,
                              layerName:  'layer1_image',
                              layerType:  'image',
                              startX:     1500,
                              startY:     1500,
                              endX:       150,
                              endY:       200,
                              imageSrc:   './bedbug_small.png'
  });
  var layerOptions_text = new HashTable({
                              canvas:     canvas,
                              layerName:  'layer1_text',
                              layerType:  'text',
                              startX:     1500,
                              startY:     1500,
                              endX:       150,
                              endY:       300,
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
                              buttonY:    80,
                              layers:     layers
  });
  
  var write_console = function(div,message) {
    var element = document.getElementById(div);
    var para = document.createElement("p");
    var node = document.createTextNode(message);
    para.appendChild(node);
    element.appendChild(para);
    
  };

write_console("console","hello world");

  draw_button(  buttonOptions );
  draw_button(  option1_button );
  draw_button(  option2_button );
  


});// end document ready

