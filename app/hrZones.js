// used to retrieve the heart rate zones of a user
import { user } from "user-profile";
import { document } from "document";

// cycles through all HR from 60 - 180 and returns the beginning of the heart rate zones as an object
export function getHeartRateZones() {
  
  let hrString;
  let fatBurn, cardio, peak;
  let customStart, customEnd;
  let barMin, barMax;
  let fetchDate = new Date();
  
  //cycle through all HR from 60 to 180 and find the personal HR Zones
  for (let i = 60; i < 180; i++) {

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

// initialize the width for the heart rate zone bars
export function initalizeHRbars(hrZones, hrBars, screens) {

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

  console.log("initialized HR bars: " + w0 + ", " + w1 + ", " + w2 + ", " + w3 + " = " + (w0+w1+w2+w3));

	// set the actual bar width and position
	hrBars[0].width = w0;
	hrBars[1].width = w1;
	hrBars[2].width = w2;
	hrBars[3].width = w3;

	hrBars[1].x = w0;
	hrBars[2].x = w0 + w1;
	hrBars[3].x = w0 + w1 + w2;

}

// set the x-position of the icon above the hr bar
// depending on the given hr value
export function setHRBprogress(hrZones, hrIcon, hrValue, screens) {

	let wScreen = screens.width;
	let total = hrZones.barMax - hrZones.barMin;
	hrIcon.style.x = Math.Floor( ( ( hrValue - hrZones.barMin ) / total ) * wScreen );
	
}