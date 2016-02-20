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

var pdoc = new PatternDocument();

function btnCreateSection_click() {
  var $sectionSelector = $("#selSectionType")[0];
  var input = $sectionSelector.options[$sectionSelector.selectedIndex].value;
  //alert(input);
  if(input === "Text Section") {
    pdoc.addTextSection();
  }else if (input === "Pattern Section") {
    pdoc.addPatternSection();
  }
  else {
    alert("Invalid Section Type.");
  }

  return false;
}

/**
 *
 * @constructor
 */
function PatternDocument() {
  var _id = "PatternDocument";
  Object.defineProperty(this,"id",{
    get: function() { return _id }
  });

  var _html = '<div id="PatternDocument">' +
      ' <input type="text" list="sections" >' +
      ' <datalist id="sections">' +
      '   <option>Text Section</option>' +
      '   <option>Pattern Section</option>' +
      ' </datalist>' +
      ' <button id=btnCreateSection>Create New Section</button>' +
      '</div>';
  Object.defineProperty(this, "html", {
    get: function() {
      return _html;
    },
    set: function(val) {
      if(checkHTML(val)) {
        _html = _val;
      }
      else {
        throw new InvalidArgumentException("TextSection.html (set)","(string)HTML","value", val);
      }
    }
  });

  var _sections = [];
  Object.defineProperty(this, "sections", {
    get: function() {
      return _sections
    }
  });

  this.addTextSection = function () {
    var newSection = new TextSection(this.sections.length);
    newSection.headerText = "A new text section (" + this.sections.length + ")";
    newSection.text = "some text goes here.";
    newSection.index = _sections.push(newSection) - 1;
    $("#PatternDocument").append(newSection.html);
  };

  this.addPatternSection = function () {
    var newSection = new PatternSection(this.sections.length);
    newSection.headerText = "A new pattern section (" + this.sections.length + ")";
    newSection.text = "some instructions go here.";
    newSection.index = _sections.push(newSection) - 1;
    newSection.render();
  };

  //$("body").append(_html);
}

/**
 *
 * @constructor
 */
