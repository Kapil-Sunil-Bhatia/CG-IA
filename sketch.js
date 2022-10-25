
const ptRadius = 9;
const maxPoints = 20;
const canvasWidth = 1400 / 1920;
const canvasHeight = 750 / 1080;

var points = [];
var numPoints;
var intermediatePts = Array(maxPoints);

var trace = Array(101);

var xOffset;
var yOffset;
var pointSelected;

var t, timeStep, n;
var showIntermediate = true;
var stopLoop = false;

var showChkX, showChkY, loopChkX, loopChkY, btnX, btnY;

function ShowCheckbox(event) {
    showIntermediate = !showIntermediate;
}

function LoopCheckbox(event) {
    if (stopLoop) {
        loop();
    }
    stopLoop = !stopLoop;
}

function ClearBezier() {
    points = [];
    numPoints = 0;
}

function setup() {
    createCanvas(canvasWidth * window.innerWidth, canvasHeight * window.innerHeight);
    t = 0.0;
    timeStep = 0;
    numPoints = 0;
    for (var i = 0; i < maxPoints; i++) {
        intermediatePts[i] = createVector();
    }

    showChkX = 10;
    showChkY = window.innerHeight - 40;
    loopChkX = showChkX + 180;
    loopChkY = showChkY;

    btnX = showChkX;
    btnY = showChkY - 40;

    checkbox = createCheckbox('Show Intermediate', true);
    checkbox.changed(ShowCheckbox);
    checkbox.position(showChkX, showChkY);

    checkbox = createCheckbox('Loop', true);
    checkbox.changed(LoopCheckbox);
    checkbox.position(loopChkX, loopChkY);

    button = createButton('Clear');
    button.position(btnX, btnY);
    button.mousePressed(ClearBezier);

    // todo use slider for frame rate
    // slider = createSlider(0, 60, 40);
    // slider.position(loopChkX + 150, window.innerHeight-40);
    // frameRate(60);
}

function draw() {
    background(250);

    stroke(0);
    fill(0);
    for (var i = 0; i < numPoints; i++) {
        circle(points[i].x, points[i].y, ptRadius);
        intermediatePts[i].x = points[i].x;
        intermediatePts[i].y = points[i].y;

        if (showIntermediate) {
            stroke(128);
            if (i > 0) {
                line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
            }
            noStroke();
        }
    }

    for (var j = 1; j <= numPoints; j++) {
        noStroke();
        fill(toColor(j - 1));
        for (i = 0; i < numPoints - j; i++) {
            intermediatePts[i].x = (1 - t) * intermediatePts[i].x + t * intermediatePts[i + 1].x;
            intermediatePts[i].y = (1 - t) * intermediatePts[i].y + t * intermediatePts[i + 1].y;

            if (showIntermediate) {
                circle(intermediatePts[i].x, intermediatePts[i].y, ptRadius);

                if (i > 0) {
                    stroke(toColor(j - 1));
                    line(intermediatePts[i - 1].x, intermediatePts[i - 1].y,
                        intermediatePts[i].x, intermediatePts[i].y);
                }
            }
        }
    }

    if (numPoints > 1) {
        trace[timeStep] = createVector(intermediatePts[0].x,
            intermediatePts[0].y,
            ptRadius);
        stroke(color(0, 0, 255));

        for (i = 0; i < timeStep; i++) {
            line(trace[i].x, trace[i].y, trace[i + 1].x, trace[i + 1].y);
        }
    }

    t += 0.01;
    timeStep++;
    if (timeStep > 100) {
        t = 0.0;
        timeStep = 0;
        if (stopLoop) {
            noLoop();
        }
    }
}

function toColor(n) {
    n = constrain(n, 0, 1023);
    let v = n * floor(1024 / numPoints);

    if (v < 256) {
        return color(255, v, 0);
    } else if (v < 512) {
        return color(v - 256, 255, 0);
    } else if (v < 768) {
        return color(0, 255, v - 512);
    } else {
        return color(0, v - 768, 255);
    }
}

function mousePressed() {
    pointSelected = -1;
    for (var i = 0; i < numPoints; i++) {
        if (dist(mouseX, mouseY, points[i].x, points[i].y) < ptRadius) {
            pointSelected = i;
            xOffset = mouseX - points[i].x;
            yOffset = mouseY - points[i].y;
            break;
        }
    }

    return false;
}

function mouseReleased(event) {
    let b = document.getElementById("defaultCanvas0").getBoundingClientRect();
    // ignore clicks outside of canvas
    if (event.clientX < b.left + b.width && event.clientX >= b.left
        && event.clientY > b.top && event.clientY < b.top + b.height) {
        // ignore clicks on pre-existing points
        if (pointSelected == -1 && numPoints < maxPoints) {
            var p = createVector(mouseX, mouseY);
            points.push(p);
            numPoints++;
            t = 0.0;
            timeStep = 0;
        }
    }

    return false;
}


function mouseDragged() {
    if (pointSelected != -1) {
        points[pointSelected].x = mouseX - xOffset;
        points[pointSelected].y = mouseY - yOffset;
    }

    return false;
}
