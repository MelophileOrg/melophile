let p5, delegate;
let width = window.innerWidth;
let height = window.innerHeight;

function findReference(point) {
    return point.data;
}
  
function drawCircle(circle, color) {
    color -= 1;
    if (color > 3)
    {
        color = 3;
    }
    colors = ['rgba(0,0,255,0.05)','rgba(0,255,0,0.05)','rgba(0,255,255,0.05)','rgba(255,0,0,0.05)'];
    p5.fill(colors[color]);
    p5.stroke(colors[color]);
    p5.strokeWeight(1);
    p5.ellipse(circle.x, circle.y, circle.r * 2, circle.r * 2);
}

class Point {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.data = data;
    }
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
    constructor(boundary, capacity, draw) {
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
        this.draw = draw;
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

        //this.drawSquares(ne, nw, se, sw);

        this.divided = true;
    }

    drawSquares(ne, nw, se, sw) {
    

        p5.fill('rgba(0,0,0,0)');
        p5.stroke('rgba(255,255,255,0.3)');
        p5.strokeWeight(1);
        p5.rectMode(RADIUS);
        p5.rect(ne.x, ne.y, ne.w, ne.h);
        p5.rect(nw.x, nw.y, nw.w, nw.h);
        p5.rect(se.x, se.y, se.w, se.h);
        p5.rect(sw.x, sw.y, sw.w, sw.h);
    }

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

class Boid {
    constructor(x, y, perception) {
        let angle = (Math.random() * 360) * Math.PI / 180;
        let xAngle = Math.sin(angle) * 5;
        let yAngle = Math.cos(angle) * 5;

        this.position = p5.createVector(x, y);
        this.velocity = p5.createVector(xAngle, yAngle);
        this.velocity.setMag(p5.random(2, 4));
        this.acceleration = p5.createVector();
        this.maxForce = .2;
        this.maxSpeed = 5;
        this.perception = perception;
    }
  
    edges() {
      if (this.position.x > width) {
        this.position.x = 0;
      } 
      else if (this.position.x < 0) {
        this.position.x = width;
      }
      if (this.position.y > height) {
        this.position.y = 0;
      } 
      else if (this.position.y < 0) {
        this.position.y = height;
      }
    }
  
    align(boids) {
      let perceptionRadius = this.perception;
      let steering = p5.createVector();
      let total = 0;
      for (let other of boids) {
        let d = p5.dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < perceptionRadius) {
          steering.add(other.velocity);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    separation(boids) {
      let perceptionRadius = this.perception;
      let steering = p5.createVector();
      let total = 0;
      for (let other of boids) {
        let d = p5.dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < perceptionRadius) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.div(d * d);
          steering.add(diff);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    cohesion(boids) {
      let perceptionRadius = this.perception;
      let steering = p5.createVector();
      let total = 0;
      for (let other of boids) {
        let d = p5.dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < perceptionRadius) {
          steering.add(other.position);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.sub(this.position);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    flock(boids) {
      let alignment = this.align(boids);
      let cohesion = this.cohesion(boids);
      let separation = this.separation(boids);
  
      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
      this.acceleration.add(separation);
    }
  
    update() {
      this.position.add(this.velocity);
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.acceleration.mult(0);
    }
  
    show() {
        p5.strokeWeight(6);
      p5.stroke(255);
      p5.point(this.position.x, this.position.y);
    }
  
    get x() {
      return this.position.x;
    }
  
    get y() {
      return this.position.y;
    }
}

const perception = 75;

const boundary = new Rectangle(width / 2, height / 2, width, height);

let boids = [];

export function main(_p5) {
    p5 = _p5

    p5.setup = _ => {
        var canvas = p5.createCanvas(width, height);
        canvas.parent("p5Canvas");
        for (let i = 0; i < 600; i++) {
            boids[i] = new Boid(p5.random(width), p5.random(height), perception);
        }
        p5.draw();
    }

    p5.draw = _ => {
        
        p5.background(0);
        let quadtree = new QuadTree(boundary, 1, false);

        for (let boid of boids) {
            let point = new Point(boid.x, boid.y, boid);
            quadtree.insert(point);
        }  
        for (let boid of boids) {
            let view = new Circle(boid.x, boid.y, perception / 2);
            let other = quadtree.query(view).map(findReference);
            boid.edges();
            boid.flock(other);
            boid.update();
            //drawCircle(view, other.length);
            boid.show();
        }
    }
}   

export function setDelegate(_delegate) {
  delegate = _delegate;
}