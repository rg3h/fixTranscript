/**
 * @fileoverview toggleButton.js -- a derivative of button that shows
 * a toggled state. Uses button.css for styling.
 */
import {createButton}                   from './button.js';
import {appendFirst, createDiv}         from '../html/html.js';
import {BOX_SYMBOL, CHECKED_BOX_SYMBOL} from '../symbols/symbols.js';

export function createToggleButton(parent,
                                   className,
                                   labelIn,
                                   fn,
                                   toggleOnFlag=true) {
  let self, button, checkbox;
  return init();

  function init() {
    button = createButton(parent, className, labelIn, fn);
    let container = getContainer();
    container.classList.add('toggleButton');
    checkbox = createDiv(null, 'toggleButtonCheckBox', BOX_SYMBOL);
    appendFirst(container, checkbox);
    setToggle(toggleOnFlag);

    return self = {
      disable,
      enable,
      getContainer,
      getLabel,
      isOn,
      setCallback,
      setLabel,
      setOff,
      setOn,
      setToggle,
      toggle,
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

  /*export*/ function isOn() {
    return toggleOnFlag;
  }

  /*export*/ function setCallback(newFn) {
    button.setCallback(newFn);
    return self;
  }

  /*export*/ function setLabel(newLabel) {
    button.setLabel(newLabel);
    return self;
  }

  /*export*/ function setOn() {
    setToggle(true);
    return self;
  }

  /*export*/ function setOff() {
    setToggle(false);
    return self;
  }

  /*export*/ function setToggle(newToggleState) {
    toggleOnFlag = !!newToggleState;
    let container = getContainer();

    if (toggleOnFlag) {
      checkbox.innerHTML = CHECKED_BOX_SYMBOL;
      container.classList.add('toggleButtonOn');
    } else {
      checkbox.innerHTML = BOX_SYMBOL;
      container.classList.remove('toggleButtonOn');
    }
    return self;
  }

  /*export*/ function toggle() {
    setToggle(!toggleOnFlag);
    return self;
  }

  /********************* private functions ******************************/
  /*private*/

} // createToggleButton
