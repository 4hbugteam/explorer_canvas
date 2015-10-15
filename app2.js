var gInsectCardJson;
var gOrderJson;
var buttonx = 200;
var buttonw = 200;
var buttonh = 150;
var buttonPad = 20;

  
var write_console = function(div,message) {
  var element = document.getElementById(div);
  var para = document.createElement("p");
  var node = document.createTextNode(message);
  para.appendChild(node);
  element.appendChild(para);
};

function get_json_order(callback) {
  $.getJSON( "data/orderData.json", function( json ) {
    callback(json);
  });
}
function get_json_insect(callback) {
  $.getJSON( "data/insectCards.json", function( json ) {
    callback(json);
  });
}


var create_json_elements_order = function (jsonOrder,jsonInsect,tCanvas) {
    var last_buttonX = 300;
    var buttony = 600;
    for (i=0; i < jsonOrder.length; i++) {
      var buttonY_grow = buttony;
      buttonText = jsonOrder[i].orderName + ": " + jsonOrder[i].details;
      tCanvas.addLayer({
        type: 'rectangle',
        layer: true,
        index: 2,
        name: "order_" + i.toString(),
        strokeStyle: '#00cc00',
        strokeWidth: 2,
        fillStyle: '#FFF000',
        x: last_buttonX, y: buttony,
        width: 200, height: buttonh,
        cornerRadius: 10,
      });
      tCanvas.addLayer({
        type: 'text',
        layer: true,
        index: 3,
        name: "order_" + i.toString() + "_text",
        fillStyle: '#000',
        x: last_buttonX - 50, y: buttony,
        maxWidth: 150,
        align: 'left',
        respectAlign: true,
        fontSize: 10,
        fontFamily: 'Verdana, sans-serif',
        text: buttonText,
      });
      // now find the insect card parent
      result = find_insect_for_order(jsonInsect,jsonOrder[i].orderName,last_buttonX,buttonY_grow,tCanvas);
      tCanvas = result[0];
      buttonY_grow = result[1];
      last_buttonX += 230;
      //write_console('console','Now working on order ' + i.toString() + ' of ' + jsonOrder.length.toString());
    }
return tCanvas;
};

/* var jsonInsect = $.getJSON( "data/insectCards.json", function( json ) {
  return json;}); */

var find_insect_for_order = function(jsonInsect,endpointName,currentX,currentY,tCanvas) {
  var count = 0;
  var newY = currentY;
  //write_console('console',"I'm inside find_insect_for_order");
  for (j=0; j < jsonInsect.length; j++) {
    if (jsonInsect[j].choiceTwoChild === endpointName || jsonInsect[j].choiceOneChild === endpointName) {
      //write_console('console','I found a match!');
      count += 1;
      buttonText = jsonInsect[j].cardId.toString() + ": " + jsonInsect[j].choiceOneText;
      newY = newY + buttonh + buttonPad;
      tCanvas.addLayer({
        type: 'rectangle',
        layer: true,
        index: 2,
        name: "insect_".concat(jsonInsect[j].cardId.toString()),
        strokeStyle: '#00cc00',
        strokeWidth: 2,
        fillStyle: '#FF0000',
        x: currentX, y: newY,
        width: 200, height: buttonh,
        cornerRadius: 10,
      });
      /* write_console('console','Naming layer: "' + "insect_".concat(i.toString()) + '"'); */
      tCanvas.addLayer({
        type: 'text',
        layer: true,
        index: 4,
        name: "insect_".concat(jsonInsect[j].cardId.toString() + "_text"),
        fillStyle: '#000',
        x: currentX, y: newY,
        maxWidth: 150,
        fontSize: 10,
        fontFamily: 'Verdana, sans-serif',
        text: buttonText,
        });
    }
    results = find_insect_children(jsonInsect,jsonInsect[j].cardId,currentX,newY,tCanvas);
    tCanvas = results[0];
    newY = results[1]; 
  }
  write_console('console','Created layers:' + count.toString());
  return [tCanvas,newY];
};


