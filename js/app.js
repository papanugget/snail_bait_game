// global consts
const canvas = document.getElementById('game-canvas'),
    context = canvas.getContext('2d'),
    LEFT = 1,
    RIGHT = 2,

    BACKGROUND_VELOCITY = 42,
    PAUSED_CHECK_INTERVAL = 200,

    // platform consts
    PLATFORM_HEIGHT = 8,
    PLATFORM_STROKE_WIDTH = 2,
    PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',
    
    // platform scrolling offset = PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset
    PLATFORM_VELOCITY_MULTIPLIER = 4.35,
    RUNNER_HEIGHT = 43,
    // starting animation speeds
    STARTING_BACKGROUND_VELOCITY = 0,
    STARTING_PLATFORM_OFFSET = 0,
    STARTING_BACKGROUND_OFFSET = 0,

    // runner starting consts
    STARTING_RUNNER_LEFT = 50,
    STARTING_RUNNER_TRACK = 1,

    // track baselines
    TRACK_1_BASELINE = 323,
    TRACK_2_BASELINE = 223,
    TRACK_3_BASELINE = 123,

    // fps indicator
    fpsElement = document.getElementById('fps'),

    // images 
    background = new Image(),
    runnerImage = new Image(),

    // runner track
    runnerTrack = STARTING_RUNNER_TRACK,  

    // platform data
    platformData = [
        // screen 1
        {
            left: 10,
            width: 230,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(250,250,0)',
            opacity: 0.5,
            track: 1,
            pulsate: false,
        },
        {
            left: 250,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle:  'rgb(150,190,255)',
            opacity:  1.0,
            track: 2,
            pulsate: false,
        },
        {
            left: 400,
            width: 125,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(250,0,0)',
            opacity: 1.0,
            track: 3,
            pulsate: false,
        },
        {
            left: 633,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(250,250,0)',
            opacity: 1.0,
            track: 1,
            pulsate: false,
        },
        // screen 2
        {   
            left: 810,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(200,200,0)',
            opacity: 1.0,
            track: 2,
            pulsate: false,
        },
        {   
            left: 1025,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(80,140,230)',
            opacity: 1.0,
            track: 2,
            pulsate: false,
        },
        {   
            left: 1200,
            width: 125,
            height: PLATFORM_HEIGHT,
            fillStyle: 'aqua',
            opacity: 1.0,
            track: 3,
            pulsate: false,
        },
        {   
            left: 1400,
            width: 180,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(80,140,230)',
            opacity: 1.0,
            track: 1,
            pulsate: false,
        },
        // screen 3
        {   
            left: 1625,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(200,200,0)',
            opacity: 1.0,
            track: 2,
            pulsate: false,
        },
        {   
            left: 1800,
            width: 250,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(80,140,230)',
            opacity: 1.0,
            track: 1,
            pulsate: false,
        },
        {   
            left: 2000,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(200,200,80)',
            opacity: 1.0,
            track: 2,
            pulsate: false,
        },
        {   
            left: 2100,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle: 'aqua',
            opacity: 1.0,
            track: 3,
        },
        // screen 4
        {   
            left: 2269,
            width: 200,
            height: PLATFORM_HEIGHT,
            fillStyle: 'gold',
            opacity: 1.0,
            track: 1,
        },
        {   
            left: 2500,
            width: 200,
            height: PLATFORM_HEIGHT,
            fillStyle: '#2b950a',
            opacity: 1.0,
            track: 2,
            pulsate: true,
        }
    ];
// time
let lastAnimationFrameTime = 0,
    lastFpsUpdateTime = 0,
    fps = 60,
    platformVelocity,
    // velocities
    bgVelocity = STARTING_BACKGROUND_VELOCITY,
    // translation offsets 
    backgroundOffset = STARTING_BACKGROUND_OFFSET,
    platformOffset = STARTING_PLATFORM_OFFSET;

// functions 
function drawBackground() {
    // scroll bg
    context.translate(-backgroundOffset, 0);
    // init onscreen
    context.drawImage(background, 0, 0);
    // init offscreeen
    context.drawImage(background, background.width, 0);

    context.translate(backgroundOffset, 0);
}

function calculateFps(now) {
    let fps = 1000 / (now - lastAnimationFrameTime);
    lastAnimationFrameTime = now;
    if(now - lastFpsUpdateTime > 1000) {
        lastFpsUpdateTime = now;
        fpsElement.innerHTML = fps.toFixed(0) + ' fps';
    }
    return fps;
}

function calcPlatformTop(track) {
    let top;
    if(track === 1) {
        top = TRACK_1_BASELINE;
    } else if(track === 2) {
        top = TRACK_2_BASELINE;
    } else if(track === 3) {
        top = TRACK_3_BASELINE;
    }
    return top;
}

function turnLeft() {
    bgVelocity = -BACKGROUND_VELOCITY;
}

function turnRight() {
    bgVelocity = BACKGROUND_VELOCITY;
}

function drawPlatforms() {
    let pd, 
        top;
    
    context.save(); // save context attributes
    context.translate(-platformOffset, 0);  // scrolls platforms
    // iterate thru platformdata and draw / create a platform using each objects properties
    for(let i = 0; i < platformData.length; i++) {
        pd = platformData[i];
        top = calcPlatformTop(pd.track);

        context.lineWidth = PLATFORM_STROKE_WIDTH;
        context.strokeStyle = PLATFORM_STROKE_STYLE;
        context.fillStyle = pd.fillStyle;
        context.globalAlpha = pd.opacity;

        // if you switch the order of the following, you get different fx
        context.fillRect(pd.left, top, pd.width, pd.height);
        context.strokeRect(pd.left, top, pd.width, pd.height);
    }
    // restore context attributes
    context.restore();
}

function drawRunner() {
    context.drawImage(runnerImage, // image
                    STARTING_RUNNER_LEFT, // canvas left
                    calcPlatformTop(STARTING_RUNNER_TRACK) - runnerImage.height); // camvas top
}

function draw() {
    setPlatformVelocity();
    setOffsets();
    drawBackground();
    drawPlatforms();
    drawRunner();
}

function setPlatformVelocity() {
    platformVelocity = bgVelocity * PLATFORM_VELOCITY_MULTIPLIER;
}

function setOffsets() {
    setBackgroundOffset();
    setPlatformOffset();
}

function setBackgroundOffset() {
    let offset = backgroundOffset + bgVelocity / fps;
    offset > 0 && offset < background.width ? backgroundOffset = offset : backgroundOffset = 0;
}

function setPlatformOffset() {
    platformOffset += platformVelocity / fps;
    if(platformOffset > 2 * background.width) {
        turnLeft();
    } else if(platformOffset < 0) {
        turnRight();
    }
}

// animation
function animate(now) {
    fps = calculateFps(now);
    draw();
    requestAnimationFrame(animate);
}

// init
function initImgs() {
    background.src = '../images/background_level_one_dark_red.png';
    runnerImage.src = '../images/runner.png';

    background.onload = function(e) {
        startGame();
    };
}

function startGame() {
    // draw();
    window.requestAnimationFrame(animate);
}

// launch game
initImgs();

setTimeout(e => {
    turnRight();
}, 1000);