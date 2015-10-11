

function writeMessage(canvas, message) {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 0, 400);


var c = document.getElementById("my_canvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(0,0,150,75);

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
    alert("X=" + canvas_x + "Y=" + canvas_y)
}

var canvas = document.getElementById('my_canvas');
var context = canvas.getContext('2d');

canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(canvas, message);
      }, false);

canvas.addEventListener("mousedown", doMouseDown, false);

