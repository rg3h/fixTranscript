/**
 * @fileoverview header.js creates a header across the top with an optional date
 */
'use strict';
import {updateDateOnTheMinute}      from '../date/date.js';
import {createDiv}                  from '../html/html.js';

export function createHeader(paramObj) {
  let self, container, leftContainer, middleContainer, rightContainer;

  let defaultObj = {  // these are the elements paramObj can effect
    date: 'DDDD DD MMM YYYY HH:NN AMPM',  // if null, don't show the date
    parent: null,
  };
  let configObj = Object.assign(defaultObj, paramObj);

  _createHtml(configObj);

  return self = {
    getContainer,
    getLeftContainer,
    getMiddleContainer,
    getRightContainer,
  };

  function getContainer() {
    return container;
  }

  function getLeftContainer() {
    return leftContainer;
  }

  function getMiddleContainer() {
    return middleContainer;
  }

  function getRightContainer() {
    return rightContainer;
  }

  /***********************  private functions ***************************/
  /*private*/ function _createHtml(configObj) {
    container = createDiv(configObj.parent, 'headerContainer');
    leftContainer = createDiv(container, 'headerLeftContainer');
    middleContainer = createDiv(container, 'headerMiddleContainer');
    rightContainer = createDiv(container, 'headerRightContainer');

    if (configObj.date) {
      let dateDiv = createDiv(rightContainer, 'headerDate');
      updateDateOnTheMinute(dateDiv, configObj.date);
    }
  }

}  // createHeader
