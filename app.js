

function writeMessage(canvas, message, clickmessage) {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 0, 400);
        context.fillText(clickmessage, 0, 500);


var c = document.getElementById("my_canvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(200,50,50,50);

var c = document.getElementById("my_canvas");
var ctx = c.getContext("2d");
ctx.moveTo(200,200);
ctx.lineTo(500,400);
ctx.stroke();

var c = document.getElementById("my_canvas");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.arc(95,50,40,0,2*Math.PI);
ctx.stroke();
      }

function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }    

function doMouseDown(event) {
    canvas_x = event.pageX;
    canvas_y = event.pageY;
    clickmessage = ("You clicked: X=" + canvas_x + " Y=" + canvas_y)
    writeMessage(canvas,message,clickmessage)
    if (canvas_x >= 650 && canvas_x <= 700 && canvas_y >= 60 && canvas_y <= 108) {
        alert("You clicked it");
}
}

var canvas = document.getElementById('my_canvas');
var context = canvas.getContext('2d');
var clickmessage = "You clicked: "
var message = "Mouse position: " 


canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(canvas, message,clickmessage);
      }, false);

canvas.addEventListener("mousedown", doMouseDown, false);

