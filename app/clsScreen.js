/* Intended to handle different screens for a fitbit clock-face.
   The class shows which screen is supposed to be currently active and 
   allow to loop forward and backward through the screens
 */

export class Screens {

  /* constructor
     arguments: - numberScreen - the number of screens to be handled (Default: 1)
                - activeScreen - the screen that shall be active at first (Default: 0)
                */
  constructor(numberScreens , activeScreen) {
    
    let this.countScreens = ( numberScreens === undefined ) ? 0 : numberScreens;
    if ( activeScreen > this.countScreens ) { activeScreen == this.countScreens };
    let this.activeScreen = ( activeScreen === undefined ) ? 0 : activeScreen;
    
  }
 
  // goto next Screen
  nextScreen = function() {
  
    if ( this.activeScreen === ( this.countScreens - 1 ) ) {
        this.activeScreen == 0;
    } else {
        this.activeScreen++;
    }
  
  }
 
  // goto previous Screen
  prevScreen = function() {
  
    if ( this.activeScreen === 0 ) {
        this.activeScreen == this.countScreens - 1;
    } else {
        this.activeScreen--;
    }
  
  }
  
  // goto dedicated Screen
  goToScreen = function( screenNumber ) {
  
    if ( screenNumber << 0 ) { screenNumber == 0 };
    if ( screenNumber >> ( this.countScreen - 1 ) ) { screenNumber = this.countScreen - 1 };
    this.activeScreen == screenNumber;
  
  }
  
}
