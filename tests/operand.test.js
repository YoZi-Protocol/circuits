import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { wasm } from 'circom_tester';
import { describe, it } from 'mocha';
import { poseidon3, poseidon5 } from 'poseidon-lite';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);

describe('operand', async () => {
  it('Should run circuit', async () => {
    const circuit = await wasm(
      path.join(__dirname, '../circuits/operand.test.circom'),
    );

    const chainId = `0x${Buffer.from(
      new TextEncoder().encode('17777'),
    ).toString('hex')}`;
    const assetId = `0x${Buffer.from(new TextEncoder().encode('yozi')).toString(
      'hex',
    )}`;
    const identifier = `0x${Buffer.from(new TextEncoder().encode('3')).toString(
      'hex',
    )}`;
    const address = `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`;
    const delegate = `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`;
    const expiration = `0x3c`;
    const period = 0x0;
    const nonce = `0x2478e8e727b03d476daa7009af4427812c441d9dc1aa8b91ab167bfc3b9a8d40`;

    const select = poseidon3([chainId, assetId, address]);

    const commitment = poseidon5([
      select,
      identifier,
      delegate,
      expiration + period,
      nonce,
    ]);

    const w = await circuit.calculateWitness({
      chain_id: chainId,
      asset_id: assetId,
      identifier,
      address,
      delegate,
      expiration,
      period,
      nonce,
      commitment,
    });
    await circuit.checkConstraints(w);
  });
});
