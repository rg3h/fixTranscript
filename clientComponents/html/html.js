// @fileoverview module clientComponents/html/html.js
//  locale = undefined but can be strings like 'en-US'

export {
  getFirstElementByClassName,  // find the 1st element with the given className
};

/*export*/ function getFirstElementByClassName(className) {
  return document.getElementsByClassName(className)[0];
}

/********************* private functions ******************************/
