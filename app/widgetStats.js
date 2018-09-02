/* Intended to handle the different combination of DOM elements that represent one stat
   as an object.

    properties: - hndlIcon: the icon [DOM element]
                - hndlText: the text [DOM element]
                - hndlProgBarBlur: the blur around the status bar / arc [DOM element]
                - hndlProgBarStar: the star above the status bar / arc [DOM element]
                - hndlProgBarBg: the status bar / arc background (grey) [DOM element]
                - hndlProgBar: the status bar / arc background (slowly filling with color) [DOM element]
                - minValue: the minimum value for the stat (empty status bar) [number - default: 0]
                - goal: the goal / maximum value for the stat (full status bar) [number]
                - hasStatusBar: true / false if status bar DOM elements are present [boolean - default: false]
                - isCircle: true / false if the status bar element is made of arcs or rectangles [boolean - default: true]
                - value: the actual current value of the stat [object as returned by activity.js]
                - progress: the percentage of the actual value based on minValue / goal [number: 0-1]

    methods:  - show: sets the display property of all DOM elements to inline (deprecated)
              - hide: sets the display property of all DOM elements to none (deprecated)
              - setValue: set value of stat element, update all elements and progress, 
                          update progress bar color based on a color gradient,
                          show hide / blur and star depending on if goal reached
              - color: returns the current color of the stat icon as CSS hex color value
              - setColor: set the color of the stat icon and progress bar
              - setColorGradientProgBar: set the color of the progress bar based on a color gradient
              - setColorGradientIcon: set the color of the icon based on a color gradient
*/

import document from "document";
import * as util from "../common/utils";

  
var GRAD_COLOR_RED = "#f83c40";
var GRAD_COLOR_YELLOW = "#e4fa3c";
var GRAD_COLOR_GREEN = "#00a629";

export class StatsObject {


  /* constructor
     arguments: - identifier (string) - the substring used to define the ID of the index.gui DOM elements
                - minValue (number) - the minimum value of the stat used for the progress bar calculations
                - statGoal (number) - the maximum value of the stat used for the progress bar calculations (usually the goal)
                - hasStatusbar (bool) - if the stat element (DOM) has a status bar attached
                - isCircle (bool) - if the stat element (DOM) uses a rect/bar (false) or an arc/circle (true) for the progress bar
                */
  constructor(identifier , minValue, statGoal, hasStatusBar, isCircle) {
    
    //properties built from arguments
    this.hndlIcon = document.getElementById("icn" + identifier);
    this.hndlText = document.getElementById("txt" + identifier);
    if ( hasStatusBar) {
        this.hndlProgBarBlur = document.getElementById("ProgBlur" + identifier);
        this.hndlProgBarStar = document.getElementById("ProgStar" + identifier);
        this.hndlProgBarBg = document.getElementById("ProgBg" + identifier);
        this.hndlProgBar = document.getElementById("Prog" + identifier);
        }
    this.minValue = minValue || 0;
    this.goal = statGoal;
    this.hasStatusBar = hasStatusBar || false;
    this.isCircle = isCircle || true;

    // initialize default properties
    this.value = {
        raw: 0,
        pretty: "0"}; // the actual value of the stat
    this.progress = 0; // the current progress 0-1
    
  }
  
  // show all stat elements
  show() {
    
    this.hndlIcon.style.display = "inherit";
    this.hndlText.style.display = "inherit";
    if ( this.hasStatusBar ) {
      this.hndlProgBarBg.style.display = "inherit";
      this.hndlProgBar.style.display = "inherit";
      if ( this.progress >=1 ) {
          if ( this.hndlProgBarBlur !== null ) { this.hndlProgBarBlur.style.display = "inherit"; }
          if ( this.hndlProgBarStar !== null ) { this.hndlProgBarStar.style.display = "inherit"; }
      }
    }
    
  }
  
  // hide all stat elements
  hide() {
    
    this.hndlIcon.style.display = "none";
    this.hndlText.style.display = "none";
    if ( this.hasStatusBar ) {
      this.hndlProgBarBg.style.display = "none";
      this.hndlProgBar.style.display = "none";
      if ( this.hndlProgBarBlur !== null ) { this.hndlProgBarBlur.style.display = "none"; }
      if ( this.hndlProgBarStar !== null ) { this.hndlProgBarStar.style.display = "none"; }
    }
    
  }
  
