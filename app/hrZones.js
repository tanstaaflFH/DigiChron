/* used to retrieve the heart rate zones of a user and to initialize some heart rate elements
    functions:
      - getHeartRateZones: returns an object with information concerning the heart rate zone
      - initalizeHRbars: initializes the width of the heart rate bars on screen 2 base on the user info
      - setHRBprogress: sets the icon position above the heart rate bars on screen 2 based on current HR
    depends on:
      - clsScreens.js
*/

import { user } from "user-profile";

export function getHeartRateZones() {
/* cycles through all HR from 60 - 180 and returns the beginning of the heart rate zones as an object
    return properties:
      - fatBurn: beginning of the fat burn zone (undefined if custom zone),
      - cardio: beginning of the cardio zone (undefined if custom zone),
      - peak: beginning of the peak zone (undefined if custom zone),
      - customStart: beginning of the custom zone (undefined if no custom zone)
      - customEnd: end of the custom zone (undefined if no custom zone),
      - hasCustom: true if custom zone defined, otherwise false,
      - isDefined: true if either all standard zones or the custom zone are well defined,
      - date: the timestamp this hear rate info was retrieved,
      - barMin: the first HR of the heart rate bar on screen 2,
      - barMax: the last HR of the heart rate bar on screen 2
*/

  let hrString;
  let fatBurn, cardio, peak;
  let customStart, customEnd;
  let barMin, barMax;
  let fetchDate = new Date();
  
  //cycle through all HR from 60 to 200 and find the personal HR Zones
  for (let i = 60; i < 200; i++) {

    hrString = user.heartRateZone(i);

    if ( hrString === "fat-burn" && !fatBurn ) {
      fatBurn = i;
    } else if ( hrString === "cardio" && !cardio  ) {
      cardio = i;
    } else if ( hrString === "peak" ) {
      peak = i;
      break;
    } else if ( hrString === "custom" && !customStart ) {
      customStart = i;
    } else if ( hrString === "above-custom" ) {
      customEnd = i - 1;
      break;
    }

  }

  // check if custom or if at all defined
  let isDefined = false;
  let hasCustom = false;
  if ( customStart && customEnd) { hasCustom = true };
  if ( ( fatBurn && cardio && peak ) || ( customStart && customEnd ) ) { isDefined = true };

  // define HR bar start end end
  if ( !isDefined ) {
	  barMin = 50;
	  barMax = 180;
  } else if ( hasCustom ) {
    barMin = customStart - 50;
    barMax = customEnd + 50;
  } else {
  	barMin = fatBurn - 40;
  	barMax = peak + 40;
  }

  // return object
  return {
    fatBurn: fatBurn,
    cardio: cardio,
    peak: peak,
    customStart: customStart,
    customEnd: customEnd,
    hasCustom: hasCustom,
    isDefined: isDefined,
    date: fetchDate,
    barMin: barMin,
    barMax: barMax
   }

}

export function initalizeHRbars(hrZones, hrBars, screens) {
/* initialize the width for the heart rate zone bars
    arguments:
      - hrZones: hrZones object as returned by getHeartRateZones()
      - hrBars: an array with the 4 HR bar DOM objects
      - screens: object as returned by clsScreens
*/

	let w0, w1, w2, w3;
	let wTotal = hrZones.barMax - hrZones.barMin;
	let wScreen = screens.width;

	// custom zone
	if ( hrZones.hasCustom ) {

		w0 = Math.round( ( ( hrZones.customStart - hrZones.barMin ) / wTotal ) * wScreen );
		w1 = Math.round( ( ( hrZones.customEnd - hrZones.customStart ) / wTotal ) * wScreen / 2 );
		w2 = w1;
		w3 = Math.round( ( ( hrZones.barMax - hrZones.customEnd ) / wTotal ) * wScreen );

	} else if ( hrZones.isDefined ) {

		// defined
		w0 = Math.round((( hrZones.fatBurn - hrZones.barMin ) / wTotal ) * wScreen );
		w1 = Math.round((( hrZones.cardio - hrZones.fatBurn ) / wTotal ) * wScreen );
		w2 = Math.round((( hrZones.peak - hrZones.cardio ) / wTotal ) * wScreen );
		w3 = Math.round((( hrZones.barMax - hrZones.peak ) / wTotal ) * wScreen );

	} else {

		// if undefined
		w0 = Math.round( wScreen / 4 );
		w1 = Math.round( wScreen / 4 );
		w2 = Math.round( wScreen / 4 );
		w3 = Math.round( wScreen / 4 );

	}

	// set the actual bar width and position
	hrBars[0].width = w0;
	hrBars[1].width = w1;
	hrBars[2].width = w2;
	hrBars[3].width = w3;

	hrBars[1].x = w0;
	hrBars[2].x = w0 + w1;
	hrBars[3].x = w0 + w1 + w2;

}

export function setHRBprogress(hrZones, hrIcon, hrValue, screens) {
/* set the x-position of the icon above the hr bar depending on the given hr value
    arguments:
      - hrZones: hrZones object as returned by getHeartRateZones()
      - hrIcon: the DOM element of the progress icon
      - hrValue: the current HR value
      - screens: object as returned by clsScreens
*/

	let wScreen = screens.width;
	let total = hrZones.barMax - hrZones.barMin;
  let iconOffset = Math.floor( hrIcon.width * 0.5 );
  let position = Math.floor( ( ( hrValue - hrZones.barMin ) / total ) * wScreen );
  if ( position < 0 ) { position = 0 };
  if ( position > wScreen ) { position = wScreen };
	hrIcon.x = position - iconOffset;
	
}