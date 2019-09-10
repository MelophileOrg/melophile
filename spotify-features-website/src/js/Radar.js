var SimplexNoise = require('simplex-noise');

const circleCount = 150;
const circlePropCount = 8;
const circlePropsLength = circleCount * circlePropCount;
const baseSpeed = 0.1;
const rangeSpeed = 1;
const baseTTL = 150;
const rangeTTL = 200;
const baseRadius = 100;
const rangeRadius = 200;
const rangeHue = 60;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(0,0%,5%,1)';

let p5;
let delegate;
let radius = 50;
let speed = 2;

let circles;
let circleProps;
let simplex;
let baseHue;

export function main(_p5) {
  p5 = _p5

  p5.setup = _ => {
    var canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("p5Canvas");
    p5.background(100);
    initCircles();
    p5.draw();
  	radius = 0;
  }

  p5.draw = _ => {
  	p5.background(0);
    p5.push();
      
    updateCircles();

  	p5.pop();
    notifyCurrentTime();
  }
}

function initCircles() {
    circleProps = new Float32Array(circlePropsLength);
    simplex = new SimplexNoise();
    baseHue = 220;
  
    let i;
  
    for (i = 0; i < circlePropsLength; i += circlePropCount) {
      initCircle(i);
    }
}

function initCircle(i) {
    let x, y, n, t, speed, vx, vy, life, ttl, radius, hue;
  
    x = Math.random(window.innerWidth);
    y = Math.random(window.innerHeight);
    n = simplex.noise3D(x * xOff, y * yOff, baseHue * zOff);
    t = Math.random(10);
    speed = baseSpeed + Math.random(rangeSpeed);
    vx = speed * Math.cos(t);
    vy = speed * Math.sin(t);
    life = 0;
    ttl = baseTTL + Math.random(rangeTTL);
    radius = baseRadius + Math.random(rangeRadius);
    hue = baseHue + n * rangeHue;
  
    circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
}

function updateCircles() {
    let i;
  
    baseHue++;
  
    for (i = 0; i < circlePropsLength; i += circlePropCount) {
      updateCircle(i);
    }
}

function updateCircle(i) {
    let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i;
    let x, y, vx, vy, life, ttl, radius, hue;
  
    x = circleProps[i];
    y = circleProps[i2];
    vx = circleProps[i3];
    vy = circleProps[i4];
    life = circleProps[i5];
    ttl = circleProps[i6];
    radius = circleProps[i7];
    hue = circleProps[i8];
  
    drawCircle(x, y, life, ttl, radius, hue);
  
    life++;
  
    circleProps[i] = x + vx;
    circleProps[i2] = y + vy;
    circleProps[i5] = life;
  
    (checkBounds(x, y, radius) || life > ttl) && initCircle(i);
}

function drawCircle(x, y, life, ttl, radius, hue) {
    p5.circle(x, y, radius);
}

function checkBounds(x, y, radius) {
    return (
        x < -radius ||
        x > window.innerWidth + radius ||
        y < -radius ||
        y > window.innerHeight + radius
    );
}


function notifyCurrentTime() {
  if (delegate !== undefined) {
    const message = p5.hour() + ":" + p5.minute() + ":" + p5.second();
    delegate(message);
  }
}

export function setDelegate(_delegate) {
  delegate = _delegate;
}