import document from "document";
import * as util from "../common/utils";

export class StatsObject {
  
  // constructor
  constructor(hndlIcon, hndlText, hndlProgressBar, hndlBackBar, minValue, statGoal, hasStatusBar, isCircle) {
    
    this.hndlIcon = document.getElementById(hndlIcon); // handler to the icon element
    this.hndlText = document.getElementById(hndlText); // handler to the text element
    if ( hasStatusBar) { this.hndlProgressBar = document.getElementById(hndlProgressBar); }  // handler to the progress bar element
    if ( hasStatusBar) { this.hndlBackBar = document.getElementById(hndlBackBar); } // handler to the progress bar background element
    this.minValue = minValue; // the minimum value of the stat (used mainly for heart rate)
    this.goal = statGoal; // the actual goal of the stat
    this.hasStatusBar = hasStatusBar; // if there is a status bar
    this.isCircle = isCircle; // define if it is a circle or bar element for the progress bar
    // default values
    this.value = 0; // the actual value of the stat
    this.progress = 0; // the current progress 0-1
    this.factor = 1; // if a factor shall be applied to the value before showing it as text (eg.: 1/1000 for m --> km)
    this.decimal = 0; // to indicate if any decimal values shall be shown (default: integer only)
    this.prefix = ""; // any prefix to be aded to the text value shown
    this.suffix = ""; // any suffic to be added to the text value shown

    
  }
  
  // show all stat elements
  show() {
    
    this.hndlIcon.style.display = "inline";
    this.hndlText.style.display = "inline";
    if ( this.hasStatusBar ) {
      this.hndlBackBar.style.display = "inline";
      this.hndlProgressBar.style.display = "inline";
    }
    
  }
  
  // hide all stat elements
  hide() {
    
    this.hndlIcon.style.display = "none";
    this.hndlText.style.display = "none";
    if ( this.hasStatusBar ) {
      this.hndlBackBar.style.display = "none";
      this.hndlProgressBar.style.display = "none";
    }
    
  }
  
  // set value of stat element, update all elements and progress
  // update progress bar color based on a color gradient
  // colorGradient === false --> no color update
  // colorGradient === true --> color update based on percent  
  setValue = function ( newValue, colorGradient ) {
    
    let percent;

    // calculate progress percentage, take into account not having a goal
    if ( this.goal === 0 ) 
      { percent = 0 } 
    else 
      { percent = ( newValue - this.minValue ) /  ( this.goal - this.minValue ) }
    
    // maximize to 1 (100%)
    if ( percent > 1 ) 
      { percent = 1 }
  
    this.value = newValue * this.factor;
    
    // actual text
    this.hndlText.text = this.prefix + ( util.numberWithSeparator ( this.value.toFixed(this.decimal) ) ) + this.suffix;
    
    // set the progress bar element
    if ( this.hasStatusBar ) {
      if ( !this.isCircle ) {
        // width if it is a bar element <rect>
        this.hndlProgressBar.width = this.hndlBackBar.width * percent;
      } else {
        // sweep angle if it is an arc element <arc>
        this.hndlProgressBar.sweepAngle = this.hndlBackBar.sweepAngle * percent;
      }
    }
    
    this.progress = percent;

    
    if ( colorGradient && this.hasStatusBar ) {
    
      // update color of stat
      this.hndlProgressBar.style.fill = util.colorGradientPercent ( percent, "#f83c40", "#e4fa3c", "#00a629" );
    
    }
    
  }
  
  // get the current color
 color = function() {
    
    return this.hndlIcon.style.fill;
    
  }
  
  // set the color of the stat element progress bar
  setColor = function( newColor ) {
    
    this.hndlIcon.style.fill = newColor;
    if ( this.hasStatusBar ) { this.hndlProgressBar = newColor; }
    
  }
  
  // set the color of the stat element progress bar based on a color gradient and current value vs. min / goal / mid values
  setColorGradient = function( midValue, reverse ) {
    
    if ( this.hasStatusBar ) {
      if (reverse) {
        this.hndlProgressBar.style.fill = util.colorGradientValues ( this.value, "#00a629", "#e4fa3c", "#f83c40", this.minValue, midValue, this.goal );
      } else {
        this.hndlProgressBar.style.fill = util.colorGradientValues ( this.value, "#f83c40", "#e4fa3c", "#00a629", this.minValue, midValue, this.goal );      
      }
    }
    
  }

  // set the color of the Icon element progress bar based on a color gradient and current value vs. min / goal / mid values
  setColorGradientIcon = function( midValue, reverse ) {
    
    if (reverse) {
      this.hndlIcon.style.fill = util.colorGradientValues ( this.value, "#00a629", "#e4fa3c", "#f83c40", this.minValue, midValue, this.goal );
    } else {
      this.hndlIcon.style.fill = util.colorGradientValues ( this.value, "#f83c40", "#e4fa3c", "#00a629", this.minValue, midValue, this.goal );      
    }
  }
  
}

export var batteryIcon = { 
     full: "Battery Full Landscape 24x24.png",
     threeQuarter: "Battery 75 Landscape 24x24.png",
     half: "Battery 50 Landscape 24x24.png",
     oneQuarter: "Battery 25 Landscape 24x24.png",       
     empty: "Battery Empty Landscape 24x24.png",       
}

