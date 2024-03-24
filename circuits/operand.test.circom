// SPDX-License-Identifier: GPL-3.0-only

pragma circom 2.0.0;

include "operand.circom";

template OperandTest() {
    signal input chain_id;
    signal input asset_id;

    signal input identifier;

    signal input address;
    signal input delegate;

    signal input expiration;
    signal input period;
    signal input nonce;

    signal input commitment;

    component selector = Poseidon(3);
    selector.inputs[0] <== chain_id;
    selector.inputs[1] <== asset_id;
    selector.inputs[2] <== address;

    component operand = Operand();

    operand.selector <== selector.out;
    operand.identifier <== identifier;
    operand.delegate <== delegate;
    operand.expiration <== expiration;
    operand.period <== period;
    operand.nonce <== nonce;

    commitment === operand.commitment;
}

component main = OperandTest();