function TextSection() {
  var thisSection = this;

  Object.defineProperty(this, "id", {
    get: function(){
      return "TextSection_" + this.index;
    }
  });

  var _document = pdoc;
  Object.defineProperty(this,"patternDocument", {
    get: function() {
      return _document;
    },
    set: function(val) {
      if(val instanceof PatternDocument) {
        _document = val;
      }
      else {
        throw new InvalidArgumentException("PatternSection.patternDocument","(object)PatternDocument","value",val);
      }
    }
  });

  var _index = null;
  Object.defineProperty(this,"index", {
    get: function() { return _index },
    set: function(val) { _index = val; }
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

  var _html = null;
  Object.defineProperty(this, "html", {
    get: function() {
      if(_html === null) {
        _html = '<div id="' + this.id + '"><h1 contenteditable="true">' + this.headerText + '</h1><p contenteditable="true">' + this.text + '</p></div>';
      }
      return _html
    }
    ,set: function(val) {
      if(checkHTML(val)) {
        _html = _val;
      }
      else {
        throw new InvalidArgumentException("TextSection.html (set)","(string)HTML","value", val);
      }
    }
  });

  this.render = function() {
    $("#" + this.patternDocument.id).append(this.html);
  }
}

function PatternSection () {
  var thisSection = this;

  Object.defineProperty(this, "id",{
    get: function() {
      return "Pattern_" + this.index;
    }
  });

  Object.defineProperty(this, "html",{
    get: function() {
      var _html = '<div id="' + this.id + '">' +
        ' <h1 contenteditable="true">' + this.headerText + '</h1>' +
        ' <p contentEditable="true">' + this.text + '</p>'+
        ' <input id="inputBoxCount" type="number" min="0" step="1">' +
        ' <button id="btnBoxCount" type="button">Create</button>' +
        ' <div id="counterBoxes"></div>' +
        ' <div id="pb"></div></div>';
      return _html;
    }
  });

  var _counterBoxFactory = new CounterBoxFactory();
  _counterBoxFactory.container = this;
  Object.defineProperty(this, "buttonFactory", {
    get: function() { return _counterBoxFactory }
  });

  function btnBoxCount_Click(event){
    var $inputQuantity = $("#" + thisSection.id + " > #inputBoxCount")[0];
    var quantity = parseInt($inputQuantity.value);
    thisSection.buttonFactory.createButtons(quantity);
    return false;
  }

  this.render = function() {
    $("#" + thisSection.patternDocument.id).append(thisSection.html);
    $("#" + thisSection.id + " > #btnBoxCount").on("click", btnBoxCount_Click);
  };

}
PatternSection.prototype = new TextSection();

function CounterBoxFactory() {
  var thisFactory = this;

  Object.defineProperty(this,"id",{
    get: function() {
      return this.container.id + "_factory";
    }
  });

  var _container = null;
  Object.defineProperty(this, "container", {
    get: function(){
      return _container;
    },
    set: function(val) {
      if(val instanceof TextSection){
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

  var _pb = null;
  Object.defineProperty(this,"progressBar", {
    get: function() {
      return _pb;
    },
    set: function(val) {
      _pb = val;
    }
  });

  this.createButtons = function (boxCount) {
    console.log(this);
    //empty the collection of buttons.
    _buttons = [];
    var $buttonContainer = $("#" + _container.id + " > #counterBoxes");
    $buttonContainer.empty();
    _pb = new ProgressBar.Line("#" + _container.id + " > #pb",{color:'#f00', strokeWidth: 1});

    //create a new collection of buttons === boxcount param.
    for(var i = 1; i<=boxCount; i++){
      _buttons[i] = new CounterBox(i);
      _buttons[i].factory = thisFactory;
    }

    //add each button to the document.

    _buttons.forEach(function(counterbox) {
      $buttonContainer.append(counterbox.html);
      $("#" + counterbox.id).on("click", counterbox, counterbox.click);
      console.log(counterbox.id, counterbox);
    });
  }
}

/**
 *
 * @param labelText
 * @param forecolor
 * @param backcolor
 * @constructor
 */
function CounterBox(labelText,forecolor,backcolor) {
  var thisCounterBox = this;

  Object.defineProperty(this,"id", {
    get: function() {
      return thisCounterBox.factory.container.id + "_box_" + thisCounterBox.labelText;
    }
  });

  var _labelText = labelText;
  Object.defineProperty(this, "labelText", {
    get: function () {
      return _labelText;
    },
    set: function (val) {
      _labelText = val;
    }
  });

  var _fcolor = forecolor || "black";
  Object.defineProperty(this, "foreColor", {
    get: function () {
      return _fcolor
    },
    /**
     * A named color
     * @param val
     */
    set: function (val) {
      if (Colors.isColorValid(val)) {
        _fcolor = val;
      }
      else {
        throw new InvalidArgumentException("CounterBox.foreColor", "(string)a Named Color", "val", val);
      }
    }
  });

  var _bcolor = backcolor || "white";
  Object.defineProperty(this, "backColor", {
    get: function () {
      return _bcolor;
    },
    /**
     * A named color
     * @param val
     */
    set: function (val) {
      if (Colors.isColorValid(val)) {
        _bcolor = val;
      }
      else {
        throw new InvalidArgumentException("CounterBox.backColor", "(string)a Named Color", "val", val);
      }
    }
  });

  Object.defineProperty(this, "html", {
    get: function () {
      var _labelDivStyle = "style='position:relative; width:100%; height:100%; text-align: center'";
      var _imageDivStyle = "style='position:relative; top:-30px; left:0; z-index:1; display:none;'";
      var _imageStyle = "style='height:25px; width:30px; margin: auto;'";
      var _boxStyle = "style='float:left; color:" + thisCounterBox.foreColor + "; background-color: " + thisCounterBox.backColor + "; height: 25px; width: 30px; margin-top:2px; margin-left:2px; border: solid black 1px; padding-top:5px;'";
      var _imageMarkup = "<img id='" + thisCounterBox.getImageId() + "' src='images/transCheck.png' " + _imageStyle + ">";
      var _labeldiv = "<div id='" + thisCounterBox.getLabelId() + "' " + _labelDivStyle + " >" + _labelText + "</div>";
      var _imagediv = "<div id='" + thisCounterBox.getImageDivId() + "' " + _imageDivStyle + " >" + _imageMarkup + "</div>";
      var _counterBoxMarkup = "<div id='" + thisCounterBox.id + "' " + _boxStyle + ">" + _labeldiv + _imagediv + "</div>";
      return _counterBoxMarkup;
    }
  });

  Object.defineProperty(this, "index", {
    get: function() {
      return thisCounterBox.factory.buttons.indexOf(this)
    }
  });

  this.factory = null;

  this.getLabelId = function() {
    return thisCounterBox.id + "_label" + thisCounterBox.labelText
  };

  this.getImageId = function() {
    return thisCounterBox.id + "_image"
  };

  this.getImageDivId = function() {
    return thisCounterBox.id + "_imageDiv"
  };

  this.click = function (event) {
    //var thisButton = event.data;
    console.log(event);
    event.stopPropagation();
    event.preventDefault();
    var $imageDiv = $("#" + thisCounterBox.getImageDivId());
    var css = $imageDiv.css("display");
    //var action = null;
    if (css === "none") {
      $imageDiv.css({display: "block"});
      //action = "clicked"
    }
    else {
      $imageDiv.css({display: "none"});
      //action = "unclicked";
    }

    thisCounterBox.factory.buttons.forEach(function (otherButton) {

      if (otherButton.index < thisCounterBox.index) {
        $("#" + otherButton.getImageDivId()).css("display", "block");
      }
      else if (otherButton.index > thisCounterBox.index) {
        $("#" + otherButton.getImageDivId()).css("display", "none");
      }

    });

    thisCounterBox.factory.progressBar.animate((event.data.index -1) / thisCounterBox.factory.buttons.length);

    //return { index:_labelText, id: "box" + _labelText, markup: _counterBoxMarkup }
  }
}










//function GuageSection() {
//
//}
//GuageSection.prototype = new TextSection();
//
//function TextSection() {
//  var _bodytext = "";
//  Object.defineProperty(this, "bodyText", {
//    get:  function() {
//      return _bodytext;
//    },
//    set:  function(val) {
//      if((val !== null) && (val !== undefined)) {
//        _bodytext = val;
//      }
//    }
//  })
//}
//TextSection.prototype = new TextSection();
//
//function MaterialsSection() {
//
//}
//MaterialsSection.prototype = new TextSection();
//
//function InstructionSection () {
//
//}
//InstructionSection.prototype = new TextSection();
