/* general utility functions
    functions:
      - zeroPad: Add zero in front of numbers < 10
      - colorGradientPercent: creates a linear color gradient from three colors (0%/50%/100%) 
                              and returns the hex color value from the provided percentage
      - colorGradientValues: creates a linear color gradient from three colors and three corresponding 
                             given values and returns the hex color value from the provided value
      - hexToRgb: returns the RGB values from a HEX color value
      - rgbToHex: returns the hex color value from given RGB color values
      - numberGroupThousand: takes a number as an input, rounds it to an integer and returns it as a string with the numbers in 3 digits groups separated by a space
      - numberWithSeparator: takes a number as an input, rounds it to an integer and returns it as a string with the numbers in 3 digits groups separated by a "."
*/

import { user } from "user-profile";


export function zeroPad(i) {
// Add zero in front of numbers < 10
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


export function colorGradientPercent ( value, colorFirst, colorSecond, colorThird ) {
/*creates a linear color gradient from three colors (0%/50%/100%) 
  and returns the hex color value from the provided percentage
  - Arguments: -value: percentage of the to be returned color [number: 0-1]
               -colorFirst: the color for 0% [string - hex color value]
               -colorSecond: the color for 50% [string - hex color value]
               -colorThird: the color for 100% [string - hex color value]
  - Returns: hex color value [string]
*/

  // get color r,g,b components
  let c1r = hexToRgb(colorFirst).r;
  let c1g = hexToRgb(colorFirst).g;  
  let c1b = hexToRgb(colorFirst).b;  
  let c2r = hexToRgb(colorSecond).r;
  let c2g = hexToRgb(colorSecond).g;  
  let c2b = hexToRgb(colorSecond).b;  
  let c3r = hexToRgb(colorThird).r;
  let c3g = hexToRgb(colorThird).g;  
  let c3b = hexToRgb(colorThird).b;
  
  let newColorR;
  let newColorG;
  let newColorB;
  
  if ( value < 0.5 ) {
    
    // gradient between first and second
    newColorR = Math.floor( c1r + ( ( c2r - c1r ) * value ) );
    newColorG = Math.floor( c1g + ( ( c2g - c1g ) * value ) );
    newColorB = Math.floor( c1b + ( ( c2b - c1b ) * value ) );
    
  } else {

    // gradient between second and third
    value = value - 0.5;
    newColorR = Math.floor( c2r + ( ( c3r - c2r ) * value ) );
    newColorG = Math.floor( c2g + ( ( c3g - c2g ) * value ) );
    newColorB = Math.floor( c2b + ( ( c3b - c2b ) * value ) );
    
  }
  
  return rgbToHex(newColorR, newColorG, newColorB)
  
}

export function colorGradientValues ( value, colorFirst, colorSecond, colorThird, limitLow, limitMid, limitHigh ) {
/*creates a linear color gradient from three colors and three corresponding 
  given values and returns the hex color value from the provided value
  - Arguments: -value: percentage of the to be returned color [number: 0-1]
               -colorFirst: the color for limitLow [string - hex color value]
               -colorSecond: the color for limitMid [string - hex color value]
               -colorThird: the color for limitHigh [string - hex color value]
               -limitLow: the value for the first color [number]
               -limitMid: the value for the second color [number]
               -limitHigh: the value for the third color [number]
  - Returns: hex color value [string]
*/

  // get color r,g,b components
  let c1r = hexToRgb(colorFirst).r;
  let c1g = hexToRgb(colorFirst).g;  
  let c1b = hexToRgb(colorFirst).b;  
  let c2r = hexToRgb(colorSecond).r;
  let c2g = hexToRgb(colorSecond).g;  
  let c2b = hexToRgb(colorSecond).b;  
  let c3r = hexToRgb(colorThird).r;
  let c3g = hexToRgb(colorThird).g;  
  let c3b = hexToRgb(colorThird).b;
  
  let newColorR;
  let newColorG;
  let newColorB;
  
  if ( value < limitMid ) {
    
    // percentage between mid and low
    if ( value < limitLow ) { value = limitLow }
    let range = limitMid - limitLow;
    let percent = ( value - limitLow ) / range;
    
    // gradient between first and second
    newColorR = Math.floor( c1r + ( ( c2r - c1r ) * percent ) );
    newColorG = Math.floor( c1g + ( ( c2g - c1g ) * percent ) );
    newColorB = Math.floor( c1b + ( ( c2b - c1b ) * percent ) );
    
  } else {
    
    // percentage between mid and low
    if ( value > limitHigh ) { value = limitHigh }
    let range = limitHigh - limitMid;
    let percent = ( value - limitMid ) / range;
    
    // gradient between second and third
    newColorR = Math.floor( c2r + ( ( c3r - c2r ) * percent ) );
    newColorG = Math.floor( c2g + ( ( c3g - c2g ) * percent ) );
    newColorB = Math.floor( c2b + ( ( c3b - c2b ) * percent ) );
    
  }
  
  return rgbToHex(newColorR, newColorG, newColorB)
  
}

export function hexToRgb(hex) {
// returns the R/G/B value of a hex color code
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function rgbToHex(r, g, b) {
// returns the hex color code from a R/G/B value
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function numberGroupThousand( inputNumber ) {
// takes a number as an input, rounds it to an integer and returns it as a string with the numbers in 3 digits groups separated by a space

  // split into groups of 3
  let tempArray = Math.round(inputNumber).toString.split(""); 

}

export const numberWithSeparator = (x) => {
// takes a number as an input, rounds it to an integer and returns it as a string with the numbers in 3 digits groups separated by a "."
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}