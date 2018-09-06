/* used to provide several localized / translated information
    functions:
      - getDateStringLocale:return a date string according to different locales
      - getHRZlocale: make an object out of several provided strings for the different HR zones (needed for translateHRzone)
      - translateHRzone: returns a translation for the current HR zone according to different locales
    languages:
      - English
      - German
      - French
      - Italian
      - Spanish
*/

import { locale } from "user-settings"; 

/* take a date variable and return a date string according to different locales
   Arguments:
   - inpDate: the date [date]
   - withDayDescription: if TRUE, the string will have a short description of the day included (e.g. Mon for Monday in EN) [boolean]
   - dateFormat: the requested date format according to the settings [number: 0-2]
   Returns: [string] */
export function getDateStringLocale( inpDate, withDayDescription, dateFormat ) {

  let returnString;
  
  // object array with weekday abbreviations for different languages 
  let weekday = {
     de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
     en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 
     fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
     es: ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"],
     it: ["lun","mar","mer","gio","ven","sab","dom"] 
  };

  // define formatted date string based on transfered settings in companion app
  let dateLocale0 = ( inpDate.getDate() ) + "." + ( inpDate.getMonth() + 1 ) + "." + ( inpDate.getYear() + 1900 );
  let dateLocale1 = ( inpDate.getMonth() + 1 ) + "/" + ( inpDate.getDate() ) + "/" + ( inpDate.getYear() + 1900 );
  let dateLocale2 = ( inpDate.getDate() ) + "/" + ( inpDate.getMonth() + 1 ) + "/" + ( inpDate.getYear() + 1900 );
  let dateLocale = [
    dateLocale0,
    dateLocale1,
    dateLocale2
  ];
  returnString = dateLocale[dateFormat];

  // get the user language --> locale.language returns "en-US" for example
  let userLanguage = locale.language.substring(0,2);
  
  // precede by day descriptor if requested
  if ( withDayDescription ) {
    
    // default to english if unsupported language is selected
    if ( !( userLanguage == "de" || userLanguage == "en" || userLanguage == "fr" || userLanguage == "es" || userLanguage == "it") ) {
      userLanguage = "en"
    }

    returnString = weekday[userLanguage][inpDate.getDay()] + ", " + returnString;
    
  }

  return returnString;

}

// make an object out of several provided strings for the different HR zones (used by translateHRzone)
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

/* returns the translated HR zone
   - arguments: curZone: the current reported HR zone [string]
   - returns: [string]*/
export function translateHRzone(curZone) {

	let localHR = {
		en: getHRZlocale("normal", "fat burning", "cardio", "peak rate", "below custom zone", "custom zone", "above custom zone", curZone),
    de: getHRZlocale("normal", "Fettverbrennung", "Kardio", "Höchstleistung", "unter benutzer- definierter Zone", "benutzerdefinierte Zone", "über benutzer- definierter Zone", curZone),
    fr: getHRZlocale("hors zone", "elimination des graisses", "cardio", "maximum", "au-dessous de zone personnalisée", "zone personnalisée", "au-dessus de zone personnalisée", curZone),
    it: getHRZlocale("fuori zona", "brucia grassi", "cardio", "picco", "sotto zona personalizzato", "zona personalizzato", "sopra zona personalizzata", curZone),
    es: getHRZlocale("fuera de zona", "quema de grasa", "cardio", "pico", "debajo de la zona personalizada", "zona personalizada", "por encima de la zona personalizada", curZone)
	};

  // get user language setting
  let userLanguage = locale.language.substring(0,2);

  // default to english if unsupported language is selected
  if ( !( userLanguage == "de" || userLanguage == "en" || userLanguage == "fr" || userLanguage == "es" || userLanguage == "it") ) {
    userLanguage = "en"
  }

  let returnString = ( localHR[userLanguage] || "--") ;
  return returnString;
	
}