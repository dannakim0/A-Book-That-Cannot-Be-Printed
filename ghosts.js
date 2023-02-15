//danna kim
//13560673

var cirka;

function preload() {
    cirka = loadFont('assets/fonts/Cirka-Regular.otf');
}

//background colour changes according to the rotation of the phone
class TwoWorlds {

    constructor(angleMargin) {
        this.angleMargin = angleMargin;
    }

    path = 0;
    //series of inputs which need to occur before transformation of the background colour
    conditionsToTravel(rotationAxis, rotationMax, n1, n2, n3) {
        /*
        rotationAxis = which axis to rotate
        rotationMax = the maximum rotation
        n1 = first breakpoint (angle)
        n2 = second breakpoint (angle)
        n3 = third breakpoint (angle)
        */

        //clockRotation = rescales the angle on a positive cycle
        var clockRotation = (rotationAxis < 0) ? 2 * rotationMax + rotationAxis : rotationAxis;

        //each breakpoint (angle) have to be reached in corresponding order to travel to the other side
        if (this.path == 0 && n1 - this.angleMargin < clockRotation && clockRotation < n1 + this.angleMargin)
            this.path = 1;

        if (this.path == 1 && n2 - this.angleMargin < clockRotation && clockRotation < n2 + this.angleMargin)
            this.path = 2;

        if (this.path == 2 && n3 - this.angleMargin < clockRotation && clockRotation < n3 + this.angleMargin)
            this.path = 3;
    }

    colourSwitch = true;
    //changing background colour
    welcomeToAnotherWorld() {
        if (this.path == 3) {
            this.colourSwitch = !this.colourSwitch

            this.path = 0;
        }

        if (this.colourSwitch) {
            background('black');
            fill('white');
            excerpts()
        } else {
            background('white');
            fill('black');
            excerpts()
        }
    }
}


//circles move if mouse comes into proximity
class ScaredCircles {

    constructor(circleX, circleY, circleR, buttonR) {
        //circleX = X-position of circle
        this.circleX = circleX;
        //circleY = Y-position of circle
        this.circleY = circleY;
        //circleR = radius of circle
        this.circleR = circleR;
        //buttonR = radius of button
        this.buttonR = buttonR;
    }

    //determines if the mouse is near the circle
    stalkingMouse() {
        //rX = distance from circle center to mouse position on the x-axis
        var rX = mouseX - this.circleX;
        //rY = distance from circle center to mouse position on the y-axis
        var rY = mouseY - this.circleY;

        //hypotenuse is the two-dimensional distance from circle center to mouse position
        var hypotenuse = Math.sqrt(rX ** 2 + rY ** 2)

        /* 
        if hypotenuse <= button radius; then the mouse is inside
        if hypotenuse > button radius; then the mouse is outside

        check assets/diagrams/stalkingMouseDiagram.png for a visual representation 
        */
        return hypotenuse <= this.buttonR;
    }


    //determines where the circles should move
    escape(deltaX, deltaY) {
        /*
        deltaX is the movement amount of the circles on the x-axis
        deltaY is the movement amount of the circles on the y-axis
        ∴ deltaX & deltaY determines speed
        */

        //determining the direction of movement depending on if mouse is on the west or east of circle
        if (mouseX - this.circleX > 0)
            deltaX = -deltaX;
        //determining the direction of movement depending on if mouse is on north of south of circle
        if (mouseY - this.circleY > 0)
            deltaY = -deltaY;

        //moving circle position on the x-axis
        var circleX = this.circleX + deltaX;
        //moving circle position on the y-axis
        var circleY = this.circleY + deltaY;


        //prevent circles from going beyond the canvas

        var cStartX = this.circleR / 2;
        var cEndX = width - this.circleR / 2;

        var cStartY = this.circleR / 2;
        var cEndY = height - this.circleR / 2;

        if (circleX > cStartX && circleX < cEndX)
            this.circleX = circleX;

        if (circleY > cStartY && circleY < cEndY)
            this.circleY = circleY;
    }

    //sketches circle
    draw() {
        ellipse(this.circleX, this.circleY, this.circleR);
    }
}


var cnv;

function centerCanvas() {
    var canvasW = 1284;
    var canvasH = 2778;

    cnv = createCanvas(canvasW, canvasH, WEBGL);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

var circleArray = []
var circleCount;
var _x;

function setup() {
    centerCanvas();

    angleMode(DEGREES);

    noStroke();
    helloWorld = new TwoWorlds(20);

    var distanceX = 10;
    var distanceY = 10;
    var circleR = 2;
    var buttonR = 50;
    var i = 0;
    for (let x = 0; x < width; x += distanceX) {
        for (let y = 0; y < height; y += distanceY)
            circleArray[i++] = new ScaredCircles(x + circleR / 2, y + circleR / 2, circleR, buttonR);
    }
    circleCount = i;
}

textArray = ["As humans reshape the landscape, \nwe forget what was there before.",
    "What good will it do you to know? \nThe less you know, the better you will sleep. \nWhat better figure for the promises of modernity?",
    "Instead, we must wander through landscapes, \nwhere assemblages of the dead gather together with the living."
]

function excerpts() {
    textFont(cirka);
    textSize(12);
    textAlign(LEFT, CENTER);
    text(textArray[0], -windowWidth/2, 0);
}

function draw() {
    background('black');

    push();
    helloWorld.conditionsToTravel(rotationX, 180, 90, 180, 270);
    helloWorld.welcomeToAnotherWorld();
    pop();

    push();
    //rotateX(rotationX);

    translate(-width / 2, -height / 2);
    for (let i = 0; i < circleCount; i++) {
        if (circleArray[i].stalkingMouse()) {
            circleArray[i].escape(1, 1);
        }
        circleArray[i].draw();
    }
    pop();
}