

var jsonInsectMasters = [];
var layerUID = 0;
var nextUID = function() {
  layerUID += 1;
  return layerUID.toString();
};



// function to easily write html p tags to a div
var write_console = function(div,message) {
  var element = document.getElementById(div);
  var para = document.createElement("p");
  var node = document.createTextNode(message);
  para.appendChild(node);
  element.appendChild(para);
};

// thanks for this from the SO community wiki:
//   http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

// JQuery to get JSON from flat files - orderData
function get_json_order(callback) {
  $.getJSON( "data/orderData.json", function( json ) {
    callback(json);
  });
}

// JQuery to get JSON from flat files - insectData
function get_json_insect(callback) {
  $.getJSON( "data/insectCards.json", function( json ) {
    callback(json);
  });
}

// makes using hashes a little easier
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
          var previous;
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
  var canvas_other = document.getElementById("my_canvas");
  var canvas = $('#my_canvas');
  canvas_other.height = window.innerHeight - (window.innerHeight * 0.03);
  canvas_other.width = window.innerWidth - (window.innerWidth * 0.03);
  //var audio = new Audio();
  //audio.src = "audio/beep.wav";
  
  var baseScale = canvas_other.height / 300;
  var rootX = canvas_other.width / 2;
  var rootY = canvas_other.height * -0.35;
  var cardWidth = canvas_other.width * 0.60;
  var cardHeight = canvas_other.height * 0.8;
  //var rootX = 180;
  //var rootY = -160;
  //var cardHeight = 220;
  //var cardWidth = 200;
  var cardPadding = cardHeight / 8;
  var triangleSize = cardPadding * 0.4;
  var trianglePadding = cardWidth * 0.55;
  var fontSize = cardHeight / 40 ;
  var fontFamily = 'Arial';
  var fillStyle = '#000';
  var strokeStyle = '#000';
  var strokeWidth = 0.4;
  var fillGreen = '#117050';
  var fillBlue = '#abcdef';
  var fillOrange = '#dd5a16';
  var fillRed = '#ffccaa';
  var cornerRadius = 15;
  var lastPosition = 0;
  var flipSpeed = 100;
  var menuToggled = false;  
  
  
  var cardTemplate = new HashTable({
                        startX:             rootX,
                        startY:             rootY,
                        layerText01:        "This is layerText01.",
                        layerText02:        "This is layerText02. It can have a lot of text you know.",
                        layerText03:        "This is layerText03. It can also have a lot of text.",
                        cardIndexBase:      1,
                        imageSrcChoiceOne:  'bedbug_small.png',
                        imageSrcChoiceTwo:  'bedbug_small.png',
                        choiceOneChild:     'choiceOneChild',
                        choiceTwoChild:     'choiceTwoChild',
                        position:           0,
                        drawOptOneArrow:    false,
                        drawOptTwoArrow:    false,
                        drawLeftArrow:      false,
                        cardId:             1,
  });
  
  var orderTemplate = new HashTable({
                        startX:             rootX,
                        startY:             rootY * -1.6,
                        layerText01:        "This is order layerText01",
                        layerText02:        "This is order layerText02",
                        cardIndexBase:      1,
                        imageSrc:           'feelgood.png',
                        imageScale:         1,
                        position:           0,
                        drawLeftArrow:      false,
                        cardId:             'string',
  });
  
  get_json_order(function(jsonOrder) {
    get_json_insect(function(jsonInsect) {
      // ALL CODE GOES HERE
      var set_scale = function() {
        //cardWidth = cardWidth * baseScale ;
        //cardHeight = cardHeight * baseScale;
        //cardPadding = cardPadding * baseScale;
        fontSize = fontSize * (baseScale * 0.5);
      };
      
      var pre_draw = function() {
        // this function will be run every time you 
        // want to drawLayers so we can inject things
        // like the menu.
        console.log('Running pre_draw()....');
        draw_menus();
        canvas.drawLayers();
      };
      
      var draw_menus = function() {
        // pull height of current canvas
        var menuBoxHeight = canvas.height();
        var menuBoxWidth = canvas.width();
        var menuBoxClosedWidth = menuBoxWidth * 0.2;
        var menuBoxOpenWidth = menuBoxClosedWidth * 4;
        var menuBoxButtonOpenPosX = menuBoxOpenWidth - (menuBoxOpenWidth * 0.57);
        var menuBoxButtonClosedPosX = menuBoxClosedWidth * 0.25;
        var move_menu_button = function(layer) {
          var box = canvas.getLayer('menu_box');
          var lines = canvas.getLayerGroup('menu_button_lines');
          var button = canvas.getLayer('menu_box_button');
          if (!(menuToggled)) {
            menuToggled = !menuToggled;
            canvas.animateLayer(box, {
              width: menuBoxOpenWidth,  
            }, flipSpeed);
            canvas.animateLayer(button, {
              x: menuBoxButtonOpenPosX,  
            }, flipSpeed);
            canvas.animateLayerGroup(lines, {
              x1: menuBoxButtonOpenPosX + (menuBoxWidth * 0.08 * 0.4),
              x2: menuBoxButtonOpenPosX - (menuBoxWidth * 0.08 * 0.4),
            }, flipSpeed);
            
          } else {
            menuToggled = !menuToggled;
            canvas.animateLayer(box, {
              width: menuBoxClosedWidth,  
            }, flipSpeed);
            canvas.animateLayer(button, {
              x: menuBoxButtonClosedPosX,  
            }, flipSpeed);
            canvas.animateLayerGroup(lines, {
              x1: menuBoxButtonClosedPosX + (menuBoxWidth * 0.08 * 0.4),
              x2: menuBoxButtonClosedPosX - (menuBoxWidth * 0.08 * 0.4),
            }, flipSpeed);
            
          }
        };
        var draw_menu_lines = function(startX) {
          var menuButton = canvas.getLayer('menu_box_button');
          var menuBoxLinesPosX1 = startX + (menuButton.width * 0.4);
          var menuBoxLinesPosX2 = startX - (menuButton.width * 0.4);
          // grab the menubox button's dimensions
          
          var menuButtonLineYs = [];
          menuButtonLineYs.push(menuButton.y - (menuButton.height * 0.25));
          menuButtonLineYs.push(menuButton.y);
          menuButtonLineYs.push(menuButton.y + (menuButton.height * 0.25));
          for (g=0; g < menuButtonLineYs.length; g++) {
            canvas.drawLine({
              layer: true,
              name: 'menu_box_button_line_' + g.toString(),
              groups: ['menu_button_lines'],
              strokeStyle: '#000',
              x1: menuBoxLinesPosX1,
              x2: menuBoxLinesPosX2,
              y1: menuButtonLineYs[g],
              y2: menuButtonLineYs[g], 
            });
          }
          canvas.setLayerGroup('menu_button_lines', {
            click: function(layer) {
              move_menu_button(layer);
            }
          });

        };
        canvas.drawRect({
          layer: true,
          name: 'menu_box',
          fillStyle: fillRed,
          width: menuBoxClosedWidth,
          height: menuBoxHeight,
          x: 0, y: menuBoxHeight / 2,
          shadowBlur: 5,
          shadowColor: '#000',
          });
        canvas.drawRect({
          layer: true,
          name: 'menu_box_button',
          opacity: 0.02,
          strokeStyle: '#000000',
          transparent: true,
          width: menuBoxWidth * 0.08,
          height: menuBoxHeight * 0.06,
          x: menuBoxButtonClosedPosX,
          y: menuBoxHeight * 0.05,
          cornerRadius: cornerRadius / 4,
          click: function(layer) {
            move_menu_button(layer);
          }
          
        });
        draw_menu_lines(menuBoxButtonClosedPosX);
      };
      
      var animation_click_image = function(layer) {
        g = canvas.getLayerGroup(layer.groups[1]);
        var layerImage;
        var layerText;
        var layerRect;
        var layerNames = [];
        
        var set_invisible_all_but = function (layerListIndices,visibleBool) {
          // loops through the canvas and all but the
          // given layer names to invisible. accepts 
          // a list of layer names.
          allLayers = canvas.getLayers();
          var layersToHide = [];
          for (u=0; u < allLayers.length; u++) {
            if (layerListIndices.indexOf(allLayers[u].name) === -1 ) {
              layersToHide.push(allLayers[u]);
            }
          }
          for (j=0;j<layersToHide.length;j++) {
            canvas.animateLayer(layersToHide[j], {
              visible: visibleBool,
            },flipSpeed);
          } 

        };
        
        for (f=0;f<g.length;f++) {
          lName = g[f].name;
          if (lName.indexOf('image') > -1) {
            layerNames.push(g[f].name);
            layerImage = g[f];
          } else if (lName.indexOf('text') > -1) {
            layerNames.push(g[f].name);
            layerText = g[f];
          } else if (lName.indexOf('rectangle') > -1) {
            layerNames.push(g[f].name);
            layerRect = g[f];
          }
        }
        
        // set all but the pop up layers invisible then callback
        set_invisible_all_but(layerNames,false);
        
        canvas.animateLayer(layerImage, {
          scale: baseScale*1.1,
          x: rootX, y: rootY  + cardHeight*1.3,
        }, flipSpeed);
        canvas.animateLayer(layerText, {
          x: rootX, y: rootY + cardHeight*0.8,
        }, flipSpeed);
        canvas.animateLayer(layerRect, {
          width: cardWidth * 1.2,
          height: cardHeight * 1.04,
          y: cardHeight * 0.7,
          shadowColor: '#000',
          shadowBlur: 60,
        }, flipSpeed);
        
        // get current popup width
        var popWidth = layerRect.width;
        var popHeight = layerRect.height;
        canvas.drawRect({
          layer: true,
          name: 'x-button',
          x: rootX + (popWidth / 2),
          y: rootY + (cardHeight * 0.6),
          fillStyle: layerRect.fillStyle,
          strokeStyle: "#000",
          strokeWidth: 1,
          width: popWidth * 0.2,
          height: popHeight * 0.2,
          index: layerRect.index + 1,
          cornerRadius: 10,
          click: function(layer) {
            indexToDraw = layerRect.data.position;
            console.log("Removing all layers..");
            canvas.removeLayers();
            create_layers_from_json_insect(indexToDraw);
            pre_draw();
          }
        },flipSpeed);
        layerXButton = canvas.getLayer('x-button');
        canvas.drawText({
          layer: true,
          name: 'x-button_text',
          x: layerXButton.x,
          y: layerXButton.y,
          text: 'X',
          index: layerXButton.index + 1,
          fontSize: fontSize,
          fillStyle: '#000',
        },flipSpeed);
      };
      
      var find_master_cards = function(json) {
        var found;
        for (i=0; i < json.length; i++) {
          found = false;
          search = json[i].cardId;
          
          for (j=0; j < json.length; j++) {
            if (json[j].choiceOneChild === search | json[j].choiceTwoChild === search) {
              found = true;
            }
            if (found) {
              break;
            }
          }
          if (!found) {
            jsonInsectMasters.push(json[i]);
          }
        }
      };
      var find_endpoint_index = function(stringer) {
        var result = 0;
        for (r=0;r<jsonOrder.length;r++) {
          if (stringer === jsonOrder[r].orderName) {
            result = r;
            break;
          }
        }
        return result;
      };
      
      var find_parent = function(id) {
        // there will never be a parent in jsonOrder
        //  so we'll always look in jsonInsect
        var found = false;
        var count = 0;
        var result = 0;
        for (s=0;s<jsonInsect.length;s++) {
          if (jsonInsect[s].choiceOneChild.toString() === id || 
              jsonInsect[s].choiceTwoChild.toString() === id) {
                result = s;
                found = true;
                count += 1;
              }
        }
        return result;
      };
      
      var find_child_insect_index = function(childId) {
        var result = 0;
        for (u=0; u<jsonInsect.length;u++) {
          if (jsonInsect[u].cardId.toString() === childId) {
            result = u;
            break;
          }
        }
        return result;
      };
      
      
      var animation_click_arrow_right = function(layer) {
        // first we have to create the next layer
        var pos = canvas.getLayer(layer).data.jump;
        var myPos = canvas.getLayer(layer).data.position;
        var isEndpoint = false;
        var endpointPos;
        if (isNaN(pos)) {
          // means pos is a string
          endpointPos = find_endpoint_index(pos);
          isEndpoint = true;
        } else {
          insectPos = find_child_insect_index(pos);
        }
        // pull the current layer group
        group = canvas.getLayerGroup(layer.groups[0]);
        // now move the whole group
        canvas.animateLayerGroup(group, {
          x: '-=400', // move to
          }, flipSpeed,
          function() {
            // wait for finish then clear canvas
            console.log("Removing all layers..");
            canvas.removeLayers();            
            // create the next layer
            if (isEndpoint) {
              create_layers_from_json_order(endpointPos);
            } else {
            create_layers_from_json_insect(insectPos);
            }
            // now redraw the canvas with the new layer
            pre_draw();
          }) ;
        
        
      };
      
      var animation_click_arrow_left = function(layer) {
        // first we have to create the next layer
        var pos = canvas.getLayer(layer).data.jump;
        var myPos = canvas.getLayer(layer).data.position;
        var isEndpoint = false;
        var endpointPos;
        if (isNaN(pos)) {
          // means pos is a string
          endpointPos = find_endpoint_index(pos);
          isEndpoint = true;
        }
        // pull the current layer group
        group = canvas.getLayerGroup(layer.groups[0]);
        // now move the whole group
        canvas.animateLayerGroup(group, {
          x: '+=400', // move to
          }, flipSpeed,
          function() {
            // wait for finish then clear canvas
            console.log("Removing all layers..");
            canvas.removeLayers();            
            // create the next layer
            if (isEndpoint) {
              create_layers_from_json_order(endpointPos);
            } else {
            create_layers_from_json_insect(pos);
            }
            // now redraw the canvas with the new layer
            pre_draw();  
          }) ;
      };
      var animation_click_reset = function(layer) {
        // pull the current layer group
        group = canvas.getLayerGroup(layer.groups[0]);
        // now move the whole group
        canvas.animateLayerGroup(group, {
          rotate: 360,
          x: '+=400', // move to
          }, flipSpeed,
          function() {
            // wait for finish then clear canvas
            console.log("Removing all layers..");
            canvas.removeLayers();            
            // create the next layer
            create_layers_from_json_insect(0);
            // now redraw the canvas with the new layer
            pre_draw();
          }) ;
        
      };
      
      var create_layer_card_order = function(groupName,hashOptions) {
        // first parse the hash options
        var startX = hashOptions.getItem('startX');
        var startY = hashOptions.getItem('startY');
        var layerText01 = hashOptions.getItem('layerText01');
        var layerText02 = hashOptions.getItem('layerText02');
        var cardIndexBase = hashOptions.getItem('cardIndexBase');
        var imageSrc = hashOptions.getItem('imageSrc');
        var imageScale = hashOptions.getItem('imageScale');
        var position = hashOptions.getItem('position');
        var drawLeftArrow = hashOptions.getItem('drawLeftArrow');
        var cardId = hashOptions.getItem('cardId');
        // draw the container box and box text
        var idx = cardIndexBase;
        
        var nextIndex = function() {
          return idx += 1;
        };
        
        canvas.addLayer({
          type: 'rectangle',
          name: "order_rectangle_" + nextUID().toString(),
          groups: [groupName],
          data: {
            position: position
          },
          index: nextIndex(),
          fillStyle: fillOrange,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX, y: startY,
          width: cardWidth, height: cardHeight,
          cornerRadius: cornerRadius,
        });
        canvas.addLayer({
          type: 'text',
          name: "order_rectangle_text_title_" + nextUID(),
          groups: [groupName],
          index: nextIndex(),
          fillStyle: fillStyle,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX, y: startY - (cardHeight / 3),
          fontSize: fontSize*2,
          fontFamily: fontFamily,
          text: layerText02,
          maxWidth: cardWidth,
        });
        canvas.addLayer({
          type: 'text',
          name: "order_rectangle_text_desc_" + nextUID(),
          groups: [groupName],
          index: nextIndex(),
          fillStyle: fillStyle,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX, y: startY - (cardHeight / 5),
          fontSize: fontSize,
          fontFamily: fontFamily,
          text: layerText01,
          maxWidth: cardWidth,
        });
        // now create image layers for choice one and two
        canvas.addLayer({
          type: 'image',
          name: "order_image_choiceOne_" + nextUID(),
          groups: [groupName],
          index: nextIndex(),
          source: imageSrc,
          x: startX, y: startY + (cardHeight / 6),
          //scale: baseScale * 0.6,
          scale: imageScale,
          click: function(layer) {
            animation_click_image(layer);
          }
        });
        if (drawLeftArrow) {
          // draw the back arrow
          canvas.addLayer({
            type: 'polygon',
            name: 'order_arrow_left_' + nextUID(),
            groups: [groupName],
            data: {
              position: position,
              jump:     find_parent(cardId),
            },
            index: nextIndex(),
            fillStyle: fillGreen,
            strokeStyle: strokeStyle,
            x: startX - (trianglePadding), y: startY,
            radius: triangleSize,
            sides: 3,
            rotate: 180 + 90,
            click: function(layer) {
              animation_click_arrow_left(layer);
            }
          });
        }
        // make the reset button
        canvas.addLayer({
        type: 'polygon',
        name: 'order_reset_' + nextUID(),
        groups: [groupName],
        index: nextIndex(),
        fillStyle: fillGreen,
        strokeStyle: strokeStyle,
        x: startX - (cardWidth / 2), y: startY - (cardHeight / 2),
        radius: triangleSize,
        sides: 6,
        rotate: 180 + 90,
        click: function(layer) {
          animation_click_reset(layer);
        }
      });
      };
      // function to create couplet card layers based on input hash
      var create_layer_card_couplet = function(groupName,hashOptions) {
        // first parse the hash options
        var layerNamePrefix = hashOptions.getItem('layerNamePrefix');
        var layerNameSuffix = hashOptions.getItem('layerNameSuffix');
        var startX = hashOptions.getItem('startX');
        var startY = hashOptions.getItem('startY');
        var layerText01 = hashOptions.getItem('layerText01');
        var layerText02 = hashOptions.getItem('layerText02');
        var layerText03 = hashOptions.getItem('layerText03');
        var cardIndexBase = hashOptions.getItem('cardIndexBase');
        var imageSrcChoiceOne = hashOptions.getItem('imageSrcChoiceOne');
        var imageSrcChoiceTwo = hashOptions.getItem('imageSrcChoiceTwo');
        var choiceOneChild = hashOptions.getItem('choiceOneChild');
        var choiceTwoChild = hashOptions.getItem('choiceTwoChild');
        var position = hashOptions.getItem('position');
        var drawOptOneArrow = hashOptions.getItem('drawOptOneArrow');
        var drawOptTwoArrow = hashOptions.getItem('drawOptTwoArrow');
        var drawLeftArrow = hashOptions.getItem('drawLeftArrow');
        var cardId = hashOptions.getItem('cardId');
        // draw the container box and box text
        var idx = cardIndexBase;
        
        var nextIndex = function() {
          return idx += 1;
        };
        
        canvas.addLayer({
          type: 'rectangle',
          name: "couplet_rectangle_" + nextUID().toString(),
          groups: [groupName],
          data: {
            position: position
          },
          index: nextIndex(),
          fillStyle: fillGreen,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX, y: startY,
          width: cardWidth, height: cardHeight,
          cornerRadius: cornerRadius,
        });
        canvas.addLayer({
          type: 'text',
          name: "couplet_rectangle_text_" + nextUID(),
          groups: [groupName],
          data: {
            position: position
          },
          index: nextIndex(),
          fillStyle: fillStyle,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX, y: startY,
          fontSize: fontSize,
          fontFamily: fontFamily,
          text: layerText01,
          maxWidth: cardWidth,
        });
        // draw the two choice boxes
        canvas.addLayer({
          type: 'rectangle',
          name: "couplet_rectangle_choiceOne_" + nextUID(),
          groups: [groupName,'_choiceOne'],
          data: {
            child: choiceOneChild,
            position: position,
          },
          index: nextIndex(),
          fillStyle: fillBlue,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX, y: startY - (cardHeight /4),
          width: cardWidth - (cardWidth * 0.1), 
          height: cardHeight - (cardHeight * 0.6),
          cornerRadius: cornerRadius,
          click: function(layer) {
            animation_click_image(layer);
          }
        });
        canvas.addLayer({
          type: 'rectangle',
          name: "couplet_rectangle_choiceTwo_" + nextUID(),
          groups: [groupName,'_choiceTwo'],
          data: {
            child: choiceTwoChild,
            position: position,
          },
          index: nextIndex(),
          fillStyle: fillBlue,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX, y: startY + (cardHeight /4),
          width: cardWidth - (cardWidth * 0.1), 
          height: cardHeight - (cardHeight * 0.6),
          cornerRadius: cornerRadius,
          click: function(layer) {
            animation_click_image(layer);
          }
        });
        // draw the two choice text
        canvas.addLayer({
          type: 'text',
          name: "couplet_text_choiceOne_" + nextUID(),
          groups: [groupName,'_choiceOne'],
          data: {
            position: position
          },
          index: nextIndex(),
          fillStyle: fillStyle,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX - (cardWidth * 0.2), y: startY - (cardHeight /4),
          fontSize: fontSize,
          fontFamily: fontFamily,
          text: layerText02,
          align: 'left',
          maxWidth: cardWidth - (cardWidth * 0.5),
        });
        canvas.addLayer({
          type: 'text',
          name: "couplet_text_choiceTwo_" + nextUID(),
          groups: [groupName,'_choiceTwo'],
          data: {
            position: position
          },
          index: nextIndex(),
          fillStyle: fillStyle,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX - (cardWidth * 0.2), y: startY + (cardHeight /4),
          fontSize: fontSize,
          fontFamily: fontFamily,
          text: layerText03,
          align: 'left',
          maxWidth: cardWidth - (cardWidth * 0.5),
        });
        // now create image layers for choice one and two
        canvas.addLayer({
          type: 'image',
          name: "couplet_image_choiceOne_" + nextUID(),
          groups: [groupName,'_choiceOne'],
          data: {
            position: position
          },
          index: nextIndex(),
          source: imageSrcChoiceOne,
          x: startX + (cardWidth * 0.2), y: startY - (cardHeight / 4),
          scale: baseScale * 0.44,
          click: function(layer) {
            animation_click_image(layer);
          }
        });
        canvas.addLayer({
          type: 'image',
          name: "couplet_image_choiceTwo_" + nextUID(),
          groups: [groupName,'_choiceTwo'],
          data: {
            position: position
          },
          index: nextIndex(),
          source: imageSrcChoiceTwo,
          x: startX + (cardWidth * 0.2), y: startY + (cardHeight / 4),
          scale: baseScale * 0.44,
          click: function(layer) {
            animation_click_image(layer);
          }
        });
        if (drawOptOneArrow) {
          // draw the optOne right arrow
          canvas.addLayer({
            type: 'polygon',
            name: 'couplet_arrow_right_optOne_' + nextUID(),
            groups: [groupName],
            data: {
              position: position,
              jump:     choiceOneChild
            },
            index: nextIndex(),
            fillStyle: fillGreen,
            strokeStyle: strokeStyle,
            x: startX + (trianglePadding), y: startY - (cardHeight / 4),
            radius: triangleSize,
            sides: 3,
            rotate: 90,
            click: function(layer) {
              animation_click_arrow_right(layer);
            }
          });
        }
        if (drawOptTwoArrow) {
          // draw the optTwo right arrow
          canvas.addLayer({
            type: 'polygon',
            name: 'couplet_arrow_right_optTwo_' + nextUID(),
            groups: [groupName],
            data: {
              position: position,
              jump:     choiceTwoChild,
            },
            index: nextIndex(),
            fillStyle: fillGreen,
            strokeStyle: strokeStyle,
            x: startX + (trianglePadding), y: startY + (cardHeight / 4),
            radius: triangleSize,
            sides: 3,
            rotate: 90,
            click: function(layer) {
              animation_click_arrow_right(layer);
            }
          });
        }
        if (drawLeftArrow) {
          // draw the optTwo right arrow
          canvas.addLayer({
            type: 'polygon',
            name: 'couplet_arrow_left_' + nextUID(),
            groups: [groupName],
            data: {
              position: position,
              jump:     find_parent(cardId),
            },
            index: nextIndex(),
            fillStyle: fillGreen,
            strokeStyle: strokeStyle,
            x: startX - (trianglePadding), y: startY,
            radius: triangleSize,
            sides: 3,
            rotate: 180 + 90,
            click: function(layer) {
              animation_click_arrow_left(layer);
            }
          });
        }
      }; 
      
      var create_layers_from_json_order = function(p) {
        var currentY = orderTemplate.getItem('startY');
        newOrder = clone(orderTemplate);
        groupName = "order_card_" + p.toString();
        max = jsonOrder.length -1;
        newOrder.setItem('layerText01',      jsonOrder[p].details);
        newOrder.setItem('imageSrc',         jsonOrder[p].image);
        newOrder.setItem('layerText02',      jsonOrder[p].orderName);
        newOrder.setItem('position',         p);
        newOrder.setItem('drawLeftArrow',     false); // since can have multiple parents
        newOrder.setItem('cardId',          jsonOrder[p].orderName);
        create_layer_card_order(groupName,newOrder);
      };
      
      var create_layers_from_json_insect = function(p) {
        var currentY = cardTemplate.getItem('startY');
        newCard = clone(cardTemplate);
        max = jsonInsect.length - 1;
        if (p > max) {
          p = 0;
        } else if (p < 0) {
          p = max;
        }
        var i = p;
        currentY = currentY + cardHeight + cardPadding;
        groupName = "couplet_card_" + i.toString();
        // set card properties from the current json object
        newCard.setItem('startY',             currentY);
        newCard.setItem('layerText01',        jsonInsect[i].cardId.toString());
        newCard.setItem('layerText02',        jsonInsect[i].choiceOneText);
        newCard.setItem('layerText03',        jsonInsect[i].choiceTwoText);
        newCard.setItem('imageSrcChoiceOne',  jsonInsect[i].choiceOneImage);
        newCard.setItem('imageSrcChoiceTwo',  jsonInsect[i].choiceTwoImage);
        newCard.setItem('choiceOneChild',     jsonInsect[i].choiceOneChild.toString());
        newCard.setItem('choiceTwoChild',     jsonInsect[i].choiceTwoChild.toString());
        newCard.setItem('cardId',             jsonInsect[i].cardId.toString());
        newCard.setItem('drawOptOneArrow',    true);
        newCard.setItem('drawOptTwoArrow',    true);
        if (p !== 0) {
          newCard.setItem('drawLeftArrow',    true);
        }
        newCard.setItem('position',           p);
        create_layer_card_couplet(groupName,newCard);

      };
      
      var groupName;
      
      // set the total scale
      set_scale();
      

      find_master_cards(jsonInsect);

      console.log('canvas height: ' + canvas.height().toString());
      console.log('canvas width: ' + canvas.width().toString());
      doc = $(document);
      console.log('document height: ' + doc.height().toString());
      console.log('document width: ' + doc.width().toString());
      
      create_layers_from_json_insect(0);
      pre_draw();
      lays = canvas.getLayers();
      
      
      

      
    });
  });
}); // END DOCUMENTREADY