class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(arr) {
        this.root = this.buildTree(arr);
    }

    buildTree(arr) {
        const sortedArray = [...new Set(arr.sort((a, b) => a - b))]

        return this.#buildTreeRecursive(sortedArray, 0, sortedArray.length - 1)

    }

    buildTreeFromSortedArray(arr) {
        this.root = this.#buildTreeRecursive(arr, 0, arr.length-1)
    }

    #buildTreeRecursive(arr, start, end) {
        if (start > end) return null;

        let mid = start + Math.floor((end - start) / 2);

        let root = new Node(arr[mid]);

        root.left = this.#buildTreeRecursive(arr, start, mid - 1)
        root.right = this.#buildTreeRecursive(arr, mid + 1, end)

        return root;
    }

    insert(value) {
        const newNode = new Node(value);

        if (this.root === null) {
            this.root = newNode;
            return;
        }

        let current = this.root;

        while(true) {
            if (value === current.value) return;

            if (value < current.value) {
                if (current.left === null) {
                    current.left = newNode;
                    return;
                }
                current = current.left;

            } else {
                if (current.right === null) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            }
        }
    }

    deleteItem(value, recursive= false) {
        if (recursive){
            this.root = this.#deleteRecursive(this.root, value);
        }
        if (!recursive){
            this.#deleteIterative(value);
        }
    }

    #deleteIterative(value) {
        let current = this.root;
        let parent = null;
        let isLeftChild = false;

        while (current && current.value !== value) {
            parent = current;
            if (value < current.value) {
                current = current.left;
                isLeftChild = true;
            } else {
                current = current.right;
                isLeftChild = false;
            }
        }

        if (!current) return false;

        if (!current.left && !current.right) {
            if (!parent) this.root = null;
            else if (isLeftChild) parent.left = null;
            else parent.right = null;
        }

        else if (!current.left || !current.right) {
            const child = current.left || current.right;
            if (!parent) this.root = child;
            else if (isLeftChild) parent.left = child;
            else parent.right = child;
        }
        else {
            let successor = current.right;
            let successorParent = current;
            while (successor.left) {
                successorParent = successor;
                successor = successor.left;
            }

            current.value = successor.value;

            if (successorParent === current) {
                successorParent.right = successor.right;
            } else {
                successorParent.left = successor.right;
            }
        }

        return true;
    }

    #deleteRecursive(node, value) {
        if (!node) return null;

        if (value < node.value) {
            node.left = this.#deleteRecursive(node.left, value);
        } else if (value > node.value) {
            node.right = this.#deleteRecursive(node.right, value);
        } else {
            if (!node.left && !node.right) {
                return null;
            }
            else if (!node.left || !node.right) {
                return node.left || node.right;
            }
            else if (node.left && node.right) {
                const successor = this.#findMin(node.right);
                node.value = successor.value;
                node.right = this.#deleteRecursive(node.right, successor.value)
            }
        }
        return node;
    }

    #findMin(node) {
        while (node.left) node = node.left;
        return node;
    }

    find(value) {
        let current = this.root;

        while(current) {
            if (value === current.value) return current;

            if (value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            }
        }

        return 'Value not found'
    }



    levelOrder(callback) {
        if (!this.root) return [];

        const queue = [this.root]

        if (typeof callback !== 'function') {
            throw new Error('Callback function is required');
        }

        while (queue.length > 0) {
            const currentNode = queue.shift()

            callback(currentNode)

            if (currentNode.left) queue.push(currentNode.left)
            if (currentNode.right) queue.push(currentNode.right)
        }
    }

    levelOrderRecursive(callback) {
        if (typeof callback !== 'function') throw new Error("Callback must be a function");
        if (!this.root) return;
        this.#levelOrderRecursive(callback, [this.root])
    }

    #levelOrderRecursive(callback, queue) {
        if (queue.length === 0) return;
        const nextLevel = [];
        for (const node of queue) {
            callback(node);
            if (node.left) nextLevel.push(node.left)
            if (node.right) nextLevel.push(node.right)
        }

        this.#levelOrderRecursive(callback, nextLevel)
    }

    preOrder(callback) {
        if (typeof callback !== 'function') throw new Error("Callback must be a function");
        this.#preOrder(callback, this.root)
    }

    #preOrder(callback, node) {
        if(node === null) return;

        callback(node);
        this.#preOrder(callback, node.left)
        this.#preOrder(callback, node.right)
    }

    inOrder(callback) {
        if (typeof callback !== 'function') throw new Error("Callback must be a function");
        this.#inOrder(callback, this.root)
    }

    #inOrder(callback, node) {
        if(node === null) return;
        this.#inOrder(callback, node.left)
        callback(node)
        this.#inOrder(callback, node.right)
    }

    postOrder(callback) {
        if (typeof callback !== 'function') throw new Error("Callback must be a function");
        this.#postOrder(callback, this.root)
    }

    #postOrder(callback, node) {
        if(node === null) return;
        this.#postOrder(callback, node.left)
        this.#postOrder(callback, node.right)
        callback(node)
    }

    height(value) {
        const node = this.find(value);
        if (!node) return null;
        return this.#calculateHeight(node);
    }

    #calculateHeight(node) {
        if (!node) return -1;

        return 1 + Math.max(this.#calculateHeight(node.left), this.#calculateHeight(node.right))
    }

    depth(value) {
        let current = this.root;
        let depth = 0;

        while(current) {
            if (value === current.value) return depth;

            if (value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            }
            depth++;
        }

        return null;
    }

    isBalanced() {
        return this.#checkBalance(this.root) !== -1
    }

    #checkBalance(node) {
        if (!node) return 0;

        const leftHeight = this.#checkBalance(node.left)
        if (leftHeight === -1) return -1;

        const rightHeight = this.#checkBalance(node.right);

        if (rightHeight === -1) return -1;

        if(Math.abs(leftHeight - rightHeight) > 1) return -1;

        return 1 + Math.max(leftHeight, rightHeight)
    }

    reBalance() {
        const newTreeArray = [];

        const pushIt = (node) => newTreeArray.push(node.value)
        this.inOrder(pushIt)

        this.buildTreeFromSortedArray(newTreeArray)

    }

    prettyPrint(node = this.root, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    };
}

// const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324])
// const treeLetters = new Tree(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"])


function printValueOfNode(node) {

    console.log('> ', node.value)
}


// tree.levelOrder(printValueOfNode)
// tree.callLevelOrderRecursive(printValueOfNode)
// tree.preOrder(printValueOfNode)
// tree.inOrder(printValueOfNode)
// treeLetters.preOrder(printValueOfNode)
// treeLetters.inOrder(printValueOfNode)

// console.log(tree.height(8))
// console.log(tree.depth(1))


// tree.reBalance()

// const testing = Array.from({ length: 150 }, () => Math.floor(Math.random() * 999) + 1);
//
// testing.forEach(value => tree.insert(value))
// console.log('afterInsert', tree.isBalanced())
// tree.reBalance();
//
// console.log('afterRebalance', tree.isBalanced())

export default Tree;

