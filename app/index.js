import clock from "clock";
import { preferences } from "user-settings";
import document from "document";
import * as util from "../common/utils";
import * as localeUtil from "../common/locales";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { charger } from "power";
import { goals } from "user-activity";
import { StatsObject } from "../app/widgetStats";
import { Screens } from "../app/clsScreens";
import * as activity from "../app/activity";
import { display } from "display";

// get handler to the click Target rectangle
var clickTargetLH = document.getElementById("clickTargetLH");
var clickTargetRH = document.getElementById("clickTargetRH");

// initialize the screens object
var myScreens = new Screens(2, 0);

// get the user HR zones
var myHRZones = util.getHeartRateZones();

// initialize all objects for the stat elements
if ( !myHRZones ) { 
  var statHeartRate = new StatsObject("HeartRate" , 50, 180, false,  0 );
} else {
  var statHeartRate = new StatsObject("HeartRate", myHRZones[0][0], myHRZones[0][2], false,  0 );
}
var statBattery = new StatsObject("Battery", 0, 100, true, 0 );
var statSteps = new StatsObject("Steps", 0, goals.steps || 0, true, 1 );
var statStairs = new StatsObject("Floors", 0, goals.elevationGain || 0, true, 1 );
var statCalories = new StatsObject("Calories", 0, goals.calories || 0, true, 1 );
var statDistance = new StatsObject("Distance", 0, goals.distance || 0, true, 1 );
var statActive = new StatsObject("ActiveMinutes", 0, goals.activeMinutes || 0, true, 1 );

// Clock Elements
var myClock = document.getElementById("txtHourMin");
var myClockSmall = document.getElementById("txtHourMinSmall");
var myDate = document.getElementById("txtDate");
var myLnSec = document.getElementById("lnSec");
var myLnSecBG = document.getElementById("lnSecBG");
var lnSecBGWidth = myLnSecBG.width;
var lnSecBGX = myLnSecBG.x;

// Heart Rate Monitor
var hrm = new HeartRateSensor();

// *** SETTINGS / INITIALIZATIONS ***
// Update the clock every second
clock.granularity = "seconds";
// Begin monitoring the heart rate sensor
hrm.start();
// initialize the battery
updateBattery();

// Update the UI elements every tick
clock.ontick = (evt) => {
  
  // update the clock elements
  updateClock(evt.date);
  
  // update stat elements if 2nd window is shown
  if ( myScreens.activeScreen === 1 ) { 
  
    // get seconds value
    let seconds = evt.date.getSeconds();
  
    // update stats each second (only steps)
    statSteps.setValue( activity.getSteps(), true  );
   
    // update rest each 3 seconds
    if ( ( seconds % 3 ) === 0 ) { 
      statStairs.setValue( activity.getElevationGain(), true  ); 
      statCalories.setValue( activity.getCalories(), true );
      statActive.setValue( activity.getActiveMinutes(), true );
      statDistance.setValue( activity.getDistance(), true );
    }
    
  }
  
};

// read HR
hrm.onreading = function() {
    
  // only if display on
  if ( !display.on ) { return; }
  
  // update value
  let hrmValue = [
    raw: hrm.heartRate,
    pretty: hrm.heartRate ];

  statHeartRate.setValue( hrmValue, false );
  if (!myHRZones) {
    statHeartRate.setColorGradientIcon( 120 , true );
  } else {
    statHeartRate.setColorGradientIcon( myHRZones[0][1] , true );
  }
  
};

// read Battery
battery.onchange = function() {
    
  // only if display on
  if ( !display.on ) { return; }
  
  updateBattery();
  
};

// update Battery after charging 
charger.onchange = function() {
	
	if (!charger.charging) {
        updateBattery();
    } 
	
};

// click event for the Background Window
clickTargetRH.onclick = function() {
  
  // goto next Screen
  myScreens.nextScreen();
  
  // hide show the elements accordingly
  showElements ( myScreens.activeScreen );
  
};

clickTargetLH.onclick = function() {
  
  // goto previous Screen
  myScreens.prevScreen();
  
  // hide show the elements accordingly
  showElements ( myScreens.activeScreen );
  
};

// event called when the display is switched on or off
display.onchange = function() {
  
  if ( display.on ) {
      
      // start the heart rate monitor
      hrm.start(); 
      
      // update the clock elements
      let now = new Date();
      updateClock(now);
      
  } else {
      
      // stop the heart rate monitor for battery saving
      hrm.stop(); 
      
  }
  
};

function showElements( screenNumber ) {
  
  // get current time
  let now = new Date();
  
  // show or hide the stat and clock elements according to the set state
  if ( screenNumber === 0 ) {
    
    // stat elements
    statCalories.hide();
    statStairs.hide();
    statSteps.hide();
    statActive.hide();
    statDistance.hide();
    
    // clock elements, update before
    updateClock(now);
    myClock.style.display = "inline";
    myDate.style.display = "inline";
    myLnSec.style.display = "inline";
    myLnSecBG.style.display = "inline";
    myClockSmall.style.display = "none";
    
  } else {
    
    // update stats
    statCalories.setValue( activity.getCalories(), true );
    statStairs.setValue( activity.getElevationGain(), true  );
    statSteps.setValue( activity.getSteps(), true  );
    statActive.setValue( activity.getActiveMinutes(), true );
    statDistance.setValue( activity.getDistance(), true );
    
    // stat elements
    statCalories.show();
    statStairs.show();
    statSteps.show();
    statActive.show();
    statDistance.show();
    
    // clock elements, update before
    updateClock(now);
    myClock.style.display = "none";
    myDate.style.display = "none";
    myLnSec.style.display = "none";
    myLnSecBG.style.display = "none";
    myClockSmall.style.display = "inline";
    
  }
  
  // refresh the battery display
  updateBattery();
  
}

// update the battery elements
function updateBattery() {
    
  // update value
  let batteryValue = [ 
    raw: Math.floor( battery.chargeLevel ), 
    pretty: Math.floor( batter.chargeLevel ) + "%"];
    
  statBattery.setValue( batteryValue , false);
  statBattery.setColorGradient ( 50 , false );
  
}

// update the clock elements
function updateClock( inpDate ) {

  // Block variables --> now, hours, minutes (needed independently of which window is shown)
  let hours = inpDate.getHours();
  let mins = util.zeroPad(inpDate.getMinutes());
  let seconds = inpDate.getSeconds();
  
  // 12h or 24h format for hours (needed independently of which window is shown) 
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  
  // update clock, date and stat elements depending on which window is shown
  if ( myScreens.activeScreen === 0 ) { 
  
    // * Primary Window *
    // define seconds FG line
    let lnSecWidth = seconds * lnSecBGWidth / 60;
    let lnSecX = lnSecBGX + ( lnSecBGWidth / 2 ) - ( lnSecWidth / 2 );   
    
    // output Time and Date
    myClock.text = `${hours}:${mins}`;
    myDate.text = localeUtil.getDateStringLocale( inpDate, true );
    myLnSec.width = lnSecWidth;
    myLnSec.x = lnSecX;
    
  } else {
    
    // output Time
    myClockSmall.text = `${hours}:${mins}`;
    
  }    

};
