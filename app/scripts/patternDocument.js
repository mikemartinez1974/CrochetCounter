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
  var input = $("#txtSectionType")[0].value;
  //alert(input);
  if(input == "Text Section") {
    pdoc.addBasicSection();
  }else if (input == "Pattern Section") {
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
      '<form>' +
      ' <input type="text" list="sections" >' +
      ' <datalist id="sections">' +
      '   <option>Text Section</option>' +
      '   <option>Pattern Section</option>' +
      ' </datalist>' +
      ' <button id=btnCreateSection>Create</button>' +
      '</form>' +
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
        throw new InvalidArgumentException("BasicSection.html (set)","(string)HTML","value", val);
      }
    }
  });

  var _sections = [];
  Object.defineProperty(this, "sections", {
    get: function() {
      return _sections
    }
  });

  this.addBasicSection = function () {
    //throw new NotImplementedException("PatternDocument.addBasicSection()");
    var newSection = new BasicSection(this.sections.length);
    newSection.headerText = "A new basic section (" + this.sections.length + ")";
    newSection.text = "some text goes here.";
    _sections.push(newSection);
    $("#PatternDocument").append(newSection.html);
  };

  this.addPatternSection = function () {
    //throw new NotImplementedException("PatternDocument.addPatternSection()");
    var newSection = new PatternSection(this.sections.length);
    newSection.headerText = "A new pattern section";
    newSection.text = "some instructions go here.";
    _sections.push(newSection);
    newSection.render();
  };

  //$("body").append(_html);
}

/**
 *
 * @constructor
 */
function BasicSection(id) {
  var _id = id;
  Object.defineProperty(this, "id", {
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

  //var _html = '<div id="basicSection_' + _id + '"></div>';
  Object.defineProperty(this, "html", {
    get: function() {
      console.log(_headerText, _text);
      return '<div id="basicSection_' + _id + '"><h1>' + _headerText + '</h1><p>' + _text + '</p></div>';
      //return _html;
    }
    //,set: function(val) {
    //  if(checkHTML(val)) {
    //    _html = _val;
    //  }
    //  else {
    //    throw new InvalidArgumentException("BasicSection.html (set)","(string)HTML","value", val);
    //  }
    //}
  });
}

function PatternSection (id) {
  var _id = id;
  Object.defineProperty(this,"id",{
    get: function() {
      return this.patternDocument.id + "_patternSection" + _id;
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


  Object.defineProperty(this, "html",{
    get: function() {
      var _html = '<div id="' + this.id + '">' +
        ' <div id="' + this.id + '_counterBoxesControls">' +
        '   <input id="' + this.id + '_inputBoxCount" type="number" min="0" step="1">' +
        '   <button id="' + this.id + '_btnBoxCount" type="button">Create</button>' +
        ' </div>' +
        ' <div id="' + this.id + '_counterBoxes"></div>' +
        ' <hr>' +
        ' <div id="' + this.id + '_pb"></div></div>';
      return _html;
    }
    //,set: function(val) {
    //  if(checkHTML(val)){
    //    _html = val;
    //  }
    //  else{
    //    throw new InvalidArgumentException("PatternSection.html","(string)HTML","value", val);
    //  }
    //}
  });

  var _counterBoxFactory = new CounterBoxFactory();
  _counterBoxFactory.container = this;

  function btnBoxCount_Click(event){
    var sectionid = $("#" + this.id).parent().parent()[0].id;
    var $control = $("#" + sectionid + "_inputBoxCount")[0];
    var quantity = parseInt($control.value);
    _counterBoxFactory.createButtons(quantity);
    return false;
  }

  this.render = function() {
    $("#" + this.patternDocument.id).append(this.html);
    $("#" + this.id + "_btnBoxCount").on("click", btnBoxCount_Click);
  };

  //_render();
}
PatternSection.prototype = new BasicSection();

function CounterBoxFactory() {
  var that = this;

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

    //empty the collection of buttons.
    _buttons = [];
    var $sectionContainer = $("#" + _container.id + "_counterBoxes");
    $sectionContainer.empty();
    _pb = new ProgressBar.Line("#" + $sectionContainer.parent()[0].id + "_pb",{color:'#f00', strokeWidth: 5});

    //create a new collection of buttons === boxcount param.
    for(var i = 1; i<=boxCount; i++){
      _buttons[i] = new CounterBox(i);
      _buttons[i].factory = that;
    }

    //add each button to the document.

    _buttons.forEach(function(counterbox) {
      $sectionContainer.append(counterbox.html);
      //counterbox.on("click", counterbox, counterbox.click);
      console.log(counterbox.id);
      console.log(counterbox.html);
      $("#" + counterbox.id).on("click", counterbox, counterbox.click);

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
  var that = this;

  Object.defineProperty(this,"id", {
    get: function() {
      return that.factory.id + "_box" + that.labelText;
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
      var _boxStyle = "style='float:left; color:" + _fcolor + "; background-color: " + _bcolor + "; height: 25px; width: 30px; margin-top:2px; margin-left:2px; border: solid black 1px; padding-top:5px;'";
      var _imageMarkup = "<img id='image" + _labelText + "' src='images/transCheck.png' " + _imageStyle + ">";
      var _labeldiv = "<div id='label" + _labelText + "' " + _labelDivStyle + " >" + _labelText + "</div>";
      var _imagediv = "<div id='image" + _labelText + "' " + _imageDivStyle + " >" + _imageMarkup + "</div>";
      var _counterBoxMarkup = "<div id='" + this.id + "' " + _boxStyle + ">" + _labeldiv + _imagediv + "</div>";
      return _counterBoxMarkup;
    }
  });

  Object.defineProperty(this, "index", {
    get: function() {
      return that.factory.buttons.indexOf(this);
    }
  });

  this.factory = null;

  this.click = function (event) {
    //event.stopPropagation();
    //event.preventDefault();
    console.log(event);
    console.log(event.data);
    var $image = $("#image" + that.factory.buttons.indexOf(that));
    var css = $image.css("display");
    //var action = null;
    if (css === "none") {
      $image.css({display: "block"});
      //action = "clicked"
    }
    else {
      $image.css({display: "none"});
      //action = "unclicked";
    }

    that.factory.buttons.forEach(function (button) {

      if (button.index < that.index) {
        $("#image" + button.index).css("display", "block");
      }
      else if (button.index > that.index) {
        $("#image" + button.index).css("display", "none");
      }

    });

    that.factory.progressBar.animate((event.data.index -1) / that.factory.buttons.length);

    //return { index:_labelText, id: "box" + _labelText, markup: _counterBoxMarkup }
  }
}










//function GuageSection() {
//
//}
//GuageSection.prototype = new BasicSection();
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
//TextSection.prototype = new BasicSection();
//
//function MaterialsSection() {
//
//}
//MaterialsSection.prototype = new BasicSection();
//
//function InstructionSection () {
//
//}
//InstructionSection.prototype = new BasicSection();
