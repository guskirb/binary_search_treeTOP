import Node from "./node.js";
import mergeSortFunc from "./merge.js";

class Tree {
    constructor(array) {
        this.tree = this.buildTree(array);
        this.treeDepth = 0;
        this.rightDepth = 0;
        this.leftDepth = 0;
        this.isBalanced;
    }

    buildTree(array) {
        if (array.length === 0) {
            return null;
        }
        array = this.filterSort(array);
        let mid = parseInt(array.length / 2);
        let root = new Node(array[mid]);

        root.left = this.buildTree(array.slice(0, mid));
        root.right = this.buildTree(array.slice(mid + 1));

        return root;
    }

    prettyPrint(node, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    }

    filterSort(array) {
        array = array.filter((value, index) =>
            array.indexOf(value) === index
        )
        return array = mergeSortFunc(array);
    }

    insert(value) {
        let current = this.tree;

        while (current.right || current.left) {
            if (value < current.data) {
                if (!current.left) {
                    break;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    break;
                }
                current = current.right;
            }
        }
        if (value < current.data) {
            current.left = new Node(value);
        } else {
            current.right = new Node(value);
        }
    }

    findValue(value) {
        let current = this.tree;

        while (current && current.data !== value) {
            if (value < current.data) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        if (current === null) {
            console.log("Enter a valid number")
        }
        return current;
    }

    deleteItem(value) {
        let current = this.tree;

        while (current) {
            if (value > current.data) {
                current = current.right;
            } else if (value < current.data) {
                current = current.left;
            } else {
                break;
            }
        }

        if (!current) {
            return console.log('Enter a valid value!');
        }

        let replace = current.right ? current.right : current.left;

        while (replace) {
            if (replace.data > value && replace.left) {
                replace = replace.left;
            } else if (replace.data < value && replace.right) {
                replace = replace.right;
            } else {
                break;
            }
        }

        let replaceParent = this.getParent(replace.data);

        current.data = replace.data;

        if (replaceParent.left && replaceParent.left.data === current.data) {
            if (!replaceParent.left.right && !replaceParent.left.left) {
                replaceParent.left = null;
            } else if (replaceParent.left.left !== null) {
                replaceParent.left = replaceParent.left.left;
            } else if (replaceParent.left.right) {
                replaceParent.left = replaceParent.left.right;
            }
        } else {
            if (!replaceParent.right.right && !replaceParent.right.left) {
                replaceParent.right = null;
            } else if (replaceParent.right.left !== null) {
                replaceParent.right = replaceParent.right.left;
            } else if (replaceParent.right.right) {
                replaceParent.right = replaceParent.right.right;
            }
        }
    }

    getParent(value) {
        let current = this.tree;
        let parent;

        while (current) {
            if (value > current.data) {
                if (current.right.data === value) {
                    parent = current;
                }
                current = current.right;
            } else if (value < current.data) {
                if (current.left.data === value) {
                    parent = current;
                }
                current = current.left;
            } else {
                break;
            }
        }
        return parent;
    }

    levelOrder(node, callback) {
        let queue = [];
        let array = [];
        let current = node;

        while (current) {
            if (!callback) {
                array.push(current.data);
            } else {
                array.push(callback(current.data))
            }

            if (current.left) {
                queue.push(current.left);
            }
            if (current.right) {
                queue.push(current.right);
            }
            current = queue.shift();
        }
        return array;
    }

    inOrder(node, callback) {
        if (!node) {
            return;
        }
        let array = [];

        if (node.left) {
            array = array.concat(this.inOrder(node.left, callback));
        }

        if (!callback) {
            array.push(node.data);
        } else {
            array.push(callback(node.data))
        }


        if (node.right) {
            array = array.concat(this.inOrder(node.right, callback));
        }
        return array;
    }

    preOrder(node, callback) {
        if (!node) {
            return;
        }

        let array = [];
        if (!callback) {
            array.push(node.data);
        } else {
            array.push(callback(node.data))
        }

        if (node.left) {
            array = array.concat(this.preOrder(node.left, callback));
        }
        if (node.right) {
            array = array.concat(this.preOrder(node.right, callback));
        }
        return array;
    }

    postOrder(node, callback) {
        if (!node) {
            return;
        }

        let array = [];

        if (node.left) {
            array = array.concat(this.postOrder(node.left, callback));
        }
        if (node.right) {
            array = array.concat(this.postOrder(node.right, callback));
        }
        if (!callback) {
            array.push(node.data);
        } else {
            array.push(callback(node.data))
        }
        return array;
    }

    height(value) {
        let current = this.findValue(value);
        let height = 0;

        while (current) {
            if (current.left) {
                height++
                current = current.left;
            } else if (current.right) {
                height++
                current = current.right;
            } else {
                break;
            }
        }
        return height;
    }

    depth(value) {
        let current = this.tree;
        let depth = 0;

        while (current && current.data !== value) {
            if (value < current.data) {
                current = current.left;
                depth++;
            } else {
                current = current.right;
                depth++;
            }
        }
        if (current === null) {
            return "Enter a valid number";
        }
        return depth;
    }

    totalDepth(node, depth = 0) {
        if (!node) {
            return;
        }
        if (!node.right && !node.left) {
            if (this.treeDepth < depth) {
                this.treeDepth = depth;
            }
            return depth;
        }
        this.totalDepth(node.left, depth + 1);
        this.totalDepth(node.right, depth + 1);

        return this.treeDepth;
    }

    getLeftDepth(node, depth = 0) {
        if (!node) {
            return;
        }
        if (!node.right && !node.left) {
            if (this.leftDepth < depth) {
                this.leftDepth = depth;
            }
            return depth;
        }
        this.getLeftDepth(node.left, depth + 1);
        this.getLeftDepth(node.right, depth + 1);

        return this.getLeftDepth;
    }

    rightDeep = 0;

    getRightDepth(node, depth = 0) {
        if (!node) {
            return;
        }
        if (!node.right && !node.left) {
            if (this.rightDepth < depth) {
                this.rightDepth = depth;
            }
            return depth;
        }
        this.getRightDepth(node.left, depth + 1);
        this.getRightDepth(node.right, depth + 1);

        return this.getRightDepth;
    }

    isBalanced() {
        this.rightDepth = 0;
        this.leftDepth = 0;
        this.getLeftDepth(this.tree.left);
        this.getRightDepth(this.tree.right);

        let left = this.leftDepth;
        let right = this.rightDepth;

        if (!(left === right) && !(left + 1 === right) && !(left === right + 1)) {
            return false;
        } else {
            return true;
        }
    }

    rebalance() {
        let array = this.inOrder(this.tree);
        this.tree = this.buildTree(array);
    }
}

function driver() {
    let newTree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    console.log('Creating tree from array');
    newTree.prettyPrint(newTree.tree);
    console.log('Is it balanced?');
    console.log(newTree.isBalanced());
    console.log('Level Order Traversal');
    console.log(newTree.levelOrder(newTree.tree));
    console.log('In Order Traversal');
    console.log(newTree.inOrder(newTree.tree));
    console.log('Pre Order Traversal');
    console.log(newTree.preOrder(newTree.tree));
    console.log('Post Order Traversal');
    console.log(newTree.postOrder(newTree.tree));
    console.log('Unbalancing Tree');
    newTree.insert(100);
    newTree.insert(125);
    newTree.insert(150);
    newTree.insert(175);
    newTree.prettyPrint(newTree.tree);
    console.log('Is it balanced?');
    console.log(newTree.isBalanced());
    newTree.rebalance();
    newTree.prettyPrint(newTree.tree);
    console.log('Is it balanced?');
    console.log(newTree.isBalanced());
}

driver();

function callbackDouble(value) {
    return value * 2;
}



