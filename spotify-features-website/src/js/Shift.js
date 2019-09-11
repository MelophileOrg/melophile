let width = window.innerWidth;
let height = window.innerHeight;
let p5;
let nodes = [];

class Point {
  constructor(x, y, data) {
      this.x = x;
      this.y = y;
      this.data = data;
  }
}

function findReference(point) {
  return point.data;
}

class Rectangle {
  constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
  }

  get left() {
      return this.x - this.w / 2;
  }

  get right() {
      return this.x + this.w / 2;
  }

  get top() {
      return this.y - this.h / 2;
  }

  get bottom() {
      return this.y + this.h / 2;
  }

  contains(point) {
      return (point.x >= this.x - this.w &&
          point.x <= this.x + this.w &&
          point.y >= this.y - this.h &&
          point.y <= this.y + this.h);
  }


  intersects(range) {
      return !(range.x - range.w > this.x + this.w ||
          range.x + range.w < this.x - this.w ||
          range.y - range.h > this.y + this.h ||
          range.y + range.h < this.y - this.h);
  }
}


const boundary = new Rectangle(width / 2, height / 2, width, height);

let num = 500, frms = 180;
let theta;

export function main(_p5) {
  p5 = _p5

  p5.setup = _ => {
    var canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("p5Canvas");
    p5.background(0);
    for (var i = 0; i < 50; i++)
    {
      nodes.push(new Node(Math.random() * width, Math.random() * height));
    }

    p5.draw();
  }

  p5.draw = _ => {
    p5.background(0);
    let quadtree = new QuadTree(boundary, 1, false);
    for (var i = 0; i < nodes.length; i++) {
      let point = new Point(nodes[i].x, nodes[i].y, nodes[i]);
      quadtree.insert(point);
    }  
    for (var i = 0; i < nodes.length; i++)
    {

      let view = new Circle(nodes[i].position.x, nodes[i].position.y, nodes[i].perception / 2);
      console.log(view);
      let other = quadtree.query(view).map(findReference);
      nodes[i].update();
      nodes[i].draw(other);
    }

    theta += Math.PI * 2 / frms;
    
  }
}

var Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

// return the angle of the vector in radians
Vector.prototype.getDirection = function() {
	return Math.atan2(this.y, this.x);
};

// set the direction of the vector in radians
Vector.prototype.setDirection = function(direction) {
	var magnitude = this.getMagnitude();
  this.x = Math.cos(angle) * magnitude;
  this.y = Math.sin(angle) * magnitude;
};

