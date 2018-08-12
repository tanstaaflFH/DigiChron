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
  
  if ( !fatBurn && !customStart ) { isUndefined = true; }
  
  if ( isUndefined ) { 
	barMin = 50;
	barMax = 180;
  } else if ( customStart ) {
    barMin = customStart - 50;
    barMax = customEnd + 50;
  } else {
  	barMin = cardio - 40;
  	barMax = peak + 40;	
  }
  
	return {
  	fatBurn: fatBurn,
      cardio: cardio,
      peak: peak,
      customStart: customStart,
      customEnd: customEnd,
      hasCustom: ( customStart && customEnd ),
      isDefined: ( ( fatBurn && cardio && peak ) || ( customStart && customEnd ),
      date = fetchDate, 
      barMin = barMin, 
      barMax = barMax 
   }
  
}

// initialize the width for the heart rate zone bars
export function initalizeHRbars(hrZones, hrBars) {
	
	let w0, w1, w2, w3;
	let wTotal = hrZones.barMax - hrZones.barMin;
	
	// custom zone
	if ( hrZones.hasCustom ) {
		
		w0 = Math.Round( ( ( hrZones.customStart - hrZones.barStart ) / wTotal ) * 100 );  
		w1 = Math.Round( ( ( hrZones.customEnd - hrZones.customStart ) / wTotal ) * 50 ); 
		w2 = w1; 
		w3 = Math.Round( ( ( hrZones.barEnd - hrZones.customEnd ) / wTotal ) * 100 );  

	} else if ( hrZones.isDefined ) {
	
		// defined
		w0 = Math.Round( ( ( hrZones.fatBurn - hrZones.barStart ) / wTotal ) * 100 );  
		w1 = Math.Round( ( ( hrZones.cardio - hrZones.fatBurn ) / wTotal ) * 100 );  
		w2 = Math.Round( ( ( hrZones.peak - hrZones.cardio ) / wTotal ) * 100 );  
		w3 = Math.Round( ( ( hrZones.barEnd - hrZones.peak ) / wTotal ) * 100 );  
	
	} else {
	
		// if undefined
		w0 = 25;
		w1 = 25;
		w2 = 25;
		w3 = 25;
		
	}
	
	// set the actual bar width and position
	hrBars[0].style.width = w0 + "%";
	hrBars[1].style.width = w1 + "%";
	hrBars[2].style.width = w2 + "%";
	hrBars[3].style.width = w3 + "%";
	
	hrBars[1].style.x = w0 + "%";
	hrBars[2].style.x = w1 + "%";
	hrBars[3].style.x = w2 + "%";

}

// set the x-position of the icon above the hr bar
// depending on the given hr value
export function setHRBprogress(hrZones, hrIcon, hrValue) {
	
	let total = hrZones.barMax - hrZones.barMin;
	let progress = Math.Floor( ( ( hrValue - hrZones.barMin ) / total ) * 100 );
	hrIcon.style.x = progress + "%";
	
}