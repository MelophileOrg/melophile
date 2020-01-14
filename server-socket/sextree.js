// import { kMaxLength } from "buffer";

// class Node {
//     constructor(trackID, valence, danceability, energy, tempo, popularity, date) {
//         this.trackID = trackID;
//         this.u = valence;
//         this.v = energy;
//         this.w = danceability;
//         this.x = tempo;
//         this.y = popularity;
//         this.z = date;
//     }
// }

// class HyperCube { // 6-Dimentions
//     constructor(u, v, w, x, y, z, uLength, vLength, wLength, xLength, yLength, zLength) {
//         this.u = u;
//         this.v = v;
//         this.w = w;
//         this.x = x;
//         this.y = y;
//         this.z = z;
//         this.uLength = uLength;
//         this.vLength = vLength;
//         this.wLength = wLength;
//         this.xLength = xLength;
//         this.yLength = yLength;
//         this.zLength = zLength;
//     }

//     get uLeft() {
//         return this.u - this.uLength / 2;
//     }

//     get uRight() {
//         return this.u + this.uLength / 2;
//     }

//     get vLeft() {
//         return this.v - this.vLength / 2;
//     }

//     get vRight() {
//         return this.v + this.vLength / 2;
//     }

//     get wLeft() {
//         return this.w - this.wLength / 2;
//     }

//     get wRight() {
//         return this.w + this.wLength / 2;
//     }
    
//     get xLeft() {
//         return this.x - this.xLength / 2;
//     }

//     get xRight() {
//         return this.x + this.xLength / 2;
//     }
    
//     get yLeft() {
//         return this.y - this.yLength / 2;
//     }

//     get yRight() {
//         return this.y + this.yLength / 2;
//     }
    
//     get zLeft() {
//         return this.z - this.zLength / 2;
//     }

//     get zRight() {
//         return this.z + this.zLength / 2;
//     }

//     contains(node) {
//         return (node.u >= this.u - this.uLength &&
//             node.u <= this.u + this.uLength &&
//             node.v >= this.v - this.vLength &&
//             node.v <= this.v + this.vLength &&
//             node.w >= this.w - this.wLength &&
//             node.w <= this.w + this.wLength &&
//             node.x >= this.x - this.xLength &&
//             node.x <= this.x + this.xLength &&
//             node.y >= this.y - this.yLength &&
//             node.y <= this.y + this.yLength &&
//             node.z >= this.z - this.zLength &&
//             node.z <= this.z + this.zLength);
//     }

//     intersects(range) {
//         return !(range.v - range.vLength > this.v + this.vLength ||
//             range.v + range.vLength < this.v - this.vLength ||
//             range.u - range.uLength > this.u + this.uLength ||
//             range.u + range.uLength < this.u - this.uLength ||
//             range.w - range.wLength > this.w + this.wLength ||
//             range.w + range.wLength < this.w - this.wLength ||
//             range.x - range.xLength > this.x + this.xLength ||
//             range.x + range.xLength < this.x - this.xLength ||
//             range.y - range.yLength > this.y + this.yLength ||
//             range.y + range.yLength < this.y - this.yLength ||
//             range.z - range.zLength > this.z + this.zLength ||
//             range.z + range.zLength < this.z - this.zLength ||);
//     }
// }

// class HyperSphere { // 6 Dimentions
//     constructor(u, v, w, x, y , z, r) {
//         this.u = u;
//         this.v = v;
//         this.w = w;
//         this.x = x;
//         this.y = y;
//         this.z = z;
//         this.r = r;
//         this.rSextupled = this.r * this.r * this.r * this.r * this.r * this.r;
//     }

//     contains(point) {
//         let d = Math.pow((point.u - this.u), 2) + Math.pow((point.v - this.v), 2) + Math.pow((point.w - this.w), 2) + Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2) + Math.pow((point.z - this.z), 2);
//         return d <= this.rSextupled;
//     }

//     intersects(range) {
//         let uDist = Math.abs(range.u - this.u);
//         let vDist = Math.abs(range.v - this.v);
//         let wDist = Math.abs(range.w - this.w);
//         let xDist = Math.abs(range.x - this.x);
//         let yDist = Math.abs(range.y - this.y);
//         let zDist = Math.abs(range.z - this.z);
    
//         let r = this.r;
    
//         let uLength = range.uLength;
//         let vLength = range.vLength;
//         let wLength = range.wLength;
//         let xLength = range.xLength;
//         let yLength = range.yLength;
//         let zLength = range.zLength;
    
//         let edges = Math.pow((uDist - uLength), 2) + Math.pow((vDist - vLength), 2) + Math.pow((wDist - wLength), 2) + Math.pow((xDist - xLength), 2) + Math.pow((yDist - yLength), 2) + Math.pow((zDist - zLength), 2);
    
