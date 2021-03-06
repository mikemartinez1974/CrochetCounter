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
 * @type {PatternDocument}
 */
var pdoc = new PatternDocument();

/**
 *
 * @constructor
 */
function PatternDocument() {
  /**
   *
   * @type {string}
   * @private
   */
  var _id = "PatternDocument";
  Object.defineProperty(this,"id",{
    get: function() { return _id }
  });

  var _sections = [];
  Object.defineProperty(this, "sections", {
    get: function() {
      return _sections
    }
  });

  var _buttons = [];
  Object.defineProperty(this, "buttons", {
    get: function() {
      return _buttons;
    }
  });

  this.addTextSection = function () {
    var newSection = new TextSection();
    newSection.headerText = "A new text section (" + this.sections.length + ")";
    newSection.text = "some text goes here.";
    newSection.index = _sections.push(newSection) - 1;
    //$("#PatternDocument").append(newSection.html);
    newSection.render();
  };

  this.addPatternSection = function () {
    var newSection = new PatternSection();
    newSection.headerText = "A new pattern section (" + this.sections.length + ")";
    newSection.text = "some instructions go here.";
    newSection.index = _sections.push(newSection) - 1;
    newSection.render();
  };

  this.render = function() {
    var markup = markupGenerator();
    $("body").append(markup);
    $("#btnCreateSection").on("click", btnCreateSection_click);
  };

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

  this.render();
}

/** TextSection
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
        _html = '<div id="' + this.id + '" style="border: solid lightgray 1px; width:100%;">' +
        '     <h3> ' +
        '       <span contenteditable="true">' + this.headerText + '</span>' +
        '       <button id="copy"><span class="ui-icon ui-icon-newwin"></span></button><button id="min"><span class="ui-icon ui-icon-minus"></span></button><button id="close"><span class="ui-icon ui-icon-close"></span></button>' +
        '     </h3>' +
        '   <p contenteditable="true">' + this.text + '</p>' +
        ' </div>';
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
    //$("#" + thisSection.patternDocument.id).append(thisSection.html);
    var markup = markupGenerator(thisSection);
    $("#PatternDocument").append(markup);
    $("#" + thisSection.id).accordion({animate:200, collapsible:true, heightStyle:"content"});
  }
}

/**
 *
 * @constructor
 */
function PatternSection () {
  var thisSection = this;

  Object.defineProperty(this, "id",{
    get: function() {
      return "Pattern_" + this.index;
    }
  });

  var _counterBoxFactory = new CounterBoxFactory();
  _counterBoxFactory.container = thisSection;
  Object.defineProperty(this, "buttonFactory", {
    get: function() { return _counterBoxFactory }
  });

  function btnBoxCount_Click(event){
    var $inputQuantity = $("#" + event.target.parentElement.id + " > #inputBoxCount")[0];
    var quantity = parseInt($inputQuantity.value);
    thisSection.buttonFactory.createButtons(quantity,event);
    return false;
  }

  this.render = function() {
    var markup = markupGenerator(thisSection);
    $("#PatternDocument").append(markup);
    $("#" + thisSection.id).accordion({animate:200, collapsible:true, heightStyle:"content"});
    $("#" + thisSection.id + " #btnBoxCount").on("click", btnBoxCount_Click);
  };
}
PatternSection.prototype = new TextSection();

