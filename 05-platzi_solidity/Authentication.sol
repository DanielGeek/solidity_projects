// SPDX-License-Identifier: GLP-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Authentication {

    mapping(address => bool) public users;

    function authenticate () public {
        users[msg.sender] = true;
    }
}