// SPDX-License-Identifier: GPL-3.0-only

pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/eddsaposeidon.circom";
include "merkletree.circom";
include "operand.circom";

template NftRollup(N) {
    signal input chain_id;
    signal input asset_id;

    signal input address;

    signal input identifier[N];
    signal input delegate[N];
    signal input nonce[N];

    signal input expiration;

    signal input Ax;
    signal input Ay;
    signal input R8x;
    signal input R8y;
    signal input S;

    component selector = Poseidon(3);
    selector.inputs[0] <== chain_id;
    selector.inputs[1] <== asset_id;
    selector.inputs[2] <== address;

    component tree = MerkleTree(N);

    component operand[N];
    for (var i = 0; i < N; i++) {
        operand[i] = Operand();
        operand[i].selector <== selector.out;
        operand[i].identifier <== identifier[i];
        operand[i].delegate <== delegate[i];
        operand[i].expiration <== expiration;
        operand[i].nonce <== nonce[i];

        tree.leaves[i] <== operand[i].commitment;
    }

    component eddsa = EdDSAPoseidonVerifier();
    eddsa.enabled <== 1;
    eddsa.Ax <== Ax;
    eddsa.Ay <== Ay;
    eddsa.R8x <== R8x;
    eddsa.R8y <== R8y;
    eddsa.S <== S;
    eddsa.M <== tree.root;
}

component main {
    public [
        chain_id, asset_id,
        address,
        identifier, delegate,
        expiration,
        Ax, Ay
    ]
} = NftRollup(16);
