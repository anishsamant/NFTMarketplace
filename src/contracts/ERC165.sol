// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IERC165.sol';

contract ERC165 is IERC165 {

    mapping(bytes4 => bool) private supportedInterfaces;

    constructor() {
        registerInterface(bytes4(keccak256('supportsInterface(bytes4)')));
    }

    // function to check if interface is supported or not
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return supportedInterfaces[interfaceId];
    }

    // function to register interface
    function registerInterface(bytes4 interfaceId) internal {
        require(interfaceId != 0xffffffff, 'Error: Invalid interface Id');
        supportedInterfaces[interfaceId] = true;
    }

}