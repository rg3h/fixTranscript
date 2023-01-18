/**
 * @fileoverview fixTranscript/main/main.js landing page code.
 */
import {createButton}           from '../components/button/button.js';
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


const DEFAULT_MSG = 'Use the load file button or paste your text here ';
let textCard, loadButton, capitalizeButton, saveButton,
    clipboardButton, clearButton;


window.addEventListener('load', main);
window.addEventListener('unload', function () {});  // break back button cache

async function main() {
  let parent = document.body;
  createTheHeader(parent);
  let mainContainer = createDiv(parent, 'mainContainer');

  createTheButtonList(mainContainer);
  setLoadActive();

  textCard = createTheTextCard(mainContainer);
  setSelectionToEnd();
}


function createTheHeader(parent) {
  let header = createHeader({parent:parent, date:'MMMM DTH, YYYY HH:NN AMPM'});
  let left = header.getLeftContainer();
  createDiv(left, 'mainHeaderTitle', 'fixTranscript');
  createDiv(left, 'mainHeaderVersion', getVersion());

  createButton(left, 'mainAboutButton', 'about', handleAboutButton);

  let anchor = createAnchor(left, '', 'https://github.com/rg3h/fixTranscript');
  createImg(anchor, 'mainImageLink', './assets/images/github.png');

  return header;
}

function createTheButtonList(parent) {
  let container = createDiv(parent, 'mainButtonListContainer');

  loadButton = createButton(container, '', 'load file', handleLoadFileButton);

  createDiv(container, 'mainButtonListGap');
  capitalizeButton = createButton(container, '', 'capitalize',
                                  handleCapitalizeButton);

  createDiv(container, 'mainButtonListGap');
  saveButton = createButton(container,'', 'save text', handleSaveButton);
  clipboardButton = createButton(container, '', 'copy to clipboard',
                                 handleClipboardButton);

  createDiv(container, 'mainButtonListGap');
  clearButton = createButton(container, '', 'clear', handleClearButton);

  disableAllButtons();
  return container;
}


function createTheTextCard(parent) {
  // sadly we have to create an outer container so that the cursor pointer
  // changes correctly over the scrollbar due to an ancient bug in chrome
  let oc = createDiv(parent, 'mainTextCardOuterContainer');
  let container = createPre(oc, 'mainTextCardContainer', DEFAULT_MSG);
  container.setAttribute('contenteditable', true);
  container.addEventListener('paste', handlePaste);
  return container;
}


function handleCapitalizeButton() {
  let text = htmlToText(textCard.innerHTML);
  textCard.innerHTML = fixCapitalization(text);
}


function handleLoadFileButton(e) {
  let fileEle = createFileOpener({accept:'text/*',
                                  multiple:false,
                                  cb:handleLoadFile});
  fileEle.click();  // click it for the user
}


async function handleSaveButton(e) {
  let text = htmlToText(textCard.innerHTML);

  let a = document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
  a.download = 'results.txt';
  a.click();
}


async function handleClipboardButton(e) {
  let text = htmlToText(textCard.innerHTML);

  try {
    await copyToClipboard(text);
  } catch(error) {
    alert('there was an error copying to the clipboard', error);
    return;
  }
  alert('Copied the text to the clipboard.');
}


function handleClearButton(e) {
  textCard.innerHTML = DEFAULT_MSG;
  setLoadActive();
  setSelectionToEnd();
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
    setSaveActive();
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
}


function handlePaste(e) {
  e.preventDefault();

  let text = (e.clipboardData || window.clipboardDats).getData('text');
  textCard.innerHTML = text;
  setSaveActive();
}


function fixCapitalization(textIn) {
  textIn = captalizeFirstLetterOfText(textIn);

  for (let i = 0; i < textIn.length; ++i) {
    let letter = textIn.charAt(i);
    if (isEndPunctuation(letter) && i < textIn.length - 1) {
      let nextLetter = textIn.charAt(i+1);
      if (isWhiteSpace(nextLetter)) { // space after . we need to capitalize
        let firstCharPos = findFirstNonWhiteSpace(textIn, i+1);
        if (firstCharPos < 0) { // we ran to the end, so return
          return textIn;
        }
        textIn = replaceWithCapitalizedLetter(textIn, firstCharPos);
        i = firstCharPos;
      }  // if nextLetter is a whitespace
    }  // if letter is a period
  } // for all the letters in textIn

  return textIn;
}


function captalizeFirstLetterOfText(text) {
  let firstCharPos = findFirstNonWhiteSpace(text, 0);
  return replaceWithCapitalizedLetter(text, firstCharPos);
}


function findFirstNonWhiteSpace(text, startPos) {
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


function isEndPunctuation(letter) {
  const punctuationArray = ['.', '?', '!'];
  return punctuationArray.includes(letter);
}


function replaceWithCapitalizedLetter(text, index) {
  if (index > text.length - 1) {
    return text;
  }

  let letter = text.charAt(index).toUpperCase();
  return text.substring(0, index) +
    '<div class=highlight>' + letter + '</div>' +
    text.substring(index + 1);
}


function setLoadActive() {
  disableAllButtons();
  loadButton.enable();
}


function setSaveActive() {
  disableAllButtons();
  capitalizeButton.enable();
  saveButton.enable();
  clipboardButton.enable();
  clearButton.enable();
}


function disableAllButtons() {
  loadButton.disable();
  capitalizeButton.disable();
  saveButton.disable();
  clipboardButton.disable();
  clearButton.disable();
}
