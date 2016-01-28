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

    //create a new collection of buttons = boxcount param.
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
        var action = null;
        if(css === "none") {
          $image.css({display:"block"});
          action = "clicked"
        }
        else {
          $image.css({display:"none"});
          action = "unclicked";
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
  var imageFile = "transCheck.png";
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


