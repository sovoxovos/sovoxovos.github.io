// first we need to create a stage
var stage = new Konva.Stage({
  container: 'container',   // id of container <div>
  width: 1200,
  height: 800
});

// then create layer
var toolLayer = new Konva.Layer();
var displayLayer = new Konva.Layer();
var dragLayer = new Konva.Layer();

// create our shape
function createImageTool(imageObj, y, isRepeater) {
  return new Konva.Image({
    image: imageObj,
    x: 20,
    y: y,
    width: imageObj.width/imageObj.height * 120,
    height: 180,
    draggable: true,
    isRepeater: isRepeater,
    shadowEnabled: false,
    createReplacement: function () {
      return createImageTool(imageObj, y, isRepeater); // curry, ftw!
    }
  });
}


// add the shape to the layer
initImageTool('img/repeater.png', 0, true);
initImageTool('img/1.png', 120);
initImageTool('img/2.png', 240);
initImageTool('img/3.png', 360);
initImageTool('img/4.png', 480);

function initImageTool(url, location, isRepeater) {
  var imgObj = new Image();
  imgObj.onload = function() {
    var imgTool = createImageTool(this, location, isRepeater);
    toolLayer.add(imgTool);
    toolLayer.draw();
  };
  imgObj.src = url;
}

// add the layer to the stage
stage.add(toolLayer);
stage.add(displayLayer);
stage.add(dragLayer);

toolLayer.on('dragstart', function (evt) {
  var shape = evt.target;
  shape.moveTo(dragLayer);
  toolLayer.add(shape.getAttr('createReplacement')());
});

displayLayer.on('dragstart', function (evt) {
  var shape = evt.target;
  shape.moveTo(dragLayer);
  displayLayer.draw();
});

dragLayer.on('dragmove', function (evt) {
  var shape = evt.target;
  if (shape.getAttr('isRepeater')) {
    var clone = shape.clone();
    clone.to({
      duration: 0.1,
      scaleX: 1,
      scaleY: 1,
      shadowColor: 'rgba(0,0,0,0)'
    });
    displayLayer.add(clone);
    displayLayer.draw();
  }
})

dragLayer.on('dragend', function(evt) {
  var shape = evt.target;
  shape.moveTo(displayLayer);
  stage.draw();
});
