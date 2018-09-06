/* main module for the clock face */

// imports
import * as mySettings from "./device-settings";
import { StatsObject } from "./widgetStats";
import { Screens } from "./clsScreen";
import * as activity from "./activity";
import * as hrZones from "./hrZones";

import * as util from "../common/utils";
import * as localeUtil from "../common/locales";

import document from "document";
import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { charger } from "power";
import { display } from "display";

import { goals } from "user-activity";
import { user } from "user-profile";
import { preferences } from "user-settings";

// *** SETTINGS / INITIALIZATIONS ***
// get handler to the click Target rectangle DOM
var clickTargetLH = document.getElementById("clickTargetLH");
var clickTargetRH = document.getElementById("clickTargetRH");

// get handle and initialize the screens DOM elements and screens object
var screen0 = document.getElementById("screen0");
var screen1 = document.getElementById("screen1");
var screen2 = document.getElementById("screen2");
var myScreens = new Screens(2, 0, document.getElementById("bgWindow") );

// initialize all objects for the stat elements + battery
var statBattery = new StatsObject("Battery", 0, 100, true, 0 ); // in top status bar
var statSteps = new StatsObject("Steps", 0, goals.steps || 0, true, 1 );
var statStairs = new StatsObject("Floors", 0, goals.elevationGain || 0, true, 1 );
var statCalories = new StatsObject("Calories", 0, goals.calories || 0, true, 1 );
var statDistance = new StatsObject("Distance", 0, goals.distance || 0, true, 1 );
var statActive = new StatsObject("ActiveMinutes", 0, goals.activeMinutes || 0, true, 1 );

// get handler for clock elements DOM and initialize some related variables
var myClock = document.getElementById("txtHourMin"); // clock on 1st screen
var myClockSmall = document.getElementById("txtHourMinSmall"); // clock on 2nd screen
var myClockHeader = document.getElementById("txtHourMinHeader"); // clock on 3rd screen
var myDate = document.getElementById("txtDate"); // date on 1st screen
var myLnSec = document.getElementById("lnSec"); // seconds bar on 1st screen
var lnSecBGWidth = Math.floor(0.8 * document.getElementById("bgWindow").width);
var lnSecBGX = Math.floor(0.1 * document.getElementById("bgWindow").width);
var dateFormat = 0; // default date format if companion settings do not work

// initialize all objects and variables for heart rate
var statHeartRate = new StatsObject("HeartRate" , 50, 180, false,  0 ); // in top status bar
var statHeartRateBig = new StatsObject("HeartRateBig" , 50, 180, false,  0 ); // on 3rd screen
var statHeartRateZoneText = document.getElementById("txtHeartRateZone"); // on 3rd screen
var hrm = new HeartRateSensor();
var myHRZones = hrZones.getHeartRateZones();
var hrBars = [ document.getElementById("hrBar0"),
						   document.getElementById("hrBar1"),
						   document.getElementById("hrBar2"),
						   document.getElementById("hrBar3") ]; // on 3rd screen
var hrPointer = document.getElementById("hrPointer"); // on 3rd screen
initializeHRelements(); // initialize hrBars size based on user HR zones

// refresh rate: each second
clock.granularity = "seconds";

// start a heart rate sensor
hrm.start();

// initialize the screen (hide / show elements)
showElements(myScreens.activeScreen);

// event handler: update clock, date and stats on each received clock tick event
clock.ontick = (evt) => {
  
  // update the clock elements
  updateClock(evt.date);
  
  // update stat elements if 2nd screen is shown
  if ( myScreens.activeScreen === 1 ) { 
  
    // get seconds value to decide which stats to update
    let seconds = evt.date.getSeconds();
  
    // update stats each second (only steps)
    statSteps.setValue( activity.getSteps(), true  );
   
    // update rest only each 3 seconds (save battery)
    if ( ( seconds % 3 ) === 0 ) { 
      statStairs.setValue( activity.getElevationGain(), true  ); 
      statCalories.setValue( activity.getCalories(), true );
      statActive.setValue( activity.getActiveMinutes(), true );
      statDistance.setValue( activity.getDistance(), true );
    }
    
  }

  // check if the last query for the HR zones is older than 24h and refresh if necessary
  if ( ( Math.abs(evt - myHRZones.date) / 36e5 ) > 24 ) {
    myHRZones = hrZones.getHeartRateZones();
    initializeHRelements();
  }

};

