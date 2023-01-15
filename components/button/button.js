/**
 * @fileoverview button.js
 */
import {createDiv, setFirstText} from '../html/html.js';

export function createButton(parent, labelIn, className, fn) {
  let self, container, label;
  return init();

  function init() {
    let classNameList = 'button ' + className || '';
    label = labelIn || 'Button';
    container = createDiv(parent, classNameList, label);
    container.addEventListener('pointerup', fn);

    return self = {
      disable,
      enable,
      getContainer,
      getLabel,
      setCallback,
      setLabel,
    };
  }

  /*export*/ function disable() {
    container.classList.remove('button');
    container.classList.add('buttonDisabled');
    return self;
  }

  /*export*/ function enable() {
    container.classList.remove('buttonDisabled');
    container.classList.add('button');
    return self;
  }

  /*export*/ function getContainer() {
    return container;
  }

  /*export*/ function getLabel() {
    return label;
  }

  /*export*/ function setCallback(newFn) {
    container.removeEventListener('pointerup', fn);
    fn = newFn;
    container.addEventListener('pointerup', fn);
    return self;
  }

  /*export*/ function setLabel(newLabelIn) {
    let newLabel = newLabelIn || '';
    setFirstText(container, newLabel);
    return self;
  }

} // createButton
