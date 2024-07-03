// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Calculation(address indexed sender, string operation, uint256 operand1, uint256 operand2, uint256 result);

    constructor() payable {
        owner = payable(msg.sender);
        balance = 0;
    }

    function add(uint256 _operand1, uint256 _operand2) public payable {
        require(msg.value >= 1 ether, "Insufficient payment. Add operation requires 1 ETH.");
        balance += msg.value;
        
        uint256 result = _operand1 + _operand2;
        emit Calculation(msg.sender, "Addition", _operand1, _operand2, result);
    }

    function subtract(uint256 _operand1, uint256 _operand2) public payable {
        require(msg.value >= 1 ether, "Insufficient payment. Subtract operation requires 1 ETH.");
        balance += msg.value;

        uint256 result = _operand1 - _operand2;
        emit Calculation(msg.sender, "Subtraction", _operand1, _operand2, result);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
