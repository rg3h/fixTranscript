// @fileoverview module components/date/date.js
//  locale = undefined but can be strings like 'en-US'

export {
  formatDate,                 // takes a format string and replaces w/ the date
  getMonthLongNameList,       // returns array of ['January', 'February'...]
  getMonthShortNameList,      // returns array of ['Jan', 'Feb'...]
  getDateAsInt,               // returns the number of ms since epoch
  getDayLongNameList,         // returns array of ['Sunday', 'Monday'...]
  getDayShortNameList,        // returns array of ['Sun', 'Mon'...]
  isValidDate,                // returns true if is a valid date type
  updateDateOnTheMinute,      // updates div with the formatted date every min
};


/*export*/ function getBCAD(date) {
  let yearAsNumber = date.getFullYear();
  let commonEra = '';
  if (yearAsNumber < 0) {
    commonEra = 'BC';
  } else if (yearAsNumber < 1000) { // if date is between 0 and 1000 add 'AD'
    commonEra = 'AD';
  }
  return commonEra;
}

/**
 * @param {string} format string like 'DD-MM-YYYY HH:NN:SS AMPM'
 *    DTH  == day as number with suffix, 2nd
 *    2D   == day as two-digit number, 02
 *    DD   == day as number, 2
 *    DDD  == day as short, Sat
 *    DDDD == day as long, Saturday
 *    MM   == month as two-digit number, 03
 *    MMM  == month as short, Nov
 *    MMMM == month as long, November
 *    YYYY == year as long, 2022
 *    YY   == year as short, 22
 *    2H    == hour as two-digit number, 09
 *    HH   == hour as number, 9
 *    NN   == minutes, 04  (NOTE: NN not MM)
 *    SS   == seconds, 09
 *    MS   == as three digit milliseconds, 007
 *    AMPM == show AM/PM
 *    MIL  == show as military time (overrides AMPM)
 */
/*export*/ function formatDate(formatString='DDDD, DD MMMM YYYY, HH:NN AMPM',
                               date = new Date(),
                               locale=undefined) {
  date = date || new Date();

  if (formatString.indexOf('DDDD') > -1) {
    let DDDD = date.toLocaleString(locale, {weekday: 'long'});
    formatString = formatString.split('DDDD').join(DDDD);
  }

  if (formatString.indexOf('DDD') > -1) {
    let DDD = date.toLocaleString(locale, {weekday: 'short'});
    formatString = formatString.split('DDD').join(DDD);
  }

  if (formatString.indexOf('DD') > -1) {
    let DD = date.toLocaleString(locale, {day: 'numeric'});
    formatString = formatString.split('DD').join(DD);
  }

  if (formatString.indexOf('2D') > -1) {
    let D2 = date.toLocaleString(locale, {day: '2-digit'});
    formatString = formatString.split('2D').join(D2);
  }

  if (formatString.indexOf('DTH') > -1) {
    let DTH = date.toLocaleString(locale, {day: 'numeric'});
    DTH += _getNumberSuffix(DTH);
    formatString = formatString.split('DTH').join(DTH);
  }

  if (formatString.indexOf('MMMM') > -1) {
    let MMMM = date.toLocaleString(locale, {month: 'long'});
    formatString = formatString.split('MMMM').join(MMMM);
  }

  if (formatString.indexOf('MMM') > -1) {
    let MMM = date.toLocaleString(locale, {month: 'short'});
    formatString = formatString.split('MMM').join(MMM);
  }

  if (formatString.indexOf('MM') > -1) {
    let MM = date.toLocaleString(locale, {month: 'numeric'});
    formatString = formatString.split('MM').join(MM);
  }

  if (formatString.indexOf('2M') > -1) {
    let M2 = date.toLocaleString(locale, {month: '2-digit'});
    formatString = formatString.split('2M').join(M2);
  }

  if (formatString.indexOf('YYYY') > -1) {
    let yearAsNumber = date.getFullYear();
    if (yearAsNumber < 0) {
      date.setFullYear(-yearAsNumber); // have to do this to fix the date
    }
    let yearStr = date.toLocaleString(locale, {year:'numeric'}) + getBCAD(date);
    formatString = formatString.split('YYYY').join(yearStr);
  }

  if (formatString.indexOf('YY') > -1) {
    let yearStr = date.toLocaleString(locale, {year: '2-digit'});
    formatString = formatString.split('YY').join(yearStr);
  }

  if (formatString.indexOf('HH') > -1) {
    let args = {};
    args.hour12 = formatString.indexOf('MIL') < 0; // no MIL means true
    args.hour = 'numeric';
    let HH = date.toLocaleString(locale, args).split(' ')[0];
    formatString = formatString.split('HH').join(HH);
  }

  if (formatString.indexOf('2H') > -1) {
    let args = {};
    args.hour12 = formatString.indexOf('MIL') < 0; // no MIL means true
    args.hour = '2-digit';
    let H2 = date.toLocaleString(locale, args).split(' ')[0];
    formatString = formatString.split('2H').join(H2);
  }

  if (formatString.indexOf('NN') > -1) {
    let NN = date.toLocaleString(locale, {minute: '2-digit'});
    NN = NN.length < 2 ? '0' + NN : NN;
    formatString = formatString.split('NN').join(NN);
  }

  if (formatString.indexOf('SS') > -1) {
    let SS = date.toLocaleString(locale, {second: '2-digit'});
    SS = SS.length < 2 ? '0' + SS : SS;
    formatString = formatString.split('SS').join(SS);
  }

  if (formatString.indexOf('MS') > -1) {
    let MS = date.toLocaleString(locale, {fractionalSecondDigits: 3});
    formatString = formatString.split('MS').join(MS);
  }

  if (formatString.indexOf('AMPM') > -1) {
    let args = {};
    args.hour12 = true;
    args.hour = 'numeric';
    let AMPM = date.toLocaleString(locale, args).split(' ')[1];
    formatString = formatString.split('AMPM').join(AMPM);
  }

  return formatString;
};

