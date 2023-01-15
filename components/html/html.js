// @fileoverview module components/html/html.js
//  locale = undefined but can be strings like 'en-US'

export {
  BOX_SYMBOL,
  CHECKED_BOX_SYMBOL,
  CHECK_SYMBOL,
  CHECK_THIN_SYMBOL,
  X_BOX_SYMBOL,
  X_SYMBOL,
  X_THIN_SYMBOL,
  createBreak,          // creates a <br>
  createDiv,            // creates a div with an optional class and text
  createElement,        // creates an element (e.g. 'div', 'meta')
  getElementById,       // get the html element by id
  getFirstElementByClassName,  // find the 1st element with the given className
  getFirstElementByName,       // find the 1st element with the given name
};

/*export*/ const BOX_SYMBOL          = '\u2610'; // none
/*export*/ const CHECKED_BOX_SYMBOL  = '\u2611'; // none
/*export*/ const CHECK_SYMBOL        = '\u2714'; // none
/*export*/ const CHECK_THIN_SYMBOL   = '\u2713'; // &check;
/*export*/ const X_BOX_SYMBOL        = '\u2612'; // none
/*export*/ const X_SYMBOL            = '\u2718'; // none
/*export*/ const X_THIN_SYMBOL       = '\u2717'; // &cross;

/*export*/ function createBreak (parent) {
  return createElement('br', parent);
}

/*export*/ function createDiv (parent, opt_classNameOrList, htmlString) {
  let element = createElement('div', parent, opt_classNameOrList);
  if (htmlString) {
    element.innerHTML = hmtlString;
  }
  return element;
}

/*export*/ function createElement(elementName, parent, opt_classNameOrList) {
  let element = document.createElement(elementName);
  addClassNameOrList(element, opt_classNameOrList);
  parent ? parent.appendChild(element) : null;
  return element;
}


/*export*/ function getElementById(id) {
  return document.getElementById(id);
}


/*export*/ function getFirstElementByClassName(className) {
  return document.getElementsByClassName(className)[0];
}


/*export*/ function getFirstElementByName(name) {
  return document.getElementsByName(name)[0];
}


/********************* private functions ******************************/
