// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

contract KryptoBird is ERC721Connector {

    struct NFTProperties {
        bool isForSale;
        uint priceInWei;
        string url;
        string name;
    }

    NFTProperties[] public NFTsMinted;                                 // list of kryptoBirdz that have been minted
    mapping(string => bool) private kryptoBirdzMinted;          // map of bird to whether its minted or not

    constructor() ERC721Connector('KryptoBird','Kbirdz') { }

    // function to mint a new kryptoBird
    function mint(string memory kryptoBirdUrl, string memory name) public {
        require(!kryptoBirdzMinted[kryptoBirdUrl], 'Error: kryptobird already exists');        // requires that the kryptobird is not minted
        NFTsMinted.push(NFTProperties(false, 0, kryptoBirdUrl, name));                                                         
        uint256 _id = NFTsMinted.length - 1;                                                   // get the length of list to assign tokenId
        _mint(msg.sender, _id);                                                                // call the mint function
        kryptoBirdzMinted[kryptoBirdUrl] = true;                                               // maintain map of kryptobirds minted
    }

    // function to put NFT on sale
    function putForSale(string memory kryptoBirdUrl, string memory nftName, uint _priceInWei) public {
        uint len = NFTsMinted.length;
        for (uint i = 0; i < len; i++) {
            if (keccak256(abi.encodePacked(kryptoBirdUrl)) == keccak256(abi.encodePacked(NFTsMinted[i].url))) {
                NFTsMinted[i] = updateProperty(true, _priceInWei, kryptoBirdUrl, nftName);
                break;
            }
        } 
    }

    // function to buy NFT on sale
    function buyNFT(string memory kryptoBirdUrl, string memory nftName, uint _priceInWei) public payable {
        uint len = NFTsMinted.length;
        for (uint i = 0; i < len; i++) {
            if (keccak256(abi.encodePacked(kryptoBirdUrl)) == keccak256(abi.encodePacked(NFTsMinted[i].url))) {
                address currentOwner = ownerOf(i);
                transferFrom(ownerOf(i), msg.sender, i);
                NFTsMinted[i] = updateProperty(false, _priceInWei, kryptoBirdUrl, nftName);
                transferFund(payable(currentOwner));
                break;
            }
        }
    }

    function transferFund(address payable _to) private {
        _to.transfer(address(this).balance);
    }

    // function to update NFT property
    function updateProperty(bool isForSale, uint priceInWei, string memory url, string memory name) private pure returns (NFTProperties memory) {
        return (NFTProperties(isForSale, priceInWei, url, name));
    }
}