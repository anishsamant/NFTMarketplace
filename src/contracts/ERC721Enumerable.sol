// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721.sol';
import './interfaces/IERC721Enumerable.sol';

contract ERC721Enumerable is ERC721, IERC721Enumerable {

    uint256[] private _allTokens;                                   // list of all tokenIds that have been minted
    mapping(uint256 => uint256) private _allTokensIndex;            // map of tokenIds to their corresponding index
    mapping(address => uint256[]) private _ownedTokens;             // map of owner to list of tokens owned by that owner
    mapping(uint256 => uint256) private _ownedTokensIndex;          // map of tokenIds to their corresponding index owned by that particular owner

    constructor() {
        registerInterface(bytes4(keccak256('tokenSupply(bytes4)') ^ keccak256('tokenOfOwnerByIndex(bytes4)') ^ 
            keccak256('tokenByIndex(bytes4)')));
    }

    // function to maintain a list of tokens minted and index of each token stored
    function _maintainTokenInfo(uint256 tokenId) private {
        _allTokens.push(tokenId);
        _allTokensIndex[tokenId] = _allTokens.length - 1;
    }

    // function to maintain the list of tokens owned by particular owner
    function _mainOwnerTokenInfo(address to, uint256 tokenId) private {
        _ownedTokens[to].push(tokenId);
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length - 1;
    }

    // function to return the total token supply
    function totalSupply() public override view returns(uint256) {
        return _allTokens.length;
    }

    // function to get tokenId by index
    function tokenByIndex(uint256 _index) public override view returns(uint256) {
        require(_index < totalSupply(), 'Error: Global index out of bounds');
        return _allTokens[_index];
    }

    // function to get tokenId by index as owned by that owner
    function tokenOfOwnerByIndex(address owner, uint256 _index) public override view returns(uint256) {
        require(_index < balanceOf(owner), 'Error: Owner index out of bounds');
        return _ownedTokens[owner][_index];
    }

    // function to mint tokens (overrides the mint definition in ERC721.sol contract)
    function _mint(address to, uint256 tokenId) internal override(ERC721) {
        super._mint(to, tokenId);
        _maintainTokenInfo(tokenId);
        _mainOwnerTokenInfo(to, tokenId);
    }
}