// event handler: update HR elements if a new HR is received by the HR monitor
hrm.onreading = function() {

  // only if display on (save battery)
  if ( display.on ) { 
    updateHR(); 
  }

};

// event handler: update battery elements if a change is received
battery.onchange = function() {

  // only if display on (save battery)
  if ( display.on ) { 
    updateBattery(); 
  }

};

// event handler: update battery elements if watch is disconnected from charger
charger.onchange = function() {

	if (!charger.charging) {
    updateBattery();
  }

};

// event handler: change screen if the right side of the watchface is tapped / clicked
clickTargetRH.onclick = function() {

  // goto next Screen
  myScreens.nextScreen();

  // hide show the elements accordingly
  showElements ( myScreens.activeScreen );

};

// event handler: change screen if the left side of the watchface is tapped / clicked
clickTargetLH.onclick = function() {

  // goto previous Screen
  myScreens.prevScreen();

  // hide show the elements accordingly
  showElements ( myScreens.activeScreen );

};

// event handler: start / stop the HR monitor and updated elements if the display is switched on / off
display.onchange = function() {

  if ( display.on ) {

    // display switched on:
    // start the heart rate monitor to enable HR readings
    hrm.start();

    // update the clock, battery and HR elements to show current values
    // not done for stats elements as they are in any case updated each 1-3 seconds
    let now = new Date();
    updateClock(now);
    updateBattery();
    updateHR();

  } else {

    // display switched off
    // stop the heart rate monitor (save battery)
    hrm.stop();

  }

};

// initialize all heart rate DOM elements (called after new user HR zones are retrieved)
function initializeHRelements() {

  // set the min / max value for the HR icon (used for the color scale)
  if ( myHRZones.isDefined ) {
    if ( myHRZones.hasCustom ) {
      // if user has defined custom zones
      statHeartRate.minValue = myHRZones.customStart;
      statHeartRate.goal = myHRZones.customEnd;
      statHeartRateBig.minValue = myHRZones.customStart;
      statHeartRateBig.goal = myHRZones.customEnd;
    } else {
      // if user uses the standard zones
      statHeartRate.minValue = myHRZones.fatBurn;
      statHeartRate.goal = myHRZones.peak;
      statHeartRateBig.minValue = myHRZones.fatBurn;
      statHeartRateBig.goal = myHRZones.peak;
    }
  } else {
    // if somehow no user HR zones could be retrieved use some default values
    statHeartRate.minValue = 80;
    statHeartRate.goal = 160;
    statHeartRateBig.minValue = 80;
    statHeartRateBig.goal = 160;
  }

  // set the width of the HR progress bar on 3rd screen
  hrZones.initalizeHRbars(myHRZones, hrBars, myScreens)

}

// update all heart rate DOM elements
function updateHR() {

  // get the value from the HR monitor
  let hrmValue = {
    raw: hrm.heartRate,
    pretty: hrm.heartRate };
  
  // set the value of the HR object in the top status bar
  statHeartRate.setValue( hrmValue, false );
  
  // set the color of the HR icon in the top status bar
  if (myHRZones.isDefined ) {
  	if (myHRZones.hasCustom ) {
      // if user has custom zone defined
  	  statHeartRate.setColorGradientIcon( Math.floor( (myHRZones.customEnd - myHRZones.customStart) / 2 ) , true )
  	} else {
      // if user uses standard zones
  	  statHeartRate.setColorGradientIcon( myHRZones.cardio, true );
  	}
  } else {
    // if user HR zones could not be retrieved correctly
    statHeartRate.setColorGradientIcon( 120 , true );
  }

  // update 3rd screen elements only if necessary
	if ( myScreens.activeScreen === 2 ) {

    // set value for HR object and HR zone text in center of screen
		statHeartRateBig.setValue( hrmValue, false );
    statHeartRateZoneText.text = localeUtil.translateHRzone(user.heartRateZone( hrmValue.raw ));
    
    // update position of indicator icon above progress bar
    hrZones.setHRBprogress(myHRZones, hrPointer, hrmValue.raw, myScreens);

    // set the color of the big HR icon
    if (myHRZones.isDefined ) {
      if (myHRZones.hasCustom ) {
        // if user has custom zone defined
        statHeartRateBig.setColorGradientIcon( Math.floor( (myHRZones.customEnd - myHRZones.customStart) / 2 ) , true )
      } else {
        // if user uses standard zones
        statHeartRateBig.setColorGradientIcon( myHRZones.cardio, true );
      }
    } else {
      // if user HR zones could not be retrieved correctly
      statHeartRateBig.setColorGradientIcon( 120 , true );
    }

  }

}

