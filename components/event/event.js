/**
 * @fileoverview event.js
 */

export {
  addEventListener,  // an event to listen to and a handleFunction
  dispatchEvent,     // send out a custom event with optional data
  eventList,         // list of named custom events
};

/*export*/ function addEventListener(eventName, fn) {
  if (!eventName) {
    console.error('attempted to addEventListener with a missing eventName');
    return;
  }

  if (!fn) {
    console.error('attempted to addEventListener with a missing callback');
    return;
  }

  document.body.addEventListener(eventName, fn, false);
}


/*export*/ function dispatchEvent(eventName, opt_data) {
  if (!eventName) {
    console.error('attempted to displatch a missing eventName');
    return;
  }
  let event = new Event(eventName);
  event.detail = opt_data;
  document.body.dispatchEvent(event);
}

/*export*/ let eventList = {
  CLEAR_EVENT: 'clear',
  TEXT_LOADED_EVENT: 'textLoaded',
};
