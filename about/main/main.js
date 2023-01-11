/**
 * @fileoverview fixTranscript/main/main.js landing page code.
 */
import {updateDateOnTheMinute}      from '../../clientComponents/date/date.js';
import {getFirstElementByClassName,
        getFirstElementByName}      from '../../clientComponents/html/html.js';

const VERSION = '1.1.2';

window.addEventListener('load', main);
window.addEventListener('unload', function () {});  // break back button cache

// main entry point for the app
async function main() {
  createHeader();
}

function createHeader() {
  getFirstElementByClassName('logoVersion').innerHTML = VERSION;
  let dateEle = getFirstElementByClassName('headerDate');
  updateDateOnTheMinute(dateEle, 'MMMM DTH, YYYY HH:NN AMPM');
}
