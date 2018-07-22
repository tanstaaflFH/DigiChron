// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// take three color values (hex) and one percentage value (0-1), return a color (hex)
// based on a color gradient from first Color (0) by second Color (0.5) to third
// Color (1)
export function colorGradientPercent ( value, colorFirst, colorSecond, colorThird ) {
  
  // get color components
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

// take three color values (hex) and thre absolute values, return a color (hex)
// based on a color gradient from first Color by second Color (0.5) o third
// Color based on the three provided absolute values
export function colorGradientValues ( value, colorFirst, colorSecond, colorThird, limitLow, limitMid, limitHigh ) {
  
  // get color components
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
    
    // value between mid and low
    if ( value < limitLow ) { value = limitLow }
    let range = limitMid - limitLow;
    let percent = ( value - limitLow ) / range;
    
    // gradient between first and second
    newColorR = Math.floor( c1r + ( ( c2r - c1r ) * percent ) );
    newColorG = Math.floor( c1g + ( ( c2g - c1g ) * percent ) );
    newColorB = Math.floor( c1b + ( ( c2b - c1b ) * percent ) );
    
  } else {
    
    // value between mid and low
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

// returns the R/G/B value of a hex color code
export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// returns the hex color code from a R/G/B value
export function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// takes a number as an input, rounds it to an integer and returns it as a string with the numbers in 3 digits groups separated by a space
export function numberGroupThousand( inputNumber ) {

  // split into groups of 3
  let tempArray = Math.round(inputNumber).toString.split("");
  

}

export const numberWithSeparator = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}