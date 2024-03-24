// SPDX-License-Identifier: GPL-3.0-only

pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

template Operand() {
    signal input selector;

    signal input identifier;

    signal input delegate;

    signal input expiration;
    signal input period;
    signal input nonce;

    signal output commitment;

    component izi = IsZero();
    izi.in <== identifier;

    component izd = IsZero();
    izd.in <== delegate;

    component izn = IsZero();
    izn.in <== nonce;

    izi.out === izn.out;
    izd.out === izn.out;

    component mux = Mux1();
    mux.c[0] <== expiration + period;
    mux.c[1] <== 0;
    mux.s <== izn.out;

    component poseidon = Poseidon(5);
    poseidon.inputs[0] <== selector;
    poseidon.inputs[1] <== identifier;
    poseidon.inputs[2] <== delegate;
    poseidon.inputs[3] <== mux.out;
    poseidon.inputs[4] <== nonce;

    commitment <== poseidon.out;
}
