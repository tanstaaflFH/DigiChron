// used to retrieve the heart rate zones of a user
import { user } from "user-profile";

// cycles through all HR from 60 - 180 and returns the beginning of the heart rate zones as an object
export function getHeartRateZones() {
  
  let hrString;
  let fatBurn, cardio, peak;
  let customStart, customEnd;
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
  
  return {
  	fatBurn: fatBurn,
      cardio: cardio,
      peak: peak,
      customStart: customStart,
      customEnd: customEnd,
      hasCustom: ( customStart && customEnd ),
      isDefined: ( ( fatBurn && cardio && peak ) || ( customStart && customEnd ),
      date = fetchDate
   }
  
}