// SPDX-License-Identifier: GPL-3.0-only

pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template MerkleTree(total_leaves) {
    signal input leaves[total_leaves];
    signal output root;

    var total_nodes = 2*total_leaves-1;
    signal merkle_tree[total_nodes];

    var start_leaves_pos = total_leaves-1;

    component poseidon[total_nodes];

    for(var i = total_nodes-1 ; i >= start_leaves_pos; i--) {
        merkle_tree[i] <== leaves[i-start_leaves_pos];
    }

    for(var i = start_leaves_pos - 1; i >= 0; i--) {
        poseidon[i] = Poseidon(2);
        poseidon[i].inputs[0] <== merkle_tree[2*i+1];
        poseidon[i].inputs[1] <== merkle_tree[2*i+2];
        merkle_tree[i] <== poseidon[i].out;
    }

    root <== merkle_tree[0];
}
