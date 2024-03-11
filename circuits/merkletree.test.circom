// SPDX-License-Identifier: GPL-3.0-only

pragma circom 2.0.0;

include "merkletree.circom";

template MerkleTreeTest(total_leaves) {
    signal input leaves[total_leaves];
    signal input root;

    component tree = MerkleTree(total_leaves);
    for(var i = 0 ; i < total_leaves; i++) {
        tree.leaves[i] <== leaves[i];
    }

    root === tree.root;
}

component main = MerkleTreeTest(32);
