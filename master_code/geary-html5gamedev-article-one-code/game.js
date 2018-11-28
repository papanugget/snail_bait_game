/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/
// ---------------------------------------------------------------------
// --------------------------- DECLARATIONS ----------------------------
// ---------------------------------------------------------------------

var canvas = document.getElementById('game-canvas'),
   context = canvas.getContext('2d'),

// Constants............................................................

   PLATFORM_HEIGHT = 8,  
   PLATFORM_STROKE_WIDTH = 2,
   PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',

   STARTING_RUNNER_LEFT = 50,
   STARTING_RUNNER_TRACK = 1,

// Track baselines...................................................

   TRACK_1_BASELINE = 323,
   TRACK_2_BASELINE = 223,
   TRACK_3_BASELINE = 123,

// Images............................................................
   
   background  = new Image(),
   runnerImage = new Image(),

   // Platforms.........................................................

   platformData = [  // One screen for now
      // Screen 1.......................................................
      {
         left:      10,
         width:     230,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,250,0)',
         opacity:   0.5,
         track:     1,
         pulsate:   false,
      },

      {  left:      250,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      400,
         width:     125,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      633,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,250,0)',
         opacity:   1.0, 
         track:     1,
         pulsate:   false,
      },
   ];

// ------------------------- INITIALIZATION ----------------------------

function initializeImages() {
   background.src = 'images/background_level_one_dark_red.png';
   runnerImage.src = 'images/runner.png';

   background.onload = function (e) {
      startGame();
   };
}


function drawBackground() {
   context.drawImage(background, 0, 0);
}

function calculatePlatformTop(track) {
   var top;

   if      (track === 1) { top = TRACK_1_BASELINE; }
   else if (track === 2) { top = TRACK_2_BASELINE; }
   else if (track === 3) { top = TRACK_3_BASELINE; }

   return top;
}

function drawPlatforms() {
   var pd, top;

   context.save(); // Save context attributes
   
   for (var i=0; i < platformData.length; ++i) {
      pd = platformData[i];
      top = calculatePlatformTop(pd.track);

      context.lineWidth = PLATFORM_STROKE_WIDTH;
      context.strokeStyle = PLATFORM_STROKE_STYLE;
      context.fillStyle = pd.fillStyle;
      context.globalAlpha = pd.opacity;

      // If you switch the order of the following two
      // calls, you get a different effect.

      context.strokeRect(pd.left, top, pd.width, pd.height);
      context.fillRect  (pd.left, top, pd.width, pd.height);
   }

   context.restore(); // Restore context attributes
}

function drawRunner() {
   context.drawImage(runnerImage,
      STARTING_RUNNER_LEFT,
      calculatePlatformTop(STARTING_RUNNER_TRACK) - runnerImage.height);
}

function draw(now) {
   drawBackground();
   drawPlatforms();
   drawRunner();
}

function startGame() {
   draw();
}

// Launch game.........................................................

initializeImages();
