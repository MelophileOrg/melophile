var SimplexNoise = require('simplex-noise');

let p5;
let delegate;

let num = 500, frms = 180;
let theta;

export function main(_p5) {
  p5 = _p5

  p5.setup = _ => {
    var canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("p5Canvas");
    p5.background(100);

    p5.draw();
  }

  p5.draw = _ => {
  	p5.background(238);
    p5.translate(window.innerWidth/2, window.innerHeight/2);
    myShape(1, 34, 1, 9,0);
    myShape(0, 238, -1, 9,10);

    theta += Math.PI * 2 / frms;
    
  }
}

function myShape(s, f, dir, n, v) {
  if (s == 0) {
    p5.noStroke();
  } else {
    p5.stroke(34);
  }
  p5.fill('rgb(0,0,0)');
  p5.beginShape();
  for (var i=0; i<num; i++) {
    var angle = Math.PI * 2 /num*i;
    var minV = p5.map(Math.sin(dir*theta+dir*angle*3), -1, 1, 15, 150);
    var d = p5.map(Math.sin(angle*n), -1, 1, minV, 220+v);
    var x = Math.cos(angle)*d;
    var y = Math.sin(angle)*d;
    p5.vertex(x, y);
  }
  p5.endShape();
}

export function setDelegate(_delegate) {
  delegate = _delegate;
}