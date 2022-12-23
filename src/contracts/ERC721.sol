// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC165.sol';
import './interfaces/IERC721.sol';

contract ERC721 is ERC165, IERC721 {

    mapping(uint256 => address) private _tokenOwner;            // map of tokenId to corresponding owner
    mapping(address => uint256) private _ownedTokensCount;      // map of owner address to count of tokens owned by that address
    mapping(uint256 => address) private _tokenApprovals;        // map of tokenId to corressponding approved addresses

    // declared in the IERC721 interface
    // event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);          // event to log transfer of tokens
    // event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);   // event to log approvals

    constructor() {
        registerInterface(bytes4(keccak256('balanceOf(bytes4)') ^ keccak256('ownerOf(bytes4)') ^ 
            keccak256('transferFrom(bytes4)') ^ keccak256('approve(bytes4)') ^ keccak256('getApproved(bytes4)')));
    }

    // function to return the balance tokens owned by the owner
    function balanceOf(address _owner) public override view returns(uint256) {
        require(_owner != address(0), 'ERC721: Invalid owner address');
        return _ownedTokensCount[_owner];
    }

    // funtion to return the owner of token
    function ownerOf(uint256 tokenId) public override view returns(address) {
        require(_tokenMinted(tokenId), 'ERC721: Token not yet minted');
        return _tokenOwner[tokenId];
    }
    
    // function to check if token has already been minted
    function _tokenMinted(uint256 tokenId) internal view returns(bool) {
        address owner = _tokenOwner[tokenId];                                       // get address that owns the token
        return owner != address(0);                                                 // check if the address is valid, if valid token minted
    }

    // function to mint a token
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), 'ERC721: should mint to a real address');         // requires address is valid
        require(!_tokenMinted(tokenId), 'ERC721: Token has already been minted');   // requires token is not already minted
        _tokenOwner[tokenId] = to;                                                  // store mapping of tokenId and owner
        _ownedTokensCount[to] += 1;                                                 // increment count of tokens owned by a particular owner
        emit Transfer(address(0), to, tokenId);                                     // emit event to log
    }

    // function to transfer token from one address to another
    function _transferFrom(address _from, address _to, uint256 _tokenId) internal {
        require(ownerOf(_tokenId) == _from, 'ERC721: Sender does not own the token');   // requires that the sender owns the token
        require(_to != address(0), 'ERC721: Invalid recipient zero address');           // requires that the recipient address is valid
        _approve(address(0), _tokenId);                                                 // clear approvals from previous owner
        _ownedTokensCount[_from] -= 1;                                                  // decrement token count of from address
        _ownedTokensCount[_to] += 1;                                                    // increment token count of to address
        _tokenOwner[_tokenId] = _to;                                                    // assign new owner to tokenId
        emit Transfer(_from, _to, _tokenId);                                            // emit event to log
    }

    // function to transfer token
    function transferFrom(address _from, address _to, uint256 _tokenId) public override {
        require(isApprovedOrOwner(_from, _tokenId), 'ERC721: Transfer caller is neither owner nor approved');
        _transferFrom(_from, _to, _tokenId);  
    }

    // function to update and emit the token approvals
    function _approve(address _to, uint256 _tokenId) internal virtual {
        _tokenApprovals[_tokenId] = _to;
        emit Approval(ownerOf(_tokenId), _to, _tokenId);
    }

    // function to approve transfer of token to another address
    function approve(address _to, uint256 _tokenId) public override {
        address owner = ownerOf(_tokenId);
        require(owner != _to, 'Error: Approval to current owner');
        require(msg.sender == owner, 'Error: Caller is not the owner of the token');
        _approve(_to, _tokenId);
    }

    // function to return whether the spender address is either the owner of the token or an approved address
    function isApprovedOrOwner(address spender, uint256 _tokenId) internal view returns(bool) {
        require(_tokenMinted(_tokenId), 'Error: Invalid tokenId');
        address owner = ownerOf(_tokenId);
        return (spender == owner || getApproved(_tokenId) == spender);
    }

    // function to get the address that has approval to transfer the provided tokenId
    function getApproved(uint256 tokenId) public override view returns (address) {
        return _tokenApprovals[tokenId];
    }
}