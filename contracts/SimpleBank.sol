// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SimpleBank {
    address payable public owner;
    uint256 public balance;

    event Transaction(uint256 amount, string txnType);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function depositWithdraw(int256 _amount) public payable {
        require(msg.sender == owner, "Only the owner can perform transactions");

        if (_amount > 0) {
            balance += uint256(_amount);
            emit Transaction(uint256(_amount), "Deposit");
        } else {
            uint256 absAmount = uint256(-_amount);
            require(balance >= absAmount, "Insufficient balance");
            balance -= absAmount;
            emit Transaction(absAmount, "Withdraw");
        }
    }
}