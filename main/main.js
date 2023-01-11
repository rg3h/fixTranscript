/**
 * @fileoverview fixTranscript/main/main.js landing page code.
 */
import {updateDateOnTheMinute}      from '../clientComponents/date/date.js';
import {getFirstElementByClassName,
        getFirstElementByName}      from '../clientComponents/html/html.js';
import {addEventListener,
        dispatchEvent,
        eventList}                  from '../clientComponents/event/event.js';

const NBSP = '\u00A0';
const VERSION = '1.1.2';
const DROPZONE_DEFAULT_MSG = 'paste your text here ';
const RESULTS_DEFAULT_MSG = 'results will show up here';

let dropZoneMain, resultsZoneMain;

window.addEventListener('load', main);
window.addEventListener('unload', function () {});  // break back button cache

// main entry point for the app
async function main() {
  createHeader();
  createClearButton();
  createAboutButton();

  resultsZoneMain = getFirstElementByClassName('resultsZoneEditableContainer');
  resultsZoneMain.innerHTML = RESULTS_DEFAULT_MSG;

  dropZoneMain = getFirstElementByClassName('dropZoneEditableContainer');
  dropZoneMain.innerHTML = DROPZONE_DEFAULT_MSG;
  setSelectionToEnd();

  // dropZoneMain.addEventListener('keypress', handleDropZoneKeyPress);
  dropZoneMain.addEventListener('pointerdown', handleDropZonePointerDown);
  dropZoneMain.addEventListener('paste', handlePaste);
  dropZoneMain.addEventListener('focusout', handleFocusOut);
}

function createHeader() {
  getFirstElementByClassName('logoVersion').innerHTML = VERSION;
  let dateEle = getFirstElementByClassName('headerDate');
  updateDateOnTheMinute(dateEle, 'MMMM DTH, YYYY HH:NN AMPM');
}

function createAboutButton() {
  let aboutButton = getFirstElementByName('aboutButton');
  aboutButton.addEventListener('pointerup', handleAboutButton);
  return aboutButton;
}

function handleAboutButton(e) {
  window.location.href = './about/index.html';
}

function createClearButton() {
  let clearButton = getFirstElementByName('clearButton');
  clearButton.addEventListener('pointerup', handleClearButton);
  return clearButton;
}

function handleClearButton(e) {
  resultsZoneMain.innerHTML = RESULTS_DEFAULT_MSG;
  dropZoneMain.innerHTML = DROPZONE_DEFAULT_MSG;
  setSelectionToEnd();
}

function setSelectionToEnd() {
  dropZoneMain.focus();
  let selection = window.getSelection();
  let firstChild = dropZoneMain.firstChild;
  selection.collapse(firstChild, firstChild.length);  // end of the line
  // selection.modify('extend', 'forward', 'line');  // selects the entire line
}

function handleDropZonePointerDown(e) {
  e.preventDefault;

  // they clicked on the default msg so clear it
  if (dropZoneMain.innerHTML  === DROPZONE_DEFAULT_MSG) {
    dropZoneMain.innerHTML = NBSP;
    setSelectionToEnd();
  }
}

function handleDropZoneKeyPress(e) {
  e.preventDefault;

  if (firstTime) {
    e.target.innerHTML = '';
    firstTime = false;
  }
  let name = e.key;
  let code = e.code;
  if (e.key === 'Enter') {
    console.log(buffer.join(''));
  } else {
    console.log(e.key);
    buffer.push(e.key);
  }
}

function handlePaste(e) {
  e.preventDefault;

  let text = (e.clipboardData || window.clipboardDats).getData('text');
  text = fixText(text);
  resultsZoneMain.innerHTML = text;
}

function handleFocusOut(event) {
  // if focus is still in the element do nothing
  if (dropZoneMain.contains(event.relatedTarget)) {
    return;
  }

  // if the currentMsg is empty, then set it to the default message
  let currentMsg = dropZoneMain.innerHTML;
  if (!currentMsg || currentMsg.length < 1 || currentMsg === '&nbsp;') {
    dropZoneMain.innerHTML = DROPZONE_DEFAULT_MSG;
    setSelectionToEnd();
  }
}

function fixText(textIn) {
  console.log('pre fixText()', textIn);
  return textIn.toUpperCase();
}
