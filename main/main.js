/**
 * @fileoverview fixTranscript/main/main.js landing page code.
 */
import {updateDateOnTheMinute}      from '../components/date/date.js';
import {getFirstElementByClassName,
        getFirstElementByName}      from '../components/html/html.js';
import {addEventListener,
        dispatchEvent,
        eventList}                  from '../components/event/event.js';
import {getVersion}                 from '../components/version/version.js';

const NBSP = '\u00A0';
const DROPZONE_DEFAULT_MSG = 'paste your text here ';
const RESULTS_DEFAULT_MSG = 'results will show up here';

let dropZoneMain, resultsZoneMain, fileEle;

window.addEventListener('load', main);
window.addEventListener('unload', function () {});  // break back button cache

// main entry point for the app
async function main() {
  createHeader();
  createUploadButton();
  createSaveButton();
  createClipboardButton();
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
  getFirstElementByClassName('logoVersion').innerHTML = getVersion();
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


function createUploadButton() {
  let uploadButton = getFirstElementByName('uploadButton');
  uploadButton.addEventListener('pointerup', handleUploadButton);

  fileEle = document.getElementById('fileEle');
  fileEle.addEventListener('change', handleFileUpload);

  return uploadButton;
}


function handleUploadButton(e) {
  fileEle.click();  // click it for the user
}


function handleFileUpload(e) {
  let fileList = e.target.files;

  // there should only be one file
  const file = fileList[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    let text = e.target.result;
    dropZoneMain.innerHTML = text;
    let fixedText = fixText(text);
    resultsZoneMain.innerHTML = fixedText;
  };
  reader.readAsText(file);
}


function createSaveButton() {
  let saveButton = getFirstElementByName('saveButton');
  saveButton.addEventListener('pointerup', handleSaveButton);

  return saveButton;
}


function handleSaveButton(e) {
  console.log('save button pressed');
  let a = document.createElement('a');
  let text = resultsZoneMain.innerHTML;
  a.href = window.URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
  a.download = 'results.txt';
  a.click();
}


function createClipboardButton() {
  let clipboardButton = getFirstElementByName('clipboardButton');
  clipboardButton.addEventListener('pointerup', handleClipboardButton);

  return clipboardButton;
}


async function handleClipboardButton(e) {
  let text = resultsZoneMain.innerHTML;
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
  let fixedText = fixText(text);
  resultsZoneMain.innerHTML = fixedText;
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
//  console.log('pre fixText()', textIn);
  //  return textIn.toUpperCase();
  return fixCaptioning(textIn);
}

function fixCaptioning(textIn) {
  const whiteSpaceArray = [' ','\f','\n','\r','\t','\v'];
  let strArray = textIn.split('.');
  // console.log('bef\n', strArray);
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
