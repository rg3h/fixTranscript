// @fileoverview module components/html/html.js
//  locale = undefined but can be strings like 'en-US'

export {
  getFirstElementByClassName,  // find the 1st element with the given className
  getFirstElementByName,       // find the 1st element with the given name
};


/*export*/ function getFirstElementByClassName(className) {
  return document.getElementsByClassName(className)[0];
}


/*export*/ function getFirstElementByName(name) {
  return document.getElementsByName(name)[0];
}


/********************* private functions ******************************/