/*export*/ function getMonthLongNameList() {
  return ['January','February','March','April','May','June','July',
          'August','September','October','November','December'];
}

/*export*/ function getMonthShortNameList() {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

/*export*/ function getDateAsInt(date=new Date()) {
  return date.getTime();
}

/*export*/ function getDayLongNameList() {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
          'Thursday', 'Friday', 'Saturday'];
}

/*export*/ function getDayShortNameList() {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}

/*export*/ function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

/*export*/ function updateDateOnTheMinute(dateDiv,
                         dateFormat='DDDD DD MMM YYYY HH:NN AMPM') {

  let text = formatDate(dateFormat);

  // find the first text node or create one
  let textNode = null;
  for (let node in dateDiv.childNodes) {
    if (dateDiv.childNodes[node].nodeType === Node.TEXT_NODE) {
      textNode = dateDiv.childNodes[node];
      break;
    }
  }

  if (textNode) {
    textNode.nodeValue = text;
  } else {
    textNode = document.createTextNode(text);
    dateDiv.appendChild(textNode);
  }

  // compute the time until the next update
  let theDate = new Date();
  let secondsLeft = 60 - theDate.getSeconds(); // secs until minute mark
  let ms = secondsLeft < 0 ? 0 : secondsLeft * 1000;
  setTimeout(() => {updateDateOnTheMinute(dateDiv, dateFormat)}, ms);
}

/*export*/ function getMonthNumberFromName(monthName) {
  return monthNameList.indexOf(monthName);
}


// '2-digit' 'numeric' 'long' 'short' 'narrow'
/*export*/ function formatDay(date=new Date(),
                              dateStyle='numeric',
                              locale=undefined) {
  let param = dateStyle === 'numeric' ? {day:dateStyle} : {weekday:dateStyle};
  return date.toLocaleString(locale, param);
}

// '2-digit' 'numeric' 'long' 'short' 'narrow'
/*export*/ function formatMonth(date=new Date(),
                                dateStyle='long',
                                locale=undefined) {
  return date.toLocaleString(locale, {month:dateStyle});
}


/*export*/ function getNiceDate(date=new Date(), showDay=false) {
  let formatString = showDay ? 'DDDD, DD MMMM YYYY' : 'DD MMMM YYYY';
  return formatDate(formatString, date);
}

/*export*/ function getNiceDateShort(date=new Date()) {
  return formatDate('DD MMM YY', date);
}

/*export*/ function getNiceTime(date=new Date()) {
  return formatDate('HH:NN:SS AMPM', date);
}

/*export*/ function getLocalDateFromUtc(utcDate, locale=undefined) {
  return utcDate.toLocaleString(locale);
}

/********************* private functions ******************************/
/*private*/ function _getNumberSuffix(number) {
  const suffixList=['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];

  // number % 10 gives us the one's digit (e.g. 13 => 3)
  let index = number > 10 && number < 20 ? 0 : number % 10;
  return suffixList[index];
}
