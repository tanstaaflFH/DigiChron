import document from "document";
import * as util from "../common/utils";

export class StatsObject {
  
  const GRAD_COLOR_RED = "#f83c40";
  const GRAD_COLOR_YELLOW = "#e4fa3c";
  const GRAD_COLOR_GREEN = "#00a629";

  /* constructor
     arguments: - identifier (string) - the substring used to define the ID of the index.gui DOM elements
                - minValue (number) - the minimum value of the stat used for the progress bar calculations
                - statGoal (number) - the maximum value of the stat used for the progress bar calculations (usually the goal)
                - hasStatusbar (bool) - if the stat element (DOM) has a status bar attached
                - isCircle (bool) - if the stat element (DOM) uses a rect/bar (false) or an arc/circle (true) for the progress bar
                */
  constructor(identifier , minValue, statGoal, hasStatusBar, isCircle) {
    
    this.hndlIcon = document.getElementById("icn" + identifier); // handler to the icon element
    this.hndlText = document.getElementById("txt" + identifier); // handler to the text element
    if ( hasStatusBar) {
        this.hndlProgBarBlur = document.getElementById("ProgBlur" + identifier); // handler to the progress bar highlighting blur element
        this.hndlProgBarBg = document.getElementById("ProgBg" + identifier); // handler to the progress bar background element
        this.hndlProgBar = document.getElementById("Prog" + identifier);   // handler to the progress bar element
        }
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
      this.hndlProgBarBg.style.display = "inline";
      this.hndlProgBar.style.display = "inline";
      if ( this.progress >=1 ) { this.hndlProgBarBlur.style.display = "inline" };
    }
    
  }
  
  // hide all stat elements
  hide() {
    
    this.hndlIcon.style.display = "none";
    this.hndlText.style.display = "none";
    if ( this.hasStatusBar ) {
      this.hndlProgBarBg.style.display = "none";
      this.hndlProgBar.style.display = "none";
      this.hndlProgBarBlur.style.display = "none";
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
        this.hndlProgBar.width = this.hndlProgBarBg.width * percent;
      } else {
        // sweep angle if it is an arc element <arc>
        this.hndlProgBar.sweepAngle = this.hndlProgBarBg.sweepAngle * percent;
      }
      // toggle highlight elements if goal reached
      if ( this.hndlProgBarBlur !== undefined ) {
          if ( percent >== 1 ) {
            this.hndlProgBarBlur.style.display = "inline";
          } else {
            this.hndlProgBarBlur.style.display = "none";  
          }
      }
    }
    
    this.progress = percent;
   
    if ( colorGradient && this.hasStatusBar ) {
    
      // update color of stat
      this.hndlProgBar.style.fill = util.colorGradientPercent ( percent, GRAD_COLOR_RED, GRAD_COLOR_YELLOW, GRAD_COLOR_GREEN );
    
    }
    
  }
  
  // get the current color
 color = function() {
    
    return this.hndlIcon.style.fill;
    
  }
  
  // set the color of the stat element progress bar
  setColor = function( newColor ) {
    
    this.hndlIcon.style.fill = newColor;
    if ( this.hasStatusBar ) { this.hndlProgBar.style.fill = newColor; }
    
  }
  
  // set the color of the stat element progress bar based on a color gradient and current value vs. min / goal / mid values
  setColorGradient = function( midValue, reverse ) {
    
    if ( this.hasStatusBar ) {
      if (reverse) {
        this.hndlProgBar.style.fill = util.colorGradientValues ( this.value, GRAD_COLOR_GREEN, GRAD_COLOR_YELLOW, GRAD_COLOR_RED, this.minValue, midValue, this.goal );
      } else {
        this.hndlProgBar.style.fill = util.colorGradientValues ( this.value, GRAD_COLOR_RED, GRAD_COLOR_YELLOW, GRAD_COLOR_GREEN, this.minValue, midValue, this.goal );      
      }
    }
    
  }

  // set the color of the Icon element progress bar based on a color gradient and current value vs. min / goal / mid values
  setColorGradientIcon = function( midValue, reverse ) {
    
    if (reverse) {
      this.hndlIcon.style.fill = util.colorGradientValues ( this.value, GRAD_COLOR_GREEN, GRAD_COLOR_YELLOW, GRAD_COLOR_RED, this.minValue, midValue, this.goal );
    } else {
      this.hndlIcon.style.fill = util.colorGradientValues ( this.value, GRAD_COLOR_RED, GRAD_COLOR_YELLOW, GRAD_COLOR_GREEN, this.minValue, midValue, this.goal );      
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

