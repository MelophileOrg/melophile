let p5;
let delegate;
let data;

let width = 300;
let height = 300;

let max = width / 2 - 10;
let background = 25;

let displayed = true;


let points = [];
let keys = ['acousticness','danceability','energy','instrumentalness','liveness','speechiness','valence'];
let colors = ['rgb(255,165,0)','rgb(211,85,149)','rgb(174,209,67)','rgb(235,96,146)','rgb	(234,150,94)','rgb(94,108,234)','rgb	(248,245,152)','rgb	(255,51,51)','rgb	(214,173,243)'];

function centerDot(p5) {
  p5.stroke('rgb(100,200,250)');
  p5.strokeWeight(5);
  p5.point(width/2, height/2);
}

export function sendData(_data) {
  data = _data;
}

export function main(_p5) {
  p5 = _p5

  p5.setup = _ => {
    
    console.log(data);
  }

  p5.draw = _ => {
    
    p5.background(background);
    
    
    points = [];
    for (var i = 0; i < keys.length; i++)
    {
      let angle = (360 / keys.length) * i;
      let x = Math.cos(angle) * (data[keys[i]] * max) + width / 2;
      let y = Math.sin(angle) * (data[keys[i]] * max) + height / 2;
      points.push({x: x, y: y, value: keys[i]});
    }
    if (displayed) {
      console.log(points);
      displayed = false;
    }

    for (var i = 0; i < points.length; i++)
    {
      p5.strokeWeight(5);
      p5.stroke(colors[i]);
      p5.point(points[i].x, points[i].y);
      let last = i - 1;
      if (last < 0)
      {
        last = points.length - 1;
      }
      p5.strokeWeight(2);
      p5.line(points[last].x, points[last].y, points[i].x, points[i].y);
    }

    centerDot(p5);

    
    
    /*
  	p5.push();
  	p5.translate(p5.width / 2, p5.height / 2);
  	p5.noFill();
  	p5.stroke(255);
    for (var i = 0, step = 0; i < 360 * spinNum; i+=degree, step+=1) {
      const angle = p5.radians(i);
      var x = (radius + step) * p5.cos(angle);
      var y = (radius + step) * p5.sin(angle);
      p5.stroke(255);
  		p5.rotate(1);
      p5.ellipse(x, y, 15, 15);
      var r = p5.map(i, 0, 360 * spinNum, 0, 255);
      var rand = p5.random(255);
      p5.stroke(r, rand, r, r);
      p5.line(0, 0, x, y);
    }

  	p5.pop();

  	radius += speed;

  	if (radius > 360 || radius < -360 * 2 ) {
  		speed *= -1;
  	}

    notifyCurrentTime();
    */
  }
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