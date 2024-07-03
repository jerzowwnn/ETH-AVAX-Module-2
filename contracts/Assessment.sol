// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public totalDonations;

    event DonationReceived(address indexed donor, uint256 amount);

    constructor() {
        owner = payable(msg.sender);
        totalDonations = 0;
    }

    function getTotalDonations() public view returns (uint256) {
        return totalDonations;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation amount must be greater than zero");
        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }
}