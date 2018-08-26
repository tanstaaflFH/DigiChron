/* Intended to handle different screens for a fitbit clock-face.
   The class shows which screen is supposed to be currently active and 
   allow to loop forward and backward through the screens
 */

import document from "document";

export class Screens {

  /* constructor
     arguments: - numberScreen - the number of screens to be handled (Default: 1)
                - activeScreen - the screen that shall be active at first (Default: 0)
                - container - a DOM object that defines the screens
                              (one single parent DOM object needed for all screens)
                */
  constructor(numberScreens , activeScreen, container) {

    /* properties: - countScreens: the number of screens existing
                   - activeScreen: the number of the active screen (starting at 0)
                   - width: the screen width in pixel (same for all screens)
                   - height: the screen height in pixel (same for all screens)*/

    this.countScreens = ( numberScreens === undefined ) ? 0 : numberScreens;
    if ( activeScreen > this.countScreens ) { activeScreen == this.countScreens };
    this.activeScreen = ( activeScreen === undefined ) ? 0 : activeScreen;
    this.width = container.width;
    this.height = container.height;
    
  }
 
  // goto next Screen
  nextScreen = function() {
  
    if ( this.activeScreen === ( this.countScreens - 1 ) ) {
        this.activeScreen = 0;
    } else {
        this.activeScreen++;
    }
  
  }
 
  // goto previous Screen
  prevScreen = function() {
  
    if ( this.activeScreen === 0 ) {
        this.activeScreen = this.countScreens - 1;
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
