/**
 * @fileoverview fixTranscript/main/main.js landing page code.
 */
import {createButton}           from '../components/button/button.js';
import {createHeader}           from '../components/header/header.js';
import {createDiv,
        createElement,
        createFileOpener,
        createImg,
        createPre,}             from '../components/html/html.js';
import {updateDateOnTheMinute}  from '../components/date/date.js';
import {getVersion}             from '../components/version/version.js';
import {SPACE_SYMBOL}           from '../components/symbols/symbols.js';


const DEFAULT_MSG = 'Use the load button or copy-paste your text here ';
let buttonList, textCard, allowPasteFlag;

window.addEventListener('load', main);
window.addEventListener('unload', function () {});  // break back button cache

async function main() {
  let parent = document.body;
  createTheHeader(parent);
  let mainContainer = createDiv(parent, 'mainContainer');

  buttonList = createTheButtonList(mainContainer);
  buttonList.setLoadActive();

  textCard = createTheTextCard(mainContainer);

  setSelectionToEnd();
}


function createTheHeader(parent) {
  let header = createHeader({parent:parent, date:'MMMM DTH, YYYY HH:NN AMPM'});
  let left = header.getLeftContainer();
  createDiv(left, 'mainHeaderTitle', 'fixTranscript');
  createDiv(left, 'mainHeaderVersion', getVersion());
  let underConstructionUrl = './assets/images/underConstruction28.png';
  createImg(left, 'mainHeaderStatusBadge', underConstructionUrl);

  return header;
}


function createTheTextCard(parent) {
  // sadly we have to create an outer container so that the cursor pointer
  // changes correctly over the scrollbar due to an ancient bug in chrome

  let oc = createDiv(parent, 'mainTextCardOuterContainer');
  let container = createPre(oc, 'mainTextCardContainer', DEFAULT_MSG);
  container.setAttribute('contenteditable', true);
  container.addEventListener('keydown', handleDropZoneKeyDown);
  // container.addEventListener('pointerdown', handleDropZonePointerDown);
  container.addEventListener('paste', handlePaste);
  // container.addEventListener('focusout', handleFocusOut);
  return container;
}


function handleAboutButton(e) {
  window.location.href = './about/index.html';
}


function handleClearButton(e) {
  textCard.innerHTML = DEFAULT_MSG;
  buttonList.setLoadActive();
  textCard.setAttribute('contenteditable', true);
  setSelectionToEnd();
}

function handleLoadFileButton(e) {
  let fileEle = createFileOpener({accept:'text/*',
                                  multiple:false, cb:handleLoadFile});
  fileEle.click();  // click it for the user
}


function handleLoadFile(e) {
  let fileList = e.target.files;
  const file = fileList[0]; // there should only be one file
  const reader = new FileReader();
  reader.onload = (e) => {
    textCard.innerHTML = e.target.result;
    buttonList.setProcessActive();
    textCard.setAttribute('contenteditable', false);
  };

  reader.readAsText(file);
}


function handleProcessTextButton(e) {
  textCard.innerHTML = fixText(textCard.innerHTML);
  buttonList.setSaveActive();
  textCard.setAttribute('contenteditable', false);
}


async function handleSaveButton(e) {
  let text = textCard.innerHTML;
  let a = document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
  a.download = 'results.txt';
  a.click();
}


async function handleClipboardButton(e) {
  let text = textCard.innerHTML;
  // navigator.clipboard.writeText(text);
  try {
    await copyToClipboard(text);
  } catch(error) {
    alert('there was an error copying to the clipboard', error);
    return;
  }
  alert('Copied the text to the clipboard.');
}


async function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (typeof navigator !== 'undefined' &&
        typeof navigator.clipboard !== 'undefined' &&
        navigator.permissions !== 'undefined') {
      const type = 'text/plain';
      const blob = new Blob([text], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      navigator.permissions.query({name: 'clipboard-write'})
        .then((permission) => {
          if (permission.state === 'granted' || permission.state === 'prompt') {
            navigator.clipboard.write(data).then(resolve, reject).catch(reject);
          }
          else {
            reject(new Error('Permission not granted!'));
          }
        });
    }
    else if (document.queryCommandSupported &&
             document.queryCommandSupported('copy')) {
      let textarea = document.createElement('textarea');
      textarea.textContent = text;
      textarea.style.position = 'fixed';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = 0;
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        resolve();
      }
      catch (e) {
        document.body.removeChild(textarea);
        reject(e);
      }
    }
    else {
      reject(new Error('clipboard methods note supported by this browser'));
    }
  });
}


