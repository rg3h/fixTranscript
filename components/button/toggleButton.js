/**
 * @fileoverview toggleButton.js -- a derivative of button that shows
 * a toggled state. Uses button.css for styling.
 */
import {createButton}                   from './button.js';
import {appendFirst, createDiv}         from '../html/html.js';
import {BOX_SYMBOL, CHECKED_BOX_SYMBOL} from '../symbols/symbols.js';

export function createToggleButton(parent,className,labelIn,fn,setFlag=true) {
  let self, button, checkbox;
  return init();

  function init() {
    button = createButton(parent, className, labelIn, fn);
    let container = getContainer();
    container.classList.add('toggleButton');
    checkbox = createDiv(null, 'toggleButtonCheckBox', BOX_SYMBOL);
    appendFirst(container, checkbox);
    set(setFlag);

    return self = {
      disable,
      enable,
      getContainer,
      getLabel,
      isSet,
      set,
      setCallback,
      setLabel,
      toggle,
      unset,
    };
  }

  /*export*/ function disable() {
    button.disable();
    return self;
  }

  /*export*/ function enable() {
    button.enable();
    return self;
  }

  /*export*/ function getContainer() {
    return button.getContainer();
  }

  /*export*/ function getLabel() {
    return button.getLabel();
  }

  /*export*/ function isSet() {
    return setFlag;
  }

  /*export*/ function setCallback(newFn) {
    button.setCallback(newFn);
    return self;
  }

  /*export*/ function setLabel(newLabel) {
    button.setLabel(newLabel);
    return self;
  }

  /*export*/ function unset() {
    set(false);
    return self;
  }

  /*export*/ function set(newToggleState=true) {
    setFlag = !!newToggleState;
    let container = getContainer();

    if (setFlag) {
      checkbox.innerHTML = CHECKED_BOX_SYMBOL;
      container.classList.add('toggleButtonOn');
    } else {
      checkbox.innerHTML = BOX_SYMBOL;
      container.classList.remove('toggleButtonOn');
    }
    return self;
  }

  /*export*/ function toggle() {
    set(!setFlag);
    return self;
  }

  /********************* private functions ******************************/
  /*private*/

} // createToggleButton