var find_insect_children = function(jsonInsect,cardId,currentX,currentY,tCanvas) {
  var count = 0;
  var newY = currentY;
  //write_console('console',"I'm inside find_insect_for_order");
  for (k=0; k < jsonInsect.length; k++) {
    if (jsonInsect[k].choiceOneChild === cardId || jsonInsect[k].choiceTwoChild === cardId) {
      count += 1;
      buttonText = jsonInsect[k].cardId.toString() + ": " + jsonInsect[k].choiceOneText;
      newY = newY + buttonh + buttonPad;
      tCanvas.addLayer({
        type: 'rectangle',
        layer: true,
        index: 5,
        name: "insect_".concat(jsonInsect[j].cardId.toString()),
        strokeStyle: '#00cc00',
        strokeWidth: 2,
        fillStyle: '#000FFF',
        x: currentX, y: newY,
        width: 200, height: buttonh,
        cornerRadius: 10,
      });
      /* write_console('console','Naming laykr: "' + "insect_".concat(i.toString()) + '"'); */
      tCanvas.addLayer({
        type: 'text',
        layer: true,
        index: 6,
        name: "insect_".concat(jsonInsect[k].cardId.toString() + "_text"),
        fillStyle: '#000',
        x: currentX, y: newY,
        maxWidth: 150,
        fontSize: 10,
        fontFamily: 'Verdana, sans-serif',
        text: buttonText,
        });
    write_console('console','insect_children newY: ' + newY.toString());
    }
  }
  write_console('console','insect_children Created layers:' + count.toString());
  return [tCanvas,newY];
};


