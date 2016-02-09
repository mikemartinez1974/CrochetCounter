/**
 * Created by Mike on 2/8/2016.
 */

//<Exceptions>
function InvalidArgumentException(procedure, type, param, value) {
  this.message = "Invalid Argument Exception @ " + procedure + ".  " + param + " requires " + type + "(" + value + ")";
}

function NotImplementedException(procedure) {
  this.message = "Not Implemented Exception @ " + procedure;
}
//</Exceptions.


function checkHTML(html) {
  var doc = document.createElement('div');
  doc.innerHTML = html;
  return ( doc.innerHTML === html );
}