// get the magnitude of the vector
Vector.prototype.getMagnitude = function() {
	// use pythagoras theorem to work out the magnitude of the vector
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

// set the magnitude of the vector
Vector.prototype.setMagnitude = function(magnitude) {
	var direction = this.getDirection(); 
	this.x = Math.cos(direction) * magnitude;
	this.y = Math.sin(direction) * magnitude;
};

// add two vectors together and return a new one
Vector.prototype.add = function(v2) {
	return new Vector(this.x + v2.x, this.y + v2.y);
};

// add a vector to this one
Vector.prototype.addTo = function(v2) {
	this.x += v2.x;
  this.y += v2.y;
};

// subtract two vectors and reutn a new one
Vector.prototype.subtract = function(v2) {
	return new Vector(this.x - v2.x, this.y - v2.y);
};

// subtract a vector from this one
Vector.prototype.subtractFrom = function(v2) {
	this.x -= v2.x;
  this.y -= v2.y;
};

// multiply this vector by a scalar and return a new one
Vector.prototype.multiply = function(scalar) {
  return new Vector(this.x * scalar, this.y * scalar);
};

// multiply this vector by the scalar
Vector.prototype.multiplyBy = function(scalar) {
  this.x *= scalar;
  this.y *= scalar;
};

// scale this vector by scalar and return a new vector
Vector.prototype.divide = function(scalar) {
  return new Vector(this.x / scalar, this.y / scalar);
};

// scale this vector by scalar
Vector.prototype.divideBy = function(scalar) {
  this.x /= scalar;
  this.y /= scalar;
};

// Aliases
Vector.prototype.getLength = Vector.prototype.getMagnitude;
Vector.prototype.setLength = Vector.prototype.setMagnitude;

Vector.prototype.getAngle = Vector.prototype.getDirection;
Vector.prototype.setAngle = Vector.prototype.setDirection;

// Utilities
Vector.prototype.copy = function() {
  return new Vector(this.x, this.y);
};

Vector.prototype.toString = function() {
  return 'x: ' + this.x + ', y: ' + this.y;
};

Vector.prototype.toArray = function() {
  return [this.x, this.y];
};

Vector.prototype.toObject = function() {
  return {x: this.x, y: this.y};
};

Vector.prototype.random2D = function() {
  var angle = (Math.random() * 2 * Math.PI);
  var magnitude = Math.random() * 1;
  this.x = Math.cos(angle) * magnitude;
  this.y = Math.sin(angle) * magnitude;
}


class Node {
  constructor(x, y){
    this.perception = 300;
    this.position = new Vector(x, y);
    this.radius = 5;
    this.velocity = new Vector();
    this.velocity.random2D();
    this.acceleration = new Vector();
  }

  draw(other) {
    p5.circle(this.position.x, this.position.y, this.radius);
    for (var i = 0; i < other.length; i++)
    {
      let distance = Math.sqrt(Math.pow((this.position.x - other[i].position.x),2) + Math.pow((this.position.y - other[i].position.y),2));
      p5.stroke(255 * (1 - (distance / perception)));
      p5.line(this.position.x, this.position.y, other[i].position.x, other[i].position.y);
    }
    
  }

  update() {
    this.velocity = this.velocity.add(this.acceleration);
    this.position = this.position.add(this.velocity);
    if (this.position.x > width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = height;
  }
}



class Circle {
  constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.rSquared = this.r * this.r;
  }

  contains(point) {
      // check if the point is in the circle by checking if the euclidean distance of
      // the point and the center of the circle if smaller or equal to the radius of
      // the circle
      let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
      return d <= this.rSquared;
  }

  intersects(range) {
  
      let xDist = Math.abs(range.x - this.x);
      let yDist = Math.abs(range.y - this.y);
  
      // radius of the circle
      let r = this.r;
  
      let w = range.w;
      let h = range.h;
  
      let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);
  
      // no intersection
      if (xDist > (r + w) || yDist > (r + h))
          return false;
  
      // intersection within the circle
      if (xDist <= w || yDist <= h)
          return true;
  
      // intersection on the edge of the circle
      return edges <= this.rSquared;
  }
}

