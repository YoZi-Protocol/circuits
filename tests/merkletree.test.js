import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import merkleTree from '@applied-crypto/merkletree';
import { wasm } from 'circom_tester';
import { describe, it } from 'mocha';
import { poseidon1, poseidon2 } from 'poseidon-lite';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);

describe('merkletree', async () => {
  it('Should run circuit', async () => {
    const circuit = await wasm(
      path.join(__dirname, '../circuits/merkletree.test.circom'),
    );

    const leaves = new Array(32).fill(0);

    leaves[0] = poseidon1([
      `0x${Buffer.from(new TextEncoder().encode('a')).toString('hex')}`,
    ]);
    leaves[1] = poseidon1([
      `0x${Buffer.from(new TextEncoder().encode('b')).toString('hex')}`,
    ]);
    leaves[2] = poseidon1([
      `0x${Buffer.from(new TextEncoder().encode('c')).toString('hex')}`,
    ]);
    leaves[3] = poseidon1([
      `0x${Buffer.from(new TextEncoder().encode('d')).toString('hex')}`,
    ]);
    leaves[4] = poseidon1([
      `0x${Buffer.from(new TextEncoder().encode('e')).toString('hex')}`,
    ]);

    const leafHash = input => input;
    const nodeHash = (left, right) => poseidon2([left, right]);
    const tree = new merkleTree(leaves, leafHash, nodeHash);
    const root = tree.getRoot();

    const w = await circuit.calculateWitness({
      leaves,
      root,
    });
    await circuit.checkConstraints(w);
  });
});