/**
 *
 * @constructor
 */
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

  this.createButtons = function (quantity,event) {
    console.log(this);
    //empty the collection of buttons.
    _buttons = [];
    var parentElementId = event.target.parentElement.id;
    var $buttonContainer = $("#" + parentElementId + " #counterBoxes");
    $buttonContainer.empty();
    var $pbContainer  = $("#" + parentElementId + " #pb");
    $pbContainer.empty();
    _pb = new ProgressBar.Line("#" + parentElementId + " #pb",{color:'#f00', strokeWidth: 1});


    //create a new collection of buttons === boxcount param.
    for(var i = 1; i<=quantity; i++){
      _buttons[i] = new CounterBox(i);
      _buttons[i].index = i;
      _buttons[i].factory = thisFactory;
      var bindex = pdoc.buttons.push(_buttons[i]);
      _buttons[i].text = bindex;
    }

    //add each button to the document.
    _buttons.forEach(function(counterbox) {
      $buttonContainer.append(counterbox.html);
      var selector = "#" + event.target.parentElement.id + " > #counterBoxes > #" + counterbox.id;
      $(selector).on("click", counterbox, counterbox.click);
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
function CounterBox(text,forecolor,backcolor) {
  var thisCounterBox = this;

  Object.defineProperty(this,"id", {
       get: function() {
       return "box_" + thisCounterBox.index;
    }
  });

  var _text = text;
  Object.defineProperty(this, "text", {
    get: function () {
      return _text;
    },
    set: function (val) {
      _text = val;
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
      //var _boxStyle = "style='float:left; color:" + thisCounterBox.foreColor + "; background-color: " + thisCounterBox.backColor + "; height: 25px; width: 30px; margin-top:2px; margin-left:2px; border: solid black 1px; padding-top:5px;'";
      var _boxStyle = "style='color:" + thisCounterBox.foreColor + "; background-color: " + thisCounterBox.backColor + "; height: 25px; width: 30px; margin-top:2px; margin-left:2px; border: solid black 1px; padding-top:5px;'";
      var _imageMarkup = "<img id='" + thisCounterBox.getImageId() + "' src='images/transCheck.png' " + _imageStyle + ">";
      var _labeldiv = "<div id='labelDiv' " + _labelDivStyle + " >" + _text + "</div>";
      var _imagediv = "<div id='imageDiv' " + _imageDivStyle + " >" + _imageMarkup + "</div>";
      var _inputA = "<div style='float:left;'>";
      var _inputB = "<input type='text' style='margin-left: 3px; width:26px;font-size:.5em'></div>";
      var _counterBoxMarkup = _inputA + "<div id='" + thisCounterBox.id + "' " + _boxStyle + ">" + _labeldiv + _imagediv + "</div>" + _inputB;
      //var _counterBoxMarkup = "<div id='" + thisCounterBox.id + "' " + _boxStyle + ">" + _labeldiv + _imagediv + "</div>";
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

  //this.getImageDivId = function() {
  //  return thisCounterBox.id + "_imageDiv"
  //};

  this.click = function (event) {
    //todo: if later I want to update the objects, make sure to do it in counterbox.click.
    var currentSectionId = $(this).parent().parent().parent()[0].id;
    var sectionIndex = currentSectionId.split("_")[1];
    var $thisButton = $("#" + currentSectionId + " #" + $(this)[0].id);
    var $imageDiv = $("#" + currentSectionId + " #" + $(this)[0].id + " #imageDiv");
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

    var clickedIndex = parseInt($thisButton[0].id.split("_")[1]);
    var sibIndex = null, $sibImageDiv = null, sibCss = null;
    var $siblingButtons = $thisButton.parent().children().not("[id='" + $thisButton[0].id + "']");
    $siblingButtons.each(function(index,element){
      sibIndex = parseInt(element.id.split("_")[1]);
      $sibImageDiv = $(element).children().last();
      sibCss = $sibImageDiv.css("display");
      if(clickedIndex > sibIndex) {
        $sibImageDiv.css("display","block");
      }
      else if(sibIndex > clickedIndex) {
        $sibImageDiv.css("display","none");
      }
    });

    var section = pdoc.sections[sectionIndex];
    section.buttonFactory.progressBar.animate((event.data.index -1) / thisCounterBox.factory.buttons.length);

    return false;
  }
}

/**
 *
 * @constructor
 */
function markupGenerator(section) {
  var markup;

  var outerHTML = '<div id="PatternDocument">' +
    ' <h1 contenteditable="true">Pattern Title</h1>' +
    '   <select id="selSectionType">' +
    '     <option>Text Section</option>' +
    '     <option>Pattern Section</option>'+
    '   </select>' +
    ' <button id="btnCreateSection">Create New Section</button>' +
    '</div>';

  if(section === undefined) {
    markup = outerHTML;
    return markup;
  }

  var textHTML = '<div id="' + section.id + '">' +
    ' <h3> ' +
    '   <span contenteditable="true">' + section.headerText + '</span>' +
    '   <button id="copy"><span class="ui-icon ui-icon-newwin"></span></button><button id="min"><span class="ui-icon ui-icon-minus"></span></button><button id="close"><span class="ui-icon ui-icon-close"></span></button>' +
    ' </h3>' +
    ' <div>' +
    '   <p contenteditable="true">' + section.text + '</p>';

  var patternHTML = ' <input id="inputBoxCount" type="number" min="0" step="1">' +
    ' <button id="btnBoxCount" type="button">Create<span class="ui-icon ui-icon-check"></span></button>' +
    ' <div id="counterBoxes"></div>' +
    ' <div id="pb"></div>';

  var closingTag ="</div></div>";

  if(section instanceof PatternSection) {
    markup = textHTML + patternHTML + closingTag;
  }
  else if (section instanceof TextSection) {
    markup = textHTML + closingTag;
  }
  else {
    markup = outerHTML;
  }

  return markup;

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
