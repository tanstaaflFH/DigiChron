import { locale } from "user-settings"; 

// take a date variable and return a date string according to different locales
// Arguments:
// - inpDate: the date variabel
// - withDayDescription: boolean, if TRUE, the string will have a short description of the day included (e.g. Mon for Monday in EN)
export function getDateStringLocale( inpDate, withDayDescription ) {

  let returnString;
  
  // object array with weekday abbreviations for different languages 
  let weekday = {
     de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
     en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 
     fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] 
  };
  
  // to check what is the actual language tag returned
  // see issue on github
  console.log(locale.language);
  
  //locale.language returns "en-US" for example
  let pre = locale.language.substring(0,2);
  
  // build string according to locale, default to day.month.year if not US
  if ( locale.language.slice(-2) === "us" ) {
    returnString = ( inpDate.getMonth() + 1 ) + "/" + ( inpDate.getDate() ) + "/" + ( inpDate.getYear() + 1900 );
  } else {
    returnString = ( inpDate.getDate() ) + "." + ( inpDate.getMonth() + 1 ) + "." + ( inpDate.getYear() + 1900 );
  }
  
    // precede by day descriptor if requested
  if ( withDayDescription ) {
    
    if ( pre == "de" ) {
    
      returnString = weekday['de'][inpDate.getDay()] + ", " + returnString;
      
    } else {
    
      returnString = weekday['en'][inpDate.getDay()] + ", " + returnString;
      
    }
    
  }
  
  // return finished date string
  return returnString;

}

function objHRZlocale(oob, fatBurn, cardio, peak, bCustom, custom, aCustom) {
	return {
		out-of-range: oob,
		fat-burn: fatBurn,
		cardio: cardio,
		peak: peak,
		below-custom: bCustom,
		custom: custom,
		above-custom: aCustom
	}
}

// takes the current heart rate zone and returns
// the local translation if applicable
export function translateHRzone(curZone) {
	
	let localHR = {
		en: objHRZlocale("normal", "cardio", "fat burning", "peak rate", "below custom zone", "custom zone", "above custom zone"),
		de: objHRZlocale("normal", "Kardio", "Fettverbrennung", "Höchstleistung", "unter benutzerdefinierter Zone", "benutzerdefinierte Zone", "ueber benutzerdefinierter Zone")
	};
	
	let userLang = locale.language.substring(0,2);
	
	return { localHR[userLang][curZone] || "--" }
	
}