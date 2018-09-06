import { locale } from "user-settings"; 

// take a date variable and return a date string according to different locales
// Arguments:
// - inpDate: the date variabel
// - withDayDescription: boolean, if TRUE, the string will have a short description of the day included (e.g. Mon for Monday in EN)
export function getDateStringLocale( inpDate, withDayDescription ) {

  let returnString;
  
  let weekday = {
     de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
     en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  };
  
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