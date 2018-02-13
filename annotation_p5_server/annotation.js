const numDogs = 25;
var imgURLs = [];
for(var i = 0; i < numDogs; i++)
{
  if(i == 6) continue; //missing dog6.png lmoa
  imgURLs.push("images/dog" + i + ".png");
}
var usedImgs = [];
var currentCount = 0;
var countRequirement = 5;
var urlIdx;

var screenRes = [640, 480];

var promptText;
var instructionsText;

var referenceImgs;
var curImg;
var curMap;
var BrushPreview;
var acceptButton;
var resetButton;
var myCanvas;

var brushSize;
var maxBrushSize = 25;
var minBrushSize = 0.5;
var brushChangeRate = 2;

var curColor = color(255, 0, 0);
var curURL;

function loadReferenceImgs()
{
  referenceImgs = [];
  var i = 0;
  while(i < countRequirement)
  {
    var nuURL;
    do
    {
      urlIdx = Math.floor(Math.random() * imgURLs.length);
      nuURL  = imgURLs[urlIdx];
    }
    while(usedImgs.includes(nuURL));
    var nuImg = loadImage(nuURL);
    usedImgs.push(nuURL);
    referenceImgs.push(nuImg);
    i++;
  }
}

function preload()
{
  loadReferenceImgs();
}

function mousePressed()
{
  brushstroke();
}

function mouseDragged()
{
  brushstroke();
}

function keyPressed()
{
  if(key == 'z' || key == 'Z')
    brushSize -= brushChangeRate;
  if(key == 'x' || key == 'X')
    brushSize += brushChangeRate;
  if(key == 'r' || key == 'R')
    curColor = color(255, 0, 0);
  if(key == 'e' || key == 'E')
    curColor = color(0);
  if(key == 't' || key == 'T')
    curColor = color(0, 0, 255);
  curMap.fill(curColor);
}

function brushstroke()
{
  curMap.ellipse(mouseX / 2, mouseY / 2, brushSize, brushSize);
}

function drawBrushPreview()
{
  BrushPreview.clear();
  BrushPreview.ellipse(mouseX / 2, mouseY / 2, brushSize, brushSize);
  image(BrushPreview, 0, 0);
}

function setup()
{
  noCursor();
  brushSize = 15;
  curColor = color(255, 0, 0);
  myCanvas = createCanvas(screenRes[0], screenRes[1]);
  curMap = createGraphics(screenRes[0], screenRes[1]);
  curMap.noStroke();
  BrushPreview = createGraphics(screenRes[0], screenRes[1]);
  BrushPreview.noFill();
  BrushPreview.stroke(color(255));
  BrushPreview.strokeWeight(0.5);
  resetButton = createButton('Reset');
  resetButton.position(0, screenRes[1] + 5);
  resetButton.size(65, 19);
  acceptButton = createButton('Accept');
  acceptButton.position(75, screenRes[1] + 5);
  acceptButton.size(65, 19);


  resetButton.mousePressed(
    function()
    {
      curMap.clear();
    }
  );
  acceptButton.mousePressed(sendImg);

  curImg = referenceImgs[currentCount];
  curURL = usedImgs[currentCount];
}

function sendImg()
{
  var mapData = {width:curMap.width, height:curMap.height, urlIndex:curURL};
  curMap.loadPixels();
  var pixelEncoding = "";
  for(var i = 0; i < mapData.height; i++)
  {
    for(var j = 0; j < mapData.width; j++)
    {
      var idx = i * mapData.width + j;
      var thisCol = curMap.pixels[idx];
      pixelEncoding += " " + str(red(thisCol)) + " " + str(blue(thisCol))
    }
  }
  mapData.enc = pixelEncoding;
  var sendPath = "http://127.0.0.1:42069/send_message";
  var dataType = "json";
  httpPost(
    sendPath,
    dataType,
    mapData,
    finishFn,
    errorFn
  );
}

function finishFn(result)
{
  if(currentCount >= countRequirement)
  {
    trueFinish();
  }
  else
  {
    currentCount++;
    curMap.clear();
    curImg = referenceImgs[currentCount];
  }
}

function trueFinish()
{
  //print out victory message
  //give validation code to turkers
}

function errorFn(error)
{

}

function draw()
{
  background(0);
  image(curImg, 0, 0);
  blendMode(SCREEN);
  image(curMap, 0, 0);
  blendMode(NORMAL);
  drawBrushPreview();
}