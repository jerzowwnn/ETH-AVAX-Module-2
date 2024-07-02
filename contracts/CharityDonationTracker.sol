// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CharityDonationTracker {
    address payable public owner;
    uint256 public totalDonations;

    event DonationReceived(address donor, uint256 amount);

    constructor() payable {
        owner = payable(msg.sender);
    }

    //Get total donations
    function getTotalDonations() public view returns (uint256) {
        return totalDonations;
    }

    //Donate amount
    function donate() public payable {
        require(msg.value > 0, "Donation amount must be greater than zero");

        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }
}
