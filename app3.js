var baseScale = 1;
var rootX = 200;
var rootY = 10;
var cardWidth = 250;
var cardHeight = 300;
var cardPadding = 50;
var fontSize = 12;
var fontFamily = 'Arial';
var fillStyle = '#000';
var strokeStyle = '#000';
var strokeWidth = 0.4;
var fillGreen = '#117050';
var fillBlue = '#abcdef';
var fillOrange = '#dd5a16';
var layerUID = 0;
var cornerRadius = 15;
var lastPosition = 0;


var nextUID = function() {
  layerUID += 1;
  return layerUID.toString();
};

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
});

// function to easily write html p tags to a div
var write_console = function(div,message) {
  var element = document.getElementById(div);
  var para = document.createElement("p");
  var node = document.createTextNode(message);
  para.appendChild(node);
  element.appendChild(para);
};


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
  var canvas = $('#my_canvas');

  //var audio = new Audio();
  //audio.src = "audio/beep.wav";

  
  get_json_order(function(jsonOrder) {
    get_json_insect(function(jsonInsect) {
      // ALL CODE GOES HERE
      
      var set_scale = function() {
        cardWidth = cardWidth * baseScale ;
        cardHeight = cardHeight * baseScale;
        cardPadding = cardPadding * baseScale;
        fontSize = fontSize * baseScale;
      };
      
      var animation_click_image = function(layer) {
        canvas.animateLayer(layer, {
          rotate: '+=720',
        }, 600);
      };

      var animation_click_arrow_up = function(layer) {
        // first we have to create the next layer
        var pos = canvas.getLayer(layer).data.position;
        write_console('console','Current Position: ' + pos.toString());
        create_layers_from_json_insect(pos + 1);
        // pull the current layer group
        group = canvas.getLayerGroup(layer.groups[0]);
        // now move the whole group
        for (k=0; k < group.length; k++) {
          canvas.animateLayer(group[k], {
          y: '+=900', // move to
          }, 1000 );
        }
        // now redraw the canvas with the new layer
        canvas.drawLayers();
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
          groups: [groupName],
          data: {
            child: choiceOneChild
          },
          index: nextIndex(),
          fillStyle: fillBlue,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX, y: startY - (cardHeight /4),
          width: cardWidth - (cardWidth * 0.1), 
          height: cardHeight - (cardHeight * 0.6),
          cornerRadius: cornerRadius,
        });
        canvas.addLayer({
          type: 'rectangle',
          name: "couplet_rectangle_choiceTwo_" + nextUID(),
          groups: [groupName],
          data: {
            child: choiceTwoChild
          },
          index: nextIndex(),
          fillStyle: fillBlue,
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          x: startX, y: startY + (cardHeight /4),
          width: cardWidth - (cardWidth * 0.1), 
          height: cardHeight - (cardHeight * 0.6),
          cornerRadius: cornerRadius,
        });
        // draw the two choice text
        canvas.addLayer({
          type: 'text',
          name: "couplet_text_choiceOne_" + nextUID(),
          groups: [groupName],
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
          groups: [groupName],
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
          groups: [groupName],
          index: nextIndex(),
          source: imageSrcChoiceOne,
          x: startX + (cardWidth * 0.2), y: startY - (cardHeight / 4),
          scale: baseScale * 0.6,
          click: function(layer) {
            animation_click_image(layer);
          }
        });
        canvas.addLayer({
          type: 'image',
          name: "couplet_image_choiceTwo_" + nextUID(),
          groups: [groupName],
          index: nextIndex(),
          source: imageSrcChoiceTwo,
          x: startX + (cardWidth * 0.2), y: startY + (cardHeight / 4),
          scale: baseScale * 0.6,
          click: function(layer) {
            animation_click_image(layer);
          }
        });
        // draw the up arrow
        canvas.addLayer({
          type: 'polygon',
          name: 'couplet_arrow_down_' + nextUID(),
          groups: [groupName],
          data: {
            position: position
          },
          index: nextIndex(),
          fillStyle: fillGreen,
          strokeStyle: strokeStyle,
          x: startX, y: startY - (cardHeight - (cardPadding*2)),
          radius: cardPadding / 2,
          sides: 3,
          click: function(layer) {
            animation_click_arrow_up(layer);
          }
        });
        // draw the down arrow
        canvas.addLayer({
          type: 'polygon',
          name: 'couplet_arrow_down_' + nextUID(),
          groups: [groupName],
          data: {
            position: position
          },
          index: nextIndex(),
          fillStyle: fillGreen,
          strokeStyle: strokeStyle,
          x: startX, y: startY + (cardHeight - (cardPadding*2)),
          radius: cardPadding / 2,
          sides: 3,
          rotate: 180,
          click: function(layer) {
            animation_click_arrow_down(layer);
          }
        });
      };
      
      var create_layers_from_json_insect = function(p) {
        var currentY = cardTemplate.getItem('startY');
        var i = p;
        newCard = clone(cardTemplate);
        max = jsonInsect.length;
        if (p > max) {
          p = 0;
        }  
        currentY = currentY + cardHeight + cardPadding;
        groupName = "couplet_card_" + i.toString();
        // set card properties from the current json object
        newCard.setItem('startY',             currentY);
        newCard.setItem('layerText01',        jsonInsect[i].cardId.toString());
        newCard.setItem('layerText02',        jsonInsect[i].choiceOneText);
        newCard.setItem('layerText03',        jsonInsect[i].choiceTwoText);
        //newCard.setItem('imageSrcChoiceOne'.  json[i].choiceOneImage);
        //newCard.setItem('imageSrcChoiceTwo'.  json[i].choiceTwoImage);
        newCard.setItem('choiceOneChild',     jsonInsect[i].choiceOneChild.toString());
        newCard.setItem('choiceTwoChild',     jsonInsect[i].choiceTwoChild.toString());
        newCard.setItem('position',           p);
        create_layer_card_couplet(groupName,newCard);

      };
      
      var groupName;
      
      // set the total scale
      set_scale();
      
      /*
      anotherCard_2 = clone(cardTemplate);
      currentY = anotherCard_2.getItem('startY');
      anotherCard_2.setItem('startY', currentY + cardHeight + cardPadding);
      groupName = 'group02';
      create_layer_card_couplet(canvas,groupName,anotherCard_2);
      */
      
      create_layers_from_json_insect(lastPosition);
      
      
      
      v = canvas.getLayers();
      for (j=0; j < v.length; j++) {
        write_console('console','LAYERS: ' + v[j].name + ": " + v[j].data.child);
      }
      canvas.drawLayers();
      

      
    });
  });
}); // END DOCUMENTREADY