class QuadTree {
  constructor(boundary, capacity)
  {
    if (!boundary) {
        throw TypeError('Boundary is null or undefined.');
    }
    if (!(boundary instanceof Rectangle)) {
        throw TypeError('boundary should be a Rectangle');
    }
    if (typeof capacity !== 'number') {
        throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
    }
    if (capacity < 1) {
        throw RangeError('capacity must be greater than 0');
    }
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  insert(point) {
      if (!this.boundary.contains(point)) {
          return false;
      }
      if (this.points.length < this.capacity) {
          this.points.push(point);
          return true;
      }
      if (!this.divided) {
          this.subdivide();
      }
      return (this.northeast.insert(point) || this.northwest.insert(point) ||
      this.southeast.insert(point) || this.southwest.insert(point));
  }

  subdivide() {
      let x = this.boundary.x;
      let y = this.boundary.y;
      let w = this.boundary.w / 2;
      let h = this.boundary.h / 2;

      let ne = new Rectangle(x + w, y - h, w, h);
      this.northeast = new QuadTree(ne, this.capacity);
      let nw = new Rectangle(x - w, y - h, w, h);
      this.northwest = new QuadTree(nw, this.capacity);
      let se = new Rectangle(x + w, y + h, w, h);
      this.southeast = new QuadTree(se, this.capacity);
      let sw = new Rectangle(x - w, y + h, w, h);
      this.southwest = new QuadTree(sw, this.capacity);

      // this.drawSquares(ne, nw, se, sw);

      this.divided = true;
  }

  // drawSquares(ne, nw, se, sw) {


  //     fill('rgba(0,0,0,0)');
  //     stroke('rgba(255,255,255,0.3)');
  //     strokeWeight(1);
  //     rectMode(RADIUS);
  //     rect(ne.x, ne.y, ne.w, ne.h);
  //     rect(nw.x, nw.y, nw.w, nw.h);
  //     rect(se.x, se.y, se.w, se.h);
  //     rect(sw.x, sw.y, sw.w, sw.h);
  // }

  query(range, found) {
      if (!found) {
          found = [];
      }

      if (!range.intersects(this.boundary)) {
          return found;
      }

      for (let p of this.points) {
          if (range.contains(p)) {
              found.push(p);
          }
      }
      if (this.divided) {
          this.northwest.query(range, found);
          this.northeast.query(range, found);
          this.southwest.query(range, found);
          this.southeast.query(range, found);
      }
      return found;
  }

  closest(point, count, maxDistance) {
    if (typeof point === "undefined") {
      throw TypeError("Method 'closest' needs a point");
    }
    if (typeof count === "undefined") {
      count = 1;
    }

    // Limit to number of points in this QuadTree
    if (this.length == 0) {
      return [];
    }
    if (this.length < count) {
      return this.points;
    }

    if (typeof maxDistance === "undefined") {
      // A circle that contains the entire QuadTree
      const outerReach = Math.sqrt(
          Math.pow(this.boundary.w, 2) + Math.pow(this.boundary.h, 2)
      );
      // Distance of query point from center
      const pointDistance = Math.sqrt(
          Math.pow(point.x, 2) + Math.pow(point.y, 2)
      );
      // One QuadTree size away from the query point
      maxDistance = outerReach + pointDistance;
    }

    // Binary search with Circle queries
    let inner = 0;
    let outer = maxDistance;
    let limit = 8; // Limit to avoid infinite loops caused by ties
    let points;
    while (limit > 0) {
      const radius = (inner + outer) / 2;
      const range = new Circle(point.x, point.y, radius);
      points = this.query(range);
      if (points.length === count) {
        return points; // Return when we hit the right size
      } 
      else if (points.length < count) {
        inner = radius;
      } 
      else {
        outer = radius;
        limit --;
      }
    }
    // Sort by squared distance
    points.sort(
      (a, b) => {
        const aDist = Math.pow(point.x - a.x, 2) +
          Math.pow(point.y - a.y, 2);
        const bDist = Math.pow(point.x - b.x, 2) +
          Math.pow(point.y - b.y, 2);
        return aDist - bDist;
      }
    );
    // Slice to return correct count (breaks ties)
    return points.slice(0, count);
  }

  forEach(fn) {
    this.points.forEach(fn);
    if (this.divided) {
      this.northeast.forEach(fn);
      this.northwest.forEach(fn);
      this.southeast.forEach(fn);
      this.southwest.forEach(fn);
    }
  }

  merge(other, capacity) {
    let left = Math.min(this.boundary.left, other.boundary.left);
    let right = Math.max(this.boundary.right, other.boundary.right);
    let top = Math.min(this.boundary.top, other.boundary.top);
    let bottom = Math.max(this.boundary.bottom, other.boundary.bottom);
    let height = bottom - top;
    let width = right - left;
    let midX = left + width / 2;
    let midY = top + height / 2;
    let boundary = new Rectangle(midX, midY, width, height);
    let result = new QuadTree(boundary, capacity);
    this.forEach(point => result.insert(point));
    other.forEach(point => result.insert(point));

    return result;
  }

  get length() {
    let count = this.points.length;
    if (this.divided) {
      count += this.northwest.length;
      count += this.northeast.length;
      count += this.southwest.length;
      count += this.southeast.length;
    }
    return count;
  }
}






export function setDelegate(_delegate) {
  delegate = _delegate;
}