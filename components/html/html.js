// @fileoverview module components/html/html.js

export {
  addClassName,          // add a classname or list (as a string or array)
  appendFirst,           // append the element as the first child of the parent
  createAnchor,          // creates an anchor with an optional class and text
  createBreak,           // creates a <br>
  createCode,            // creates a <code> with an optional class and text
  createDiv,             // creates a div with an optional class and text
  createElement,         // creates an element (e.g. 'div', 'meta')
  createInput,           // creates a generic <input> node
  createFileOpener,      // creates input type=file with handler
  createImg,             // creates an image with an optional class and text
  createPre,             // creates a <pre> with an optional class and text
  createTextInput,       // creates an <input type="text"> node
  getElementById,        // get the html element by id
  getFirstElementByClassName, // find the 1st element with the given className
  getFirstElementByName, // find the 1st element with the given name
  htmlToText,            // strip out the html and return just the text
};


// add a classname or list of class names (string or array)
/*export*/ function addClassName(element, classNameOrList) {
  let newClassList = [];
  let tempClassList = [];
  if (typeof classNameOrList === 'string') {
    tempClassList = classNameOrList.split(',').join(' ');
    tempClassList = tempClassList.split(' ');
  } else if (Array.isArray(classNameOrList)) {
    tempClassList = classNameOrList;
  }

  // add in non-empty, non-blank classes
  for (let i = 0, count = tempClassList.length; i < count; ++i) {
    let className = tempClassList[i].trim();
    if (className && typeof className === 'string' && className.length > 0) {
      newClassList.push(className);
    }
  }

  if (newClassList.length > 0) {
    element.classList.add(...newClassList);
  }
}

/*export*/ function appendFirst(parent, element) {
  if (parent) {
    parent.insertBefore(element, parent.firstChild);
  }
}

/*export*/ function createAnchor(parent, opt_classNameOrList, ref, htmlString) {
  let element = createElement('a', parent, opt_classNameOrList);
  element.setAttribute('href', ref);
  if (htmlString) {
    element.innerHTML = htmlString;
  }
  return element;
}


/*export*/ function createBreak(parent) {
  return createElement('br', parent);
}


/*export*/ function createDiv(parent, opt_classNameOrList, htmlString) {
  let element = createElement('div', parent, opt_classNameOrList);
  if (htmlString) {
    element.innerHTML = htmlString;
  }
  return element;
}


/*export*/ function createElement(elementName, parent, opt_classNameOrList) {
  let element = document.createElement(elementName);
  addClassName(element, opt_classNameOrList);
  parent ? parent.appendChild(element) : null;
  return element;
}

/*export*/ function createFileOpener(paramObj) {
  let element = document.createElement('input');
  element.setAttribute('type', 'file');
  element.setAttribute('accept', paramObj.accept);
  element.addEventListener('change', paramObj.cb);
  element.style.display = 'none';
  return element;
}


/*export*/ function createImg(parent, classNameOrList, url){
  let element = createElement('img', parent, classNameOrList);
  element.src = url;
  return element;
}


/*export*/ function createInput(parent, opt_classNameOrList) {
  let element = createElement('input', parent, opt_classNameOrList);
  return element;
}


/*export*/ function createPre(parent, opt_classNameOrList, htmlString) {
  let element = createElement('pre', parent, opt_classNameOrList);
  if (htmlString) {
    element.innerHTML = htmlString;
  }
  return element;
}


/*export*/ function createTextInput(parent, opt_classNameOrList, text) {
  let element = createElement('input', parent, opt_classNameOrList);
  element.setAttribute('type', 'text');
  if (text) {
    element.setAttribute('value', text);
  }
  return element;
}


/*export*/ function createCode(parent, opt_classNameOrList, htmlString) {
  let element = createElement('code', parent, opt_classNameOrList);
  if (htmlString) {
    element.innerHTML = htmlString;
  }
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

/*export*/ function htmlToText(html){
//  html = html.replaceAll('<br>', '\n');
  html = html.replaceAll('<div>', '\n<div>');
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

/********************* private functions ******************************/