var create_json_elements_insect = function(jsonOrder,jsonInsect,tCanvas) {
  last_buttonY = 40;
  for (i=0; i < jsonInsect.length; i++) {
    
    tCanvas.addLayer({
      type: 'rectangle',
      layer: true,
      index: 3,
      name: "insect_".concat(jsonInsect[i].cardId.toString()),
      strokeStyle: '#00cc00',
      strokeWidth: 2,
      fillStyle: '#FF0000',
      x: buttonx, y: last_buttonY,
      width: buttonw, height: buttonh,
      cornerRadius: 10,
    });
    tCanvas.addLayer({
      type: 'text',
      layer: true,
      index: -1,
      name: "insect_top_".concat(jsonInsect[i].cardId.toString() + "_text"),
      fillStyle: '#000',
      x: buttonx - 50, y: last_buttonY,
      maxWidth: 150,
      //align: 'left',
      //respectAlign: true,
      fontSize: 20,
      fontFamily: 'Verdana, sans-serif',
      text: jsonInsect[i].cardId.toString(),
    });
    
        /*
    |
    |
    |  CHOICE ONE CHILD
    |
    */
    
    
      /* write_console('console','Naming layer: "' + "insect_".concat(i.toString()) + '"'); */
    buttonText = jsonInsect[i].choiceOneChild.toString() + ": " + jsonInsect[i].choiceOneText;
    tCanvas.addLayer({
      type: 'text',
      layer: true,
      index: -1,
      name: "insect_".concat(jsonInsect[i].cardId.toString() + "_text_01"),
      fillStyle: '#000',
      x: buttonx, y: last_buttonY - 50,
      maxWidth: 150,
      //align: 'left',
      //respectAlign: true,
      fontSize: 10,
      fontFamily: 'Verdana, sans-serif',
      text: buttonText,
    });
    if (isNaN(jsonInsect[i].choiceOneChild)) {
      //write_console('console','choiceOneChild is not a number: "' + jsonInsect[i].choiceOneChild + '"');
      for (j=0; j < jsonOrder.length; j++) {
        var onetab = buttonx + 330;
        var boxHalf = buttonh / 2;
        if (jsonInsect[i].choiceOneChild === jsonOrder[j].orderName) {
          tCanvas.addLayer({
            type: 'rectangle',
            layer: true,
            index: 3,
            name: "insect_order_".concat(j.toString()) + "_01",
            strokeStyle: '#00cc00',
            strokeWidth: 2,
            fillStyle: '#BBB000',
            x: onetab, y: last_buttonY - boxHalf / 2,
            width: buttonw, height: boxHalf,
            cornerRadius: 10,
          });
          tCanvas.addLayer({
            type: 'text',
            layer: true,
            index: -1,
            name: "insect_order_".concat(j.toString() + "_01_text"),
            fillStyle: '#000',
            x: onetab, y: last_buttonY - boxHalf / 2,
            maxWidth: 150,
            //align: 'left',
            //respectAlign: true,
            fontSize: 20,
            fontFamily: 'Verdana, sans-serif',
            text: jsonOrder[j].orderName.toString(),
          });
          tCanvas.addLayer({
            type: 'text',
            layer: true,
            index: -1,
            name: "insect_child_order_".concat(j.toString() + "_text_01"),
            fillStyle: '#000',
            x: onetab, y: last_buttonY - boxHalf / 2,
            maxWidth: 150,
            //align: 'left',
            //respectAlign: true,
            fontSize: 10,
            fontFamily: 'Verdana, sans-serif',
            text: "....",
          });
        }
      }
    }
    for (j=0; j < jsonInsect.length; j++) {
      var onetab = buttonx + 330;
      var boxHalf = buttonh / 2;
      if (jsonInsect[i].choiceOneChild === jsonInsect[j].cardId) {
        tCanvas.addLayer({
          type: 'rectangle',
          layer: true,
          index: 3,
          name: "insect_child_".concat(jsonInsect[j].cardId.toString()),
          strokeStyle: '#00cc00',
          strokeWidth: 2,
          fillStyle: '#AAA000',
          x: onetab, y: last_buttonY - boxHalf / 2,
          width: buttonw, height: boxHalf,
          cornerRadius: 10,
        });
        tCanvas.addLayer({
          type: 'text',
          layer: true,
          index: -1,
          name: "insect_".concat(jsonInsect[j].cardId.toString() + "_text"),
          fillStyle: '#000',
          x: onetab, y: last_buttonY - boxHalf / 2,
          maxWidth: 150,
          //align: 'left',
          //respectAlign: true,
          fontSize: 20,
          fontFamily: 'Verdana, sans-serif',
          text: jsonInsect[j].cardId.toString(),
        });
        tCanvas.addLayer({
          type: 'text',
          layer: true,
          index: -1,
          name: "insect_child_".concat(jsonInsect[j].cardId.toString() + "_text_01"),
          fillStyle: '#000',
          x: onetab, y: last_buttonY - boxHalf / 2,
          maxWidth: 150,
          //align: 'left',
          //respectAlign: true,
          fontSize: 10,
          fontFamily: 'Verdana, sans-serif',
          text: jsonInsect[j].choiceOneChild.toString() + ": " + jsonInsect[j].choiceOneText,
        });
      }
    }
    
    
    /*
    |
    |
    |  CHOICE TWO CHILD
    |
    */
    
    
    
    buttonText = jsonInsect[i].choiceTwoChild.toString() + ": " + jsonInsect[i].choiceTwoText;
    tCanvas.addLayer({
      type: 'text',
      layer: true,
      index: -1,
      name: "insect_".concat(jsonInsect[i].cardId.toString() + "_text_02"),
      fillStyle: '#000',
      x: buttonx, y: last_buttonY + 50,
      maxWidth: 150,
      //align: 'left',
      //respectAlign: true,
      fontSize: 10,
      fontFamily: 'Verdana, sans-serif',
      text: buttonText,
    });
    if (isNaN(jsonInsect[i].choiceTwoChild)) {
      //write_console('console','choiceOneChild is not a number: "' + jsonInsect[i].choiceOneChild + '"');
      for (j=0; j < jsonOrder.length; j++) {
        var onetab = buttonx + 330;
        var boxHalf = buttonh / 2;
        if (jsonInsect[i].choiceTwoChild === jsonOrder[j].orderName) {
          tCanvas.addLayer({
            type: 'rectangle',
            layer: true,
            index: 3,
            name: "insect_order_".concat(j.toString()) + "_02",
            strokeStyle: '#00cc00',
            strokeWidth: 2,
            fillStyle: '#BBB000',
            x: onetab, y: last_buttonY + boxHalf / 2,
            width: buttonw, height: boxHalf,
            cornerRadius: 10,
          });
          tCanvas.addLayer({
            type: 'text',
            layer: true,
            index: -1,
            name: "insect_order_".concat(j.toString() + "_02_text"),
            fillStyle: '#000',
            x: onetab, y: last_buttonY + boxHalf / 2,
            maxWidth: 150,
            //align: 'left',
            //respectAlign: true,
            fontSize: 20,
            fontFamily: 'Verdana, sans-serif',
            text: jsonOrder[j].orderName.toString(),
          });
          tCanvas.addLayer({
            type: 'text',
            layer: true,
            index: -1,
            name: "insect_child_order_".concat(j.toString() + "_text_02"),
            fillStyle: '#000',
            x: onetab, y: last_buttonY + boxHalf / 2,
            maxWidth: 150,
            //align: 'left',
            //respectAlign: true,
            fontSize: 10,
            fontFamily: 'Verdana, sans-serif',
            text: "....",
          });
        }
      }
    }
    for (j=0; j < jsonInsect.length; j++) {
      var onetab = buttonx + 330;
      var boxHalf = buttonh / 2;
      if (jsonInsect[i].choiceTwoChild === jsonInsect[j].cardId) {
        tCanvas.addLayer({
          type: 'rectangle',
          layer: true,
          index: 3,
          name: "insect_child_".concat(jsonInsect[j].cardId.toString()),
          strokeStyle: '#00cc00',
          strokeWidth: 2,
          fillStyle: '#AAA000',
          x: onetab, y: last_buttonY + boxHalf / 2,
          width: buttonw, height: boxHalf,
          cornerRadius: 10,
        });
        tCanvas.addLayer({
          type: 'text',
          layer: true,
          index: -1,
          name: "insect_".concat(jsonInsect[j].cardId.toString() + "_text"),
          fillStyle: '#000',
          x: onetab, y: last_buttonY + boxHalf / 2,
          maxWidth: 150,
          //align: 'left',
          //respectAlign: true,
          fontSize: 20,
          fontFamily: 'Verdana, sans-serif',
          text: jsonInsect[j].cardId.toString(),
        });
        tCanvas.addLayer({
          type: 'text',
          layer: true,
          index: -1,
          name: "insect_child_".concat(jsonInsect[j].cardId.toString() + "_text_02"),
          fillStyle: '#000',
          x: onetab, y: last_buttonY + boxHalf / 2,
          maxWidth: 150,
          //align: 'left',
          //respectAlign: true,
          fontSize: 10,
          fontFamily: 'Verdana, sans-serif',
          text: jsonInsect[j].choiceTwoChild.toString() + ": " + jsonInsect[j].choiceTwoText,
        });
      }
    }
    
    last_buttonY += buttonh + (buttonh / 4);
  }  
  write_console('console','Num of canvas layers when outside for loop: ' + tCanvas.getLayers().length.toString());
  return tCanvas;
};

