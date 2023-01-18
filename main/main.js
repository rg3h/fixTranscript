/**
 * @fileoverview fixTranscript/main/main.js landing page code.
 */
import {createButton}           from '../components/button/button.js';
import {createToggleButton}     from '../components/button/toggleButton.js';
import {createHeader}           from '../components/header/header.js';
import {createAnchor,
        createDiv,
        createElement,
        createFileOpener,
        createImg,
        createPre,
        htmlToText}             from '../components/html/html.js';
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

  let anchor = createAnchor(left, '', 'https://github.com/rg3h/fixTranscript');
  createImg(anchor, 'mainImageLink', './assets/images/github.png');

  return header;
}


function createTheTextCard(parent) {
  // sadly we have to create an outer container so that the cursor pointer
  // changes correctly over the scrollbar due to an ancient bug in chrome

  let oc = createDiv(parent, 'mainTextCardOuterContainer');
  let container = createPre(oc, 'mainTextCardContainer', DEFAULT_MSG);
  container.setAttribute('contenteditable', true);
  // container.addEventListener('keydown', handleDropZoneKeyDown);
  // container.addEventListener('pointerdown', handleDropZonePointerDown);
  container.addEventListener('paste', handlePaste);
  // container.addEventListener('focusout', handleFocusOut);
  return container;
}


function handleAboutButton(e) {
  window.location.href = './about/index.html';
}


