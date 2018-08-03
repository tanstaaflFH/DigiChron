/*
  A simple way of returning activity data in the correct format based on user preferences.
  Taken from the Fitbit example sdk-moment on https://github.com/Fitbit/sdk-moment  
*/

import { today } from "user-activity";
import { units } from "user-settings";


export function getActiveMinutes() {
  let val = (today.adjusted.activeMinutes || 0);
  let valPretty;
  if ( val < 10 ) { valPretty = val } else {
  	valPretty = (val < 60 ? "" : Math.floor(val/60) + ":") + ("0" + (val%60)).slice("-2");
  	}
  return {
    raw: val,
    pretty: valPretty
  }
}

export function getCalories() {
  let val = (today.adjusted.calories || 0);
  return {
    raw: val,
    pretty: val > 999 ? Math.floor(val/1000) + " " + ("00"+(val%1000)).slice(-3) : val
  }
}

export function getDistance() {
  let valRaw = (today.adjusted.distance || 0);
  let val = valRaw / 1000;
  let u = "k";
  if(units.distance === "us") {
    val *= 0.621371;
    u = "mi";
  }
  return {
    raw: valRaw,
    pretty: `${val.toFixed(1)}${u}`
  }
}

export function getElevationGain() {
  let val = today.adjusted.elevationGain || 0;
  return {
    raw: val,
    pretty: `+${val}`
  }
}

export function getSteps() {
  let val = (today.adjusted.steps || 0);
  return {
    raw: val,
    pretty: val > 999 ? Math.floor(val/1000) + " " + ("00"+(val%1000)).slice(-3) : val
  }
}