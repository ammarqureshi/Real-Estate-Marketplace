const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');
const proof = require('../../zokrates/code/square/proof')


contract('Test SolnSquareVerifier', accounts => {
  let account_one = accounts[0];
  let account_two = accounts[1];

  beforeEach(async function () {
    this.verifierContract = await Verifier.new({ from: account_one });
    this.solnContract = await SolnSquareVerifier.new(this.verifierContract.address, { from: accounts[0] })
  })

  // Test if a new solution can be added for contract - SolnSquareVerifier
  it('add new solution for contract', async function () {

    let generatedKey = await this.solnContract.generateKey.call(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, { from: account_one });
    console.log(`generated key ${generatedKey}`);
    await this.solnContract.addSolution(account_two, 1, generatedKey);
    let doesSolnExist = await this.solnContract.doesUniqueSolutionExist.call(generatedKey, { from: account_one });
    assert.equal(doesSolnExist, true);
  })

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it('mint ERC721 token', async function () {
    let returnedBalanceBefore = await this.solnContract.balanceOf(account_two);
    assert.equal(returnedBalanceBefore, 0);
    await this.solnContract.mintToken(account_two, 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
    let returnedBalanceAfter = await this.solnContract.balanceOf(account_two);
    assert.equal(returnedBalanceAfter, 1);
  })

})


