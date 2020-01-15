let kdtree = require('./kdTree.js');
let KDTree = kdtree.kdTree;

var points = [
    {x: 1, y: 2, z: 5},
    {x: 3, y: 4, z: 5},
    {x: 5, y: 6, z: 20},
    {x: 7, y: 8, z: -2}
];
  
  var distance = function(a, b){
    return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2);
  }
  
  var tree = new KDTree(points, distance, ["x", "y", "z"]);
  
  var nearest = tree.nearest({ x: 5, y: 5 , z: 3}, 1);
  
  console.log(nearest);


