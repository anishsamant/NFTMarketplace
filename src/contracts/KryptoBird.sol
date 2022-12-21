// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

contract KryptoBird is ERC721Connector {

    string[] public kryptoBirdz;                        // list of kryptoBirdz that have been minted
    mapping(string => bool) private kryptoBirdzMinted;  // map of bird to whether its minted or not

    constructor() ERC721Connector('KryptoBird','Kbirdz') { }

    // function to mint a new kryptoBird
    function mint(string memory kryptoBird) public {
        require(!kryptoBirdzMinted[kryptoBird], 'Error: kryptobird already exists');        // requires that the kryptobird is not minted
        kryptoBirdz.push(kryptoBird);                                                       // push to list 
        uint256 _id = kryptoBirdz.length - 1;                                               // get the length of list to assign tokenId
        _mint(msg.sender, _id);                                                             // call the mint function
        kryptoBirdzMinted[kryptoBird] = true;                                               // maintain map of kryptobirds minted
    }
}