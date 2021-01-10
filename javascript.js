//Variables
//==========================


//App
//---------------------------
const resfreshValue = 20;

const maxWidthLineVal = 50;

var currentColor = 'black';
var timeOut;
var isDrawing = false;

var x = 0;
var y = 0;

var lineWidth = 8;

//Html elements
//---------------------------

const colorsBarElement = $('#colors');
const canvasElement = $('#canvas');
const currentColorElement = $('#current_color');
const colorPickerElement = document.getElementById('color_picker');

const downloadLink = $('#download_link');


const btnClear = $('#btn_clear');
const btnSave = $('#btn_save');
const sliderLineWitdh = $('#line_width_slider');


const context = canvasElement[0].getContext('2d');

//Functions
//==========================
function init() {
    initEvents();
    initSlider();
    resizeCanvas();
}

function initEvents() {
    //colors Bars Stuff 

    //setting on click event for each colors
    colorsBarElement.children('tbody').children('tr').each(function (index, tr) {
        $(tr).children('td').each(function (index, td) {
            setColorPickerEventListener(td);
        });
    });


    //Canvas Stuff

    canvasElement.mousedown(function (e) {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });
    canvasElement.mousemove(function (e) {
        if (isDrawing === true) {
            draw(x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });
    canvasElement.mouseup(function (e) {
        if (isDrawing === true) {
            draw(x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });
    canvasElement.mouseleave(function () {
        isDrawing = false;
        clearInterval(timeOut);
        return false;
    });


    //Button clear


    btnClear.on('click', function () {
        clearCanvas();
    });
    btnSave.on('click', function () {
        saveCanvas();
    });


    //Slider Line Width
    sliderLineWitdh.on('change', function () {
        updateSliderVal();
    });

    //Color picker
    colorPickerElement.onchange =  function () {
        let color =  colorPickerElement.value
        let event = {data:{color:color}};
        selectColor(event);
    }

}


//Colours bar menu functions
//------------------------------
function setColorPickerEventListener(element) {
    element = parseTojQuery(element);

    let  color = element.css('background-color');

    console.log('color changed !');
    element.bind('click', { color: color }, selectColor);
}

function selectColor(event) {
    console.log('Color seleccionado');
    console.log(event.data.color);
    currentColor = event.data.color;
    currentColorElement.css('background-color', currentColor);
    console.log('Current color = '+currentColor);

    let splittedRgb = splitRGB(currentColor);
    console.log('Splitted RGB = '+splittedRgb);
    let hexColor = fullColorHex(splittedRgb[0],splittedRgb[1],splittedRgb[2]);
    console.log('Parsed Colour = '+hexColor);
    colorPickerElement.background = '#'+hexColor;
    colorPickerElement.color = '#'+hexColor;
    colorPickerElement.value ='#'+hexColor;
}



//Canvas functions
//-------------------------------
function draw(x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = currentColor;
    context.lineWidth = lineWidth;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();


    // console.log('drawing ! ');
    // console.log('Color = ' + currentColor);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}

function saveCanvas() {
    var d = canvas.toDataURL("image/png");
    var w = window.open('about:blank', 'image from canvas');
    w.document.write("<img src='" + d + "' alt='from canvas'/>");

}

function resizeCanvas() {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
}




//LineWidth slider  functions
//--------------------------

function initSlider() {
    sliderLineWitdh.attr('max', maxWidthLineVal);
    sliderLineWitdh.val(lineWidth);
}

function updateSliderVal() {
    lineWidth = sliderLineWitdh.val();
}


//Utils
//==========================

function parseTojQuery(element) {
    return $(element);
}
function rgbToHex(rgb) {
  
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
}

function splitRGB(stringRGB) {
    return stringRGB.substring(4, stringRGB.length-1).replace(/ /g, '').split(',');
}

function fullColorHex(r,g,b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red+green+blue;
}

//On ready
//==========================

$(document).ready(function () {
    init();
});