var move_group_off = function(group,direction) {
  var moveY = "-=600";
  var moveX = "-=100";
  if (direction === 'topleft') {
    moveX = "-=400";
  } else if (direction === 'topright') {
    moveX = "+=400";
  } else {
    moveX = "-=100";
  }
  v = canvas.getLayerGroup(group);
  for (i=0; i < v.length; i++) {
    canvas.animateLayer(v[i], {
      x: moveX, y: moveY, // move to
      scale: 1,
      }, 1000
    );// in this many mS
  }
};
/*
var start_page = function(canvas) {
  centerX = (canvas.width() / 2);
  centerY = (canvas.height() / 2);
  canvas.addLayer({
    type: 'ellipse',
    layer: true,
    name: 'ellipse_01_start',
    groups: ['start_page'],
    fillStyle: '#c33',
    x: 210, y: 250,
    width: 100, height: 100
  });
  canvas.addLayer({
    type: 'rectanble',
    layer: true,
    name: 'text_01_start',
    groups: ['start_page'],
    fillStyle: '#9cf',
    strokeStyle: '#25a',
    strokeWidth: 2,
    x: 210, y: 250,
    fontSize: 48,
    fontFamily: 'Verdana, sans-serif',
    text: 'Start'
  });
  canvas.addLayer({
    type: 'rectangle',
    layer: true,
    name: 'vector_01_start',
    groups: ['start_page'],
    strokeStyle: '#000',
    strokeWidth: 4,
    rounded: true,
    endArrow: true,
    arrowRadius: 15,
    arrowAngle: 90,
    x: 207.5, y: centerY,
    a1: 160, l1: 950,
    click: function() {
      move_group_off('start_page','topleft');
    }
  });

  canvas.addLayer({
    type: 'vector',
    layer: true,
    name: 'vector_02_start',
    groups: ['start_page'],
    strokeStyle: '#000',
    strokeWidth: 4,
    rounded: true,
    endArrow: true,
    arrowRadius: 15,
    arrowAngle: 90,
    x: centerX, y: centerY,
    a1: 200, l1: 950,
    click: function() {
      move_group_off('start_page','topright');
    }
  });
return canvas;
};
*/
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



$( document ).ready(function() {
  //var audio = new Audio();
  //audio.src = "audio/beep.wav";

  var canvas = $('#my_canvas');
  var activeLayers = [];
  write_console('console','Num of canvas layers before going into create_json: ' + canvas.getLayers().length.toString()); 
  
  // hashtable class stolen from http://www.mojavelinux.com/articles/javascript_hashes.html
  
  
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

  write_console("console","hello world");


  // draw_button(  option1_button );
  get_json_order(function(jsonOrder) {
    get_json_insect(function(jsonInsect) {
      
      canvas = create_json_elements_insect(jsonOrder,jsonInsect,canvas);
      
      var lays = canvas.getLayers();
      write_console('console','Num of layers: ' + lays.length.toString());
      /* for (i=0; i < lays.length; i++) {
        write_console('console','Layer List: ' + lays[i].name);
      }*/
      
      // canvas = create_json_elements_insect(jsonInsect,canvas);
      canvas.drawLayers();
    });
  });
  

  
});// end document ready

