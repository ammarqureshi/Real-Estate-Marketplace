pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
// import "./ZokratesVerifier.sol";
import "./verifier.sol";

import "openzeppelin-solidity/contracts/utils/Address.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721RealEstateToken {
    SquareVerifier public verifier;

    constructor(address verifierAddress) ERC721RealEstateToken() public {
        verifier = SquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint tokenId;
        address to;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint tokenId, address to);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address _to, uint _tokenId, bytes32 key) public {
        Solution memory _soln = Solution({tokenId: _tokenId, to: _to});
        solutions.push(_soln);
        uniqueSolutions[key] = _soln;
        emit SolutionAdded(_tokenId, _to);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mintToken(address _to,
            uint _tokenId,
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input) public
    {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(uniqueSolutions[key].to == address(0), "Solution is already being used");
        require(verifier.verifyTx(a, b, c, input), "Solution is not valid");
        addSolution(_to, _tokenId, key);
        super.mint(_to, _tokenId);
    }

    function doesUniqueSolutionExist(bytes32 key) public view returns(bool){
        return uniqueSolutions[key].to != address(0);
    }

   function generateKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public view returns(bytes32){
        return keccak256(abi.encodePacked(a, b, c, input));
    }
}
