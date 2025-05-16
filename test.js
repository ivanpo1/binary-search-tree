import Tree from './index.js'

const arrayForCreating = Array.from({ length: 10 }, () => Math.floor(Math.random() * 999) + 1);
const arrayForInserting = Array.from({ length: 150 }, () => Math.floor(Math.random() * 999) + 1);

const tree = new Tree(arrayForCreating)

console.log('Is Tree balanced:', tree.isBalanced())

tree.levelOrder(node => console.log('levelOrder > ', node.value));
tree.preOrder(node => console.log('preOrder > ', node.value));
tree.postOrder(node => console.log('postOrder > ', node.value));
tree.inOrder(node => console.log('inOrder > ', node.value));

arrayForInserting.forEach(value => tree.insert(value))

console.log('Is Tree balanced:', tree.isBalanced())
console.log('Running reBalance %')
tree.reBalance();
console.log('Is Tree balanced:', tree.isBalanced())

tree.levelOrder(node => console.log('levelOrder > ', node.value));
tree.preOrder(node => console.log('preOrder > ', node.value));
tree.postOrder(node => console.log('postOrder > ', node.value));
tree.inOrder(node => console.log('inOrder > ', node.value));

tree.prettyPrint()
console.log('Is Tree balanced:', tree.isBalanced())