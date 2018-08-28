import { locale } from "user-settings"; 

// take a date variable and return a date string according to different locales
// Arguments:
// - inpDate: the date variabel
// - withDayDescription: boolean, if TRUE, the string will have a short description of the day included (e.g. Mon for Monday in EN)
// - dateFormat: the requested date format (0-2) according to the settings
export function getDateStringLocale( inpDate, withDayDescription, dateFormat ) {

  let returnString;
  
  // object array with weekday abbreviations for different languages 
  let weekday = {
     de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
     en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 
     fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
     es: [],
     it: [] 
  };

  // define date format based on transfered companion settings
  let dateLocale0 = ( inpDate.getDate() ) + "." + ( inpDate.getMonth() + 1 ) + "." + ( inpDate.getYear() + 1900 );
  let dateLocale1 = ( inpDate.getMonth() + 1 ) + "/" + ( inpDate.getDate() ) + "/" + ( inpDate.getYear() + 1900 );
  let dateLocale2 = ( inpDate.getDate() ) + "/" + ( inpDate.getMonth() + 1 ) + "/" + ( inpDate.getYear() + 1900 );

  var dateLocale = [
    dateLocale0,
    dateLocale1,
    dateLocale2
  ];

  returnString = dateLocale[dateFormat];

  //locale.language returns "en-US" for example
  let pre = locale.language.substring(0,2);
  
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

function getHRZlocale(oob, fatBurn, cardio, peak, bCustom, custom, aCustom, currentZone) {

  let returnString;

  switch (currentZone) {

    case "out-of-range":

      returnString = oob;
      break;

    case "fat-burn":

      returnString = fatBurn;
      break;

    case "cardio":

      returnString = cardio;
      break;

    case "peak":

      returnString = peak;
      break;

    case "below-custom":

      returnString = bCustom;
      break;

    case "custom":

      returnString = custom;
      break;

    case "above-custom":

      returnString = aCustom;
      break;
  }

	return returnString;

}

// takes the current heart rate zone and returns
// the local translation if applicable
export function translateHRzone(curZone) {

	let localHR = {
		en: getHRZlocale("normal", "fat burning", "cardio", "peak rate", "below custom zone", "custom zone", "above custom zone", curZone),
		de: getHRZlocale("normal", "Fettverbrennung", "Kardio", "Höchstleistung", "unter benutzerdefinierter Zone", "benutzerdefinierte Zone", "über benutzerdefinierter Zone", curZone)
	};

	let userLanguage = locale.language.substring(0,2);
  let returnString = ( localHR[userLanguage] || "--") ;
  return returnString;
	
}