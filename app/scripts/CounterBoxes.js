/**
 * Created by Mike on 1/23/2016.
 */

var $btnCreate = $("#btnBoxCount");
var $container = $("#counterBoxes");
var $inputBoxCount = $("#inputBoxCount");
var pb = new ProgressBar.Line("#pb",{color:'#f00', strokeWidth: 5});

var counterBoxFactory = {
  buttons : [],
  createButtons : function (boxCount) {

    //empty the collection of buttons.
    this.buttons = [];
    $container.empty();

    //create a new collection of buttons === boxcount param.
    for(var i = 1; i<=boxCount; i++){
      this.buttons[i] = counterBox(i);
    }

    //add each button to the docment.
    this.buttons.forEach(function(counterbox) {
      $container.append(counterbox.markup);

      //attach a click event to each button.
      $("#box" + counterbox.index).on("click", counterbox, function() {
        var $image = $("#image" + counterbox.index);
        var css = $image.css("display");
        //var action = null;
        if(css === "none") {
          $image.css({display:"block"});
          //action = "clicked"
        }
        else {
          $image.css({display:"none"});
          //action = "unclicked";
        }

        counterBoxFactory.buttons.forEach(function(button){

          if(button.index < counterbox.index) {
            $("#image" + button.index).css("display", "block");
          }
          else if (button.index > counterbox.index) {
            $("#image" + button.index).css("display","none");
          }

        });

        pb.animate(counterbox.index / counterBoxFactory.buttons.length);
      })
    });
  }
};

function counterBox(labelText, forecolor, backcolor) {
  var fcolor = forecolor || "black";
  var bcolor = backcolor || "white";

  var labelDivStyle = "style='position:relative; width:100%; height:100%; text-align: center'";
  var imageDivStyle = "style='position:relative; top:-30px; left:0; z-index:1; display:none;'";
  var imageStyle = "style='height:25px; width:30px; margin: auto;'";
  var boxStyle = "style='float:left; color:" + fcolor + "; background-color: " + bcolor + "; height: 25px; width: 30px; margin-top:2px; margin-left:2px; border: solid black 1px; padding-top:5px;'";

  var imageMarkup = "<img id='image" + labelText + "' src='images/transCheck.png' " + imageStyle + ">";
  var labeldiv = "<div id='label" + labelText + "' " + labelDivStyle + " >" + labelText + "</div>";
  var imagediv = "<div id='image" + labelText + "' " + imageDivStyle + " >" + imageMarkup + "</div>";
  var counterBoxMarkup = "<div id='box"   + labelText + "' " + boxStyle + ">" + labeldiv + imagediv + "</div>";

  return { index:labelText, id: "box" + labelText, markup: counterBoxMarkup }
}

$btnCreate.on("click", function(event){
  var quantity = $inputBoxCount[0].value;
  createCounterButtons(quantity);
});

function createCounterButtons(quantity) {
  var aNumberWasEntered = !isNaN(parseInt(quantity));

  if(aNumberWasEntered) {
    counterBoxFactory.createButtons(quantity);
  }
}

function CounterButton() {
  var _container = null;
  Object.defineProperty(this, "container", {
    get:  function() {
            return _container;
          },
    set:  function(val) {
            if(val instanceof jQuery) {
              _container = val;
            } else {
              throw new InvalidArgumentException("CounterButton.container", "jquery", "val", val);
            }
          }
  });

  var _index = null;
  Object.defineProperty(this, "index",{
    get:  function() {
            return _index;
          },
    set:  function(val) {
            if(isNumeric(val)) {
              _index = parseInt(val.toString());
            } else {
              throw new InvalidArgumentException("CounterButton.index", "number", "val", val);
            }
          }
  });

  var _imageid = null;
  Object.defineProperty(this, "imageId", {
    get:  function() {
            if(_imageid === null) {
              _imageid = "image" + this.index;
            }
            return _imageid;
          }
  });

  var _imagesource = "images/transCheck.png";
  Object.defineProperty(this, "imageSource", {
    get:  function() {
            return _imagesource;
          },
    set:  function(val) {
            if(val == false) {throw new InvalidArgumentException("CounterBox.imageSource","url or path","val",val);}
            _imagesource = val;
          }
  });

  var _image = null;
  Object.defineProperty(this, "image", {
    get:  function() {
            if(!_image) {
              _image = $("#" + this.imageId);
            }
          }
  });

  var _bgcolor = "white";
  Object.defineProperty(this, "bgColor", {
    get:  function() {
            return _bgcolor;
          },
    set:  function(val) {
            if($c.isColorValid(val))
            {
              _bgcolor = val;
            } else {
              throw new InvalidArgumentException("CounterBox.bgColor","color", "val", val);
            }
          }
  });

  var _fcolor = "black";
  Object.defineProperty(this, "foreColor", {
    get:  function() {
            return _fcolor;
          },
    set:  function(val) {
            if($c.isColorValid(val)) {
              _fcolor = val;
            } else {
              throw new InvalidArgumentException("CounterBox.foreColor", "color", "val", val);
            }
          }
  });

  var _checked = false;
  Object.defineProperty(this, "checked", {
    get:  function () {
      return _checked;
    },
    set:  function (val) {
            var acceptableValues = ["checked","1","true","unchecked","0","false"];
            switch(acceptableValues.indexOf(val.toString().toLowerCase())) {
              case 0:
              case 1:
              case 2:
                    _checked = true;
                    break;
              case 3:
              case 4:
              case 5:
                    _checked = false;
                    break;
              default:
                    throw new InvalidArgumentException("CounterBox.checked","one of " + acceptableValues.toString(), "val", val);
            }
            this.image.css({display: _checked ? "block" : "none" });
          }
  });

  Object.defineProperty(this, "html", {
    get:  function () {

            var labelDivStyle = "style='position:relative; width:100%; height:100%; text-align: center'";
            var imageDivStyle = "style='position:relative; top:-30px; left:0; z-index:1; display:none;'";
            var imageStyle = "style='height:25px; width:30px; margin: auto;'";
            var boxStyle = "style='float:left; color:" + this.foreColor + "; background-color: " + this.bgColor + "; height: 25px; width: 30px; margin-top:2px; margin-left:2px; border: solid black 1px; padding-top:5px;'";

            var imageMarkup = "<img id='_" + this.imageId + "' src='" + this.imageSource + "' " + imageStyle + ">";
            var labelDiv = "<div id='label" + this.text + "' " + labelDivStyle + " >" + this.text + "</div>";
            var imageDiv = "<div id='" + this.imageId + "' " + imageDivStyle + " >" + imageMarkup + "</div>";
            var counterBoxMarkup = "<div id='box"   + this.text + "' " + boxStyle + ">" + labelDiv + imageDiv + "</div>";

            return counterBoxMarkup;
          }
  });

  var _selector = null;
  Object.defineProperty(this, "selector", {
    get:  function () {
            if(!(_selector instanceof jQuery)) {
              _selector = $("#box" + this.id);
            }

            return _selector;
          }
  });

  this.render = function () {
    this.container.append(this.html);
    this.selector.on("click", this, CounterButton_Click);
  };

  function CounterBoxes_Click(e, sender) {
    this.checked = !this.checked;
  }

}


//Exceptions
function InvalidArgumentException(procedure, type, param, value) {
  this.message = "Invalid Argument Exception @ " + procedure + ".  " + param + " requires " + type + "(" + value + ")";
}

function NotImplementedException(procedure) {
  this.message = "Not Implemented Exception @ " + procedure;
}