function setSelectionToEnd() {
  textCard.focus();
  let selection = window.getSelection();
  let firstChild = textCard.firstChild;
  selection.collapse(firstChild, firstChild.length);  // end of the line
  // selection.modify('extend', 'forward', 'line');  // selects the entire line
}


function handleDropZonePointerDown(e) {
  // they clicked on the default msg so clear it
  if (textCard.innerHTML  === DEFAULT_MSG) {
    textCard.innerHTML = SPACE_SYMBOL;
    setSelectionToEnd();
  }
}


function handleDropZoneKeyDown(e) {
  e.preventDefault();  // prevent keys
  return false;
}


function handlePaste(e) {
  e.preventDefault();
  if (!allowPasteFlag) {
    return;
  }

  let text = (e.clipboardData || window.clipboardDats).getData('text');
  textCard.innerHTML = text;
  buttonList.setProcessActive();
  textCard.setAttribute('contenteditable', false);
}


function handleFocusOut(event) {
  // if focus is still in the element do nothing
  if (textCard.contains(event.relatedTarget)) {
    return;
  }

  // if the currentMsg is empty, then set it to the default message
  let text = textCard.innerHTML;
  if (!text || text.length < 1 || text === '&nbsp;') {
    textCard.innerHTML = DEFAULT_MSG;
    setSelectionToEnd();
  }
}


function fixText(textIn) {
  let text = textIn;
  // text = text.toUpperCase();
  text = fixCaptioning(text);
  return text;
}


function fixCaptioning(textIn) {
  const whiteSpaceArray = [' ','\f','\n','\r','\t','\v'];
  let strArray = textIn.split('.');
  for (let i = 0, count = strArray.length; i < count; ++i) {
    let str = strArray[i];
    let foundIndex = -1;
    for (let j = 0, jCount =str.length; j < jCount; ++j) {
      let letter = str.charAt(j);
      if (!whiteSpaceArray.includes(letter)) {
        foundIndex = j;
        break;
      }
    }
    if (foundIndex > -1) {
      strArray[i] =  str.substring(0, foundIndex) +
      str.charAt(foundIndex).toUpperCase() + str.slice(foundIndex+1);
    }
  }
  return strArray.join('.');
}


function createTheButtonList(parent) {
  let self, container,
      loadButton, processButton, saveButton, clipboardButton, clearButton;
  return init();

  function init() {
    let container = createDiv(parent, 'mainButtonListContainer');

    createButton(container, '', 'about', handleAboutButton);
    createDiv(container, 'mainButtonListGap');

    loadButton = createButton(container, '', 'load', handleLoadFileButton);

    processButton = createButton(container,'', 'process text',
                                 handleProcessTextButton);

    saveButton = createButton(container, '', 'save', handleSaveButton);
    clipboardButton = createButton(container, '', 'copy to clipboard',
                                   handleClipboardButton);

    createDiv(container, 'mainButtonListGap');
    clearButton = createButton(container, '', 'clear', handleClearButton);

    _disableAllButtons();

    return self = {
      getContainer,
      setLoadActive,
      setProcessActive,
      setSaveActive,
    };
  }

  /*export*/ function getContainer() {
    return container;
  }

  /*export*/ function setLoadActive() {
    _disableAllButtons();
    loadButton.enable();
    allowPasteFlag = true;
  }

  /*export*/ function setProcessActive() {
    _disableAllButtons();
    processButton.enable();
    clearButton.enable();
  }

  /*export*/ function setSaveActive() {
    _disableAllButtons();
    saveButton.enable();
    clipboardButton.enable();
    clearButton.enable();
  }


  /******************** private functions *****************************/
  /*private*/ function _disableAllButtons() {
    allowPasteFlag = false;
    loadButton.disable();
    processButton.disable();
    saveButton.disable();
    clipboardButton.disable();
    clearButton.disable();
    return self;
  }

  return container;
}
