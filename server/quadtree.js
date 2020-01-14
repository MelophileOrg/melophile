

class Node {
    constructor(position, data) {
        this.position = position;
        this.data = data;
    }

    get position() {
        return this.position;
    }
}

class HyperCube { 
    constructor(positions, lengths) {
        this.positions = positions;
        this.lengths = lengths;
    }

    get left(dimention) {
        return this.positions[dimention] - this.lengths[dimention] / 2;
    }

    get right() {
        return this.positions[dimention] + this.lengths[dimention] / 2;
    }

    get position() {
        return this.position;
    }

    get lengths() {
        return this.lengths;
    }

    contains(node) {
        for (let i = 0; i < this.positions.length; i++) 
            if (!(node.position()[i] >= this.position[i] - this.lengths[i]) || !(node.position()[i] <= this.positions[i] + this.lengths[i]))
                return false;
        return true;
    }

    intersects(range) {
        for (let i = 0; i < this.positions.length; i++) 
            if (range.position()[i] - range.lengths()[i] > this.positions[i] + this.lengths[i] || range.position()[i] + range.length()[i] < this.positions[i] - this.lengths[i])
                return false;
        return true;
    }
}

class HyperSphere {
    constructor(position, r) {
        this.position = position;
        this.r = r;
        this.rPower = Math.pow(this.r, this.position.length);
    }

    contains(point) {
        return (point.position().reduce((total, num) => {
            return total + Math.pow(num, 2);
        }) <= this.rPower);
    }

    intersects(range) {
        let distance = [];
        for (let i = 0; i < range.position().length; i++) 
            distance.push(Math.abs(range.position()[i] - this.position[i]));
        let length = range.length();
        
        
        for (let i = 0; i < this.distance.length; i++) 
            if (distance[i] > (this.r + length[i])) 
                return false;
        for (let i = 0; i < this.distance.length; i++) 
            if (distance[i] <= length[i]) 
                return true;
        let edges = 0;
        for (let i = 0; i < this.length.length; i++) 
            edges += Math.pow((distance[i] - length[i]), 2);
        return edges <= this.rPower;
    }

    get position() {
        return this.position;
    }

    get radius() {
        return this.r;
    }
}

class Tree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.nodes = [];
        this.divided = false;
        this.subdivisions = [];
    }

    insert(node) {
        if (!this.boundary.contains(node)) 
            return false;
        
        if (this.nodes.length < this.capacity) {
            this.nodes.push(node);
            return true;
        }
        
        if (!this.divided) {
            this.subdivide();
        }
        for (let i = 0; i < this.subdivisions.length; i++) 
            if (this.subdivisions[i].insert(node))
                return true;
        return false;
    }

    subdivide() {
        let position = this.boundary.position();
        let lengths = this.boundary.lengths().forEach(element => {
            return element / 2;
        });;
        let dimentions = position.length;
        let newTrees = Math.pow(2, dimentions);

        for (let i = 0; i < newTrees; i++) {
            let newPosition = [];
            for (let j = 0; j < position.length; j++) {
                if (j )
            }
            let newBoundary = new HyperCube(newPosition, lengths);
        }

        // let x = this.boundary.x;
        // let y = this.boundary.y;
        // let w = this.boundary.w / 2;
        // let h = this.boundary.h / 2;

        const AMOUNT_OF_VARIABLES = 3;

        for (let i = 0; i < (1 << dimentions); i++) {
            let boolArr = [];
        
            for (let j = dimentions - 1; j >= 0; j--) {
                boolArr.push(Boolean(i & (1 << j)));
            }
        
        }


        000
        001
        110
        011
        111
        100
        101
        010







        let ne = new Rectangle(x + w, y - h, w, h);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w, y - h, w, h);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w, y + h, w, h);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w, y + h, w, h);
        this.southwest = new QuadTree(sw, this.capacity);

        if (quadTreeOn)
            this.drawSquares(ne, nw, se, sw);

        this.divided = true;
    }
}

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