var ERC721MintableComplete = artifacts.require('ERC721RealEstateToken');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const account_five = accounts[4];


    describe('match erc721 spec', function () {

        var count = 4;
        beforeEach(async function () {

            //initialise new mintable contract with first account address as owner
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            for(var i=1; i<=count; i++){
                let result = await this.contract.mint(accounts[i], i, {from: account_one});
            }


        })

        it('should return total supply', async function () {

            let totalSupply = await this.contract.totalSupply();
            assert.equal(count, totalSupply), `total token supply should be ${count}`;

        })

        it('should get token balance of each address that holds token', async function () {
            for(var i=1; i<=count; i++){
                let returnedBalance = await this.contract.balanceOf(accounts[i]);
                assert.equal(1, returnedBalance, `balance not equal to 1`);
            }
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {

            let baseURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
            for(var i=1; i<=count; i++){
                let tokenURIReturned = await this.contract.getTokenURI(count);
                let expectedTokenURI = baseURI + count;

                assert.equal(expectedTokenURI, tokenURIReturned, `expected token URI should be ${expectedTokenURI}`);
            }
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferOwnership(account_two, {from: account_one});
            let newOwner = await this.contract.getOwner();
             assert.equal(account_two, newOwner, `new owner should be ${newOwner}`);

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {

            let permissionDenied = false;
            try{
                await this.contract.mint(account_three, 1, {from: account_two});
            }
            catch{
                permissionDenied = true;
            }

            assert.equal(permissionDenied, true, `user should not be able to mint token`);
        })

        it('should return contract owner', async function () {
            let owner = await this.contract.getOwner();
            assert.equal(account_one, owner, `contract owner should be ${owner}`);
        })

    });
})