function handleLoadFile(e) {
  let fileList = e.target.files;
  const file = fileList[0]; // there should only be one file
  const reader = new FileReader();
  reader.onload = (e) => {
    textCard.innerHTML = e.target.result;
    buttonList.setProcessActive();
    // textCard.setAttribute('contenteditable', false);
  };

  reader.readAsText(file);
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
  // textCard.setAttribute('contenteditable', false);
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


function fixText(textIn, buttonList) {
  let text = textIn;

/*
  let lowercaseUrlsSet = buttonList.getLowercaseUrlsButton().isSet();
  if (lowercaseUrlsSet) {
    text = fixUrls(text);
  }
*/

  let capitalizeSet = buttonList.getCapitalizeButton().isSet();
  if (capitalizeSet) {
    text = fixCapitalization(text);
  }

  return text;
}


function fixCapitalization(textIn) {
  // capitalize the first nonwhitespace character in the whole text
  let firstCharPos = _findFirstNonWhiteSpace(textIn, 0);
  textIn = _replaceWithCapitalizedLetter(textIn, firstCharPos);

  const punctuationArray = ['.', '?', '!'];
  let wordList = [];
  let letterList = [];
  for (let i = 0; i < textIn.length; ++i) {
    let letter = textIn.charAt(i);
    if (punctuationArray.includes(letter) && i < textIn.length - 1) {
      let nextLetter = textIn.charAt(i+1);
      if (isWhiteSpace(nextLetter)) { // space after . we need to capitalize
        firstCharPos = _findFirstNonWhiteSpace(textIn, i+1);
        if (firstCharPos < 0) { // we ran to the end, so return
          return textIn;
        }
        textIn = _replaceWithCapitalizedLetter(textIn, firstCharPos);
        i = firstCharPos;
      }  // if nextLetter is a whitespace
    }  // if letter is a period
  } // for all the letters in textIn

  return textIn;
}


function _findFirstNonWhiteSpace(text, startPos) {
  let endPos = -1;
  for (let i=startPos, count=text.length; i<count; ++i) {
    let letter = text.charAt(i);
    if (!isWhiteSpace(letter)) {
      endPos = i;
      break;
    }
  }
  return endPos;
}

function isWhiteSpace(letter) {
  const whiteSpaceArray = [' ','\f','\n','\r','\t','\v'];
  return whiteSpaceArray.includes(letter);
}

function _replaceWithCapitalizedLetter(text, index) {
  if (index > text.length - 1) {
    return text;
  }

  let letter = text.charAt(index).toUpperCase();
  return text.substring(0, index) +
    '<div class=highlight>' + letter + '</div>' +
    text.substring(index + 1);
}


function fixUrls(textIn) {   // find urls and lower case them
  const whiteSpaceArray = [' ','\f','\n','\r','\t','\v'];
  let wordList = [];
  let letterList = [];
  for (let i = 0, letterCount = textIn.length; i < letterCount; ++i) {
    let letter = textIn.charAt(i);
    letterList.push(letter);
    if (whiteSpaceArray.includes(letter)) {
      let word = letterList.join('');
      console.log(word, i);
      let checkForUrl = word.split('.');
      if (checkForUrl.length === 3) {
        console.log('url', word);
        word = '<div class=highlight2>' + word.toLowerCase() + '</div>';
      }
      // console.log('word', word, letterList.length);
      wordList.push(word);
      letterList = [];
    }
  }

  return wordList.join('');
}


function createTheButtonList(parent) {
  let self, container,
      loadButton, processButton, saveButton, clipboardButton, clearButton,
      capitalizeButton, lowercaseUrlsButton;

  return init();

  function init() {
    let container = createDiv(parent, 'mainButtonListContainer');

    createButton(container, '', 'about', handleAboutButton);

    createDiv(container, 'mainButtonListGap');
    loadButton = createButton(container, '', 'load', _handleLoadFileButton);

    createDiv(container, 'mainButtonListGap');
    capitalizeButton = createToggleButton(container, '', 'capitalize',
                                          _handleCapitalizeButton, true);
    lowercaseUrlsButton = createToggleButton(container, '', 'lowercase urls',
                                             _handleLowercaseUrlsButton, true);
    processButton = createButton(container,'', 'process text',
                                 _handleProcessButton);

    createDiv(container, 'mainButtonListGap');
    saveButton = createButton(container, '', 'save', _handleSaveButton);
    clipboardButton = createButton(container, '', 'copy to clipboard',
                                   _handleClipboardButton);

    createDiv(container, 'mainButtonListGap');
    clearButton = createButton(container, '', 'clear', _handleClearButton);

    _disableAllButtons();

    return self = {
      getContainer,
      getCapitalizeButton,
      getLowercaseUrlsButton,
      setLoadActive,
      setProcessActive,
      setSaveActive,
    };
  }


  /*export*/ function getContainer() {
    return container;
  }


  /*export*/ function getCapitalizeButton() {
    return capitalizeButton;
  }


  /*export*/ function getLowercaseUrlsButton() {
    return lowercaseUrlsButton;
  }


  /*export*/ function setLoadActive() {
    _disableAllButtons();
    loadButton.enable();
    allowPasteFlag = true;
  }

  /*export*/ function setProcessActive() {
    _disableAllButtons();
    capitalizeButton.enable();
    lowercaseUrlsButton.enable();
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
  /*private*/ function _handleCapitalizeButton() {
    capitalizeButton.toggle();
  }


  /*private*/ function _handleLoadFileButton(e) {
  let fileEle = createFileOpener({accept:'text/*',
                                  multiple:false, cb:handleLoadFile});
    fileEle.click();  // click it for the user
  }


  /*private*/ function _handleLowercaseUrlsButton() {
    lowercaseUrlsButton.toggle();
  }


  /*private*/ function _handleProcessButton(e) {
    textCard.innerHTML = fixText(textCard.innerHTML, self);
    setSaveActive();
    // textCard.setAttribute('contenteditable', false);
  }


  /*private*/ async function _handleSaveButton(e) {
    let text = htmlToText(textCard.innerHTML);
    console.log('saving plain text', text);

    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
    a.download = 'results.txt';
    a.click();
  }


  /*private*/ async function _handleClipboardButton(e) {
    let text = htmlToText(textCard.innerHTML);
    // navigator.clipboard.writeText(text);
    try {
      await copyToClipboard(text);
    } catch(error) {
      alert('there was an error copying to the clipboard', error);
      return;
    }
    alert('Copied the text to the clipboard.');
  }


  /*private*/ function _handleClearButton(e) {
    textCard.innerHTML = DEFAULT_MSG;
    buttonList.setLoadActive();
    // textCard.setAttribute('contenteditable', true);
    setSelectionToEnd();
  }


  /*private*/ function _disableAllButtons() {
    allowPasteFlag = false;
    loadButton.disable();
    capitalizeButton.disable();
    lowercaseUrlsButton.disable();
    processButton.disable();
    saveButton.disable();
    clipboardButton.disable();
    clearButton.disable();
    return self;
  }
}
