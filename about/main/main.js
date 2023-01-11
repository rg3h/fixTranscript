/**
 * @fileoverview fixTranscript/main/main.js landing page code.
 */
import {updateDateOnTheMinute}      from '../../components/date/date.js';
import {getFirstElementByClassName,
        getFirstElementByName}      from '../../components/html/html.js';
import {getVersion}                 from '../../components/version/version.js';

window.addEventListener('load', main);
window.addEventListener('unload', function () {});  // break back button cache

// main entry point for the app
async function main() {
  createHeader();
  createBackButton();
  addVersionToDescriptionSection();
}


function createHeader() {
  getFirstElementByClassName('logoVersion').innerHTML = getVersion();
  let dateEle = getFirstElementByClassName('headerDate');
  updateDateOnTheMinute(dateEle, 'MMMM DTH, YYYY HH:NN AMPM');
}


function createBackButton() {
  let backButton = getFirstElementByName('backButton');
  backButton.addEventListener('pointerup', handleBackButton);
  return backButton;
}


function handleBackButton(e) {
  window.location.href = '../index.html';
}


function addVersionToDescriptionSection() {
  let header = document.getElementsByClassName('descriptionHeader')[0];
  header.innerHTML = 'Description for version ' + getVersion();
}
