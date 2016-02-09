/**
 * Created by Mike on 1/29/2016.
 */

//A pattern document contains sections
//There are different kinds of sections.
//  Text
//  Materials
//  Guage
//  Instructions
//  Pattern

/**
 *
 * @constructor
 */
function PatternDocument() {
  var _html = '<div id="PatternDocument"></div>';
  Object.defineProperty(this, "html", {
    get: function() {
      return _html;
    },
    set: function(val) {
      if(checkHTML(val)) {
        _html = _val;
      }
      else {
        throw new InvalidArgumentException("BasicSection.html (set)","(string)HTML","value", val);
      }
    }
  });

  $("body").append(_html);
}

/**
 *
 * @constructor
 */
function BasicSection(id) {
  var _id = id;
  object.defineProperty(this, "id", {
    get: function(){
      return _id;
    }
  });

  var _headerText = "Section Header";
  Object.defineProperty(this, "headerText", {
    get:  function () {
            return _headerText;
          },
    set:  function (val) {
            if((val !== null) && (val !== undefined)) {
              _headerText = val;
            }
          }
  });

  var _text = "Additional Text";
  Object.defineProperty(this, "text", {
    get: function() {
      return _text;
    },
    set: function(val) {
      _text = val;
    }
  });

  var _html = '<div id="basicSection_' + _id + '"></div>';
  Object.defineProperty(this, "html", {
    get: function() {
      return _html;
    },
    set: function(val) {
      if(checkHTML(val)) {
        _html = _val;
      }
      else {
        throw new InvalidArgumentException("BasicSection.html (set)","(string)HTML","value", val);
      }
    }
  });
}

function PatternSection (id) {
  var _html = '<div id="patternSection_' + _id + '">' +
    ' <div id="counterBoxesControls_' + _id + '">' +
    '   <input id="inputBoxCount_' + _id + '" type="number" min="0" step="1">' +
    '   <button id="btnBoxCount_' + _id + '" type="button">Create</button>' +
    ' </div>' +
    ' <div id="counterBoxes_' + _id + '"></div>' +
    ' <hr>' +
    ' <div id="pb"_' + _id + '></div>' +
    '</div>';
  Object.defineProperty(this, "html",{
    get: function() {
      return _html;
    },
    set: function(val) {
      if(checkHTML(val)){
        _html = val;
      }
      else{
        throw new InvalidArgumentException("PatternSection.html","(string)HTML","value", val);
      }
    }
  });
}
PatternSection.prototype = new BasicSection();

/**
 *
 * @param labelText
 * @constructor
 */
function CounterBox(labelText) {
  var _labelText = labelText;
  Object.defineProperty(this, "labelText", {
    get: function(){
      return _labelText;
    },
    set: function(val){
      _labelText = val;
    }
  });

  var _fcolor = forecolor || "black";
  Object.defineProperty(this, "foreColor", {
    get: function(){
      return _fcolor
    },
    /**
     * A named color
     * @param val
     */
    set: function(val){
      if(Colors.isColorValid(val)){
        _fcolor = val;
      }
      else {
        throw new InvalidArgumentException("CounterBox.foreColor","(string)a Named Color","val",val);
      }
    }
  });

  var _bcolor = backcolor || "white";
  Object.defineProperty(this, "backColor", {
    get: function() {
      return _bcolor;
    },
    /**
     * A named color
     * @param val
     */
    set: function(val) {
      if(Colors.isColorValid(val)) {
        _bcolor = val;
      }
      else {
        throw new InvalidArgumentException("CounterBox.backColor","(string)a Named Color", "val",val);
      }
    }
  });

  Object.defineProperty(this,"html", {
     get: function () {
        var _labelDivStyle = "style='position:relative; width:100%; height:100%; text-align: center'";
        var _imageDivStyle = "style='position:relative; top:-30px; left:0; z-index:1; display:none;'";
        var _imageStyle = "style='height:25px; width:30px; margin: auto;'";
        var _boxStyle = "style='float:left; color:" + _fcolor + "; background-color: " + _bcolor + "; height: 25px; width: 30px; margin-top:2px; margin-left:2px; border: solid black 1px; padding-top:5px;'";
        var _imageMarkup = "<img id='image" + _labelText + "' src='images/transCheck.png' " + _imageStyle + ">";
        var _labeldiv = "<div id='label" + _labelText + "' " + _labelDivStyle + " >" + _labelText + "</div>";
        var _imagediv = "<div id='image" + _labelText + "' " + _imageDivStyle + " >" + _imageMarkup + "</div>";
        var _counterBoxMarkup = "<div id='box" + _labelText + "' " + _boxStyle + ">" + _labeldiv + _imagediv + "</div>";
        return _counterBoxMarkup;
     }
  });

  //return { index:_labelText, id: "box" + _labelText, markup: _counterBoxMarkup }
}

function CounterBoxFactory() {
  var _container = null;
  Object.defineProperty(this, "container", {
    get: function(){
      return _container;
    },
    set: function(val) {
      if(val instanceof BasicSection){
        _container = val;
      }
      else {
        throw new InvalidArgumentException("CounterBoxFactory.container","(object) instanceOf a section","value", val);
      }
    }
  });

  var _buttons = [];
  Object.defineProperty(this,"buttons",{
    get: function() {
      return _buttons;
    }
  });

  function createButtons (boxCount) {

    //empty the collection of buttons.
    _buttons = [];
    $("#" + _container.id).empty();

    //create a new collection of buttons === boxcount param.
    for(var i = 1; i<=boxCount; i++){
      _buttons[i] = counterBox(i);
    }

    //add each button to the docment.
    _buttons.forEach(function(counterbox) {
      $("#" + _container.id).append(counterbox.markup);

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
}






function GuageSection() {

}
GuageSection.prototype = new BasicSection();

function TextSection() {
  var _bodytext = "";
  Object.defineProperty(this, "bodyText", {
    get:  function() {
      return _bodytext;
    },
    set:  function(val) {
      if((val !== null) && (val !== undefined)) {
        _bodytext = val;
      }
    }
  })
}
TextSection.prototype = new BasicSection();

function MaterialsSection() {

}
MaterialsSection.prototype = new BasicSection();

function InstructionSection () {

}
InstructionSection.prototype = new BasicSection();