//         // no intersection
//         if (uDist > (r + uLength) || vDist > (r + vLength) || wDist > (r + wLength) || xDist > (r + xLength) || yDist > (r + yLength) || zDist > (r + zLength))
//             return false;
    
//         // intersection within the circle
//         if (uDist <= uLength || vDist <= vLength || wDist <= wLength || xDist <= xLength || yDist <= yLength || zDist <= zLength)
//             return true;
    
//         // intersection on the edge of the circle
//         return edges <= this.rSextupled;
//     }
// }

// class SexTree {
//     constructor(boundary, capacity) {
//         this.boundary = boundary;
//         this.capacity = capacity;
//         this.nodes = [];
//         this.divided = false;
//     }

//     insert(node) {
//         if (!this.boundary.contains(point)) {
//             return false;
//         }
//         if (this.nodes.length < this.capacity) {
//             this.nodes.push(node);
//             return true;
//         }
//         if (!this.divided) {
//             this.subdivide();
//         }
//         return (this.northeast.insert(node) || this.northwest.insert(node) ||
//         this.southeast.insert(node) || this.southwest.insert(node));
//     }

//     subdivide() {
//         let x = this.boundary.x;
//         let y = this.boundary.y;
//         let w = this.boundary.w / 2;
//         let h = this.boundary.h / 2;

//         let ne = new Rectangle(x + w, y - h, w, h);
//         this.northeast = new QuadTree(ne, this.capacity);
//         let nw = new Rectangle(x - w, y - h, w, h);
//         this.northwest = new QuadTree(nw, this.capacity);
//         let se = new Rectangle(x + w, y + h, w, h);
//         this.southeast = new QuadTree(se, this.capacity);
//         let sw = new Rectangle(x - w, y + h, w, h);
//         this.southwest = new QuadTree(sw, this.capacity);

//         if (quadTreeOn)
//             this.drawSquares(ne, nw, se, sw);

//         this.divided = true;
//     }
// }

class Node {
    constructor(position, left, right, data) {
        this.position = position;
        this.left = left;
        this.right = right;
        this.data = data;
    }

    getPosition() {
        return this.position;
    }

    setLeft(node) {
        this.left = node;
    }

    getLeft() {
        return this.left;
    }

    setRight(node) {
        this.right = node;
    }

    getRight() {
        return this.right;
    }

    equals(position) {
        for (let i = 0; i < this.position.length; i++) 
            if (this.position[i] != position[i])
                return false;
        return true;
    }

    getValue() {
        return this.data;
    }
}

class KDTree {
    constructor(dimentions) {
        this.root = null;
        this.dimentions = dimentions;
    }

    createNode(position, data) {
        return new Node(position, null, null, data);
    }

    insert(position, data) {
        this.insertRec(this.root, position, 0, data);
    }

    insertRec(node, point, depth, data) {
        if (node == null)
            return this.createNode(point, data);
        let cd = depth % this.dimentions;
        if (point[cd] < node.getPosition()[cd])
            node.setLeft(this.insertRec(node.getLeft(), point, depth + 1));
        else 
            node.setRight(this.insertRec(node.getRight(), point, depth + 1));
    }

    search(point) {
        return this.searchRec(this.root, point, 0);
    }

    searchRec(node, point, depth) {
        if (node == null) 
            return false;
        if (node.equals(point))
            return true;
        let cd = depth % this.dimentions;
        if (point[cd] < node.getPointVal(cd))
            return this.searchRec(node.getLeft(), point, depth + 1);
        return this.searchRec(node.getRight(), point, depth + 1);
    }

    query(point) {
        this.queryRec(this.root, point, 0);
    }

    queryRec(node, point, depth) {
        if (node == null) 
            return null;
        if (node.equals(point))
            return node.getValue();
        let cd = depth % this.dimentions;
        if (point[cd] < node.getPointVal(cd))
            return this.searchRec(node.getLeft(), point, depth + 1);
        return this.searchRec(node.getRight(), point, depth + 1);
    }

    toString(string, node, depth) {
        this.getValues(string, this.root, 0);
    }

    getValues(string, node, depth) {
        if (node == null) 
            return "";
        string += node.getValue();
        return string + this.getValues(string, node.getLeft(), depth + 1) + this.getValues(string, node.getRight(), depth + 1);
    }
}


function main() {
    console.log("Starting");
    let kdTree = new KDTree(3);
    let positions = [[0, 4, 2], [5, 6, 1], [1, 4, 3], [2, 2, 2], [9, 0, 5], [0, 8, 8]];
    let data = ["a", "s", "d", "f", "g", "h"];
    for (let i = 0; i < positions.length; i++) {
        kdTree.insert(positions[i], data[i]);
    }

    console.log("Searching (true):", kdTree.search(positions[0]));
    console.log("Searching (false):", kdTree.search([9,9,9]));
    console.log("Searching (value):", kdTree.query([0, 4, 2]));

    console.log(kdTree.toString());

}

main();