// show or hide DOM elements base on which screen is selected
function showElements( screenNumber ) {
  
  // get current time
  let now = new Date();
    
  //always update clock, battery and HR if the screen switches
  updateClock(now);
  updateBattery();
  updateHR();
  
  // show or hide the DOM elements (the complete SVG that defines a screen is shown or hidden)
  switch ( screenNumber ) {
    
    case 0:
 
      //show and hide elements
      screen0.style.display = "inline";
      screen1.style.display = "none";
      screen2.style.display = "none";
    
      break;
        
    case 1:     
  
      // update stats
      statCalories.setValue( activity.getCalories(), true );
      statStairs.setValue( activity.getElevationGain(), true  );
      statSteps.setValue( activity.getSteps(), true  );
      statActive.setValue( activity.getActiveMinutes(), true );
      statDistance.setValue( activity.getDistance(), true );

      //show and hide elements
      screen0.style.display = "none";
      screen1.style.display = "inline";
      screen2.style.display = "none";
    
      break;
        
    case 2:

      //show and hide elements
      screen0.style.display = "none";
      screen1.style.display = "none";
      screen2.style.display = "inline";
      
      break;
    
  }
  
}

// update the battery DOM elements
function updateBattery() {
    
  // get the battery value
  let batteryValue = { 
    raw: Math.floor( battery.chargeLevel ), 
    pretty: Math.floor( battery.chargeLevel ) + "%"
  };
  
  // set value of battery object
  statBattery.setValue( batteryValue , false);

  // set color of battery icon
  statBattery.setColorGradientProgBar ( 50 , false );
  
}

// update the clock DOM elements
function updateClock( inpDate ) {

  // Block variables --> now, hours, minutes
  let hours = inpDate.getHours();
  let mins = util.zeroPad(inpDate.getMinutes());
  let seconds = inpDate.getSeconds();
  
  // 12h or 24h format for hours based on user profile settings
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  
 // update clock and date elements depending on which screen is active
  switch ( myScreens.activeScreen ) {
      
    case 0:
      
      // define seconds foreground line
      let lnSecWidth = seconds * lnSecBGWidth / 60;
      let lnSecX = lnSecBGX + ( lnSecBGWidth / 2 ) - ( lnSecWidth / 2 );
      
      // set time (including seconds bar)
      myClock.text = `${hours}:${mins}`;
      myLnSec.width = lnSecWidth;
      myLnSec.x = lnSecX;      

      // set date (format based on settings and user locale)
      myDate.text = localeUtil.getDateStringLocale( inpDate, true, dateFormat );

      break;
        
    case 1:
    
      // output Time
      myClockSmall.text = `${hours}:${mins}`;
      
      break;
        
    case 2:
    
      // output Time
      myClockHeader.text = `${hours}:${mins}`;
      
      break;
  }

}

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return;
  }
  
  // manual hr zones reset
  if (data == "hrReset") {
    myHRZones = hrZones.getHeartRateZones();
    initializeHRelements();
    return;
  }

  // HR screen toggled
  if (data.hasHRScreen) {
      myScreens.countScreens = 3;
  } else {
      myScreens.countScreens = 2;
  }

  // date format changed
  if (data.dateFormat) {
    dateFormat = data.dateFormat.selected;
  }

}
mySettings.initialize(settingsCallback);