  /* update stat elements
     - arguments: -newValue: the new value of the stat [object as returned by activity.js]  
                  -colorGradient: true / false to decide if the status bar color shall change with the progress [boolean]  */
  setValue = function ( newValue, colorGradient ) {
    
    let percent;

    // calculate progress percentage, take into account not having a goal
    if ( !this.goal ) { 
      percent = 0 
    } else { 
      percent = ( newValue.raw - this.minValue ) /  ( this.goal - this.minValue ) 
    }
    
    // maximize to 1 (100%)
    if ( percent > 1 ) { 
      percent = 1; 
    }

    // minimize to 0
    if ( percent < 0 ) {
      percent = 0;
    }
    
    // update object value property and text element
    this.value = newValue.raw;
    this.hndlText.text = newValue.pretty;
    
    // update the progress bar element
    if ( this.hasStatusBar ) {
      if ( !this.isCircle ) {
        // width if it is a bar element <rect>
        this.hndlProgBar.width = this.hndlProgBarBg.width * percent;
      } else {
        // sweep angle if it is an arc element <arc>
        this.hndlProgBar.sweepAngle = this.hndlProgBarBg.sweepAngle * percent;
      }
      // toggle highlight elements if goal reached
      if ( percent >= 1 ) {
          if ( this.hndlProgBarBlur !== null ) { this.hndlProgBarBlur.style.display = "inherit"; }
          if ( this.hndlProgBarStar !== null ) { this.hndlProgBarStar.style.display = "inherit"; }
      } else {
         if ( this.hndlProgBarBlur !== null ) { this.hndlProgBarBlur.style.display = "none"; }
          if ( this.hndlProgBarStar !== null ) { this.hndlProgBarStar.style.display = "none"; } 
      }
    }
    
    // set object progress property
    this.progress = percent;

    // update color of progress bar in relation to percentage
    if ( colorGradient && this.hasStatusBar ) {
      this.hndlProgBar.style.fill = util.colorGradientPercent ( percent, GRAD_COLOR_RED, GRAD_COLOR_YELLOW, GRAD_COLOR_GREEN );
    }
    
  }
  
  // get the current color
  color = function() {
    
    return this.hndlIcon.style.fill;
    
  }
  
  /* set the color of the stat element icon and progress bar
     - arguments: -newColor: the new color [string: CSS named color / fitbit named color / CSS hex color value] */
  setColor = function( newColor ) {
    
    this.hndlIcon.style.fill = newColor;
    if ( this.hasStatusBar ) { 
      this.hndlProgBar.style.fill = newColor; 
    }
    
  }

  /* set the color of the stat element progress bar based on a color gradient and current value vs. min / goal / mid values
     - arguments: -midValue: the absolute value for the middle of the color gradient [number]
                  -reverse: if the color gradient shall be reversed [boolean]*/
  setColorGradientProgBar = function( midValue, reverse ) {
    
    if ( this.hasStatusBar ) {
      if (reverse) {
        this.hndlProgBar.style.fill = util.colorGradientValues ( this.value, GRAD_COLOR_GREEN, GRAD_COLOR_YELLOW, GRAD_COLOR_RED, this.minValue, midValue, this.goal );
      } else {
        this.hndlProgBar.style.fill = util.colorGradientValues ( this.value, GRAD_COLOR_RED, GRAD_COLOR_YELLOW, GRAD_COLOR_GREEN, this.minValue, midValue, this.goal );      
      }
    }
    
  }

  /* set the color of the Icon element progress bar based on a color gradient and current value vs. min / goal / mid values
     - arguments: -midValue: the absolute value for the middle of the color gradient [number]
                  -reverse: if the color gradient shall be reversed [boolean]*/
  setColorGradientIcon = function( midValue, reverse ) {
    
    if (reverse) {
      this.hndlIcon.style.fill = util.colorGradientValues ( this.value, GRAD_COLOR_GREEN, GRAD_COLOR_YELLOW, GRAD_COLOR_RED, this.minValue, midValue, this.goal );
    } else {
      this.hndlIcon.style.fill = util.colorGradientValues ( this.value, GRAD_COLOR_RED, GRAD_COLOR_YELLOW, GRAD_COLOR_GREEN, this.minValue, midValue, this.goal );      
    }
  }

}