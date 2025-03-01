// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var verifier = artifacts.require('Verifier');


// - use the contents from proof.json generated from zokrates steps

const proof = require('../../zokrates/code/square/proof')

contract('Test Verifier', accounts => {
  const account_one = accounts[0]

  beforeEach(async function () {
    //initialise new mintable contract with first account address as owner
    this.contract = await verifier.new({ from: account_one });
  })

  // Test verification with correct proof
  it('test verification with correct proof', async function () {
    console.log('proof.proof.a: ' + proof.proof.a);
    console.log('proof.proof.b: ' + proof.proof.b);
    console.log('proof.proof.c: ' + proof.proof.c);
    console.log('proof.input: ' + proof.inputs);

    let isVerified = await this.contract.verifyTx.call(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, { from: account_one });
    assert.equal(isVerified, true, 'verification must be valid');
  })

  // Test verification with incorrect proof
  it('test verification with incorrect proof', async function () {

    const incorrect_inputs = ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000000"]
    let isVerified = await this.contract.verifyTx.call(proof.proof.a, proof.proof.b, proof.proof.c, incorrect_inputs, { from: account_one });
    assert.equal(isVerified, false, 'verification must be invalid');
  })


})



