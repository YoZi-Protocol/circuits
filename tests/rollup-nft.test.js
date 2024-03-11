import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import merkleTree from '@applied-crypto/merkletree';
import { signMessage, derivePublicKey } from '@zk-kit/eddsa-poseidon';
import { wasm } from 'circom_tester';
import { describe, it } from 'mocha';
import { poseidon2, poseidon3, poseidon5 } from 'poseidon-lite';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);

describe('rollup nft', async () => {
  it('Should run circuit', async () => {
    const circuit = await wasm(
      path.join(__dirname, '../circuits/rollup-nft.circom'),
    );

    const chainId = `0x${Buffer.from(
      new TextEncoder().encode('17777'),
    ).toString('hex')}`;
    const assetId = `0x${Buffer.from(new TextEncoder().encode('yozi')).toString(
      'hex',
    )}`;

    const address = `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`;

    const expiration = 604800;

    const identifier = new Array(16).fill(0);
    identifier[0] = `0x${Buffer.from(new TextEncoder().encode('3')).toString(
      'hex',
    )}`;

    const delegate = new Array(16).fill(0);
    delegate[0] = `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`;

    const nonce = new Array(16).fill(0);
    nonce[0] = `0x2478e8e727b03d476daa7009af4427812c441d9dc1aa8b91ab167bfc3b9a8d40`;

    const select = poseidon3([chainId, assetId, address]);

    const zero = poseidon5([select, 0, 0, 0, 0]);
    const leaves = new Array(16).fill(zero);
    leaves[0] = poseidon5([
      select,
      identifier[0],
      delegate[0],
      expiration,
      nonce[0],
    ]);

    const leafHash = input => input;
    const nodeHash = (left, right) => poseidon2([left, right]);
    const tree = new merkleTree(leaves, leafHash, nodeHash);
    const root = tree.getRoot();

    const a = derivePublicKey('secret');
    const signature = signMessage('secret', root);

    const w = await circuit.calculateWitness({
      chain_id: chainId,
      asset_id: assetId,
      address,
      identifier,
      delegate,
      nonce,
      expiration,
      Ax: a[0],
      Ay: a[1],
      R8x: signature.R8[0],
      R8y: signature.R8[1],
      S: signature.S,
    });
    await circuit.checkConstraints(w);
  });
});
