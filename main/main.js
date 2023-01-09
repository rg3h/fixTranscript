/**
 * @fileoverview fixTranscript/main/main.js landing page code.
 */

window.addEventListener('load', main);
window.addEventListener('unload', function () {});  // break back button cache

let dropZoneMain;

// main entry point for the app
async function main() {
  dropZoneMain = document.getElementsByClassName('dropZoneMainBeforeDrop')[0];
  setEmptySelection();

  // dropZoneMain.addEventListener('keypress', handleDropZoneKeyPress);
  dropZoneMain.addEventListener('pointerdown', handleDropZonePointerDown);
  dropZoneMain.addEventListener('paste', handlePaste);
}

function handleDropZonePointerDown(e) {
  e.preventDefault;
  setEmptySelection();
}

function setEmptySelection() {
  dropZoneMain.innerHTML = '\u00A0';
  dropZoneMain.focus();
  let selection = window.getSelection();
  // selection.modify('extend', 'forward', 'line');  // selects the entire line
  let firstChild = dropZoneMain.firstChild;
  selection.collapse(firstChild, firstChild.length/2);
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

  dropZoneMain.className = 'dropZoneMain';

  let text = (e.clipboardData || window.clipboardDats).getData('text');
  console.log(text);
  text = fixText(text);
  let result = document.getElementsByClassName('resultsZoneMain')[0];
  result.innerHTML = text;

/***
  setTimeout(function() {
    let result = document.getElementsByClassName('resultsZoneMain')[0];
    result.innerHTML = null;
    let clone = dropZoneMain.cloneNode(true);
    result.appendChild(clone);
  }, 0);
***/
}

function fixText(textIn) {
  return textIn.toUpperCase();
}
